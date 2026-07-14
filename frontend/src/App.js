import { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';
const AUTH_BASE = process.env.REACT_APP_AUTH_URL || 'http://localhost:8000';

const services = [
  {
    name: 'Cloud-native Transformation',
    description:
      'Design, migrate, and automate cloud workloads with resilient architecture patterns and FinOps visibility.',
  },
  {
    name: 'Product Engineering',
    description:
      'Full-cycle delivery teams that embrace modern JavaScript, PHP and DevOps toolchains to ship fast.',
  },
  {
    name: 'Experience Design',
    description:
      'Human-centered UI/UX and prototyping that keeps the focus on measurable business outcomes.',
  },
];

const testimonials = [
  {
    quote:
      'We redirected our entire platform to micro-frontends with zero downtime thanks to the squad Sunny led.',
    author: 'VP of Engineering, NovaPay',
  },
  {
    quote:
      'Professional, responsive, and technically excellent—our backlog shrank by 30% in under two months.',
    author: 'Product Lead, Atlas Robotics',
  },
];

const heroMetrics = [
  { label: 'Years powering enterprises', value: '14+' },
  { label: 'Certified cloud architects', value: '36' },
  { label: 'Clients globally', value: '18' },
];

const fetchWithCsrf = async (endpoint, body) => {
  await fetch(`${AUTH_BASE}/sanctum/csrf-cookie`, {
    credentials: 'include',
  });

  const response = await fetch(`${API_BASE}/${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || 'Unable to complete the request');
  }

  return payload;
};

const Layout = ({ children }) => (
  <div className="app-shell">
    <header className="app-header">
      <div className="brand">VectorIntellect</div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
    </header>

    <main>{children}</main>

    <footer className="app-footer">
      <p>Ready to engineer the future? Contact us for an evaluation workshop.</p>
      <small>© {new Date().getFullYear()} VectorIntellect Solutions.</small>
    </footer>
  </div>
);

const HomePage = () => (
  <section className="page">
    <section className="hero">
      <div>
        <p className="eyebrow">IT Solutions for Growing Enterprises</p>
        <h1>
          End-to-end product engineering &amp; cloud enablement for bold teams.
        </h1>
        <p className="lead">
          Strategy, design, and delivery squads focused on reducing time-to-market while
          keeping infrastructure secure, scalable, and measurable.
        </p>
        <div className="hero-actions">
          <Link className="primary" to="/register">
            Book a discovery call
          </Link>
          <Link className="secondary" to="/login">
            View client portal
          </Link>
        </div>
      </div>
      <div className="hero-card">
        <p>Current capacity</p>
        <div className="hero-card__metrics">
          {heroMetrics.map((metric) => (
            <div key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="services">
      <h2>Services crafted for the modern enterprise</h2>
      <div className="grid">
        {services.map((service) => (
          <article key={service.name}>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="testimonials">
      <h2>Trusted by partners worldwide</h2>
      <div className="grid">
        {testimonials.map((item) => (
          <article key={item.author}>
            <p className="quote">“{item.quote}”</p>
            <p className="author">{item.author}</p>
          </article>
        ))}
      </div>
    </section>
  </section>
);

const AuthForm = ({ mode }) => {
  const title = mode === 'login' ? 'Welcome back' : 'Create your account';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: 'loading', message: 'Connecting to the backend...' });

    try {
      const payload = await fetchWithCsrf(mode === 'login' ? 'login' : 'register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setStatus({ type: 'success', message: payload.message });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <section className="auth-page">
      <h1>{title}</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <label>
            Full name
            <input
              type="text"
              required
              value={form.name}
              onChange={handleChange('name')}
            />
          </label>
        )}
        <label>
          Business email
          <input type="email" required value={form.email} onChange={handleChange('email')} />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={handleChange('password')}
          />
        </label>
        <button className="primary" type="submit">
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>
      {status && <p className={`alert ${status.type}`}>{status.message}</p>}
    </section>
  );
};

const LoginPage = () => <AuthForm mode="login" />;
const RegisterPage = () => <AuthForm mode="register" />;

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Layout>
  );
}

export default App;
