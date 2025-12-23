import { NavbarBackgroundControllerObserver } from "@/components/layout/navbar-background-controller-observer";
import EventSection from "@/app/events/[id]/_components/event";

interface Props {
  id: string;
}

export default async function EventPage({ params }: { params: Promise<Props> }) {
  const { id } = await params;
  return (
    <main className="">
      <EventSection id={id} />
      <NavbarBackgroundControllerObserver initialColor="bg-background" />
    </main>
  );
}