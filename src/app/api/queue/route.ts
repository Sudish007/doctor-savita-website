import { NextResponse } from 'next/server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendWhatsAppNotification } from '@/lib/whatsapp/send'

/**
 * POST /api/queue
 *
 * Manages the live patient queue system:
 * - 'next': Increments current_token, decrements waiting_count, and broadcasts via Supabase Realtime.
 *           Also sends WhatsApp notifications to patients who are 2 positions away.
 * - 'reset': Resets current_token to 0 and waiting_count to 0.
 * - 'join': Patient takes a token — increments waiting_count and returns assigned token number.
 *           Optionally accepts phone number for WhatsApp notification when their turn is near.
 *
 * Requirements: 30.2, 30.3, 30.6, 26.2
 */
export async function POST(request: Request) {
  try {
    // 1. Parse and validate request body
    const body = await request.json()
    const { action, phone } = body as { action: string; phone?: string }

    if (!action || !['next', 'reset', 'join'].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid action. Must be "next", "reset", or "join".',
        },
        { status: 400 }
      )
    }

    if (action === 'next') {
      return handleNextPatient()
    }

    if (action === 'join') {
      return handleJoinQueue(phone)
    }

    return handleResetQueue()
  } catch (error) {
    console.error('[Queue API] Unexpected error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    )
  }
}

/**
 * Handles the 'next' action:
 * 1. Fetches current queue state
 * 2. Increments current_token and decrements waiting_count
 * 3. Updates the queue_status table (triggers Supabase Realtime broadcast)
 * 4. Checks queue_subscriptions for patients 2 positions away and sends WhatsApp notification
 */
async function handleNextPatient() {
  // Fetch current queue state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: currentState, error: fetchError } = await (supabaseAdmin as any)
    .from('queue_status')
    .select('*')
    .eq('id', 1)
    .single()

  if (fetchError || !currentState) {
    console.error('[Queue API] Failed to fetch queue state:', fetchError)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch current queue state.',
      },
      { status: 500 }
    )
  }

  const newToken = currentState.current_token + 1
  const newWaitingCount = Math.max(0, currentState.waiting_count - 1)

  // Update queue_status — Supabase Realtime will broadcast this change automatically
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: updatedState, error: updateError } = await (supabaseAdmin as any)
    .from('queue_status')
    .update({
      current_token: newToken,
      waiting_count: newWaitingCount,
      last_updated: new Date().toISOString(),
    })
    .eq('id', 1)
    .select('*')
    .single()

  if (updateError || !updatedState) {
    console.error('[Queue API] Failed to update queue state:', updateError)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to advance queue. Please try again.',
      },
      { status: 500 }
    )
  }

  // Send WhatsApp notification to patients 2 positions away
  // Their token_number = newToken + 2 (they are 2 positions after the currently served token)
  await notifyPatientsNearQueue(newToken)

  return NextResponse.json({
    success: true,
    message: `Now serving Token #${newToken}`,
    data: {
      currentToken: updatedState.current_token,
      waitingCount: updatedState.waiting_count,
      lastUpdated: updatedState.last_updated,
    },
  })
}

/**
 * Handles the 'reset' action:
 * Resets current_token to 0 and waiting_count to 0.
 */
async function handleResetQueue() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: updatedState, error: updateError } = await (supabaseAdmin as any)
    .from('queue_status')
    .update({
      current_token: 0,
      waiting_count: 0,
      last_updated: new Date().toISOString(),
    })
    .eq('id', 1)
    .select('*')
    .single()

  if (updateError || !updatedState) {
    console.error('[Queue API] Failed to reset queue:', updateError)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to reset queue. Please try again.',
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Queue has been reset.',
    data: {
      currentToken: updatedState.current_token,
      waitingCount: updatedState.waiting_count,
      lastUpdated: updatedState.last_updated,
    },
  })
}

/**
 * Handles the 'join' action:
 * 1. Fetches current queue state
 * 2. Increments waiting_count
 * 3. Assigns token number = current_token + new waiting_count
 * 4. Optionally saves phone to queue_subscriptions for WhatsApp notification
 */
async function handleJoinQueue(phone?: string) {
  // Fetch current queue state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: currentState, error: fetchError } = await (supabaseAdmin as any)
    .from('queue_status')
    .select('*')
    .eq('id', 1)
    .single()

  if (fetchError || !currentState) {
    console.error('[Queue API] Failed to fetch queue state:', fetchError)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch current queue state.',
      },
      { status: 500 }
    )
  }

  const newWaitingCount = currentState.waiting_count + 1
  const assignedToken = currentState.current_token + newWaitingCount

  // Update waiting_count in queue_status — triggers Supabase Realtime broadcast
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: updatedState, error: updateError } = await (supabaseAdmin as any)
    .from('queue_status')
    .update({
      waiting_count: newWaitingCount,
      last_updated: new Date().toISOString(),
    })
    .eq('id', 1)
    .select('*')
    .single()

  if (updateError || !updatedState) {
    console.error('[Queue API] Failed to update queue state:', updateError)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to join queue. Please try again.',
      },
      { status: 500 }
    )
  }

  // If phone provided, save to queue_subscriptions for WhatsApp notification
  if (phone && phone.trim().length >= 10) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabaseAdmin as any)
        .from('queue_subscriptions')
        .insert({
          phone_number: phone.trim().replace(/^\+91/, '').replace(/\D/g, ''),
          token_number: assignedToken,
          notified: false,
          created_at: new Date().toISOString(),
        })
    } catch (err) {
      // Non-critical — don't fail the join if subscription insert fails
      console.error('[Queue API] Failed to save phone subscription:', err)
    }
  }

  const estimatedWait = newWaitingCount * 15

  return NextResponse.json({
    success: true,
    message: `You've been assigned Token #${assignedToken}`,
    data: {
      assignedToken,
      currentToken: updatedState.current_token,
      waitingCount: updatedState.waiting_count,
      estimatedWaitMinutes: estimatedWait,
      lastUpdated: updatedState.last_updated,
    },
  })
}

/**
 * Sends WhatsApp notifications to patients whose token is 2 positions away
 * from the currently being served token.
 *
 * Looks up queue_subscriptions for patients with token_number = currentToken + 2
 * who have not yet been notified.
 *
 * Requirements: 30.6
 */
async function notifyPatientsNearQueue(currentToken: number) {
  const targetToken = currentToken + 2

  try {
    // Find patients subscribed with token 2 positions away who haven't been notified
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: subscribers, error: subError } = await (supabaseAdmin as any)
      .from('queue_subscriptions')
      .select('id, phone_number, token_number')
      .eq('token_number', targetToken)
      .eq('notified', false)

    if (subError || !subscribers || subscribers.length === 0) {
      return // No subscribers to notify
    }

    // Send notifications in parallel
    const notifications = subscribers.map(
      async (sub: { id: string; phone_number: string; token_number: number }) => {
        const message =
          `🏥 You're almost up! Token #${currentToken} is being served. ` +
          `Your token is #${sub.token_number}. Please be ready.`

        const sent = await sendWhatsAppNotification(`+91${sub.phone_number}`, message)

        if (sent) {
          // Mark as notified to avoid duplicate notifications
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabaseAdmin as any)
            .from('queue_subscriptions')
            .update({ notified: true })
            .eq('id', sub.id)
        }

        return sent
      }
    )

    await Promise.allSettled(notifications)
  } catch (error) {
    // WhatsApp notification failure should not break the queue flow
    console.error('[Queue API] WhatsApp notification error:', error)
  }
}
