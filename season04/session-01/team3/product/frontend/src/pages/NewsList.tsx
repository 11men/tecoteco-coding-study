import { Link } from 'react-router-dom';
import { mockNews, type NewsItem } from '../data/mockNews';
import './NewsList.css';

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

export function NewsList() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return '방금 전';
    if (hours < 24) return `${hours}시간 전`;
    return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
  };

  return (
    <div className="news-list">
      <header className="news-header">
        <Link to="/" className="back-btn">← 홈</Link>
        <h1>파업 관련 뉴스</h1>
      </header>

      <div className="news-items">
        {mockNews.map((news) => (
          <Link to={`/news/${news.id}`} key={news.id} className="news-card">
            <div className="news-card-content">
              <span
                className="news-category"
                style={{ backgroundColor: categoryColor[news.category] }}
              >
                {categoryLabel[news.category]}
              </span>
              <h2 className="news-title">{news.title}</h2>
              <p className="news-summary">{news.summary}</p>
              <div className="news-meta">
                <span className="news-source">{news.source}</span>
                <span className="news-date">{formatDate(news.publishedAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
