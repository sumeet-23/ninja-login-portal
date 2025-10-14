import { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginUser, ApiError, isOnline, handleOfflineError } from "@/lib/api";

const Index = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load remembered username on component mount
  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      setUsername(rememberedUser);
      setRememberMe(true);
    }
  }, []);

  const validateUsername = (value: string): string | undefined => {
    if (!value) return "Employee ID is required";
    
    // Check if username already starts with NC
    const hasNCPrefix = value.startsWith('NC');
    const usernameWithoutPrefix = hasNCPrefix ? value.substring(2) : value;
    
    // Validate the part after NC (or the whole username if no NC prefix)
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(usernameWithoutPrefix)) {
      return "Employee ID must contain only letters and numbers";
    }
    
    // Check minimum length (including NC prefix if present)
    const minLength = hasNCPrefix ? 5 : 3; // NC + 3 chars minimum
    if (value.length < minLength) {
      return hasNCPrefix 
        ? "Employee ID must be at least 5 characters long (NC + 3 characters)"
        : "Employee ID must be at least 3 characters long";
    }
    
    return undefined;
  };

  // Function to normalize username with NC prefix
  const normalizeUsername = (value: string): string => {
    if (!value) return value;
    
    // If username doesn't start with NC, add it
    if (!value.startsWith('NC')) {
      return `NC${value}`;
    }
    
    return value;
  };

  const validatePassword = (value: string): string | undefined => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    
    setErrors({
      username: usernameError,
      password: passwordError,
    });

    if (usernameError || passwordError) {
      setMessage({ type: "error", text: "Please fix the errors below" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Check if user is online
      if (!isOnline()) {
        throw handleOfflineError();
      }

      // Call the actual API with normalized username
      const normalizedUsername = normalizeUsername(username);
      const response = await loginUser({
        userName: normalizedUsername,
        password: password
      });

      if (response.success) {
        setMessage({ type: "success", text: "Login successful! Redirecting..." });
        
        // Store login state if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedUser', username);
        }
        
        // In production: redirect to dashboard or handle the response data
        // window.location.href = '/dashboard';
        console.log('Login response:', response.data);
        
        // Log API documentation reference for developers
        console.log('📚 API Documentation: See .cursor/commands/login-api.md for complete API reference');
      } else {
        setMessage({ type: "error", text: response.message || "Login failed. Please try again." });
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof ApiError) {
        let errorMessage = error.message;
        
        // Handle specific error cases
        if (error.status === 401) {
          errorMessage = "Invalid username or password. Please check your credentials.";
        } else if (error.status === 403) {
          errorMessage = "Access denied. Please contact support.";
        } else if (error.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (error.code === 'NETWORK_ERROR') {
          errorMessage = "Unable to connect to the server. Please check your internet connection.";
        } else if (error.code === 'OFFLINE') {
          errorMessage = "You are currently offline. Please check your internet connection.";
        }
        
        setMessage({ type: "error", text: errorMessage });
      } else {
        setMessage({ type: "error", text: "An unexpected error occurred. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = username && password && !errors.username && !errors.password;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20 bg-gradient-to-br from-background to-secondary">
        <div className="max-w-lg">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Welcome to Ninjacart
            </h1>
            <p className="text-xl text-muted-foreground">
              Connecting farms to businesses with smart technology
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Fresh Produce Direct</h3>
                <p className="text-muted-foreground">Get farm-fresh products delivered to your business daily</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Smart Logistics</h3>
                <p className="text-muted-foreground">AI-powered supply chain ensuring quality and timely delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg shadow-xl border border-border p-8">
            {/* Logo & Title */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-lg mb-4">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary-foreground" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-card-foreground">Log in to your account</h2>
              <p className="text-muted-foreground mt-2">Enter your credentials to continue</p>
            </div>

            {/* Message Area */}
            {message && (
              <div
                role="alert"
                aria-live="polite"
                className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                  message.type === "success"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{message.text}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="username" className="text-card-foreground">
                  Employee ID
                </Label>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter Employee ID (NC will be added automatically)"
                  value={username}
                  onChange={(e) => {
                    const value = e.target.value;
                    setUsername(value);
                    setErrors({ ...errors, username: validateUsername(value) });
                  }}
                  onBlur={(e) => setErrors({ ...errors, username: validateUsername(e.target.value) })}
                  className={`mt-1.5 ${errors.username ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  aria-invalid={!!errors.username}
                  aria-describedby={errors.username ? "username-error" : undefined}
                />
                {errors.username && (
                  <p id="username-error" className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.username}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-card-foreground">
                  Password
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors({ ...errors, password: validatePassword(e.target.value) });
                    }}
                    onBlur={(e) => setErrors({ ...errors, password: validatePassword(e.target.value) })}
                    className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <a
                  href="#forgot"
                  className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <a href="#signup" className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded">
                  Sign up
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;
