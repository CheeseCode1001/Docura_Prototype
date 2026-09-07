import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { Avatar, Badge, Button, C, Card, EmptyState, FilterBar, PageHeader, SearchField, VerifiedBadge } from "@/components/ui";
import { api } from "@/services/api";
import type { TvContent } from "@/data/types";

// ─── Shared chrome ────────────────────────────────────────────────────────────
// Docura TV is reachable both from the marketing site and from inside an
// account. Signed-in visitors keep their app shell; everyone else gets a light
// public header that leads back to the site.
function TvShell({ title, children }: { title: string; children: React.ReactNode }) {
  const { role, navigate } = useApp();
  if (role) return <AppShell role={role} topBarTitle={title} showTopBarBack>{children}</AppShell>;
  return (
    <div className="min-h-screen" style={{ backgroundColor: C.warm }}>
      <header className="sticky top-0 z-30 bg-white border-b" style={{ borderColor: C.border }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button onClick={() => navigate("landing")} className="flex items-center gap-2 shrink-0">
            <span className="font-bold text-lg" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Docura</span>
            <Badge variant="amber">TV</Badge>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("tv-home")} className="text-sm font-medium hidden sm:block" style={{ color: C.navy }}>Browse</button>
            <Button size="sm" onClick={() => navigate("role-select")}>Get care on Docura</Button>
          </div>
        </div>
      </header>
      <main className="pb-16">{children}</main>
    </div>
  );
}

function ContentCard({ item, onOpen }: { item: TvContent; onOpen: () => void }) {
  const creator = api.tvCreator(item.creatorId);
  return (
    <button onClick={onOpen} className="text-left group w-full">
      <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-100">
        <img src={item.thumbnail} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.72) 100%)" }} />
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-semibold text-white" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>{item.duration}</span>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white text-sm font-semibold leading-snug line-clamp-2">{item.title}</p>
          <p className="text-white/70 text-[11px] mt-1 truncate">{creator?.name}</p>
        </div>
      </div>
    </button>
  );
}

function formatViews(views: number): string {
  return views >= 1000 ? `${(views / 1000).toFixed(views >= 10000 ? 0 : 1)}k views` : `${views} views`;
}

