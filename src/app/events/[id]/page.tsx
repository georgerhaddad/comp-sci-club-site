import { NavbarBackgroundControllerObserver } from "@/components/layout/navbar-background-controller-observer";
import EventSection from "@/app/events/[id]/_components/event";
import { Suspense } from "react";

interface Props {
  id: string;
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
