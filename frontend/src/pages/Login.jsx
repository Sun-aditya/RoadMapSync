import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(formData);
      navigate('/home');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to sign in. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-92px)] w-full max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        className="mx-auto w-full max-w-md rounded-[1.75rem] border border-brand-line/70 bg-brand-card p-8 shadow-card sm:p-9"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-3xl font-semibold tracking-tight text-brand-text">Welcome back</h1>
        <p className="mt-2 text-sm text-brand-text/75">Sign in to continue your roadmap journey.</p>

        {error ? (
          <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-brand-text/85">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-brand-line bg-brand-bg px-4 py-3 text-brand-text outline-none transition focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/25"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-brand-text/85">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-brand-line bg-brand-bg px-4 py-3 text-brand-text outline-none transition focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/25"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-brand-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-accent-dark disabled:cursor-not-allowed disabled:opacity-65"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-text/75">
          New here?{' '}
          <Link to="/register" className="font-semibold text-brand-accent-dark hover:underline">
            Create account
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
