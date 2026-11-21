import React, { useEffect, useRef } from 'react';

/**
 * Cloudflare Turnstile widget (explicit rendering, no extra dependency).
 *
 * The token it produces is checked server-side in `POST /api/reactivate`;
 * a token on its own proves nothing until Cloudflare's siteverify confirms it.
 * Tokens are single-use and expire after 300 seconds, so the parent must
 * remount this component (new `key`) after every submission attempt.
 */

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const script = existing ?? document.createElement('script');

    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => reject(new Error('Turnstile failed to load')));

    if (!existing) {
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  return scriptPromise;
}

interface TurnstileWidgetProps {
  siteKey: string;
  onToken: (token: string | null) => void;
  className?: string;
}

const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({ siteKey, onToken, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!siteKey) return;

    let cancelled = false;

    loadTurnstile()
      .then(() => {
        if (cancelled || widgetIdRef.current || !containerRef.current || !window.turnstile) return;

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'dark',
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => onTokenRef.current(null),
        });
      })
      .catch((error) => {
        console.error('Turnstile error:', error);
        onTokenRef.current(null);
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [siteKey]);

  if (!siteKey) {
    return (
      <p className="text-amber-400 text-sm text-center">
        Verification is not configured. Set TURNSTILE_SITE_KEY and restart the server.
      </p>
    );
  }

  return <div ref={containerRef} className={className} />;
};

export default TurnstileWidget;
