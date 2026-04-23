import { createClient } from "@/lib/supabase-server";
import { redirect, notFound } from "next/navigation";
import { getLessonById } from "@/lib/lessons";
import ChatUI from "./ChatUI";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = getLessonById(id);
  if (!lesson) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check daily usage
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", today.toISOString());

  const used = count ?? 0;
  if (used >= 5) redirect("/lessons");

  // Record this lesson usage
  await supabase.from("usage").insert({ user_id: user.id, lesson_id: id });

  return <ChatUI lesson={lesson} />;
}
