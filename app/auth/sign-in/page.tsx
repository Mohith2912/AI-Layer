import Link from "next/link";
import { signIn } from "@/auth";

export default function SignInPage() {
  return <main className="auth-page"><div className="auth-card"><div className="brand"><span className="brand-mark">L</span><span>layer</span></div><p className="eyebrow">Welcome back</p><h1>Sign in to your community.</h1><p>Use your LinkedIn identity to sign in. Layer only requests the approved identity permissions needed for your own account.</p><form action={async () => { "use server"; await signIn("linkedin", { redirectTo: "/" }); }}><button className="button button-primary" type="submit">Continue with LinkedIn <span>↗</span></button></form><small>LinkedIn is used for authentication, not arbitrary people search.</small><Link className="back-link" href="/">← Back to preview</Link></div></main>;
}
