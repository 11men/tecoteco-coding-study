'use client';

import { useState } from 'react';
import {
  MessageSquare,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Send,
  TrendingUp,
  Star,
  Filter
} from 'lucide-react';

interface Report {
  id: number;
  type: 'delay' | 'normal' | 'strike';
  user: string;
  userBadge?: string;
  location: string;
  route?: string;
  message: string;
  time: string;
  likes: number;
  verified: boolean;
}

interface ChatRoom {
  id: number;
  name: string;
  route: string;
  members: number;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'rooms' | 'groups'>('feed');

  // 실시간 제보 피드
  const [reports] = useState<Report[]>([
    {
      id: 1,
      type: 'delay',
      user: '김OO',
      userBadge: '제보왕',
      location: '서현역',
      route: '분당선',
      message: '열차 5분 이상 지연 중입니다. 승객 많음.',
      time: '2분 전',
      likes: 12,
      verified: true,
    },
    {
      id: 2,
      type: 'strike',
      user: '이OO',
      location: '수원역',
      route: '3100번',
      message: '버스 운행 완전 중단. 대기 승객 많습니다.',
      time: '5분 전',
      likes: 28,
      verified: true,
    },
    {
      id: 3,
      type: 'normal',
      user: '박OO',
      location: '판교역',
      route: '신분당선',
      message: '신분당선은 정상 운행 중입니다.',
      time: '8분 전',
      likes: 5,
      verified: false,
    },
    {
      id: 4,
      type: 'delay',
      user: '최OO',
      userBadge: '얼리버드',
      location: '강남역',
      message: '2호선 혼잡도 높음. 2~3대 보내야 탈 수 있음.',
      time: '12분 전',
      likes: 18,
      verified: true,
    },
  ]);

  // 경로별 채팅방
  const [chatRooms] = useState<ChatRoom[]>([
    {
      id: 1,
      name: '수원영통 → 판교',
      route: '3100번, 분당선',
      members: 234,
      lastMessage: '오늘 파업 때문에 지하철 타야할 듯...',
      lastTime: '방금',
      unread: 5,
    },
    {
      id: 2,
      name: '강남 → 판교',
      route: '신분당선',
      members: 456,
      lastMessage: '신분당선은 평소랑 똑같아요',
      lastTime: '3분 전',
      unread: 0,
    },
    {
      id: 3,
      name: '수원역 → 삼성역',
      route: '분당선, 2호선',
      members: 189,
      lastMessage: '2호선 좀 밀리는 중',
      lastTime: '10분 전',
      unread: 2,
    },
  ]);

  // 정기 카풀 그룹
  const [carpoolGroups] = useState([
    {
      id: 1,
      name: '영통 → 판교 출근러',
      members: 4,
      maxMembers: 4,
      driver: '김OO',
      driverRating: 4.9,
      departureTime: '07:30',
      status: 'full',
    },
    {
      id: 2,
      name: '광교 → 강남 모닝카풀',
      members: 2,
      maxMembers: 4,
      driver: '이OO',
      driverRating: 4.7,
      departureTime: '08:00',
      status: 'open',
    },
    {
      id: 3,
      name: '동탄 → 판교 정기',
      members: 3,
      maxMembers: 4,
      driver: '박OO',
      driverRating: 4.8,
      departureTime: '07:15',
      status: 'open',
    },
  ]);

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'delay':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'strike':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'normal':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  const getReportBg = (type: string) => {
    switch (type) {
      case 'delay':
        return 'border-l-amber-400';
      case 'strike':
        return 'border-l-red-400';
      case 'normal':
        return 'border-l-green-400';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={24} className="text-purple-500" />
            <h1 className="text-xl font-bold text-gray-900">커뮤니티</h1>
          </div>

          {/* 탭 */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                activeTab === 'feed'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              실시간 제보
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                activeTab === 'rooms'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              채팅방
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                activeTab === 'groups'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              카풀그룹
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-4">
        {activeTab === 'feed' && (
          <>
            {/* 빠른 제보 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="지금 교통 상황을 공유해주세요..."
                    className="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm"
                  />
                </div>
                <button className="p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </div>

            {/* 필터 */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">실시간 제보 피드</span>
              <button className="flex items-center gap-1 text-sm text-gray-500">
                <Filter size={14} />
                내 경로만
              </button>
            </div>

            {/* 제보 목록 */}
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${getReportBg(report.type)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {report.user.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-900 text-sm">{report.user}</span>
                          {report.userBadge && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                              {report.userBadge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin size={10} />
                          {report.location}
                          {report.route && <span>· {report.route}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {report.verified && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                          검증됨
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{report.time}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mb-3">
                    {getReportIcon(report.type)}
                    <p className="text-sm text-gray-700 flex-1">{report.message}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-purple-500">
                      <TrendingUp size={14} />
                      도움됨 {report.likes}
                    </button>
                    <button className="text-xs text-gray-400">신고</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'rooms' && (
          <>
            {/* 내 경로 채팅방 */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-purple-500" />
                <span className="font-semibold text-purple-900">내 경로 채팅방</span>
              </div>
              <p className="text-sm text-purple-700">
                수원 영통 → 판교역 경로의 채팅방에 자동 참여되어 있습니다.
              </p>
            </div>

            {/* 채팅방 목록 */}
            <div className="space-y-3">
              <span className="text-sm font-semibold text-gray-700">경로별 채팅방</span>
              {chatRooms.map((room) => (
                <button
                  key={room.id}
                  className="w-full bg-white rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <MessageSquare size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{room.name}</div>
                        <div className="text-xs text-gray-500">{room.route}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {room.unread > 0 && (
                        <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {room.unread}
                        </span>
                      )}
                      <ChevronRight size={18} className="text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1 mr-2">{room.lastMessage}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {room.members}
                      </span>
                      <span>{room.lastTime}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {activeTab === 'groups' && (
          <>
            {/* 카풀 그룹 안내 */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-green-500" />
                <span className="font-semibold text-green-900">정기 카풀 그룹</span>
              </div>
              <p className="text-sm text-green-700">
                매일 같은 시간에 출퇴근하는 사람들과 함께 카풀하세요.<br/>
                파업 시에도 안정적인 출근이 가능합니다.
              </p>
            </div>

            {/* 카풀 그룹 목록 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">내 경로 카풀 그룹</span>
                <button className="text-sm text-green-600 font-medium">+ 그룹 만들기</button>
              </div>

              {carpoolGroups.map((group) => (
                <div key={group.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">{group.name}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        {group.departureTime} 출발
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      group.status === 'full'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {group.status === 'full' ? '마감' : '모집중'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600">
                        {group.driver.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{group.driver}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star size={10} className="text-yellow-500 fill-yellow-500" />
                          {group.driverRating}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Users size={14} className="text-gray-400" />
                      <span className="text-gray-600">{group.members}/{group.maxMembers}명</span>
                    </div>
                  </div>

                  <button
                    disabled={group.status === 'full'}
                    className={`w-full py-2.5 rounded-lg font-semibold transition-colors ${
                      group.status === 'full'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {group.status === 'full' ? '대기 신청' : '참여 신청'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 안내 */}
        <div className="bg-purple-50 rounded-xl p-4 text-sm">
          <div className="font-medium mb-2 text-purple-900">커뮤니티 이용 안내</div>
          <ul className="space-y-1 text-purple-700">
            <li>• 검증된 제보는 출근 브리핑에 반영됩니다</li>
            <li>• 유용한 제보 시 포인트가 적립됩니다</li>
            <li>• 허위 제보는 이용 제한될 수 있습니다</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
