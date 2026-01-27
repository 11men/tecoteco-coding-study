# 크롤링 시스템 구현 가이드

## 목차

1. [환경 설정](#1-환경-설정)
2. [프로젝트 구조](#2-프로젝트-구조)
3. [Step-by-Step 구현](#3-step-by-step-구현)
4. [테스트](#4-테스트)
5. [배포](#5-배포)
6. [트러블슈팅](#6-트러블슈팅)

---

## 1. 환경 설정

### 1.1 필수 도구 설치

```bash
# Node.js 18+ 설치 확인
node --version  # v18.0.0 이상

# PostgreSQL 설치 (Docker 권장)
docker run -d \
  --name postgres \
  -e POSTGRES_USER=busstrike \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=busstrike \
  -p 5432:5432 \
  postgres:15

# Redis 설치 (Docker)
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7-alpine
```

### 1.2 프로젝트 초기화

```bash
# 프로젝트 디렉토리 생성
mkdir busstrike-crawler
cd busstrike-crawler

# package.json 초기화
npm init -y

# 의존성 설치
npm install \
  playwright \
  cheerio \
  axios \
  node-cron \
  pg \
  redis \
  winston \
  dotenv

# 개발 의존성
npm install -D \
  @types/node \
  typescript \
  ts-node \
  @types/jest \
  jest \
  nodemon
```

### 1.3 환경 변수 설정

```bash
# .env 파일 생성
cat > .env << EOF
# Database
DATABASE_URL=postgresql://busstrike:password@localhost:5432/busstrike

# Redis
REDIS_URL=redis://localhost:6379

# Crawler Settings
CRAWLER_INTERVAL_TIER1=30  # minutes (realistic interval)
CRAWLER_INTERVAL_TIER2=120 # 2 hours for news

# Playwright
PLAYWRIGHT_HEADLESS=true

# Logging
LOG_LEVEL=info

# Notification (나중에 구현)
FCM_SERVER_KEY=
SLACK_WEBHOOK_URL=
EOF
```

### 1.4 TypeScript 설정

```bash
# tsconfig.json 생성
cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
```

---

## 2. 프로젝트 구조

```
busstrike-crawler/
├── src/
│   ├── crawlers/           # 크롤러 구현
│   │   ├── base.ts
│   │   ├── topis.ts
│   │   ├── gbis.ts
│   │   └── index.ts
│   ├── services/           # 비즈니스 로직
│   │   ├── strike.ts       # 파업 정보 처리
│   │   ├── notification.ts # 알림 발송
│   │   └── index.ts
│   ├── models/             # 데이터 모델
│   │   ├── database.ts     # DB 연결
│   │   ├── crawl-source.ts
│   │   ├── raw-notice.ts
│   │   └── strike-event.ts
│   ├── utils/              # 유틸리티
│   │   ├── logger.ts
│   │   ├── redis.ts
│   │   └── hash.ts
│   ├── scheduler.ts        # 크롤러 스케줄러
│   ├── app.ts              # Admin API
│   └── index.ts            # 진입점
├── tests/                  # 테스트
│   ├── crawlers/
│   └── services/
├── scripts/                # 스크립트
│   ├── init-db.sql
│   └── seed-sources.sql
├── .env
├── tsconfig.json
└── package.json
```

---

## 3. Step-by-Step 구현

### Step 1: 데이터베이스 초기화

```bash
# scripts/init-db.sql
cat > scripts/init-db.sql << 'EOF'
-- 테이블 생성
CREATE TABLE crawl_sources (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('official', 'news', 'sns')),
    priority INT NOT NULL CHECK (priority BETWEEN 1 AND 3),
    interval_minutes INT NOT NULL DEFAULT 10,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_crawled_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE crawl_logs (
    id VARCHAR(50) PRIMARY KEY,
    source_id VARCHAR(50) NOT NULL REFERENCES crawl_sources(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed', 'partial')),
    items_found INT NOT NULL DEFAULT 0,
    items_processed INT NOT NULL DEFAULT 0,
    error_message TEXT,
    duration_ms INT,
    crawled_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE raw_notices (
    id VARCHAR(50) PRIMARY KEY,
    source_id VARCHAR(50) NOT NULL REFERENCES crawl_sources(id),
    crawl_log_id VARCHAR(50) REFERENCES crawl_logs(id),
    title TEXT NOT NULL,
    content TEXT,
    url TEXT,
    category VARCHAR(50),
    published_at TIMESTAMP,
    views INT,
    has_attachment BOOLEAN DEFAULT false,
    content_hash VARCHAR(32) NOT NULL,
    metadata JSONB,
    crawled_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (source_id, content_hash)
);

CREATE TABLE strike_events (
    id VARCHAR(50) PRIMARY KEY,
    raw_notice_id VARCHAR(50) REFERENCES raw_notices(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    affected_regions TEXT[] DEFAULT '{}',
    affected_companies TEXT[] DEFAULT '{}',
    affected_route_count INT DEFAULT 0,
    source VARCHAR(50) NOT NULL,
    source_url TEXT,
    confidence_score DECIMAL(3,2),
    detected_at TIMESTAMP NOT NULL DEFAULT NOW(),
    confirmed_at TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_crawl_logs_source ON crawl_logs(source_id);
CREATE INDEX idx_raw_notices_hash ON raw_notices(content_hash);
CREATE INDEX idx_strike_events_status ON strike_events(status);
EOF

# DB 초기화 실행
docker exec -i postgres psql -U busstrike -d busstrike < scripts/init-db.sql

# 초기 데이터 입력
cat > scripts/seed-sources.sql << 'EOF'
INSERT INTO crawl_sources (id, name, url, type, priority, interval_minutes) VALUES
('topis', 'TOPIS', 'https://topis.seoul.go.kr/notice/openNoticeList.do', 'official', 1, 10),
('gbis', 'GBIS', 'https://www.gbis.go.kr/gbis2014/bbs.action?cmd=notice', 'official', 1, 10),
('ictr', 'ICTR', 'https://www.ictr.or.kr/board/notice.do', 'official', 1, 30);
EOF

docker exec -i postgres psql -U busstrike -d busstrike < scripts/seed-sources.sql
```

### Step 2: 기본 유틸리티 구현

```typescript
// src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/crawler.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

```typescript
// src/utils/redis.ts
import { createClient } from 'redis';
import { logger } from './logger';

class RedisClient {
  private client;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL
    });

    this.client.on('error', (err) => logger.error('Redis error:', err));
  }

  async connect() {
    await this.client.connect();
    logger.info('Redis connected');
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async setNX(key: string, value: string, ttl: number): Promise<boolean> {
    const result = await this.client.set(key, value, {
      NX: true,
      EX: ttl
    });
    return result === 'OK';
  }
}

export const redis = new RedisClient();
```

```typescript
// src/utils/hash.ts
import crypto from 'crypto';

export function generateHash(text: string): string {
  return crypto.createHash('md5').update(text).digest('hex');
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
```

### Step 3: 데이터베이스 모델

```typescript
// src/models/database.ts
import { Pool } from 'pg';
import { logger } from '../utils/logger';

class Database {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      logger.error('Unexpected database error:', err);
    });
  }

  async query(text: string, params?: any[]) {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      logger.debug('Executed query', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      logger.error('Database query error', { text, error });
      throw error;
    }
  }

  async transaction(callback: (client: any) => Promise<void>) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await callback(client);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export const db = new Database();
```

```typescript
// src/models/raw-notice.ts
import { db } from './database';
import { generateId, generateHash } from '../utils/hash';

export interface RawNotice {
  id: string;
  sourceId: string;
  crawlLogId?: string;
  title: string;
  content?: string;
  url?: string;
  category?: string;
  publishedAt?: Date;
  views?: number;
  hasAttachment?: boolean;
  contentHash: string;
  metadata?: any;
  crawledAt: Date;
}

export class RawNoticeModel {
  async create(notice: Omit<RawNotice, 'id' | 'crawledAt'>): Promise<RawNotice> {
    const id = generateId('notice');
    const result = await db.query(
      `INSERT INTO raw_notices
       (id, source_id, crawl_log_id, title, content, url, category,
        published_at, views, has_attachment, content_hash, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        id, notice.sourceId, notice.crawlLogId, notice.title, notice.content,
        notice.url, notice.category, notice.publishedAt, notice.views,
        notice.hasAttachment, notice.contentHash, JSON.stringify(notice.metadata)
      ]
    );
    return result.rows[0];
  }

  async findByHash(sourceId: string, hash: string): Promise<RawNotice | null> {
    const result = await db.query(
      'SELECT * FROM raw_notices WHERE source_id = $1 AND content_hash = $2',
      [sourceId, hash]
    );
    return result.rows[0] || null;
  }

  async findByKeyword(keyword: string, limit = 20): Promise<RawNotice[]> {
    const result = await db.query(
      `SELECT * FROM raw_notices
       WHERE title ILIKE $1 OR content ILIKE $1
       ORDER BY published_at DESC
       LIMIT $2`,
      [`%${keyword}%`, limit]
    );
    return result.rows;
  }
}

export const rawNoticeModel = new RawNoticeModel();
```

### Step 4: 크롤러 구현

```typescript
// src/crawlers/base.ts
import { chromium, Browser, Page } from 'playwright';
import { logger } from '../utils/logger';

export interface CrawlResult {
  sourceId: string;
  items: any[];
  duration: number;
  error?: string;
}

export abstract class BaseCrawler {
  protected sourceId: string;
  protected sourceName: string;
  protected baseUrl: string;
  protected browser: Browser | null = null;

  constructor(sourceId: string, sourceName: string, baseUrl: string) {
    this.sourceId = sourceId;
    this.sourceName = sourceName;
    this.baseUrl = baseUrl;
  }

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({
      headless: process.env.PLAYWRIGHT_HEADLESS !== 'false'
    });
    logger.info(`${this.sourceName} crawler initialized`);
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  abstract crawl(): Promise<CrawlResult>;

  protected async createPage(): Promise<Page> {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }
    return await this.browser.newPage();
  }
}
```

```typescript
// src/crawlers/topis.ts
import { BaseCrawler, CrawlResult } from './base';
import { logger } from '../utils/logger';

export class TOPISCrawler extends BaseCrawler {
  constructor() {
    super('topis', 'TOPIS', 'https://topis.seoul.go.kr/notice/openNoticeList.do');
  }

  async crawl(): Promise<CrawlResult> {
    const startTime = Date.now();
    const items: any[] = [];

    try {
      const page = await this.createPage();
      await page.goto(this.baseUrl, { waitUntil: 'networkidle', timeout: 30000 });

      // 버스안내 탭 클릭
      const busTab = page.locator('a:has-text("버스안내")');
      if (await busTab.count() > 0) {
        await busTab.click();
        await page.waitForTimeout(2000);
      }

      // 공지사항 목록 추출
      const notices = await page.$$eval('table tbody tr', (rows) => {
        return rows.map(row => {
          const cells = row.querySelectorAll('td');
          return {
            number: cells[0]?.textContent?.trim() || '',
            title: cells[1]?.querySelector('a')?.textContent?.trim() || '',
            link: cells[1]?.querySelector('a')?.getAttribute('href') || '',
            hasAttachment: !!cells[2]?.querySelector('img'),
            date: cells[3]?.textContent?.trim() || '',
            views: parseInt(cells[4]?.textContent?.trim() || '0', 10)
          };
        });
      });

      // 파업 관련 키워드 필터링
      const strikeKeywords = ['파업', '운행중단', '노사협상', '단체교섭'];
      const filteredNotices = notices.filter(notice =>
        strikeKeywords.some(keyword => notice.title.includes(keyword))
      );

      logger.info(`TOPIS: Found ${notices.length} notices, ${filteredNotices.length} strike-related`);

      // 상세 내용 가져오기 (필터링된 것만)
      for (const notice of filteredNotices) {
        try {
          const detailLink = page.locator(`a:has-text("${notice.title}")`).first();
          await detailLink.click();
          await page.waitForTimeout(1000);

          const content = await page.$eval('.content', el => el.textContent || '');

          items.push({
            ...notice,
            content: content.trim(),
            sourceId: this.sourceId,
            sourceName: this.sourceName
          });

          await page.goBack();
          await page.waitForTimeout(500);
        } catch (error) {
          logger.error(`Failed to get detail for: ${notice.title}`, error);
        }
      }

      await page.close();

      return {
        sourceId: this.sourceId,
        items,
        duration: Date.now() - startTime
      };

    } catch (error: any) {
      logger.error(`TOPIS crawl failed:`, error);
      return {
        sourceId: this.sourceId,
        items,
        duration: Date.now() - startTime,
        error: error.message
      };
    }
  }
}
```

```typescript
// src/crawlers/gbis.ts
import { BaseCrawler, CrawlResult } from './base';
import { logger } from '../utils/logger';

export class GBISCrawler extends BaseCrawler {
  constructor() {
    super('gbis', 'GBIS', 'https://www.gbis.go.kr/gbis2014/bbs.action?cmd=notice');
  }

  async crawl(): Promise<CrawlResult> {
    const startTime = Date.now();
    const items: any[] = [];

    try {
      const page = await this.createPage();
      await page.goto(this.baseUrl, { waitUntil: 'networkidle', timeout: 30000 });

      // 시내버스공지 필터 선택 (있는 경우)
      try {
        const categorySelect = page.locator('select[name="category"]');
        if (await categorySelect.count() > 0) {
          await categorySelect.selectOption('시내버스공지');
          await page.click('button[type="submit"]');
          await page.waitForTimeout(2000);
        }
      } catch (error) {
        logger.warn('GBIS: Category filter not found, continuing...');
      }

      // 공지사항 목록 추출
      const notices = await page.$$eval('table tbody tr', (rows) => {
        return rows.map(row => {
          const cells = row.querySelectorAll('td');
          return {
            number: cells[0]?.textContent?.trim() || '',
            title: cells[1]?.textContent?.trim() || '',
            category: cells[2]?.textContent?.trim() || '',
            date: cells[3]?.textContent?.trim() || '',
            views: parseInt(cells[4]?.textContent?.trim() || '0', 10)
          };
        });
      });

      // 파업 관련 필터링
      const strikeKeywords = ['파업', '운행중단', '버스운행'];
      const filteredNotices = notices.filter(notice =>
        strikeKeywords.some(keyword => notice.title.includes(keyword))
      );

      logger.info(`GBIS: Found ${notices.length} notices, ${filteredNotices.length} strike-related`);

      items.push(...filteredNotices.map(notice => ({
        ...notice,
        sourceId: this.sourceId,
        sourceName: this.sourceName
      })));

      await page.close();

      return {
        sourceId: this.sourceId,
        items,
        duration: Date.now() - startTime
      };

    } catch (error: any) {
      logger.error(`GBIS crawl failed:`, error);
      return {
        sourceId: this.sourceId,
        items,
        duration: Date.now() - startTime,
        error: error.message
      };
    }
  }
}
```

### Step 5: 파업 정보 처리 서비스

```typescript
// src/services/strike.ts
import { rawNoticeModel } from '../models/raw-notice';
import { db } from '../models/database';
import { generateId, generateHash } from '../utils/hash';
import { redis } from '../utils/redis';
import { logger } from '../utils/logger';

export class StrikeService {
  async processNotice(crawlLogId: string, sourceId: string, notice: any): Promise<void> {
    const contentHash = generateHash(notice.title + notice.date);

    // Redis 중복 체크 (원본 공지 중복만 체크)
    const cacheKey = `notice:${sourceId}:${contentHash}`;
    const exists = await redis.get(cacheKey);

    if (exists) {
      logger.debug(`Notice already processed: ${notice.title}`);
      return;
    }

    // DB에 원본 공지 저장
    const rawNotice = await rawNoticeModel.create({
      sourceId,
      crawlLogId,
      title: notice.title,
      content: notice.content,
      url: notice.link || notice.url,
      category: notice.category,
      publishedAt: this.parseDate(notice.date),
      views: notice.views,
      hasAttachment: notice.hasAttachment || false,
      contentHash,
      metadata: notice
    });

    // Redis 캐시 (24시간)
    await redis.set(cacheKey, '1', 86400);

    // 파업 정보 추출
    const strikeInfo = this.extractStrikeInfo(notice);

    if (strikeInfo.isStrike) {
      // 기존 파업 이벤트 찾기 (제목 유사도 기반)
      const existingStrike = await this.findSimilarStrikeEvent(strikeInfo);

      if (existingStrike) {
        // 기존 파업 업데이트 및 변경사항 감지
        await this.updateStrikeEventIfChanged(existingStrike, strikeInfo, rawNotice.id, sourceId);
      } else {
        // 신규 파업 이벤트 생성 및 알림
        await this.createStrikeEvent(rawNotice.id, strikeInfo, sourceId, true);
      }
    }
  }

  private extractStrikeInfo(notice: any) {
    const text = (notice.title + ' ' + (notice.content || '')).toLowerCase();
    const originalText = notice.title + ' ' + (notice.content || '');

    // 키워드 기반 파업 감지
    const strikeKeywords = ['파업', '운행중단', '노사협상 결렬'];
    const isStrike = strikeKeywords.some(keyword => text.includes(keyword));

    if (!isStrike) {
      return { isStrike: false };
    }

    // 1. 지역 추출 (서울/경기)
    const regions: string[] = [];
    if (text.includes('서울')) regions.push('seoul');
    if (text.includes('경기')) regions.push('gyeonggi');
    if (text.includes('인천')) regions.push('incheon');

    // 2. 버스 타입 추출 (시내버스/시외버스)
    const busTypes: string[] = [];
    if (text.includes('시내버스') || text.includes('시내 버스')) busTypes.push('city');
    if (text.includes('시외버스') || text.includes('시외 버스') || text.includes('광역')) busTypes.push('intercity');

    // 기본값: 명시 안 되면 시내버스로 간주
    if (busTypes.length === 0) busTypes.push('city');

    // 3. 날짜 추출
    const datePattern = /(\d{1,2})월\s*(\d{1,2})일/g;
    const dates = [...originalText.matchAll(datePattern)];
    const strikeDate = dates[0] ? this.parseExtractedDate(dates[0]) : null;

    // 4. 시간 추출 (오전/오후 포함)
    const timePattern = /(오전|오후)?\s*(\d{1,2})\s*시/g;
    const times = [...originalText.matchAll(timePattern)];
    let strikeTime = null;

    if (times.length > 0) {
      const timeMatch = times[0];
      let hour = parseInt(timeMatch[2]);
      if (timeMatch[1] === '오후' && hour < 12) hour += 12;
      if (timeMatch[1] === '오전' && hour === 12) hour = 0;
      strikeTime = `${hour.toString().padStart(2, '0')}:00:00`;
    }

    // 5. 상태 판단 (예고/파업중/파업중단)
    let status = 'scheduled'; // 기본값: 예고

    if (text.includes('파업중단') || text.includes('파업 중단') || text.includes('파업 철회')) {
      status = 'cancelled';
    } else if (text.includes('파업 돌입') || text.includes('파업 시작') || text.includes('파업 중')) {
      status = 'ongoing';
    } else if (text.includes('파업 예정') || text.includes('파업 계획') || text.includes('파업 예고')) {
      status = 'scheduled';
    }

    return {
      isStrike: true,
      title: notice.title,
      regions,
      busTypes,
      strikeDate,
      strikeTime,
      status,
      sourceUrl: notice.link || notice.url
    };
  }

  private async findSimilarStrikeEvent(strikeInfo: any): Promise<any> {
    // 같은 날짜, 같은 지역의 파업 이벤트 찾기
    const result = await db.query(
      `SELECT * FROM strike_events
       WHERE strike_date = $1
       AND affected_regions && $2
       AND status != 'ended'
       ORDER BY detected_at DESC
       LIMIT 1`,
      [strikeInfo.strikeDate, strikeInfo.regions]
    );

    return result.rows[0] || null;
  }

  private async updateStrikeEventIfChanged(
    existingStrike: any,
    newInfo: any,
    rawNoticeId: string,
    source: string
  ) {
    let hasChanges = false;
    const changes: string[] = [];

    // 상태 변경 체크
    if (existingStrike.status !== newInfo.status) {
      hasChanges = true;
      changes.push(`status: ${existingStrike.status} → ${newInfo.status}`);
    }

    // 시간 변경 체크
    if (existingStrike.strike_time !== newInfo.strikeTime) {
      hasChanges = true;
      changes.push(`time: ${existingStrike.strike_time} → ${newInfo.strikeTime}`);
    }

    // 지역 변경 체크
    const oldRegions = existingStrike.affected_regions || [];
    const newRegions = newInfo.regions || [];
    if (JSON.stringify(oldRegions.sort()) !== JSON.stringify(newRegions.sort())) {
      hasChanges = true;
      changes.push(`regions: ${oldRegions.join(',')} → ${newRegions.join(',')}`);
    }

    // 버스 타입 변경 체크
    const oldBusTypes = existingStrike.bus_types || [];
    const newBusTypes = newInfo.busTypes || [];
    if (JSON.stringify(oldBusTypes.sort()) !== JSON.stringify(newBusTypes.sort())) {
      hasChanges = true;
      changes.push(`busTypes: ${oldBusTypes.join(',')} → ${newBusTypes.join(',')}`);
    }

    if (hasChanges) {
      // 업데이트
      await db.query(
        `UPDATE strike_events
         SET status = $1,
             strike_time = $2,
             affected_regions = $3,
             bus_types = $4,
             raw_notice_id = $5,
             source = $6,
             last_updated_at = NOW()
         WHERE id = $7`,
        [
          newInfo.status,
          newInfo.strikeTime,
          newInfo.regions,
          newInfo.busTypes,
          rawNoticeId,
          source,
          existingStrike.id
        ]
      );

      logger.info(`Strike event updated: ${existingStrike.id}`);
      logger.info(`Changes: ${changes.join(', ')}`);

      // 🔔 업데이트 알림 발송
      await this.sendNotification(existingStrike.id, 'update', changes);
    }
  }

  private async createStrikeEvent(
    rawNoticeId: string,
    strikeInfo: any,
    source: string,
    sendNotification: boolean = false
  ) {
    const id = generateId('strike');

    const startDatetime = strikeInfo.strikeDate && strikeInfo.strikeTime
      ? new Date(`${strikeInfo.strikeDate.toISOString().split('T')[0]} ${strikeInfo.strikeTime}`)
      : strikeInfo.strikeDate;

    await db.query(
      `INSERT INTO strike_events
       (id, raw_notice_id, title, status, strike_date, strike_time,
        start_datetime, affected_regions, bus_types, source, source_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        id,
        rawNoticeId,
        strikeInfo.title,
        strikeInfo.status,
        strikeInfo.strikeDate,
        strikeInfo.strikeTime,
        startDatetime,
        strikeInfo.regions,
        strikeInfo.busTypes,
        source,
        strikeInfo.sourceUrl
      ]
    );

    logger.info(`Strike event created: ${id} (status: ${strikeInfo.status})`);

    // 🔔 신규 파업 알림 발송
    if (sendNotification) {
      await this.sendNotification(id, 'new');
    }
  }

  private async sendNotification(strikeEventId: string, type: 'new' | 'update', changes?: string[]) {
    // 파업 이벤트 정보 가져오기
    const result = await db.query(
      'SELECT * FROM strike_events WHERE id = $1',
      [strikeEventId]
    );

    if (result.rows.length === 0) return;

    const strike = result.rows[0];

    // FCM 알림 메시지 구성
    const message = {
      notification: {
        title: type === 'new'
          ? `[${this.formatRegions(strike.affected_regions)}] 버스 파업 ${this.formatStatus(strike.status)}`
          : `[${this.formatRegions(strike.affected_regions)}] 파업 정보 업데이트`,
        body: type === 'new'
          ? `${strike.strike_date} ${strike.strike_time || ''} - ${this.formatBusTypes(strike.bus_types)}`
          : `변경사항: ${changes?.join(', ')}`
      },
      data: {
        type: type === 'new' ? 'strike_created' : 'strike_updated',
        strikeId: strike.id,
        status: strike.status,
        regions: JSON.stringify(strike.affected_regions),
        busTypes: JSON.stringify(strike.bus_types),
        strikeDate: strike.strike_date?.toString() || '',
        strikeTime: strike.strike_time || '',
        changes: type === 'update' ? JSON.stringify(changes) : ''
      }
    };

    // TODO: FCM 발송 구현
    // await admin.messaging().send(message);

    logger.info(`Notification queued for strike ${strikeEventId}: ${type}`);
  }

  private formatRegions(regions: string[]): string {
    const map: any = { seoul: '서울', gyeonggi: '경기', incheon: '인천' };
    return regions.map(r => map[r] || r).join('/');
  }

  private formatBusTypes(busTypes: string[]): string {
    const map: any = { city: '시내버스', intercity: '시외버스' };
    return busTypes.map(t => map[t] || t).join('/');
  }

  private formatStatus(status: string): string {
    const map: any = {
      scheduled: '예고',
      ongoing: '파업중',
      cancelled: '파업중단',
      ended: '종료'
    };
    return map[status] || status;
  }

  private parseDate(dateStr: string): Date | undefined {
    // YYYY.MM.DD 형식 파싱
    const match = dateStr.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})/);
    if (match) {
      return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
    }
    return undefined;
  }

  private parseExtractedDate(match: RegExpMatchArray): Date {
    const month = parseInt(match[1]);
    const day = parseInt(match[2]);
    const year = new Date().getFullYear();
    return new Date(year, month - 1, day);
  }
}

