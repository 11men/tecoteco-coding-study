'use client';

import { useState } from 'react';
import { X, MapPin, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  onClose: () => void;
  onRegister: (from: string, to: string) => void;
  initialFrom?: string;
  initialTo?: string;
}

const popularLocations = [
  { name: '영통역', region: '수원' },
  { name: '판교역', region: '성남' },
  { name: '강남역', region: '서울' },
  { name: '서울역', region: '서울' },
  { name: '인천공항', region: '인천' },
  { name: '여의도', region: '서울' },
];

export default function OnboardingModal({
  onClose,
  onRegister,
  initialFrom = '',
  initialTo = '',
}: OnboardingModalProps) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [step, setStep] = useState<'from' | 'to'>('from');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSelect = (location: string) => {
    if (step === 'from') {
      setFrom(location);
      setStep('to');
      setShowSuggestions(false);
    } else {
      setTo(location);
    }
  };

  const handleRegister = () => {
    if (from.trim() && to.trim()) {
      onRegister(from, to);
    }
  };

  const isComplete = from.trim() && to.trim();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full bg-card rounded-t-2xl p-6 space-y-6 animate-in slide-in-from-bottom">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">출퇴근 경로 설정</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} className="text-foreground" />
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">출발지</label>
          <div className="relative">
            <div className="flex items-center gap-2 px-4 py-3 bg-input rounded-lg border border-border focus-within:ring-2 focus-within:ring-primary">
              <MapPin size={18} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="출발지를 입력하세요"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
            {showSuggestions && step === 'from' && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-2 z-10">
                {popularLocations.map((loc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(loc.name)}
                    className="w-full text-left px-3 py-2 hover:bg-muted rounded transition-colors text-sm text-foreground"
                  >
                    {loc.name} <span className="text-xs text-muted-foreground">({loc.region})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">도착지</label>
          <div className="relative">
            <div className="flex items-center gap-2 px-4 py-3 bg-input rounded-lg border border-border focus-within:ring-2 focus-within:ring-primary">
              <MapPin size={18} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="도착지를 입력하세요"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
            {showSuggestions && step === 'to' && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-2 z-10">
                {popularLocations
                  .filter((loc) => loc.name !== from)
                  .map((loc, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(loc.name)}
                      className="w-full text-left px-3 py-2 hover:bg-muted rounded transition-colors text-sm text-foreground"
                    >
                      {loc.name} <span className="text-xs text-muted-foreground">({loc.region})</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        {from && to && (
          <div className="p-4 bg-muted rounded-lg flex items-center gap-3">
            <span className="text-sm text-foreground">{from}</span>
            <ArrowRight size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">{to}</span>
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={!isComplete}
          className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          경로 등록 완료
        </button>
      </div>
    </div>
  );
}
