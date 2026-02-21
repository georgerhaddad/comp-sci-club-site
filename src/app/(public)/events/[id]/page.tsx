import { NavbarBackgroundControllerObserver } from "@/components/layout/navbar-background-controller-observer";
import EventSection from "./_components/event";
import { Suspense } from "react";
import { events } from "@/server/db/schema/events";
import { db } from "@/server/db/schema";

interface Props {
  id: string;
}

export async function generateStaticParams() {
  const all = await db.select({ id: events.id }).from(events);
  return all.map((e) => ({ id: e.id }))
}

export default async function EventPage({
  params,
}: {
  params: Promise<Props>;
}) {
  const { id } = await params;
  return (
    <main>
      <Suspense fallback={<div>loading...</div>}>
        <EventSection id={id} />
      </Suspense>
      <NavbarBackgroundControllerObserver initialColor="bg-background" />
    </main>
  );
}
