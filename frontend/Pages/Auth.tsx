import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../src/firebaseConfig';
import { verifyStudent, verifyStaff, activateStaff, getStaffProfile } from '../src/services/api';
import { UserRole } from '../types';

// ── Types ─────────────────────────────────────────────────────────────────────
type AuthProps = { verifyOnly?: boolean };

interface FirebaseError {
  code?: string;
  message?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const getFirebaseErrorMessage = (err: FirebaseError): string => {
  switch (err.code) {
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'Account not found. Please check your credentials.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'Email already in use. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    default:
      return err.message || 'Authentication failed. Please try again.';
  }
};

// ── Component ─────────────────────────────────────────────────────────────────
const Auth: React.FC<AuthProps> = ({ verifyOnly = false }) => {
  const { setUserRole, setOnboarded, setVerified, setStaffProfile } = useApp();

  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (verifyOnly && isSignUp) {
      setError('Sign up is disabled for this flow.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      const user = auth.currentUser;
      if (!user) throw new Error('Authentication failed. Please try again.');

      // Student flow
      if (role === UserRole.USER) {
        await verifyStudent();
        setUserRole(UserRole.USER);
        setVerified(true);
        setOnboarded(true);
        return;
      }

      // Staff flow
      await verifyStaff();
      await activateStaff().catch(() => {});
      const profile = await getStaffProfile();

      setStaffProfile({
        role: profile.role,
        stallId: profile.stall_id,
        stallName: profile.stall_name,
        email: profile.email,
      });
      setUserRole(UserRole.STAFF);
      setVerified(true);
      setOnboarded(true);
    } catch (err) {
      console.error('Auth Error:', err);
      setError(getFirebaseErrorMessage(err as FirebaseError));
    } finally {
      setLoading(false);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp((prev) => !prev);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F9F9F9]">
      <div className="w-full max-w-md bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="text-green-600" size={32} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {isSignUp ? 'Create your account' : 'Sign in to GreenPlate'}
          </h2>
          <p className="text-sm text-gray-500">
            {isSignUp ? 'Enter your details to get started' : 'Welcome back, please enter your details'}
          </p>
        </div>

        {/* Role Switcher */}
        <div className="bg-gray-100/80 p-1 rounded-xl flex mb-8">
          {([UserRole.USER, UserRole.STAFF] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                role === r ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'
              }`}
            >
              {r === UserRole.USER ? 'Student' : 'Staff'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-medium text-center border border-red-100">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-4 mb-10">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full py-4 pl-12 pr-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all bg-transparent"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              onKeyDown={(e) => { if (e.key === 'Enter' && !loading) handleAuth(); }}
              className="w-full py-4 pl-12 pr-12 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : isSignUp ? 'Continue' : 'Sign In'}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={toggleSignUp} className="text-green-600 font-medium hover:underline">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;