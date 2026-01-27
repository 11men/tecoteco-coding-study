'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  ArrowRight,
  Bell,
  ChevronRight,
  Edit3
} from 'lucide-react';

type StrikeStatus = 'warning' | 'confirmed' | 'partial' | 'ongoing';

interface StrikeData {
  isStrike: boolean;
  status: StrikeStatus;
  region: string;
  affectedBuses: string[];
  operationRate: number;
  updatedAt: string;
  source: string;
}

export default function Home() {
  const [strikeData] = useState<StrikeData>({
    isStrike: true,
    status: 'ongoing',
    region: '서울 전역',
    affectedBuses: ['시내버스 전체', '광역버스 일부'],
    operationRate: 30,
    updatedAt: '오후 3시',
    source: '서울시 교통정책과'
  });

  const [myRoute] = useState({
    from: '수원 영통',
    to: '판교역',
    isAffected: true,
    registered: true
  });

  const getStatusDisplay = (status: StrikeStatus) => {
    switch (status) {
      case 'warning':
        return {
          icon: Clock,
          label: '파업 예고',
          color: 'bg-yellow-50 border-yellow-300',
          textColor: 'text-yellow-900',
          badgeColor: 'bg-yellow-100 text-yellow-800',
        };
      case 'confirmed':
        return {
          icon: AlertTriangle,
          label: '파업 확정',
          color: 'bg-orange-50 border-orange-300',
          textColor: 'text-orange-900',
          badgeColor: 'bg-orange-100 text-orange-800',
        };
      case 'partial':
        return {
          icon: AlertCircle,
          label: '부분 파업',
          color: 'bg-red-50 border-red-300',
          textColor: 'text-red-900',
          badgeColor: 'bg-red-100 text-red-800',
        };
      case 'ongoing':
        return {
          icon: AlertCircle,
          label: '파업 진행 중',
          color: 'bg-red-100 border-red-500',
          textColor: 'text-red-900',
          badgeColor: 'bg-red-200 text-red-900',
        };
    }
  };

  const display = strikeData.isStrike ? getStatusDisplay(strikeData.status) : null;
  const StatusIcon = display?.icon || CheckCircle;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">파업 출근 비서</h1>
            <p className="text-xs text-gray-500">오늘의 출퇴근 현황</p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell size={22} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* 파업 상태 배너 */}
        {!strikeData.isStrike ? (
          <div className="bg-green-50 border border-green-300 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="font-bold text-green-900">운행 정상</h2>
              <p className="text-sm text-green-700">현재 버스 파업이 없습니다</p>
            </div>
          </div>
        ) : (
          <Link href="/strike-detail" className="block">
            <div
              className={`${display?.color} border-2 rounded-2xl p-5 transition-all active:scale-[0.98]`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${display?.badgeColor}`}>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  {display?.label}
                </span>
                <ChevronRight className={`${display?.textColor}`} size={20} />
              </div>

              <h2 className={`font-bold text-lg ${display?.textColor} mb-1`}>
                오늘 버스 파업이 있습니다
              </h2>
              <p className={`text-sm ${display?.textColor} opacity-80`}>
                {strikeData.region} · 평소 대비 {strikeData.operationRate}% 운행
              </p>

              <div className={`mt-3 pt-3 border-t ${display?.textColor} border-current opacity-20`}></div>
              <div className={`flex items-center justify-between text-xs ${display?.textColor} opacity-70`}>
                <span>{strikeData.updatedAt} 기준</span>
                <span>자세히 보기</span>
              </div>
            </div>
          </Link>
        )}

        {/* 내 경로 카드 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-gray-900">내 출퇴근 경로</span>
              </div>
              <Link href="/settings" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <Edit3 size={16} className="text-gray-400" />
              </Link>
            </div>
          </div>

          <div className="p-4">
            {myRoute.registered ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 mb-0.5">출발</div>
                    <div className="font-semibold text-gray-900">{myRoute.from}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <ArrowRight className="text-gray-300" size={20} />
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-xs text-gray-400 mb-0.5">도착</div>
                    <div className="font-semibold text-gray-900">{myRoute.to}</div>
                  </div>
                </div>

                {/* 영향도 표시 */}
                {myRoute.isAffected ? (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      <div>
                        <span className="font-semibold text-orange-800 text-sm">내 경로가 영향받습니다</span>
                        <p className="text-xs text-orange-600">대체 경로를 확인하세요</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-semibold text-green-800 text-sm">내 경로는 영향 없습니다</span>
                    </div>
                  </div>
                )}

                {/* 대체 경로 버튼 */}
                <Link
                  href="/alternative"
                  className="block w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-center py-3.5 rounded-xl font-semibold transition-colors"
                >
                  대체 경로 확인하기
                </Link>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-3">출퇴근 경로를 등록하면<br/>맞춤 정보를 받을 수 있어요</p>
                <Link
                  href="/onboarding"
                  className="inline-block bg-blue-500 text-white px-6 py-2.5 rounded-xl font-semibold"
                >
                  경로 등록하기
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 파업 상세 요약 */}
        {strikeData.isStrike && (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-900">운행 현황</span>
              <Link href="/strike-detail" className="text-xs text-blue-500 font-medium">
                상세보기
              </Link>
            </div>

            <div className="space-y-2">
              {strikeData.affectedBuses.map((bus, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{bus}</span>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    영향
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">마을버스</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  정상 운행
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 운행률 시각화 */}
        {strikeData.isStrike && (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-900">전체 운행률</span>
              <span className="text-2xl font-bold text-orange-500">{strikeData.operationRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${strikeData.operationRate}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              평소 대비 {100 - strikeData.operationRate}% 감소
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
