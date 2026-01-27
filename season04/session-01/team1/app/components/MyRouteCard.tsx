'use client';

import { MapPin, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';

interface MyRouteCardProps {
  from: string;
  to: string;
  hasImpact: boolean;
  onViewAlternatives: () => void;
}

export default function MyRouteCard({
  from,
  to,
  hasImpact,
  onViewAlternatives,
}: MyRouteCardProps) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">내 경로</h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">출발지</p>
            <p className="font-semibold text-foreground">{from}</p>
          </div>
          <div className="text-2xl text-muted-foreground">→</div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">도착지</p>
            <p className="font-semibold text-foreground">{to}</p>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          {hasImpact ? (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-destructive">내 경로가 영향받습니다</p>
                <p className="text-sm text-destructive/80">대체 경로를 확인하고 출근 계획을 변경하세요</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">내 경로는 영향받지 않습니다</p>
                <p className="text-sm text-green-700">평소대로 이동하셔도 됩니다</p>
              </div>
            </div>
          )}
        </div>

        {hasImpact && (
          <button
            onClick={onViewAlternatives}
            className="w-full mt-4 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group"
          >
            대체 경로 확인하기
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
