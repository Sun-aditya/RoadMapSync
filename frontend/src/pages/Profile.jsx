import { motion } from 'framer-motion';
import { Award, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AchievementCard from '../components/achievement/AchievementCard';

export default function Profile() {
  const { user, achievements } = useAuth();

  const badgeCount = achievements.length;
  const trackCount = new Set(achievements.map((item) => item.trackId)).size;

  return (
    <section className="relative mx-auto w-full max-w-6xl overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="track-glow -left-14 top-20 h-40 w-40 bg-brand-glow/40" />

      <motion.div
        className="glass-panel rounded-3xl border border-brand-line/70 p-7 shadow-float sm:p-9"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-text/65">User Profile</p>
        <h1 className="font-display mt-3 text-3xl text-brand-text sm:text-4xl">{user?.username || 'Engineer'}'s Achievement Hub</h1>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-brand-line bg-brand-card px-4 py-4">
            <p className="text-xs uppercase tracking-[0.14em] text-brand-text/60">Total badges</p>
            <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-brand-text">
              <Award className="h-5 w-5 text-brand-accent-dark" />
              {badgeCount}
            </p>
          </div>
          <div className="rounded-2xl border border-brand-line bg-brand-card px-4 py-4">
            <p className="text-xs uppercase tracking-[0.14em] text-brand-text/60">Tracks completed</p>
            <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-brand-text">
              <ShieldCheck className="h-5 w-5 text-brand-accent-dark" />
              {trackCount}
            </p>
          </div>
          <div className="rounded-2xl border border-brand-line bg-brand-card px-4 py-4">
            <p className="text-xs uppercase tracking-[0.14em] text-brand-text/60">Profile status</p>
            <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-brand-text">
              <UserRound className="h-5 w-5 text-brand-accent-dark" />
              Active
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mt-8">
        <h2 className="font-display text-2xl text-brand-text">Achievement Cards</h2>
        <p className="mt-2 text-sm text-brand-text/70">Every successful capstone completion generates a badge and card that appears here.</p>

        {achievements.length === 0 ? (
          <div className="mt-5 rounded-3xl border border-dashed border-brand-line bg-brand-card px-6 py-10 text-center text-brand-text/70">
            No achievements yet. Complete a capstone project to generate your first badge card.
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.32 }}
              >
                <AchievementCard achievement={achievement} compact />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
