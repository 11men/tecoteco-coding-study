"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    MessageSquare,
    HelpCircle,
    Heart,
    ThumbsUp,
    Clock,
    ChevronRight,
    Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_COMMUNITY_POSTS } from "@/lib/mock-data";
import type { BoardType } from "@/lib/types";

const BOARD_TABS: { value: BoardType | "ALL"; label: string }[] = [
    { value: "ALL", label: "전체" },
    { value: "NOISE_HELP", label: "소음 고민" },
    { value: "FREE", label: "자유" },
    { value: "QNA", label: "Q&A" },
];

const BOARD_TYPE_BADGE: Record<BoardType, { label: string; color: string }> = {
    FREE: { label: "자유", color: "bg-accent-teal/10 text-accent-teal" },
    NOISE_HELP: { label: "소음 고민", color: "bg-noise-loud/10 text-noise-loud" },
    QNA: { label: "Q&A", color: "bg-primary/10 text-primary" },
};

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState<BoardType | "ALL">("ALL");

    const filteredPosts =
        activeTab === "ALL"
            ? MOCK_COMMUNITY_POSTS
            : MOCK_COMMUNITY_POSTS.filter((p) => p.boardType === activeTab);

    return (
        <div className="bg-background min-h-dvh">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background border-b border-card-border">
                <div className="flex h-14 items-center gap-2 px-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
                        <Volume2 size={15} />
                    </div>
                    <h1 className="text-sm font-bold text-foreground">커뮤니티</h1>
                </div>
                {/* Tabs */}
                <div className="tab-bar px-2">
                    {BOARD_TABS.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setActiveTab(tab.value)}
                            className={cn("tab-item", activeTab === tab.value && "active")}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Write button */}
            <div className="px-4 pt-3 pb-1">
                <button
                    type="button"
                    className="w-full rounded-xl border border-dashed border-card-border py-3.5 text-xs text-muted"
                >
                    ✏️ 새 게시글 작성하기 (준비 중)
                </button>
            </div>

            {/* Post list */}
            <div className="px-4">
                {filteredPosts.map((post, i) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                    >
                        <Link
                            href={`/community/${post.id}`}
                            className={cn(
                                "flex items-start gap-3 py-4 card-hover",
                                i < filteredPosts.length - 1 && "border-b border-card-border"
                            )}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span
                                        className={cn(
                                            "rounded px-1.5 py-0.5 text-[9px] font-bold",
                                            BOARD_TYPE_BADGE[post.boardType].color
                                        )}
                                    >
                                        {BOARD_TYPE_BADGE[post.boardType].label}
                                    </span>
                                    {post.region && (
                                        <span className="text-[10px] text-muted-foreground">
                                            {post.region}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-sm font-bold text-foreground line-clamp-1">
                                    {post.title}
                                </h3>
                                <p className="mt-0.5 text-xs text-muted line-clamp-1">
                                    {post.content}
                                </p>
                                <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                                    <span>{post.nickname}</span>
                                    <span className="flex items-center gap-0.5">
                                        <ThumbsUp size={9} />
                                        {post.likeCount}
                                    </span>
                                    <span className="flex items-center gap-0.5">
                                        <MessageSquare size={9} />
                                        {post.commentCount}
                                    </span>
                                    <span>{post.createdAt}</span>
                                </div>
                            </div>
                            <ChevronRight size={16} className="shrink-0 text-muted-foreground mt-3" />
                        </Link>
                    </motion.div>
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <div className="py-16 text-center">
                    <p className="text-sm text-muted">게시글이 없습니다</p>
                </div>
            )}
        </div>
    );
}
