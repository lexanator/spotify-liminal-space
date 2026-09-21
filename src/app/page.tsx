const ERROR_MESSAGES: Record<string, string> = {
  access_denied: "You'll need to approve Spotify access to explore your sound space.",
  invalid_state: 'Something went wrong starting the login - please try again.',
  token_exchange_failed: "Spotify didn't accept that login - please try again.",
};

export default async function Home(props: PageProps<'/'>) {
  const params = await props.searchParams;
  const errorCode = typeof params.error === 'string' ? params.error : null;
  const errorMessage = errorCode ? (ERROR_MESSAGES[errorCode] ?? 'Something went wrong.') : null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-black text-zinc-50 px-6">
      <div className="flex max-w-lg flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Sound Space</h1>
        <p className="text-balance text-lg text-zinc-400">
          Connect Spotify and step into a 3D space built from your own top tracks - clustered by
          genre, laid out by taste.
        </p>

        {errorMessage && (
          <p className="rounded-lg bg-red-950/60 px-4 py-2 text-sm text-red-300">{errorMessage}</p>
        )}

        <a
          href="/api/auth/login"
          className="mt-2 rounded-full bg-[#1DB954] px-8 py-3 text-sm font-semibold text-black transition hover:brightness-110"
        >
          Connect with Spotify
        </a>

        <p className="text-xs text-zinc-600">
          We only read your top tracks and artists. Nothing is posted or modified on your account.
        </p>
      </div>
    </div>
  );
}
