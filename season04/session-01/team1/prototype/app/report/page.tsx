'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  XCircle,
  CheckCircle,
  MapPin,
  Send,
  Clock,
  Info,
  Home
} from 'lucide-react';

export default function ReportPage() {
  const [reportType, setReportType] = useState<'strike' | 'resume' | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const regions = [
    '서울 강남구', '서울 서초구', '서울 송파구', '서울 강동구',
    '서울 마포구', '서울 영등포구', '서울 중구', '서울 종로구',
    '경기 수원시', '경기 성남시', '경기 용인시', '경기 화성시'
  ];

  const recentReports = [
    { id: 1, type: 'strike', region: '서울 강남구', route: '146번', time: '10분 전', status: '검증 중' },
    { id: 2, type: 'strike', region: '서울 서초구', route: '3412번', time: '25분 전', status: '확인됨' },
    { id: 3, type: 'resume', region: '경기 성남시', route: '55번', time: '1시간 전', status: '확인됨' },
  ];

  const handleSubmit = () => {
    if (!reportType || !selectedRegion) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
            <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">현장 제보</h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6">
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">제보 완료!</h2>
            <p className="text-gray-600 mb-6">
              소중한 제보 감사합니다.<br />
              검증 후 정보에 반영됩니다.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              <Home size={18} />
              홈으로 돌아가기
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">현장 제보</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* 제보 유형 선택 */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">무엇을 제보하시나요?</h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setReportType('strike')}
              className={`p-4 rounded-xl border-2 transition-all ${
                reportType === 'strike'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <XCircle size={32} className={`mx-auto mb-2 ${reportType === 'strike' ? 'text-red-500' : 'text-gray-400'}`} />
              <div className="font-medium text-gray-900">버스 안 와요</div>
              <div className="text-sm text-gray-500">운행 중단 제보</div>
            </button>

            <button
              onClick={() => setReportType('resume')}
              className={`p-4 rounded-xl border-2 transition-all ${
                reportType === 'resume'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CheckCircle size={32} className={`mx-auto mb-2 ${reportType === 'resume' ? 'text-green-500' : 'text-gray-400'}`} />
              <div className="font-medium text-gray-900">버스 다녀요</div>
              <div className="text-sm text-gray-500">운행 재개 제보</div>
            </button>
          </div>
        </div>

        {/* 상세 정보 입력 */}
        {reportType && (
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">상세 정보</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1.5">지역 *</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3"
                >
                  <option value="">지역을 선택하세요</option>
                  {regions.map((region, idx) => (
                    <option key={idx} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1.5">버스 노선 (선택)</label>
                <input
                  type="text"
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                  placeholder="예: 146, 3412"
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1.5">상세 내용 (선택)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="현장 상황을 알려주세요"
                  rows={3}
                  className="w-full border rounded-xl px-4 py-3 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <MapPin size={16} className="text-blue-500" />
                <span>현재 위치가 자동으로 태그됩니다</span>
              </div>
            </div>
          </div>
        )}

        {/* 제보하기 버튼 */}
        {reportType && (
          <button
            onClick={handleSubmit}
            disabled={!selectedRegion}
            className={`w-full py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
              selectedRegion
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={18} />
            제보하기
          </button>
        )}

        {/* 최근 제보 현황 */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-blue-500" />
            최근 제보 현황
          </h2>

          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between py-3 border-b last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  {report.type === 'strike' ? (
                    <XCircle size={20} className="text-red-500" />
                  ) : (
                    <CheckCircle size={20} className="text-green-500" />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{report.region}</div>
                    <div className="text-sm text-gray-500">
                      {report.route} · {report.time}
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                  report.status === '확인됨'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 안내 */}
        <div className="bg-blue-50 rounded-xl p-4 text-sm">
          <div className="font-medium mb-2 flex items-center gap-2 text-blue-900">
            <Info size={16} className="text-blue-600" />
            제보 안내
          </div>
          <ul className="space-y-1 text-blue-700">
            <li>• 동일 지역 3건 이상 제보 시 검토 대상</li>
            <li>• 검증된 제보는 정보에 반영됩니다</li>
            <li>• 허위 제보는 이용 제한될 수 있습니다</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
