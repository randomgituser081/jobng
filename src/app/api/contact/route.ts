import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Parse FormData instead of JSON to handle the file upload
    const formData = await req.formData();

    // 2. Extract Fields & Auto-Collected Metadata
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const attachment = formData.get("attachment") as File | null;

    const customerId = formData.get("customerId") as string;
    const platform = formData.get("platform") as string;
    const timestamp = formData.get("timestamp") as string;
    const device = formData.get("device") as string;

    // 3. Server-Side Validation Rules
    if (!title || title.trim() === "") {
      return NextResponse.json(
        { ok: false, error: "Message Title is required." },
        { status: 400 },
      );
    }
    if (title.length > 100) {
      return NextResponse.json(
        { ok: false, error: "Message Title cannot exceed 100 characters." },
        { status: 400 },
      );
    }
    if (!description || description.trim() === "") {
      return NextResponse.json(
        { ok: false, error: "Description is required." },
        { status: 400 },
      );
    }

    // 4. File Validation & Upload Handling
    let attachmentUrl = null;
    if (attachment && attachment.size > 0) {
      // Validate Type
      if (!["image/jpeg", "image/png"].includes(attachment.type)) {
        return NextResponse.json(
          { ok: false, error: "Attachment must be a JPG or PNG image." },
          { status: 400 },
        );
      }

      // Validate Size (5MB limit enforced strictly on backend)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (attachment.size > MAX_SIZE) {
        return NextResponse.json(
          { ok: false, error: "Attachment exceeds the 5MB size limit." },
          { status: 400 },
        );
      }

      /*
       * MOCK S3 UPLOAD:
       * In a real app, you would stream `attachment.stream()` or convert to Buffer
       * and push to AWS S3, Cloudinary, etc., returning the file URL.
       */
      const buffer = await attachment.arrayBuffer();
      // const s3UploadResult = await uploadToS3(buffer, attachment.name);
      // attachmentUrl = s3UploadResult.url;

      attachmentUrl = `https://mock-object-storage.com/uploads/${Date.now()}-${attachment.name}`;
    }

    // 5. Database Processing
    /*
     * PRD Note: "Backend storage for this field should use a data type with no
     * practical length ceiling (e.g. TEXT rather than VARCHAR)"
     *
     * Example SQL Schema configuration:
     * CREATE TABLE complaints (
     *   id UUID PRIMARY KEY,
     *   title VARCHAR(100) NOT NULL,
     *   description TEXT NOT NULL,          <-- 'TEXT' handles unlimited chars
     *   attachment_url VARCHAR(255),
     *   customer_id VARCHAR(50),
     *   platform VARCHAR(50),
     *   device_info TEXT,
     *   created_at TIMESTAMP
     * );
     */

    // Simulate backend processing time
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Return success
    return NextResponse.json({
      ok: true,
      message: "Complaint logged successfully",
      data: {
        title,
        attachmentUrl, // null if no file was uploaded
        platform,
        customerId,
      },
    });
  } catch (error) {
    console.error("Complaint Submission Error:", error);
    return NextResponse.json(
      { ok: false, error: "Network or server error. Please try again." },
      { status: 500 },
    );
  }
}
