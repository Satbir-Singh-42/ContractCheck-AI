import React from 'react';
import { MotionConfig } from 'motion/react';
import { RouterProvider } from 'react-router';
import { router } from './routes';

function shouldReduceMotionNow() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)').matches;
}

function useShouldReduceMotion() {
  const [reduceMotion, setReduceMotion] = React.useState(shouldReduceMotionNow);

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)');

    const handleChange = () => setReduceMotion(mediaQuery.matches);
    handleChange();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return reduceMotion;
}

export default function App() {
  const reduceMotion = useShouldReduceMotion();

  return (
    <MotionConfig reducedMotion={reduceMotion ? 'always' : 'never'}>
      <RouterProvider router={router} />
    </MotionConfig>
  );
}