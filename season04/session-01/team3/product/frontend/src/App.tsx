import { Link } from 'react-router-dom';
import './App.css';

function App() {
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
        <p>2026 버스파업 알림 서비스</p>
      </footer>
    </div>
  );
}

export default App;
