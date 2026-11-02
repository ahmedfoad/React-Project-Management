import { useState } from "react";
import NewProject from "../components/NewProject";
import NewTask from "../components/NewTask";
import NoProjectFound from "../components/NoProjectFound";
import Pagination from "../components/Pagination";
import ProjectSidebar from "../components/ProjectSidebar";

function makeTasks(projectId, count, completedCount) {
  return Array.from({ length: count }, (_, index) => ({
    id: `${projectId}-${index + 1}`,
    title: `Project task ${index + 1}`,
    description: "",
    dueDate: "No date",
    completed: index < completedCount,
  }));
}

const initialProjects = [
  {
    id: 1,
    title: "Website redesign",
    description: "A fresh look and feel for our company website.",
    dueDate: "Nov 18",
    category: "Design",
    tone: "bg-emerald-100 text-emerald-800",
    tasks: makeTasks(1, 12, 8),
    initials: ["JD", "MK", "AL"],
  },
  {
    id: 2,
    title: "Mobile app launch",
    description: "Ship the first version of the mobile experience.",
    dueDate: "Nov 24",
    category: "Product",
    tone: "bg-sky-100 text-sky-800",
    tasks: makeTasks(2, 9, 5),
    initials: ["MK", "SR"],
  },
  {
    id: 3,
    title: "Q4 campaign",
    description: "Plan and deliver the end-of-year campaign.",
    dueDate: "Dec 02",
    category: "Marketing",
    tone: "bg-amber-100 text-amber-800",
    tasks: makeTasks(3, 8, 3),
    initials: ["AL", "JD", "SR"],
  },
];

const filters = ["All projects", "In progress", "Completed"];

