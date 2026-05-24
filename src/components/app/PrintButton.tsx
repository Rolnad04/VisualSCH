'use client';

/**
 * Botón de impresión reutilizable — Client Component.
 * Extraído para que las páginas que exportan `metadata` (Server Components)
 * puedan delegar la interactividad de `window.print()` sin violar las reglas de RSC.
 */
export function PrintButton() {
    return (
        <button
            id="btn-imprimir"
            type="button"
            onClick={() => window.print()}
            className="
                inline-flex items-center gap-2 rounded-lg
                bg-red-600 px-4 py-2 text-sm font-semibold
                text-white shadow-sm transition
                hover:bg-red-700 active:scale-95
            "
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16
                       a2 2 0 012 2v5a2 2 0 01-2 2h-2m-6 0v4H9v-4h6z"
                />
            </svg>
            Imprimir / Exportar PDF
        </button>
    );
}
