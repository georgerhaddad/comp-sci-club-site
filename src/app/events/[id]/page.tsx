interface props {
  id: string;
}

export default async function EventPage({ params }: { params: Promise<props> }) {
  const { id } = await params;
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">{id}</h1>
    </main>
  );
}