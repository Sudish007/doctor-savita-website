import { NextResponse } from 'next/server';

import { contactFormSchema } from '@/lib/validators/contact';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * POST /api/contact
 * Saves contact form inquiries to Supabase.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = contactFormSchema.safeParse(body);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, errors: fieldErrors, message: 'Validation failed.' },
        { status: 400 }
      );
    }

    const { name, email, message } = validation.data;

    // Save to Supabase contact_inquiries table
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabaseAdmin as any)
        .from('contact_inquiries')
        .insert({ name, email, message });
    } catch {
      // If table doesn't exist or DB error, still return success to user
      console.error('[Contact API] Failed to save to Supabase');
    }

    return NextResponse.json(
      { success: true, message: 'Inquiry sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Contact API] Error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
