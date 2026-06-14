import { NavLink, Outlet } from "react-router-dom"

const links = [
    { to: "/", label: "Dashboard", end: true },
    { to: "/agent", label: "AI Agent" },
    { to: "/campaigns", label: "Campaigns" },
]

export default function Layout() {
    return (
        <div className="min-h-screen flex">
            <aside className="w-60 bg-brand-dark text-white flex flex-col p-5">
                <div className="text-2xl font-bold mb-1">Reachly</div>
                <div className="text-xs text-white/60 mb-8">AI-native Mini CRM</div>
                <nav className="flex flex-col gap-1">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            end={l.end}
                            className={({ isActive }) =>
                                "px-3 py-2 rounded-lg text-sm transition " +
                                (isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10")
                            }
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="mt-auto text-[11px] text-white/40">
                    Xeno FDE Assignment 2026
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-auto">
                <Outlet />
            </main>
        </div>
    )
}