export const strikeService = new StrikeService();
```

### Step 6: 스케줄러

```typescript
// src/scheduler.ts
import cron from 'node-cron';
import { TOPISCrawler } from './crawlers/topis';
import { GBISCrawler } from './crawlers/gbis';
import { strikeService } from './services/strike';
import { db } from './models/database';
import { redis } from './utils/redis';
import { generateId } from './utils/hash';
import { logger } from './utils/logger';

class CrawlerScheduler {
  private crawlers: Map<string, any> = new Map();

  async initialize() {
    // 크롤러 등록
    this.crawlers.set('topis', new TOPISCrawler());
    this.crawlers.set('gbis', new GBISCrawler());

    // 크롤러 초기화
    for (const [id, crawler] of this.crawlers) {
      await crawler.initialize();
    }

    logger.info('Crawler scheduler initialized');
  }

  start() {
    // Tier 1: 30분마다
    cron.schedule('*/30 * * * *', async () => {
      logger.info('Starting Tier 1 crawling...');
      await this.crawlTier1();
    });

    // 즉시 실행 (첫 시작)
    this.crawlTier1();

    logger.info('Crawler scheduler started');
  }

  private async crawlTier1() {
    const tier1Crawlers = ['topis', 'gbis'];

    for (const crawlerId of tier1Crawlers) {
      await this.runCrawler(crawlerId);
    }
  }

