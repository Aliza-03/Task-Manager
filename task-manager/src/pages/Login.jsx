import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../index.css';
import '../auth.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Remove dashboard layout class if it exists
    document.body.classList.remove('dashboard-layout');
    
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = (e) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  // Simple validation
  if (!email || !password) {
    setError("Please enter both email and password");
    setIsLoading(false);
    return;
  }

  // Simulate login delay
  setTimeout(() => {
    // Store dummy user info for testing
    localStorage.setItem('user', JSON.stringify({ email }));
    setIsLoading(false);
    navigate("/dashboard");
  }, 1000);
};


  return (
    <div className="auth-container">
      <h2>Login to Task Manager</h2>
      
      {error && <div className="auth-error">{error}</div>}
      
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default Login;