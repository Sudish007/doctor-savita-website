import { NextResponse } from 'next/server';

import { contactFormSchema } from '@/lib/validators/contact';

/**
 * POST /api/contact
 *
 * Handles contact form submissions:
 * 1. Validates request body with contactFormSchema (Zod)
 * 2. Returns success response (no actual email sending for now)
 *
 * Requirements: 10.6, 10.7, 10.8
 */
export async function POST(request: Request) {
  try {
    // 1. Parse request body
    const body = await request.json();

    // 2. Validate with Zod schema
    const validation = contactFormSchema.safeParse(body);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          errors: fieldErrors,
          message: 'Validation failed. Please check the form fields.',
        },
        { status: 400 }
      );
    }

    // 3. For now, just return success (no actual email sending)
    // In production, this would send an email or store the inquiry
    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry sent successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Contact API] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
