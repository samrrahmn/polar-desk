import { createClient } from "@supabase/supabase-js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DownloadButton from "../../../components/DownloadButton";
import {
  faCheckCircle,
  faFolderOpen,
  faEllipsisVertical,
  faPaperclip,
  faFaceSmile,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function generateMetadata({ params }: PageProps) {
  const data = await getProjectData(params.token);

  if (!data) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: data.project.name,
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: { token: string };
}

async function getProjectData(token: string) {
  let projectId: string | null = null;

  // Check magic_links first
  const { data: magicLink } = await supabase
    .from("magic_links")
    .select("project_id, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (magicLink) {
    projectId = magicLink.project_id;

    // Check if link expired
    if (magicLink.expires_at) {
      if (new Date(magicLink.expires_at).getTime() < Date.now()) {
        return null;
      }
    }
  } else {
    // Use token directly as project ID
    projectId = token;
  }

  if (!projectId) {
    return null;
  }

  // Fetch project
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle();

  if (!project) {
    return null;
  }

  // Fetch steps and files in parallel
  const [{ data: steps }, { data: files }] = await Promise.all([
    supabase
      .from("project_steps")
      .select("*")
      .eq("project_id", project.id)
      .order("id", { ascending: true }),
    supabase
      .from("project_files")
      .select("*")
      .eq("project_id", project.id)
      .order("id", { ascending: true }),
  ]);

  console.log(
    "[PORTAL] Loaded project:",
    project.name,
    "steps:",
    steps?.length || 0,
    "files:",
    files?.length || 0,
  );

  return {
    project,
    steps: steps || [],
    files: files || [],
  };
}

function formatDate(date: string | null) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",

    day: "numeric",

    year: "numeric",
  });
}

