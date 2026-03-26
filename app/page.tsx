"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

  const selectedSongs = useMemo(
    () => semifinalists.filter((song: any) => votes.includes(song.id)),
    [semifinalists, votes]
  );

  useEffect(() => {
    void loadPageData();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handleLoadedMetadata = () => setPlayerDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

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
      supabase
        .from("songs")
        .select("id,title,artist,genre,description,audio_url,week_label,status,duration")
        .eq("status", "semifinalist")
        .eq("week_label", "Week 1")
        .order("created_at", { ascending: true }),
      supabase.from("judges").select("name,role,image_url").order("created_at", { ascending: true }),
    ]);

    if (songData && songData.length > 0) {
      setSemifinalists(songData);
    } else {
      setSemifinalists(
        Array.from({ length: 10 }, (_, index) => ({
          id: `placeholder-${index + 1}`,
          title: "To be determined",
          artist: "To be determined",
          genre: "To be determined",
          duration: "0:00",
          description: "To be determined",
          audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          week_label: "Week 1",
          status: "semifinalist",
        }))
      );
    }

    if (judgeData && judgeData.length > 0) {
      setJudges(judgeData);
    }

    setLoadingSongs(false);
  }

  async function signIn() {
    if (!canCompleteSignIn) return;
    setSignInMessage("");

    const normalizedEmail = email.trim().toLowerCase();
    const { error: authError } = await supabase.auth.signInWithOtp({ email: normalizedEmail });
    if (authError) {
      setSignInMessage(authError.message);
      return;
    }

    const { error: voterError } = await supabase
      .from("voters")
      .upsert([{ full_name: fullName, email: normalizedEmail }], { onConflict: "email" });

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
    <div className="min-h-screen bg-[#0b0a09] text-white">
      <audio ref={audioRef} preload="none" />

      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(207,169,80,0.22),_transparent_35%),linear-gradient(180deg,#0f0d0b_0%,#0b0a09_100%)]">
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-10">
          <header className="flex items-center justify-between gap-3 rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(22,20,18,0.82),rgba(12,11,10,0.72))] px-4 py-3 backdrop-blur-xl">
            <div className="hidden md:block text-sm tracking-[0.26em] text-white/88">THE NEXT HOLIDAY CLASSIC</div>
            <nav className="hidden md:flex flex-1 items-center justify-center gap-3 text-sm text-white/80">
              <a className="rounded-full border border-white/12 px-4 py-2 hover:border-[#d6b56a]" href="#listen">Semifinalists</a>
              <a className="rounded-full border border-white/12 px-4 py-2 hover:border-[#d6b56a]" href="#podcast">Podcast</a>
              <a className="rounded-full border border-white/12 px-4 py-2 hover:border-[#d6b56a]" href="#judges">Judges</a>
              <a className="rounded-full border border-white/12 px-4 py-2 hover:border-[#d6b56a]" href="/rules">Rules</a>
              <a className="rounded-full border border-white/12 px-4 py-2 hover:border-[#d6b56a]" href="/privacy">Privacy</a>
            </nav>
            <a className="rounded-full bg-[linear-gradient(180deg,#f7e7b0,#d6b56a)] px-4 py-2 text-xs font-medium text-black sm:px-5 sm:py-2.5 sm:text-sm" href="/submit">Submit a Song</a>
          </header>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-10">
          <div className="text-[11px] uppercase tracking-[0.65em] text-white/70">The</div>
          <h1 className="mt-3 bg-[linear-gradient(180deg,#fff6cc_0%,#f7e7b0_25%,#d6b56a_55%,#b89644_80%,#fff1b8_100%)] bg-clip-text text-4xl font-bold tracking-[0.06em] text-transparent sm:text-5xl md:text-7xl xl:text-8xl">
            NEXT HOLIDAY CLASSIC
          </h1>
          <div className="mx-auto mt-6 max-w-3xl text-sm uppercase tracking-[0.16em] text-[#f0d695] sm:text-lg">
            A Global Search for the Next Holiday Hit Song — and you the listener help determine the winner
          </div>
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 md:grid-cols-3">
            <PrizeCard label="First Prize" amount="$10,000" />
            <PrizeCard label="Second Prize" amount="$2,500" />
            <PrizeCard label="Third Prize" amount="$1,000" />
          </div>
        </div>
      </section>

      <section id="listen" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Listen to this week's semifinalists</div>
            <h2 className="mt-3 text-3xl font-light sm:text-4xl md:text-5xl">This Week&apos;s Semifinalists</h2>
            <p className="mt-4 max-w-2xl text-base text-white/75 sm:text-lg">
              Listen to the songs below and vote for the <span className="font-medium text-[#f0d695]">three semifinalists</span> you believe deserve to advance.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border border-[#d6b56a]/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-[#d6b56a]">Voter Sign-In</div>
              <h3 className="mt-3 text-2xl font-light">Sign in with your email to vote</h3>
              <div className="mt-2 text-sm font-medium text-[#f0d695]">You may vote for up to 3 songs</div>
            </div>
            {signedIn ? (
              <div className="rounded-[1.5rem] border border-[#d6b56a]/25 bg-[#d6b56a]/10 px-5 py-4 text-left">
                <div className="text-xs uppercase tracking-[0.24em] text-[#d6b56a]">Signed In</div>
                <div className="mt-2 text-base font-medium text-white">{fullName}</div>
                <div className="mt-1 text-sm text-white/70">{email}</div>
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 px-5 py-4 text-left text-sm text-white/60">
                Voting unlocks after email sign-in
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/35" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/35" />
            <button onClick={() => void signIn()} disabled={!canCompleteSignIn} className={canCompleteSignIn ? "rounded-2xl bg-[linear-gradient(180deg,#f7e7b0,#d6b56a)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-black" : "cursor-not-allowed rounded-2xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/40"}>
              {signedIn ? "Update Sign-In" : "Sign In to Vote"}
            </button>
          </div>
          {signInMessage ? <div className="mt-4 text-sm text-[#f0d695]">{signInMessage}</div> : null}
        </div>

        <div className="mt-10">
          {loadingSongs ? <div className="text-white/60">Loading semifinalists...</div> : null}
          <div className="grid gap-6 lg:grid-cols-2">
            {semifinalists.map((song: any, index: number) => (
              <div key={song.id ?? index} className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] p-5 sm:p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-[0.26em] text-[#d6b56a]">Semifinalist {index + 1}</div>
                    <h3 className="mt-3 text-2xl font-light">{song.title ?? "To be determined"}</h3>
                    <div className="mt-2 text-base text-white/70">{song.artist ?? "To be determined"}</div>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">{song.description ?? "To be determined"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left md:text-right text-sm text-white/70">
                    <div>{song.genre ?? "To be determined"}</div>
                    <div className="mt-1 text-[#f0d695]">{song.duration ?? "0:00"}</div>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button onClick={() => void togglePlayback(song)} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d6b56a]/50 bg-[#d6b56a]/10 text-[#f0d695]">
                      {currentSongId === song.id && isPlaying ? "❚❚" : "▶"}
                    </button>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-[#d6b56a]" style={{ width: currentSongId === song.id && playerDuration ? `${(currentTime / playerDuration) * 100}%` : "0%" }} />
                    </div>
                    <div className="text-xs sm:text-sm text-[#f0d695] whitespace-nowrap">
                      {currentSongId === song.id ? `${formatTime(currentTime)} / ${formatTime(playerDuration)}` : song.duration ?? "0:00"}
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button className="rounded-full border border-white/15 px-4 py-2 text-sm">View Artist</button>
                    <label className={signedIn ? "flex cursor-pointer items-center gap-3 rounded-full border border-[#d6b56a]/35 bg-[#d6b56a]/10 px-4 py-2 text-sm font-medium text-[#f0d695]" : "flex cursor-not-allowed items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/35"}>
                      <input type="checkbox" checked={votes.includes(song.id)} onChange={() => toggleVote(song.id)} disabled={!signedIn || (!votes.includes(song.id) && votes.length >= 3)} className="h-4 w-4 accent-[#d6b56a]" />
                      {signedIn ? "Add to top 3 vote" : "Sign in to vote"}
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {(signedIn || votes.length > 0) && (
          <div className="sticky bottom-4 z-40 mt-10 flex justify-center">
            <div className="flex w-full max-w-4xl flex-col gap-4 rounded-[1.75rem] border border-[#d6b56a]/30 bg-[linear-gradient(180deg,rgba(18,16,14,0.96),rgba(10,9,8,0.96))] px-5 py-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm uppercase tracking-[0.24em] text-[#d6b56a]">Your Vote</div>
                <div className="mt-2 text-lg font-medium text-white">
                  {!signedIn ? "Sign in with your email to activate voting" : votes.length < 3 ? `Select ${3 - votes.length} more songs` : "Your Top 3 Songs Are Ready"}
                </div>
                <div className="mt-1 text-sm text-white/65">
                  {!signedIn ? "Email sign-in is required before a vote can be submitted." : votes.length < 3 ? "Choose exactly 3 semifinalists before submitting." : `Selected: ${selectedSongs.map((song: any) => song.title).join(", ")}`}
                </div>
              </div>
              <div className="flex flex-col items-stretch gap-3 md:items-end">
                {submitMessage ? <div className="rounded-full border border-[#d6b56a]/30 bg-[#d6b56a]/10 px-4 py-2 text-sm text-[#f0d695]">{submitMessage}</div> : null}
                <button onClick={() => void submitVotes()} disabled={!canSubmitVotes} className={canSubmitVotes ? "rounded-full bg-[linear-gradient(180deg,#f7e7b0,#d6b56a)] px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-black" : "cursor-not-allowed rounded-full border border-white/12 bg-white/5 px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/40"}>
                  {submittingVotes ? "Submitting..." : "Submit Your Votes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="rounded-[2.5rem] border border-[#d6b56a]/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-8 text-center shadow-xl">
          <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Finalists</div>
          <h2 className="mt-3 text-3xl font-light sm:text-4xl md:text-5xl">Weekly Finalists</h2>
          <p className="mt-4 text-white/70">Finalists will be revealed each week as voting concludes.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {finalistsByWeek.map((item) => (
              <div key={item.week} className="rounded-[2rem] border border-[#d6b56a]/25 bg-[linear-gradient(180deg,rgba(214,181,106,0.12),rgba(255,255,255,0.05))] p-6">
                <div className="text-sm uppercase tracking-[0.3em] text-[#d6b56a]">{item.week}</div>
                <div className="mt-4 space-y-2">
                  {item.slots.map((slot, idx) => (
                    <div key={idx} className="rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/70">{slot}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="judges" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Judges</div>
          <h2 className="mt-3 text-3xl font-light sm:text-4xl md:text-5xl">Industry credibility meets audience excitement</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {judges.map((judge: any, index: number) => (
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

      <section id="podcast" className="border-t border-white/10 bg-[linear-gradient(180deg,#0c0b09_0%,#090807_100%)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Podcast</div>
            <h2 className="mt-3 text-3xl font-light sm:text-4xl md:text-5xl">Podcast</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Hosted by Jason McCoy and featuring all 10 semi finalists songs for the week, with backstories and additional Holiday Classic spotlights.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="text-sm uppercase tracking-[0.22em] text-[#d6b56a]">This Week&apos;s Episode</div>
            <button className="mt-6 rounded-full border border-[#d6b56a]/50 px-5 py-3 text-sm font-medium text-[#f0d695]">Listen to the Podcast</button>
          </div>
        </div>
      </section>

      <section id="enter" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="rounded-[2.5rem] border border-[#d6b56a]/25 bg-[radial-gradient(circle_at_top,rgba(214,181,106,0.18),rgba(255,255,255,0.03)_45%,rgba(255,255,255,0.02)_100%)] px-6 py-12 text-center sm:px-8 md:px-14">
          <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Enter the Contest</div>
          <h2 className="mt-4 text-3xl font-light sm:text-4xl md:text-6xl">Submit your song and compete to become the next holiday standard</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="/submit" className="inline-block rounded-full bg-[#d6b56a] px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-black">Submit to Enter</a>
            <a href="/rules" className="inline-block rounded-full border border-white/15 px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">View Rules</a>
            <a href="/privacy" className="inline-block rounded-full border border-white/15 px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">Privacy</a>
          </div>
        </div>
      </section>
    </div>
  );
}

function PrizeCard({ label, amount }: { label: string; amount: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-3xl font-light text-[#f0d695]">{amount}</div>
      <div className="mt-1 text-sm text-white/65">{label}</div>
    </div>
  );
}
