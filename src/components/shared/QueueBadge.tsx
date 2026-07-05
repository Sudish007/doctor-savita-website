"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/**
 * Live queue badge — shows "X patients waiting" on the homepage.
 * Visible on mobile only, positioned below the hero.
 * Connects to Supabase to get real-time queue count.
 */
export function QueueBadge() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchQueue() {
      try {
        const sb = createClient();
        const today = new Date().toISOString().split("T")[0];
        const { count: queueCount } = await sb
          .from("queue_subscriptions")
          .select("*", { count: "exact", head: true })
          .eq("status", "waiting")
          .gte("created_at", today);
        setCount(queueCount ?? 0);
      } catch {
        // Silently fail - badge just won't show
      }
    }

    fetchQueue();
    // Refresh every 30 seconds
    const interval = setInterval(fetchQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  if (count === null) return null;

  return (
    <Link
      href="/token"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full
        bg-accent-light border border-accent/30
        text-accent-foreground text-sm font-medium
        shadow-sm hover:shadow-md transition-shadow
        animate-pulse-slow"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
      </span>
      {count > 0 ? `${count} patient${count !== 1 ? "s" : ""} in queue` : "Queue open — Join now"}
    </Link>
  );
}
