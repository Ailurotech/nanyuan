export const LoadingSpinner = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex justify-center items-center col-span-full"
  >
    <svg
      aria-label="Loading spinner"
      className="animate-spin h-10 w-10 text-yellow-400"
      viewBox="0 0 24 24"
    >
      <title>Loading spinner</title>
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      ></path>
    </svg>
    <span className="text-white text-lg font-bold ml-2">Loading...</span>
  </div>
);
