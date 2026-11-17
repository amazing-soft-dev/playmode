export default function HomePage() {
  return (
    <main className="container-site section-y">
      <h1 className="text-4xl uppercase">PlayerMode</h1>
      <p className="mt-4 text-fog">Describe a game. Play it a minute later.</p>
      <a
        href="/create"
        className="mt-8 inline-flex h-12 items-center bg-accent px-6 text-accent-ink transition-colors hover:bg-paper"
      >
        Start creating
      </a>
    </main>
  );
}
