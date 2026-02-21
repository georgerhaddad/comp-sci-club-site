"use client";

import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Upload, ImageIcon, Check, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getImages, type ImageRecord } from "@/server/images/actions";

/**
 * Props for the ImagePicker component.
 */
export interface ImagePickerProps {
  /**
   * The currently selected image object (or null if none selected).
   */
  value: ImageRecord | null;

  /**
   * Callback fired when an image is selected or cleared.
   * @param image - The selected image or null if cleared
   */
  onChange: (image: ImageRecord | null) => void;

  /**
   * Optional placeholder text shown when no image is selected.
   * @default "Select an image"
   */
  placeholder?: string;

  /**
   * Whether the picker is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional className for the trigger button.
   */
  className?: string;

  /**
   * Whether to include draft images in the gallery.
   * @default true (admin context typically wants to see all images)
   */
  includeDrafts?: boolean;
}

/**
 * ImagePicker - A reusable component for selecting images.
 *
 * Features:
 * - Upload new images (auto-converts to WebP, deduplicates by hash)
 * - Browse and select from existing uploaded images
 * - Preview selected image
 * - Clear selection
 *
 * @example
 * ```tsx
 * const [selectedImage, setSelectedImage] = useState<ImageRecord | null>(null);
 *
 * <ImagePicker
 *   value={selectedImage}
 *   onChange={setSelectedImage}
 *   placeholder="Choose event image"
 * />
 * ```
 */
export function ImagePicker({
  value,
  onChange,
  placeholder = "Select an image",
  disabled = false,
  className,
  includeDrafts = true,
}: ImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingSelection, setPendingSelection] = useState<ImageRecord | null>(
    null
  );

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedImages = await getImages(includeDrafts);
      setImages(fetchedImages);
    } catch (err) {
      setError("Failed to load images");
      console.error("Failed to load images:", err);
    } finally {
      setLoading(false);
    }
  }, [includeDrafts]);

  // Load images when dialog opens
  useEffect(() => {
    if (open) {
      loadImages();
    }
  }, [open, loadImages]);

  // Sync pending selection with value when dialog opens
  useEffect(() => {
    if (open) {
      setPendingSelection(value);
    }
  }, [open, value]);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/images/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Upload failed");
        }

        // Add new image to list (or update if duplicate returned)
        if (result.isDuplicate) {
          // Image already exists, just select it
          setPendingSelection(result.image);
        } else {
          // New image, add to list and select
          setImages((prev) => [result.image, ...prev]);
          setPendingSelection(result.image);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        console.error("Upload error:", err);
      } finally {
        setUploading(false);
        // Reset file input
        e.target.value = "";
      }
    },
    []
  );

  const handleConfirm = () => {
    onChange(pendingSelection);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="relative w-full">
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-auto min-h-[120px] w-full justify-start p-4",
              value && "pr-14",
              className
            )}
          >
            {value ? (
              <div className="flex w-full items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border">
                  <Image
                    src={value.url}
                    alt="Selected image"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col items-start gap-1">
                  <span className="text-sm font-medium">Image selected</span>
                  <span className="max-w-[200px] truncate text-xs text-muted-foreground">
                    {value.uploadthingKey}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex w-full flex-col items-center gap-2 py-4 text-muted-foreground">
                <ImageIcon className="h-8 w-8" />
                <span className="text-sm">{placeholder}</span>
              </div>
            )}
          </Button>
        </DialogTrigger>

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 z-10 shrink-0"
            onClick={handleClear}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear selection</span>
          </Button>
        )}
      </div>

      <DialogContent className="flex max-h-[80vh] max-w-3xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Image</DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto py-4">
          {/* Upload section */}
          <div className="rounded-lg border-2 border-dashed p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
              id="image-upload-input"
            />
            <label
              htmlFor="image-upload-input"
              className={cn(
                "flex cursor-pointer flex-col items-center gap-2",
                uploading && "cursor-not-allowed opacity-50"
              )}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Processing and uploading...
                  </span>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload a new image
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Images are automatically converted to WebP
                  </span>
                </>
              )}
            </label>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Gallery section */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              Or select from existing images
            </h4>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : images.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No images uploaded yet
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {images.map((image) => {
                  const isSelected = pendingSelection?.id === image.id;
                  const imageLabel = image.uploadthingKey || `Image ${image.id}`;
                  return (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setPendingSelection(image)}
                      aria-label={`Select image ${imageLabel}${image.isDraft ? " (draft)" : ""}`}
                      aria-pressed={isSelected}
                      className={cn(
                        "relative aspect-square overflow-hidden rounded-md border-2 transition-all hover:opacity-80",
                        isSelected
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-transparent"
                      )}
                    >
                      <Image
                        src={image.url}
                        alt={imageLabel}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 33vw, 20vw"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                          <Check className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      {image.isDraft && (
                        <div className="absolute right-1 top-1 rounded bg-yellow-500/90 px-1 py-0.5 text-[10px] font-medium text-white">
                          Draft
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleConfirm}>
            {pendingSelection ? "Confirm Selection" : "Select"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Re-export the ImageRecord type for convenience
export type { ImageRecord };
