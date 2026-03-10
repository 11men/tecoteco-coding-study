import Link from "next/link";
import { Volume2 } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-card-border bg-background">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-bold">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                                <Volume2 size={18} />
                            </div>
                            <span>소음지도</span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted">
                            이사 전에 소음 환경을 미리 확인하세요.
                            <br />
                            더 나은 주거 환경을 위한 첫걸음.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-foreground">서비스</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/map" className="text-sm text-muted transition-colors hover:text-primary">
                                    소음 지도
                                </Link>
                            </li>
                            <li>
                                <Link href="/review" className="text-sm text-muted transition-colors hover:text-primary">
                                    리뷰 작성
                                </Link>
                            </li>
                            <li>
                                <Link href="/community" className="text-sm text-muted transition-colors hover:text-primary">
                                    커뮤니티
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-foreground">지원</h3>
                        <ul className="space-y-2">
                            <li>
                                <span className="text-sm text-muted">자주 묻는 질문</span>
                            </li>
                            <li>
                                <span className="text-sm text-muted">이용약관</span>
                            </li>
                            <li>
                                <span className="text-sm text-muted">개인정보 처리방침</span>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-foreground">데이터 출처</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="https://www.data.go.kr/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-muted transition-colors hover:text-primary"
                                >
                                    공공데이터포털 ↗
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://data.seoul.go.kr/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-muted transition-colors hover:text-primary"
                                >
                                    서울 열린데이터 ↗
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 border-t border-card-border pt-6">
                    <p className="text-center text-xs text-muted-foreground">
                        © 2026 소음지도. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