export default async function ClientPortalPage({ params }: PageProps) {
  const data = await getProjectData(params.token);

  if (!data) {
    return (
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Link not available
          </h1>

          <p className="text-sm text-muted">
            This project link has expired or is no longer valid.
          </p>
        </div>
      </main>
    );
  }
  const { steps, files } = data;

  const completed = steps.filter((s) => !!s.completed_at);

  const progress = steps.length
    ? Math.round((completed.length / steps.length) * 100)
    : 0;

  const firstIncompleteIndex = steps.findIndex((s) => !s.completed_at);

  return (
    <main className="pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto min-h-screen overflow-x-hidden">
      <div className="grid grid-cols-12 gap-4 md:gap-8">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 md:gap-8">
          <section className="bg-surface rounded-xl p-5 md:p-8 border border-default">
            <div className="flex justify-between items-end mb-6 md:mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
                  Project Progress
                </h2>
              </div>

              <span className="text-3xl md:text-4xl font-black tracking-tighter">
                {progress}%
              </span>
            </div>

            <div className="w-full h-3 bg-surface-2 rounded-full overflow-hidden mb-8 md:mb-12">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "var(--gradient-primary)",
                }}
              ></div>
            </div>

            <div className="space-y-4 md:space-y-6 divide-y divide-[rgb(var(--border))]/20">
              {steps.map((step, index) => {
                const isCompleted = !!step.completed_at;

                const isInProgress =
                  firstIncompleteIndex !== -1 && index === firstIncompleteIndex;

                const isFuture =
                  firstIncompleteIndex !== -1 && index > firstIncompleteIndex;

                return (
                  <div
                    key={step.id}
                    className={`flex items-start gap-4 ${
                      isFuture ? "opacity-40" : "pb-6"
                    } ${isCompleted ? "pb-6" : ""}`}
                  >
                    <div
                      className={`mt-1 flex items-center justify-center w-6 h-6 rounded-full ${
                        isCompleted
                          ? "bg-primary/10 text-primary"
                          : isInProgress
                            ? "border-2 border-primary/30"
                            : "border-2 border-default/30"
                      }`}
                    >
                      {isCompleted ? (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-[24px]"
                        />
                      ) : isInProgress ? (
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                      ) : null}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">
                        {step.name}
                      </h3>

                      <p className="text-xs text-muted mt-1">
                        {isCompleted && step.completed_at
                          ? `Completed on ${formatDate(step.completed_at)}`
                          : step.expected_date
                            ? `Expected ${formatDate(step.expected_date)}`
                            : "Upcoming"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-surface rounded-xl p-5 md:p-8 border border-default">
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-extrabold tracking-tight">
                Shared Files
              </h2>

              <button
                type="button"
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Download All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.length === 0 ? (
                <div className="col-span-2 flex items-center justify-center py-5 text-center">
                  <div className="flex flex-col items-center">
                    <FontAwesomeIcon
                      icon={faFolderOpen}
                      style={{ width: "20px", height: "auto" }}
                      className="text-muted mb-2"
                    />

                    <p className="text-sm font-medium text-gray-800">
                      No files yet
                    </p>

                    <p className="text-xs text-muted pt-1">
                      Files will appear here once shared.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {files.map((file) => (
                    <DownloadButton
                      key={file.id}
                      url={file.file_url}
                      name={file.file_name}
                    />
                  ))}
                </>
              )}
            </div>
          </section>
        </div>

        {/* chat section */}

        <div className="col-span-12 lg:col-span-4 sticky top-24 h-[calc(100vh-160px)]">
          <section className="bg-surface rounded-xl flex flex-col h-full border border-default shadow-sm overflow-hidden">
            <div className="p-6 border-b border-default flex items-center justify-between bg-surface-2/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://i.pravatar.cc/100?img=12"
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>

                <div>
                  <h3 className="text-sm font-bold">Julian Marcus</h3>
                  <p className="text-[10px] text-muted uppercase tracking-wider font-semibold">
                    Online
                  </p>
                </div>
              </div>

              <FontAwesomeIcon
                icon={faEllipsisVertical}
                style={{ width: "14px", height: "14px" }}
                className="text-muted hover:text-primary cursor-pointer"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="flex flex-col gap-2 max-w-[85%]">
                <div className="bg-surface-2 p-4 rounded-2xl rounded-tl-none">
                  <p className="text-sm leading-relaxed">
                    Hi there! I've just uploaded the updated color palette
                    reflecting our discussion yesterday. Let me know what you
                    think!
                  </p>
                </div>
                <span className="text-[10px] text-muted ml-1">10:42 AM</span>
              </div>

              <div className="flex flex-col gap-2 max-w-[85%] ml-auto items-end">
                <div className="bg-[#3525CD] text-white p-4 rounded-2xl rounded-tr-none">
                  <p className="text-sm leading-relaxed">
                    Thanks Julian. The indigo feels much deeper now. This is
                    exactly the "Architect" vibe we were looking for.
                  </p>
                </div>
                <span className="text-[10px] text-muted mr-1">10:45 AM</span>
              </div>

              <div className="flex flex-col gap-2 max-w-[85%]">
                <div className="bg-surface-2 p-4 rounded-2xl rounded-tl-none">
                  <p className="text-sm leading-relaxed">
                    Perfect. I'm moving onto the Collateral phase now. Should
                    have some drafts for the stationery set by Friday.
                  </p>
                </div>
                <span className="text-[10px] text-muted ml-1">11:02 AM</span>
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-[1px] bg-surface-3"></div>
                <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
                  Today
                </span>
                <div className="flex-1 h-[1px] bg-surface-3"></div>
              </div>

              <div className="flex flex-col gap-2 max-w-[85%] ml-auto items-end">
                <div className="bg-[#3525CD] text-white p-4 rounded-2xl rounded-tr-none">
                  <p className="text-sm leading-relaxed">
                    Sounds great. Can we also include the business card mockups
                    in that batch?
                  </p>
                </div>
                <span className="text-[10px] text-muted mr-1">Just now</span>
              </div>
            </div>

            <div className="p-6 bg-surface border-t border-default">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Reply to Julian..."
                  className="w-full pl-4 pr-12 h-12 border border-default rounded-xl text-sm focus:outline-none"
                />

                <button
                  type="button"
                  className="absolute right-3 inset-y-0 flex items-center justify-center cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-[#3525CD] flex items-center justify-center cursor-pointer hover:opacity-90">
                    <FontAwesomeIcon
                      icon={faArrowUp}
                      style={{ width: "14px", height: "14px" }}
                      className="text-white"
                    />
                  </div>
                </button>
              </div>

              <div className="flex justify-between items-center mt-3 px-1">
                <div className="flex gap-3">
                  <FontAwesomeIcon
                    icon={faPaperclip}
                    style={{ width: "15px", height: "15px" }}
                    className="text-muted hover:text-primary cursor-pointer"
                  />
                  <FontAwesomeIcon
                    icon={faFaceSmile}
                    style={{ width: "15px", height: "15px" }}
                    className="text-muted hover:text-primary cursor-pointer"
                  />
                </div>

                <span className="text-[10px] text-muted">
                  Press Enter to send
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
