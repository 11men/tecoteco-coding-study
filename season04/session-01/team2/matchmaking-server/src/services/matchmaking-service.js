import { redis, redisSub } from '../redis-client.js';
import { v4 as uuidv4 } from 'uuid';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lua 스크립트 로드
const tryMatchScript = readFileSync(
  join(__dirname, '../scripts/try-match.lua'),
  'utf-8'
);

// Redis 키 프리픽스
const KEYS = {
  queue: (region) => `mm:q:${region}`,
  user: (userId) => `mm:u:${userId}`,
  match: (matchId) => `mm:m:${matchId}`,
  signal: 'mm:signal',
};

// 기본 설정
const DEFAULT_CONFIG = {
  minN: 4,
  userTTL: 600,      // 10분 (WAITING 상태 TTL)
  maxPopsMultiplier: 3, // minN의 3배까지 pop 시도
};

// 지역별 설정 (확장 가능)
const regionConfig = {
  'SEOUL-01': { minN: 4 },
  'SEOUL-02': { minN: 4 },
  'BUSAN-01': { minN: 3 },
  default: { minN: 4 },
};

/**
 * 지역별 minN 설정 가져오기
 */
function getMinN(region) {
  return (regionConfig[region] || regionConfig.default).minN;
}

/**
 * 대기열에 유저 추가 (enqueue)
 */
async function enqueue(userId, region) {
  const userKey = KEYS.user(userId);
  const queueKey = KEYS.queue(region);

  // 1. 현재 유저 상태 확인
  const existingStatus = await redis.hget(userKey, 'status');
  
  if (existingStatus === 'WAITING') {
    return {
      success: false,
      error: 'ALREADY_WAITING',
      message: '이미 대기 중입니다.',
    };
  }

  // 2. 유저 상태 설정 (WAITING)
  const now = new Date().toISOString();
  await redis.hset(userKey, {
    status: 'WAITING',
    region,
    enqueuedAt: now,
  });
  await redis.expire(userKey, DEFAULT_CONFIG.userTTL);

  // 3. 대기열에 추가
  await redis.rpush(queueKey, userId);

  // 4. 매칭 신호 발행 (워커에게 알림)
  await redis.publish(KEYS.signal, region);

  // 5. 즉시 매칭 시도
  const matchResult = await tryMatch(region);

  if (matchResult && matchResult.members.includes(userId)) {
    return {
      success: true,
      status: 'MATCHED',
      matchId: matchResult.matchId,
      members: matchResult.members,
      region,
    };
  }

  return {
    success: true,
    status: 'WAITING',
    region,
  };
}

/**
 * 대기열에서 유저 제거 (취소)
 */
async function cancel(userId) {
  const userKey = KEYS.user(userId);

  // 유저 상태 확인
  const status = await redis.hget(userKey, 'status');

  if (!status) {
    return {
      success: false,
      error: 'NOT_FOUND',
      message: '대기 중인 유저가 아닙니다.',
    };
  }

  if (status === 'MATCHED') {
    return {
      success: false,
      error: 'ALREADY_MATCHED',
      message: '이미 매칭이 완료되었습니다.',
    };
  }

  if (status === 'CANCELLED') {
    return {
      success: true,
      status: 'CANCELLED',
      message: '이미 취소되었습니다.',
    };
  }

  // Soft cancel: 상태만 변경 (큐에서 직접 제거하지 않음)
  await redis.hset(userKey, 'status', 'CANCELLED');
  await redis.expire(userKey, 60); // 1분 후 자동 정리

  return {
    success: true,
    status: 'CANCELLED',
  };
}

/**
 * 유저 상태 조회
 */
async function getStatus(userId) {
  const userKey = KEYS.user(userId);
  const userData = await redis.hgetall(userKey);

  if (!userData || Object.keys(userData).length === 0) {
    return {
      success: false,
      error: 'NOT_FOUND',
      message: '유저 정보를 찾을 수 없습니다.',
    };
  }

  const result = {
    success: true,
    userId,
    status: userData.status,
    region: userData.region,
    enqueuedAt: userData.enqueuedAt,
  };

  if (userData.status === 'MATCHED') {
    result.matchId = userData.matchId;
    result.matchedAt = userData.matchedAt;

    // 매치 상세 정보도 가져오기
    const matchKey = KEYS.match(userData.matchId);
    const matchData = await redis.hgetall(matchKey);
    if (matchData && matchData.members) {
      result.members = JSON.parse(matchData.members);
    }
  }

  return result;
}

/**
 * 매치 정보 조회
 */
async function getMatch(matchId) {
  const matchKey = KEYS.match(matchId);
  const matchData = await redis.hgetall(matchKey);

  if (!matchData || Object.keys(matchData).length === 0) {
    return {
      success: false,
      error: 'NOT_FOUND',
      message: '매치 정보를 찾을 수 없습니다.',
    };
  }

  return {
    success: true,
    matchId: matchData.matchId,
    region: matchData.region,
    members: JSON.parse(matchData.members),
    createdAt: matchData.createdAt,
  };
}

/**
 * 매칭 시도 (Lua 스크립트 실행)
 */
async function tryMatch(region) {
  const minN = getMinN(region);
  const matchId = uuidv4();
  const maxPops = minN * DEFAULT_CONFIG.maxPopsMultiplier;
  const now = new Date().toISOString();

  try {
    const result = await redis.eval(
      tryMatchScript,
      1,                        // 키 개수
      KEYS.queue(region),       // KEYS[1]
      region,                   // ARGV[1]
      minN.toString(),          // ARGV[2]
      matchId,                  // ARGV[3]
      maxPops.toString(),       // ARGV[4]
      now                       // ARGV[5]
    );

    if (result) {
      const matchResult = JSON.parse(result);
      console.log(`[Match Created] ${matchId} - Region: ${region}, Members: ${matchResult.members.join(', ')}`);
      return matchResult;
    }

    return null;
  } catch (error) {
    console.error('[tryMatch Error]', error);
    return null;
  }
}

/**
 * 지역의 대기열 상태 조회 (디버깅용)
 */
async function getQueueStatus(region) {
  const queueKey = KEYS.queue(region);
  const queueLength = await redis.llen(queueKey);
  const queueMembers = await redis.lrange(queueKey, 0, -1);

  return {
    region,
    minN: getMinN(region),
    queueLength,
    queueMembers,
  };
}

/**
 * 워커: 매칭 신호 구독 및 처리
 */
async function startMatchWorker() {
  console.log('[Worker] Starting match worker...');

  await redisSub.subscribe(KEYS.signal);

  redisSub.on('message', async (channel, region) => {
    if (channel !== KEYS.signal) return;

    console.log(`[Worker] Received signal for region: ${region}`);

    // 연속 매칭 처리: 매칭이 성공하는 동안 계속 시도
    let matchCount = 0;
    let result;
    
    do {
      result = await tryMatch(region);
      if (result) {
        matchCount++;
      }
    } while (result);

    if (matchCount > 0) {
      console.log(`[Worker] Created ${matchCount} matches for region: ${region}`);
    }
  });

  console.log('[Worker] Match worker started, listening for signals...');
}

export {
  enqueue,
  cancel,
  getStatus,
  getMatch,
  tryMatch,
  getQueueStatus,
  startMatchWorker,
  KEYS,
  getMinN,
};
