"use client";

import { useEffect, useRef, useState } from "react";
import { createClientInstance } from "@/lib/supabase-browser";

const supabase = createClientInstance();

const fallbackFinalistsByWeek = [
  { week: "Week 1", slots: ["To be determined", "To be determined", "To be determined"] },
  { week: "Week 2", slots: ["To be determined", "To be determined", "To be determined"] },
  { week: "Week 3", slots: ["To be determined", "To be determined", "To be determined"] },
];

const fallbackJudges = [
  { name: "To be determined", role: "Description", image_url: "https://via.placeholder.com/800x900?text=To+be+determined" },
  { name: "To be determined", role: "Description", image_url: "https://via.placeholder.com/800x900?text=To+be+determined" },
  { name: "To be determined", role: "Description", image_url: "https://via.placeholder.com/800x900?text=To+be+determined" },
];

export default function Page() {
  const [semifinalists, setSemifinalists] = useState<any[]>([]);
  const [judges, setJudges] = useState<any[]>(fallbackJudges);
  const [finalistsByWeek] = useState(fallbackFinalistsByWeek);
  const [votes, setVotes] = useState<string[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [signInMessage, setSignInMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [submittingVotes, setSubmittingVotes] = useState(false);
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playerDuration, setPlayerDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const canCompleteSignIn = fullName.trim().length > 1 && email.includes("@") && email.includes(".");
  const canSubmitVotes = signedIn && votes.length === 3 && !submittingVotes;

  useEffect(() => { void loadPageData(); }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handleLoadedMetadata = () => setPlayerDuration(audio.duration || 0);
    const handleEnded = () => { setIsPlaying(false); setCurrentTime(0); };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  async function loadPageData() {
    setLoadingSongs(true);
    const [{ data: songData }, { data: judgeData }] = await Promise.all([
      supabase.from("songs").select("id,title,artist,genre,description,audio_url,week_label,status,duration").eq("status", "semifinalist").eq("week_label", "Week 1").order("created_at", { ascending: true }),
      supabase.from("judges").select("name,role,image_url").order("created_at", { ascending: true }),
    ]);

    if (songData && songData.length > 0) {
      setSemifinalists(songData as any[]);
    } else {
      setSemifinalists(Array.from({ length: 10 }, (_, index) => ({
        id: `placeholder-${index + 1}`,
        title: "To be determined",
        artist: "To be determined",
        genre: "To be determined",
        duration: "0:00",
        description: "To be determined",
        audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        week_label: "Week 1",
        status: "semifinalist",
      })));
    }

    if (judgeData && judgeData.length > 0) setJudges(judgeData as any[]);
    setLoadingSongs(false);
  }

  async function signIn() {
    if (!canCompleteSignIn) return;
    setSignInMessage("");

    const { error: authError } = await supabase.auth.signInWithOtp({ email });
    if (authError) {
      setSignInMessage(authError.message);
      return;
    }

    const { error: voterError } = await supabase.from("voters").upsert([{ full_name: fullName, email }], { onConflict: "email" });
    if (voterError) {
      setSignInMessage(voterError.message);
      return;
    }

    setSignedIn(true);
    setSubmitMessage("");
    setSignInMessage("Check your email for your sign-in link.");
  }

  function toggleVote(songId: string) {
    if (!signedIn) return;
    setSubmitMessage("");
    if (votes.includes(songId)) {
      setVotes(votes.filter((v) => v !== songId));
      return;
    }
    if (votes.length < 3) {
      setVotes(votes.concat(songId));
    }
  }

  async function submitVotes() {
    if (!canSubmitVotes) return;
    setSubmittingVotes(true);
    setSubmitMessage("");

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const rows = votes.map((songId) => ({
        voter_email: normalizedEmail,
        song_id: songId,
        vote_round: "Week 1",
      }));

      const { error } = await supabase.from("votes").insert(rows);

      if (error) {
        const message = (error.message || "").toLowerCase();
        if (message.includes("vote limit reached")) {
          setSubmitMessage("This email has already used all 3 votes for this round.");
        } else if (message.includes("duplicate") || message.includes("unique")) {
          setSubmitMessage("Duplicate vote detected for one of the selected songs.");
        } else {
          setSubmitMessage(error.message || "Could not submit votes.");
        }
        return;
      }

      setSubmitMessage(`Vote submitted for ${normalizedEmail}`);
    } finally {
      setSubmittingVotes(false);
    }
  }

  async function togglePlayback(song: any) {
    const audio = audioRef.current;
    if (!audio || !song.audio_url) return;
    if (currentSongId === song.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
      return;
    }
    audio.src = song.audio_url;
    setCurrentSongId(song.id);
    setCurrentTime(0);
    await audio.play();
    setIsPlaying(true);
  }

  function formatTime(value: number) {
    if (!value || Number.isNaN(value)) return "0:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  return (
    <div className="min-h-screen bg-[#0b0a09] text-white mt-16 md:mt-20">
      <audio ref={audioRef} preload="none" />
      <section className="border-b border-white/10 bg-[linear-gradient(180deg,#0f0d0b_0%,#0b0a09_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">The Next Holiday Classic</div>
          <h1 className="mt-4 text-4xl font-light md:text-7xl">A Global Search for the Next Holiday Hit Song</h1>
          <p className="mt-6 text-white/70">Your vote helps determine the winner.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="/submit" className="rounded-full bg-[linear-gradient(180deg,#f7e7b0,#d6b56a)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-black">Submit to Enter</a>
            <a href="/rules" className="rounded-full border border-white/15 px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">View Rules</a>
            <a href="/radio" className="rounded-full border border-white/15 px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">Podcast / Radio</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[2rem] border border-[#d6b56a]/20 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.28em] text-[#d6b56a]">Voter Sign-In</div>
          <h2 className="mt-3 text-2xl font-light">Sign in with your email to vote</h2>
          <div className="mt-2 text-sm font-medium text-[#f0d695]">You may vote for up to 3 songs</div>
          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" />
            <button onClick={() => void signIn()} disabled={!canCompleteSignIn} className={canCompleteSignIn ? "rounded-2xl bg-[linear-gradient(180deg,#f7e7b0,#d6b56a)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-black" : "cursor-not-allowed rounded-2xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/40"}>{signedIn ? "Update Sign-In" : "Sign In to Vote"}</button>
          </div>
          {signInMessage ? <div className="mt-4 text-sm text-[#f0d695]">{signInMessage}</div> : null}
        </div>

        <div className="mt-10">
          <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Listen to this week's semifinalists</div>
          <h2 className="mt-3 text-3xl font-light md:text-5xl">This Week's Semifinalists</h2>
          {loadingSongs ? <div className="mt-6 text-white/60">Loading semifinalists...</div> : null}

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {semifinalists.map((song, index) => (
              <div key={song.id ?? index} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <div className="text-xs uppercase tracking-[0.26em] text-[#d6b56a]">Semifinalist {index + 1}</div>
                <h3 className="mt-3 text-2xl font-light">{song.title ?? "To be determined"}</h3>
                <div className="mt-2 text-base text-white/70">{song.artist ?? "To be determined"}</div>
                <p className="mt-4 text-sm leading-7 text-white/65">{song.description ?? "To be determined"}</p>

                <div className="mt-6 flex items-center gap-4">
                  <button onClick={() => void togglePlayback(song)} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d6b56a]/50 bg-[#d6b56a]/10 text-[#f0d695]">{currentSongId === song.id && isPlaying ? "❚❚" : "▶"}</button>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-2 rounded-full bg-[#d6b56a]" style={{ width: currentSongId === song.id && playerDuration ? `${(currentTime / playerDuration) * 100}%` : "0%" }} /></div>
                  <div className="text-sm text-[#f0d695] whitespace-nowrap">{currentSongId === song.id ? `${formatTime(currentTime)} / ${formatTime(playerDuration)}` : song.duration ?? "0:00"}</div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-white/50">{song.genre ?? "To be determined"}</div>
                  <label className={signedIn ? "flex cursor-pointer items-center gap-3 rounded-full border border-[#d6b56a]/35 bg-[#d6b56a]/10 px-4 py-2 text-sm font-medium text-[#f0d695]" : "flex cursor-not-allowed items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/35"}>
                    <input type="checkbox" checked={votes.includes(song.id)} onChange={() => toggleVote(song.id)} disabled={!signedIn || (!votes.includes(song.id) && votes.length >= 3)} className="h-4 w-4 accent-[#d6b56a]" />
                    {signedIn ? "Add to top 3 vote" : "Sign in to vote"}
                  </label>
                </div>
              </div>
            ))}
          </div>

          {(signedIn || votes.length > 0) && (
            <div className="sticky bottom-6 z-40 mt-10 flex justify-center">
              <div className="flex w-full max-w-4xl flex-col gap-4 rounded-[1.75rem] border border-[#d6b56a]/30 bg-[linear-gradient(180deg,rgba(18,16,14,0.96),rgba(10,9,8,0.96))] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm uppercase tracking-[0.24em] text-[#d6b56a]">Your Vote</div>
                  <div className="mt-2 text-lg font-medium text-white">{!signedIn ? "Sign in with your email to activate voting" : votes.length < 3 ? `Select ${3 - votes.length} more songs` : "Your Top 3 Songs Are Ready"}</div>
                </div>
                <div className="flex flex-col items-stretch gap-3 md:items-end">
                  {submitMessage ? <div className="rounded-full border border-[#d6b56a]/30 bg-[#d6b56a]/10 px-4 py-2 text-sm text-[#f0d695]">{submitMessage}</div> : null}
                  <button onClick={() => void submitVotes()} disabled={!canSubmitVotes} className={canSubmitVotes ? "rounded-full bg-[linear-gradient(180deg,#f7e7b0,#d6b56a)] px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-black" : "cursor-not-allowed rounded-full border border-white/12 bg-white/5 px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/40"}>{submittingVotes ? "Submitting..." : "Submit Your Votes"}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[2.5rem] border border-[#d6b56a]/25 bg-white/5 p-8 text-center shadow-xl">
          <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Finalists</div>
          <h2 className="mt-3 text-3xl font-light md:text-5xl">Weekly Finalists</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {fallbackFinalistsByWeek.map((item) => (
              <div key={item.week} className="rounded-[2rem] border border-[#d6b56a]/25 bg-[linear-gradient(180deg,rgba(214,181,106,0.12),rgba(255,255,255,0.05))] p-6">
                <div className="text-sm uppercase tracking-[0.3em] text-[#d6b56a]">{item.week}</div>
                <div className="mt-4 space-y-2">
                  {item.slots.map((slot, idx) => <div key={idx} className="rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/70">{slot}</div>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Judges</div>
          <h2 className="mt-3 text-3xl font-light md:text-5xl">Industry credibility meets audience excitement</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {judges.map((judge, index) => (
            <div key={`${judge.name}-${index}`} className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
              <div className="aspect-[4/4.6] overflow-hidden">
                <img src={judge.image_url ?? "https://via.placeholder.com/800x900?text=To+be+determined"} alt={judge.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <div className="text-2xl font-light">{judge.name}</div>
                <div className="mt-2 text-sm uppercase tracking-[0.22em] text-[#d6b56a]">{judge.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
