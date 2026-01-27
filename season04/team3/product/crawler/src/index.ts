// 메인 크롤러 실행 파일
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { crawlTOPIS, type Notice } from './crawlers/topis.js';
import { formatStrikeInfo } from './utils/parser.js';

const DATA_DIR = './data';
const DATA_FILE = `${DATA_DIR}/strikes.json`;

interface StoredStrike {
  id: string;
  notice: Notice;
  detectedAt: string;
  lastUpdatedAt: string;
}

// 데이터 로드
async function loadStrikes(): Promise<StoredStrike[]> {
  try {
    if (!existsSync(DATA_FILE)) {
      return [];
    }
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('데이터 로드 실패:', error);
    return [];
  }
}

// 데이터 저장
async function saveStrikes(strikes: StoredStrike[]): Promise<void> {
  try {
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }
    await writeFile(DATA_FILE, JSON.stringify(strikes, null, 2), 'utf-8');
  } catch (error) {
    console.error('데이터 저장 실패:', error);
  }
}

// ID 생성
function generateId(title: string, date: string): string {
  return `strike_${Buffer.from(title + date).toString('base64').slice(0, 16)}`;
}

// 변경사항 감지
function detectChanges(old: Notice, newNotice: Notice): string[] {
  const changes: string[] = [];

  if (!old.strikeInfo || !newNotice.strikeInfo) return changes;

  // 상태 변경
  if (old.strikeInfo.status !== newNotice.strikeInfo.status) {
    changes.push(`상태: ${old.strikeInfo.status} → ${newNotice.strikeInfo.status}`);
  }

  // 시간 변경
  if (old.strikeInfo.strikeTime !== newNotice.strikeInfo.strikeTime) {
    changes.push(`시간: ${old.strikeInfo.strikeTime || '미정'} → ${newNotice.strikeInfo.strikeTime || '미정'}`);
  }

  // 지역 변경
  const oldRegions = old.strikeInfo.regions?.sort().join(',') || '';
  const newRegions = newNotice.strikeInfo.regions?.sort().join(',') || '';
  if (oldRegions !== newRegions) {
    changes.push(`지역: ${oldRegions} → ${newRegions}`);
  }

  return changes;
}

// 메인 실행
async function main() {
  console.log('=' .repeat(60));
  console.log('🚌 버스 파업 크롤러 시작');
  console.log('=' .repeat(60));
  console.log('');

  try {
    // 1. 크롤링 실행
    const notices = await crawlTOPIS();

    if (notices.length === 0) {
      console.log('\n📭 파업 관련 공지사항이 없습니다.');
      return;
    }

    // 2. 기존 데이터 로드
    const existingStrikes = await loadStrikes();
    const existingMap = new Map(
      existingStrikes.map(s => [s.id, s])
    );

    // 3. 신규/업데이트 판단
    const updatedStrikes: StoredStrike[] = [];
    const newStrikes: Notice[] = [];
    const updatedNotices: Array<{ notice: Notice; changes: string[] }> = [];

    for (const notice of notices) {
      const id = generateId(notice.title, notice.date);
      const existing = existingMap.get(id);

      if (existing) {
        // 기존 파업: 변경사항 확인
        const changes = detectChanges(existing.notice, notice);

        if (changes.length > 0) {
          updatedNotices.push({ notice, changes });
          updatedStrikes.push({
            id,
            notice,
            detectedAt: existing.detectedAt,
            lastUpdatedAt: new Date().toISOString()
          });
        } else {
          updatedStrikes.push(existing);
        }
      } else {
        // 신규 파업
        newStrikes.push(notice);
        updatedStrikes.push({
          id,
          notice,
          detectedAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString()
        });
      }
    }

    // 4. 결과 출력
    console.log('\n' + '='.repeat(60));
    console.log('📊 크롤링 결과');
    console.log('='.repeat(60));

    if (newStrikes.length > 0) {
      console.log('\n🆕 신규 파업 정보:');
      newStrikes.forEach((notice, i) => {
        console.log(`\n[${i + 1}] ${notice.title}`);
        console.log(`    ${formatStrikeInfo(notice.strikeInfo!)}`);
        console.log(`    발표일: ${notice.date}`);
        console.log(`    조회수: ${notice.views}`);
        console.log(`    📎 ${notice.sourceUrl || ''}`);
      });
    }

    if (updatedNotices.length > 0) {
      console.log('\n🔄 업데이트된 파업 정보:');
      updatedNotices.forEach((item, i) => {
        console.log(`\n[${i + 1}] ${item.notice.title}`);
        console.log(`    변경사항: ${item.changes.join(', ')}`);
        console.log(`    ${formatStrikeInfo(item.notice.strikeInfo!)}`);
      });
    }

    if (newStrikes.length === 0 && updatedNotices.length === 0) {
      console.log('\n✅ 변경사항 없음 (모든 파업 정보 최신 상태)');
    }

    // 5. 저장
    await saveStrikes(updatedStrikes);
    console.log(`\n💾 데이터 저장 완료: ${DATA_FILE}`);
    console.log(`   총 ${updatedStrikes.length}개 파업 정보 저장됨`);

    // 6. 알림 시뮬레이션
    if (newStrikes.length > 0 || updatedNotices.length > 0) {
      console.log('\n🔔 알림 발송 시뮬레이션:');

      newStrikes.forEach(notice => {
        console.log(`   [신규] ${notice.strikeInfo?.title}`);
      });

      updatedNotices.forEach(item => {
        console.log(`   [업데이트] ${item.notice.title} - ${item.changes.join(', ')}`);
      });
    }

  } catch (error) {
    console.error('\n❌ 크롤링 중 오류 발생:', error);
    process.exit(1);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ 크롤링 완료');
  console.log('='.repeat(60));
}

// 실행
main();
