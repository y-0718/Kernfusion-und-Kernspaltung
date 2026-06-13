export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 text-center text-[#1A1A1A]">
      <section className="max-w-xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#0033A0]">Offline</p>
        <h1 className="text-4xl font-semibold">Diese Ansicht ist gerade nicht erreichbar.</h1>
        <p className="mt-5 text-lg leading-8 text-[#4b5563]">
          Bereits geladene Präsentationsseiten und Medien können weiter funktionieren. Externe Videos oder neue Admin-Daten benötigen
          wieder eine Internetverbindung.
        </p>
      </section>
    </main>
  );
}
