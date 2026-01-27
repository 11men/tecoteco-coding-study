'use client';

import { useState } from 'react';
import {
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Star,
  MessageCircle,
  Car,
  Plus,
  Filter
} from 'lucide-react';

interface CarpoolRoom {
  id: number;
  driver: {
    name: string;
    rating: number;
    trips: number;
  };
  from: string;
  to: string;
  departureTime: string;
  seats: {
    total: number;
    available: number;
  };
  costPerPerson: number;
  isRecurring: boolean;
}

export default function CarpoolPage() {
  const [activeTab, setActiveTab] = useState<'find' | 'my'>('find');

  const carpoolRooms: CarpoolRoom[] = [
    {
      id: 1,
      driver: { name: '김OO', rating: 4.8, trips: 45 },
      from: '수원 영통',
      to: '판교 테크노밸리',
      departureTime: '07:30',
      seats: { total: 4, available: 2 },
      costPerPerson: 12000,
      isRecurring: true,
    },
    {
      id: 2,
      driver: { name: '이OO', rating: 4.9, trips: 128 },
      from: '수원역',
      to: '강남역',
      departureTime: '08:00',
      seats: { total: 3, available: 1 },
      costPerPerson: 15000,
      isRecurring: true,
    },
    {
      id: 3,
      driver: { name: '박OO', rating: 4.7, trips: 23 },
      from: '광교',
      to: '삼성역',
      departureTime: '07:45',
      seats: { total: 4, available: 3 },
      costPerPerson: 18000,
      isRecurring: false,
    },
  ];

  const myCarpool = {
    id: 100,
    driver: { name: '김OO', rating: 4.8, trips: 45 },
    from: '수원 영통',
    to: '판교 테크노밸리',
    departureTime: '07:30',
    members: ['나', '이OO', '박OO'],
    nextTrip: '내일 (1/28)',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <Users size={24} className="text-green-500" />
            <h1 className="text-xl font-bold text-gray-900">카풀</h1>
          </div>

          {/* 탭 */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('find')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                activeTab === 'find'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              카풀 찾기
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                activeTab === 'my'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              내 카풀
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-4">
        {activeTab === 'find' ? (
          <>
            {/* 검색 필터 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900">출퇴근 경로</span>
                <button className="text-sm text-blue-500 flex items-center gap-1">
                  <Filter size={14} />
                  필터
                </button>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <MapPin size={16} className="text-green-500" />
                <span className="text-gray-700">수원 영통</span>
                <ArrowRight size={16} className="text-gray-400" />
                <span className="text-gray-700">판교역</span>
              </div>
            </div>

            {/* 카풀 목록 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">
                  매칭 가능한 카풀 ({carpoolRooms.length}건)
                </p>
              </div>

              {carpoolRooms.map((room) => (
                <div key={room.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Car size={20} className="text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{room.driver.name}</div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star size={12} className="text-yellow-500 fill-yellow-500" />
                          {room.driver.rating} · {room.driver.trips}회 운행
                        </div>
                      </div>
                    </div>
                    {room.isRecurring && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        정기
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-gray-700">{room.from}</span>
                    <ArrowRight size={14} className="text-gray-400" />
                    <span className="text-gray-700">{room.to}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-gray-400" />
                        <span className="font-medium">{room.departureTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} className="text-gray-400" />
                        <span className="text-green-600 font-medium">
                          {room.seats.available}자리 남음
                        </span>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900">
                      {room.costPerPerson.toLocaleString()}원
                    </div>
                  </div>

                  <button className="w-full py-2.5 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors">
                    참여 신청
                  </button>
                </div>
              ))}
            </div>

            {/* 카풀 등록 버튼 */}
            <button className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
              <Plus size={18} />
              내 차로 카풀 등록하기
            </button>
          </>
        ) : (
          <>
            {/* 내 카풀 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-900">참여 중인 카풀</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  활성
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3 text-sm">
                <MapPin size={14} className="text-green-500" />
                <span className="text-gray-700">{myCarpool.from}</span>
                <ArrowRight size={14} className="text-gray-400" />
                <span className="text-gray-700">{myCarpool.to}</span>
              </div>

              <div className="flex items-center gap-4 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-gray-400" />
                  <span>{myCarpool.departureTime} 출발</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} className="text-gray-400" />
                  <span>{myCarpool.members.length}명</span>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <div className="text-sm text-blue-800">
                  <span className="font-semibold">다음 탑승:</span> {myCarpool.nextTrip}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold flex items-center justify-center gap-1 hover:bg-gray-200 transition-colors">
                  <MessageCircle size={16} />
                  채팅
                </button>
                <button className="flex-1 py-2.5 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors">
                  상세보기
                </button>
              </div>
            </div>

            {/* 카풀 히스토리 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <span className="font-semibold text-gray-900 block mb-3">이용 내역</span>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <div className="text-sm font-medium text-gray-900">수원 영통 → 판교</div>
                      <div className="text-xs text-gray-500">1월 {20 + i}일 · 12,000원</div>
                    </div>
                    <span className="text-xs text-green-600">완료</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 안내 */}
        <div className="bg-green-50 rounded-xl p-4 text-sm">
          <div className="font-medium mb-2 text-green-900">카풀 이용 안내</div>
          <ul className="space-y-1 text-green-700">
            <li>• 출퇴근 시간대 같은 경로 유저와 매칭</li>
            <li>• 유류비 + 톨비를 n분의 1로 분담</li>
            <li>• 정기 카풀로 매일 함께 출퇴근 가능</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
