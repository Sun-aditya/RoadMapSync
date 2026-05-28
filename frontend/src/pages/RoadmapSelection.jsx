import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppWindow, ArrowRight, Code2, Layers, ServerCog, ShieldCheck, Sparkles } from 'lucide-react';
import { roadmapsData } from '../data/roadmapsData';
import { listRoadmaps } from '../services/roadmapsApi';

const iconMap = {
  'web-development': Code2,
  'app-development': AppWindow,
  devops: ServerCog,
  cybersecurity: ShieldCheck,
};

export default function RoadmapSelection() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadRoadmaps() {
      try {
        const backendRoadmaps = await listRoadmaps();

        if (!isMounted) {
          return;
        }

        setRoadmaps(backendRoadmaps.length ? backendRoadmaps : roadmapsData);
      } catch {
        if (!isMounted) {
          return;
        }

        setError('Using local roadmap fallback because the backend roadmaps API is unavailable.');
        setRoadmaps(roadmapsData);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRoadmaps();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative mx-auto w-full max-w-6xl overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="ornament-orb -left-16 top-16 h-36 w-36 bg-brand-accent/35" />
      <div className="ornament-orb right-0 top-8 h-24 w-24 bg-brand-mint/30 [animation-delay:1.8s]" />

      <motion.div
        className="mb-8 rounded-3xl border border-brand-line/70 bg-brand-card/80 p-7 shadow-card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-line bg-brand-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-text/70">
          <Sparkles className="h-3.5 w-3.5 text-brand-accent-dark" />
          Skill Tracks
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-text sm:text-4xl">Choose Your Learning Path</h1>
        <p className="mt-3 max-w-2xl text-brand-text/75">
          Select a roadmap to enter an interactive milestone journey. Each path is structured with practical capstones and nested micro-steps.
        </p>
      </motion.div>

      {error ? (
        <div className="mb-5 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-3xl border border-brand-line bg-brand-card p-8 text-center text-brand-text/70 shadow-card">
          Loading roadmaps...
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        {roadmaps.map((roadmap, index) => {
          const Icon = iconMap[roadmap.id] || Code2;
          const trackTheme = roadmap.theme || {};
          const majorMilestoneCount =
            typeof roadmap.milestoneCount === 'number'
              ? roadmap.milestoneCount
              : Array.isArray(roadmap.milestones)
                ? roadmap.milestones.length
                : 0;

          return (
            <motion.div
              key={roadmap.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, duration: 0.35 }}
              whileHover={{ y: -4 }}
            >
              <Link
                to={`/roadmaps/${roadmap.id}`}
                className="group relative block overflow-hidden rounded-3xl border border-brand-line/60 bg-brand-card p-6 shadow-card transition hover:border-brand-accent/70"
                style={{
                  borderColor: `${trackTheme.accent || '#4F7CFF'}33`,
                }}
              >
                <div
                  className="absolute -right-10 -top-10 h-24 w-24 rounded-full blur-xl transition group-hover:scale-125"
                  style={{ backgroundColor: `${trackTheme.glow || '#8CB4FF'}55` }}
                />
                <span
                  className="inline-flex rounded-2xl bg-brand-surface p-3"
                  style={{ color: trackTheme.accentDark || '#2F5CE0' }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-2xl font-semibold text-brand-text">{roadmap.title}</h2>
                <p className="mt-2 text-sm leading-6 text-brand-text/75">{roadmap.summary}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full border border-brand-line bg-brand-surface px-2.5 py-1 text-xs font-medium text-brand-text/75">
                    <Layers className="h-3.5 w-3.5" />
                    {majorMilestoneCount} major milestones
                  </span>
                  <span
                    className="inline-flex items-center gap-1 text-sm font-medium"
                    style={{ color: trackTheme.accentDark || '#2F5CE0' }}
                  >
                    Open roadmap
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-brand-text/55">
                  Motion signature: {trackTheme.motionSignature || 'standard'}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