// ─── Discovery home ───────────────────────────────────────────────────────────
export function TvHome() {
  const { navigate, domain } = useApp();
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const topics = api.tvTopics();
  const content = api.tvContent();

  const results = useMemo(() => content.filter((item) => {
    const matchesTopic = topic === "all" || item.topic === topic;
    const creator = api.tvCreator(item.creatorId);
    const haystack = `${item.title} ${item.summary} ${creator?.name || ""} ${item.topic}`.toLowerCase();
    return matchesTopic && (query === "" || haystack.includes(query.toLowerCase()));
  }), [content, topic, query]);

  const trending = [...content].sort((a, b) => b.views - a.views).slice(0, 4);

  return (
    <TvShell title="Docura TV">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-8" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader
          eyebrow="Docura TV"
          title="Health you can actually understand."
          subtitle="Short explainers from verified healthcare professionals. Every creator on Docura TV is licence-checked before they can publish."
          actions={<Button variant="outline" onClick={() => navigate("tv-saved")}>Saved ({domain.savedContent.length})</Button>}
        />

        <SearchField label="Search Docura TV" value={query} onChange={setQuery} placeholder="Search topics, conditions or creators" />

        <FilterBar
          value={topic}
          onChange={setTopic}
          options={[{ id: "all", label: "All topics" }, ...topics.map((item) => ({ id: item.id, label: `${item.emoji} ${item.label}` }))]}
        />

        {!query && topic === "all" && (
          <section>
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Trending this week</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {trending.map((item) => <ContentCard key={item.id} item={item} onOpen={() => navigate("tv-content", { contentId: item.id })} />)}
            </div>
          </section>
        )}

        {!query && topic === "all" && (
          <section>
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Browse by topic</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {topics.map((item) => (
                <button key={item.id} onClick={() => navigate("tv-topic", { topicId: item.id })} className="text-left rounded-2xl border bg-white p-5 transition-colors hover:border-amber-300" style={{ borderColor: C.border }}>
                  <span className="text-2xl">{item.emoji}</span>
                  <p className="font-semibold mt-3" style={{ color: C.navy }}>{item.label}</p>
                  <p className="text-xs mt-1" style={{ color: C.muted }}>{item.description}</p>
                  <p className="text-xs mt-3 font-semibold" style={{ color: C.amber }}>{content.filter((c) => c.topic === item.id).length} videos →</p>
                </button>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
            {query || topic !== "all" ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Latest"}
          </h2>
          {results.length ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {results.map((item) => <ContentCard key={item.id} item={item} onOpen={() => navigate("tv-content", { contentId: item.id })} />)}
            </div>
          ) : (
            <EmptyState icon="🔎" title="Nothing matched that search" body="Try a broader term, or browse a topic instead." cta="Clear search" onCta={() => { setQuery(""); setTopic("all"); }} />
          )}
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Verified creators</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {api.tvCreators().map((creator) => (
              <button key={creator.id} onClick={() => navigate("tv-creator", { creatorId: creator.id })} className="text-left rounded-2xl border bg-white p-5 hover:border-amber-300 transition-colors" style={{ borderColor: C.border }}>
                <Avatar src={creator.photo} name={creator.name} size={48} />
                <p className="font-semibold mt-3 text-sm" style={{ color: C.navy }}>{creator.name}</p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>{creator.credential}</p>
                <div className="mt-3"><VerifiedBadge label="Licence checked" /></div>
              </button>
            ))}
          </div>
        </section>

        <Card style={{ backgroundColor: C.amberLight, borderColor: "transparent" }}>
          <p className="text-sm font-semibold" style={{ color: C.navy }}>Health education, not medical advice</p>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: C.label }}>
            Docura TV explains general health topics. It cannot replace a consultation about your own situation — start a consultation when you need advice for you.
          </p>
          <Button size="sm" className="mt-4" onClick={() => navigate("role-select")}>Talk to a doctor</Button>
        </Card>
      </div>
    </TvShell>
  );
}

// ─── Topic page ───────────────────────────────────────────────────────────────
export function TvTopic() {
  const { navigate, params } = useApp();
  const topic = api.tvTopics().find((item) => item.id === params.topicId) || api.tvTopics()[0];
  const items = api.tvContent().filter((item) => item.topic === topic.id);
  const creators = api.tvCreators().filter((creator) => creator.topics.includes(topic.id));

  return (
    <TvShell title={topic.label}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-8" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader
          eyebrow={`${topic.emoji} Topic`}
          title={topic.label}
          subtitle={topic.description}
          actions={<Button variant="outline" onClick={() => navigate("tv-home")}>All topics</Button>}
        />
        {items.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {items.map((item) => <ContentCard key={item.id} item={item} onOpen={() => navigate("tv-content", { contentId: item.id })} />)}
          </div>
        ) : (
          <EmptyState icon="🎬" title="No videos here yet" body="Verified creators are publishing on this topic soon." cta="Browse all topics" onCta={() => navigate("tv-home")} />
        )}

        {creators.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Creators covering this topic</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {creators.map((creator) => (
                <button key={creator.id} onClick={() => navigate("tv-creator", { creatorId: creator.id })} className="flex items-center gap-3 rounded-2xl border bg-white p-4 text-left hover:border-amber-300 transition-colors" style={{ borderColor: C.border }}>
                  <Avatar src={creator.photo} name={creator.name} size={44} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: C.navy }}>{creator.name}</p>
                    <p className="text-xs truncate" style={{ color: C.muted }}>{creator.credential}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </TvShell>
  );
}

// ─── Content detail ───────────────────────────────────────────────────────────
export function TvContentPage() {
  const { navigate, params, domain, toggleSavedContent, addToast, role } = useApp();
  const item = api.tvItem(params.contentId || "") || api.tvContent()[0];
  const creator = api.tvCreator(item.creatorId);
  const topic = api.tvTopics().find((t) => t.id === item.topic);
  const saved = domain.savedContent.includes(item.id);
  const [reported, setReported] = useState(false);
  const related = api.tvContent().filter((c) => c.topic === item.topic && c.id !== item.id).slice(0, 4);

  return (
    <TvShell title={item.title}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-8" style={{ fontFamily: "var(--font-body)" }}>
        <div className="grid lg:grid-cols-[minmax(0,340px)_1fr] gap-6 lg:gap-10 items-start">
          <div className="relative rounded-3xl overflow-hidden aspect-[3/4] bg-gray-900 max-w-sm w-full mx-auto lg:mx-0">
            <img src={item.thumbnail} alt="" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                aria-label="Play video"
                onClick={() => addToast("info", "Playback is simulated in this prototype.")}
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "rgba(255,255,255,0.92)" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill={C.navy}><polygon points="6 3 20 12 6 21 6 3" /></svg>
              </button>
            </div>
            <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-semibold text-white" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>{item.duration}</span>
          </div>

          <div className="min-w-0">
            {topic && <button onClick={() => navigate("tv-topic", { topicId: topic.id })} className="text-xs font-semibold uppercase tracking-widest" style={{ color: C.amber }}>{topic.emoji} {topic.label}</button>}
            <h1 className="text-2xl sm:text-3xl font-bold mt-2" style={{ fontFamily: "var(--font-display)", color: C.navy }}>{item.title}</h1>
            <p className="text-sm mt-2" style={{ color: C.muted }}>{formatViews(item.views)} · Published {item.published} · {item.language}</p>

            {creator && (
              <button onClick={() => navigate("tv-creator", { creatorId: creator.id })} className="flex items-center gap-3 mt-5 p-3 rounded-2xl border w-full text-left hover:border-amber-300 transition-colors" style={{ borderColor: C.border, backgroundColor: "white" }}>
                <Avatar src={creator.photo} name={creator.name} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold" style={{ color: C.navy }}>{creator.name}</p>
                    <VerifiedBadge label="Verified" />
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: C.muted }}>{creator.credential} · {creator.verificationBody}</p>
                </div>
              </button>
            )}

            <p className="text-sm leading-relaxed mt-5" style={{ color: C.label }}>{item.summary}</p>

            <div className="flex flex-wrap gap-2 mt-6">
              <Button variant={saved ? "primary" : "outline"} size="sm" onClick={() => { toggleSavedContent(item.id); addToast("success", saved ? "Removed from saved" : "Saved to your library"); }}>
                {saved ? "Saved" : "Save for later"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => { navigator.clipboard?.writeText(`https://docura.health/tv/${item.id}`); addToast("success", "Link copied"); }}>Share</Button>
              <Button variant="ghost" size="sm" onClick={() => { setReported(true); addToast("info", "Thank you — our moderation team will review this."); }}>
                {reported ? "Reported" : "Report content"}
              </Button>
              {role !== "doctor" && <Button size="sm" onClick={() => navigate(role ? "docura-now-flow" : "role-select")}>Ask a doctor about this</Button>}
            </div>

            {item.moderation !== "published" && (
              <div className="mt-5 rounded-xl p-4" style={{ backgroundColor: C.yellowLight }}>
                <p className="text-sm font-semibold" style={{ color: C.yellow }}>Under moderation review</p>
                <p className="text-xs mt-1" style={{ color: C.yellow }}>This video is being reviewed by the Docura medical board before wider publication.</p>
              </div>
            )}
          </div>
        </div>

        <Card>
          <h2 className="font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Key points</h2>
          <ul className="flex flex-col gap-2.5">
            {item.transcript.map((line) => (
              <li key={line} className="flex gap-3 text-sm" style={{ color: C.label }}>
                <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: C.amber }} />
                {line}
              </li>
            ))}
          </ul>
          <p className="text-xs mt-5 pt-4 border-t" style={{ borderColor: C.border, color: C.muted }}>
            General health education. For advice about your own health, speak with your doctor.
          </p>
        </Card>

        {related.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: C.navy }}>More on this topic</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {related.map((c) => <ContentCard key={c.id} item={c} onOpen={() => navigate("tv-content", { contentId: c.id })} />)}
            </div>
          </section>
        )}
      </div>
    </TvShell>
  );
}

