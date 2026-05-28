import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle2, ChevronDown, Circle, CircleCheckBig, Lock, Sparkles, Trophy, X } from 'lucide-react';
import { getRoadmapById } from '../data/roadmapsData';
import { useAuth } from '../context/AuthContext';
import AchievementCard from '../components/achievement/AchievementCard';
import { getRoadmap } from '../services/roadmapsApi';

const PROGRESS_STORAGE_PREFIX = 'roadmap_progress_snapshot';

function initializeMilestones(roadmap) {
  return roadmap.milestones.map((milestone, index) => ({
    ...milestone,
    unlocked: index === 0,
    expanded: index === 0,
    capstoneCompleted: false,
    microStepsState: milestone.microSteps.map((step) => ({
      id: step,
      title: step,
      done: false,
    })),
  }));
}

function getProgressStorageKey(user, roadmapId) {
  const scope = user?.id || user?.email || 'guest';
  return `${PROGRESS_STORAGE_PREFIX}_${scope}_${roadmapId}`;
}

function getStoredProgress(user, roadmapId) {
  const raw = localStorage.getItem(getProgressStorageKey(user, roadmapId));

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistLocalProgress(user, roadmapId, progress) {
  localStorage.setItem(getProgressStorageKey(user, roadmapId), JSON.stringify(progress));
}

function mergeProgressSnapshot(roadmap, snapshot) {
  const milestoneProgressMap = new Map(
    (snapshot?.milestones || []).map((milestone) => [milestone.id, milestone])
  );

  return roadmap.milestones.map((milestone, index) => {
    const savedMilestone = milestoneProgressMap.get(milestone.id);
    const stepStateMap = new Map((savedMilestone?.microStepsState || []).map((step) => [step.id, step]));

    return {
      ...milestone,
      unlocked: savedMilestone?.unlocked ?? index === 0,
      expanded: savedMilestone?.expanded ?? index === 0,
      capstoneCompleted: savedMilestone?.capstoneCompleted ?? false,
      microStepsState: milestone.microSteps.map((step) => ({
        id: step,
        title: step,
        done: stepStateMap.get(step)?.done ?? false,
      })),
    };
  });
}

function serializeProgress(milestones) {
  return {
    milestones: milestones.map((milestone) => ({
      id: milestone.id,
      unlocked: milestone.unlocked,
      expanded: milestone.expanded,
      capstoneCompleted: milestone.capstoneCompleted,
      microStepsState: milestone.microStepsState.map((step) => ({
        id: step.id,
        done: step.done,
      })),
    })),
    updatedAt: new Date().toISOString(),
  };
}

function launchStepCelebration(theme, originX = 0.5) {
  confetti({
    particleCount: 24,
    spread: 54,
    origin: { x: originX, y: 0.66 },
    scalar: 0.74,
    gravity: 1.1,
    colors: theme?.confettiColors || ['#4F7CFF', '#8CB4FF', '#63C2B5'],
  });
}

function launchMilestoneCelebration(theme) {
  const duration = 1900;
  const end = Date.now() + duration;
  const colors = theme?.confettiColors || ['#4F7CFF', '#8CB4FF', '#63C2B5', '#E9F0FF'];

  (function frame() {
    confetti({
      particleCount: 8,
      angle: 60,
      spread: 68,
      origin: { x: 0, y: 0.6 },
      colors,
      scalar: 0.95,
      zIndex: 1200,
    });

    confetti({
      particleCount: 8,
      angle: 120,
      spread: 68,
      origin: { x: 1, y: 0.6 },
      colors,
      scalar: 0.95,
      zIndex: 1200,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function getMotionBySignature(signature, alignRight, isNewlyUnlocked) {
  if (isNewlyUnlocked) {
    return {
      initial: { opacity: 0, x: alignRight ? 48 : -48, y: 16 },
      animate: { opacity: 1, x: 0, y: 0 },
      transition: { duration: 0.52, ease: [0.16, 1, 0.3, 1] },
    };
  }

  switch (signature) {
    case 'lift-fade':
      return {
        initial: { opacity: 0, y: 18, scale: 0.99 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.42 },
      };
    case 'rail-slide':
      return {
        initial: { opacity: 0, x: alignRight ? 30 : -30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.44 },
      };
    case 'scan-pulse':
      return {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
      };
    default:
      return {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.42 },
      };
  }
}

export default function RoadmapView() {
  const { id } = useParams();
  const { addAchievement, achievements, authApi, user, token } = useAuth();
  const fallbackRoadmap = getRoadmapById(id);
  const [roadmap, setRoadmap] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(true);
  const trackTheme = roadmap?.theme || {
    accent: '#4F7CFF',
    accentDark: '#2F5CE0',
    glow: '#8CB4FF',
    motionSignature: 'flow-wave',
  };

  const [milestones, setMilestones] = useState(() => (roadmap ? initializeMilestones(roadmap) : []));
  const [error, setError] = useState('');
  const [justUnlockedId, setJustUnlockedId] = useState('');
  const [lastCelebratedStep, setLastCelebratedStep] = useState('');
  const [achievementModal, setAchievementModal] = useState(null);
  const [progressReady, setProgressReady] = useState(false);
  const saveTimerRef = useRef(null);

  const buildAchievement = (milestone, milestoneIndex) => ({
    id: `${roadmap.id}-${milestone.id}`,
    title: milestone.title,
    trackId: roadmap.id,
    trackTitle: roadmap.title,
    capstoneProject: milestone.capstoneProject,
    completedAt: new Date().toISOString(),
    badgeLabel: `${roadmap.title} Milestone ${milestoneIndex + 1}`,
    motionSignature: roadmap.theme?.motionSignature || 'flow-wave',
    trackTheme,
    awardedTo: user?.username || user?.email || 'Engineer',
  });

  useEffect(() => {
    let isActive = true;

    async function loadRoadmap() {
      setLoadingRoadmap(true);

      try {
        const backendRoadmap = await getRoadmap(id);

        if (!isActive) {
          return;
        }

        setRoadmap(backendRoadmap || fallbackRoadmap || null);
      } catch {
        if (!isActive) {
          return;
        }

        setRoadmap(fallbackRoadmap || null);
      } finally {
        if (isActive) {
          setLoadingRoadmap(false);
        }
      }
    }

    loadRoadmap();

    return () => {
      isActive = false;
    };
  }, [fallbackRoadmap, id]);

  useEffect(() => {
    if (!roadmap) {
      setMilestones([]);
      setProgressReady(false);
      return;
    }

    let isActive = true;
    setProgressReady(false);
    setMilestones(initializeMilestones(roadmap));
    setError('');
    setJustUnlockedId('');
    setLastCelebratedStep('');
    setAchievementModal(null);

    async function loadProgress() {
      const localSnapshot = getStoredProgress(user, roadmap.id);

      if (!token || !user) {
        if (localSnapshot?.progress && isActive) {
          setMilestones(mergeProgressSnapshot(roadmap, localSnapshot.progress));
        }

        if (isActive) {
          setProgressReady(true);
        }
        return;
      }

      try {
        const { data } = await authApi.get(`/roadmap-progress/${roadmap.id}`, {
          baseURL: 'http://localhost:3000/api',
        });

        if (!isActive) {
          return;
        }

        if (data?.progress?.progress) {
          setMilestones(mergeProgressSnapshot(roadmap, data.progress.progress));
          persistLocalProgress(user, roadmap.id, data.progress.progress);
        } else if (localSnapshot?.progress) {
          setMilestones(mergeProgressSnapshot(roadmap, localSnapshot.progress));
        }
      } catch {
        if (!isActive) {
          return;
        }

        if (localSnapshot?.progress) {
          setMilestones(mergeProgressSnapshot(roadmap, localSnapshot.progress));
        }
      } finally {
        if (isActive) {
          setProgressReady(true);
        }
      }
    }

    loadProgress();

    return () => {
      isActive = false;
    };
  }, [authApi, roadmap, token, user]);

  useEffect(() => {
    if (!progressReady || !roadmap) {
      return undefined;
    }

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      const snapshot = serializeProgress(milestones);
      persistLocalProgress(user, roadmap.id, snapshot);

      if (!token || !user) {
        return;
      }

      authApi
        .put(
          `/roadmap-progress/${roadmap.id}`,
          { progress: snapshot },
          {
            baseURL: 'http://localhost:3000/api',
          }
        )
        .catch(() => {
          // Local snapshot already preserved as a fallback.
        });
    }, 300);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [authApi, milestones, progressReady, roadmap, token, user]);

  useEffect(() => {
    if (!progressReady || !roadmap || milestones.length === 0) {
      return;
    }

    const existingAchievementIds = new Set(
      achievements.filter((item) => item.trackId === roadmap.id).map((item) => item.id)
    );

    milestones.forEach((milestone, milestoneIndex) => {
      if (!milestone.capstoneCompleted) {
        return;
      }

      const achievementId = `${roadmap.id}-${milestone.id}`;
      if (existingAchievementIds.has(achievementId)) {
        return;
      }

      addAchievement(buildAchievement(milestone, milestoneIndex));
    });
  }, [achievements, addAchievement, milestones, progressReady, roadmap, trackTheme, user]);

  const totalMicroSteps = useMemo(
    () => milestones.reduce((sum, milestone) => sum + milestone.microStepsState.length, 0),
    [milestones]
  );

  const completedMicroSteps = useMemo(
    () =>
      milestones.reduce(
        (sum, milestone) => sum + milestone.microStepsState.filter((step) => step.done).length,
        0
      ),
    [milestones]
  );

  const overallProgress = totalMicroSteps ? Math.round((completedMicroSteps / totalMicroSteps) * 100) : 0;

  if (loadingRoadmap && !roadmap) {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-brand-line bg-brand-card p-8 text-center text-brand-text/70 shadow-card">
          Loading roadmap...
        </div>
      </section>
    );
  }

  if (!roadmap) {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-brand-line bg-brand-card p-8 shadow-card">
          <h1 className="text-2xl font-semibold text-brand-text">Roadmap not found</h1>
          <p className="mt-2 text-brand-text/75">The selected roadmap does not exist.</p>
          <Link
            to="/roadmaps"
            className="mt-5 inline-flex rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to Selection
          </Link>
        </div>
      </section>
    );
  }

  const toggleExpand = (milestoneId) => {
    setMilestones((current) =>
      current.map((milestone) =>
        milestone.id === milestoneId && milestone.unlocked
          ? { ...milestone, expanded: !milestone.expanded }
          : milestone
      )
    );
  };

  const toggleMicroStep = (milestoneId, stepId, indexInList) => {
    let celebrate = false;
    let nextStepId = '';

    setMilestones((current) =>
      current.map((milestone) => {
        if (milestone.id !== milestoneId || !milestone.unlocked || milestone.capstoneCompleted) {
          return milestone;
        }

        const nextSteps = milestone.microStepsState.map((step) => {
          if (step.id !== stepId) {
            return step;
          }

          const willBeDone = !step.done;
          if (willBeDone) {
            celebrate = true;
            nextStepId = `${milestoneId}-${stepId}`;
          }

          return { ...step, done: willBeDone };
        });

        return {
          ...milestone,
          microStepsState: nextSteps,
        };
      })
    );

    if (celebrate) {
      launchStepCelebration(trackTheme, indexInList % 2 === 0 ? 0.24 : 0.76);
      setLastCelebratedStep(nextStepId);
      setTimeout(() => setLastCelebratedStep(''), 520);
    }
  };

  const completeCapstone = (milestoneId) => {
    setError('');
    let unlockedId = '';
    let completedMilestone = null;

    setMilestones((current) => {
      const activeIndex = current.findIndex((milestone) => milestone.id === milestoneId);

      if (activeIndex === -1) {
        return current;
      }

      const activeMilestone = current[activeIndex];
      const hasPendingMicroSteps = activeMilestone.microStepsState.some((step) => !step.done);

      if (hasPendingMicroSteps) {
        setError('Complete all micro-steps before marking the capstone project complete.');
        return current;
      }

      if (activeMilestone.capstoneCompleted) {
        return current;
      }

      completedMilestone = activeMilestone;
      const nextMilestone = current[activeIndex + 1];
      unlockedId = nextMilestone ? nextMilestone.id : '';

      return current.map((milestone, index) => {
        if (index === activeIndex) {
          return {
            ...milestone,
            capstoneCompleted: true,
            expanded: false,
          };
        }

        if (index === activeIndex + 1) {
          return {
            ...milestone,
            unlocked: true,
            expanded: true,
          };
        }

        return milestone;
      });
    });

    if (!completedMilestone) {
      return;
    }

    launchMilestoneCelebration(trackTheme);

    if (unlockedId) {
      setJustUnlockedId(unlockedId);
      setTimeout(() => {
        setJustUnlockedId('');
      }, 1000);
    }

    const milestoneIndex = milestones.findIndex((item) => item.id === milestoneId);
    const achievement = buildAchievement(completedMilestone, milestoneIndex);

    addAchievement(achievement);
    setAchievementModal(achievement);
  };

  return (
    <section
      className="relative mx-auto w-full max-w-6xl overflow-hidden px-4 py-12 sm:px-6 lg:px-8"
      style={{
        '--track-accent': trackTheme.accent,
        '--track-accent-dark': trackTheme.accentDark,
        '--track-glow': trackTheme.glow,
      }}
    >
      <div className="track-glow -left-20 top-24 h-44 w-44" style={{ backgroundColor: 'var(--track-glow)' }} />
      <div className="track-glow right-4 top-16 h-32 w-32 [animation-delay:1.6s]" style={{ backgroundColor: 'var(--track-accent)' }} />

      <motion.header
        className="glass-panel rounded-3xl border border-brand-line/70 p-7 shadow-float sm:p-9"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-text/65">Interactive roadmap</p>
        <h1 className="font-display mt-3 text-3xl font-semibold text-brand-text sm:text-4xl">{roadmap.title}</h1>
        <p className="mt-3 max-w-3xl text-brand-text/75">{roadmap.summary}</p>

        <div className="mt-7 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-brand-text/80">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-brand-surface">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: 'var(--track-accent)' }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-brand-line bg-brand-card px-4 py-2 text-sm font-semibold text-brand-text/80">
            <Trophy className="h-4 w-4" style={{ color: 'var(--track-accent-dark)' }} />
            {milestones.filter((item) => item.capstoneCompleted).length}/{milestones.length} milestones complete
          </div>
        </div>
      </motion.header>

      {error ? (
        <div className="mt-6 rounded-2xl border border-amber-300/50 bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</div>
      ) : null}

      <div className="relative mt-10">
        <div
          className="timeline-wave pointer-events-none absolute left-5 top-0 hidden h-full md:left-1/2 md:block"
          style={{
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--track-accent) 38%, transparent), color-mix(in srgb, var(--track-accent-dark) 70%, transparent), color-mix(in srgb, var(--track-glow) 44%, transparent))',
          }}
        />

        <div className="space-y-8">
          {milestones.map((milestone, index) => {
            const milestoneProgress = Math.round(
              (milestone.microStepsState.filter((step) => step.done).length / milestone.microStepsState.length) *
                100
            );
            const alignRight = index % 2 === 1;
            const isLocked = !milestone.unlocked;
            const isCompleted = milestone.capstoneCompleted;
            const motionPreset = getMotionBySignature(
              roadmap.theme?.motionSignature,
              alignRight,
              justUnlockedId === milestone.id
            );

            return (
              <motion.article
                key={milestone.id}
                className={[
                  'relative card-enter md:w-[calc(50%-1.75rem)]',
                  alignRight ? 'md:ml-auto' : 'md:mr-auto',
                ].join(' ')}
                initial={motionPreset.initial}
                animate={motionPreset.animate}
                transition={motionPreset.transition}
              >
                <div className="absolute left-[1.125rem] top-10 hidden h-4 w-4 -translate-x-1/2 rounded-full border border-brand-line bg-brand-card md:block md:left-auto md:right-[-2.15rem] md:translate-x-1/2">
                  <div className="h-full w-full rounded-full" style={{ backgroundColor: `${trackTheme.accent}66` }} />
                </div>

                <div
                  className={[
                    'rounded-3xl border bg-brand-card p-6 shadow-card sm:p-7',
                    isLocked ? 'border-brand-line/50 opacity-70' : 'border-brand-line/80',
                  ].join(' ')}
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(milestone.id)}
                    disabled={isLocked}
                    className="flex w-full items-start justify-between gap-4 text-left"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-text/60">
                        Major milestone {index + 1}
                      </p>
                      <h2 className="font-display mt-1 text-2xl font-semibold text-brand-text">{milestone.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-brand-text/75">{milestone.description}</p>
                    </div>

                    <span className="mt-1 inline-flex items-center rounded-full bg-brand-surface p-2" style={{ color: 'var(--track-accent-dark)' }}>
                      {isCompleted ? (
                        <CircleCheckBig className="h-5 w-5" />
                      ) : isLocked ? (
                        <Lock className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                      {!isLocked ? (
                        <ChevronDown
                          className={[
                            'ml-1 h-4 w-4 transition duration-200',
                            milestone.expanded ? 'rotate-180' : 'rotate-0',
                          ].join(' ')}
                        />
                      ) : null}
                    </span>
                  </button>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-xs font-medium text-brand-text/70">
                      <span>Milestone progress</span>
                      <span>{milestoneProgress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-brand-surface">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: 'var(--track-accent)' }}
                        animate={{ width: `${milestoneProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {milestone.expanded && !isLocked ? (
                      <motion.div
                        className="mt-6 space-y-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ul className="space-y-2">
                          {milestone.microStepsState.map((step) => {
                            const stepKey = `${milestone.id}-${step.id}`;
                            const isPulse = lastCelebratedStep === stepKey;

                            return (
                              <li key={step.id}>
                                <motion.label
                                  whileHover={{ x: 2 }}
                                  animate={isPulse ? { scale: [1, 1.015, 1] } : { scale: 1 }}
                                  transition={{ duration: 0.35 }}
                                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-brand-line/60 bg-brand-surface/60 px-3.5 py-3"
                                >
                                  <input
                                    type="checkbox"
                                    checked={step.done}
                                    disabled={isCompleted}
                                    onChange={() => toggleMicroStep(milestone.id, step.id, index)}
                                    className="h-4 w-4 rounded border-brand-line focus:ring-brand-accent"
                                    style={{ accentColor: trackTheme.accent }}
                                  />
                                  <span className="text-sm text-brand-text/85">{step.title}</span>
                                </motion.label>
                              </li>
                            );
                          })}
                        </ul>

                        <div className="rounded-2xl border border-brand-line/60 bg-brand-surface/65 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-text/60">
                            Practical Capstone Project
                          </p>
                          <p className="mt-2 text-sm leading-6 text-brand-text/85">{milestone.capstoneProject}</p>
                          <button
                            type="button"
                            onClick={() => completeCapstone(milestone.id)}
                            disabled={isCompleted}
                            className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-brand-line"
                            style={{
                              backgroundColor: isCompleted ? '#9AA7CC' : trackTheme.accent,
                            }}
                          >
                            {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                            {isCompleted ? 'Capstone Completed' : 'Complete Capstone Project'}
                          </button>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {achievementModal ? (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-[#0f1b33]/55 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl rounded-3xl border border-brand-line bg-brand-bg p-5 shadow-float sm:p-7"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.32 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-2xl text-brand-text">Achievement Card Generated</h3>
                <button
                  type="button"
                  onClick={() => setAchievementModal(null)}
                  className="rounded-full border border-brand-line bg-brand-card p-2 text-brand-text/70 transition hover:text-brand-text"
                  aria-label="Close achievement card"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <AchievementCard achievement={achievementModal} />
              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAchievementModal(null)}
                  className="rounded-full border border-brand-line bg-brand-card px-4 py-2 text-sm font-semibold text-brand-text"
                >
                  Continue Roadmap
                </button>
                <Link
                  to="/profile"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-white"
                  style={{ backgroundColor: trackTheme.accent }}
                  onClick={() => setAchievementModal(null)}
                >
                  View in Profile
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
