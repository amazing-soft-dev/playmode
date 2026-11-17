export default function HomePage() {
  return (
    <main className="container-site section-y">
      <p className="type-label text-ash">[ PlayerMode ]</p>
      <h1 className="type-hero mt-6 max-w-3xl">Describe a game. Play it a minute later.</h1>
      <p className="type-wordmark mt-12">PlayerMode</p>
      <p className="type-body mt-6 max-w-xl text-fog">
        Make HTML5 games with AI, play a new challenge every day, and share what you build.
      </p>
      <a
        href="/create"
        className="type-caps mt-8 inline-flex h-12 items-center bg-accent px-6 text-accent-ink transition-colors hover:bg-paper"
      >
        Start creating
      </a>
    </main>
  );
}
