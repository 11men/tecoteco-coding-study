import express from 'express';
import matchmakingRouter from './routes/matchmaking-router.js';
import { startMatchWorker } from './services/matchmaking-service.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(express.json());

// 요청 로깅
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// 헬스체크
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 매칭 라우터
app.use('/matchmaking', matchmakingRouter);

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: '요청한 리소스를 찾을 수 없습니다.',
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({
    success: false,
    error: 'INTERNAL_ERROR',
    message: '서버 오류가 발생했습니다.',
  });
});

// 서버 시작
async function start() {
  try {
    // 매칭 워커 시작
    await startMatchWorker();

    // HTTP 서버 시작
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🎮 Matchmaking Server Started                            ║
║                                                            ║
║   Port: ${PORT.toString().padEnd(49)}║
║   Time: ${new Date().toISOString().padEnd(45)}║
║                                                            ║
║   Endpoints:                                               ║
║   POST   /matchmaking/enqueue      - 대기열 등록           ║
║   DELETE /matchmaking/enqueue      - 대기 취소             ║
║   GET    /matchmaking/status       - 유저 상태 조회        ║
║   GET    /matchmaking/match/:id    - 매치 정보 조회        ║
║   GET    /matchmaking/queue/:region - 대기열 상태 (관리용) ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
