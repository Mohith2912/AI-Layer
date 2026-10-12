import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found shell">
      <p className="eyebrow">404 · Not found</p>
      <h1>That layer isn&apos;t here.</h1>
      <p>The page may have moved, or the link may no longer be available.</p>
      <Link className="button button-dark" href="/">Return home</Link>
    </main>
  );
}
