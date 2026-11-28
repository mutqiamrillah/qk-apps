"use client";

import React from "react";
import { AppTheme } from "@/lib/types";
import { THEME_STYLES } from "@/lib/theme";

interface StudyStreakCardProps {
  days: number;
  totalNotes: number;
  theme?: AppTheme;
}

export const StudyStreakCard: React.FC<StudyStreakCardProps> = ({
  days,
  totalNotes,
  theme = "light",
}) => {
  const styles = THEME_STYLES[theme];

  const isSepia = theme === "sepia";

  return (
    <div className="mx-5 my-2">
      <div
        style={{
          backgroundColor: styles.streakSolidHex,
          color: styles.streakTextHex,
          borderColor: styles.streakBorderHex,
        }}
        className={`relative overflow-hidden rounded-3xl p-6 shadow-lg transition-colors duration-200 ${styles.streakCard}`}
      >
        {/* Subtle decorative background glow */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl pointer-events-none ${styles.streakGlow}`} />

        <div className="flex items-center justify-between">
          <div className="space-y-3">
            {/* Streak Pill Badge */}
            <div
              style={isSepia ? { backgroundColor: "#784920", color: "#faf6ee" } : undefined}
              className={`inline-block font-semibold text-xs px-3.5 py-1.5 rounded-full shadow-sm ${styles.streakPill}`}
            >
              Study Streak
            </div>

            {/* Streak Counter */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight">
                  {days}
                </span>
                <span
                  style={{ color: isSepia ? "#5c462f" : "#ffffff" }}
                  className={`text-xl font-medium ${styles.streakSub}`}
                >
                  Days
                </span>
              </div>
              <p
                style={{ color: isSepia ? "#6f441d" : "rgba(255, 255, 255, 0.95)" }}
                className={`text-xs mt-1 font-medium ${styles.streakMuted}`}
              >
                {totalNotes} notes recorded
              </p>
            </div>
          </div>

          {/* Fire Avatar Circle */}
          <div className="relative">
            <div
              style={{
                backgroundColor: isSepia ? "rgba(120, 73, 32, 0.14)" : "rgba(255, 255, 255, 0.2)",
                borderColor: isSepia ? "rgba(120, 73, 32, 0.28)" : "rgba(255, 255, 255, 0.35)",
              }}
              className={`w-20 h-20 rounded-full border backdrop-blur-sm flex items-center justify-center shadow-inner ${styles.streakCircle}`}
            >
              <span className="text-4xl animate-pulse select-none">🔥</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

