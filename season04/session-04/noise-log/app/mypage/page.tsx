"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Crown,
    Star,
    Heart,
    FileText,
    CreditCard,
    Settings,
    ChevronRight,
    Mic,
    MessageSquare,
    Bell,
    LogOut,
    Lock,
    Building2,
    Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProLock } from "@/components/ProLock";
import { MOCK_USER, MOCK_PAYMENTS, MOCK_MEASUREMENTS } from "@/lib/mock-user";
import { MOCK_BUILDINGS, MOCK_REVIEWS } from "@/lib/mock-data";

const TABS = ["내 활동", "결제"];

export default function MyPage() {
    const user = MOCK_USER;
    const [activeTab, setActiveTab] = useState("내 활동");
    const myReviews = MOCK_REVIEWS.filter((r) => r.nickname === user.nickname);
    const favoriteBuildings = MOCK_BUILDINGS.filter((b) =>
        user.favoriteBuildings.includes(b.id)
    );

    return (
        <div className="bg-background min-h-dvh pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-card-border bg-background/95 backdrop-blur-xl px-4">
                <h1 className="text-base font-bold text-foreground">마이페이지</h1>
                <button type="button" className="text-muted">
                    <Settings size={20} />
                </button>
            </header>

            {/* Profile Section */}
            <div className="px-4 pt-5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                        {user.nickname[0]}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-foreground">
                                {user.nickname}
                            </span>
                            <span className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                user.plan === "PRO"
                                    ? "bg-accent-purple/10 text-accent-purple"
                                    : "bg-[#f5f5f5] text-muted"
                            )}>
                                {user.plan === "PRO" ? "Pro" : "Basic"}
                            </span>
                        </div>
                        <p className="text-xs text-muted">{user.email}</p>
                    </div>
                </div>

                {/* Membership Card */}
                {user.plan === "BASIC" ? (
                    <div className="mt-4 rounded-2xl bg-gradient-to-r from-accent-purple/10 to-primary/10 border border-accent-purple/15 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Crown size={14} className="text-accent-purple" />
                                    <span className="text-xs font-bold text-foreground">Pro로 업그레이드</span>
                                </div>
                                <p className="text-[10px] text-muted leading-relaxed">
                                    무제한 리뷰 조회, 소음 측정, 건물 비교 등
                                </p>
                            </div>
                            <button
                                type="button"
                                className="shrink-0 rounded-full bg-accent-purple px-4 py-2 text-xs font-bold text-white"
                            >
                                월 3,900원
                            </button>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-accent-purple/20 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-accent-purple"
                                    style={{ width: `${((user.freeViewsTotal - user.freeViewsRemaining) / user.freeViewsTotal) * 100}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-medium text-accent-purple">
                                무료 조회 {user.freeViewsRemaining}/{user.freeViewsTotal}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 rounded-2xl bg-gradient-to-r from-accent-purple to-primary p-4 text-white">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Crown size={14} />
                            <span className="text-xs font-bold">Pro 멤버십</span>
                        </div>
                        <p className="text-[10px] opacity-80">
                            다음 결제일: {user.nextBillingDate}
                        </p>
                    </div>
                )}
            </div>

            <div className="section-divider" />

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-px bg-card-border">
                <div className="bg-background py-4 text-center">
                    <p className="text-lg font-bold text-foreground">{user.reviewCount}</p>
                    <p className="text-[10px] text-muted">작성 리뷰</p>
                </div>
                <div className="bg-background py-4 text-center">
                    <p className="text-lg font-bold text-foreground">{user.favoriteBuildings.length}</p>
                    <p className="text-[10px] text-muted">관심 건물</p>
                </div>
                <div className="bg-background py-4 text-center">
                    <p className="text-lg font-bold text-foreground">{MOCK_MEASUREMENTS.length}</p>
                    <p className="text-[10px] text-muted">소음 측정</p>
                </div>
            </div>

            <div className="section-divider" />

            {/* Tabs */}
            <div className="tab-bar px-2">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={cn("tab-item", activeTab === tab && "active")}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "내 활동" && (
                <motion.div
                    key="activity"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* My Reviews */}
                    <div className="px-4 py-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                                <FileText size={14} /> 내 리뷰
                            </h3>
                            <span className="text-xs text-muted">{myReviews.length}건</span>
                        </div>
                        {myReviews.length > 0 ? (
                            myReviews.map((review) => {
                                const building = MOCK_BUILDINGS.find(
                                    (b) => b.id === review.buildingId
                                );
                                return (
                                    <Link
                                        key={review.id}
                                        href={`/building/${review.buildingId}`}
                                        className="flex items-center gap-3 rounded-xl p-3 -mx-1 hover:bg-[#f5f5f5] transition-colors"
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                                            <Building2 size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-foreground truncate">
                                                {building?.buildingName || building?.address}
                                            </p>
                                            <p className="text-[10px] text-muted truncate">
                                                {review.description}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-0.5 shrink-0">
                                            <Star size={10} className="text-amber-400 fill-amber-400" />
                                            <span className="text-xs font-medium">{review.noiseScore}</span>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <p className="text-xs text-muted text-center py-6">
                                아직 작성한 리뷰가 없습니다
                            </p>
                        )}
                    </div>

                    <div className="section-divider" />

                    {/* Favorite Buildings */}
                    <div className="px-4 py-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                                <Heart size={14} className="text-noise-loud" /> 관심 건물
                            </h3>
                        </div>
                        {favoriteBuildings.map((building) => (
                            <Link
                                key={building.id}
                                href={`/building/${building.id}`}
                                className="flex items-center gap-3 rounded-xl p-3 -mx-1 hover:bg-[#f5f5f5] transition-colors"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5f5f5]">
                                    <Building2 size={16} className="text-muted" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-foreground truncate">
                                        {building.buildingName || building.address}
                                    </p>
                                    <p className="text-[10px] text-muted">
                                        후기 {building.reviewCount}개
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <Star size={10} className="text-amber-400 fill-amber-400" />
                                    <span className="text-xs font-medium">
                                        {building.avgNoiseScore.toFixed(1)}
                                    </span>
                                    <ChevronRight size={14} className="text-muted ml-1" />
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="section-divider" />

                    {/* Noise Measurements - Pro Lock */}
                    <div className="px-4 py-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                                <Mic size={14} className="text-accent-teal" /> 소음 측정 기록
                            </h3>
                        </div>
                        {user.plan === "BASIC" ? (
                            <ProLock label="Pro 전용 기능">
                                <div className="space-y-3">
                                    {MOCK_MEASUREMENTS.map((m) => (
                                        <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#f5f5f5]">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-teal/10">
                                                <Volume2 size={16} className="text-accent-teal" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-medium">{m.location}</p>
                                                <p className="text-[10px] text-muted">{m.date} | {Math.floor(m.duration / 60)}분</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold">{m.avgDecibel}dB</p>
                                                <p className="text-[10px] text-muted">최대 {m.peakDecibel}dB</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ProLock>
                        ) : (
                            <div className="space-y-3">
                                {MOCK_MEASUREMENTS.map((m) => (
                                    <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#f5f5f5]">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-teal/10">
                                            <Volume2 size={16} className="text-accent-teal" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-medium">{m.location}</p>
                                            <p className="text-[10px] text-muted">{m.date} | {Math.floor(m.duration / 60)}분</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold">{m.avgDecibel}dB</p>
                                            <p className="text-[10px] text-muted">최대 {m.peakDecibel}dB</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="section-divider" />

                    {/* Community Activity */}
                    <div className="px-4 py-4">
                        <h3 className="flex items-center gap-1.5 text-sm font-bold text-foreground mb-3">
                            <MessageSquare size={14} className="text-primary" /> 커뮤니티 활동
                        </h3>
                        <div className="space-y-1">
                            <MenuItem label="내 게시글" count={2} href="/community" />
                            <MenuItem label="내 댓글" count={3} href="/community" />
                            <MenuItem label="북마크" count={5} href="/community" />
                            <MenuItem label="신고 현황" count={0} href="/community" />
                        </div>
                    </div>

                    <div className="section-divider" />

                    {/* Settings */}
                    <div className="px-4 py-4">
                        <h3 className="flex items-center gap-1.5 text-sm font-bold text-foreground mb-3">
                            <Settings size={14} /> 설정
                        </h3>
                        <div className="space-y-1">
                            <MenuItem label="알림 설정" icon={<Bell size={16} className="text-muted" />} href="#" />
                            <MenuItem label="연동 계정" desc="카카오 로그인" href="#" />
                            <MenuItem label="로그아웃" icon={<LogOut size={16} className="text-noise-loud" />} href="#" danger />
                        </div>
                    </div>
                </motion.div>
            )}

            {activeTab === "결제" && (
                <motion.div
                    key="payment"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Current Plan */}
                    <div className="px-4 py-4">
                        <h3 className="flex items-center gap-1.5 text-sm font-bold text-foreground mb-3">
                            <CreditCard size={14} /> 현재 플랜
                        </h3>
                        <div className="rounded-xl border border-card-border p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <span className={cn(
                                        "text-sm font-bold",
                                        user.plan === "PRO" ? "text-accent-purple" : "text-foreground"
                                    )}>
                                        {user.plan === "PRO" ? "Pro 멤버십" : "Basic (무료)"}
                                    </span>
                                    <p className="text-[10px] text-muted mt-0.5">
                                        가입일: {user.joinedAt}
                                    </p>
                                </div>
                                {user.plan === "BASIC" && (
                                    <button
                                        type="button"
                                        className="rounded-lg bg-accent-purple px-3 py-1.5 text-[10px] font-bold text-white"
                                    >
                                        업그레이드
                                    </button>
                                )}
                            </div>
                            <div className="space-y-2 text-xs">
                                <PlanFeature label="리뷰 조회" value={user.plan === "PRO" ? "무제한" : `월 ${user.freeViewsTotal}건`} />
                                <PlanFeature label="지도 히트맵" value="무제한" included />
                                <PlanFeature label="리뷰 작성" value="무제한" included />
                                <PlanFeature label="객관적 지표 상세" value={user.plan === "PRO" ? "전체" : "요약만"} locked={user.plan === "BASIC"} />
                                <PlanFeature label="소음 측정 기록" value={user.plan === "PRO" ? "무제한" : "잠김"} locked={user.plan === "BASIC"} />
                                <PlanFeature label="건물 비교" value={user.plan === "PRO" ? "3곳" : "잠김"} locked={user.plan === "BASIC"} />
                                <PlanFeature label="증거 리포트 PDF" value={user.plan === "PRO" ? "무제한" : "잠김"} locked={user.plan === "BASIC"} />
                            </div>
                        </div>
                    </div>

                    <div className="section-divider" />

                    {/* Single Purchase */}
                    <div className="px-4 py-4">
                        <h3 className="text-sm font-bold text-foreground mb-3">단건 리포트</h3>
                        <div className="rounded-xl border border-card-border p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-foreground">건물 상세 리포트 1회</p>
                                    <p className="text-[10px] text-muted">객관적 지표 + AI 예측 + 전체 리뷰</p>
                                </div>
                                <span className="text-sm font-bold text-primary">1,900원</span>
                            </div>
                        </div>
                    </div>

                    <div className="section-divider" />

                    {/* Payment History */}
                    <div className="px-4 py-4">
                        <h3 className="text-sm font-bold text-foreground mb-3">결제 내역</h3>
                        {MOCK_PAYMENTS.length > 0 ? (
                            <div className="space-y-3">
                                {MOCK_PAYMENTS.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center justify-between rounded-xl bg-[#f5f5f5] p-3"
                                    >
                                        <div>
                                            <p className="text-xs font-medium text-foreground">
                                                {payment.description}
                                            </p>
                                            <p className="text-[10px] text-muted">{payment.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-foreground">
                                                {payment.amount.toLocaleString()}원
                                            </p>
                                            <span className="text-[9px] text-muted">
                                                {payment.type === "SUBSCRIPTION" ? "구독" : "단건"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted text-center py-6">
                                결제 내역이 없습니다
                            </p>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

function MenuItem({
    label,
    count,
    desc,
    icon,
    href,
    danger,
}: {
    label: string;
    count?: number;
    desc?: string;
    icon?: React.ReactNode;
    href: string;
    danger?: boolean;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-[#f5f5f5] transition-colors"
        >
            {icon && <span>{icon}</span>}
            <span className={cn("flex-1 text-sm", danger ? "text-noise-loud" : "text-foreground")}>
                {label}
            </span>
            {desc && <span className="text-xs text-muted">{desc}</span>}
            {count !== undefined && (
                <span className="text-xs text-muted">{count}</span>
            )}
            <ChevronRight size={14} className="text-muted" />
        </Link>
    );
}

function PlanFeature({
    label,
    value,
    included,
    locked,
}: {
    label: string;
    value: string;
    included?: boolean;
    locked?: boolean;
}) {
    return (
        <div className="flex items-center justify-between py-1">
            <span className="text-muted">{label}</span>
            <span className={cn(
                "flex items-center gap-1 font-medium",
                locked ? "text-muted-foreground" : included ? "text-noise-quiet" : "text-foreground"
            )}>
                {locked && <Lock size={10} className="text-muted-foreground" />}
                {value}
            </span>
        </div>
    );
}
