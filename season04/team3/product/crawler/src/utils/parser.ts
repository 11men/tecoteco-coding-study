// 파업 정보 추출 유틸리티

export interface StrikeInfo {
  isStrike: boolean;
  title?: string;
  regions?: string[];
  busTypes?: string[];
  strikeDate?: string;
  strikeTime?: string;
  status?: 'scheduled' | 'ongoing' | 'cancelled' | 'ended';
  sourceUrl?: string;
}

export function extractStrikeInfo(title: string, content: string = '', url: string = ''): StrikeInfo {
  const text = (title + ' ' + content).toLowerCase();
  const originalText = title + ' ' + content;

  // 1. 키워드 기반 파업 감지
  const strikeKeywords = ['파업', '운행중단', '노사협상 결렬', '단체행동'];
  const isStrike = strikeKeywords.some(keyword => text.includes(keyword));

  if (!isStrike) {
    return { isStrike: false };
  }

  // 2. 지역 추출
  const regions: string[] = [];
  if (text.includes('서울')) regions.push('seoul');
  if (text.includes('경기')) regions.push('gyeonggi');
  if (text.includes('인천')) regions.push('incheon');

  // 3. 버스 타입 추출
  const busTypes: string[] = [];
  if (text.includes('시내버스') || text.includes('시내 버스')) busTypes.push('city');
  if (text.includes('시외버스') || text.includes('시외 버스') || text.includes('광역')) busTypes.push('intercity');

  // 기본값: 명시 안 되면 시내버스
  if (busTypes.length === 0) busTypes.push('city');

  // 4. 날짜 추출 (X월 X일)
  const datePattern = /(\d{1,2})월\s*(\d{1,2})일/g;
  const dates = [...originalText.matchAll(datePattern)];
  let strikeDate = null;

  if (dates.length > 0) {
    const month = parseInt(dates[0][1]);
    const day = parseInt(dates[0][2]);
    const year = new Date().getFullYear();
    strikeDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  // 5. 시간 추출 (오전/오후 X시)
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

  // 6. 상태 판단
  let status: 'scheduled' | 'ongoing' | 'cancelled' | 'ended' = 'scheduled';

  if (text.includes('파업중단') || text.includes('파업 중단') || text.includes('파업 철회')) {
    status = 'cancelled';
  } else if (text.includes('파업 돌입') || text.includes('파업 시작') || text.includes('파업 중')) {
    status = 'ongoing';
  } else if (text.includes('파업 종료') || text.includes('정상운행')) {
    status = 'ended';
  } else if (text.includes('파업 예정') || text.includes('파업 계획') || text.includes('파업 예고')) {
    status = 'scheduled';
  }

  return {
    isStrike: true,
    title,
    regions,
    busTypes,
    strikeDate,
    strikeTime,
    status,
    sourceUrl: url
  };
}

export function formatStrikeInfo(info: StrikeInfo): string {
  if (!info.isStrike) return '파업 아님';

  const parts = [];

  if (info.regions && info.regions.length > 0) {
    const regionMap: Record<string, string> = { seoul: '서울', gyeonggi: '경기', incheon: '인천' };
    parts.push(`[${info.regions.map(r => regionMap[r] || r).join('/')}]`);
  }

  if (info.busTypes && info.busTypes.length > 0) {
    const typeMap: Record<string, string> = { city: '시내버스', intercity: '시외버스' };
    parts.push(info.busTypes.map(t => typeMap[t] || t).join('/'));
  }

  const statusMap: Record<string, string> = {
    scheduled: '파업 예고',
    ongoing: '파업 진행중',
    cancelled: '파업 중단',
    ended: '파업 종료'
  };

  if (info.status) {
    parts.push(statusMap[info.status]);
  }

  if (info.strikeDate) {
    parts.push(`날짜: ${info.strikeDate}`);
  }

  if (info.strikeTime) {
    parts.push(`시간: ${info.strikeTime}`);
  }

  return parts.join(' | ');
}
