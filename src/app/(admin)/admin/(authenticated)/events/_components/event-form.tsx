"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ImagePicker, type ImageRecord } from "@/components/image-picker";
import { createEvent, updateEvent, type EventWithRelations, type EventFormData } from "@/server/events/actions";

// Dynamic import for markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface EventFormProps {
  /** Existing event to edit (enables edit mode) */
  event?: EventWithRelations;
  /** Initial data to pre-fill the form (stays in create mode) */
  initialData?: EventWithRelations | null;
}

export function EventForm({ event, initialData }: EventFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use event for edit mode, or initialData for pre-filled create mode
  const source = event ?? initialData;

  // Form state
  const [title, setTitle] = useState(source?.title ?? "");
  const [description, setDescription] = useState(source?.description ?? "");
  const [dateStart, setDateStart] = useState(
    source?.dateStart ? formatDateTimeLocal(source.dateStart) : ""
  );
  const [dateEnd, setDateEnd] = useState(
    source?.dateEnd ? formatDateTimeLocal(source.dateEnd) : ""
  );
  const [selectedImage, setSelectedImage] = useState<ImageRecord | null>(
    source?.image ?? null
  );
  const [onlineUrl, setOnlineUrl] = useState(source?.onlineUrl ?? "");
  const [onlinePlatform, setOnlinePlatform] = useState(source?.onlinePlatform ?? "");
  const [isFeatured, setIsFeatured] = useState(source?.isFeatured ?? false);

  // Location state
  const [street, setStreet] = useState(source?.location?.street ?? "");
  const [city, setCity] = useState(source?.location?.city ?? "");
  const [state, setState] = useState(source?.location?.state ?? "");
  const [zip, setZip] = useState(source?.location?.zip ?? "");
  const [country, setCountry] = useState(source?.location?.country ?? "");

  function formatDateTimeLocal(date: Date): string {
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const adjusted = new Date(d.getTime() - offset * 60 * 1000);
    return adjusted.toISOString().slice(0, 16);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      setSaving(false);
      return;
    }

    if (!dateStart) {
      setError("Start date is required");
      setSaving(false);
      return;
    }

    const formData: EventFormData = {
      title: title.trim(),
      description: description.trim(),
      dateStart: new Date(dateStart),
      dateEnd: dateEnd ? new Date(dateEnd) : null,
      imageId: selectedImage?.id ?? null,
      onlineUrl: onlineUrl.trim() || null,
      onlinePlatform: onlinePlatform.trim() || null,
      isFeatured,
      location:
        street || city || state || zip || country
          ? { street: street || null, city: city || null, state: state || null, zip: zip || null, country: country || null }
          : null,
    };

    try {
      const result = event
        ? await updateEvent(event.id, formData)
        : await createEvent(formData);

      if (result.success) {
        router.push("/admin/events");
        router.refresh();
      } else {
        setError(result.error || "Failed to save event");
      }
    } catch (err) {
      setError("Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description (Markdown)
            </label>
            <div data-color-mode="dark">
              <MDEditor
                value={description}
                onChange={(value) => setDescription(value ?? "")}
                preview="edit"
                height={300}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium">
              Featured event
            </label>
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Date & Time</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Start Date & Time <span className="text-destructive">*</span>
            </label>
            <input
              type="datetime-local"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Event Image</h2>
        <ImagePicker
          value={selectedImage}
          onChange={setSelectedImage}
          placeholder="Select event cover image"
        />
      </div>

      {/* Location */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Physical Location</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Optional. Leave blank if the event is online-only.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Street Address</label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="123 Main St"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="San Francisco"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="CA"
              maxLength={3}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">ZIP Code</label>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="94102"
              maxLength={10}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="United States"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Online */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Online Meeting</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Optional. Add online meeting details if the event is virtual or hybrid.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Platform</label>
            <input
              type="text"
              value={onlinePlatform}
              onChange={(e) => setOnlinePlatform(e.target.value)}
              placeholder="Zoom, Google Meet, Discord, etc."
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Meeting URL</label>
            <input
              type="url"
              value={onlineUrl}
              onChange={(e) => setOnlineUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : event ? "Update Event" : "Create Event"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/events")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
