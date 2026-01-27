import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockNews, type NewsItem } from '../data/mockNews';
import './NewsDetail.css';

const categoryLabel: Record<NewsItem['category'], string> = {
  strike: '파업',
  negotiation: '협상',
  transport: '교통',
  general: '일반',
};

const categoryColor: Record<NewsItem['category'], string> = {
  strike: '#dc2626',
  negotiation: '#f59e0b',
  transport: '#3b82f6',
  general: '#6b7280',
};

export function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const news = mockNews.find((n) => n.id === Number(id));

  if (!news) {
    return (
      <div className="news-detail">
        <header className="detail-header">
          <button onClick={() => navigate(-1)} className="back-btn">← 뒤로</button>
        </header>
        <div className="not-found">
          <h2>기사를 찾을 수 없습니다</h2>
          <Link to="/news">뉴스 목록으로</Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="news-detail">
      <header className="detail-header">
        <button onClick={() => navigate(-1)} className="back-btn">← 뒤로</button>
        <button className="share-btn">공유</button>
      </header>

      <article className="detail-content">
        <span
          className="detail-category"
          style={{ backgroundColor: categoryColor[news.category] }}
        >
          {categoryLabel[news.category]}
        </span>

        <h1 className="detail-title">{news.title}</h1>

        <div className="detail-meta">
          <span className="detail-source">{news.source}</span>
          <span className="detail-date">{formatDate(news.publishedAt)}</span>
        </div>

        <div className="detail-body">
          {news.content.split('\n').map((paragraph, index) => (
            paragraph.trim() && <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      <div className="related-section">
        <h3>관련 뉴스</h3>
        <div className="related-list">
          {mockNews
            .filter((n) => n.id !== news.id && n.category === news.category)
            .slice(0, 3)
            .map((related) => (
              <Link to={`/news/${related.id}`} key={related.id} className="related-item">
                <span className="related-title">{related.title}</span>
                <span className="related-source">{related.source}</span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
