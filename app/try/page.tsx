"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

type Scenario = {
  id: string;
  label: string;
  prompt: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "coffee",
    label: "Order coffee",
    prompt: "You walk into a coffee shop. Order your favourite drink.",
  },
  {
    id: "hotel",
    label: "Check in to hotel",
    prompt: "You arrive at a hotel. Check in and ask for your room key.",
  },
  {
    id: "directions",
    label: "Ask for directions",
    prompt: "You are lost in the city. Ask a local how to get to the train station.",
  },
  {
    id: "job",
    label: "Introduce yourself at work",
    prompt: "It is your first day at a new job. Introduce yourself to a colleague.",
  },
  {
    id: "doctor",
    label: "Talk to a doctor",
    prompt: "You are at a clinic. Tell the doctor about a headache you have had for two days.",
  },
  {
    id: "shop",
    label: "Return an item",
    prompt: "You bought a shirt that does not fit. Return it at the store.",
  },
];

type Status = "idle" | "listening" | "done" | "error" | "unsupported";

function encouragement(words: number): string {
  if (words === 0) return "Nothing was captured — try speaking a bit louder.";
  if (words < 5) return "Good start! A few more words next time.";
  if (words < 10) return "Nice. You are getting more comfortable — keep going.";
  if (words < 20) return "Great response! Your fluency is showing.";
  return "Excellent! That was a full, confident answer. Well done.";
}

export default function TryPage() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [transcript, setTranscript] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SpeechRecognitionCtor = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setStatus("unsupported");
      return;
    }

    const rec = new SpeechRecognitionCtor();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setStatus("done");
    };

    rec.onerror = () => {
      setStatus("error");
    };

    rec.onend = () => {
      if (status === "listening") setStatus("done");
    };

    recognitionRef.current = rec;
    rec.start();
    setStatus("listening");
    setTranscript("");
  }, [status]);

  function stopListening() {
    recognitionRef.current?.stop();
    setStatus("done");
  }

  function reset() {
    setScenario(null);
    setStatus("idle");
    setTranscript("");
  }

  function tryAgain() {
    setStatus("idle");
    setTranscript("");
  }

  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
          FluentPal
        </Link>
        <Link
          href="/#waitlist"
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          Get early access
        </Link>
      </nav>

      <div className="mx-auto max-w-2xl px-6 py-12">
        {!scenario ? (
          <>
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                Speak out loud
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">
                Pick a scenario, then say your reply.
              </h1>
              <p className="mt-2 text-sm text-neutral-500">
                No sign-up. No AI call. Just you and the mic.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScenario(s)}
                  className="rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-left transition hover:border-blue-400 hover:bg-blue-50"
                >
                  <p className="font-semibold text-neutral-900">{s.label}</p>
                  <p className="mt-1 text-xs text-neutral-500 leading-relaxed">{s.prompt}</p>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
              <span className="text-blue-600">Scenario · {scenario.label}</span>
              <button
                onClick={reset}
                className="text-neutral-400 hover:text-neutral-700 transition normal-case font-normal text-xs"
              >
                ← Back
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-blue-50 px-5 py-4">
              <p className="text-sm font-semibold text-blue-800 mb-1">Your prompt</p>
              <p className="text-base leading-relaxed text-blue-900">{scenario.prompt}</p>
            </div>

            {status === "unsupported" && (
              <div className="mt-5 rounded-xl bg-amber-50 px-5 py-4 text-sm text-amber-900">
                Your browser does not support the Web Speech API. Try Chrome or Edge.
              </div>
            )}

            {status === "error" && (
              <div className="mt-5 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-900">
                Could not access the microphone. Check browser permissions and try again.
              </div>
            )}

            {status === "idle" || status === "unsupported" || status === "error" ? (
              <button
                onClick={startListening}
                className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                🎙️ Tap to speak
              </button>
            ) : status === "listening" ? (
              <div className="mt-6">
                <div className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
                  <span className="text-sm font-medium text-white">Listening…</span>
                </div>
                <button
                  onClick={stopListening}
                  className="mt-3 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-500"
                >
                  Stop
                </button>
              </div>
            ) : (
              <>
                <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                    Your response
                  </p>
                  <p className="text-base leading-relaxed text-neutral-900">
                    {transcript || <span className="text-neutral-400 italic">No speech detected.</span>}
                  </p>
                </div>

                <div className="mt-4 rounded-xl bg-green-50 px-5 py-4 text-sm text-green-900">
                  <span className="font-semibold mr-1">Feedback:</span>
                  {encouragement(wordCount)}
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={tryAgain}
                    className="flex-1 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
                  >
                    Try again
                  </button>
                  <button
                    onClick={reset}
                    className="flex-1 rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-900 transition hover:border-neutral-900"
                  >
                    New scenario
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-neutral-400">
          This is a v0 preview — mic capture only, no AI yet.{" "}
          <Link href="/#waitlist" className="underline hover:text-neutral-600">
            Join the waitlist
          </Link>{" "}
          for the full voice-tutor experience.
        </p>
      </div>
    </div>
  );
}
