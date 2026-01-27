--[[
  tryMatch Lua Script
  
  원자적으로 minN명을 큐에서 pop하고 매칭을 생성합니다.
  CANCELLED 상태인 유저는 건너뜁니다.
  
  KEYS:
    1: mm:q:{region} - 대기열 리스트
  
  ARGV:
    1: region
    2: minN (최소 매칭 인원)
    3: matchId (새로 생성할 매치 ID)
    4: maxPops (최대 pop 시도 횟수, CANCELLED 유저 대비)
    5: currentTime (ISO timestamp)
  
  RETURN:
    성공: JSON { matchId, members: [userId, ...], region }
    실패: nil
]]

local queueKey = KEYS[1]
local region = ARGV[1]
local minN = tonumber(ARGV[2])
local matchId = ARGV[3]
local maxPops = tonumber(ARGV[4])
local currentTime = ARGV[5]

-- 1. 큐 길이 확인
local queueLen = redis.call('LLEN', queueKey)
if queueLen < minN then
  return nil
end

-- 2. minN명 모으기 (CANCELLED 유저는 스킵)
local members = {}
local pops = 0

while #members < minN and pops < maxPops do
  local userId = redis.call('LPOP', queueKey)
  if not userId then
    break
  end
  pops = pops + 1
  
  -- 유저 상태 확인
  local userKey = 'mm:u:' .. userId
  local status = redis.call('HGET', userKey, 'status')
  
  -- WAITING 상태인 유저만 매칭에 포함
  if status == 'WAITING' then
    table.insert(members, userId)
  end
  -- CANCELLED나 다른 상태는 그냥 버림
end

-- 3. minN명 못 모으면 실패 (pop한 유저들은 복구 불가 - 트레이드오프)
-- 실제로는 pop한 유저를 다시 큐에 넣거나, 트랜잭션으로 처리해야 함
-- 여기서는 단순화를 위해 다시 큐 앞에 넣음
if #members < minN then
  -- 다시 큐 앞에 복구 (LPUSH로 역순으로)
  for i = #members, 1, -1 do
    redis.call('LPUSH', queueKey, members[i])
  end
  return nil
end

-- 4. 매치 생성
local matchKey = 'mm:m:' .. matchId
local membersJson = cjson.encode(members)

redis.call('HSET', matchKey,
  'matchId', matchId,
  'region', region,
  'members', membersJson,
  'createdAt', currentTime
)
-- 매치 정보는 1시간 후 자동 삭제 (TTL)
redis.call('EXPIRE', matchKey, 3600)

-- 5. 각 유저 상태 업데이트
for _, userId in ipairs(members) do
  local userKey = 'mm:u:' .. userId
  redis.call('HSET', userKey,
    'status', 'MATCHED',
    'matchId', matchId,
    'matchedAt', currentTime
  )
  -- 유저 상태도 1시간 TTL
  redis.call('EXPIRE', userKey, 3600)
end

-- 6. 결과 반환
return cjson.encode({
  matchId = matchId,
  members = members,
  region = region
})
