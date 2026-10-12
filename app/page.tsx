"use client";

import { FormEvent, useState } from "react";

const examples = [
  "Frontend developers in Chennai with 2–5 years of experience",
  "Machine-learning researchers in India working on medical imaging",
  "Alumni from 2018–2022 working in product companies",
];

const previewProfiles = [
  {
    initials: "AM",
    name: "Aarav Menon",
    role: "Frontend Engineer · Healthcare",
    location: "Chennai, India",
    skills: ["React", "TypeScript", "Design systems"],
    note: "Matches frontend development, healthcare, Chennai, and 3–5 years of experience.",
    verified: true,
  },
  {
    initials: "SK",
    name: "Sahana Krishnan",
    role: "Product Designer · Health tech",
    location: "Bengaluru, India",
    skills: ["Figma", "Research", "Accessibility"],
    note: "Matches product work, healthcare, and an India-based professional community.",
    verified: false,
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) return;
    setSubmittedQuery(query.trim());
    setShowResults(true);
  }

  return (
    <main>
      <nav className="nav shell" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Layer home">
          <span className="brand-mark" aria-hidden="true">L</span>
          <span>layer</span>
        </a>
        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#trust">Trust & privacy</a>
          <a className="button button-small button-dark" href="#join">Join the directory</a>
        </div>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> A more thoughtful people search</p>
          <h1>Find the people who fit the <em>context.</em></h1>
          <p className="hero-text">
            Describe who you&apos;re looking for in plain language. Review what Layer understood, then explore an opt-in professional directory with clear sources and transparent matches.
          </p>
          <form className="search-box" onSubmit={submitSearch}>
            <label htmlFor="search">Who would you like to find?</label>
            <div className="search-row">
              <span className="search-icon" aria-hidden="true">⌕</span>
              <input
                id="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try “React developers in Chennai…”"
              />
              <button className="button button-primary" type="submit">Search <span aria-hidden="true">↗</span></button>
            </div>
          </form>
          <div className="examples" aria-label="Search examples">
            <span>Try an example</span>
            {examples.map((example) => (
              <button key={example} type="button" onClick={() => setQuery(example)}>{example}</button>
            ))}
          </div>
        </div>
        <div className="hero-aside" aria-label="Product principles">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="signal-card signal-main">
            <span className="signal-label">A better match starts with</span>
            <strong>the right question.</strong>
            <span className="signal-line" />
            <span className="signal-caption">Search intent → reviewed filters → trusted profiles</span>
          </div>
          <div className="floating-note note-top"><span>01</span> People stay in control</div>
          <div className="floating-note note-bottom"><span>02</span> Sources stay visible</div>
        </div>
      </section>

      {showResults && (
        <section className="results shell" aria-live="polite">
          <div className="results-heading">
            <div><p className="eyebrow">Search preview</p><h2>Here&apos;s what Layer understood</h2></div>
            <button className="text-button" type="button" onClick={() => setShowResults(false)}>Clear search</button>
          </div>
          <div className="filter-row">
            <span className="filter-label">Your search</span>
            <span className="filter-chip">{submittedQuery}</span>
            <button className="filter-chip filter-edit" type="button" onClick={() => document.getElementById("search")?.focus()}>Edit</button>
          </div>
          <div className="results-grid">
            {previewProfiles.map((profile) => (
              <article className="profile-card" key={profile.name}>
                <div className="profile-top"><div className="avatar">{profile.initials}</div><span className={profile.verified ? "status verified" : "status"}>{profile.verified ? "Verified" : "Unverified"}</span></div>
                <h3>{profile.name}</h3><p className="profile-role">{profile.role}</p><p className="profile-location">⌖ {profile.location}</p>
                <div className="skill-list">{profile.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
                <p className="match-note"><span aria-hidden="true">✦</span> {profile.note}</p>
                <div className="profile-footer"><span>Source: demo profile</span><span>Updated recently</span></div>
              </article>
            ))}
          </div>
          <p className="demo-disclaimer">This is a product preview using clearly labeled demo records. Real results will only include approved, visible profile data.</p>
        </section>
      )}

      <section className="principles shell" id="how-it-works">
        <div className="section-intro"><p className="eyebrow">Designed for useful discovery</p><h2>Search with context.<br /><span>Connect with confidence.</span></h2></div>
        <div className="principle-grid">
          <article><span className="number">01</span><h3>Say it naturally</h3><p>Start with the question in your head. Layer turns your words into filters you can review and change.</p></article>
          <article><span className="number">02</span><h3>Keep the nuance</h3><p>Structured filters make intent clearer without flattening a person into a keyword match.</p></article>
          <article id="trust"><span className="number">03</span><h3>Trust the source</h3><p>See whether a profile is verified, where it came from, and when it was last updated.</p></article>
        </div>
      </section>

      <section className="join-banner shell" id="join"><div><p className="eyebrow">For people who want to be found</p><h2>Your profile. Your visibility. Your choice.</h2></div><a className="button button-primary" href="mailto:hello@example.com">Join the early directory <span aria-hidden="true">↗</span></a></section>

      <footer className="footer shell"><a className="brand" href="#top"><span className="brand-mark" aria-hidden="true">L</span><span>layer</span></a><p>Opt-in discovery for meaningful professional connections.</p><span>© 2026 Layer</span></footer>
    </main>
  );
}
