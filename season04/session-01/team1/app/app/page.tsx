'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import StrikeStatusBanner from '@/components/StrikeStatusBanner';
import MyRouteCard from '@/components/MyRouteCard';
import AlternativeRoutesModal from '@/components/AlternativeRoutesModal';
import OnboardingModal from '@/components/OnboardingModal';
import StrikeDetailsPage from '@/components/StrikeDetailsPage';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'home' | 'details'>('home');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAlternativeRoutes, setShowAlternativeRoutes] = useState(false);
  const [userRoute, setUserRoute] = useState<{
    from: string;
    to: string;
    registered: boolean;
  }>({
    from: '',
    to: '',
    registered: false,
  });

  const [strikeData, setStrikeData] = useState({
    isStrike: true,
    status: 'ongoing' as 'warning' | 'confirmed' | 'partial' | 'ongoing',
    affectedRegion: '서울 전역',
    affectedBusTypes: ['시내버스', '광역버스 일부'],
    operationRate: 30,
    hasImpact: true,
    source: '서울시 교통정책과',
    lastUpdated: '2026년 1월 27일 오후 3시',
  });

  const handleRegisterRoute = (from: string, to: string) => {
    setUserRoute({
      from,
      to,
      registered: true,
    });
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSettingsClick={() => setShowOnboarding(true)} />

      {currentPage === 'home' ? (
        <main className="pb-20">
          <StrikeStatusBanner
            isStrike={strikeData.isStrike}
            status={strikeData.status}
            onClick={() => setCurrentPage('details')}
          />

          {userRoute.registered ? (
            <>
              <MyRouteCard
                from={userRoute.from}
                to={userRoute.to}
                hasImpact={strikeData.hasImpact}
                onViewAlternatives={() => setShowAlternativeRoutes(true)}
              />
            </>
          ) : (
            <div className="p-6">
              <button
                onClick={() => setShowOnboarding(true)}
                className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                출퇴근 경로 등록하기
              </button>
            </div>
          )}
        </main>
      ) : (
        <StrikeDetailsPage
          strikeData={strikeData}
          onBack={() => setCurrentPage('home')}
          userRoute={userRoute}
        />
      )}

      {showOnboarding && (
        <OnboardingModal
          onClose={() => setShowOnboarding(false)}
          onRegister={handleRegisterRoute}
          initialFrom={userRoute.from}
          initialTo={userRoute.to}
        />
      )}

      {showAlternativeRoutes && userRoute.registered && (
        <AlternativeRoutesModal
          from={userRoute.from}
          to={userRoute.to}
          onClose={() => setShowAlternativeRoutes(false)}
        />
      )}
    </div>
  );
}
