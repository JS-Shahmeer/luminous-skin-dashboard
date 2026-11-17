import { Maximize, Pause, Play, Settings, Volume2 } from "lucide-react";

/**
 * Colors here are fixed brand-dark literals, not theme tokens — video chrome
 * stays dark in both light and dark app themes, matching normal player conventions.
 */
export function VideoPlayer({
  title,
  duration,
  src,
}: {
  title: string;
  duration: string;
  src?: string;
}) {
  if (src) {
    return (
      <div className="group relative aspect-video overflow-hidden rounded-lg border border-[#2b2926] bg-[#0d0d0d]">
        <video key={src} src={src} controls className="h-full w-full" preload="metadata">
          Your browser doesn&apos;t support video playback.
        </video>
      </div>
    );
  }

  return (
    <div className="group relative aspect-video overflow-hidden rounded-lg border border-[#2b2926] bg-gradient-to-br from-[#171717] via-[#141311] to-[#0d0d0d]">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, rgba(198,168,117,0.5) 0, transparent 60%), radial-gradient(1px 1px at 70% 60%, rgba(198,168,117,0.3) 0, transparent 60%)",
        }}
      />

      <div className="absolute left-5 top-5 rounded-sm bg-[#0d0d0d]/60 px-3 py-1.5 text-xs text-[#f5f1ea] backdrop-blur">
        {title}
      </div>

      <button
        className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#c6a875]/50 bg-[#0d0d0d]/50 text-[#c6a875] backdrop-blur transition-transform hover:scale-105"
        aria-label="Play video"
        disabled
      >
        <Play size={24} fill="currentColor" className="ml-1" />
      </button>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0d0d0d]/90 to-transparent p-4 pt-10">
        <p className="mb-2 text-[11px] text-[#b8b1a7]">No video uploaded yet — preview only</p>
        <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-[38%] rounded-full bg-[#c6a875]" />
        </div>
        <div className="flex items-center justify-between text-[#f5f1ea]">
          <div className="flex items-center gap-4">
            <Pause size={17} />
            <Volume2 size={17} />
            <span className="text-xs text-[#b8b1a7]">04:12 / {duration}</span>
          </div>
          <div className="flex items-center gap-4">
            <Settings size={16} />
            <Maximize size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
