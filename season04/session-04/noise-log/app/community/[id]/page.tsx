"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    ThumbsUp,
    Clock,
    MessageSquare,
    CornerDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_COMMUNITY_POSTS, MOCK_COMMENTS } from "@/lib/mock-data";
import type { BoardType } from "@/lib/types";

const BADGE: Record<BoardType, { label: string; color: string }> = {
    FREE: { label: "자유", color: "bg-accent-teal/10 text-accent-teal" },
    NOISE_HELP: { label: "소음 고민", color: "bg-noise-loud/10 text-noise-loud" },
    QNA: { label: "Q&A", color: "bg-primary/10 text-primary" },
};

export default function CommunityPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const post = MOCK_COMMUNITY_POSTS.find((p) => p.id === id);
    const comments = MOCK_COMMENTS.filter((c) => c.postId === id);

    if (!post) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <p className="text-base font-semibold">게시글을 찾을 수 없습니다</p>
                    <Link href="/community" className="mt-4 text-sm text-primary">
                        목록으로
                    </Link>
                </div>
            </div>
        );
    }

    const rootComments = comments.filter((c) => !c.parentId);
    const replies = comments.filter((c) => c.parentId);

    return (
        <div className="bg-background min-h-dvh">
            {/* Header */}
            <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-card-border bg-background px-4">
                <Link href="/community" className="flex h-8 w-8 items-center justify-center text-foreground">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-sm font-bold text-foreground truncate">게시글</h1>
            </header>

            {/* Post */}
            <motion.article
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-5 border-b border-card-border"
            >
                <div className="flex items-center gap-2 mb-3">
                    <span className={cn("rounded px-1.5 py-0.5 text-[9px] font-bold", BADGE[post.boardType].color)}>
                        {BADGE[post.boardType].label}
                    </span>
                    {post.region && <span className="text-[10px] text-muted-foreground">{post.region}</span>}
                </div>
                <h2 className="text-base font-bold text-foreground">{post.title}</h2>
                <div className="mt-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f5f5f5] text-[9px] font-bold text-muted">
                        {post.nickname[0]}
                    </div>
                    <span className="text-xs font-medium text-foreground">{post.nickname}</span>
                    <span className="text-[10px] text-muted-foreground">{post.createdAt}</span>
                </div>
                <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                    {post.content}
                </div>
                <div className="mt-5 flex items-center gap-3">
                    <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted"
                    >
                        <ThumbsUp size={12} />
                        좋아요 {post.likeCount}
                    </button>
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                        <MessageSquare size={12} />
                        댓글 {comments.length}
                    </span>
                </div>
            </motion.article>

            {/* Comments */}
            <div className="px-4 py-4">
                <h3 className="mb-4 text-sm font-bold text-foreground">
                    댓글 {comments.length}
                </h3>
                <div className="mb-4 flex gap-2">
                    <textarea
                        placeholder="댓글을 작성하세요 (로그인 필요)"
                        rows={2}
                        disabled
                        className="flex-1 resize-none rounded-xl border border-card-border bg-background px-3 py-2.5 text-xs outline-none placeholder:text-muted-foreground disabled:opacity-50"
                    />
                </div>
                <div>
                    {rootComments.map((comment) => {
                        const commentReplies = replies.filter((r) => r.parentId === comment.id);
                        return (
                            <div key={comment.id} className="py-3 border-b border-card-border last:border-none">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f5f5f5] text-[9px] font-bold text-muted">
                                        {comment.nickname[0]}
                                    </div>
                                    <span className="text-xs font-bold text-foreground">{comment.nickname}</span>
                                    <span className="text-[10px] text-muted-foreground">{comment.createdAt}</span>
                                </div>
                                <p className="text-xs leading-relaxed text-foreground">{comment.content}</p>
                                <div className="mt-1.5 flex items-center gap-3">
                                    <button type="button" className="flex items-center gap-1 text-[10px] text-muted">
                                        <ThumbsUp size={9} /> {comment.likeCount}
                                    </button>
                                    <button type="button" className="text-[10px] text-muted">답글</button>
                                </div>

                                {commentReplies.map((reply) => (
                                    <div key={reply.id} className="ml-8 mt-3 flex gap-2">
                                        <CornerDownRight size={12} className="shrink-0 text-muted-foreground mt-0.5" />
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-[11px] font-bold text-foreground">{reply.nickname}</span>
                                                <span className="text-[10px] text-muted-foreground">{reply.createdAt}</span>
                                            </div>
                                            <p className="text-[11px] leading-relaxed text-foreground">{reply.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
                {comments.length === 0 && (
                    <div className="py-8 text-center">
                        <p className="text-xs text-muted">아직 댓글이 없습니다</p>
                    </div>
                )}
            </div>
        </div>
    );
}
