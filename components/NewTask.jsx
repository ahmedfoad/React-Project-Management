import { useState } from "react";
import Input from "./Input";

export default function NewTask({ onCancel, onSave, task, projectTitle }) {
  const [isSaving, setIsSaving] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (isSaving) return;
    const formData = new FormData(event.currentTarget);
    const dateValue = formData.get("dueDate");
    const dueDate = dateValue
      ? new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        })
      : "No date";

    const taskDetails = {
      title: formData.get("title").trim(),
      description: formData.get("description").trim(),
      dueDate,
    };

    setIsSaving(true);
    window.setTimeout(() => onSave(taskDetails), 650);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#10251f]/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (!isSaving && event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-dialog-title"
        className="max-h-[calc(100dvh-1rem)] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-7"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#609176]">
              Project task
            </p>
            <h2
              id="task-dialog-title"
              className="mt-1 text-xl font-semibold text-[#18372e]"
            >
              {task ? "Edit task" : "Add a task"}
            </h2>
            <p className="mt-1 text-sm text-[#78867e]">In {projectTitle}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-[#78867e] hover:bg-[#f1f5f2] disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Task name"
              name="title"
              placeholder="e.g. Review homepage designs"
              defaultValue={task?.title || ""}
              autoFocus
              required
            />
            <Input
              label="Description"
              name="description"
              placeholder="Add details (optional)"
              defaultValue={task?.description || ""}
              textarea
              rows={3}
            />
            <Input
              label="Due date"
              name="dueDate"
              type="date"
              defaultValue={dateInputValue(task?.dueDate)}
            />
          </div>
          <div className="mt-7 flex flex-col-reverse gap-2 border-t border-[#edf1ed] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="h-11 rounded-xl px-5 text-sm font-semibold text-[#68776e] hover:bg-[#f1f5f2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="relative h-11 overflow-hidden rounded-xl bg-[#1f5946] px-5 text-sm font-semibold text-white hover:bg-[#174737] disabled:cursor-wait"
            >
              {isSaving ? "Saving task..." : task ? "Save changes" : "Add task"}
              {isSaving && (
                <span
                  role="progressbar"
                  aria-label="Saving task"
                  className="absolute inset-x-0 bottom-0 h-1 overflow-hidden bg-white/25"
                >
                  <span className="save-progress block h-full w-1/3 bg-white" />
                </span>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function dateInputValue(dateText) {
  if (!dateText || dateText === "No date") return "";
  const parsedDate = new Date(`${dateText}, ${new Date().getFullYear()}`);
  if (Number.isNaN(parsedDate.getTime())) return "";
  return `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, "0")}-${String(parsedDate.getDate()).padStart(2, "0")}`;
}
