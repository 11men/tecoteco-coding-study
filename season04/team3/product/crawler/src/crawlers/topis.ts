// TOPIS 크롤러 (서울 교통정보)
import { chromium } from 'playwright';
import { extractStrikeInfo, formatStrikeInfo, type StrikeInfo } from '../utils/parser.js';

export interface Notice {
  number: string;
  title: string;
  link: string;
  hasAttachment: boolean;
  date: string;
  views: number;
  content?: string;
  strikeInfo?: StrikeInfo;
}

export async function crawlTOPIS(): Promise<Notice[]> {
  console.log('🚀 TOPIS 크롤링 시작...');

  const browser = await chromium.launch({
    headless: true,
    timeout: 60000
  });

  try {
    const page = await browser.newPage();

    // 1. 공지사항 페이지 접속
    console.log('📄 공지사항 페이지 접속 중...');
    await page.goto('https://topis.seoul.go.kr/notice/openNoticeList.do', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    await page.waitForTimeout(2000);

    // 2. 버스안내 탭 클릭 시도
    try {
      const busTab = page.locator('a:has-text("버스안내")');
      if (await busTab.count() > 0) {
        console.log('🚌 버스안내 탭 클릭...');
        await busTab.first().click();
        await page.waitForTimeout(2000);
      }
    } catch (error) {
      console.log('⚠️ 버스안내 탭 찾기 실패, 전체 공지사항 크롤링');
    }

    // 3. 공지사항 목록 추출
    console.log('📋 공지사항 목록 추출 중...');
    const notices = await page.$$eval('table tbody tr', rows => {
      return rows.slice(0, 20).map(row => { // 최근 20개만
        const cells = row.querySelectorAll('td');
        if (cells.length < 5) return null;

        const titleCell = cells[1];
        const linkElement = titleCell?.querySelector('a');

        return {
          number: cells[0]?.textContent?.trim() || '',
          title: linkElement?.textContent?.trim() || '',
          link: linkElement?.getAttribute('href') || '',
          hasAttachment: !!cells[2]?.querySelector('img'),
          date: cells[3]?.textContent?.trim() || '',
          views: parseInt(cells[4]?.textContent?.trim() || '0', 10)
        };
      }).filter(Boolean);
    });

    console.log(`✅ 총 ${notices.length}개 공지사항 수집`);

    // 4. 파업 관련 키워드 필터링
    const strikeKeywords = ['파업', '운행중단', '노사협상', '단체행동'];
    const filteredNotices = notices.filter(notice =>
      notice && strikeKeywords.some(keyword => notice.title.includes(keyword))
    );

    console.log(`🔍 파업 관련 공지: ${filteredNotices.length}개`);

    // 5. 상세 내용 크롤링 (파업 관련만)
    const detailedNotices: Notice[] = [];

    for (const notice of filteredNotices) {
      if (!notice) continue;

      try {
        console.log(`  📖 "${notice.title}" 상세 내용 수집 중...`);

        // 상세 페이지 클릭
        const detailLink = page.locator(`a:has-text("${notice.title}")`).first();
        await detailLink.click();
        await page.waitForTimeout(1500);

        // 내용 추출
        let content = '';
        try {
          content = await page.$eval('.content', el => el.textContent || '');
        } catch {
          content = await page.$eval('body', el => el.textContent || '');
        }

        // 파업 정보 추출
        const strikeInfo = extractStrikeInfo(
          notice.title,
          content.trim(),
          `https://topis.seoul.go.kr${notice.link}`
        );

        detailedNotices.push({
          ...notice,
          content: content.trim(),
          strikeInfo
        });

        console.log(`  ✅ ${formatStrikeInfo(strikeInfo)}`);

        // 목록으로 돌아가기
        await page.goBack();
        await page.waitForTimeout(1000);

      } catch (error) {
        console.error(`  ❌ "${notice.title}" 처리 실패:`, error);
      }
    }

    return detailedNotices;

  } catch (error) {
    console.error('❌ TOPIS 크롤링 실패:', error);
    throw error;
  } finally {
    await browser.close();
  }
}
