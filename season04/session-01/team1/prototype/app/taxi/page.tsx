'use client';

import { useState } from 'react';
import {
  Car,
  MapPin,
  Clock,
  ArrowRight,
  Users,
  Zap,
  ExternalLink,
  AlertTriangle,
  TrendingUp,
  Calendar
} from 'lucide-react';

export default function TaxiPage() {
  const [rideType, setRideType] = useState<'solo' | 'share'>('solo');

  const route = {
    from: '수원 영통',
    to: '판교역',
  };

  const taxiOptions = [
    {
      id: 'kakao',
      name: '카카오택시',
      logo: '🚕',
      color: 'bg-yellow-400',
      textColor: 'text-gray-900',
      soloPrice: { min: 45000, max: 55000 },
      sharePrice: { min: 18000, max: 22000 },
      eta: '3분',
      surge: 1.2,
    },
    {
      id: 'tada',
      name: '타다',
      logo: '🚙',
      color: 'bg-blue-600',
      textColor: 'text-white',
      soloPrice: { min: 48000, max: 58000 },
      sharePrice: null,
      eta: '5분',
      surge: 1.0,
    },
    {
      id: 'uber',
      name: '우버',
      logo: '⬛',
      color: 'bg-gray-900',
      textColor: 'text-white',
      soloPrice: { min: 52000, max: 62000 },
      sharePrice: { min: 20000, max: 25000 },
      eta: '7분',
      surge: 1.3,
    },
  ];

  const recentRides = [
    { date: '1/25', from: '수원 영통', to: '판교역', price: 48000, service: '카카오택시' },
    { date: '1/20', from: '강남역', to: '수원 영통', price: 52000, service: '타다' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <Car size={24} className="text-yellow-500" />
            <h1 className="text-xl font-bold text-gray-900">택시</h1>
          </div>

          {/* 탭 */}
          <div className="flex gap-2">
            <button
              onClick={() => setRideType('solo')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 ${
                rideType === 'solo'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Car size={16} />
              일반 호출
            </button>
            <button
              onClick={() => setRideType('share')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 ${
                rideType === 'share'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Users size={16} />
              합승
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* 경로 설정 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <span className="font-semibold text-gray-900 block mb-3">어디로 가시나요?</span>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <input
                type="text"
                placeholder="출발지"
                defaultValue={route.from}
                className="flex-1 bg-transparent outline-none text-gray-900"
              />
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <input
                type="text"
                placeholder="도착지"
                defaultValue={route.to}
                className="flex-1 bg-transparent outline-none text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* 수요 알림 */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-orange-800 mb-1">출퇴근 피크 시간대</div>
            <div className="text-sm text-orange-700">
              현재 택시 수요가 많아 할증이 적용될 수 있습니다
            </div>
          </div>
        </div>

        {/* 택시 옵션 */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">택시 서비스 비교</p>

          {taxiOptions.map((option) => {
            const price = rideType === 'solo' ? option.soloPrice : option.sharePrice;
            if (!price) return null;

            return (
              <div key={option.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${option.color} rounded-lg flex items-center justify-center text-xl`}>
                      {option.logo}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{option.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {option.eta} 후 도착 예정
                      </div>
                    </div>
                  </div>
                  {option.surge > 1 && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <TrendingUp size={12} />
                      {option.surge}x
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {price.min.toLocaleString()} ~ {price.max.toLocaleString()}원
                    </div>
                    {rideType === 'share' && (
                      <div className="text-xs text-green-600">합승 시 예상 금액</div>
                    )}
                  </div>
                  <button className={`px-4 py-2 ${option.color} ${option.textColor} rounded-lg font-semibold flex items-center gap-1`}>
                    <ExternalLink size={14} />
                    호출
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 예약 호출 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-blue-500" />
            <span className="font-semibold text-gray-900">예약 호출</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            내일 출근 택시를 미리 예약하세요
          </p>
          <button className="w-full py-2.5 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
            <Zap size={16} />
            예약 호출하기
          </button>
        </div>

        {/* 최근 이용 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <span className="font-semibold text-gray-900 block mb-3">최근 이용</span>
          <div className="space-y-3">
            {recentRides.map((ride, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    {ride.from} <ArrowRight size={12} /> {ride.to}
                  </div>
                  <div className="text-xs text-gray-500">{ride.date} · {ride.service}</div>
                </div>
                <span className="font-semibold text-gray-900">{ride.price.toLocaleString()}원</span>
              </div>
            ))}
          </div>
        </div>

        {/* 안내 */}
        <div className="bg-yellow-50 rounded-xl p-4 text-sm">
          <div className="font-medium mb-2 text-yellow-900">택시 이용 팁</div>
          <ul className="space-y-1 text-yellow-700">
            <li>• 파업 당일은 택시 수요가 급증합니다</li>
            <li>• 전날 밤 예약 호출을 추천드립니다</li>
            <li>• 합승 이용 시 요금을 절약할 수 있습니다</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
