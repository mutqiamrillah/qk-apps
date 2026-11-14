"use client";

import React from "react";

interface StudyStreakCardProps {
  days: number;
  totalNotes: number;
}

export const StudyStreakCard: React.FC<StudyStreakCardProps> = ({
  days,
  totalNotes,
}) => {
  return (
    <div className="mx-5 my-2">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#144f44] via-[#0f4339] to-[#0a3129] p-6 text-white shadow-lg shadow-emerald-900/10">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="space-y-3">
            {/* Streak Pill Badge */}
            <div className="inline-block bg-white text-emerald-950 font-semibold text-xs px-3.5 py-1.5 rounded-full shadow-sm">
              Study Streak
            </div>

            {/* Streak Counter */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight">
                  {days}
                </span>
                <span className="text-xl font-medium text-emerald-100">
                  Days
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-1 font-medium">
                {totalNotes} notes recorded
              </p>
            </div>
          </div>

          {/* Fire Avatar Circle */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-emerald-600/30 border border-emerald-400/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <span className="text-4xl animate-pulse select-none">🔥</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

