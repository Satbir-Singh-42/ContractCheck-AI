import React from 'react';
import { useNavigate, type NavigateFunction, type NavigateOptions, type To } from 'react-router';

function forceTopScroll() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  // Re-assert on the next frame for mobile browsers that restore scroll unexpectedly.
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
}

export function useTopNavigate(): NavigateFunction {
  const navigate = useNavigate();

  return React.useCallback(((to: To | number, options?: NavigateOptions) => {
    forceTopScroll();

    if (typeof to === 'number') {
      navigate(to);
      return;
    }

    navigate(to, options);
  }) as NavigateFunction, [navigate]);
}
