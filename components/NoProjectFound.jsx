export default function NoProjectFound({ setIsCreatingProject }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#cfdad2] bg-white px-6 py-14 text-center">
      <p className="font-semibold text-[#315d49]">No projects found</p>
      <p className="mt-1 text-sm text-[#78867e]">
        Try another search or create a project to get started.
      </p>
      <button
        type="button"
        onClick={setIsCreatingProject}
        className="mt-4 text-sm font-semibold text-[#1f694e] underline decoration-[#9dc3ad] underline-offset-4 hover:text-[#174737]"
      >
        Create a project
      </button>
    </div>
  );
}
