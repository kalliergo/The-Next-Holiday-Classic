"use client";

import { useEffect, useMemo, useState } from "react";
import { createClientInstance } from "@/lib/supabase-browser";

const supabase = createClientInstance();

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "submissions", label: "Submissions" },
  { id: "votes", label: "Votes" },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("tnhc-admin-auth") : null;
    if (saved === "true") {
      setIsAuthenticated(true);
      void loadData();
    }
  }, []);

  async function loadData() {
    setLoading(true);
    const [{ data: s1 }, { data: s2 }, { data: s3 }] = await Promise.all([
      supabase.from("submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("votes").select("*").order("created_at", { ascending: false }),
      supabase.from("songs").select("*").order("created_at", { ascending: true }),
    ]);
    setSubmissions((s1 as any[]) || []);
    setVotes((s2 as any[]) || []);
    setSongs((s3 as any[]) || []);
    setLoading(false);
  }

  function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthMessage("");
    if (adminEmail.trim().toLowerCase() !== "info@thenextholidayclassic.com" || adminPassword !== "holidayadmin") {
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

  const stats = useMemo(() => {
    const voters = new Set(votes.map((v: any) => v.voter_email)).size;
    return {
      submissions: submissions.length,
      votes: votes.length,
      voters,
      songs: songs.length,
    };
  }, [submissions, votes, songs]);

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
                <input value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} type="email" placeholder="info@thenextholidayclassic.com" className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/35" />
              </div>
              <div>
                <label className="text-sm uppercase tracking-[0.22em] text-[#d6b56a]">Password</label>
                <input value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} type="password" placeholder="Enter admin password" className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/35" />
              </div>

              {authMessage ? <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{authMessage}</div> : null}

              <button type="submit" className="w-full rounded-full bg-[linear-gradient(180deg,#f7e7b0,#d6b56a)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-black">
                Sign In
              </button>
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
            <button onClick={() => void loadData()} className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/85">Refresh</button>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={activeTab === t.id ? "rounded-full bg-[#d6b56a] px-4 py-2 text-black" : "rounded-full border border-white/12 px-4 py-2 text-white/70"}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? <div className="mt-10 text-white/55">Loading…</div> : null}

        {!loading && activeTab === "overview" && (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Submissions" value={stats.submissions} />
            <StatCard label="Votes" value={stats.votes} />
            <StatCard label="Voters" value={stats.voters} />
            <StatCard label="Songs" value={stats.songs} />
          </div>
        )}

        {!loading && activeTab === "submissions" && (
          <div className="mt-10 space-y-4">
            {submissions.map((item: any) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-xl">{item.song_title}</div>
                <div className="mt-1 text-white/60">{item.full_name}</div>
                <div className="mt-4 text-sm text-white/70">{item.description || "No description provided."}</div>
              </div>
            ))}
          </div>
        )}

        {!loading && activeTab === "votes" && (
          <div className="mt-10 space-y-3">
            {songs.map((song: any) => {
              const totalVotes = votes.filter((vote: any) => vote.song_id === song.id).length;
              return (
                <div key={song.id} className="flex justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <div>{song.title}</div>
                  <div className="text-[#f0d695]">{totalVotes}</div>
                </div>
              );
            })}
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
