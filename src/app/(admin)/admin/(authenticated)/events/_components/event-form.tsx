"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { ImagePicker, type ImageRecord } from "@/components/image-picker";
import {
  createEvent,
  updateEvent,
  type EventWithRelations,
  type EventFormData,
} from "@/server/events/actions";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface EventFormProps {
  /** Existing event to edit (enables edit mode) */
  event?: EventWithRelations;
  /** Initial data to pre-fill the form (stays in create mode) */
  initialData?: EventWithRelations | null;
}

function formatDateTimeLocal(date: Date): string {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const adjusted = new Date(d.getTime() - offset * 60 * 1000);
  return adjusted.toISOString().slice(0, 16);
}

export function EventForm({ event, initialData }: EventFormProps) {
  const router = useRouter();
  const source = event ?? initialData;
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      title: source?.title ?? "",
      description: source?.description ?? "",
      dateStart: source?.dateStart ? formatDateTimeLocal(source.dateStart) : "",
      dateEnd: source?.dateEnd ? formatDateTimeLocal(source.dateEnd) : "",
      selectedImage: (source?.image ?? null) as ImageRecord | null,
      onlineUrl: source?.onlineUrl ?? "",
      onlinePlatform: source?.onlinePlatform ?? "",
      isFeatured: source?.isFeatured ?? false,
      location: {
        street: source?.location?.street ?? "",
        city: source?.location?.city ?? "",
        state: source?.location?.state ?? "",
        zip: source?.location?.zip ?? "",
        country: source?.location?.country ?? "",
      },
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { street, city, state, zip, country } = value.location;
      const hasLocation = street || city || state || zip || country;

      const formData: EventFormData = {
        title: value.title.trim(),
        description: value.description.trim(),
        dateStart: new Date(value.dateStart),
        dateEnd: value.dateEnd ? new Date(value.dateEnd) : null,
        imageId: value.selectedImage?.id ?? null,
        onlineUrl: value.onlineUrl.trim() || null,
        onlinePlatform: value.onlinePlatform.trim() || null,
        isFeatured: value.isFeatured,
        location: hasLocation
          ? {
              street: street || null,
              city: city || null,
              state: state || null,
              zip: zip || null,
              country: country || null,
            }
          : null,
      };

      const result = event
        ? await updateEvent(event.id, formData)
        : await createEvent(formData);

      if (result.success) {
        router.push("/admin/events");
        router.refresh();
      } else {
        setServerError(result.error || "Failed to save event");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      {serverError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {/* Basic Info */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
        <div className="space-y-4">
          <form.Field
            name="title"
            validators={{
              onBlur: ({ value }) => {
                if (!value.trim()) return "Title is required";
                if (value.length > 200) return "Title is too long (max 200 characters)";
                return undefined;
              },
            }}
          >
            {(field) => (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Event title"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Description (Markdown)
                </label>
                <div data-color-mode="dark">
                  <MDEditor
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value ?? "")}
                    preview="edit"
                    height={300}
                  />
                </div>
              </div>
            )}
          </form.Field>

          <form.Field name="isFeatured">
            {(field) => (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="h-4 w-4 rounded border"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium">
                  Featured event
                </label>
              </div>
            )}
          </form.Field>
        </div>
      </div>

      {/* Date & Time */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Date & Time</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <form.Field
            name="dateStart"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "Start date is required";
                return undefined;
              },
            }}
          >
            {(field) => (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Start Date & Time <span className="text-destructive">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="dateEnd">
            {(field) => (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
            )}
          </form.Field>
        </div>
      </div>

      {/* Image */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Event Image</h2>
        <form.Field name="selectedImage">
          {(field) => (
            <ImagePicker
              value={field.state.value}
              onChange={(image) => field.handleChange(image)}
              placeholder="Select event cover image"
            />
          )}
        </form.Field>
      </div>

      {/* Location */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Physical Location</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Optional. Leave blank if the event is online-only.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <form.Field name="location.street">
              {(field) => (
                <div>
                  <label className="mb-1 block text-sm font-medium">Street Address</label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="123 Main St"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="location.city">
            {(field) => (
              <div>
                <label className="mb-1 block text-sm font-medium">City</label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="San Francisco"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
            )}
          </form.Field>

          <form.Field
            name="location.state"
            validators={{
              onBlur: ({ value }) => {
                if (value && value.length > 3) return "State code too long (max 3 characters)";
                return undefined;
              },
            }}
          >
            {(field) => (
              <div>
                <label className="mb-1 block text-sm font-medium">State</label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="CA"
                  maxLength={3}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="location.zip"
            validators={{
              onBlur: ({ value }) => {
                if (value && value.length > 10) return "ZIP code too long (max 10 characters)";
                return undefined;
              },
            }}
          >
            {(field) => (
              <div>
                <label className="mb-1 block text-sm font-medium">ZIP Code</label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="94102"
                  maxLength={10}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="location.country">
            {(field) => (
              <div>
                <label className="mb-1 block text-sm font-medium">Country</label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="United States"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
            )}
          </form.Field>
        </div>
      </div>

      {/* Online */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Online Meeting</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Optional. Add online meeting details if the event is virtual or hybrid.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <form.Field name="onlinePlatform">
            {(field) => (
              <div>
                <label className="mb-1 block text-sm font-medium">Platform</label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Zoom, Google Meet, Discord, etc."
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
            )}
          </form.Field>

          <form.Field
            name="onlineUrl"
            validators={{
              onBlur: ({ value }) => {
                if (value && value.trim()) {
                  try {
                    new URL(value);
                  } catch {
                    return "Please enter a valid URL";
                  }
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <div>
                <label className="mb-1 block text-sm font-medium">Meeting URL</label>
                <input
                  type="url"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="https://..."
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : event ? "Update Event" : "Create Event"}
            </Button>
          )}
        </form.Subscribe>
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
