import { Link } from 'react-router-dom';
import { useNotification } from './hooks/useNotification';
import './App.css';

function App() {
  const {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    sendMockStrikeAlert,
    sendMockStrikeStart,
    sendMockStrikeEnd,
    sendMockNegotiation,
  } = useNotification();

  const handleSubscribe = async () => {
    const success = await requestPermission();
    if (success) {
      alert('알림 구독이 완료되었습니다!');
    } else {
      alert('알림 권한이 거부되었습니다. 브라우저 설정에서 알림을 허용해주세요.');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>버스파업 알림</h1>
        <p>서울/경기 버스 파업 실시간 알림 서비스</p>
      </header>

      <main className="main">
        {/* 알림 상태 카드 */}
        <section className="card status-card">
          <h2>알림 상태</h2>
          <div className="status-grid">
            <div className="status-item">
              <span className="label">브라우저 지원</span>
              <span className={`value ${isSupported ? 'success' : 'error'}`}>
                {isSupported ? '지원' : '미지원'}
              </span>
            </div>
            <div className="status-item">
              <span className="label">알림 권한</span>
              <span className={`value ${permission === 'granted' ? 'success' : permission === 'denied' ? 'error' : 'warning'}`}>
                {permission === 'granted' ? '허용' : permission === 'denied' ? '거부' : '대기'}
              </span>
            </div>
            <div className="status-item">
              <span className="label">구독 상태</span>
              <span className={`value ${isSubscribed ? 'success' : 'warning'}`}>
                {isSubscribed ? '구독중' : '미구독'}
              </span>
            </div>
          </div>

          {permission !== 'granted' && (
            <button className="btn btn-primary" onClick={handleSubscribe}>
              알림 구독하기
            </button>
          )}
        </section>

        {/* 테스트 알림 카드 */}
        <section className="card">
          <h2>테스트 알림 보내기</h2>
          <p className="description">
            아래 버튼을 눌러 각 상황별 알림을 테스트해보세요.
          </p>

          <div className="button-grid">
            <button
              className="btn btn-alert"
              onClick={sendMockStrikeAlert}
              disabled={permission !== 'granted'}
            >
              파업 예고 알림
            </button>

            <button
              className="btn btn-danger"
              onClick={sendMockStrikeStart}
              disabled={permission !== 'granted'}
            >
              파업 시작 알림
            </button>

            <button
              className="btn btn-info"
              onClick={sendMockNegotiation}
              disabled={permission !== 'granted'}
            >
              협상 진행 알림
            </button>

            <button
              className="btn btn-success"
              onClick={sendMockStrikeEnd}
              disabled={permission !== 'granted'}
            >
              파업 종료 알림
            </button>
          </div>

          {permission !== 'granted' && (
            <p className="hint">먼저 알림을 구독해주세요</p>
          )}
        </section>

        {/* 뉴스 바로가기 */}
        <section className="card">
          <h2>파업 관련 뉴스</h2>
          <p className="description">최신 파업 소식을 확인하세요</p>
          <Link to="/news" className="btn btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            뉴스 보기
          </Link>
        </section>

        {/* 파업 현황 카드 (목업) */}
        <section className="card">
          <h2>현재 파업 현황</h2>
          <div className="strike-status">
            <div className="strike-badge active">
              파업 중
            </div>
            <div className="strike-info">
              <h3>2026년 1월 서울 시내버스 파업</h3>
              <p>영향 노선: 390개 / 영향 차량: 7,300대</p>
              <p>시작: 2026.01.13 04:00</p>
            </div>
          </div>
        </section>

        {/* 즐겨찾기 노선 (목업) */}
        <section className="card">
          <h2>내 즐겨찾기 노선</h2>
          <div className="route-list">
            <div className="route-item affected">
              <span className="route-number">143</span>
              <span className="route-status">운행중단</span>
            </div>
            <div className="route-item affected">
              <span className="route-number">240</span>
              <span className="route-status">운행중단</span>
            </div>
            <div className="route-item normal">
              <span className="route-number">마을01</span>
              <span className="route-status">정상운행</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>PWA 알림 테스트 v1.0</p>
        <p>2026 버스파업 알림 서비스</p>
      </footer>
    </div>
  );
}

export default App;
