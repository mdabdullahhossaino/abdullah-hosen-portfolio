import { adminLogin } from "@/services/staticService";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAdmin } from "./AdminContext";

export function AdminLogin() {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await adminLogin(username, password);
      if (result.__kind__ === "ok") {
        login(result.ok);
        navigate({ to: "/ridoy/dashboard" });
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "oklch(0.09 0.010 48)" }}
      data-ocid="admin-login-page"
    >
      {/* Background ambient */}
      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.72 0.18 50 / 0.06) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative w-full max-w-md rounded-2xl border border-border/40 p-8"
        style={{
          background: "oklch(0.13 0.016 48)",
          boxShadow:
            "0 30px 60px -15px rgba(0,0,0,0.6), 0 0 0 1px oklch(0.72 0.18 50 / 0.08)",
        }}
      >
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.18 50 / 0.2), oklch(0.72 0.22 210 / 0.2))",
              border: "1px solid oklch(0.72 0.18 50 / 0.3)",
            }}
          >
            <span className="text-2xl">🔐</span>
          </div>
          <h1
            className="font-display font-bold text-2xl mb-1"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.18 50), oklch(0.72 0.22 210))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm font-mono">
            Abdullah Hosen Portfolio
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          data-ocid="admin-login-form"
        >
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-username"
              className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
            >
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              className="w-full px-4 py-3 rounded-xl border bg-background/50 text-foreground text-sm font-mono placeholder:text-muted-foreground/50 outline-none focus:ring-2 transition-all duration-200"
              style={{
                borderColor: "oklch(0.28 0.018 48)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "oklch(0.72 0.18 50 / 0.6)";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px oklch(0.72 0.18 50 / 0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "oklch(0.28 0.018 48)";
                e.currentTarget.style.boxShadow = "none";
              }}
              data-ocid="admin-username-input"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-password"
              className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-4 py-3 pr-12 rounded-xl border bg-background/50 text-foreground text-sm font-mono placeholder:text-muted-foreground/50 outline-none transition-all duration-200"
                style={{ borderColor: "oklch(0.28 0.018 48)" }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    "oklch(0.72 0.18 50 / 0.6)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px oklch(0.72 0.18 50 / 0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "oklch(0.28 0.018 48)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                data-ocid="admin-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-xs font-mono"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="px-4 py-3 rounded-xl text-sm font-mono"
              style={{
                background: "oklch(0.55 0.22 25 / 0.12)",
                border: "1px solid oklch(0.55 0.22 25 / 0.3)",
                color: "oklch(0.75 0.18 25)",
              }}
              role="alert"
              data-ocid="admin-login-error"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-display font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.18 50), oklch(0.65 0.16 45))",
              color: "oklch(0.10 0.015 50)",
              boxShadow: "0 0 22px -4px oklch(0.72 0.18 50 / 0.45)",
            }}
            data-ocid="admin-login-submit"
          >
            {loading ? "Authenticating…" : "Sign In"}
          </button>
        </form>

        <p
          className="text-center text-xs font-mono mt-6"
          style={{ color: "oklch(0.35 0.008 55)" }}
        >
          Restricted access — authorized personnel only
        </p>
      </div>
    </div>
  );
}
