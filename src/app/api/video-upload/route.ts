import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * POST /api/video-upload
 *
 * Handles video consultation uploads:
 * 1. Accepts FormData with patientName, phoneNumber, description, video (file)
 * 2. Validates required fields and constraints
 * 3. Uploads video to Supabase Storage (bucket: 'video-consultations')
 * 4. Stores metadata in video_consultations table
 * 5. Returns consultation ID on success
 *
 * Requirements: 31.3, 31.7
 */
export async function POST(request: Request) {
  try {
    // Check content-type is multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, message: 'Request must be multipart/form-data.' },
        { status: 400 }
      );
    }

    // Parse FormData
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Failed to parse form data.' },
        { status: 400 }
      );
    }

    // Extract fields
    const patientName = formData.get('patientName') as string | null;
    const phoneNumber = formData.get('phoneNumber') as string | null;
    const description = formData.get('description') as string | null;
    const video = formData.get('video') as File | null;
    const durationStr = formData.get('duration') as string | null;

    // --- Validation ---
    const errors: Record<string, string> = {};

    // patientName: required
    if (!patientName || !patientName.trim()) {
      errors.patientName = 'Patient name is required.';
    }

    // phoneNumber: 10 digits, starts with 6-9
    if (!phoneNumber || !phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(phoneNumber.trim())) {
      errors.phoneNumber = 'Enter a valid 10-digit Indian mobile number (starting with 6-9).';
    }

    // description: required, max 200 chars
    if (!description || !description.trim()) {
      errors.description = 'Description is required.';
    } else if (description.trim().length > 200) {
      errors.description = 'Description must be 200 characters or less.';
    }

    // video: required file
    if (!video || !(video instanceof File) || video.size === 0) {
      errors.video = 'Video file is required.';
    }

    // duration: must be <= 120 seconds
    const duration = durationStr ? parseInt(durationStr, 10) : null;
    if (duration !== null && !isNaN(duration) && duration > 120) {
      errors.duration = 'Video duration must not exceed 120 seconds (2 minutes).';
    }

    // Return 400 if validation errors exist
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, errors, message: 'Validation failed. Please check the form fields.' },
        { status: 400 }
      );
    }

    // Check file size (limit: 50MB as a safety net)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    if (video!.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Video file is too large. Maximum size is 50MB.' },
        { status: 413 }
      );
    }

    // --- Upload to Supabase Storage ---
    const timestamp = Date.now();
    const sanitizedName = patientName!.trim().replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const fileExtension = video!.name?.split('.').pop() || 'webm';
    const filePath = `${sanitizedName}_${timestamp}.${fileExtension}`;

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await video!.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: uploadError } = await (supabaseAdmin as any).storage
      .from('video-consultations')
      .upload(filePath, fileBuffer, {
        contentType: video!.type || 'video/webm',
        upsert: false,
      });

    if (uploadError) {
      console.error('[Video Upload API] Storage upload error:', uploadError);
      return NextResponse.json(
        { success: false, message: 'Failed to upload video. Please try again.' },
        { status: 500 }
      );
    }

    // Generate signed URL (valid for 7 days)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: signedUrlData, error: signedUrlError } = await (supabaseAdmin as any).storage
      .from('video-consultations')
      .createSignedUrl(filePath, 7 * 24 * 60 * 60); // 7 days in seconds

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error('[Video Upload API] Signed URL error:', signedUrlError);
      return NextResponse.json(
        { success: false, message: 'Video uploaded but failed to generate access URL. Please contact the clinic.' },
        { status: 500 }
      );
    }

    const videoUrl = signedUrlData.signedUrl;

    // --- Store metadata in video_consultations table ---
    const videoDuration = duration && !isNaN(duration) ? duration : 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: consultation, error: dbError } = await (supabaseAdmin as any)
      .from('video_consultations')
      .insert({
        patient_name: patientName!.trim(),
        phone_number: phoneNumber!.trim(),
        description: description!.trim(),
        video_url: videoUrl,
        duration: videoDuration,
        status: 'pending',
      })
      .select('id')
      .single();

    if (dbError || !consultation) {
      console.error('[Video Upload API] Database insert error:', dbError);
      return NextResponse.json(
        { success: false, message: 'Video uploaded but failed to save consultation record. Please contact the clinic.' },
        { status: 500 }
      );
    }

    const consultationId = (consultation as { id: string }).id;

    // --- Success response ---
    return NextResponse.json(
      {
        success: true,
        consultationId,
        message: `Video consultation submitted successfully. Consultation ID: ${consultationId}. Dr. Savita will review your video and respond soon.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Video Upload API] Unexpected error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again or call the clinic directly at 9800206704.' },
      { status: 500 }
    );
  }
}
