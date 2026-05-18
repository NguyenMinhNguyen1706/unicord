"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MediaRoom } from "@/components/media-room";
import { ChannelType } from "@/enums";
import {
  Mic,
  Video,
  Volume2,
  Timer,
  PhoneOff,
  Settings,
  Maximize2,
} from "lucide-react";

interface VoiceRoomClientProps {
  channelId: string;
  channelName: string;
  channelType: string;
  isVideo: boolean;
  serverId: string;
  mobileToggle?: React.ReactNode;
}

export const VoiceRoomClient = ({
  channelId,
  channelName,
  channelType,
  isVideo,
  serverId,
  mobileToggle,
}: VoiceRoomClientProps) => {
  const router = useRouter();
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);

  // Pomodoro Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsPomodoroActive(false);
      setPomodoroTime(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isPomodoroActive, pomodoroTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePomodoro = () => {
    setIsPomodoroActive(!isPomodoroActive);
    if (!isPomodoroActive) setPomodoroTime(25 * 60);
  };

  const onLeave = () => {
    router.push(`/servers/${serverId}`);
  };

  return (
    <div className="flex flex-col h-full bg-[#0E1628]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-white/5 bg-[#0E1628]/80 backdrop-blur-sm">
        <div className="flex items-center gap-x-2">
          {mobileToggle}
          {isVideo ? (
            <Video className="h-5 w-5 text-violet-400" />
          ) : (
            <Volume2 className="h-5 w-5 text-emerald-400 animate-pulse" />
          )}
          <h2 className="text-sm font-bold text-white">{channelName}</h2>
          <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
            {isVideo ? "Video" : "Thoại"}
          </span>
        </div>
        <div className="flex items-center gap-x-2">
          {/* Pomodoro */}
          <button
            onClick={togglePomodoro}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              isPomodoroActive
                ? "bg-violet-500/20 text-violet-400"
                : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
            title="Pomodoro Timer (25 phút)"
          >
            <Timer className="h-3.5 w-3.5" />
            {isPomodoroActive ? formatTime(pomodoroTime) : "Pomodoro"}
          </button>

          {/* Leave */}
          <button
            onClick={onLeave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-all"
            title="Rời phòng"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            Rời
          </button>
        </div>
      </div>

      {/* LiveKit Media Room */}
      <div className="flex-1 relative">
        {/* Pomodoro Overlay */}
        {isPomodoroActive && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="text-7xl font-mono font-bold text-white mb-4 tracking-wider">
                  {formatTime(pomodoroTime)}
                </div>
                <svg className="absolute -inset-8 w-[calc(100%+4rem)] h-[calc(100%+4rem)]" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="4" />
                  <circle
                    cx="100" cy="100" r="90" fill="none"
                    stroke="rgb(139, 92, 246)" strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - pomodoroTime / (25 * 60))}`}
                    transform="rotate(-90 100 100)"
                    className="transition-all duration-1000"
                  />
                </svg>
              </div>
              <p className="text-violet-300 font-medium text-lg mt-8">🍅 Chế độ Pomodoro — Tập trung!</p>
              <p className="text-slate-400 text-sm mt-2">Video/Audio vẫn hoạt động. Hãy tập trung!</p>
              <button
                onClick={() => { setIsPomodoroActive(false); setPomodoroTime(25 * 60); }}
                className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
              >
                Dừng Pomodoro
              </button>
            </div>
          </div>
        )}

        <MediaRoom chatId={channelId} video={isVideo} audio={true} />
      </div>
    </div>
  );
};
