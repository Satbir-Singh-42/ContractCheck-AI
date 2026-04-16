import React from 'react';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

function isDynamicImportError(error: unknown) {
  if (!(error instanceof Error)) return false;

  return /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk [\w-]+ failed|ChunkLoadError/i.test(
    error.message
  );
}

function getErrorMessage(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred while loading this page.';
}

export function RouteErrorBoundary() {
  const error = useRouteError();
  const dynamicImportError = isDynamicImportError(error);

  return (
    <div className="min-h-screen bg-[#060608] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-[640px] rounded-2xl border border-white/[0.08] bg-[#0B0B0E] p-6 sm:p-8 text-center">
        <div className="mx-auto mb-5 h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center">
          <AlertTriangle size={22} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          {dynamicImportError ? 'App Updated - Reload Required' : 'Unexpected Application Error'}
        </h1>

        <p className="text-slate-300 mb-2">
          {dynamicImportError
            ? 'A newer deployment is available. Reload the page to fetch the latest app files.'
            : 'Something went wrong while loading this route.'}
        </p>

        <p className="text-xs sm:text-sm text-slate-500 break-all mb-6">
          {getErrorMessage(error)}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
          >
            <RefreshCw size={16} /> Reload App
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.12] text-slate-200 hover:bg-white/5 transition-colors"
          >
            <Home size={16} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
