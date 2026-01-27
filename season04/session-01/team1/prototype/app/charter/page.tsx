'use client';

import { useState } from 'react';
import {
  Bus,
  Building2,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function CharterPage() {
  const [activeTab, setActiveTab] = useState<'request' | 'status'>('request');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');

  const popularRoutes = [
    { id: 1, from: '수원역', to: '판교 테크노밸리', demand: 45 },
    { id: 2, from: '강남역', to: '판교 테크노밸리', demand: 82 },
    { id: 3, from: '사당역', to: '판교 테크노밸리', demand: 38 },
    { id: 4, from: '광교', to: '삼성역', demand: 56 },
  ];

  const existingCharters = [
    {
      id: 1,
      company: 'A회사',
      route: '수원역 → 판교',
      time: '07:30',
      seats: { total: 45, available: 12 },
      pricePerPerson: 8000,
    },
    {
      id: 2,
      company: 'B회사',
      route: '강남역 → 판교',
      time: '08:00',
      seats: { total: 45, available: 5 },
      pricePerPerson: 5000,
    },
  ];

  const myRequest = {
    status: 'pending',
    company: '테코테코',
    route: '수원 영통 → 판교 테크노밸리',
    requestedSeats: 30,
    submittedAt: '2026-01-27',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <Bus size={24} className="text-purple-500" />
            <h1 className="text-xl font-bold text-gray-900">버스 대절</h1>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">B2B</span>
          </div>

          {/* 탭 */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('request')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'request'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              신청하기
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'status'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              신청 현황
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {activeTab === 'request' ? (
          <>
            {/* 기존 운행 노선 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Bus size={18} className="text-purple-500" />
                <span className="font-semibold text-gray-900">참여 가능한 전세버스</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                다른 회사와 함께 이용하여 비용을 절감하세요
              </p>

              <div className="space-y-3">
                {existingCharters.map((charter) => (
                  <div key={charter.id} className="border rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{charter.company}</span>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {charter.seats.available}석 남음
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900 mb-2">
                      <MapPin size={14} className="text-purple-500" />
                      {charter.route}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {charter.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {charter.seats.total}석
                        </span>
                      </div>
                      <span className="font-bold text-purple-600">
                        {charter.pricePerPerson.toLocaleString()}원/인
                      </span>
                    </div>
                    <button className="w-full mt-3 py-2 bg-purple-500 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition-colors">
                      참여 신청
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 새로운 노선 요청 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={18} className="text-purple-500" />
                <span className="font-semibold text-gray-900">우리 회사 전세버스 신청</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">희망 노선</label>
                  <select
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value="">노선을 선택하세요</option>
                    {popularRoutes.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.from} → {route.to} (수요 {route.demand}명)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">예상 이용 인원</label>
                  <input
                    type="number"
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    placeholder="최소 20명 이상"
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                <div className="bg-purple-50 p-3 rounded-lg text-sm">
                  <div className="font-medium text-purple-800 mb-1">예상 비용</div>
                  <div className="text-purple-700">
                    {employeeCount && parseInt(employeeCount) >= 20
                      ? `1인당 약 ${Math.round(400000 / parseInt(employeeCount)).toLocaleString()}원`
                      : '20명 이상 입력 시 계산됩니다'}
                  </div>
                </div>

                <button
                  disabled={!selectedRoute || !employeeCount || parseInt(employeeCount) < 20}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    selectedRoute && employeeCount && parseInt(employeeCount) >= 20
                      ? 'bg-purple-500 text-white hover:bg-purple-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  견적 요청하기
                </button>
              </div>
            </div>

            {/* HR 담당자 연락 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <span className="font-semibold text-gray-900 block mb-3">HR 담당자 직접 상담</span>
              <div className="space-y-2">
                <a href="tel:02-1234-5678" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Phone size={18} className="text-purple-500" />
                  <span className="text-gray-900">02-1234-5678</span>
                </a>
                <a href="mailto:charter@example.com" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Mail size={18} className="text-purple-500" />
                  <span className="text-gray-900">charter@example.com</span>
                </a>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 신청 현황 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-900">내 신청 현황</span>
                <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                  myRequest.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {myRequest.status === 'pending' ? (
                    <>
                      <AlertCircle size={12} />
                      검토 중
                    </>
                  ) : (
                    <>
                      <CheckCircle size={12} />
                      승인됨
                    </>
                  )}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-gray-400" />
                  <span className="text-gray-900">{myRequest.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-purple-500" />
                  <span className="text-gray-900">{myRequest.route}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-gray-900">{myRequest.requestedSeats}명 신청</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-500 text-sm">신청일: {myRequest.submittedAt}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-gray-500 mb-2">진행 상황</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-500">1/3</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span className="text-purple-600 font-medium">신청 완료</span>
                  <span>견적 검토</span>
                  <span>운행 확정</span>
                </div>
              </div>
            </div>

            {/* 예상 일정 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <span className="font-semibold text-gray-900 block mb-3">예상 일정</span>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={16} className="text-purple-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">신청 접수</div>
                    <div className="text-xs text-gray-500">2026-01-27</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Clock size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">견적 회신</div>
                    <div className="text-xs text-gray-400">예상: 1-2 영업일</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bus size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">운행 시작</div>
                    <div className="text-xs text-gray-400">견적 확정 후</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 안내 */}
        <div className="bg-purple-50 rounded-xl p-4 text-sm">
          <div className="font-medium mb-2 text-purple-900">버스 대절 안내</div>
          <ul className="space-y-1 text-purple-700">
            <li>• 20명 이상 단체 이용 시 신청 가능</li>
            <li>• 정기 운행 계약 시 추가 할인</li>
            <li>• 파업 당일 긴급 배차도 가능</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
