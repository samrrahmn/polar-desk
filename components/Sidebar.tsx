export default function Sidebar() {
  return (
    <aside className="h-screen w-64 border-r border-default fixed left-0 top-0 bg-surface z-50 flex flex-col p-6 justify-between">
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
          <a className="flex items-center gap-3 px-3 py-2 font-semibold bg-blue-50 rounded-md transition-all active:scale-[0.98] cursor-pointer">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              assignment
            </span>
            <span className="text-sm tracking-tight">Projects</span>
          </a>

          <a className="flex items-center gap-3 px-3 py-2 text-muted hover:bg-surface-2 rounded-lg transition-all">
            <span className="material-symbols-outlined">mail</span>
            <span className="text-sm tracking-tight">Messages</span>
          </a>
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
  );
}
