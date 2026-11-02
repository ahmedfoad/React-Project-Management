export default function ProjectSidebar({
  projects,
  activeProjectId,
  onSelectProject,
  onShowAllProjects,
  onAddProject,
}) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-[#294a3e] bg-[#173b31] px-4 py-4 text-white sm:px-6 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:border-[#24483b] lg:px-5 lg:py-7">
      <div className="flex items-center justify-between lg:mb-10">
        <button
          type="button"
          onClick={onShowAllProjects}
          className="flex items-center gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9bd2ae]"
          aria-label="Go to workspace overview"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d6eddf] text-lg font-bold text-[#1c5740]">
            f
          </span>
          <span>
            <span className="block text-base font-semibold tracking-tight">
              fieldnote
            </span>
            <span className="block text-[11px] text-[#a6c0b3]">
              TEAM WORKSPACE
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={onAddProject}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#d6eddf] px-3 text-xs font-semibold text-[#1c5740] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:hidden"
        >
          <span aria-hidden="true" className="text-base leading-none">
            +
          </span>
          Add
        </button>
      </div>

      <nav
        aria-label="Workspace navigation"
        className="mt-4 grid grid-cols-2 gap-2 lg:mt-0 lg:grid-cols-1"
      >
        <button
          type="button"
          onClick={onShowAllProjects}
          aria-current={activeProjectId === null ? "page" : undefined}
          className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
            activeProjectId === null
              ? "bg-[#2d5547] text-white"
              : "text-[#b8cbbf] hover:bg-[#22483b] hover:text-white"
          }`}
        >
          <span className="text-base" aria-hidden="true">
            ▦
          </span>
          Overview
        </button>
        <button
          type="button"
          onClick={onShowAllProjects}
          className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#b8cbbf] transition hover:bg-[#22483b] hover:text-white"
        >
          <span className="text-base" aria-hidden="true">
            ◷
          </span>
          Activity
          <span className="ml-auto rounded-full bg-[#3b6654] px-2 py-0.5 text-[10px] text-white">
            3
          </span>
        </button>
      </nav>

      <div className="mt-6 border-t border-[#315646] pt-5 lg:mt-8">
        <div className="mb-3 flex items-center justify-between px-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9cb7a8]">
            Projects
          </h2>
          <button
            type="button"
            onClick={onAddProject}
            aria-label="Add project"
            title="Add project"
            className="hidden h-7 w-7 items-center justify-center rounded-md text-[#b8cbbf] transition hover:bg-[#2d5547] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9bd2ae] lg:inline-flex"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              +
            </span>
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => onSelectProject(project.id)}
              aria-current={activeProjectId === project.id ? "page" : undefined}
              className={`flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition lg:w-full ${
                activeProjectId === project.id
                  ? "bg-[#2d5547] text-white"
                  : "text-[#b8cbbf] hover:bg-[#22483b] hover:text-white"
              }`}
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${project.tone.includes("emerald") ? "bg-[#80c99b]" : project.tone.includes("sky") ? "bg-[#83bce3]" : project.tone.includes("amber") ? "bg-[#edbd6c]" : "bg-[#e799a5]"}`}
              />
              <span className="max-w-40 truncate">{project.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 hidden border-t border-[#315646] pt-5 lg:mt-auto lg:block">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e6c6a9] text-xs font-semibold text-[#65452e]">
            AR
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">
              Ahmed Fouad
            </span>
            <span className="block truncate text-xs text-[#9cb7a8]">
              Workspace admin
            </span>
          </span>
          <span aria-hidden="true" className="text-[#9cb7a8]">
            ···
          </span>
        </div>
      </div>
    </aside>
  );
}
