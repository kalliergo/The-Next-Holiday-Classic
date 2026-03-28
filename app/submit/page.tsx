"use client";

import { useState } from "react";

function createClient() {
  return {
    from(_table: string) {
      return {
        insert(_payload: any) {
          return Promise.resolve({ data: null, error: null });
        },
      };
    },
    storage: {
      from(_bucket: string) {
        return {
          upload(_path: string, _file: File, _options: any) {
            return Promise.resolve({ data: { path: "preview/file" }, error: null });
          },
          getPublicUrl(_path: string) {
            return { data: { publicUrl: "https://example.com/preview-file" } };
          },
        };
      },
    },
  };
}

const supabase = createClient();

export default function SubmissionPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [acceptedRules, setAcceptedRules] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const canSubmit =
    fullName.trim().length > 1 &&
    email.includes("@") &&
    songTitle.trim().length > 1 &&
    audioFile &&
    acceptedRules &&
    !submitting;

  async function uploadFile(bucket: string, folder: string, file: File) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filePath = `${folder}/${Date.now()}-${safeName}`;

    setUploadProgress(20);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: false });

    if (uploadError) throw uploadError;

    setUploadProgress(75);

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    setUploadProgress(100);
    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setMessage("");
    setShowSuccess(false);
    setUploadProgress(5);

    try {
      const audioUrl = await uploadFile("song-audio", "submissions", audioFile);

      const { error } = await supabase.from("submissions").insert([
        {
          full_name: fullName,
          email,
          song_title: songTitle,
          genre,
          description,
          lyrics,
          audio_url: audioUrl,
          accepted_rules: true,
        },
      ]);

      if (error) throw error;

      setMessage("Submission received successfully.");
      setShowSuccess(true);
      setFullName("");
      setEmail("");
      setSongTitle("");
      setGenre("");
      setDescription("");
      setLyrics("");
      setAudioFile(null);

      setAcceptedRules(false);
      setTimeout(() => {
        setUploadProgress(0);
      }, 1200);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed.");
      setUploadProgress(0);
      setShowSuccess(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0a09] px-6 py-16 text-white mt-10 lg:mt-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Song Submission</div>
          <h1 className="mt-4 text-4xl font-light md:text-6xl">Enter The Next Holiday Classic</h1>
          <p className="mt-6 text-white/70">
            Submit your original holiday song for consideration in this season&apos;s competition.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 rounded-[2.5rem] border border-[#d6b56a]/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-8 shadow-xl">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm uppercase tracking-[0.22em] text-[#d6b56a]">Artist / Writer Name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/35" placeholder="Enter full name" />
            </div>
            <div>
              <label className="text-sm uppercase tracking-[0.22em] text-[#d6b56a]">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/35" placeholder="Enter email" type="email" />
            </div>
            <div>
              <label className="text-sm uppercase tracking-[0.22em] text-[#d6b56a]">Song Title</label>
              <input value={songTitle} onChange={(e) => setSongTitle(e.target.value)} className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/35" placeholder="Enter song title" />
            </div>
            <div>
              <label className="text-sm uppercase tracking-[0.22em] text-[#d6b56a]">Genre</label>
              <input value={genre} onChange={(e) => setGenre(e.target.value)} className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/35" placeholder="Pop, Country, Classical..." />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm uppercase tracking-[0.22em] text-[#d6b56a]">Song Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-3 min-h-[120px] w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/35" placeholder="Tell the story behind the song" />
          </div>

          <div className="mt-6">
            <label className="text-sm uppercase tracking-[0.22em] text-[#d6b56a]">Lyrics</label>
            <textarea value={lyrics} onChange={(e) => setLyrics(e.target.value)} className="mt-3 min-h-[220px] w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/35" placeholder="Paste full song lyrics here" />
          </div>

          <div className="mt-6">
            <label className="text-sm uppercase tracking-[0.22em] text-[#d6b56a]">
              Audio Upload
            </label>

            <input
              type="file"
              accept=".mp3"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                if (!file.name.toLowerCase().endsWith(".mp3")) {
                  alert("Only MP3 files are allowed.");
                  return;
                }

                const maxSizeMB = 10;
                if (file.size > maxSizeMB * 1024 * 1024) {
                  alert("File must be under 10MB.");
                  return;
                }

                setAudioFile(file);
              }}
              className="mt-3 block w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-[#d6b56a] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
            />

            {audioFile ? (
              <div className="mt-2 text-sm text-[#f0d695]">
                {audioFile.name}
              </div>
            ) : (
              <div className="mt-2 text-xs text-white/40">
                MP3 only • Max 10MB
              </div>
            )}
          </div>

          <div className="mt-8 rounded-[2rem] border border-[#d6b56a]/25 bg-[#d6b56a]/10 p-6">
            <div className="text-sm uppercase tracking-[0.22em] text-[#d6b56a]">Rules Acceptance Required</div>
            <p className="mt-3 text-white/70">
              Before submitting, you must confirm that you have read and accept the official rules and that you own or control the rights necessary to submit this song.
            </p>
            <label className="mt-5 flex items-center gap-3 text-white/85">
              <input type="checkbox" checked={acceptedRules} onChange={() => setAcceptedRules(!acceptedRules)} className="h-5 w-5 accent-[#d6b56a]" />
              <span>I have read and accept the official rules</span>
            </label>
          </div>

          {submitting || uploadProgress > 0 ? (
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-white/55">
                <span>Upload Progress</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-3 rounded-full bg-[linear-gradient(90deg,#f7e7b0,#d6b56a)] transition-all duration-500"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button type="submit" disabled={!canSubmit} className={canSubmit ? "rounded-full bg-[linear-gradient(180deg,#f7e7b0,#d6b56a)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-black" : "cursor-not-allowed rounded-full border border-white/15 px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white/40"}>
              {submitting ? "Submitting..." : "Submit Song"}
            </button>
            <a href="/rules" className="rounded-full border border-white/15 px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">
              View Rules
            </a>
          </div>

          {message ? <div className="mt-6 text-center text-[#f0d695]">{message}</div> : null}

          {showSuccess ? (
            <div className="mt-6 rounded-[1.5rem] border border-[#d6b56a]/30 bg-[#d6b56a]/10 px-6 py-5 text-center shadow-[0_0_35px_rgba(214,181,106,0.18)]">
              <div className="text-xs uppercase tracking-[0.3em] text-[#d6b56a]">Success</div>
              <div className="mt-2 text-xl font-light text-white">Your song has been submitted</div>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
