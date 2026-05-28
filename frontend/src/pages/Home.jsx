import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, achievements } = useAuth();

  const totalBadges = achievements.length;
  const tracksTouched = new Set(achievements.map((item) => item.trackId)).size;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        className="rounded-3xl border border-brand-line/70 bg-brand-card p-8 shadow-card sm:p-10"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-text/60">Dashboard Home</p>
        <h1 className="font-display mt-3 text-3xl font-semibold text-brand-text sm:text-4xl">Welcome, {user?.username || 'Engineer'}</h1>
        <p className="mt-3 max-w-2xl text-brand-text/75">
          Your profile is active. Continue by selecting a roadmap and completing your next milestone branch.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-brand-line bg-brand-surface px-4 py-4">
            <p className="text-xs uppercase tracking-[0.14em] text-brand-text/60">Badges earned</p>
            <p className="mt-2 text-2xl font-semibold text-brand-text">{totalBadges}</p>
          </div>
          <div className="rounded-2xl border border-brand-line bg-brand-surface px-4 py-4">
            <p className="text-xs uppercase tracking-[0.14em] text-brand-text/60">Tracks active</p>
            <p className="mt-2 text-2xl font-semibold text-brand-text">{tracksTouched}</p>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/roadmaps"
            className="inline-flex rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-accent-dark"
          >
            Explore Roadmaps
          </Link>
          <Link
            to="/profile"
            className="inline-flex rounded-full border border-brand-line bg-brand-card px-6 py-3 text-sm font-semibold text-brand-text transition hover:border-brand-accent"
          >
            View Profile
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
