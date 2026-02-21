"use server";

import { db } from "@/server/db/schema";
import { images } from "@/server/db/schema/events";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "@/server/auth/helpers";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

export type ImageRecord = typeof images.$inferSelect;

/**
 * Fetches all uploaded images, ordered by creation date (newest first).
 * Requires admin authentication.
 * @param includeDrafts - Whether to include draft images (default: false)
 */
export async function getImages(includeDrafts = false): Promise<ImageRecord[]> {
  await requireAdmin();
  if (includeDrafts) {
    return db.select().from(images).orderBy(desc(images.createdAt));
  }
  return db
    .select()
    .from(images)
    .where(eq(images.isDraft, false))
    .orderBy(desc(images.createdAt));
}

/**
 * Fetches a single image by ID.
 */
export async function getImageById(id: string): Promise<ImageRecord | null> {
  const result = await db.select().from(images).where(eq(images.id, id)).limit(1);
  return result[0] ?? null;
}

/**
 * Fetches a single image by hash.
 * Used for deduplication checks.
 */
export async function getImageByHash(hash: string): Promise<ImageRecord | null> {
  const result = await db.select().from(images).where(eq(images.hash, hash)).limit(1);
  return result[0] ?? null;
}

/**
 * Marks an image as no longer a draft (published).
 * Requires admin authentication.
 */
export async function publishImage(id: string): Promise<void> {
  await requireAdmin();
  await db.update(images).set({ isDraft: false }).where(eq(images.id, id));
}

/**
 * Deletes an image from both the database and UploadThing storage.
 * Requires admin authentication.
 */
export async function deleteImage(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    const image = await db
      .select()
      .from(images)
      .where(eq(images.id, id))
      .limit(1);

    if (!image[0]) {
      return { success: false, error: "Image not found" };
    }

    // Delete from database
    await db.delete(images).where(eq(images.id, id));

    // Delete from UploadThing
    const utapi = new UTApi();
    await utapi.deleteFiles(image[0].uploadthingKey);

    revalidatePath("/admin/events");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete image:", error);
    return { success: false, error: "Failed to delete image" };
  }
}
