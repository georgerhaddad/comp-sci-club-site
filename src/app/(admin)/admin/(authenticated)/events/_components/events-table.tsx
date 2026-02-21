"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Video, Star, MoreHorizontal, Pencil, Copy, Trash2 } from "lucide-react";
import { deleteEvent, type EventWithRelations } from "@/server/events/actions";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getMonthShort, getDay, getTime } from "@/lib/utils";

interface EventsTableProps {
  events: EventWithRelations[];
}

export function EventsTable({ events }: EventsTableProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteTarget({ id, title });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleting(deleteTarget.id);
    setDeleteTarget(null);

    try {
      const result = await deleteEvent(deleteTarget.id);
      if (!result.success) {
        toast.error(result.error || "Failed to delete event");
      } else {
        toast.success("Event deleted");
      }
      router.refresh();
    } catch {
      toast.error("Failed to delete event");
    } finally {
      setDeleting(null);
    }
  };

  const handleDuplicate = (id: string) => {
    router.push(`/admin/events/new?from=${id}`);
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${getMonthShort(d)} ${getDay(d)}, ${d.getFullYear()}, ${getTime(d)}`;
  };

  if (events.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">No events yet.</p>
        <Link
          href="/admin/events/new"
          className="mt-4 inline-block text-primary hover:underline"
        >
          Create your first event
        </Link>
      </div>
    );
  }

  return (
    <>
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border bg-card">
        <div className="divide-y">
          {events.map((event) => (
          <div
            key={event.id}
            className={`flex items-center gap-4 p-4 transition-opacity ${
              deleting === event.id ? "opacity-50" : ""
            }`}
          >
            {/* Image thumbnail */}
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
              {event.image ? (
                <Image
                  src={event.image.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            {/* Event info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className="truncate font-medium hover:underline"
                >
                  {event.title}
                </Link>
                {event.isFeatured && (
                  <Star className="h-4 w-4 shrink-0 fill-yellow-400 text-yellow-400" />
                )}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(event.dateStart)}
                </span>

                {event.location && (event.location.city || event.location.street) && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.location.city || event.location.street}
                  </span>
                )}

                {event.onlinePlatform && (
                  <span className="flex items-center gap-1">
                    <Video className="h-3.5 w-3.5" />
                    {event.onlinePlatform}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={deleting === event.id}>
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/events/${event.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDuplicate(event.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteClick(event.id, event.title)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
