import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createHash } from "crypto";
import { UTApi } from "uploadthing/server";
import { db } from "@/server/db/schema";
import { images } from "@/server/db/schema/events";
import { allowedAdmins } from "@/server/db/schema/admins";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const utapi = new UTApi();

/**
 * Generates a SHA-256 hash of the image buffer.
 */
function generateHash(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

/**
 * POST /api/images/upload
 *
 * Handles image upload with:
 * 1. WebP conversion using sharp
 * 2. Hash-based deduplication
 * 3. Upload to UploadThing if new
 *
 * Requires admin authentication.
 *
 * Request: multipart/form-data with 'file' field
 * Response: { success: true, image: ImageRecord, isDuplicate: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [admin] = await db
      .select()
      .from(allowedAdmins)
      .where(eq(allowedAdmins.githubId, session.user.id))
      .limit(1);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "File must be an image" },
        { status: 400 }
      );
    }

    // Convert to buffer and process with sharp
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert to WebP format with optimization
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 85 })
      .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
      .toBuffer();

    // Generate hash of the processed image
    const hash = generateHash(webpBuffer);

    // Check for existing image with same hash
    const existingImage = await db
      .select()
      .from(images)
      .where(eq(images.hash, hash))
      .limit(1);

    if (existingImage.length > 0) {
      // Return existing image - no need to upload again
      return NextResponse.json({
        success: true,
        image: existingImage[0],
        isDuplicate: true,
      });
    }

    // Create a new File object from the WebP buffer
    const webpFile = new File([new Uint8Array(webpBuffer)], `${hash}.webp`, {
      type: "image/webp",
    });

    // Upload to UploadThing
    const uploadResult = await utapi.uploadFiles([webpFile]);

    if (!uploadResult[0]?.data) {
      return NextResponse.json(
        { success: false, error: "Upload failed" },
        { status: 500 }
      );
    }

    const { key, ufsUrl } = uploadResult[0].data;

    // Save to database
    const [newImage] = await db
      .insert(images)
      .values({
        uploadthingKey: key,
        url: ufsUrl,
        hash,
        isDraft: true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      image: newImage,
      isDuplicate: false,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
