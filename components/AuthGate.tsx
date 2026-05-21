import React, { useState } from 'react';

interface AuthGateProps {
  children: React.ReactNode;
}

/**
 * AuthGate component
 * A reusable authentication passcode gate to protect private pages/features.
 * Default passphrase: devobi2026
 */
export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [authError, setAuthError] = useState(false);
  const passphraseHash = 'devobi2026';// TODO: Hash this and store in environment variable

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase === passphraseHash) {
      setAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <main className="min-h-screen pt-32 pb-16 px-6 flex items-center justify-center">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-violet-500/5 rounded-full blur-[120px]" />
      </div>
      <form onSubmit={handleAuth} className="glass p-10 rounded-2xl max-w-md w-full border border-white/10 shadow-2xl relative z-10">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-2">Private Access</h2>
        <p className="text-gray-500 text-sm text-center mb-8">Enter the passphrase to continue</p>

        <div className="space-y-4">
          <input
            id="authgate-passphrase"
            type="password"
            value={passphrase}
            onChange={e => setPassphrase(e.target.value)}
            placeholder="Passphrase"
            autoFocus
            className="w-full bg-black border border-white/10 p-4 rounded-xl focus:border-emerald-500 outline-none transition-all text-white placeholder-gray-600"
          />
          {authError && (
            <p className="text-red-400 text-sm text-center animate-pulse">Incorrect passphrase. Try again.</p>
          )}
          <button
            type="submit"
            className="w-full py-4 bg-emerald-400 hover:bg-emerald-300 text-black font-bold rounded-xl transition-all active:scale-[0.98] cursor-pointer"
          >
            Unlock
          </button>
        </div>
      </form>
    </main>
  );
};

export default AuthGate;
