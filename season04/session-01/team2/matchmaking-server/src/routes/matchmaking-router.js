import { Router } from 'express';
import {
  enqueue,
  cancel,
  getStatus,
  getMatch,
  getQueueStatus,
  getMinN,
} from '../services/matchmaking-service.js';

const router = Router();

/**
 * POST /matchmaking/enqueue
 * 대기열에 유저 추가
 * 
 * Body: { userId: string, region: string }
 */
router.post('/enqueue', async (req, res) => {
  try {
    const { userId, region } = req.body;

    // 유효성 검사
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'INVALID_REQUEST',
        message: 'userId는 필수입니다.',
      });
    }

    if (!region || typeof region !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'INVALID_REQUEST',
        message: 'region은 필수입니다.',
      });
    }

    const result = await enqueue(userId, region);

    if (!result.success && result.error === 'ALREADY_WAITING') {
      return res.status(409).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('[POST /enqueue] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: '서버 오류가 발생했습니다.',
    });
  }
});

/**
 * DELETE /matchmaking/enqueue
 * 대기 취소
 * 
 * Body: { userId: string }
 */
router.delete('/enqueue', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'INVALID_REQUEST',
        message: 'userId는 필수입니다.',
      });
    }

    const result = await cancel(userId);

    if (!result.success) {
      if (result.error === 'NOT_FOUND') {
        return res.status(404).json(result);
      }
      if (result.error === 'ALREADY_MATCHED') {
        return res.status(409).json(result);
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('[DELETE /enqueue] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: '서버 오류가 발생했습니다.',
    });
  }
});

/**
 * GET /matchmaking/status
 * 유저 상태 조회
 * 
 * Query: userId
 */
router.get('/status', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'INVALID_REQUEST',
        message: 'userId는 필수입니다.',
      });
    }

    const result = await getStatus(userId);

    if (!result.success && result.error === 'NOT_FOUND') {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('[GET /status] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: '서버 오류가 발생했습니다.',
    });
  }
});

/**
 * GET /matchmaking/match/:matchId
 * 매치 정보 조회
 */
router.get('/match/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;

    const result = await getMatch(matchId);

    if (!result.success && result.error === 'NOT_FOUND') {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('[GET /match/:matchId] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: '서버 오류가 발생했습니다.',
    });
  }
});

/**
 * GET /matchmaking/queue/:region
 * 지역 대기열 상태 조회 (디버깅/관리용)
 */
router.get('/queue/:region', async (req, res) => {
  try {
    const { region } = req.params;

    const result = await getQueueStatus(region);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('[GET /queue/:region] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: '서버 오류가 발생했습니다.',
    });
  }
});

/**
 * GET /matchmaking/config/:region
 * 지역별 설정 조회
 */
router.get('/config/:region', async (req, res) => {
  try {
    const { region } = req.params;

    return res.status(200).json({
      success: true,
      region,
      minN: getMinN(region),
    });
  } catch (error) {
    console.error('[GET /config/:region] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: '서버 오류가 발생했습니다.',
    });
  }
});

export default router;