  private async runCrawler(crawlerId: string) {
    const crawler = this.crawlers.get(crawlerId);
    if (!crawler) {
      logger.error(`Crawler not found: ${crawlerId}`);
      return;
    }

    // 중복 실행 방지 (락 획득)
    const lockKey = `crawl:lock:${crawlerId}`;
    const locked = await redis.setNX(lockKey, '1', 300); // 5분 타임아웃

    if (!locked) {
      logger.warn(`Crawler already running: ${crawlerId}`);
      return;
    }

    const crawlLogId = generateId('log');
    const startTime = Date.now();

    try {
      // 크롤링 시작
      logger.info(`Starting crawler: ${crawlerId}`);
      const result = await crawler.crawl();

      // 로그 저장
      await db.query(
        `INSERT INTO crawl_logs
         (id, source_id, status, items_found, items_processed, duration_ms)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          crawlLogId,
          crawlerId,
          result.error ? 'failed' : 'success',
          result.items.length,
          0, // 아직 처리 안 됨
          result.duration
        ]
      );

      // 수집된 공지사항 처리
      let processedCount = 0;
      for (const item of result.items) {
        try {
          await strikeService.processNotice(crawlLogId, crawlerId, item);
          processedCount++;
        } catch (error) {
          logger.error(`Failed to process notice:`, error);
        }
      }

      // 처리 완료 업데이트
      await db.query(
        'UPDATE crawl_logs SET items_processed = $1 WHERE id = $2',
        [processedCount, crawlLogId]
      );

      // 소스 업데이트
      await db.query(
        'UPDATE crawl_sources SET last_crawled_at = NOW() WHERE id = $1',
        [crawlerId]
      );

      logger.info(`Crawler completed: ${crawlerId} (${result.items.length} items, ${processedCount} processed)`);

    } catch (error: any) {
      logger.error(`Crawler error: ${crawlerId}`, error);

      // 에러 로그 저장
      await db.query(
        `INSERT INTO crawl_logs
         (id, source_id, status, items_found, duration_ms, error_message)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          crawlLogId,
          crawlerId,
          'failed',
          0,
          Date.now() - startTime,
          error.message
        ]
      );
    } finally {
      // 락 해제
      await redis.del(lockKey);
    }
  }

  async cleanup() {
    for (const [id, crawler] of this.crawlers) {
      await crawler.cleanup();
    }
    logger.info('Crawler scheduler stopped');
  }
}

