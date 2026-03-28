"use client";

import { useEffect, useMemo, useState } from "react";
// import { createClientInstance } from "@/lib/supabase-browser";

// --- TypeScript Interfaces ---
interface Submission {
  id: string;
  full_name: string;
  email: string;
  song_title: string;
  genre: string;
  created_at: string;
  audio_url: string;
  lyrics: string;
  description: string;
  review_status: string;
  approved_for_week: string | null;
}

interface Vote {
  id: string;
  voter_email: string;
  song_id: string;
  vote_round: string;
  created_at: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  week_label: string;
  status: string;
  totalVotes?: number;
}

// Fixed: Wrapped the mock return in a proper function declaration and typed it
function createClient() {
  return {
    from(table: string) {
      const chain = {
        select() {
          return this;
        },
        order() {
          if (table === "submissions") {
            return Promise.resolve({
              data: [
                {
                  id: "1",
                  full_name: "To be determined",
                  email: "artist@example.com",
                  song_title: "Winter Song",
                  genre: "Holiday Pop",
                  created_at: new Date().toISOString(),
                  audio_url: "https://example.com/song.mp3",
                  lyrics: "Sample lyrics",
                  description: "Sample submission description",
                  review_status: "pending",
                  approved_for_week: null,
                },
              ] as Submission[],
              error: null,
            });
          }
          if (table === "votes") {
            return Promise.resolve({
              data: [
                { id: "1", voter_email: "listener1@example.com", song_id: "song-1", vote_round: "Week 1", created_at: new Date().toISOString() },
                { id: "2", voter_email: "listener2@example.com", song_id: "song-1", vote_round: "Week 1", created_at: new Date().toISOString() },
                { id: "3", voter_email: "listener3@example.com", song_id: "song-2", vote_round: "Week 1", created_at: new Date().toISOString() },
              ] as Vote[],
              error: null,
            });
          }
          if (table === "songs") {
            return Promise.resolve({
              data: [
                { id: "song-1", title: "To be determined", artist: "To be determined", week_label: "Week 1", status: "semifinalist" },
                { id: "song-2", title: "To be determined", artist: "To be determined", week_label: "Week 1", status: "semifinalist" },
                { id: "song-3", title: "To be determined", artist: "To be determined", week_label: "Week 1", status: "semifinalist" },
              ] as Song[],
              error: null,
            });
          }
          return Promise.resolve({ data: [], error: null });
        },
        insert(_payload: any) {
          return Promise.resolve({ data: null, error: null });
        },
        update(_payload: any) {
          return this;
        },
        delete() {
          return this;
        },
        eq(_column: string, _value: any) {
          return Promise.resolve({ data: null, error: null });
        },
        in(_column: string, _values: any[]) {
          return Promise.resolve({ data: null, error: null });
        },
      };
      return chain;
    },
  };
}

