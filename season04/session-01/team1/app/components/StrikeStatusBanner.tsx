'use client';

import { AlertCircle, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface StrikeStatusBannerProps {
  isStrike: boolean;
  status: 'warning' | 'confirmed' | 'partial' | 'ongoing';
  onClick: () => void;
}

export default function StrikeStatusBanner({
  isStrike,
  status,
  onClick,
}: StrikeStatusBannerProps) {
  const getStatusDisplay = () => {
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
          color: 'bg-destructive/10 border-destructive',
          textColor: 'text-destructive',
          badgeColor: 'bg-destructive/20 text-destructive',
        };
    }
  };

  const display = getStatusDisplay();
  const Icon = display.icon;

  if (!isStrike) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-6">
        <div className="bg-green-50 border border-green-300 rounded-lg p-6 flex items-center gap-4">
          <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
          <div>
            <h2 className="font-bold text-green-900">운행 정상입니다</h2>
            <p className="text-sm text-green-700">현재 버스 파업이 없습니다</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`max-w-2xl mx-auto px-6 py-6 w-full text-left transition-all hover:scale-105 duration-300`}
    >
      <div
        className={`${display.color} border-2 rounded-xl p-6 flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow`}
      >
        <div className="flex items-center gap-4">
          <Icon className={`w-8 h-8 ${display.textColor} flex-shrink-0`} />
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${display.badgeColor}`}>
              🔴 {display.label}
            </span>
            <h2 className={`font-bold text-lg ${display.textColor}`}>오늘 버스 파업이 있습니다</h2>
            <p className={`text-sm ${display.textColor} opacity-80`}>자세한 정보를 확인하세요</p>
          </div>
        </div>
        <div className={`text-2xl ${display.textColor}`}>→</div>
      </div>
    </button>
  );
}
