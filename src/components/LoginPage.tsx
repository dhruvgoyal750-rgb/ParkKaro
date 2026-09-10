import React, { useState } from 'react';
import { 
  Lock, Phone, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, 
  Sparkles, CheckCircle2, User, KeyRound, Truck, Warehouse, Database
} from 'lucide-react';
import { IndustrialSticker } from './IndustrialSticker';
import { BackgroundPattern } from './BackgroundPattern';
import { generateUserId, purgeLegacyGlobalData } from '../utils/userDataManager';

export interface UserProfile {
  id: string;
  name: string;
  emailOrPhone: string;
  accountType?: 'driver' | 'host';
}

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [emailOrPhone, setEmailOrPhone] = useState('dispatcher.miller@interstatefreight.com');
  const [password, setPassword] = useState('SecurePass2026!');
  const [showPassword, setShowPassword] = useState(false);
  
  // Sign up specific fields
  const [fullName, setFullName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [accountIntent, setAccountIntent] = useState<'driver' | 'host'>('driver');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;

    // Purge legacy non-isolated global store so no previous data leaks
    purgeLegacyGlobalData();

    const userId = generateUserId(emailOrPhone);
    const displayName = emailOrPhone.includes('@') 
      ? emailOrPhone.split('@')[0].replace(/[._]/g, ' ') 
      : 'Fleet Member';

    onLoginSuccess({
      id: userId,
      name: displayName,
      emailOrPhone: emailOrPhone.trim(),
    });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const contact = signupPhone.trim() || signupEmail.trim();
    if (!fullName.trim() || !contact) return;

    // Purge legacy non-isolated global store
    purgeLegacyGlobalData();

    const userId = generateUserId(contact);

    onLoginSuccess({
      id: userId,
      name: fullName.trim(),
      emailOrPhone: contact,
      accountType: accountIntent,
    });
  };

  const handleQuickDemoDriver = () => {
    purgeLegacyGlobalData();
    onLoginSuccess({
      id: 'usr_demo_driver',
      name: 'Capt. Miller (Fleet Dispatch)',
      emailOrPhone: 'miller.freight@parkkaro.in',
      accountType: 'driver',
    });
  };

  const handleQuickDemoHost = () => {
    purgeLegacyGlobalData();
    onLoginSuccess({
      id: 'usr_demo_host',
      name: 'S. K. Sharma (JNPT Yard Host)',
      emailOrPhone: 'sharma.yards@parkkaro.in',
      accountType: 'host',
    });
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white font-sans flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Lag-free static industrial background */}
      <BackgroundPattern />

      {/* Top Brand Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between relative z-10 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-blue-600/30 border border-blue-400/30">
            P
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight text-white">PARKKARO</span>
              <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950/80 border border-blue-800/80 px-2 py-0.5 rounded">
                SECURE AUTH
              </span>
            </div>
            <p className="text-xs text-neutral-400">Industrial & Commercial Vehicle Parking Network</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <IndustrialSticker variant="fastag" />
          <IndustrialSticker variant="anpr" />
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="max-w-xl w-full mx-auto my-auto py-8 relative z-10">
        
        {/* Floating Decorative Stickers */}
        <div className="flex justify-between items-center mb-3 px-2">
          <IndustrialSticker variant="verified" />
          <IndustrialSticker variant="upi" />
        </div>

        <div className="bg-neutral-900/95 backdrop-blur-sm border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8">
          
          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="flex bg-neutral-950 p-1.5 rounded-xl border border-neutral-800 mb-4">
            <button
              type="button"
              id="tab-signin-btn"
              onClick={() => setAuthMode('signin')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                authMode === 'signin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In to Terminal
            </button>
            <button
              type="button"
              id="tab-signup-btn"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                authMode === 'signup'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Create New Account
            </button>
          </div>

          {/* Person-to-Person Data Notice */}
          <div className="bg-blue-950/40 border border-blue-800/60 rounded-xl px-3.5 py-2 mb-5 flex items-center gap-2.5 text-xs text-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="leading-tight text-[11px]">
              <strong className="text-white font-semibold">Strict Person-to-Person Isolation:</strong> When you log in or sign up, prior store data is cleared. You will strictly access records created & saved by your account.
            </span>
          </div>

          {authMode === 'signin' ? (
            /* ================= SIGN IN FORM ================= */
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white mb-1">
                  Operator & Host Sign In
                </h1>
                <p className="text-xs text-neutral-400 mb-4">
                  Log in to access parking bookings, digital QR gate passes, or manage yard bays.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
                  <span>Mobile Number or Email</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Driver ID / UPI ID / Phone</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="signin-email-or-phone"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Enter phone (+91) or email"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
                  <span>Access Password</span>
                  <span className="text-[10px] text-blue-400 hover:underline cursor-pointer">Forgot PIN/Password?</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="signin-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-10 pr-10 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="rounded border-neutral-700 bg-neutral-950 text-blue-600 focus:ring-0" />
                  <span>Stay authenticated on this device</span>
                </label>
                <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL
                </span>
              </div>

              <button
                type="submit"
                id="btn-submit-signin"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer mt-2"
              >
                <span>Sign In & Select Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Instant 1-Click Demo Buttons */}
              <div className="pt-4 border-t border-neutral-800 space-y-2">
                <div className="text-[11px] font-mono font-semibold text-neutral-400 text-center uppercase tracking-wider">
                  — Fast Instant Demo Access —
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    id="demo-login-driver"
                    onClick={handleQuickDemoDriver}
                    className="p-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700/80 rounded-xl text-xs font-semibold text-neutral-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Truck className="w-4 h-4 text-amber-400" />
                    <span>Fleet Driver Demo</span>
                  </button>

                  <button
                    type="button"
                    id="demo-login-host"
                    onClick={handleQuickDemoHost}
                    className="p-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700/80 rounded-xl text-xs font-semibold text-neutral-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Warehouse className="w-4 h-4 text-emerald-400" />
                    <span>Yard Host Demo</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ================= SIGN UP FORM ================= */
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white mb-1">
                  Create ParkKaro Account
                </h1>
                <p className="text-xs text-neutral-400 mb-4">
                  Join India's dedicated industrial staging & high-clearance truck parking platform.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Full Name / Transporter Name
                </label>
                <input
                  type="text"
                  required
                  id="signup-fullname"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar or Om Logistics"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Mobile Number (WhatsApp/SMS)
                  </label>
                  <input
                    type="tel"
                    required
                    id="signup-phone"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    id="signup-email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Create Password / PIN
                </label>
                <input
                  type="password"
                  required
                  id="signup-password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  Primary Interest:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setAccountIntent('driver')}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      accountIntent === 'driver'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold">Park Vehicles</span>
                  </div>

                  <div
                    onClick={() => setAccountIntent('host')}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      accountIntent === 'host'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <Warehouse className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold">Rent Empty Lot</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1 text-xs text-neutral-400">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-neutral-700 bg-neutral-950 text-blue-600 focus:ring-0"
                />
                <label htmlFor="agree-terms" className="cursor-pointer">
                  I agree to ParkKaro Terms of Service, Yard Clearance Protocols, and Privacy Policy.
                </label>
              </div>

              <button
                type="submit"
                id="btn-submit-signup"
                disabled={!agreeTerms}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer mt-2"
              >
                <span>Register & Continue to Portal Selection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 font-medium py-3 border-t border-neutral-900 relative z-10">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-neutral-500" />
          <span>PARKKARO INDUSTRIAL PLATFORM • 256-BIT ANPR GATEWAY</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-400">
          <span>NH-48 Corridor</span>
          <span>JNPT Gateway</span>
          <span>Delhi-NCR Hub</span>
        </div>
      </footer>
    </div>
  );
};
