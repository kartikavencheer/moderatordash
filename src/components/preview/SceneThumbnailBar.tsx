import { Archive, Eye, Radio, Trash2 } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getSceneDetails } from "../../api/moderatorApi";

type Props = {
  scenes: any[];
  activeSceneId?: string;
  onSelect: (id: string) => void;
  onPreview?: (id: string) => void;
  onDelete?: (id: string) => void;
  onLive?: (id: string) => void;
  onArchive?: (id: string) => void;
};

function getSceneMedia(scene: any) {
  const candidates: any[] = []
    .concat(scene?.submissions || [])
    .concat(scene?.tiles || [])
    .concat(scene?.scene_tiles || [])
    .concat(scene?.media || []);

  return candidates
    .map((item: any) => ({
      key: String(item?.tile_id || item?.submission_id || item?.id || Math.random()),
      thumb:
        item?.thumbnail_url ||
        item?.thumbnail ||
        item?.thumb_url ||
        item?.submission?.thumbnail_url ||
        item?.submission?.thumbnail ||
        null,
      url:
        item?.media_url ||
        item?.url ||
        item?.media ||
        item?.mediaUrl ||
        item?.submission?.media_url ||
        item?.submission?.url ||
        null,
      type: String(item?.media_type || item?.type || "").toUpperCase(),
    }))
    .filter((x) => x.thumb || x.url);
}

export default function SceneThumbnailBar({
  scenes,
  activeSceneId,
  onSelect,
  onPreview,
  onDelete,
  onLive,
  onArchive,
}: Props) {
  const [sceneDetails, setSceneDetails] = useState<Record<string, any[]>>({});
  const requestedRef = useRef(new Set<string>());

  const visibleSceneIds = useMemo(() => scenes.map((s) => String(s.scene_id)), [scenes]);

  useEffect(() => {
    let cancelled = false;

    const fetchDetails = async () => {
      // Keep it lightweight: fetch details for the first few scenes only.
      // More can be fetched on-demand later if needed.
      const idsToFetch = visibleSceneIds
        .slice(0, 12)
        .filter((id) => id && !sceneDetails[id] && !requestedRef.current.has(id));

      for (const id of idsToFetch) {
        requestedRef.current.add(id);
        try {
          const details = await getSceneDetails(id);
          if (cancelled) return;
          // API sometimes returns {data: [...]}, sometimes just [...]
          const tiles = Array.isArray(details) ? details : details?.data || details?.value || [];
          setSceneDetails((prev) => ({ ...prev, [id]: tiles }));
        } catch {
          // ignore; fallback UI will render
        }
      }
    };

    void fetchDetails();
    return () => {
      cancelled = true;
    };
  }, [visibleSceneIds, sceneDetails]);

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
        const details = sceneDetails[String(scene.scene_id)];
        const rawMedia = getSceneMedia(details?.length ? { ...scene, tiles: details } : scene);
        const media = Array.from(
          new Map(rawMedia.map((m) => [m.thumb || m.url, m])).values(),
        );

        const maxCells = 16; // keep thumbnail lightweight (up to 4x4)
        const visibleCount = Math.min(media.length, maxCells);
        const gridSize = Math.min(4, Math.max(1, Math.ceil(Math.sqrt(visibleCount || 1))));
        const gridCols = gridSize;
        const gridRows = gridSize;
        const gridItems = media.slice(0, gridSize * gridSize);
        const remaining = Math.max(0, media.length - gridItems.length);

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
              {gridItems.length ? (
                <div
                  className="h-full w-full overflow-hidden"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                    gridTemplateRows: `repeat(${gridRows}, 1fr)`,
                    gap: "2px",
                  }}
                >
                  {gridItems.map((item) =>
                    item.thumb ? (
                      <img
                        key={item.key}
                        src={item.thumb}
                        alt={scene.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <video
                        key={item.key}
                        src={item.url}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
                    ),
                  )}
                </div>
              ) : !details && scene.thumbnail ? (
                <img
                  src={scene.thumbnail}
                  alt={scene.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              ) : !details ? (
                <div className="flex h-full w-full items-center justify-center bg-slate-950 text-xs text-gray-400">
                  Loading grid...
                </div>
              ) : scene.thumbnail ? (
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

              {remaining > 0 && (
                <div className="absolute bottom-14 right-3 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-semibold text-white/80 backdrop-blur">
                  +{remaining}
                </div>
              )}

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
