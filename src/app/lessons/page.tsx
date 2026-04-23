import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { LESSONS } from "@/lib/lessons";
import Link from "next/link";

export default async function LessonsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Count lessons used today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", today.toISOString());

  const used = count ?? 0;
  const remaining = Math.max(0, 5 - used);

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
          FluentPal
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-neutral-500">{user.email}</span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-neutral-500 hover:text-neutral-900 transition"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Pick a lesson</h1>
          <span
            className={`text-sm font-medium ${
              remaining === 0 ? "text-red-500" : "text-neutral-500"
            }`}
          >
            {remaining} / 5 lessons remaining today
          </span>
        </div>
        <p className="mb-10 text-neutral-500">
          Choose a real-life scenario and start practicing.
        </p>

        {remaining === 0 && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
            You've used all 5 free lessons for today. Come back tomorrow!
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LESSONS.map((lesson) => (
            <Link
              key={lesson.id}
              href={remaining > 0 ? `/lessons/${lesson.id}` : "#"}
              className={`group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition ${
                remaining > 0
                  ? "hover:border-blue-300 hover:shadow-md cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <span className="text-4xl">{lesson.emoji}</span>
              <h2 className="mt-4 text-lg font-semibold tracking-tight">
                {lesson.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                {lesson.description}
              </p>
              {remaining > 0 && (
                <span className="mt-4 text-sm font-medium text-blue-600 group-hover:underline">
                  Start lesson →
                </span>
              )}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
