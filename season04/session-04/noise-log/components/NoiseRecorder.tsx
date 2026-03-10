"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Download, Square, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type RecordingState = "idle" | "recording" | "done";

function getNoiseLevel(db: number): {
    label: string;
    color: string;
    emoji: string;
    desc: string;
} {
    if (db < 40)
        return {
            label: "조용",
            color: "text-noise-quiet",
            emoji: "🟢",
            desc: "도서관 수준",
        };
    if (db < 60)
        return {
            label: "보통",
            color: "text-noise-moderate",
            emoji: "🟡",
            desc: "일상 대화 수준",
        };
    return {
        label: "시끄러움",
        color: "text-noise-loud",
        emoji: "🔴",
        desc: "도로변 수준",
    };
}

export function NoiseRecorder() {
    const [state, setState] = useState<RecordingState>("idle");
    const [db, setDb] = useState(0);
    const [peakDb, setPeakDb] = useState(0);
    const [duration, setDuration] = useState(0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [waveform, setWaveform] = useState<number[]>(new Array(40).fill(4));
    const [error, setError] = useState<string | null>(null);

    const streamRef = useRef<MediaStream | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const rafRef = useRef<number>(0);
    const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
    const chunksRef = useRef<Blob[]>([]);

    const cleanup = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        audioCtxRef.current?.close();
        streamRef.current = null;
        analyserRef.current = null;
        audioCtxRef.current = null;
        recorderRef.current = null;
    }, []);

    useEffect(() => cleanup, [cleanup]);

    const analyzeAudio = useCallback(() => {
        const analyser = analyserRef.current;
        if (!analyser) return;

        const data = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(data);

        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            const val = (data[i] - 128) / 128;
            sum += val * val;
        }
        const rms = Math.sqrt(sum / data.length);
        const dbVal = Math.max(0, Math.min(120, 20 * Math.log10(rms + 0.0001) + 90));

        setDb(Math.round(dbVal));
        setPeakDb((prev) => Math.max(prev, Math.round(dbVal)));

        // Update waveform (shift left, add new value)
        setWaveform((prev) => {
            const next = [...prev.slice(1), Math.max(4, (dbVal / 120) * 100)];
            return next;
        });

        rafRef.current = requestAnimationFrame(analyzeAudio);
    }, []);

    const startRecording = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const audioCtx = new AudioContext();
            audioCtxRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 2048;
            source.connect(analyser);
            analyserRef.current = analyser;

            const recorder = new MediaRecorder(stream);
            recorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
            };

            recorder.start(100);
            setState("recording");
            setDuration(0);
            setPeakDb(0);

            timerRef.current = setInterval(() => {
                setDuration((d) => d + 1);
            }, 1000);

            analyzeAudio();
        } catch {
            setError("마이크 접근이 거부되었습니다. 브라우저 설정에서 마이크 권한을 허용해주세요.");
        }
    };

    const stopRecording = () => {
        recorderRef.current?.stop();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        audioCtxRef.current?.close();
        setState("done");
    };

    const reset = () => {
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
        setDb(0);
        setPeakDb(0);
        setDuration(0);
        setWaveform(new Array(40).fill(4));
        setState("idle");
    };

    const formatTime = (s: number) =>
        `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    const noiseLevel = getNoiseLevel(db);

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="rounded-2xl border border-card-border bg-card p-6 shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground">🎙️ 실시간 소음 측정</h3>
                    {state === "recording" && (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-noise-loud">
                            <span className="inline-block h-2 w-2 rounded-full bg-noise-loud recording-pulse" />
                            녹음 중 {formatTime(duration)}
                        </span>
                    )}
                    {state === "done" && (
                        <span className="text-xs font-medium text-muted">
                            녹음 완료 {formatTime(duration)}
                        </span>
                    )}
                </div>

                {/* dB Display */}
                <AnimatePresence mode="wait">
                    {state === "idle" && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-3 py-6"
                        >
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light">
                                <Mic size={32} className="text-primary" />
                            </div>
                            <p className="text-sm text-muted text-center">
                                마이크를 켜서 주변 소음을 측정하세요
                            </p>
                        </motion.div>
                    )}

                    {state === "recording" && (
                        <motion.div
                            key="recording"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4 py-4"
                        >
                            {/* dB number */}
                            <div className="text-center">
                                <motion.span
                                    key={db}
                                    initial={{ scale: 1.2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={cn("text-5xl font-bold tabular-nums", noiseLevel.color)}
                                >
                                    {db}
                                </motion.span>
                                <span className="ml-1 text-lg text-muted">dB</span>
                            </div>

                            {/* Noise level label */}
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{noiseLevel.emoji}</span>
                                <span className={cn("text-sm font-semibold", noiseLevel.color)}>
                                    {noiseLevel.label}
                                </span>
                                <span className="text-xs text-muted">({noiseLevel.desc})</span>
                            </div>

                            {/* Waveform */}
                            <div className="flex h-16 w-full items-end justify-center gap-[2px]">
                                {waveform.map((h, i) => (
                                    <motion.div
                                        key={i}
                                        className={cn(
                                            "w-1.5 rounded-full",
                                            h < 33
                                                ? "bg-noise-quiet"
                                                : h < 66
                                                    ? "bg-noise-moderate"
                                                    : "bg-noise-loud"
                                        )}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 0.1 }}
                                    />
                                ))}
                            </div>

                            {/* Peak */}
                            <div className="flex items-center gap-4 text-xs text-muted">
                                <span>최대: <strong className="text-foreground">{peakDb} dB</strong></span>
                            </div>
                        </motion.div>
                    )}

                    {state === "done" && (
                        <motion.div
                            key="done"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4 py-4"
                        >
                            <div className="text-center">
                                <span className="text-2xl font-bold text-foreground">
                                    최대 {peakDb} dB
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{getNoiseLevel(peakDb).emoji}</span>
                                <span className={cn("text-sm font-semibold", getNoiseLevel(peakDb).color)}>
                                    {getNoiseLevel(peakDb).label}
                                </span>
                            </div>
                            {audioUrl && (
                                <audio controls src={audioUrl} className="w-full mt-2 rounded-lg" />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error */}
                {error && (
                    <p className="text-xs text-noise-loud text-center mt-2 mb-2">{error}</p>
                )}

                {/* Controls */}
                <div className="mt-4 flex items-center justify-center gap-3">
                    {state === "idle" && (
                        <button
                            type="button"
                            onClick={startRecording}
                            className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary-hover hover:shadow-xl active:scale-95"
                        >
                            <Mic size={18} />
                            측정 시작
                        </button>
                    )}
                    {state === "recording" && (
                        <button
                            type="button"
                            onClick={stopRecording}
                            className="flex items-center gap-2 rounded-full bg-noise-loud px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
                        >
                            <Square size={16} />
                            측정 중지
                        </button>
                    )}
                    {state === "done" && (
                        <>
                            <button
                                type="button"
                                onClick={reset}
                                className="flex items-center gap-2 rounded-full border border-card-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card"
                            >
                                <RotateCcw size={16} />
                                다시 측정
                            </button>
                            {audioUrl && (
                                <a
                                    href={audioUrl}
                                    download={`noise-recording-${new Date().toISOString().slice(0, 10)}.webm`}
                                    className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-hover active:scale-95"
                                >
                                    <Download size={16} />
                                    다운로드
                                </a>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
