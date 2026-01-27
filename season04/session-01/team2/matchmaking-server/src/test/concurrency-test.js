/**
 * 동시성 테스트 스크립트
 * 
 * 여러 유저가 동시에 대기열에 들어오는 상황을 시뮬레이션합니다.
 * 
 * 실행 방법:
 * 1. Redis 실행: docker run -p 6379:6379 redis
 * 2. 서버 실행: npm start
 * 3. 테스트 실행: npm test
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function enqueue(userId, region) {
  const response = await fetch(`${BASE_URL}/matchmaking/enqueue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, region }),
  });
  return response.json();
}

async function cancel(userId) {
  const response = await fetch(`${BASE_URL}/matchmaking/enqueue`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  return response.json();
}

async function getStatus(userId) {
  const response = await fetch(`${BASE_URL}/matchmaking/status?userId=${userId}`);
  return response.json();
}

async function getQueueStatus(region) {
  const response = await fetch(`${BASE_URL}/matchmaking/queue/${region}`);
  return response.json();
}

// 딜레이 헬퍼
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 테스트 케이스들
const tests = {
  /**
   * 테스트 1: 기본 매칭 테스트
   * 4명이 순차적으로 대기열에 등록하면 매칭이 생성되어야 함
   */
  async basicMatching() {
    console.log('\n=== Test 1: Basic Matching ===');
    const region = 'SEOUL-01';
    const users = ['user-basic-1', 'user-basic-2', 'user-basic-3', 'user-basic-4'];

    for (const userId of users) {
      const result = await enqueue(userId, region);
      console.log(`[${userId}] Status: ${result.status}`, result.matchId ? `Match: ${result.matchId}` : '');
    }

    // 마지막 유저 상태 확인
    const lastStatus = await getStatus(users[3]);
    console.log(`Final status for ${users[3]}:`, lastStatus);

    const success = lastStatus.status === 'MATCHED' && lastStatus.members?.length === 4;
    console.log(`Test 1: ${success ? '✅ PASSED' : '❌ FAILED'}`);
    return success;
  },

  /**
   * 테스트 2: 동시 등록 테스트
   * 20명이 동시에 등록하면 5개의 매칭이 생성되어야 함
   */
  async concurrentEnqueue() {
    console.log('\n=== Test 2: Concurrent Enqueue (20 users) ===');
    const region = 'SEOUL-02';
    const users = Array.from({ length: 20 }, (_, i) => `user-concurrent-${i}`);

    // 모든 유저 동시 등록
    const results = await Promise.all(users.map(userId => enqueue(userId, region)));

    const matched = results.filter(r => r.status === 'MATCHED');
    const waiting = results.filter(r => r.status === 'WAITING');

    console.log(`Immediate Matched: ${matched.length}, Waiting: ${waiting.length}`);

    // 잠시 대기 후 상태 확인 (워커가 처리할 시간)
    await delay(500);

    // 모든 유저의 최종 상태 확인
    const finalStatuses = await Promise.all(users.map(userId => getStatus(userId)));
    const finalMatched = finalStatuses.filter(s => s.status === 'MATCHED');

    console.log(`Final Matched: ${finalMatched.length}/${users.length}`);

    // 유니크한 매치 ID 수 확인
    const uniqueMatchIds = new Set(finalMatched.map(s => s.matchId));
    console.log(`Unique matches created: ${uniqueMatchIds.size}`);

    const success = finalMatched.length === 20 && uniqueMatchIds.size === 5;
    console.log(`Test 2: ${success ? '✅ PASSED' : '❌ FAILED'}`);
    return success;
  },

  /**
   * 테스트 3: 취소 테스트
   * 등록 후 취소하면 매칭에서 제외되어야 함
   */
  async cancelTest() {
    console.log('\n=== Test 3: Cancel Test ===');
    const region = 'BUSAN-01';
    const users = ['user-cancel-1', 'user-cancel-2', 'user-cancel-3'];

    // 3명 등록 (minN=3이면 바로 매칭될 수 있음, minN=4라면 대기)
    for (const userId of users) {
      await enqueue(userId, region);
    }

    // 첫 번째 유저 취소
    const cancelResult = await cancel(users[0]);
    console.log(`Cancel result for ${users[0]}:`, cancelResult);

    // 4번째 유저 등록
    const result4 = await enqueue('user-cancel-4', region);
    console.log(`user-cancel-4 status:`, result4.status);

    await delay(500);

    // 취소된 유저는 매칭되면 안 됨
    const cancelledStatus = await getStatus(users[0]);
    console.log(`Cancelled user status:`, cancelledStatus.status);

    const success = cancelledStatus.status === 'CANCELLED';
    console.log(`Test 3: ${success ? '✅ PASSED' : '❌ FAILED'}`);
    return success;
  },

  /**
   * 테스트 4: 중복 등록 방지 테스트
   */
  async duplicateTest() {
    console.log('\n=== Test 4: Duplicate Enqueue Test ===');
    const region = 'SEOUL-01';
    const userId = 'user-duplicate-test';

    // 첫 번째 등록
    const result1 = await enqueue(userId, region);
    console.log('First enqueue:', result1);

    // 중복 등록 시도
    const result2 = await enqueue(userId, region);
    console.log('Second enqueue:', result2);

    const success = result1.success === true && result2.success === false && result2.error === 'ALREADY_WAITING';
    console.log(`Test 4: ${success ? '✅ PASSED' : '❌ FAILED'}`);
    return success;
  },

  /**
   * 테스트 5: 폭주 테스트
   * 100명이 동시에 등록
   */
  async burstTest() {
    console.log('\n=== Test 5: Burst Test (100 users) ===');
    const region = 'SEOUL-BURST';
    const users = Array.from({ length: 100 }, (_, i) => `user-burst-${i}`);

    const startTime = Date.now();

    // 모든 유저 동시 등록
    const results = await Promise.all(users.map(userId => enqueue(userId, region)));

    const enqueueTime = Date.now() - startTime;
    console.log(`Enqueue time for 100 users: ${enqueueTime}ms`);

    // 워커가 처리할 시간 대기
    await delay(1000);

    // 최종 상태 확인
    const finalStatuses = await Promise.all(users.map(userId => getStatus(userId)));
    const finalMatched = finalStatuses.filter(s => s.status === 'MATCHED');

    const uniqueMatchIds = new Set(finalMatched.map(s => s.matchId));
    console.log(`Final Matched: ${finalMatched.length}/100`);
    console.log(`Unique matches created: ${uniqueMatchIds.size}`);

    const success = finalMatched.length === 100 && uniqueMatchIds.size === 25;
    console.log(`Test 5: ${success ? '✅ PASSED' : '❌ FAILED'}`);
    return success;
  },
};

// 테스트 실행
async function runTests() {
  console.log('🧪 Starting Matchmaking Tests...');
  console.log(`Base URL: ${BASE_URL}`);

  const results = [];

  try {
    // 서버 헬스체크
    const health = await fetch(`${BASE_URL}/health`);
    if (!health.ok) {
      console.error('❌ Server is not running. Please start the server first.');
      process.exit(1);
    }
    console.log('✅ Server is healthy');

    // 테스트 실행
    for (const [name, testFn] of Object.entries(tests)) {
      try {
        const result = await testFn();
        results.push({ name, result });
      } catch (error) {
        console.error(`❌ ${name} failed with error:`, error.message);
        results.push({ name, result: false, error: error.message });
      }
    }

    // 결과 요약
    console.log('\n═══════════════════════════════════');
    console.log('          TEST RESULTS SUMMARY');
    console.log('═══════════════════════════════════');

    const passed = results.filter(r => r.result).length;
    const failed = results.filter(r => !r.result).length;

    for (const { name, result } of results) {
      console.log(`${result ? '✅' : '❌'} ${name}`);
    }

    console.log('───────────────────────────────────');
    console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
    console.log('═══════════════════════════════════\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Test runner failed:', error);
    process.exit(1);
  }
}

runTests();
