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
  Edit3,
  Sun,
  Train,
  TrendingUp,
  Zap,
  Calendar,
  Coins,
  MessageSquare
} from 'lucide-react';

type StrikeStatus = 'none' | 'warning' | 'confirmed' | 'partial' | 'ongoing';

interface TrafficIssue {
  id: number;
  type: 'delay' | 'accident' | 'congestion';
  line: string;
  message: string;
  impact: number;
}

export default function Home() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? '좋은 아침이에요!' : hour < 18 ? '좋은 오후에요!' : '좋은 저녁이에요!';

  // 오늘의 출근 브리핑
  const [briefing] = useState({
    estimatedTime: 52,
    normalTime: 45,
    extraTime: 7,
    departureRecommend: '7:35',
    temperature: 3,
  });

  // 실시간 교통 이슈
  const [trafficIssues] = useState<TrafficIssue[]>([
    { id: 1, type: 'delay', line: '분당선', message: '서현역 혼잡으로 5분 지연', impact: 5 },
  ]);

  // 파업 상태
  const [strikeStatus] = useState<StrikeStatus>('ongoing');
  const [strikeData] = useState({
    region: '서울 전역',
    operationRate: 30,
    updatedAt: '오후 3시',
  });

  // 내 경로
  const [myRoute] = useState({
    from: '수원 영통',
    to: '판교역',
    isAffected: true,
    registered: true
  });

  // 출퇴근 통계
  const [stats] = useState({
    monthlyCommutes: 18,
    savedMinutes: 45,
    points: 1250,
    streak: 5,
  });

  const getStrikeDisplay = (status: StrikeStatus) => {
    switch (status) {
      case 'warning':
        return { label: '파업 예고', color: 'bg-yellow-500', bgColor: 'bg-yellow-50 border-yellow-200', textColor: 'text-yellow-900' };
      case 'confirmed':
        return { label: '파업 확정', color: 'bg-orange-500', bgColor: 'bg-orange-50 border-orange-200', textColor: 'text-orange-900' };
      case 'partial':
        return { label: '부분 파업', color: 'bg-red-400', bgColor: 'bg-red-50 border-red-200', textColor: 'text-red-900' };
      case 'ongoing':
        return { label: '파업 진행 중', color: 'bg-red-500', bgColor: 'bg-red-50 border-red-300', textColor: 'text-red-900' };
      default:
        return null;
    }
  };

  const strikeDisplay = getStrikeDisplay(strikeStatus);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">출퇴근 비서</h1>
            <p className="text-xs text-gray-500">{greeting}</p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell size={22} className="text-gray-600" />
            {(strikeStatus !== 'none' || trafficIssues.length > 0) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* 오늘의 출근 브리핑 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sun size={20} className="text-yellow-300" />
              <span className="text-sm opacity-90">{briefing.temperature}°C</span>
            </div>
            <div className="text-xs opacity-75">
              {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm opacity-90 mb-1">오늘 출근 예상</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{briefing.estimatedTime}</span>
              <span className="text-lg">분</span>
              {briefing.extraTime > 0 && (
                <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
                  +{briefing.extraTime}분
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span className="text-sm">권장 출발</span>
            </div>
            <span className="font-bold text-lg">{briefing.departureRecommend}</span>
          </div>
        </div>

        {/* 실시간 교통 이슈 */}
        {trafficIssues.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} className="text-amber-600" />
              <span className="font-semibold text-amber-900">실시간 교통 이슈</span>
            </div>
            <div className="space-y-2">
              {trafficIssues.map((issue) => (
                <div key={issue.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Train size={16} className="text-amber-600" />
                    <span className="text-sm text-amber-800">{issue.line}</span>
                    <span className="text-sm text-amber-700">{issue.message}</span>
                  </div>
                  <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                    +{issue.impact}분
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 파업 알림 배너 */}
        {strikeStatus !== 'none' && strikeDisplay && (
          <Link href="/strike-detail" className="block">
            <div className={`${strikeDisplay.bgColor} border-2 rounded-2xl p-4 transition-all active:scale-[0.98]`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${strikeDisplay.color} text-white`}>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  {strikeDisplay.label}
                </span>
                <ChevronRight size={18} className={strikeDisplay.textColor} />
              </div>
              <p className={`text-sm ${strikeDisplay.textColor}`}>
                {strikeData.region} · 평소 대비 {strikeData.operationRate}% 운행
              </p>
            </div>
          </Link>
        )}

        {/* 파업 없을 때 */}
        {strikeStatus === 'none' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-green-900">운행 정상</div>
              <div className="text-sm text-green-700">현재 파업이 없습니다</div>
            </div>
          </div>
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
                  <ArrowRight className="text-gray-300" size={20} />
                  <div className="flex-1 text-right">
                    <div className="text-xs text-gray-400 mb-0.5">도착</div>
                    <div className="font-semibold text-gray-900">{myRoute.to}</div>
                  </div>
                </div>

                {strikeStatus !== 'none' && myRoute.isAffected && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      <div>
                        <span className="font-semibold text-orange-800 text-sm">내 경로가 영향받습니다</span>
                        <p className="text-xs text-orange-600">대체 경로를 확인하세요</p>
                      </div>
                    </div>
                  </div>
                )}

                <Link
                  href="/alternative"
                  className="block w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-center py-3.5 rounded-xl font-semibold transition-colors"
                >
                  {strikeStatus !== 'none' ? '대체 경로 확인하기' : '경로 상세 보기'}
                </Link>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-3">출퇴근 경로를 등록하면<br/>맞춤 정보를 받을 수 있어요</p>
                <Link href="/onboarding" className="inline-block bg-blue-500 text-white px-6 py-2.5 rounded-xl font-semibold">
                  경로 등록하기
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 출퇴근 통계 요약 */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-gray-900">이번 달 출퇴근</span>
            <Link href="/settings" className="text-xs text-blue-500 font-medium">자세히</Link>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-1">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">{stats.monthlyCommutes}</div>
              <div className="text-xs text-gray-500">출근일</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-1">
                <Clock size={20} className="text-green-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">{stats.savedMinutes}</div>
              <div className="text-xs text-gray-500">절약(분)</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-1">
                <Coins size={20} className="text-yellow-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">{stats.points.toLocaleString()}</div>
              <div className="text-xs text-gray-500">포인트</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-1">
                <Zap size={20} className="text-orange-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">{stats.streak}</div>
              <div className="text-xs text-gray-500">연속일</div>
            </div>
          </div>
        </div>

        {/* 빠른 액션 */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/carpool" className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">정기 카풀</div>
                <div className="text-xs text-gray-500">3명 매칭 가능</div>
              </div>
            </div>
          </Link>
          <Link href="/community" className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <MessageSquare size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">커뮤니티</div>
                <div className="text-xs text-gray-500">12건 새 제보</div>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