function App() {
  const [projects, setProjects] = useState(initialProjects);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All projects");
  const [search, setSearch] = useState("");
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [taskDialog, setTaskDialog] = useState(null);
  const [projectPage, setProjectPage] = useState(1);
  const [taskPage, setTaskPage] = useState(1);
  const [feedback, setFeedback] = useState("");
  const pageSize = 2;
  const taskPageSize = 5;

  const filteredProjects = projects.filter((project) => {
    const completed = project.tasks.filter((task) => task.completed).length;
    const progress = project.tasks.length
      ? completed / project.tasks.length
      : 0;
    const matchesFilter =
      activeFilter === "All projects" ||
      (activeFilter === "Completed" && progress === 1) ||
      (activeFilter === "In progress" && progress < 1);
    const matchesProject =
      activeProjectId === null || project.id === activeProjectId;
    const matchesSearch = `${project.title} ${project.description}`
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesProject && matchesSearch;
  });
  const totalTasks = projects.reduce(
    (total, project) => total + project.tasks.length,
    0,
  );
  const completedTasks = projects.reduce(
    (total, project) =>
      total + project.tasks.filter((task) => task.completed).length,
    0,
  );
  const visibleProjects = filteredProjects.slice(
    (projectPage - 1) * pageSize,
    projectPage * pageSize,
  );
  const activeProject = projects.find(
    (project) => project.id === activeProjectId,
  );
  const visibleTasks =
    activeProject?.tasks.slice(
      (taskPage - 1) * taskPageSize,
      taskPage * taskPageSize,
    ) || [];

  function showFeedback(message) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 2500);
  }

  function handleCreateProject(projectDetails) {
    const project = {
      ...projectDetails,
      id: Date.now(),
      category: "New project",
      tone: "bg-rose-100 text-rose-800",
      tasks: [],
      initials: ["JD"],
    };

    setProjects((currentProjects) => [project, ...currentProjects]);
    setActiveProjectId(project.id);
    setActiveFilter("All projects");
    setSearch("");
    setIsCreatingProject(false);
    showFeedback("Project created");
  }

  function handleSaveProject(projectDetails) {
    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === editingProject.id
          ? { ...project, ...projectDetails }
          : project,
      ),
    );
    setEditingProject(null);
    showFeedback("Project updated");
  }

  function handleDeleteProject(projectId) {
    if (!window.confirm("Delete this project and all its tasks?")) return;
    setProjects((currentProjects) =>
      currentProjects.filter((project) => project.id !== projectId),
    );
    if (activeProjectId === projectId) setActiveProjectId(null);
    setProjectPage(1);
    showFeedback("Project deleted");
  }

  function handleSaveTask(taskDetails) {
    const { task, projectId } = taskDialog;
    setProjects((currentProjects) =>
      currentProjects.map((project) => {
        if (project.id !== projectId) return project;
        const tasks = task
          ? project.tasks.map((item) =>
              item.id === task.id ? { ...item, ...taskDetails } : item,
            )
          : [
              { ...taskDetails, id: Date.now(), completed: false },
              ...project.tasks,
            ];
        return { ...project, tasks };
      }),
    );
    setTaskDialog(null);
    setTaskPage(1);
    showFeedback(task ? "Task updated" : "Task added");
  }

  function handleDeleteTask(taskId) {
    if (!window.confirm("Delete this task?")) return;
    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === activeProjectId
          ? {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId),
            }
          : project,
      ),
    );
    setTaskPage(1);
    showFeedback("Task deleted");
  }

  function handleToggleTask(taskId) {
    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === activeProjectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task,
              ),
            }
          : project,
      ),
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f5] text-[#172a25] lg:flex">
      <ProjectSidebar
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={(projectId) => {
          setActiveProjectId(projectId);
          setTaskPage(1);
          setProjectPage(1);
        }}
        onShowAllProjects={() => {
          setActiveProjectId(null);
          setProjectPage(1);
        }}
        onAddProject={() => setIsCreatingProject(true)}
      />

      <main className="min-w-0 flex-1 px-4 py-7 sm:px-7 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <header className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-[#718078]">
                Monday, November 2, 2026
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-[#18372e] sm:text-4xl">
                Good morning, Ahmed <span aria-hidden="true">☀</span>
              </h1>
              <p className="mt-2 text-sm text-[#718078] sm:text-base">
                Here&apos;s what&apos;s happening with your projects today.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreatingProject(true)}
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#1f5946] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#174737] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f5946] focus-visible:ring-offset-2 sm:self-auto"
            >
              <span className="text-lg leading-none" aria-hidden="true">
                +
              </span>
              New project
            </button>
          </header>

          <section
            aria-label="Workspace summary"
            className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4"
          >
            <SummaryCard
              label="Active projects"
              value={projects.length}
              note="Across your workspace"
              marker="01"
            />
            <SummaryCard
              label="Tasks completed"
              value={`${completedTasks}/${totalTasks}`}
              note="A good pace this week"
              marker="02"
            />
            <SummaryCard
              label="Due this week"
              value="04"
              note="Keep an eye on these"
              marker="03"
            />
            <SummaryCard
              label="Team members"
              value="06"
              note="Working together"
              marker="04"
            />
          </section>

          <section aria-labelledby="projects-heading">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2
                  id="projects-heading"
                  className="text-xl font-semibold text-[#18372e]"
                >
                  {activeProjectId === null
                    ? "Your projects"
                    : projects.find((project) => project.id === activeProjectId)
                        ?.title || "Your projects"}
                </h2>
                <p className="mt-1 text-sm text-[#718078]">
                  A clear view of the work moving your team forward.
                </p>
              </div>
              <label className="relative block w-full md:max-w-xs">
                <span className="sr-only">Search projects</span>
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#84928b]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16 16 4 4" />
                </svg>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setProjectPage(1);
                  }}
                  placeholder="Search projects"
                  className="h-11 w-full rounded-xl border border-[#dfe6e1] bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-[#9aa69f] focus:border-[#4b8a70] focus:ring-4 focus:ring-[#4b8a70]/10"
                />
              </label>
            </div>

            <div
              className="mb-5 flex gap-2 overflow-x-auto pb-1"
              role="group"
              aria-label="Filter projects"
            >
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    setActiveFilter(filter);
                    setProjectPage(1);
                  }}
                  aria-pressed={activeFilter === filter}
                  className={`shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                    activeFilter === filter
                      ? "bg-[#dcebe3] text-[#1f5946]"
                      : "text-[#718078] hover:bg-white hover:text-[#18372e]"
                  }`}
                >
                  {filter}
                </button>
              ))}
              <span className="ml-auto hidden self-center text-xs text-[#8a9890] sm:block">
                {filteredProjects.length} projects
              </span>
            </div>

            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleProjects.map((project) => {
                  const completed = project.tasks.filter(
                    (task) => task.completed,
                  ).length;
                  const progress = project.tasks.length
                    ? Math.round((completed / project.tasks.length) * 100)
                    : 0;

                  return (
                    <article
                      key={project.id}
                      className="group rounded-2xl border border-[#e5ebe6] bg-white p-5 shadow-[0_2px_8px_rgba(27,54,43,0.03)] transition hover:-translate-y-0.5 hover:border-[#c9d9cf] hover:shadow-[0_12px_30px_rgba(27,54,43,0.08)] sm:p-6"
                    >
                      <div className="mb-5 flex items-start justify-between gap-3">
                        <span
                          className={`rounded-md px-2.5 py-1 text-xs font-semibold ${project.tone}`}
                        >
                          {project.category}
                        </span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            aria-label={`Edit ${project.title}`}
                            title="Edit project"
                            onClick={() => setEditingProject(project)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#84928b] transition hover:bg-[#f1f5f2] hover:text-[#1f5946] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b8a70]"
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${project.title}`}
                            title="Delete project"
                            onClick={() => handleDeleteProject(project.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#84928b] transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveProjectId(project.id);
                          setTaskPage(1);
                        }}
                        className="block text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b8a70]"
                      >
                        <h3 className="text-lg font-semibold text-[#18372e] group-hover:text-[#1f5946]">
                          {project.title}
                        </h3>
                        <p className="mt-1.5 min-h-10 text-sm leading-5 text-[#78867e]">
                          {project.description}
                        </p>
                      </button>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="font-medium text-[#66766d]">
                            Progress
                          </span>
                          <span className="font-semibold text-[#315d49]">
                            {progress}%
                          </span>
                        </div>
                        <div
                          className="h-1.5 overflow-hidden rounded-full bg-[#edf1ed]"
                          role="progressbar"
                          aria-label={`${project.title} progress`}
                          aria-valuenow={progress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <div
                            className="h-full rounded-full bg-[#4d9875] transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-[#edf1ed] pt-4">
                        <div
                          className="flex -space-x-2"
                          aria-label="Project team"
                        >
                          {project.initials.map((initials, index) => (
                            <span
                              key={initials}
                              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold ${
                                index % 2 === 0
                                  ? "bg-[#e4efe8] text-[#315d49]"
                                  : "bg-[#f5e8dc] text-[#8c5c37]"
                              }`}
                            >
                              {initials}
                            </span>
                          ))}
                        </div>
                        <div className="text-right text-xs text-[#78867e]">
                          <p>
                            {completed}/{project.tasks.length} tasks
                          </p>
                          <p className="mt-1">Due {project.dueDate}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <NoProjectFound
                setIsCreatingProject={() => setIsCreatingProject(true)}
              />
            )}
            <Pagination
              page={projectPage}
              pageCount={Math.ceil(filteredProjects.length / pageSize)}
              onPageChange={setProjectPage}
            />

            {activeProject && (
              <section
                aria-labelledby="tasks-heading"
                className="mt-10 border-t border-[#dfe6e1] pt-7"
              >
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2
                      id="tasks-heading"
                      className="text-xl font-semibold text-[#18372e]"
                    >
                      Tasks
                    </h2>
                    <p className="mt-1 text-sm text-[#718078]">
                      {activeProject.tasks.length} tasks in{" "}
                      {activeProject.title}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setTaskDialog({ projectId: activeProject.id, task: null })
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1f5946] px-4 text-sm font-semibold text-white transition hover:bg-[#174737] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f5946] focus-visible:ring-offset-2"
                  >
                    <span aria-hidden="true">+</span> New task
                  </button>
                </div>
                {activeProject.tasks.length ? (
                  <div className="divide-y divide-[#e5ebe6] rounded-xl border border-[#e5ebe6] bg-white">
                    {visibleTasks.map((task) => (
                      <article
                        key={task.id}
                        className="flex flex-wrap items-center gap-3 p-4"
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task.id)}
                          aria-label={`Mark ${task.title} ${task.completed ? "incomplete" : "complete"}`}
                          className="h-4 w-4 accent-[#1f5946]"
                        />
                        <div className="min-w-0 flex-1">
                          <h3
                            className={`text-sm font-semibold ${task.completed ? "text-[#84928b] line-through" : "text-[#18372e]"}`}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="mt-1 text-sm text-[#78867e]">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-[#78867e]">
                          Due {task.dueDate}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setTaskDialog({ projectId: activeProject.id, task })
                          }
                          aria-label={`Edit ${task.title}`}
                          title="Edit task"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#84928b] transition hover:bg-[#f1f5f2] hover:text-[#1f5946]"
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          aria-label={`Delete ${task.title}`}
                          title="Delete task"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#84928b] transition hover:bg-rose-50 hover:text-rose-700"
                        >
                          ×
                        </button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed border-[#cfdad2] bg-white p-8 text-center text-sm text-[#78867e]">
                    No tasks yet. Add one to get started.
                  </p>
                )}
                <Pagination
                  page={taskPage}
                  pageCount={Math.ceil(
                    activeProject.tasks.length / taskPageSize,
                  )}
                  onPageChange={setTaskPage}
                />
              </section>
            )}
          </section>
        </div>
      </main>

      {isCreatingProject && (
        <NewProject
          onCancel={() => setIsCreatingProject(false)}
          onSave={handleCreateProject}
        />
      )}
      {editingProject && (
        <NewProject
          key={editingProject.id}
          project={editingProject}
          onCancel={() => setEditingProject(null)}
          onSave={handleSaveProject}
        />
      )}
      {taskDialog && (
        <NewTask
          key={taskDialog.task?.id || "new-task"}
          task={taskDialog.task}
          projectTitle={
            projects.find((project) => project.id === taskDialog.projectId)
              ?.title
          }
          onCancel={() => setTaskDialog(null)}
          onSave={handleSaveTask}
        />
      )}
      {feedback && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[60] rounded-lg bg-[#173b31] px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          {feedback}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, note, marker }) {
  return (
    <article className="rounded-2xl border border-[#e5ebe6] bg-white p-4 shadow-[0_2px_8px_rgba(27,54,43,0.03)] sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-medium text-[#718078] sm:text-sm">{label}</p>
        <span className="text-[10px] font-semibold tracking-[0.12em] text-[#a2aea6]">
          {marker}
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-[#18372e] sm:text-3xl">
        {value}
      </p>
      <p className="mt-1.5 hidden text-xs text-[#8a9890] sm:block">{note}</p>
    </article>
  );
}

export default App;
