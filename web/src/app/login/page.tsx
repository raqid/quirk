'use client';

import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/lib/auth';
import Providers from '../providers';

function LoginInner() {
  const router = useRouter();
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="text-[13px] tracking-[0.15em] uppercase"
          style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
        >
          loading...
        </div>
      </div>
    );
  }

  if (user) {
    router.replace('/app');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
      <div className="w-[400px] text-center">
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Quirk" className="h-20 w-20 rounded-full" style={{ opacity: 0.8 }} />
        </div>
        <p
          className="text-[14px] mb-14"
          style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
        >
          sign in to your contributor dashboard
        </p>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (response) => {
              if (response.credential) {
                try {
                  await signInWithGoogle(response.credential);
                  router.push('/app');
                } catch (err) {
                  console.error('Sign in failed:', err);
                }
              }
            }}
            onError={() => console.error('Google login failed')}
            theme="filled_black"
            shape="pill"
            size="large"
            text="signin_with"
          />
        </div>

        <p
          className="text-[12px] leading-[1.7] mt-12"
          style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
        >
          by signing in, you agree to Quirk&apos;s Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Providers>
      <LoginInner />
    </Providers>
  );
}
