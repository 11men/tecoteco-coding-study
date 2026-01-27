import { Link } from 'react-router-dom';
import { useNotification } from './hooks/useNotification';
import { useStrikes } from './hooks/useStrikes';
import { getStatusText, getStatusColor } from './types/strike';
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

  const { strikes, loading, error } = useStrikes(true);

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
        {/* 뉴스 바로가기 */}
        <section className="card">
          <h2>파업 관련 뉴스</h2>
          <p className="description">최신 파업 소식을 확인하세요</p>
          <Link to="/news" className="btn btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            뉴스 보기
          </Link>
        </section>

        {/* 파업 현황 카드 */}
        <section className="card">
          <h2>현재 파업 현황</h2>
          {loading && <p>파업 정보를 불러오는 중...</p>}
          {error && <p className="error">오류: {error}</p>}
          {!loading && !error && strikes.length === 0 && (
            <p>현재 진행 중이거나 예정된 파업이 없습니다.</p>
          )}
          {!loading && !error && strikes.map((strike) => (
            <div key={strike.id} className="strike-status" style={{ marginBottom: '1rem' }}>
              <div className={`strike-badge ${getStatusColor(strike.status)}`}>
                {getStatusText(strike.status)}
              </div>
              <div className="strike-info">
                <h3>{strike.title}</h3>
                <p>{strike.description}</p>
                <p>
                  <strong>지역:</strong> {strike.affectedRegions.join(', ')} |
                  <strong> 버스:</strong> {strike.busTypes.join(', ')}
                </p>
                <p>
                  <strong>파업 예정:</strong> {new Date(strike.strikeDate).toLocaleString('ko-KR')}
                </p>
                {strike.sourceUrl && (
                  <a
                    href={strike.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    원문 보기 →
                  </a>
                )}
              </div>
            </div>
          ))}
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
        <p>2026 버스파업 알림 서비스</p>
      </footer>
    </div>
  );
}

export default App;
