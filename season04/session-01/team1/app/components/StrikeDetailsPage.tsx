'use client';

import { ArrowLeft, MapPin, Bus, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface StrikeDetailsPageProps {
  strikeData: {
    isStrike: boolean;
    status: 'warning' | 'confirmed' | 'partial' | 'ongoing';
    affectedRegion: string;
    affectedBusTypes: string[];
    operationRate: number;
    hasImpact: boolean;
    source: string;
    lastUpdated: string;
  };
  userRoute: {
    from: string;
    to: string;
    registered: boolean;
  };
  onBack: () => void;
}

export default function StrikeDetailsPage({
  strikeData,
  userRoute,
  onBack,
}: StrikeDetailsPageProps) {
  const getStatusBadge = () => {
    switch (strikeData.status) {
      case 'warning':
        return { label: '파업 예고', color: 'bg-yellow-100 text-yellow-800' };
      case 'confirmed':
        return { label: '파업 확정', color: 'bg-orange-100 text-orange-800' };
      case 'partial':
        return { label: '부분 파업', color: 'bg-red-100 text-red-800' };
      case 'ongoing':
        return { label: '파업 진행 중', color: 'bg-destructive/20 text-destructive' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border p-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h2 className="text-xl font-bold text-foreground">파업 상세 정보</h2>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusBadge.color}`}>
            🔴 {statusBadge.label}
          </span>
          <span className="text-xs text-muted-foreground">{strikeData.lastUpdated} 기준</span>
        </div>

        {/* Affected Region */}
        <div className="bg-card rounded-lg border border-border p-6 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">파업 지역</h3>
          </div>
          <p className="text-lg font-bold text-foreground ml-8">{strikeData.affectedRegion}</p>
        </div>

        {/* Affected Bus Types */}
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Bus size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">영향받는 버스</h3>
          </div>
          <div className="space-y-2 ml-8">
            {strikeData.affectedBusTypes.map((type, idx) => (
              <div
                key={idx}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-900 text-sm font-medium"
              >
                • {type}
              </div>
            ))}
          </div>
        </div>

        {/* Operation Status */}
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">운행 현황</h3>
          </div>
          <div className="ml-8 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-foreground">평소 대비 운행률</span>
              <span className="font-bold text-lg text-destructive">{strikeData.operationRate}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-destructive"
                style={{ width: `${strikeData.operationRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* User Route Impact */}
        {userRoute.registered && (
          <div className="bg-card rounded-lg border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              {strikeData.hasImpact ? (
                <>
                  <AlertCircle size={20} className="text-destructive" />
                  내 경로 영향도
                </>
              ) : (
                <>
                  <CheckCircle size={20} className="text-green-600" />
                  내 경로 상태
                </>
              )}
            </h3>
            <div className={`p-4 rounded-lg ${strikeData.hasImpact ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <p
                className={`font-semibold ${strikeData.hasImpact ? 'text-red-900' : 'text-green-900'}`}
              >
                {strikeData.hasImpact
                  ? `${userRoute.from} → ${userRoute.to} 경로가 영향받습니다`
                  : `${userRoute.from} → ${userRoute.to} 경로는 안전합니다`}
              </p>
              <p className={`text-sm mt-1 ${strikeData.hasImpact ? 'text-red-700' : 'text-green-700'}`}>
                {strikeData.hasImpact
                  ? '대체 경로로 이동하시기 바랍니다'
                  : '평소대로 이동하셔도 됩니다'}
              </p>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="bg-muted rounded-lg p-6 space-y-3">
          <h3 className="font-semibold text-foreground">정보 출처</h3>
          <p className="text-sm text-foreground">{strikeData.source}</p>
          <p className="text-xs text-muted-foreground">기준 시각: {strikeData.lastUpdated}</p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <button className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            지도에서 대체 경로 찾기
          </button>
          <button
            onClick={onBack}
            className="w-full py-3 px-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    </div>
  );
}