const supabase = createClient();

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "submissions", label: "Submissions" },
  { id: "votes", label: "Votes" },
  { id: "finalists", label: "Finalists" },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<string>("Week 1");
  const [message, setMessage] = useState<string>("");
  const [busyId, setBusyId] = useState<string>("");

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [submissionResult, voteResult, songResult] = await Promise.all([
      supabase.from("submissions").select().order(),
      supabase.from("votes").select().order(),
      supabase.from("songs").select().order(),
    ]);

    setSubmissions((submissionResult.data as Submission[]) || []);
    setVotes((voteResult.data as Vote[]) || []);
    setSongs((songResult.data as Song[]) || []);
    setLoading(false);
  }

  const filteredSubmissions = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return submissions;
    return submissions.filter((item) =>
      [item.full_name, item.email, item.song_title, item.genre]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [submissions, search]);

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => (song.week_label || "Week 1") === selectedWeek);
  }, [songs, selectedWeek]);

  const leaderboard = useMemo(() => {
    const counts: Record<string, number> = {};
    votes.forEach((vote) => {
      counts[vote.song_id] = (counts[vote.song_id] || 0) + 1;
    });

    return songs
      .map((song) => ({
        ...song,
        totalVotes: counts[song.id] || 0,
      }))
      .sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0));
  }, [songs, votes]);

  const overviewStats = useMemo(() => {
    const uniqueVoters = new Set(votes.map((vote) => vote.voter_email)).size;
    const pendingSubmissions = submissions.filter((item) => (item.review_status || "pending") === "pending").length;
    return {
      submissions: submissions.length,
      votes: votes.length,
      voters: uniqueVoters,
      songs: songs.length,
      pendingSubmissions,
    };
  }, [submissions, votes, songs]);

  async function approveSubmission(submission: Submission, weekLabel: string = selectedWeek) {
    setBusyId(submission.id);
    setMessage("");

    const payload = {
      title: submission.song_title,
      artist: submission.full_name,
      genre: submission.genre,
      description: submission.description,
      audio_url: submission.audio_url,
      week_label: weekLabel,
      status: "semifinalist",
    };

    const insertResult = await supabase.from("songs").insert([payload]);
    if (insertResult?.error) {
      setMessage((insertResult.error as any).message || "Could not approve submission.");
      setBusyId("");
      return;
    }

    const updateResult = await supabase
      .from("submissions")
      .update({ review_status: "approved", approved_for_week: weekLabel })
      .eq("id", submission.id);

    if (updateResult?.error) {
      setMessage((updateResult.error as any).message || "Submission approved, but status could not be updated.");
      setBusyId("");
      return;
    }

    setSubmissions((current) =>
      current.map((item) =>
        item.id === submission.id ? { ...item, review_status: "approved", approved_for_week: weekLabel } : item
      )
    );
    setSongs((current) => current.concat([{ id: `local-${submission.id}`, ...payload }]));
    setMessage(`${submission.song_title} approved for ${weekLabel}.`);
    setBusyId("");
  }

  async function holdSubmission(submission: Submission) {
    setBusyId(submission.id);
    setMessage("");
    const result = await supabase.from("submissions").update({ review_status: "hold" }).eq("id", submission.id);
    if (result?.error) {
      setMessage((result.error as any).message || "Could not hold submission.");
      setBusyId("");
      return;
    }
    setSubmissions((current) => current.map((item) => (item.id === submission.id ? { ...item, review_status: "hold" } : item)));
    setMessage(`${submission.song_title} placed on hold.`);
    setBusyId("");
  }

  async function rejectSubmission(submission: Submission) {
    setBusyId(submission.id);
    setMessage("");
    const result = await supabase.from("submissions").update({ review_status: "rejected" }).eq("id", submission.id);
    if (result?.error) {
      setMessage((result.error as any).message || "Could not reject submission.");
      setBusyId("");
      return;
    }
    setSubmissions((current) => current.map((item) => (item.id === submission.id ? { ...item, review_status: "rejected" } : item)));
    setMessage(`${submission.song_title} rejected.`);
    setBusyId("");
  }

  async function markTopThreeAsFinalists() {
    setMessage("");
    const weekSongs = leaderboard.filter((song) => (song.week_label || "Week 1") === selectedWeek).slice(0, 3);
    const finalistIds = weekSongs.map((song) => song.id);

    const result = await supabase.from("songs").update({ status: "finalist" }).in("id", finalistIds);
    if (result?.error) {
      setMessage((result.error as any).message || `Could not save finalists for ${selectedWeek}.`);
      return;
    }

    setSongs((current) =>
      current.map((song) => (finalistIds.includes(song.id) ? { ...song, status: "finalist" } : song))
    );
    setMessage(`Top 3 finalists saved for ${selectedWeek}: ${weekSongs.map((s) => s.title).join(", ") || "To be determined"}`);
  }

  return (
    <div className="min-h-screen bg-[#0b0a09] text-white mt-20">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Admin Panel</div>
            <h1 className="mt-3 text-4xl font-light md:text-6xl">The Next Holiday Classic</h1>
            <p className="mt-4 max-w-3xl text-white/70">
              Review submissions, monitor votes, and manage weekly finalist selections from one premium control center.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void loadData()} className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white/85">
              Refresh Data
            </button>
            <button onClick={markTopThreeAsFinalists} className="rounded-full bg-[linear-gradient(180deg,#f7e7b0,#d6b56a)] px-5 py-3 text-sm font-semibold text-black">
              Calculate Top 3
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? "rounded-full bg-[#d6b56a] px-5 py-2.5 text-sm font-semibold text-black" : "rounded-full border border-white/12 px-5 py-2.5 text-sm text-white/70"}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {message ? (
          <div className="mt-6 rounded-2xl border border-[#d6b56a]/30 bg-[#d6b56a]/10 px-5 py-4 text-sm text-[#f0d695]">
            {message}
          </div>
        ) : null}

        {loading ? <div className="mt-10 text-white/55">Loading admin data...</div> : null}

        {!loading && activeTab === "overview" ? (
          <div className="mt-10 space-y-8">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Submissions" value={overviewStats.submissions} />
              <StatCard label="Total Votes" value={overviewStats.votes} />
              <StatCard label="Unique Voters" value={overviewStats.voters} />
              <StatCard label="Songs Loaded" value={overviewStats.songs} />
              <StatCard label="Pending Review" value={overviewStats.pendingSubmissions} />
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <div className="text-xs uppercase tracking-[0.3em] text-[#d6b56a]">Leaderboard</div>
                <h2 className="mt-3 text-2xl font-light">Current vote ranking</h2>
                <div className="mt-6 space-y-3">
                  {leaderboard.slice(0, 8).map((song, index) => (
                    <div key={song.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d6b56a]/15 text-[#f0d695]">{index + 1}</div>
                        <div>
                          <div className="text-white">{song.title || "To be determined"}</div>
                          <div className="text-sm text-white/50">{song.artist || "To be determined"}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-light text-[#f0d695]">{song.totalVotes}</div>
                        <div className="text-xs uppercase tracking-[0.2em] text-white/45">Votes</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <div className="text-xs uppercase tracking-[0.3em] text-[#d6b56a]">Workflow</div>
                <h2 className="mt-3 text-2xl font-light">Admin actions</h2>
                <div className="mt-6 space-y-3">
                  <ActionCard title="Review New Submissions" copy="Listen to uploads, review lyrics, and prepare songs for semifinal consideration." />
                  <ActionCard title="Monitor Live Votes" copy="Track current rankings and identify the top performers for each week." />
                  <ActionCard title="Select Finalists" copy="Lock in the top three songs for each week and note the wildcard judges choice." />
                  <ActionCard title="Export Results" copy="Prepare reporting and communication once voting closes for the round." />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {!loading && activeTab === "submissions" ? (
          <div className="mt-10">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <input
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                placeholder="Search submissions"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/35 md:max-w-md"
              />
              <div className="text-sm text-white/50">{filteredSubmissions.length} submission(s)</div>
            </div>

            <div className="grid gap-5">
              {filteredSubmissions.map((item) => (
                <div key={item.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.25em] text-[#d6b56a]">Submission</div>
                      <h3 className="mt-2 text-2xl font-light">{item.song_title || "Untitled Submission"}</h3>
                      <div className="mt-2 text-white/70">{item.full_name || "Unknown Artist"}</div>
                      <div className="mt-1 text-sm text-white/45">{item.email}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
                      <div>{item.genre || "No genre"}</div>
                      <div className="mt-1 text-white/45">{new Date(item.created_at).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
                    <div>
                      <div className="text-sm uppercase tracking-[0.2em] text-[#d6b56a]">Description</div>
                      <p className="mt-2 text-sm leading-7 text-white/70">{item.description || "No description provided."}</p>

                      <div className="mt-5 text-sm uppercase tracking-[0.2em] text-[#d6b56a]">Lyrics</div>
                      <div className="mt-2 max-h-48 overflow-auto rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white/70">
                        {item.lyrics || "No lyrics provided."}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                      <div className="text-sm uppercase tracking-[0.2em] text-[#d6b56a]">Audio</div>
                      <div className="mt-4 text-sm text-white/65">{item.audio_url ? "Audio file submitted" : "No audio URL"}</div>
                      {item.audio_url ? (
                        <audio controls className="mt-4 w-full">
                          <source src={item.audio_url} type="audio/mpeg" />
                        </audio>
                      ) : null}
                      <div className="mt-5 flex flex-wrap gap-3">
                        <button onClick={() => void approveSubmission(item)} disabled={busyId === item.id} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/85 disabled:opacity-50">Approve</button>
                        <button onClick={() => void holdSubmission(item)} disabled={busyId === item.id} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/85 disabled:opacity-50">Hold</button>
                        <button onClick={() => void rejectSubmission(item)} disabled={busyId === item.id} className="rounded-full border border-red-400/30 px-4 py-2 text-sm text-red-200 disabled:opacity-50">Reject</button>
                      </div>
                      <div className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40">Status: {item.review_status || "pending"}{item.approved_for_week ? ` • ${item.approved_for_week}` : ""}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {!loading && activeTab === "votes" ? (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-[#d6b56a]">Vote Log</div>
              <h2 className="mt-3 text-2xl font-light">Recent votes</h2>
              <div className="mt-6 space-y-3">
                {votes.map((vote) => (
                  <div key={vote.id} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-white/85">{vote.voter_email}</div>
                      <div className="text-xs uppercase tracking-[0.2em] text-[#f0d695]">{vote.vote_round}</div>
                    </div>
                    <div className="mt-2 text-sm text-white/50">Song ID: {vote.song_id}</div>
                    <div className="mt-1 text-xs text-white/35">{new Date(vote.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-[#d6b56a]">Vote Summary</div>
              <h2 className="mt-3 text-2xl font-light">By song</h2>
              <div className="mt-6 space-y-3">
                {leaderboard.map((song) => (
                  <div key={song.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                    <div>
                      <div className="text-white">{song.title || "To be determined"}</div>
                      <div className="text-sm text-white/50">{song.week_label || "Week 1"}</div>
                    </div>
                    <div className="text-lg font-light text-[#f0d695]">{song.totalVotes}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {!loading && activeTab === "finalists" ? (
          <div className="mt-10 space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              {["Week 1", "Week 2", "Week 3"].map((week) => (
                <button
                  key={week}
                  onClick={() => setSelectedWeek(week)}
                  className={selectedWeek === week ? "rounded-full bg-[#d6b56a] px-5 py-2.5 text-sm font-semibold text-black" : "rounded-full border border-white/12 px-5 py-2.5 text-sm text-white/70"}
                >
                  {week}
                </button>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {leaderboard.filter((song) => (song.week_label || "Week 1") === selectedWeek).slice(0, 3).map((song, index) => (
                <div key={song.id} className="rounded-[2rem] border border-[#d6b56a]/25 bg-[linear-gradient(180deg,rgba(214,181,106,0.12),rgba(255,255,255,0.05))] p-6 text-center">
                  <div className="text-sm uppercase tracking-[0.3em] text-[#d6b56a]">Finalist {index + 1}</div>
                  <div className="mt-3 text-2xl font-light text-white">{song.title || "To be determined"}</div>
                  <div className="mt-2 text-sm text-white/55">{song.artist || "To be determined"}</div>
                  <div className="mt-5 text-3xl font-light text-[#f0d695]">{song.totalVotes}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40">Votes</div>
                  <div className="mt-3 text-xs uppercase tracking-[0.2em] text-white/35">{song.status || "semifinalist"}</div>
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-center">
              <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Wildcard</div>
              <h3 className="mt-3 text-3xl font-light">Judges Choice</h3>
              <div className="mx-auto mt-5 max-w-md rounded-[2rem] border border-[#d6b56a]/25 bg-black/20 p-6">
                <div className="text-sm uppercase tracking-[0.2em] text-[#d6b56a]">Selected Entry</div>
                <div className="mt-3 text-xl text-white">To be determined</div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// --- Typed Sub-components ---
interface StatCardProps {
  label: string;
  value: string | number;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
      <div className="text-xs uppercase tracking-[0.25em] text-[#d6b56a]">{label}</div>
      <div className="mt-3 text-3xl font-light text-white">{value}</div>
    </div>
  );
}

interface ActionCardProps {
  title: string;
  copy: string;
}

function ActionCard({ title, copy }: ActionCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-white">{title}</div>
      <div className="mt-2 text-sm leading-7 text-white/55">{copy}</div>
    </div>
  );
}