import { notFound } from "next/navigation";
import { getEventById } from "@/server/events/actions";
import { EventForm } from "../../_components/event-form";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Event</h1>
        <p className="text-muted-foreground">
          Update the event details below.
        </p>
      </div>

      <EventForm event={event} />
    </div>
  );
}
