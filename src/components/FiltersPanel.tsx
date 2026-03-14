// type Props = {
//   events: any[];
//   teams: any[];
//   filters: any;
//   onChange: (k: string, v: string) => void;
// };

// export default function FilterBar({ events, teams, filters, onChange }: Props) {
//   return (
//     <div className="flex gap-3 bg-slate-800/60 backdrop-blur p-4 rounded-xl shadow flex-wrap">
//       <select
//         value={filters.eventId}
//         onChange={(e) => onChange("eventId", e.target.value)}
//         className="bg-slate-700 px-3 py-2 rounded"
//       >
//         <option value="">Select Event</option>
//         {events.map((e) => (
//           <option key={e.event_id} value={e.event_id}>
//             {e.event_name}
//           </option>
//         ))}
//       </select>

//       <select
//         value={filters.teamId}
//         onChange={(e) => onChange("teamId", e.target.value)}
//         className="bg-slate-700 px-3 py-2 rounded"
//       >
//         <option value="">All Teams</option>
//         {teams.map((t) => (
//           <option key={t.team_id} value={t.team_id}>
//             {t.team.name}
//           </option>
//         ))}
//       </select>

//       <select
//         value={filters.status}
//         onChange={(e) => onChange("status", e.target.value)}
//         className="bg-slate-700 px-3 py-2 rounded"
//       >
//         <option value="">Status</option>
//         <option value="PENDING">Pending</option>
//         <option value="APPROVED">Approved</option>
//       </select>

//       <input
//         value={filters.search}
//         onChange={(e) => onChange("search", e.target.value)}
//         placeholder="Search..."
//         className="bg-slate-700 px-3 py-2 rounded flex-1"
//       />
//     </div>
//   );
// }
type Category = {
  category_id: string;
  label: string;
};

type Event = {
  event_id: string;
  event_name: string;
};

type Team = {
  team_id: string;
  team: {
    name: string;
  };
};

type Filters = {
  eventId: string;
  teamId: string;
  status: string;
  categoryId: string;
  search: string;
};

type Props = {
  events: Event[];
  teams: Team[];
  categories: Category[];
  filters: Filters;
  onChange: (key: keyof Filters, value: string) => void;
};

export default function FilterBar({
  events,
  teams,
  categories,
  filters,
  onChange,
}: Props) {
  return (
    <div className="glass-panel rounded-[28px] p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="section-title">Content Filters</div>
          <div className="section-subtitle">Refine submissions by event, squad, category, and approval state.</div>
        </div>
        <div className="hero-chip hidden md:inline-flex">Live Moderation</div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-5">
      <select
        value={filters.eventId}
        onChange={(e) => {
          onChange("eventId", e.target.value);
          onChange("categoryId", ""); // reset category when event changes
        }}
        className="form-control"
      >
        <option value="">Select Event</option>
        {events.map((e) => (
          <option key={e.event_id} value={e.event_id}>
            {e.event_name}
          </option>
        ))}
      </select>

      <select
        value={filters.teamId}
        onChange={(e) => onChange("teamId", e.target.value)}
        className="form-control"
      >
        <option value="">All Teams</option>
        {teams.map((t) => (
          <option key={t.team_id} value={t.team_id}>
            {t.team.name}
          </option>
        ))}
      </select>

      <select
        value={filters.categoryId}
        onChange={(e) => onChange("categoryId", e.target.value)}
        disabled={!filters.eventId}
        className="form-control disabled:opacity-40"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.category_id} value={c.category_id}>
            {c.label}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => onChange("status", e.target.value)}
        className="form-control"
      >
        <option value="">Status</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>

      <input
        value={filters.search}
        onChange={(e) => onChange("search", e.target.value)}
        placeholder="Search by fan, team, or clip..."
        className="form-control min-w-[200px]"
      />
      </div>
    </div>
  );
}
