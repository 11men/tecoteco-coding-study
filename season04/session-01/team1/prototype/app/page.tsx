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
  Settings,
  Megaphone
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
    updatedAt: '2026년 1월 27일 오후 3시',
    source: '서울시 교통정책과'
  });

  const [myRoute] = useState({
    from: '수원 영통',
    to: '판교역',
    isAffected: true
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
      <header className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">파업 출근 비서</h1>
            <p className="text-sm text-gray-500">Strike Commute Assistant</p>
          </div>
          <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={24} className="text-gray-600" />
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* 파업 상태 배너 */}
        {!strikeData.isStrike ? (
          <div className="bg-green-50 border border-green-300 rounded-xl p-6 flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <h2 className="font-bold text-green-900">운행 정상입니다</h2>
              <p className="text-sm text-green-700">현재 버스 파업이 없습니다</p>
            </div>
          </div>
        ) : (
          <Link href="/strike-detail" className="block">
            <div
              className={`${display?.color} border-2 rounded-xl p-6 flex items-center justify-between cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] duration-300`}
            >
              <div className="flex items-center gap-4">
                <StatusIcon className={`w-8 h-8 ${display?.textColor} flex-shrink-0`} />
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${display?.badgeColor}`}>
                    🔴 {display?.label}
                  </span>
                  <h2 className={`font-bold text-lg ${display?.textColor}`}>오늘 버스 파업이 있습니다</h2>
                  <p className={`text-sm ${display?.textColor} opacity-80`}>
                    {strikeData.region} · 평소 대비 {strikeData.operationRate}% 운행
                  </p>
                </div>
              </div>
              <ArrowRight className={`text-2xl ${display?.textColor}`} size={24} />
            </div>
          </Link>
        )}

        {/* 내 경로 카드 */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-gray-900">내 출퇴근 경로</span>
          </div>

          <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-lg">
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">출발</div>
              <div className="font-medium text-gray-900">{myRoute.from}</div>
            </div>
            <ArrowRight className="text-gray-400" size={20} />
            <div className="flex-1 text-right">
              <div className="text-xs text-gray-500 mb-1">도착</div>
              <div className="font-medium text-gray-900">{myRoute.to}</div>
            </div>
          </div>

          {/* 영향도 표시 */}
          {myRoute.isAffected ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div>
                <span className="font-medium text-yellow-800">내 경로가 파업 영향권입니다</span>
                <p className="text-xs text-yellow-700 mt-0.5">대체 경로를 확인해주세요</p>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="font-medium text-green-800">내 경로는 영향 없습니다</span>
            </div>
          )}

          {/* 대체 경로 버튼 */}
          <Link
            href="/alternative"
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-lg font-medium transition-colors"
          >
            대체 경로 확인하기
          </Link>
        </div>

        {/* 파업 상세 정보 카드 */}
        <Link href="/strike-detail" className="block">
          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-900">파업 상세 정보</span>
              </div>
              <ArrowRight className="text-gray-400" size={20} />
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">파업 지역</span>
                <span className="text-gray-900 font-medium">{strikeData.region}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">영향 노선</span>
                <span className="text-gray-900 font-medium">{strikeData.affectedBuses.join(', ')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">운행 현황</span>
                <span className="text-gray-900 font-medium">평소 대비 {strikeData.operationRate}%</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t text-xs text-gray-400">
              {strikeData.updatedAt} 기준 · 출처: {strikeData.source}
            </div>
          </div>
        </Link>

        {/* 빠른 메뉴 */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/settings" className="bg-white rounded-xl p-4 shadow-sm text-center hover:shadow-md transition-all hover:scale-[1.02]">
            <Settings className="w-8 h-8 mx-auto mb-2 text-gray-600" />
            <div className="text-sm font-medium text-gray-700">경로 설정</div>
          </Link>
          <Link href="/report" className="bg-white rounded-xl p-4 shadow-sm text-center hover:shadow-md transition-all hover:scale-[1.02]">
            <Megaphone className="w-8 h-8 mx-auto mb-2 text-gray-600" />
            <div className="text-sm font-medium text-gray-700">현장 제보</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
