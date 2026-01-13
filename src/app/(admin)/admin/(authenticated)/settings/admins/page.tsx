"use client";

import { useEffect, useState } from "react";

interface Admin {
  id: number;
  githubId: string;
  githubUsername: string;
  email: string | null;
  isSuperAdmin: boolean | null;
  addedAt: string | null;
  addedBy: string | null;
}

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newGithubId, setNewGithubId] = useState("");
  const [newGithubUsername, setNewGithubUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/admins");
      if (!response.ok) {
        if (response.status === 403) {
          setError("You do not have permission to manage admins.");
          return;
        }
        throw new Error("Failed to fetch admins");
      }
      const data = await response.json();
      setAdmins(data);
    } catch {
      setError("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError(null);

    try {
      const response = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubId: newGithubId,
          githubUsername: newGithubUsername,
          email: newEmail || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add admin");
      }

      setNewGithubId("");
      setNewGithubUsername("");
      setNewEmail("");
      fetchAdmins();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add admin");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveAdmin = async (githubId: string, username: string) => {
    if (!confirm(`Are you sure you want to remove ${username} as an admin?`)) {
      return;
    }

    try {
      const response = await fetch("/api/admins", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove admin");
      }

      fetchAdmins();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove admin");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Manage Admins</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Admins</h1>
      <p className="text-muted-foreground">
        Add or remove GitHub accounts that can access the admin console.
      </p>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Add New Admin</h2>
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">
                GitHub User ID
              </label>
              <input
                type="text"
                value={newGithubId}
                onChange={(e) => setNewGithubId(e.target.value)}
                placeholder="12345678"
                required
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Find at: api.github.com/users/username
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                GitHub Username
              </label>
              <input
                type="text"
                value={newGithubUsername}
                onChange={(e) => setNewGithubUsername(e.target.value)}
                placeholder="octocat"
                required
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Email (optional)
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={adding}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add Admin"}
          </button>
        </form>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Current Admins</h2>
        </div>
        <div className="divide-y">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{admin.githubUsername}</span>
                  {admin.isSuperAdmin && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      Super Admin
                    </span>
                  )}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  ID: {admin.githubId}
                  {admin.email && <> &middot; {admin.email}</>}
                  {admin.addedBy && <> &middot; Added by {admin.addedBy}</>}
                </div>
              </div>
              {!admin.isSuperAdmin && (
                <button
                  onClick={() =>
                    handleRemoveAdmin(admin.githubId, admin.githubUsername)
                  }
                  className="text-sm text-destructive hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
