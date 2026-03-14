import { X } from "lucide-react";

type Props = {
  submission: any;
  tile_id?: string;
  single?: boolean;
  onDelete?: (id: string) => void;
  muted?: boolean;
};

export default function FanWallTile({
  submission,
  tile_id,
  single = false,
  onDelete,
  muted = true,
}: Props) {
  const mediaUrl =
    submission?.media_url ||
    submission?.submission?.media_url ||
    submission?.video_url ||
    submission?.submission?.video_url ||
    submission?.url ||
    "";

  const userName =
    submission?.user_name ||
    submission?.user?.full_name ||
    submission?.full_name ||
    submission?.submission?.user_name ||
    submission?.submission?.user?.full_name ||
    "Fan";

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[24px] border border-white/10 bg-black shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
      {onDelete && tile_id && (
        <button
          onClick={() => onDelete(tile_id)}
          aria-label="Delete tile"
          title="Delete from scene"
          className="absolute right-2 top-2 z-20 rounded-full bg-black/65 p-1.5 text-white transition hover:bg-red-600"
        >
          <X size={18} />
        </button>
      )}

      <video
        src={mediaUrl}
        autoPlay
        muted={muted}
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-3 py-3 text-sm font-semibold text-white">
        {userName}
      </div>
    </div>
  );
}
