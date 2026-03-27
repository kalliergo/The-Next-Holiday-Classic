"use client";

import { useEffect, useMemo, useState } from "react";
import { createClientInstance } from "@/lib/supabase-browser";

const supabase = createClientInstance();

type Submission = {
  id: string;
  full_name: string;
  email: string;
  song_title: string;
  genre: string | null;
  description: string | null;
  lyrics: string | null;
  audio_url: string | null;
  created_at: string;
  review_status?: string | null;
  approved_for_week?: string | null;
};

type Vote = {
  id: string;
  voter_email: string;
  song_id: string;
  vote_round: string;
  created_at: string;
};

type Song = {
  id: string;
  title: string | null;
  artist: string | null;
  genre?: string | null;
  description?: string | null;
  audio_url?: string | null;
  week_label?: string | null;
  status?: string | null;
  totalVotes?: number;
};

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "submissions", label: "Submissions" },
  { id: "votes", label: "Votes" },
  { id: "finalists", label: "Finalists" },
] as const;

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("overview");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("Week 1");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("tnhc-admin-auth") : null;
    if (saved === "true") {
      setIsAuthenticated(true);
      void loadData();
    }
  }, []);

  async function loadData() {
    setLoading(true);

    const [{ data: submissionData }, { data: voteData }, { data: songData }] = await Promise.all([
      supabase.from("submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("votes").select("*").order("created_at", { ascending: false }),
      supabase.from("songs").select("*").order("created_at", { ascending: true }),
    ]);

    setSubmissions((submissionData ?? []) as Submission[]);
    setVotes((voteData ?? []) as Vote[]);
    setSongs((songData ?? []) as Song[]);
    setLoading(false);
  }

  function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthMessage("");

    const validEmail = adminEmail.trim().toLowerCase() === "info@thenextholidayclassic.com";
    const validPassword = adminPassword === "holidayadmin";

    if (!validEmail || !validPassword) {
      setAuthMessage("Invalid admin credentials.");
      return;
    }

    setIsAuthenticated(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("tnhc-admin-auth", "true");
    }
    void loadData();
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setAdminPassword("");
    setAuthMessage("");
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("tnhc-admin-auth");
    }
  }

  const filteredSubmissions = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return submissions;
    return submissions.filter((item) =>
      [item.full_name, item.email, item.song_title, item.genre ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [submissions, search]);

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

  const stats = useMemo(() => {
    const voters = new Set(votes.map((v) => v.voter_email)).size;
    const pending = submissions.filter((i) => (i.review_status || "pending") === "pending").length;
    return {
      submissions: submissions.length,
      votes: votes.length,
      voters,
      songs: songs.length,
      pending,
    };
  }, [submissions, votes, songs]);

  async function approveSubmission(item: Submission, weekLabel = selectedWeek) {
    setBusyId(item.id);
    setMessage("");

    const payload = {
      title: item.song_title,
      artist: item.full_name,
      genre: item.genre,
      description: item.description,
      audio_url: item.audio_url,
      week_label: weekLabel,
      status: "semifinalist",
    };

    const ins = await supabase.from("songs").insert([payload]);
    if (ins.error) {
      setMessage(ins.error.message || "Approve failed");
      setBusyId("");
      return;
    }

    const upd = await supabase
      .from("submissions")
      .update({ review_status: "approved", approved_for_week: weekLabel })
      .eq("id", item.id);

    if (upd.error) {
      setMessage(upd.error.message || "Status update failed");
      setBusyId("");
      return;
    }

    setSubmissions((current) =>
      current.map((x) =>
        x.id === item.id ? { ...x, review_status: "approved", approved_for_week: weekLabel } : x
      )
    );
    setSongs((current) => current.concat([{ id: `local-${item.id}`, ...payload }]));
    setMessage(`${item.song_title} approved for ${weekLabel}`);
    setBusyId("");
  }

  async function holdSubmission(item: Submission) {
    setBusyId(item.id);
    setMessage("");

    const res = await supabase.from("submissions").update({ review_status: "hold" }).eq("id", item.id);
    if (res.error) {
      setMessage(res.error.message || "Hold failed");
      setBusyId("");
      return;
    }

    setSubmissions((current) =>
      current.map((x) => (x.id === item.id ? { ...x, review_status: "hold" } : x))
    );
    setMessage(`${item.song_title} on hold`);
    setBusyId("");
  }

  async function rejectSubmission(item: Submission) {
    setBusyId(item.id);
    setMessage("");

    const res = await supabase.from("submissions").update({ review_status: "rejected" }).eq("id", item.id);
    if (res.error) {
      setMessage(res.error.message || "Reject failed");
      setBusyId("");
      return;
    }

    setSubmissions((current) =>
      current.map((x) => (x.id === item.id ? { ...x, review_status: "rejected" } : x))
    );
    setMessage(`${item.song_title} rejected`);
    setBusyId("");
  }

  async function markTopThreeAsFinalists() {
    setMessage("");
    const top = leaderboard.filter((s) => (s.week_label || "Week 1") === selectedWeek).slice(0, 3);
    const ids = top.map((s) => s.id);

    if (ids.length === 0) {
      setMessage(`No songs found for ${selectedWeek}.`);
      return;
    }

    const res = await supabase.from("songs").update({ status: "finalist" }).in("id", ids);
    if (res.error) {
      setMessage(res.error.message || "Save finalists failed");
      return;
    }

    setSongs((current) => current.map((s) => (ids.includes(s.id) ? { ...s, status: "finalist" } : s)));
    setMessage(`Top 3 saved for ${selectedWeek}: ${top.map((s) => s.title).join(", ")}`);
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0a09] px-6 py-16 text-white">
        <div className="mx-auto max-w-xl">
          <div className="rounded-[2rem] border border-[#d6b56a]/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-8 shadow-2xl shadow-black/30">
            <div className="text-center">
              <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Protected Admin Access</div>
              <h1 className="mt-4 text-4xl font-light">Admin Login</h1>
              <p className="mt-4 text-white/65">This area is for authorized contest administration only.</p>
            </div>

            <form onSubmit={handleAdminLogin} className="mt-8 space-y-5">
              <div>
                <label className="text-sm uppercase tracking-[0.22em] text-[#d6b56a]">Admin Email</label>
                <input
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  type="email"
                  placeholder="info@thenextholidayclassic.com"
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/35"
                />
              </div>

              <div>
                <label className="text-sm uppercase tracking-[0.22em] text-[#d6b56a]">Password</label>
                <input
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  type="password"
                  placeholder="Enter admin password"
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/35"
                />
              </div>

              {authMessage ? (
                <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                  {authMessage}
                </div>
              ) : null}

              <button type="submit" className="w-full rounded-full bg-[linear-gradient(180deg,#f7e7b0,#d6b56a)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-black">
                Sign In
              </button>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white/50">
                Preview credentials: <span className="text-white/75">info@thenextholidayclassic.com</span> / <span className="text-white/75">holidayadmin</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0a09] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Admin Panel</div>
            <h1 className="mt-3 text-4xl font-light md:text-6xl">The Next Holiday Classic</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={handleLogout} className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/85">Logout</button>
            <button onClick={() => void loadData()} className="rounded-full border border-white/15 px-5 py-3 text-sm">Refresh</button>
            <button onClick={() => void markTopThreeAsFinalists()} className="rounded-full bg-[linear-gradient(180deg,#f7e7b0,#d6b56a)] px-5 py-3 text-sm text-black">Calculate Top 3</button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={activeTab === t.id ? "rounded-full bg-[#d6b56a] px-4 py-2 text-black" : "rounded-full border border-white/12 px-4 py-2 text-white/70"}
            >
              {t.label}
            </button>
          ))}
        </div>

        {message ? (
          <div className="mt-6 rounded-2xl border border-[#d6b56a]/30 bg-[#d6b56a]/10 px-5 py-4 text-sm text-[#f0d695]">
            {message}
          </div>
        ) : null}

        {loading ? <div className="mt-10 text-white/55">Loading…</div> : null}

        {!loading && activeTab === "overview" && (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Submissions" value={stats.submissions} />
            <StatCard label="Votes" value={stats.votes} />
            <StatCard label="Voters" value={stats.voters} />
            <StatCard label="Songs" value={stats.songs} />
            <StatCard label="Pending" value={stats.pending} />
          </div>
        )}

        {!loading && activeTab === "submissions" && (
          <div className="mt-10">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search submissions"
              className="w-full max-w-md rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
            />

            <div className="mt-6 grid gap-5">
              {filteredSubmissions.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex justify-between gap-4">
                    <div>
                      <div className="text-xl">{item.song_title}</div>
                      <div className="text-white/60">{item.full_name}</div>
                      <div className="mt-1 text-sm text-white/45">{item.email}</div>
                    </div>
                    <div className="text-right text-sm text-white/50">
                      <div>{item.genre || "No genre"}</div>
                      <div className="mt-1">{new Date(item.created_at).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
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
                      <div className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40">
                        Status: {item.review_status || "pending"}{item.approved_for_week ? ` • ${item.approved_for_week}` : ""}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && activeTab === "votes" && (
          <div className="mt-10">
            {leaderboard.map((s) => (
              <div key={s.id} className="flex justify-between border-b border-white/10 py-3">
                <div>{s.title}</div>
                <div className="text-[#f0d695]">{s.totalVotes || 0}</div>
              </div>
            ))}
          </div>
        )}

        {!loading && activeTab === "finalists" && (
          <div className="mt-10">
            <div className="mb-6 flex flex-wrap gap-3">
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

            {leaderboard
              .filter((s) => (s.week_label || "Week 1") === selectedWeek)
              .slice(0, 3)
              .map((s, i) => (
                <div key={s.id} className="mb-3 rounded-2xl border border-white/10 p-4">
                  Finalist {i + 1}: {s.title} ({s.totalVotes || 0} votes)
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-xs uppercase tracking-[0.25em] text-[#d6b56a]">{label}</div>
      <div className="mt-3 text-3xl">{value}</div>
    </div>
  );
}
