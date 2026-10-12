"use client";

import { type FormEvent, useMemo, useState } from "react";

type View = "search" | "directory" | "profile" | "create" | "settings" | "admin";
type SearchStage = "input" | "review" | "results";

type Profile = {
  id: string;
  initials: string;
  name: string;
  role: string;
  company: string;
  location: string;
  institution: string;
  graduationYear: number;
  experience: string;
  skills: string[];
  bio: string;
  source: "Demo profile" | "User submitted";
  verified: boolean;
  available: boolean;
  updated: string;
};

const seedProfiles: Profile[] = [
  { id: "p1", initials: "AR", name: "Ananya Ramesh", role: "Senior Frontend Engineer", company: "CareStack", location: "Chennai, India", institution: "Easwari Engineering College", graduationYear: 2019, experience: "5 years", skills: ["React", "TypeScript", "Design systems"], bio: "I build accessible product experiences and enjoy helping early-career engineers grow into confident frontend developers.", source: "User submitted", verified: true, available: true, updated: "2 weeks ago" },
  { id: "p2", initials: "VK", name: "Vignesh Kumar", role: "ML Engineer", company: "Healthify", location: "Bengaluru, India", institution: "Easwari Engineering College", graduationYear: 2020, experience: "4 years", skills: ["Python", "Medical imaging", "PyTorch"], bio: "Working on machine-learning systems for clinical imaging. Happy to share notes on research-to-product transitions.", source: "User submitted", verified: true, available: false, updated: "1 month ago" },
  { id: "p3", initials: "PM", name: "Pranav Mohan", role: "Product Manager", company: "Freshworks", location: "Chennai, India", institution: "Easwari Engineering College", graduationYear: 2018, experience: "6 years", skills: ["Product strategy", "B2B SaaS", "Mentoring"], bio: "Product leader focused on making complex tools easier to use. Open to conversations about product careers.", source: "User submitted", verified: true, available: true, updated: "3 weeks ago" },
  { id: "p4", initials: "SN", name: "Sahana Nair", role: "Product Designer", company: "Aster Labs", location: "Kochi, India", institution: "NIT Calicut", graduationYear: 2021, experience: "3 years", skills: ["Figma", "Research", "Accessibility"], bio: "Designer working at the intersection of health, research, and inclusive digital products.", source: "Demo profile", verified: false, available: true, updated: "Demo record" },
  { id: "p5", initials: "RJ", name: "Rohit Jain", role: "Backend Engineer", company: "Razorpay", location: "Remote, India", institution: "Easwari Engineering College", graduationYear: 2022, experience: "2 years", skills: ["Node.js", "PostgreSQL", "Cloud"], bio: "Backend engineer interested in reliable systems, developer experience, and helping students make their first open-source contribution.", source: "User submitted", verified: false, available: true, updated: "5 days ago" },
  { id: "p6", initials: "IS", name: "Ishita Sen", role: "Research Scientist", company: "Visionary AI", location: "Hyderabad, India", institution: "IIT Hyderabad", graduationYear: 2017, experience: "7 years", skills: ["Computer vision", "Research", "Medical imaging"], bio: "Research scientist exploring robust computer vision for medical applications and responsible AI.", source: "Demo profile", verified: false, available: false, updated: "Demo record" },
];

const examples = [
  "Easwari Engineering College alumni from 2018–2022",
  "Frontend developers in Chennai with 2–5 years of experience",
  "Machine-learning researchers in India working on medical imaging",
];

function parseSearch(query: string) {
  const normalized = query.toLowerCase();
  const filters: string[] = [];
  if (normalized.includes("easwari")) filters.push("Easwari Engineering College");
  if (normalized.includes("chennai")) filters.push("Chennai");
  if (normalized.includes("frontend")) filters.push("Frontend developer");
  if (normalized.includes("machine") || normalized.includes("research")) filters.push("Research");
  const years = query.match(/20\d{2}\s*[–-]\s*20\d{2}/);
  if (years) filters.push(years[0].replace(/\s/g, ""));
  const experience = query.match(/\d+\s*[–-]\s*\d+\s*years?/i);
  if (experience && !filters.includes(experience[0])) filters.push(experience[0]);
  return filters.length ? filters : ["Relevant keywords", "Professional context"];
}

