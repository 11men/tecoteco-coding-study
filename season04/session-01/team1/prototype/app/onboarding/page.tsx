'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bus,
  Bell,
  MapPin,
  Clock,
  Route,
  ChevronRight
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState({
    from: '',
    to: '',
    notificationEnabled: false,
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      router.push('/');
    }
  };

  const handleSkip = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 진행 표시 */}
      <div className="px-4 pt-6">
        <div className="flex gap-2 mb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                s <= step ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="text-right text-sm text-gray-500">
          {step} / {totalSteps}
        </div>
      </div>

      {/* 콘텐츠 */}
      <main className="flex-1 flex flex-col justify-center px-4">
        <div className="w-full">
          {/* Step 1: 환영 */}
          {step === 1 && (
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bus size={48} className="text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                파업 출근 비서에<br />오신 것을 환영합니다
              </h1>
              <p className="text-gray-600 mb-8">
                파업 소식을 빠르게 전달하고<br />
                대체 출퇴근 경로를 안내해드립니다.
              </p>

              <div className="space-y-4 text-left bg-gray-50 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bell size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">실시간 파업 알림</div>
                    <div className="text-sm text-gray-500">파업 확정 시 즉시 알려드려요</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Route size={20} className="text-green-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">맞춤 대체 경로</div>
                    <div className="text-sm text-gray-500">내 경로에 맞는 대안을 제시해요</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">권장 출발 시각</div>
                    <div className="text-sm text-gray-500">지각 없이 출근할 수 있도록 안내해요</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: 알림 권한 */}
          {step === 2 && (
            <div className="text-center">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell size={48} className="text-yellow-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                알림을 받으시겠어요?
              </h1>
              <p className="text-gray-600 mb-8">
                파업 확정 시 푸시 알림으로<br />
                빠르게 알려드립니다.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSettings({ ...settings, notificationEnabled: true });
                    handleNext();
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Bell size={18} />
                  알림 허용하기
                </button>
                <button
                  onClick={() => {
                    setSettings({ ...settings, notificationEnabled: false });
                    handleNext();
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-medium transition-colors"
                >
                  나중에 하기
                </button>
              </div>
            </div>
          )}

          {/* Step 3: 경로 등록 */}
          {step === 3 && (
            <div>
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin size={48} className="text-blue-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  출퇴근 경로를 등록해주세요
                </h1>
                <p className="text-gray-600">
                  맞춤 파업 알림과 대체 경로를<br />
                  받아보실 수 있어요.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    출발지
                  </label>
                  <input
                    type="text"
                    value={settings.from}
                    onChange={(e) => setSettings({ ...settings, from: e.target.value })}
                    placeholder="예: 수원 영통, 강남역"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    도착지
                  </label>
                  <input
                    type="text"
                    value={settings.to}
                    onChange={(e) => setSettings({ ...settings, to: e.target.value })}
                    placeholder="예: 판교역, 삼성역"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="px-4 pb-8 space-y-3">
        {step !== 2 && (
          <button
            onClick={handleNext}
            disabled={step === 3 && (!settings.from || !settings.to)}
            className={`w-full py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
              step === 3 && (!settings.from || !settings.to)
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white'
            }`}
          >
            {step === totalSteps ? '시작하기' : '다음'}
            <ChevronRight size={18} />
          </button>
        )}

        {step === 3 && (
          <button
            onClick={handleSkip}
            className="w-full text-gray-500 py-2 font-medium hover:text-gray-700 transition-colors"
          >
            나중에 등록하기
          </button>
        )}
      </div>
    </div>
  );
}
