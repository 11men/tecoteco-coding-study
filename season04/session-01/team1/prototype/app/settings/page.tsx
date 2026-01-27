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
  User
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    from: '수원 영통',
    to: '판교역',
    favoriteRoutes: ['3100', '720'],
    regions: ['서울 전체', '경기 수원시', '경기 성남시'],
    departureTime: '08:00',
    arrivalTime: '09:00',
    notificationEnabled: true,
    notificationTime: '전날 밤 10시',
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
        <div className="px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">내 정보</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-1.5 text-blue-500 font-medium hover:bg-blue-50 rounded-lg transition-colors"
          >
            {isEditing ? '완료' : '편집'}
          </button>
        </div>
      </header>

      <main className="px-4 py-6 space-y-4">
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
                  className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="출발지 입력"
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
                  className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="도착지 입력"
                />
              ) : (
                <div className="font-medium text-gray-900 py-2">{settings.to}</div>
              )}
            </div>
          </div>
        </div>

        {/* 출퇴근 시간 */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-orange-500" />
            출퇴근 시간
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1.5">출발 시간</label>
              {isEditing ? (
                <input
                  type="time"
                  value={settings.departureTime}
                  onChange={(e) => setSettings({ ...settings, departureTime: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2.5"
                />
              ) : (
                <div className="font-medium text-gray-900 py-2">{settings.departureTime}</div>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1.5">도착 희망</label>
              {isEditing ? (
                <input
                  type="time"
                  value={settings.arrivalTime}
                  onChange={(e) => setSettings({ ...settings, arrivalTime: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2.5"
                />
              ) : (
                <div className="font-medium text-gray-900 py-2">{settings.arrivalTime}</div>
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
            <button className="text-blue-500 text-sm font-medium flex items-center gap-1 hover:text-blue-600">
              <Plus size={16} />
              노선 추가
            </button>
          )}
        </div>

        {/* 관심 지역 */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Map size={20} className="text-purple-500" />
            관심 지역
          </h2>

          <div className="flex flex-wrap gap-2 mb-3">
            {settings.regions.map((region, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1"
              >
                {region}
                {isEditing && (
                  <button
                    onClick={() => setSettings({
                      ...settings,
                      regions: settings.regions.filter((_, i) => i !== idx)
                    })}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                )}
              </span>
            ))}
          </div>

          {isEditing && (
            <select
              className="w-full border rounded-lg px-3 py-2.5 text-sm text-gray-600"
              onChange={(e) => {
                if (e.target.value && !settings.regions.includes(e.target.value)) {
                  setSettings({
                    ...settings,
                    regions: [...settings.regions, e.target.value]
                  });
                }
                e.target.value = '';
              }}
              defaultValue=""
            >
              <option value="">+ 지역 추가</option>
              {regionOptions
                .filter(r => !settings.regions.includes(r))
                .map((region, idx) => (
                  <option key={idx} value={region}>{region}</option>
                ))}
            </select>
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
              <span className="text-gray-700">푸시 알림</span>
              <button
                onClick={() => setSettings({ ...settings, notificationEnabled: !settings.notificationEnabled })}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  settings.notificationEnabled ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                  settings.notificationEnabled ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">알림 시간</span>
              <span className="text-gray-500 text-sm">{settings.notificationTime}</span>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        {isEditing && (
          <button
            onClick={() => setIsEditing(false)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Save size={18} />
            저장하기
          </button>
        )}
      </main>
    </div>
  );
}
