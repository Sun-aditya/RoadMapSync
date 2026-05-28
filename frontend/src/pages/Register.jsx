import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
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
      await register(formData);
      navigate('/home');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to create account at the moment.');
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
        <h1 className="text-3xl font-semibold tracking-tight text-brand-text">Create your account</h1>
        <p className="mt-2 text-sm text-brand-text/75">Start tracking milestones and unlock your first roadmap branch.</p>

        {error ? (
          <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-brand-text/85">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-2xl border border-brand-line bg-brand-bg px-4 py-3 text-brand-text outline-none transition focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/25"
              placeholder="jane-dev"
            />
          </div>

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
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-brand-line bg-brand-bg px-4 py-3 text-brand-text outline-none transition focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/25"
              placeholder="Create a strong password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-brand-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-accent-dark disabled:cursor-not-allowed disabled:opacity-65"
          >
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-text/75">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-brand-accent-dark hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
