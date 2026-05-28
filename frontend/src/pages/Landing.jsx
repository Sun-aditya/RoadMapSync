import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Landing() {
  return (
    <section className="relative mx-auto flex min-h-[calc(100vh-92px)] w-full max-w-6xl items-center overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
      <div className="ornament-orb -left-20 top-10 h-40 w-40 bg-brand-accent/40" />
      <div className="ornament-orb right-4 top-20 h-28 w-28 bg-brand-mint/35 [animation-delay:1.5s]" />
      <div className="ornament-orb bottom-12 right-20 h-36 w-36 bg-brand-glow/45 [animation-delay:2.2s]" />

      <motion.div
        className="glass-panel relative w-full rounded-[2.25rem] border border-brand-line/70 px-7 py-10 shadow-float sm:px-12 sm:py-14"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <motion.span
          className="inline-flex items-center gap-2 rounded-full border border-brand-line/60 bg-brand-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-text/80"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Sparkles className="h-3.5 w-3.5 text-brand-accent-dark" />
          Curated engineering journeys
        </motion.span>

        <h1 className="font-display mt-6 max-w-4xl text-balance text-4xl font-semibold leading-tight text-brand-text sm:text-5xl lg:text-6xl">
          Build your software engineering roadmap with calm focus and meaningful progress.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-brand-text/80 sm:text-lg">
          Explore curated paths, complete milestone checklists, and celebrate capstone wins as you level up from foundations to production-grade expertise.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-accent-dark"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-brand-line bg-brand-card px-6 py-3 text-sm font-semibold text-brand-text transition hover:border-brand-accent"
            >
              Sign In
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="mt-10 grid gap-3 text-sm sm:grid-cols-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
        >
          {[
            'Progressive milestone unlocks',
            'Capstone-first practical learning',
            'Celebration moments per achievement',
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-brand-line/60 bg-brand-card/80 px-4 py-3 text-brand-text/80">
              {item}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
