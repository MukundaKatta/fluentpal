import { createClient } from "@/lib/supabase-server";
import { getLessonById } from "@/lib/lessons";
import OpenAI from "openai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { lessonId, messages } = body as {
    lessonId: string;
    messages: { role: "user" | "assistant"; content: string }[];
  };

  const lesson = getLessonById(lessonId);
  if (!lesson) {
    return new Response("Lesson not found", { status: 404 });
  }

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [
      { role: "system", content: lesson.systemPrompt },
      ...messages,
    ],
    max_tokens: 200,
    temperature: 0.7,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
