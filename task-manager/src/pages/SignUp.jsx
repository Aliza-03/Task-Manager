import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../index.css'
import '../auth.css'

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    // TODO: Replace with real sign-up logic
    console.log("Signing up with:", { email, password });
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup} className="auth-form">
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

        <button type="submit">Signup</button>
      </form>
      <p>
        Already have an account? <a href="/">Login</a>
      </p>
    </div>
  );
};

export default Signup;
