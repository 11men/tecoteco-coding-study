'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  AlertTriangle,
  MapPin,
  ArrowRight,
  Map,
  Train,
  Bus,
  Car,
  Users,
  Building2,
  ExternalLink,
  DollarSign
} from 'lucide-react';

interface Route {
  id: number;
  type: string;
  duration: number;
  extra: number;
  details: string[];
  isRecommended: boolean;
  icon: 'train' | 'bus';
}

export default function AlternativePage() {
  const route = {
    from: '수원 영통',
    to: '판교역',
    arrivalTime: '09:00'
  };

  const originalRoute = {
    name: '3100번 광역버스',
    duration: 60,
    available: false
  };

  const routes: Route[] = [
    {
      id: 1,
      type: '지하철 분당선 → 신분당선',
      duration: 80,
      extra: 20,
      details: ['수원역에서 분당선 탑승', '강남역에서 신분당선 환승', '판교역 도착'],
      isRecommended: true,
      icon: 'train',
    },
    {
      id: 2,
      type: '버스 → 지하철 환승',
      duration: 95,
      extra: 35,
      details: ['10분 도보 후 지하철 탑승', '2회 환승 필요', '예상 소요 시간 증가'],
      isRecommended: false,
      icon: 'bus',
    },
  ];

  const departureTimes = [
    { time: '7:40', note: '9시 출근 기준' },
    { time: '7:20', note: '8시 30분 출근 기준' },
  ];

  // 택시 정보
  const taxiInfo = {
    estimatedFare: '45,000 ~ 55,000원',
    duration: 50,
    surgeWarning: true,
  };

  // 카풀 정보
  const carpoolInfo = {
    availableMatches: 3,
    estimatedCost: '15,000원',
    nextDeparture: '7:30',
  };

  // 버스 대절 정보
  const charterInfo = {
    minPeople: 20,
    pricePerPerson: '8,000원',
    companyRoute: '판교 테크노밸리',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">대체 경로</h1>
            <p className="text-sm text-gray-500">{route.from} → {route.to}</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* 평소 경로 (이용 불가) */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500">평소 경로 (파업으로 이용 불가)</p>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-600" />
              <span className="font-semibold text-red-800">{originalRoute.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-red-600">
              <Clock size={16} />
              <span>평소 {originalRoute.duration}분 · 현재 운행 중단</span>
            </div>
          </div>
        </div>

        {/* ===== 대안 1: 대중교통 최적 경로 ===== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Train size={18} className="text-blue-500" />
            <p className="text-sm font-semibold text-gray-900">대안 1: 대중교통 최적 경로</p>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">MVP</span>
          </div>
          <div className="space-y-3">
            {routes.map((r) => (
              <div
                key={r.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  r.isRecommended
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
              >
                {r.isRecommended && (
                  <div className="inline-block px-2 py-1 bg-blue-500 text-white rounded text-xs font-semibold mb-2">
                    추천
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {r.icon === 'train' ? (
                        <Train size={20} className="text-blue-600" />
                      ) : (
                        <Bus size={20} className="text-green-600" />
                      )}
                      <h4 className="font-semibold text-gray-900">{r.type}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                      <Clock size={18} />
                      {r.duration}분
                    </div>
                    <div className="text-sm text-red-600">
                      +{r.extra}분 <span className="text-xs text-red-500">(평소 대비)</span>
                    </div>
                  </div>

                  <div className="space-y-1 bg-white/50 rounded-lg p-3">
                    {r.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {detail}
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-2.5 px-4 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                    <Map size={16} />
                    지도에서 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== 대안 2: 택시 ===== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Car size={18} className="text-yellow-600" />
            <p className="text-sm font-semibold text-gray-900">대안 2: 택시</p>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Phase 2</span>
          </div>

          <div className="p-4 bg-white rounded-xl border-2 border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Car size={24} className="text-yellow-500" />
                <span className="font-semibold text-gray-900">택시 호출</span>
              </div>
              {taxiInfo.surgeWarning && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full flex items-center gap-1">
                  <AlertTriangle size={12} />
                  할증 예상
                </span>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">예상 요금</span>
                <span className="font-bold text-gray-900">{taxiInfo.estimatedFare}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">예상 소요시간</span>
                <span className="font-medium text-gray-900">{taxiInfo.duration}분</span>
              </div>
            </div>

            {taxiInfo.surgeWarning && (
              <div className="bg-orange-50 text-orange-700 text-xs p-2 rounded-lg mb-3">
                파업 당일 택시 수요 증가로 할증이 예상됩니다
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button className="py-2.5 px-4 bg-yellow-400 text-gray-900 rounded-lg text-sm font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center gap-1">
                <ExternalLink size={14} />
                카카오택시
              </button>
              <button className="py-2.5 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                <ExternalLink size={14} />
                타다
              </button>
            </div>
          </div>
        </div>

        {/* ===== 대안 3: 카풀 ===== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-green-600" />
            <p className="text-sm font-semibold text-gray-900">대안 3: 카풀</p>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Phase 2</span>
          </div>

          <div className="p-4 bg-white rounded-xl border-2 border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users size={24} className="text-green-500" />
                <span className="font-semibold text-gray-900">카풀 매칭</span>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {carpoolInfo.availableMatches}명 매칭 가능
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">예상 비용 (1/n)</span>
                <span className="font-bold text-gray-900">{carpoolInfo.estimatedCost}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">다음 출발</span>
                <span className="font-medium text-gray-900">{carpoolInfo.nextDeparture}</span>
              </div>
            </div>

            <div className="bg-green-50 text-green-700 text-xs p-2 rounded-lg mb-3">
              같은 경로 유저와 비용을 나눠 이동할 수 있습니다
            </div>

            <button className="w-full py-2.5 px-4 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
              <Users size={16} />
              카풀 참여하기
            </button>
          </div>
        </div>

        {/* ===== 대안 4: 버스 대절 (B2B) ===== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-purple-600" />
            <p className="text-sm font-semibold text-gray-900">대안 4: 버스 대절</p>
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">B2B</span>
          </div>

          <div className="p-4 bg-white rounded-xl border-2 border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bus size={24} className="text-purple-500" />
                <span className="font-semibold text-gray-900">회사 전세버스</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">최소 인원</span>
                <span className="font-medium text-gray-900">{charterInfo.minPeople}명 이상</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">1인당 예상 비용</span>
                <span className="font-bold text-gray-900">{charterInfo.pricePerPerson}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">운행 경로</span>
                <span className="font-medium text-gray-900">{charterInfo.companyRoute}</span>
              </div>
            </div>

            <div className="bg-purple-50 text-purple-700 text-xs p-2 rounded-lg mb-3">
              회사/단체 단위로 전세버스를 이용할 수 있습니다. HR 담당자에게 문의하세요.
            </div>

            <button className="w-full py-2.5 px-4 bg-purple-500 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition-colors flex items-center justify-center gap-2">
              <Building2 size={16} />
              HR 담당자에게 요청
            </button>
          </div>
        </div>

        {/* 권장 출발 시각 */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-900">권장 출발 시각</p>
          <div className="space-y-2">
            {departureTimes.map((item, idx) => (
              <div key={idx} className="p-4 bg-white rounded-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-blue-500" />
                  <span className="text-xl font-bold text-gray-900">{item.time}</span>
                </div>
                <span className="text-sm text-gray-500">{item.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 경로 요약 */}
        <div className="p-4 bg-gray-50 rounded-xl space-y-2">
          <p className="text-sm font-semibold text-gray-700">경로 요약</p>
          <div className="flex items-center justify-between text-sm text-gray-900">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-500" />
              <span>{route.from}</span>
            </div>
            <ArrowRight size={16} className="text-gray-400" />
            <span className="text-right">{route.to}</span>
          </div>
        </div>

        {/* 지도 앱 연결 버튼 */}
        <div className="space-y-2 pt-2">
          <a
            href="#"
            className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3.5 rounded-xl font-medium transition-colors"
          >
            네이버 지도로 보기
          </a>
          <a
            href="#"
            className="block w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-center py-3.5 rounded-xl font-medium transition-colors"
          >
            카카오맵으로 보기
          </a>
        </div>
      </main>
    </div>
  );
}
