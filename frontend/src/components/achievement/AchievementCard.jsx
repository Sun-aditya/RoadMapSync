import { Award, CalendarDays, Sparkles } from 'lucide-react';

function formatDate(value) {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function AchievementCard({ achievement, compact = false }) {
  return (
    <article
      className={[
        'relative overflow-hidden rounded-3xl border border-brand-line/70 bg-brand-card p-5 shadow-card',
        compact ? 'max-w-full' : 'max-w-xl',
      ].join(' ')}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-xl"
        style={{ backgroundColor: `${achievement.trackTheme?.glow || '#8CB4FF'}66` }}
      />

      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-text/60">Achievement Unlocked</p>
        <h3 className="font-display mt-2 text-xl text-brand-text">{achievement.title}</h3>
        <p className="mt-1 text-sm text-brand-text/75">{achievement.trackTitle}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: achievement.trackTheme?.accent || '#4F7CFF' }}
          >
            <Award className="h-3.5 w-3.5" />
            {achievement.badgeLabel}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-brand-line bg-brand-surface px-3 py-1 text-xs text-brand-text/75">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(achievement.completedAt)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-brand-line bg-brand-surface px-3 py-1 text-xs text-brand-text/75">
            <Sparkles className="h-3.5 w-3.5" />
            {achievement.motionSignature}
          </span>
        </div>

        {!compact ? (
          <p className="mt-4 text-sm leading-6 text-brand-text/80">
            Capstone completed: {achievement.capstoneProject}
          </p>
        ) : null}
      </div>
    </article>
  );
}