function Logo() {
  return <span className="brand"><span className="brand-mark" aria-hidden="true">L</span><span>layer</span></span>;
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "green" | "orange" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function ProfileCard({ profile, onOpen }: { profile: Profile; onOpen: (profile: Profile) => void }) {
  return <article className="profile-card">
    <div className="profile-card-top"><div className="avatar">{profile.initials}</div><Badge tone={profile.verified ? "green" : "neutral"}>{profile.verified ? "Verified" : "Unverified"}</Badge></div>
    <button className="profile-name" onClick={() => onOpen(profile)}>{profile.name}</button>
    <p className="profile-role">{profile.role} <span>at {profile.company}</span></p>
    <p className="profile-meta"><span aria-hidden="true">⌖</span> {profile.location} <span className="dot-separator">·</span> Class of {profile.graduationYear}</p>
    <div className="skill-list">{profile.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
    <div className="match-note"><span aria-hidden="true">✦</span> {profile.available ? "Open to mentoring and professional conversations." : "Profile matches the search context."}</div>
    <div className="profile-footer"><span>{profile.source}</span><span>{profile.updated}</span></div>
  </article>;
}

export default function Home() {
  const [view, setView] = useState<View>("search");
  const [stage, setStage] = useState<SearchStage>("input");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [profiles, setProfiles] = useState(seedProfiles);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [connected, setConnected] = useState(false);
  const [notice, setNotice] = useState("");
  const [directoryFilter, setDirectoryFilter] = useState("");

  const results = useMemo(() => {
    const normalized = query.toLowerCase();
    const yearRange = query.match(/(20\d{2})\s*[–-]\s*(20\d{2})/);
    return profiles.filter((profile) => {
      const institutionMatch = !normalized.includes("easwari") || profile.institution.toLowerCase().includes("easwari");
      const locationMatch = !normalized.includes("chennai") || profile.location.toLowerCase().includes("chennai");
      const yearMatch = !yearRange || (profile.graduationYear >= Number(yearRange[1]) && profile.graduationYear <= Number(yearRange[2]));
      const keywordMatch = !normalized.includes("frontend") || profile.role.toLowerCase().includes("frontend") || profile.skills.some((skill) => skill.toLowerCase().includes("react"));
      const researchMatch = !(normalized.includes("research") || normalized.includes("machine")) || profile.skills.some((skill) => ["research", "medical imaging"].includes(skill.toLowerCase()));
      return institutionMatch && locationMatch && yearMatch && keywordMatch && researchMatch;
    });
  }, [profiles, query]);

  const directoryResults = profiles.filter((profile) => `${profile.name} ${profile.role} ${profile.institution} ${profile.skills.join(" ")}`.toLowerCase().includes(directoryFilter.toLowerCase()));

  function beginSearch(event?: FormEvent) {
    event?.preventDefault();
    if (!query.trim()) return;
    setFilters(parseSearch(query));
    setStage("review");
  }

  function openProfile(profile: Profile) {
    setSelectedProfile(profile);
    setView("profile");
  }

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  function createProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "New member");
    const profile: Profile = { id: `p${Date.now()}`, initials: name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(), name, role: String(form.get("role") || "Professional"), company: String(form.get("company") || "Independent"), location: String(form.get("location") || "India"), institution: String(form.get("institution") || "Not provided"), graduationYear: Number(form.get("graduationYear") || 2020), experience: "New profile", skills: String(form.get("skills") || "Professional").split(",").map((skill) => skill.trim()).filter(Boolean), bio: String(form.get("bio") || "").trim(), source: "User submitted", verified: false, available: form.get("available") === "on", updated: "Just now" };
    setProfiles((current) => [profile, ...current]);
    setSelectedProfile(profile);
    setView("profile");
    showNotice("Your profile has been added to the private preview.");
  }

  return <div className="app-frame">
    <aside className="sidebar">
      <div className="sidebar-brand"><Logo /><span className="preview-label">Preview</span></div>
      <div className="workspace"><div className="workspace-avatar">M</div><div><strong>Mohith&apos;s space</strong><span>Personal workspace</span></div><span className="chevron">⌄</span></div>
      <nav className="side-nav" aria-label="Workspace navigation">
        <button className={view === "search" ? "active" : ""} onClick={() => { setView("search"); setStage("input"); }}><span>⌕</span> Search people</button>
        <button className={view === "directory" ? "active" : ""} onClick={() => setView("directory")}><span>◌</span> Directory <small>{profiles.length}</small></button>
        <p className="nav-section">Manage</p>
        <button className={view === "create" ? "active" : ""} onClick={() => setView("create")}><span>＋</span> Add your profile</button>
        <button className={view === "settings" ? "active" : ""} onClick={() => setView("settings")}><span>⚙</span> Settings</button>
        <p className="nav-section">Workspace</p>
        <button className={view === "admin" ? "active" : ""} onClick={() => setView("admin")}><span>▣</span> Moderation <small className="alert-count">3</small></button>
      </nav>
      <div className="sidebar-bottom"><div className="privacy-mini"><span>◉</span><div><strong>Privacy first</strong><p>Only visible profiles appear in search.</p></div></div><div className="user-row"><div className="avatar avatar-small">M</div><div><strong>Mohith</strong><span>Member</span></div><button aria-label="Open account menu">•••</button></div></div>
    </aside>
    <main className="app-main">
      <header className="topbar"><button className="mobile-logo" onClick={() => setView("search")}><Logo /></button><div className="crumbs"><span>Workspace</span><span>/</span><strong>{view === "search" ? "Search people" : view === "profile" ? "Profile" : view === "create" ? "Add profile" : view[0].toUpperCase() + view.slice(1)}</strong></div><div className="top-actions"><a className="sign-in-link" href="/auth/sign-in">Sign in with LinkedIn</a><button className="icon-button" aria-label="Notifications">♧<span className="notification-dot" /></button><button className="top-user">M</button></div></header>
      {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss notification">×</button></div>}

      {view === "search" && <section className="page-content search-page">
        <div className="page-heading"><div><p className="eyebrow">People discovery</p><h1>Find the right people.</h1><p className="page-subtitle">Search across an opt-in professional community using the context that matters.</p></div><button className="button button-outline" onClick={() => setView("create")}>＋ Add your profile</button></div>
        <div className={`search-workspace stage-${stage}`}>
          <div className="search-panel-header"><div className="ai-orb">✦</div><div><strong>{stage === "input" ? "What are you looking for?" : stage === "review" ? "Review what Layer understood" : "Search results"}</strong><p>{stage === "input" ? "Use plain language. You can adjust the filters before anything is searched." : stage === "review" ? "We found a few useful signals. Edit them before searching the directory." : `Showing ${results.length} visible profiles for your search.`}</p></div><span className="step-indicator">{stage === "input" ? "1 / 3" : stage === "review" ? "2 / 3" : "3 / 3"}</span></div>
          {stage === "input" && <div className="query-stage"><form onSubmit={beginSearch}><label htmlFor="main-search">Describe the people you want to find</label><div className="large-search"><span aria-hidden="true">⌕</span><input id="main-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. Easwari Engineering College alumni from 2018–2022" /><button className="button button-primary" type="submit">Understand <span>↗</span></button></div></form><div className="search-suggestions"><span>Try a starting point</span>{examples.map((example) => <button key={example} onClick={() => { setQuery(example); setFilters(parseSearch(example)); setStage("review"); }}>{example}<span>→</span></button>)}</div></div>}
          {stage === "review" && <div className="review-stage"><div className="intent-box"><span className="intent-label">YOUR SEARCH</span><p>“{query}”</p></div><div className="review-copy"><span className="intent-label">EXTRACTED FILTERS</span><div className="filter-chips">{filters.map((filter) => <button key={filter} onClick={() => setFilters((current) => current.filter((item) => item !== filter))}>{filter} <span>×</span></button>)}</div><button className="add-filter" onClick={() => showNotice("Custom filters will be available in the next release.")}>＋ Add another filter</button></div><div className="review-actions"><button className="button button-outline" onClick={() => setStage("input")}>← Edit search</button><button className="button button-primary" onClick={() => setStage("results")}>Search directory <span>↗</span></button></div></div>}
          {stage === "results" && <div className="results-stage"><div className="result-toolbar"><div className="filter-chips">{filters.map((filter) => <span className="static-chip" key={filter}>{filter}</span>)}</div><button className="text-button" onClick={() => setStage("review")}>Edit filters</button></div>{results.length ? <div className="results-grid">{results.map((profile) => <ProfileCard key={profile.id} profile={profile} onOpen={openProfile} />)}</div> : <div className="empty-state"><div className="empty-icon">⌕</div><h2>No visible profiles match yet.</h2><p>Try widening the graduation years or removing one filter. We won&apos;t invent a match that isn&apos;t in the directory.</p><button className="button button-outline" onClick={() => setStage("review")}>Adjust filters</button></div>}<p className="result-disclaimer">Results include only visible demo or opt-in profiles. LinkedIn is not scraped or searched directly.</p></div>}
        </div>
      </section>}

      {view === "directory" && <section className="page-content"><div className="page-heading"><div><p className="eyebrow">The community</p><h1>Directory</h1><p className="page-subtitle">Browse visible profiles shared by members and approved sources.</p></div><button className="button button-primary" onClick={() => setView("create")}>＋ Add your profile</button></div><div className="directory-toolbar"><div className="inline-search"><span>⌕</span><input aria-label="Filter directory" value={directoryFilter} onChange={(event) => setDirectoryFilter(event.target.value)} placeholder="Filter by name, role, skill…" /></div><Badge tone="green">{directoryResults.length} visible</Badge></div><div className="results-grid directory-grid">{directoryResults.map((profile) => <ProfileCard key={profile.id} profile={profile} onOpen={openProfile} />)}</div></section>}

      {view === "profile" && selectedProfile && <section className="page-content profile-page"><button className="back-link" onClick={() => setView("directory")}>← Back to directory</button><div className="profile-detail"><div className="detail-head"><div className="detail-avatar">{selectedProfile.initials}</div><div><div className="detail-badges"><Badge tone={selectedProfile.verified ? "green" : "neutral"}>{selectedProfile.verified ? "Verified profile" : "Unverified profile"}</Badge><Badge>{selectedProfile.source}</Badge></div><h1>{selectedProfile.name}</h1><p>{selectedProfile.role} at <strong>{selectedProfile.company}</strong></p><span className="profile-meta">⌖ {selectedProfile.location} <span className="dot-separator">·</span> Class of {selectedProfile.graduationYear}</span></div><button className="button button-outline report-button" onClick={() => showNotice("Thanks — this profile has been flagged for review.")}>Report profile</button></div><div className="detail-columns"><div><section className="detail-section"><h2>About</h2><p>{selectedProfile.bio}</p></section><section className="detail-section"><h2>Skills & expertise</h2><div className="skill-list large-skills">{selectedProfile.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></section></div><aside className="detail-side"><div className="trust-card"><span className="trust-symbol">✓</span><div><strong>Why this profile is here</strong><p>{selectedProfile.source}. Last updated {selectedProfile.updated.toLowerCase()}.</p></div></div><div className="connect-card"><span className="intent-label">PROFESSIONAL CONNECTION</span><h3>{selectedProfile.available ? "Open to a conversation" : "Connect respectfully"}</h3><p>Layer does not expose private contact details. Use the profile owner&apos;s shared destination to connect.</p><button className="button button-dark" onClick={() => showNotice("Connection requests will be available when profiles are connected to an approved destination.")}>Request connection ↗</button></div></aside></div></div></section>}

      {view === "create" && <section className="page-content form-page"><button className="back-link" onClick={() => setView("search")}>← Back to search</button><div className="form-intro"><p className="eyebrow">Be part of the community</p><h1>Build a profile people can trust.</h1><p className="page-subtitle">Share only what you&apos;re comfortable making visible. You can hide or delete this profile at any time.</p></div><form className="profile-form" onSubmit={createProfile}><div className="form-section"><div><span className="form-number">01</span><h2>About you</h2><p>The basics people need to understand your professional context.</p></div><div className="form-fields"><label>Full name<input name="name" required placeholder="e.g. Priya Shah" /></label><label>Current role<input name="role" required placeholder="e.g. Product Designer" /></label><label>Company or organization<input name="company" placeholder="e.g. Aster Labs" /></label><label>Location<input name="location" placeholder="e.g. Chennai, India" /></label></div></div><div className="form-section"><div><span className="form-number">02</span><h2>Your background</h2><p>Help people find you through relevant context.</p></div><div className="form-fields"><label>Education institution<input name="institution" required placeholder="e.g. Easwari Engineering College" /></label><label>Graduation year<input name="graduationYear" type="number" min="1950" max="2035" placeholder="2020" /></label><label className="full-field">Skills, separated by commas<input name="skills" placeholder="React, Product strategy, Mentoring" /></label><label className="full-field">Short introduction<textarea name="bio" rows={4} placeholder="What do you work on, and what conversations are you open to?" /></label></div></div><div className="form-section form-consent"><div><span className="form-number">03</span><h2>Visibility</h2><p>You stay in control of your profile.</p></div><div className="consent-box"><label className="check-row"><input name="available" type="checkbox" /><span><strong>I&apos;m open to mentoring or professional conversations</strong><small>This is optional and will be visible on your profile.</small></span></label><label className="check-row"><input required type="checkbox" /><span><strong>I agree to make this profile visible in the directory</strong><small>You can hide or delete it later from settings.</small></span></label><div className="source-note">◉ Source: User submitted · Your information will not be scraped from LinkedIn.</div></div></div><div className="form-actions"><button type="button" className="button button-outline" onClick={() => setView("search")}>Cancel</button><button className="button button-primary" type="submit">Publish profile <span>↗</span></button></div></form></section>}

      {view === "settings" && <section className="page-content settings-page"><div className="page-heading"><div><p className="eyebrow">Your account</p><h1>Settings</h1><p className="page-subtitle">Manage your profile, connections, and privacy choices.</p></div></div><div className="settings-layout"><nav className="settings-tabs"><button className="selected">Profile & connections</button><button onClick={() => showNotice("Privacy controls are ready for the next data layer.")}>Privacy</button><button onClick={() => showNotice("Notification settings are ready for the next release.")}>Notifications</button></nav><div className="settings-panels"><section className="settings-card"><div className="settings-card-head"><div><h2>Connected destinations</h2><p>Connect your own accounts to make your professional identity easier to maintain.</p></div><Badge tone={connected ? "green" : "neutral"}>{connected ? "Connected" : "Not connected"}</Badge></div><div className="connection-row"><div className="linkedin-mark">in</div><div><strong>LinkedIn</strong><p>{connected ? "Connected for your own profile identity." : "Use LinkedIn to sign in or add your own profile destination."}</p></div><button className="button button-outline" onClick={() => { setConnected((value) => !value); showNotice(connected ? "LinkedIn connection removed from this preview." : "LinkedIn connection simulated for this prototype."); }}>{connected ? "Disconnect" : "Connect"}</button></div><p className="settings-note">Layer only requests approved permissions for your own account. It does not search or scrape other LinkedIn members.</p></section><section className="settings-card"><div className="settings-card-head"><div><h2>Profile visibility</h2><p>Your profile is currently visible to members of the directory.</p></div><button className="toggle on" aria-label="Toggle profile visibility"><span /></button></div><div className="visibility-options"><div><strong>Member directory</strong><span>Visible to authenticated community members</span></div><div><strong>Search results</strong><span>Included when your profile matches a search</span></div></div></section></div></div></section>}

      {view === "admin" && <section className="page-content admin-page"><div className="page-heading"><div><p className="eyebrow">Workspace safety</p><h1>Moderation</h1><p className="page-subtitle">Review reports and keep the directory accurate and respectful.</p></div><Badge tone="orange">3 open items</Badge></div><div className="admin-stats"><div><span>Open reports</span><strong>3</strong><small>Needs review</small></div><div><span>Visible profiles</span><strong>{profiles.length}</strong><small>Across this preview</small></div><div><span>Verified records</span><strong>{profiles.filter((profile) => profile.verified).length}</strong><small>Source reviewed</small></div></div><section className="settings-card reports-card"><div className="settings-card-head"><div><h2>Reports queue</h2><p>Reports are private and are never shown to the reported member.</p></div><button className="text-button" onClick={() => showNotice("All reports are already shown in this preview.")}>View policy</button></div>{["Profile information may be out of date", "I did not submit this profile", "Incorrect education details"].map((report, index) => <div className="report-row" key={report}><div className="report-icon">{index + 1}</div><div><strong>{report}</strong><p>Reported about {index === 1 ? "a demo record" : "a visible profile"} · {index + 1}h ago</p></div><Badge>{index === 1 ? "High priority" : "Open"}</Badge><button className="button button-outline" onClick={() => showNotice("Report marked for review.")}>Review</button></div>)}</section></section>}
    </main>
  </div>;
}
