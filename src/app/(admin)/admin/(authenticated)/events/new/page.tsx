import { EventForm } from "../_components/event-form";
import { getEventById } from "@/server/events/actions";

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  // If duplicating, fetch source event data to pre-fill the form
  const initialData = from ? await getEventById(from) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {initialData ? "Duplicate Event" : "Create Event"}
        </h1>
        <p className="text-muted-foreground">
          {initialData
            ? "Review and modify the details below, then create the new event."
            : "Fill in the details below to create a new event."}
        </p>
      </div>

      <EventForm initialData={initialData} />
    </div>
  );
}
