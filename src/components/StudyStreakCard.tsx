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

  return (
    <div className="mx-5 my-2">
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-lg transition-colors duration-200 ${styles.streakCard}`}>
        {/* Subtle decorative background glow */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl pointer-events-none ${styles.streakGlow}`} />

        <div className="flex items-center justify-between">
          <div className="space-y-3">
            {/* Streak Pill Badge */}
            <div className={`inline-block font-semibold text-xs px-3.5 py-1.5 rounded-full shadow-sm ${styles.streakPill}`}>
              Study Streak
            </div>

            {/* Streak Counter */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight">
                  {days}
                </span>
                <span className={`text-xl font-medium ${styles.streakSub}`}>
                  Days
                </span>
              </div>
              <p className={`text-xs mt-1 font-medium ${styles.streakMuted}`}>
                {totalNotes} notes recorded
              </p>
            </div>
          </div>

          {/* Fire Avatar Circle */}
          <div className="relative">
            <div className={`w-20 h-20 rounded-full border backdrop-blur-sm flex items-center justify-center shadow-inner ${styles.streakCircle}`}>
              <span className="text-4xl animate-pulse select-none">🔥</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

