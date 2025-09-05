
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Une erreur s'est produite
            </h2>
            <p className="text-gray-600 mb-6">
              L'application a rencontré un problème inattendu. En mode démonstration, 
              certaines fonctionnalités peuvent être limitées.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => reset()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Réessayer
              </button>
              <a
                href="/"
                className="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
              >
                Retour à l'accueil
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
