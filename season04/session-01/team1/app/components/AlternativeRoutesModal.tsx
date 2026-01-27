'use client';

import { X, Clock, AlertTriangle, MapPin, ArrowRight } from 'lucide-react';

interface AlternativeRoutesModalProps {
  from: string;
  to: string;
  onClose: () => void;
}

interface Route {
  id: number;
  type: string;
  duration: number;
  extra: number;
  details: string[];
  isRecommended: boolean;
}

export default function AlternativeRoutesModal({
  from,
  to,
  onClose,
}: AlternativeRoutesModalProps) {
  const routes: Route[] = [
    {
      id: 1,
      type: '지하철 분당선 → 신분당선',
      duration: 80,
      extra: 20,
      details: ['수원역에서 분당선 탑승', '강남역에서 신분당선 환승', '판교역 도착'],
      isRecommended: true,
    },
    {
      id: 2,
      type: '버스 → 지하철 환승',
      duration: 95,
      extra: 35,
      details: ['10분 도보 후 지하철 탑승', '2회 환승 필요', '예상 소요 시간 증가'],
      isRecommended: false,
    },
  ];

  const departureTimes = [
    { time: '7:40', note: '9시 출근 기준' },
    { time: '7:20', note: '8시 30분 출근 기준' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full bg-card rounded-t-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom">
        <div className="flex items-center justify-between sticky top-0 bg-card z-10">
          <h2 className="text-xl font-bold text-foreground">대체 경로</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={20} className="text-foreground" />
          </button>
        </div>

        {/* Current Route (Unavailable) */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">평소 경로 (파업으로 이용 불가)</p>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-destructive" />
              <span className="font-semibold text-destructive">3100번 광역버스</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-destructive/80">
              <Clock size={16} />
              <span>평소 1시간 운행 중</span>
            </div>
          </div>
        </div>

        {/* Alternative Routes */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">추천 대체 경로</p>
          <div className="space-y-3">
            {routes.map((route) => (
              <div
                key={route.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  route.isRecommended
                    ? 'bg-primary/5 border-primary'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                {route.isRecommended && (
                  <div className="inline-block px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-semibold mb-2">
                    추천
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{route.type}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-lg font-bold text-foreground">
                          <Clock size={18} />
                          {route.duration}분
                        </div>
                        <div className="text-sm text-destructive">
                          +{route.extra}분 <span className="text-xs text-destructive/70">(평소 대비)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {route.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-foreground">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        {detail}
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-4 py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                    지도에서 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Departure Times */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">권장 출발 시각</p>
          <div className="space-y-2">
            {departureTimes.map((item, idx) => (
              <div key={idx} className="p-3 bg-muted rounded-lg flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">{item.time}</span>
                <span className="text-sm text-muted-foreground">{item.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <p className="text-sm font-semibold text-foreground">경로 요약</p>
          <div className="flex items-center justify-between text-sm text-foreground">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              <span>{from}</span>
            </div>
            <ArrowRight size={16} className="text-muted-foreground" />
            <span className="text-right">{to}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
