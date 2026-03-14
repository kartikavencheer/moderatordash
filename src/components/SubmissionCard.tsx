import { useRef, useState } from "react";
import { Play, ShieldX, Sparkles, Trash2 } from "lucide-react";

const categoryColor: Record<string, string> = {
  boundary_four: "from-amber-300 to-yellow-500",
  six: "from-sky-300 to-blue-500",
  wicket: "from-rose-400 to-red-600",
  clap_cheer: "from-emerald-300 to-green-500",
  wow_moment: "from-fuchsia-400 to-violet-600",
};

export default function SubmissionCard({
  submission,
  onAdd,
  onRemove,
  onReject,
  isQueued,
}: any) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="glass-soft group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-sky-300/30">
      <div className="relative h-44 cursor-pointer overflow-hidden bg-black" onClick={toggle}>
        <video
          ref={videoRef}
          src={submission.media_url}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />

        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/[0.12] text-white backdrop-blur-md">
              <Play size={20} className="ml-1 fill-current" />
            </div>
          </div>
        )}

        {isQueued && (
          <div className="absolute right-3 top-3 rounded-full border border-emerald-300/35 bg-emerald-400/[0.18] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
            In Queue
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75 backdrop-blur-md">
            Rank {submission?.rank ?? "-"}
          </div>
          <div className="rounded-full border border-sky-300/25 bg-sky-400/10 px-3 py-1 text-[11px] font-semibold text-sky-100 backdrop-blur-md">
            {submission.team?.name || "Open Team"}
          </div>
        </div>
      </div>

      <div
        className={`flex justify-between bg-gradient-to-r px-4 py-2 text-sm font-semibold text-slate-950 ${
          categoryColor[submission.category?.code] || "from-slate-300 to-slate-400"
        }`}
      >
        <span className="capitalize">
          {submission.category?.label || submission.category?.code || "General"}
        </span>
        <span className="inline-flex items-center gap-1">
          <Sparkles size={14} />
          Ready
        </span>
      </div>

      <div className="px-4 pt-4 text-white">
        <div className="flex items-center gap-3">
          {submission.logo_url && submission.logo_url.trim() !== "" && (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
              <img
                src={submission.logo_url}
                alt="team logo"
                className="h-7 w-7 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-white">
              {submission.user?.full_name || "Anonymous Fan"}
            </div>
            <div className="truncate text-xs text-white/60">
              {submission.team?.name || "Independent submission"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto px-4 pb-4 pt-4">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-white/70">
          <span className="inline-flex items-center gap-2">
            <ShieldX size={14} className="text-sky-200/80" />
            Moderation action
          </span>
          <span>{submission?.status || "Pending"}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              isQueued
                ? onRemove(submission.submission_id)
                : onAdd(submission.submission_id)
            }
            className={`flex-1 rounded-2xl px-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition active:scale-95 ${
              isQueued
                ? "bg-rose-500/90 text-white hover:bg-rose-500"
                : "bg-emerald-300 text-slate-950 hover:bg-emerald-200"
            }`}
          >
            {isQueued ? "Remove" : "Select"}
          </button>

          <button
            onClick={() => onReject(submission.submission_id)}
            className="inline-flex w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/85 transition hover:bg-white/10 active:scale-95"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
