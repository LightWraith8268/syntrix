import { NavLink } from "react-router-dom";
import { useSyntrixStore } from "../state/store";

const baseClasses =
  "block rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] transition-colors";

export function SidebarNav() {
  const libraries = useSyntrixStore((state) => state.libraries);

  return (
    <nav className="space-y-6">
      <div className="space-y-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? "bg-accent text-white" : "bg-white/5 text-white/70 hover:text-white"}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? "bg-accent text-white" : "bg-white/5 text-white/70 hover:text-white"}`
          }
        >
          Explore
        </NavLink>
        <NavLink
          to="/playlists"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? "bg-accent text-white" : "bg-white/5 text-white/70 hover:text-white"}`
          }
        >
          Playlists
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? "bg-accent text-white" : "bg-white/5 text-white/70 hover:text-white"}`
          }
        >
          Settings
        </NavLink>
      </div>

      <div>
        <p className="px-4 pb-2 text-xs uppercase tracking-[0.4em] text-white/40">Libraries</p>
        <div className="space-y-2">
          {libraries.map((library) => (
            <NavLink
              key={library.id}
              to={`/library/${library.id}`}
              className={({ isActive }) =>
                `${baseClasses} ${
                  isActive ? "bg-white/10 text-white" : "bg-white/5 text-white/60 hover:text-white"
                }`
              }
            >
              {library.name}
            </NavLink>
          ))}
          {libraries.length === 0 ? (
            <p className="px-4 text-xs text-white/40">Add a library to see it here.</p>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
