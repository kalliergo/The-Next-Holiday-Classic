"use client";

import { useState } from "react";
import { createClientInstance } from "@/lib/supabase-browser";

const supabase = createClientInstance();

export default function SubmissionPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const canSubmit =
    fullName.trim().length > 1 &&
    email.includes("@") &&
    songTitle.trim().length > 1 &&
    acceptedRules &&
    !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setMessage("");

    try {
      const { error } = await supabase.from("submissions").insert([
        {
          full_name: fullName,
          email: email.trim().toLowerCase(),
          song_title: songTitle,
          genre,
          description,
          lyrics,
          accepted_rules: true,
          review_status: "pending",
        },
      ]);

      if (error) {
        throw error;
      }

      setMessage("Submission received.");
      setFullName("");
      setEmail("");
      setSongTitle("");
      setGenre("");
      setDescription("");
      setLyrics("");
      setAcceptedRules(false);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? `Submission failed: ${err.message}`
          : "Submission failed. Please try again later.";
      setMessage(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0a09] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Song Submission</div>
          <h1 className="mt-4 text-4xl font-light md:text-6xl">Enter The Next Holiday Classic</h1>
          <p className="mt-6 text-white/70">
            Launch-safe version: this page saves submission details and lyrics. Audio upload can be added later without changing the public site.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 rounded-[2.5rem] border border-[#d6b56a]/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-8 shadow-xl">
          <div className="grid gap-6 md:grid-cols-2">
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3" placeholder="Artist / Writer Name" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3" placeholder="Email" type="email" />
            <input value={songTitle} onChange={(e) => setSongTitle(e.target.value)} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3" placeholder="Song Title" />
            <input value={genre} onChange={(e) => setGenre(e.target.value)} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3" placeholder="Genre" />
          </div>

          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-6 min-h-[120px] w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3" placeholder="Song Description" />
          <textarea value={lyrics} onChange={(e) => setLyrics(e.target.value)} className="mt-6 min-h-[220px] w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3" placeholder="Lyrics" />

          <label className="mt-6 flex items-center gap-3 text-white/85">
            <input type="checkbox" checked={acceptedRules} onChange={() => setAcceptedRules(!acceptedRules)} className="h-5 w-5 accent-[#d6b56a]" />
            <span>I have read and accept the official rules</span>
          </label>

          <div className="mt-8 flex gap-4">
            <button type="submit" disabled={!canSubmit} className={canSubmit ? "rounded-full bg-[linear-gradient(180deg,#f7e7b0,#d6b56a)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-black" : "cursor-not-allowed rounded-full border border-white/15 px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white/40"}>
              {submitting ? "Submitting..." : "Submit Song"}
            </button>
            <a href="/rules" className="rounded-full border border-white/15 px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">View Rules</a>
          </div>

          {message ? <div className="mt-6 text-[#f0d695]">{message}</div> : null}
        </form>
      </div>
    </div>
  );
}
