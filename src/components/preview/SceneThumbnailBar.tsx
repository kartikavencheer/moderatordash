import { Archive, Eye, Radio, Trash2 } from "lucide-react";
import type React from "react";

type Props = {
  scenes: any[];
  activeSceneId?: string;
  onSelect: (id: string) => void;
  onPreview?: (id: string) => void;
  onDelete?: (id: string) => void;
  onLive?: (id: string) => void;
  onArchive?: (id: string) => void;
};

export default function SceneThumbnailBar({
  scenes,
  activeSceneId,
  onSelect,
  onPreview,
  onDelete,
  onLive,
  onArchive,
}: Props) {
  const statusColor: Record<string, string> = {
    READY: "bg-blue-500",
    QUEUED: "bg-yellow-500",
    LIVE: "bg-green-600 animate-pulse",
    PLAYING: "bg-green-600 animate-pulse",
    PLAYED: "bg-gray-500",
    ARCHIVED: "bg-gray-500",
    DRAFT: "bg-purple-600",
    PREVIEW: "bg-pink-500",
  };

  const handlePreview = async (e: React.MouseEvent, sceneId: string) => {
    e.stopPropagation();
    const previewWindow = window.open(`/moderator/preview/${sceneId}`, "_blank");
    await onPreview?.(sceneId);
    previewWindow?.location.reload();
  };

  const handleDelete = (e: React.MouseEvent, sceneId: string) => {
    e.stopPropagation();
    onDelete?.(sceneId);
  };

  const handleLive = (e: React.MouseEvent, sceneId: string) => {
    e.stopPropagation();
    onLive?.(sceneId);
  };

  const handleArchive = (e: React.MouseEvent, sceneId: string) => {
    e.stopPropagation();
    onArchive?.(sceneId);
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto pr-1">
      {scenes.map((scene) => {
        const active = scene.scene_id === activeSceneId;
        const normalizedStatus = String(scene.status || "").toUpperCase();
        const uiStatus = normalizedStatus || "UNKNOWN";
        const isArchived = normalizedStatus === "ARCHIVED";

        return (
          <button
            key={scene.scene_id}
            onClick={() => onSelect(scene.scene_id)}
            className={`
              group relative w-full overflow-hidden rounded-[28px] text-left
              transition-all duration-300
              ${
                active
                  ? "translate-y-[-2px] ring-2 ring-cyan-300/70"
                  : "hover:-translate-y-1 hover:ring-2 hover:ring-cyan-300/35"
              }
            `}
          >
            <div className="glass-soft relative h-52 w-full overflow-hidden">
              {scene.thumbnail ? (
                <img
                  src={scene.thumbnail}
                  alt={scene.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-950 text-xs text-gray-400">
                  No preview
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              <div
                className={`
                  absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white
                  ${statusColor[normalizedStatus] || "bg-gray-600"}
                `}
              >
                {uiStatus}
              </div>

              <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                Scene
              </div>

              <div
                className="
                  absolute inset-0
                  bg-slate-950/70
                  opacity-0
                  group-hover:opacity-100
                  flex items-center justify-center gap-2 p-4
                  transition-opacity duration-300
                "
              >
                <button
                  onClick={(e) => handlePreview(e, scene.scene_id)}
                  className="secondary-button px-3 py-2 text-xs"
                >
                  <Eye size={14} />
                  Preview
                </button>

                {!isArchived && (
                  <button
                    onClick={(e) => handleLive(e, scene.scene_id)}
                    className="primary-button px-3 py-2 text-xs"
                  >
                    <Radio size={14} />
                    Live
                  </button>
                )}

                {!isArchived && (
                  <button
                    onClick={(e) => handleArchive(e, scene.scene_id)}
                    className="secondary-button px-3 py-2 text-xs"
                  >
                    <Archive size={14} />
                    Archive
                  </button>
                )}

                {(normalizedStatus === "DRAFT" || normalizedStatus === "PREVIEW") && (
                  <button
                    onClick={(e) => handleDelete(e, scene.scene_id)}
                    className="danger-button px-3 py-2 text-xs"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                )}
              </div>

              <div className="absolute bottom-0 w-full px-4 pb-4">
                <div className="truncate text-base font-semibold text-white">{scene.name}</div>
                <div className="mt-1 text-xs text-white/60">
                  Click to select this scene for review and control.
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
