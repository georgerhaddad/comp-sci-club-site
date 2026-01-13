export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to the admin console. Use the navigation above to manage events,
        projects, and other content.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">Events</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create and manage club events, meetings, and workshops.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Showcase member projects and collaborative work.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">Coming Soon</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            More management features will be added here.
          </p>
        </div>
      </div>
    </div>
  );
}