export const scheduler = new CrawlerScheduler();
```

### Step 7: 메인 진입점

```typescript
// src/index.ts
import dotenv from 'dotenv';
import { scheduler } from './scheduler';
import { redis } from './utils/redis';
import { logger } from './utils/logger';

dotenv.config();

async function main() {
  try {
    logger.info('Starting crawler service...');

    // Redis 연결
    await redis.connect();

    // 스케줄러 초기화 및 시작
    await scheduler.initialize();
    scheduler.start();

    logger.info('Crawler service started successfully');

    // Graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Shutting down...');
      await scheduler.cleanup();
      process.exit(0);
    });

  } catch (error) {
    logger.error('Failed to start crawler service:', error);
    process.exit(1);
  }
}

main();
```

### Step 8: package.json 스크립트

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "init-db": "docker exec -i postgres psql -U busstrike -d busstrike < scripts/init-db.sql",
    "seed": "docker exec -i postgres psql -U busstrike -d busstrike < scripts/seed-sources.sql"
  }
}
```

---

## 4. 테스트

### 4.1 단위 테스트

```typescript
// tests/services/strike.test.ts
import { StrikeService } from '../../src/services/strike';

describe('StrikeService', () => {
  const service = new StrikeService();

  test('should detect strike from title', () => {
    const notice = {
      title: '서울 시내버스 파업 예정 안내',
      date: '2026.01.15',
      content: ''
    };

    const info = (service as any).extractStrikeInfo(notice);
    expect(info.isStrike).toBe(true);
    expect(info.regions).toContain('seoul');
  });

  test('should extract dates', () => {
    const notice = {
      title: '파업 안내',
      content: '1월 15일부터 1월 17일까지 파업',
      date: ''
    };

    const info = (service as any).extractStrikeInfo(notice);
    expect(info.startDate).toBeDefined();
    expect(info.endDate).toBeDefined();
  });
});
```

