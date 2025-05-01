import { useState, useEffect } from 'react';

const useCookieConsent = () => {
  const [consent, setConsent] = useState<'accepted' | 'denied' | null>(null);

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookieConsent');
    if (storedConsent) {
      setConsent(storedConsent as 'accepted' | 'denied');
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setConsent('accepted');
  };

  const denyCookies = () => {
    localStorage.setItem('cookieConsent', 'denied');
    setConsent('denied');
  };

  return { consent, acceptCookies, denyCookies };
};

export default useCookieConsent;