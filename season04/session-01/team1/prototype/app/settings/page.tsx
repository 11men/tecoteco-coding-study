'use client';

import { useState } from 'react';
import {
  MapPin,
  Clock,
  Bus,
  Map,
  Bell,
  X,
  Plus,
  Save,
  User,
  Coins,
  Award,
  TrendingUp,
  Calendar,
  Zap,
  ChevronRight,
  Star
} from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'settings'>('profile');

  // 유저 정보
  const [user] = useState({
    name: '김직장',
    email: 'user@example.com',
    joinDate: '2026년 1월',
    level: '출퇴근 마스터',
  });

  // 포인트 & 통계
  const [points] = useState({
    total: 1250,
    thisMonth: 380,
    history: [
      { date: '오늘', action: '출근 체크인', points: 10 },
      { date: '오늘', action: '교통 제보', points: 20 },
      { date: '어제', action: '출근 체크인', points: 10 },
      { date: '어제', action: '제보 검증됨', points: 50 },
    ]
  });

  // 출퇴근 통계
  const [stats] = useState({
    totalCommutes: 156,
    monthlyCommutes: 18,
    savedMinutes: 245,
    avgTime: 48,
    streak: 5,
    longestStreak: 15,
  });

  // 배지
  const [badges] = useState<Badge[]>([
    { id: 'earlybird', name: '얼리버드', icon: '🌅', description: '7시 전 출근 체크인 10회', earned: true, earnedDate: '2026-01-15' },
    { id: 'eco', name: '친환경', icon: '🌿', description: '대중교통 30일 연속', earned: true, earnedDate: '2026-01-20' },
    { id: 'reporter', name: '제보왕', icon: '📢', description: '검증된 제보 50회', earned: false },
    { id: 'carpool', name: '카풀 마스터', icon: '🚗', description: '카풀 20회 완료', earned: false },
    { id: 'streak', name: '연속 출근', icon: '🔥', description: '20일 연속 체크인', earned: false },
    { id: 'helper', name: '도움꾼', icon: '🤝', description: '유용한 제보 100좋아요', earned: true, earnedDate: '2026-01-22' },
  ]);

  // 설정
  const [settings, setSettings] = useState({
    from: '수원 영통',
    to: '판교역',
    favoriteRoutes: ['3100', '720'],
    regions: ['서울 전체', '경기 수원시', '경기 성남시'],
    departureTime: '08:00',
    arrivalTime: '09:00',
    notificationEnabled: true,
    morningBriefing: true,
    trafficAlert: true,
  });

  const [isEditing, setIsEditing] = useState(false);

  const regionOptions = [
    '서울 전체', '서울 강남구', '서울 서초구', '서울 송파구',
    '경기 수원시', '경기 성남시', '경기 용인시', '경기 화성시'
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-gray-900">내 정보</h1>
            {activeTab === 'settings' && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-1.5 text-blue-500 font-medium hover:bg-blue-50 rounded-lg transition-colors"
              >
                {isEditing ? '완료' : '편집'}
              </button>
            )}
          </div>

          {/* 탭 */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                activeTab === 'profile' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              프로필
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                activeTab === 'stats' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              통계
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                activeTab === 'settings' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              설정
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-4">
        {activeTab === 'profile' && (
          <>
            {/* 프로필 카드 */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={32} />
                </div>
                <div>
                  <div className="font-bold text-xl">{user.name}</div>
                  <div className="text-sm opacity-80">{user.level}</div>
                  <div className="text-xs opacity-60">{user.joinDate} 가입</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-white/10 rounded-xl p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">{points.total.toLocaleString()}</div>
                  <div className="text-xs opacity-80">포인트</div>
                </div>
                <div className="text-center border-x border-white/20">
                  <div className="text-2xl font-bold">{badges.filter(b => b.earned).length}</div>
                  <div className="text-xs opacity-80">배지</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.streak}</div>
                  <div className="text-xs opacity-80">연속일</div>
                </div>
              </div>
            </div>

            {/* 포인트 현황 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Coins size={20} className="text-yellow-500" />
                  포인트
                </h2>
                <span className="text-sm text-gray-500">이번 달 +{points.thisMonth}P</span>
              </div>

              <div className="space-y-3">
                {points.history.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.action}</div>
                      <div className="text-xs text-gray-500">{item.date}</div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">+{item.points}P</span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-3 py-2 text-blue-500 text-sm font-medium">
                전체 내역 보기
              </button>
            </div>

            {/* 배지 컬렉션 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Award size={20} className="text-purple-500" />
                  배지 컬렉션
                </h2>
                <span className="text-sm text-gray-500">{badges.filter(b => b.earned).length}/{badges.length}</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`text-center p-3 rounded-xl ${
                      badge.earned ? 'bg-purple-50' : 'bg-gray-50 opacity-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <div className="text-xs font-medium text-gray-900">{badge.name}</div>
                    {badge.earned && (
                      <div className="text-xs text-purple-600 mt-0.5">획득</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'stats' && (
          <>
            {/* 출퇴근 요약 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-500" />
                출퇴근 통계
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <Calendar size={24} className="text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stats.totalCommutes}</div>
                  <div className="text-sm text-gray-500">총 출근일</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <Clock size={24} className="text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stats.savedMinutes}</div>
                  <div className="text-sm text-gray-500">절약한 시간(분)</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <Zap size={24} className="text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stats.streak}</div>
                  <div className="text-sm text-gray-500">현재 연속일</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <Star size={24} className="text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stats.longestStreak}</div>
                  <div className="text-sm text-gray-500">최장 연속일</div>
                </div>
              </div>
            </div>

            {/* 이번 달 상세 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">이번 달</h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">출근일</span>
                  <span className="font-semibold text-gray-900">{stats.monthlyCommutes}일</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">평균 소요시간</span>
                  <span className="font-semibold text-gray-900">{stats.avgTime}분</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">획득 포인트</span>
                  <span className="font-semibold text-green-600">+{points.thisMonth}P</span>
                </div>
              </div>
            </div>

            {/* 월별 그래프 (간단히) */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">월별 출근 현황</h2>
              <div className="flex items-end justify-between h-24 px-2">
                {[12, 18, 15, 20, 22, 18].map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div
                      className="w-8 bg-blue-400 rounded-t"
                      style={{ height: `${val * 4}px` }}
                    />
                    <span className="text-xs text-gray-500">{8 + idx}월</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <>
            {/* 출퇴근 경로 */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-blue-500" />
                출퇴근 경로
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">출발지</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={settings.from}
                      onChange={(e) => setSettings({ ...settings, from: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2.5"
                    />
                  ) : (
                    <div className="font-medium text-gray-900 py-2">{settings.from}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">도착지</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={settings.to}
                      onChange={(e) => setSettings({ ...settings, to: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2.5"
                    />
                  ) : (
                    <div className="font-medium text-gray-900 py-2">{settings.to}</div>
                  )}
                </div>
              </div>
            </div>

            {/* 관심 노선 */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bus size={20} className="text-green-500" />
                관심 노선
              </h2>

              <div className="flex flex-wrap gap-2 mb-3">
                {settings.favoriteRoutes.map((route, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1"
                  >
                    {route}번
                    {isEditing && (
                      <button
                        onClick={() => setSettings({
                          ...settings,
                          favoriteRoutes: settings.favoriteRoutes.filter((_, i) => i !== idx)
                        })}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {isEditing && (
                <button className="text-blue-500 text-sm font-medium flex items-center gap-1">
                  <Plus size={16} />
                  노선 추가
                </button>
              )}
            </div>

            {/* 알림 설정 */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bell size={20} className="text-yellow-500" />
                알림 설정
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-900">아침 출근 브리핑</span>
                    <p className="text-xs text-gray-500">매일 아침 출근 정보 알림</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, morningBriefing: !settings.morningBriefing })}
                    className={`w-12 h-7 rounded-full transition-colors relative ${
                      settings.morningBriefing ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.morningBriefing ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-900">교통 이슈 알림</span>
                    <p className="text-xs text-gray-500">실시간 교통 이슈 발생 시</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, trafficAlert: !settings.trafficAlert })}
                    className={`w-12 h-7 rounded-full transition-colors relative ${
                      settings.trafficAlert ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.trafficAlert ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-900">파업 알림</span>
                    <p className="text-xs text-gray-500">파업 확정 시 즉시 알림</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, notificationEnabled: !settings.notificationEnabled })}
                    className={`w-12 h-7 rounded-full transition-colors relative ${
                      settings.notificationEnabled ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.notificationEnabled ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* 저장 버튼 */}
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} />
                저장하기
              </button>
            )}
          </>
        )}
      </main>
    </div>
  );
}
