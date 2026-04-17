"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/dashboard/projects",
    label: "Projects",
    icon: "assignment",
  },
  {
    href: "/dashboard/massage",
    label: "Massage",
    icon: "mail",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden fixed inset-y-0 left-0 h-screen w-64 border-r border-default bg-surface p-6 lg:flex flex-col justify-between overflow-y-auto">
        <div className="space-y-8">
          <div className="mb-10 flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-surface shadow-sm overflow-hidden">
              <img
                src="/logo.png"
                alt="logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="ml-3 text-lg font-semibold tracking-tight">
              Dashboard
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/dashboard/projects" &&
                  pathname === "/dashboard");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-50 text-black font-semibold"
                      : "text-muted hover:bg-surface-2"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0',
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm tracking-tight">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-6">
          <div className="p-3 bg-surface border border-default rounded-xl flex items-center gap-3">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
              alt="avatar"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">Alex Rivera</p>
              <p className="text-xs text-muted">Free Plan</p>
            </div>
          </div>

          <button
            className="w-full flex items-center gap-3 px-3 py-2 text-muted hover:text-[rgb(var(--error))] hover:bg-surface-2 rounded-lg transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm tracking-tight">Sign Out</span>
          </button>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-2 border-t border-default bg-surface px-4 py-2 shadow-[0_-1px_12px_rgba(15,23,42,0.08)] lg:hidden">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/dashboard/projects" && pathname === "/dashboard");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center rounded-lg px-2 py-2 transition-all ${
                isActive ? "text-primary" : "text-muted hover:bg-surface-2"
              }`}
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{
                  fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0',
                }}
              >
                {item.icon}
              </span>
              <span className="text-[11px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
