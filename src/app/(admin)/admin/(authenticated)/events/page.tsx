import Link from "next/link";
import { getEvents } from "@/server/events/actions";
import { EventsTable } from "./_components/events-table";
import { EventsTableSkeleton } from "./_components/events-table-skeleton";
import { Suspense } from "react";

async function EventsTableContent() {
  const events = await getEvents();
  return <EventsTable events={events} />;
}

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">
            Manage club events, meetings, and workshops.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          Create Event
        </Link>
      </div>
      <Suspense fallback={<EventsTableSkeleton />}>
        <EventsTableContent />
      </Suspense>
    </div>
  );
}