### 4.2 통합 테스트

```bash
# 크롤러 수동 실행 테스트
npm run dev

# 다른 터미널에서 로그 확인
tail -f logs/crawler.log

# 데이터베이스 확인
docker exec -it postgres psql -U busstrike -d busstrike
SELECT * FROM crawl_logs ORDER BY crawled_at DESC LIMIT 5;
SELECT * FROM raw_notices ORDER BY crawled_at DESC LIMIT 5;
SELECT * FROM strike_events;
```

---

## 5. 배포

### 5.1 Docker 컨테이너화

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install Playwright dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set Playwright to use local chromium
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy source
COPY dist ./dist

CMD ["node", "dist/index.js"]
```

### 5.2 docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: busstrike
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: busstrike
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  crawler:
    build: .
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgresql://busstrike:${DB_PASSWORD}@postgres:5432/busstrike
      REDIS_URL: redis://redis:6379
    restart: unless-stopped

volumes:
  postgres_data:
```

---

## 6. 트러블슈팅

### 문제 1: Playwright 타임아웃

```typescript
// 해결: 타임아웃 늘리기
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

// 또는 waitUntil 변경
await page.goto(url, { waitUntil: 'domcontentloaded' });
```

### 문제 2: 메모리 누수

```typescript
// 해결: 페이지 명시적 종료
const page = await browser.newPage();
try {
  // 크롤링 로직
} finally {
  await page.close();
}
```

### 문제 3: 동시 실행 제어

```typescript
// Redis 락 사용
const lockKey = `crawl:lock:${sourceId}`;
const locked = await redis.setNX(lockKey, '1', 300);
if (!locked) return;
```

---

## 다음 단계

1. **Admin API 구현**: Express로 관리 API 구축
2. **알림 연동**: FCM 푸시 알림 발송
3. **모니터링**: Prometheus + Grafana
4. **ML 모델**: 파업 감지 정확도 향상
5. **분산 크롤링**: 다중 서버 환경 지원