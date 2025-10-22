import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Registration form state
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regBio, setRegBio] = useState("");
  const [regSkills, setRegSkills] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiService.login(loginEmail, loginPassword);
      login(response.user, response.access);
      onClose();
      // Reset form
      setLoginEmail("");
      setLoginPassword("");
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (regPassword !== regPassword2) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (regPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      await apiService.register({
        email: regEmail,
        username: regUsername || regEmail.split('@')[0], // Generate username from email if not provided
        password: regPassword,
        password_confirm: regPassword2,
        first_name: regFirstName,
        last_name: regLastName,
        bio: regBio,
        skills: regSkills,
      });

      // Auto-login after registration
      const loginResponse = await apiService.login(regEmail, regPassword);
      login(loginResponse.user, loginResponse.access);
      onClose();

      // Reset form
      setRegEmail("");
      setRegPassword("");
      setRegPassword2("");
      setRegFirstName("");
      setRegLastName("");
      setRegUsername("");
      setRegBio("");
      setRegSkills("");

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorData = err.response?.data;
      if (errorData) {
        // Handle field-specific errors
        const errorMessage = Object.entries(errorData)
          .map(([field, messages]) => {
            const msg = Array.isArray(messages) ? messages.join(", ") : messages;
            return `${field}: ${msg}`;
          })
          .join("\n");
        setError(errorMessage);
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400 whitespace-pre-line">
              {error}
            </p>
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="your.email@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reg-firstname">First Name *</Label>
                <Input
                  id="reg-firstname"
                  type="text"
                  placeholder="John"
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="reg-lastname">Last Name *</Label>
                <Input
                  id="reg-lastname"
                  type="text"
                  placeholder="Doe"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reg-email">Email *</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="your.email@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="reg-username">Username (optional)</Label>
              <Input
                id="reg-username"
                type="text"
                placeholder="Leave blank to use email prefix"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="reg-skills">Skills (comma-separated)</Label>
              <Input
                id="reg-skills"
                type="text"
                placeholder="e.g., React, Node.js, Python"
                value={regSkills}
                onChange={(e) => setRegSkills(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="reg-bio">Bio</Label>
              <textarea
                id="reg-bio"
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                placeholder="Tell us about yourself..."
                value={regBio}
                onChange={(e) => setRegBio(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="reg-password">Password *</Label>
              <Input
                id="reg-password"
                type="password"
                placeholder="At least 8 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="reg-password2">Confirm Password *</Label>
              <Input
                id="reg-password2"
                type="password"
                placeholder="Re-enter your password"
                value={regPassword2}
                onChange={(e) => setRegPassword2(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-primary hover:underline font-medium"
              disabled={loading}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;