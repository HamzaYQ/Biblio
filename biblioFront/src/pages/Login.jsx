import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiBook } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Connexion réussie!");
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || "Erreur de connexion";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <FiBook style={{ fontSize: "3rem", color: "var(--primary-500)" }} />
          <h1>Bibliotique</h1>
          <p className="text-muted">Système de Gestion de Bibliothèque</p>
        </div>

        <h2 className="auth-title">Connexion</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: "relative" }}>
              <FiMail
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: "40px" }}
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <div style={{ position: "relative" }}>
              <FiLock
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: "40px" }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Pas encore de compte? <Link to="/register">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