// ─── Creator profile ──────────────────────────────────────────────────────────
export function TvCreatorPage() {
  const { navigate, params, addToast } = useApp();
  const creator = api.tvCreator(params.creatorId || "") || api.tvCreators()[0];
  const items = api.tvContent().filter((item) => item.creatorId === creator.id);
  const doctor = api.doctors().find((d) => d.name === creator.name);

  return (
    <TvShell title={creator.name}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-8" style={{ fontFamily: "var(--font-body)" }}>
        <Card>
          <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
            <Avatar src={creator.photo} name={creator.name} size={84} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>{creator.name}</h1>
                {creator.verified && <VerifiedBadge label="Verified creator" />}
              </div>
              <p className="text-sm mt-1" style={{ color: C.muted }}>{creator.credential} · {creator.country}</p>
              <p className="text-sm mt-3 leading-relaxed" style={{ color: C.label }}>{creator.bio}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm" style={{ color: C.muted }}>
                <span><strong style={{ color: C.navy }}>{(creator.followers / 1000).toFixed(1)}k</strong> followers</span>
                <span><strong style={{ color: C.navy }}>{items.length}</strong> videos</span>
              </div>
            </div>
            <div className="flex sm:flex-col gap-2 shrink-0">
              <Button size="sm" onClick={() => addToast("success", `You are following ${creator.name}.`)}>Follow</Button>
              {doctor && <Button size="sm" variant="outline" onClick={() => navigate("doctor-profile", { doctorId: doctor.id })}>Book a consultation</Button>}
            </div>
          </div>
          <div className="mt-5 pt-5 border-t" style={{ borderColor: C.border }}>
            <p className="text-xs" style={{ color: C.muted }}>
              <strong style={{ color: C.navy }}>How this creator was verified:</strong> {creator.verificationBody}. Creators must hold a current licence with a recognised regulator, and content is reviewed against Docura's clinical content policy.
            </p>
          </div>
        </Card>

        <section>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Videos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {items.map((item) => <ContentCard key={item.id} item={item} onOpen={() => navigate("tv-content", { contentId: item.id })} />)}
          </div>
        </section>
      </div>
    </TvShell>
  );
}

// ─── Saved library ────────────────────────────────────────────────────────────
export function TvSaved() {
  const { navigate, domain } = useApp();
  const items = api.tvContent().filter((item) => domain.savedContent.includes(item.id));
  return (
    <TvShell title="Saved">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-6" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader eyebrow="Docura TV" title="Saved for later" subtitle="Videos you kept to come back to." actions={<Button variant="outline" onClick={() => navigate("tv-home")}>Browse Docura TV</Button>} />
        {items.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {items.map((item) => <ContentCard key={item.id} item={item} onOpen={() => navigate("tv-content", { contentId: item.id })} />)}
          </div>
        ) : (
          <EmptyState icon="🔖" title="Nothing saved yet" body="Tap Save on any video and it will wait for you here." cta="Browse Docura TV" onCta={() => navigate("tv-home")} />
        )}
      </div>
    </TvShell>
  );
}

export default TvHome;
