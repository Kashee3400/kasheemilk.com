"use client";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

            setProgress(pct);

            if (scrollY > 400) {
                setLeaving(false);
                setVisible(true);
            } else {
                if (visible) setLeaving(true);
                // keep visible=true for exit animation, then hide
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [visible]);

    // after leaving animation finishes, fully hide
    const handleAnimEnd = () => {
        if (leaving) { setVisible(false); setLeaving(false); }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!visible) return null;

    // SVG circle progress ring
    const SIZE = 48;
    const STROKE = 3;
    const R = (SIZE - STROKE) / 2;
    const CIRC = 2 * Math.PI * R;
    const dash = (progress / 100) * CIRC;

    return (
        <>
            <style>{`
        @keyframes stt-in {
          from { opacity:0; transform:translateY(16px) scale(.85); }
          to   { opacity:1; transform:translateY(0)    scale(1);   }
        }
        @keyframes stt-out {
          from { opacity:1; transform:translateY(0)    scale(1);   }
          to   { opacity:0; transform:translateY(16px) scale(.85); }
        }
        .stt-btn {
          animation: stt-in .35s cubic-bezier(.22,.68,0,1.2) forwards;
        }
        .stt-btn.leaving {
          animation: stt-out .28s ease forwards;
        }
        .stt-btn:hover .stt-arrow {
          transform: translateY(-2px);
        }
        .stt-arrow {
          transition: transform .2s ease;
        }
        .stt-btn:active {
          transform: scale(.93) !important;
        }
        /* Tooltip */
        .stt-tip {
          opacity: 0;
          transform: translateX(6px);
          transition: opacity .2s ease, transform .2s ease;
          pointer-events: none;
        }
        .stt-btn:hover .stt-tip {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

            <div
                className={`stt-btn ${leaving ? "leaving" : ""}`}
                onAnimationEnd={handleAnimEnd}
                style={{
                    position: "fixed",
                    bottom: 28,
                    right: 28,
                    zIndex: 999,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                {/* Tooltip label */}
                <div
                    className="stt-tip"
                    style={{
                        background: "#0f2d1c",
                        color: "#d4ead9",
                        fontSize: 11.5,
                        fontWeight: 500,
                        letterSpacing: ".04em",
                        padding: "5px 10px",
                        borderRadius: 5,
                        whiteSpace: "nowrap",
                        fontFamily: "'Outfit', sans-serif",
                        boxShadow: "0 4px 14px rgba(15,45,28,.22)",
                    }}
                >
                    Back to top
                </div>

                {/* Button */}
                <button
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                    style={{
                        position: "relative",
                        width: SIZE,
                        height: SIZE,
                        borderRadius: "50%",
                        border: "none",
                        background: "linear-gradient(145deg, #0f2d1c, #1a5c35)",
                        color: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 6px 24px rgba(15,45,28,.35), 0 2px 8px rgba(15,45,28,.2)",
                        transition: "box-shadow .2s ease, transform .15s ease",
                        padding: 0,
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.boxShadow =
                            "0 10px 32px rgba(15,45,28,.45), 0 3px 10px rgba(15,45,28,.25)";
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.boxShadow =
                            "0 6px 24px rgba(15,45,28,.35), 0 2px 8px rgba(15,45,28,.2)";
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}
                >
                    {/* SVG progress ring */}
                    <svg
                        width={SIZE}
                        height={SIZE}
                        viewBox={`0 0 ${SIZE} ${SIZE}`}
                        style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}
                    >
                        {/* track */}
                        <circle
                            cx={SIZE / 2} cy={SIZE / 2} r={R}
                            fill="none"
                            stroke="rgba(255,255,255,.12)"
                            strokeWidth={STROKE}
                        />
                        {/* progress arc */}
                        <circle
                            cx={SIZE / 2} cy={SIZE / 2} r={R}
                            fill="none"
                            stroke="#c8973a"
                            strokeWidth={STROKE}
                            strokeLinecap="round"
                            strokeDasharray={`${dash} ${CIRC}`}
                            style={{ transition: "stroke-dasharray .1s linear" }}
                        />
                    </svg>

                    {/* Arrow icon */}
                    <span className="stt-arrow" style={{ position: "relative", zIndex: 1, display: "flex" }}>
                        <ArrowUp size={18} strokeWidth={2.2} />
                    </span>
                </button>
            </div>
        </>
    );
}