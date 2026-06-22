"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="grid min-h-screen place-items-center px-5 text-center">
      <div>
        <h2 className="font-serif text-5xl">Something went wrong.</h2>
        <button className="button-dark mt-6" onClick={reset}>
          Try again
        </button>
      </div>
    </div>
  );
}
