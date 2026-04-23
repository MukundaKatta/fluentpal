import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      {/* Nav */}
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
          FluentPal
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <Link
              href="/lessons"
              className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              My Lessons
            </Link>
          ) : (
            <>
              <Link href="#demo" className="hidden sm:inline hover:opacity-70">
                See a demo
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[500px] bg-gradient-to-b from-blue-100 via-blue-50 to-transparent opacity-60" />
        <div className="mx-auto max-w-4xl px-6 pt-20 pb-20 text-center sm:pt-28">
          <p className="mb-5 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Consumer AI
          </p>
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-neutral-900 sm:text-7xl">
            Learn English by talking.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600 sm:text-xl">
            An AI tutor in your pocket. Two minutes a day, real conversations,
            gentle corrections.
          </p>
          <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={user ? "/lessons" : "/login"}
              className="rounded-full bg-neutral-900 px-7 py-3.5 font-medium text-white transition hover:bg-neutral-700"
            >
              {user ? "Pick a lesson" : "Start for free"}
            </Link>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="border-y border-neutral-200 bg-neutral-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Live preview
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              See it in action
            </h2>
          </div>
          <div className="mt-12">
            <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-sm">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="font-medium">Lesson · Ordering coffee</span>
              </div>
              <div className="flex flex-col gap-3 p-5 min-h-[260px]">
                <DemoBubble side="ai" text="Hi! Let's practice ordering coffee. Ready?" delay={0} />
                <DemoBubble side="you" text="Yes, I ready." delay={900} />
                <DemoBubble side="ai" text="Almost! Try: 'Yes, I'm ready.' — now, what can I get for you?" delay={1800} />
                <DemoBubble side="you" text="Yes, I'm ready. One latte please." delay={2700} />
                <DemoBubble side="ai" text="Perfect! Coming right up — great job!" delay={3600} />
              </div>
              <div className="border-t border-neutral-200 bg-neutral-50 px-5 py-3 text-center text-xs text-neutral-500">
                Real AI conversation — try it free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What you get</h2>
          </div>
          <div className="mt-12 grid gap-12 sm:grid-cols-3">
            <div>
              <div className="text-3xl">💬</div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">Text-first</h3>
              <p className="mt-2 leading-relaxed text-neutral-600">
                Real conversations, not flashcards. Chat with an AI that responds like a patient teacher.
              </p>
            </div>
            <div>
              <div className="text-3xl">✨</div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">Instant feedback</h3>
              <p className="mt-2 leading-relaxed text-neutral-600">
                Catches grammar and word choice. Shows you the right way, kindly.
              </p>
            </div>
            <div>
              <div className="text-3xl">🔁</div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">Your pace</h3>
              <p className="mt-2 leading-relaxed text-neutral-600">
                Two minutes on the bus or thirty before bed. 5 free lessons every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
              How it works
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Three steps. No learning curve.
            </h2>
          </div>
          <div className="mt-12 grid gap-12 sm:grid-cols-3">
            <div>
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                1
              </div>
              <h3 className="text-lg font-semibold tracking-tight">Sign up in seconds</h3>
              <p className="mt-2 leading-relaxed text-neutral-600">
                Enter your email. We send a magic link — no password needed.
              </p>
            </div>
            <div>
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                2
              </div>
              <h3 className="text-lg font-semibold tracking-tight">Pick a scenario</h3>
              <p className="mt-2 leading-relaxed text-neutral-600">
                Coffee shop, job interview, airport, and more. Choose what matters to you.
              </p>
            </div>
            <div>
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                3
              </div>
              <h3 className="text-lg font-semibold tracking-tight">Get value in the first minute</h3>
              <p className="mt-2 leading-relaxed text-neutral-600">
                Not your first day. Your first minute. Try it free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-4xl px-6 py-28 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Ready to start talking?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-neutral-600">
          5 free lessons every day. No credit card required.
        </p>
        <Link
          href={user ? "/lessons" : "/login"}
          className="mt-8 inline-block rounded-full bg-blue-600 px-7 py-3.5 font-medium text-white transition hover:bg-blue-700"
        >
          {user ? "Pick a lesson" : "Get started free"}
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-sm text-neutral-500">
          <p className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
            FluentPal
          </p>
          <p>© 2026</p>
        </div>
      </footer>
    </>
  );
}

function DemoBubble({
  side,
  text,
  delay,
}: {
  side: "ai" | "you";
  text: string;
  delay: number;
}) {
  void delay; // used client-side for animation; kept as prop for future use
  return (
    <div
      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
        side === "ai"
          ? "self-start bg-blue-50 text-blue-900"
          : "self-end bg-neutral-900 text-white"
      }`}
    >
      {text}
    </div>
  );
}
