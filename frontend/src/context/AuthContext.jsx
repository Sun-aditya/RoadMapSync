import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AUTH_API_BASE_URL = 'http://localhost:3000/api/auth';
const TOKEN_KEY = 'roadmap_token';
const USER_KEY = 'roadmap_user';
const ACHIEVEMENTS_KEY_PREFIX = 'roadmap_achievements';

const authApi = axios.create({
  baseURL: AUTH_API_BASE_URL,
});

const AuthContext = createContext(null);

function setAuthHeader(token) {
  if (token) {
    authApi.defaults.headers.common.Authorization = `Bearer ${token}`;
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete authApi.defaults.headers.common.Authorization;
  delete axios.defaults.headers.common.Authorization;
}

function getStoredUser() {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

function getAchievementsStorageKey(user) {
  const scope = user?.id || user?.email || 'guest';
  return `${ACHIEVEMENTS_KEY_PREFIX}_${scope}`;
}

function getStoredAchievements(user) {
  const raw = localStorage.getItem(getAchievementsStorageKey(user));

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [achievements, setAchievements] = useState(() => getStoredAchievements(getStoredUser()));
  const [achievementsLoaded, setAchievementsLoaded] = useState(false);

  useEffect(() => {
    setAuthHeader(token);
  }, [token]);

  useEffect(() => {
    setAchievements(getStoredAchievements(user));
    setAchievementsLoaded(false);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(getAchievementsStorageKey(user), JSON.stringify(achievements));
  }, [achievements, user]);

  useEffect(() => {
    let isActive = true;

    async function loadAchievements() {
      if (!token || !user) {
        setAchievementsLoaded(true);
        return;
      }

      try {
        const { data } = await authApi.get('/achievements', {
          baseURL: 'http://localhost:3000/api',
        });

        if (!isActive) {
          return;
        }

        const loadedAchievements = Array.isArray(data?.achievements) ? data.achievements : [];
        setAchievements(loadedAchievements);
        localStorage.setItem(getAchievementsStorageKey(user), JSON.stringify(loadedAchievements));
      } catch {
        if (!isActive) {
          return;
        }

        setAchievements(getStoredAchievements(user));
      } finally {
        if (isActive) {
          setAchievementsLoaded(true);
        }
      }
    }

    loadAchievements();

    return () => {
      isActive = false;
    };
  }, [token, user]);

  const persistAuth = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setAuthHeader(nextToken);
  };

  const register = async ({ username, email, password }) => {
    const { data } = await authApi.post('/register', {
      username,
      email,
      password,
    });

    if (!data?.token || !data?.user) {
      throw new Error('Registration did not return an authentication payload.');
    }

    persistAuth(data.token, data.user);
    return data;
  };

  const login = async ({ email, password }) => {
    const { data } = await authApi.post('/login', {
      email,
      password,
    });

    if (!data?.token || !data?.user) {
      throw new Error('Login did not return an authentication payload.');
    }

    persistAuth(data.token, data.user);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken('');
    setAchievements([]);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthHeader(null);
  };

  const addAchievement = (achievementPayload) => {
    const nextAchievement = {
      ...achievementPayload,
      trackTheme: achievementPayload.trackTheme || null,
    };

    setAchievements((current) => {
      const exists = current.some((item) => item.id === nextAchievement.id);

      if (exists) {
        return current.map((item) => (item.id === nextAchievement.id ? nextAchievement : item));
      }

      return [nextAchievement, ...current];
    });

    if (!token || !user) {
      return;
    }

    authApi.post('/achievements', nextAchievement, {
      baseURL: 'http://localhost:3000/api',
    }).catch(() => {
      // Keep local state even if the network is temporarily unavailable.
    });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      achievements,
      login,
      register,
      logout,
      addAchievement,
      achievementsLoaded,
      authApi,
      isAuthenticated: Boolean(token && user),
    }),
    [achievements, achievementsLoaded, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
