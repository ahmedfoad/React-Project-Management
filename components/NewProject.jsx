import Input from "./Input";

export default function NewProject({ onCancel, onSave }) {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const dateValue = formData.get("dueDate");
    const dueDate = dateValue
      ? new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        })
      : "No date";

    onSave({
      title: formData.get("title").trim(),
      description:
        formData.get("description").trim() || "Project details coming soon.",
      dueDate,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#10251f]/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-project-title"
        className="w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-7"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#609176]">
              Workspace
            </p>
            <h2
              id="new-project-title"
              className="mt-1 text-xl font-semibold text-[#18372e]"
            >
              Create a project
            </h2>
            <p className="mt-1 text-sm text-[#78867e]">
              Give your next piece of work a place to grow.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-[#78867e] transition hover:bg-[#f1f5f2] hover:text-[#18372e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b8a70]"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Project name"
              name="title"
              placeholder="e.g. Website redesign"
              autoFocus
              required
            />
            <Input
              label="Description"
              name="description"
              placeholder="What are you working toward?"
              textarea
              rows={3}
            />
            <Input label="Due date" name="dueDate" type="date" />
          </div>

          <div className="mt-7 flex flex-col-reverse gap-2 border-t border-[#edf1ed] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="h-11 rounded-xl px-5 text-sm font-semibold text-[#68776e] transition hover:bg-[#f1f5f2] hover:text-[#18372e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b8a70]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 rounded-xl bg-[#1f5946] px-5 text-sm font-semibold text-white transition hover:bg-[#174737] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f5946] focus-visible:ring-offset-2"
            >
              Create project
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
