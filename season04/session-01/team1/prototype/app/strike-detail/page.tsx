'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  AlertCircle,
  Bus,
  BarChart3,
  Calendar,
  Info,
  MapPin,
  Clock
} from 'lucide-react';

export default function StrikeDetailPage() {
  const strikeInfo = {
    status: '파업 진행 중',
    statusType: 'ongoing' as const,
    region: '서울 전역',
    date: '2026년 1월 27일',
    startTime: '오전 4시',
    endTime: '미정',
    affectedBuses: [
      { type: '시내버스', status: '전면 중단', count: '약 7,400대' },
      { type: '광역버스', status: '일부 운행', count: '약 30% 운행' },
      { type: '마을버스', status: '정상 운행', count: '-' },
    ],
    operationRate: 30,
    cause: '임금 협상 결렬로 인한 전면 파업',
    union: '서울시버스노동조합',
    updatedAt: '2026-01-27 오후 3시',
    source: '서울시 교통정책과',
    timeline: [
      { time: '01/25 10:00', event: '파업 예고 통보', isCurrent: false },
      { time: '01/26 14:00', event: '협상 결렬 확정', isCurrent: false },
      { time: '01/27 04:00', event: '파업 시작', isCurrent: true },
    ]
  };

  const getStatusBadgeStyle = (status: string) => {
    if (status === '전면 중단') return 'bg-red-100 text-red-700';
    if (status === '일부 운행') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">파업 상세 정보</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* 상태 배지 */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1.5 rounded-full bg-red-500 text-white text-sm font-semibold flex items-center gap-1.5">
              <AlertCircle size={14} />
              {strikeInfo.status}
            </span>
            <span className="text-sm text-gray-500">{strikeInfo.date}</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" />
                파업 지역
              </span>
              <span className="font-medium text-gray-900">{strikeInfo.region}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                파업 시작
              </span>
              <span className="font-medium text-gray-900">{strikeInfo.startTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                종료 예정
              </span>
              <span className="font-medium text-gray-900">{strikeInfo.endTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-2">
                <Info size={16} className="text-gray-400" />
                파업 주체
              </span>
              <span className="font-medium text-gray-900">{strikeInfo.union}</span>
            </div>
          </div>
        </div>

        {/* 영향받는 버스 */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bus size={20} className="text-blue-500" />
            영향받는 버스
          </h2>

          <div className="space-y-3">
            {strikeInfo.affectedBuses.map((bus, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b last:border-0 last:pb-0">
                <div>
                  <div className="font-medium text-gray-900">{bus.type}</div>
                  <div className="text-sm text-gray-500">{bus.count}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-sm font-medium ${getStatusBadgeStyle(bus.status)}`}>
                  {bus.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 운행 현황 */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-orange-500" />
            운행 현황
          </h2>

          <div className="mb-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">평소 대비</span>
              <span className="font-bold text-orange-600">{strikeInfo.operationRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-400 to-orange-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${strikeInfo.operationRate}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {strikeInfo.cause}
          </p>
        </div>

        {/* 타임라인 */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-blue-500" />
            진행 경과
          </h2>

          <div className="space-y-0">
            {strikeInfo.timeline.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${item.isCurrent ? 'bg-red-500 ring-4 ring-red-100' : 'bg-blue-500'}`} />
                  {idx < strikeInfo.timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gray-200 my-1 min-h-[24px]" />
                  )}
                </div>
                <div className="pb-4">
                  <div className="text-sm text-gray-500">{item.time}</div>
                  <div className={`font-medium ${item.isCurrent ? 'text-red-600' : 'text-gray-900'}`}>
                    {item.event}
                    {item.isCurrent && <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">현재</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 출처 정보 */}
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
          <div className="flex items-center gap-2 mb-2">
            <Info size={16} className="text-gray-400" />
            <span className="font-medium text-gray-700">정보 출처</span>
          </div>
          <div>{strikeInfo.updatedAt} 기준</div>
          <div>출처: {strikeInfo.source}</div>
        </div>

        {/* 대체 경로 버튼 */}
        <Link
          href="/alternative"
          className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-3.5 rounded-xl font-medium transition-colors"
        >
          대체 경로 확인하기
        </Link>
      </main>
    </div>
  );
}
