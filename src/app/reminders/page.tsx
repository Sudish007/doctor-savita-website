"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Reminder {
  id: string;
  name: string;
  time: string;
  frequency: "daily" | "twice" | "thrice";
}

const STORAGE_KEY = "saubhagya_medicine_reminders";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getFrequencyLabel(freq: string) {
  switch (freq) {
    case "daily": return "Once daily";
    case "twice": return "Twice daily";
    case "thrice": return "Thrice daily";
    default: return freq;
  }
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [name, setName] = useState("");
  const [time, setTime] = useState("08:00");
  const [frequency, setFrequency] = useState<"daily" | "twice" | "thrice">("daily");
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");

  // Load reminders from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReminders(JSON.parse(stored));
      }
    } catch {}

    if ("Notification" in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  // Save reminders to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  // Set up notification timers
  useEffect(() => {
    if (notifPermission !== "granted" || reminders.length === 0) return;

    const timers: NodeJS.Timeout[] = [];

    function scheduleNotification(reminder: Reminder) {
      const now = new Date();
      const [hours, minutes] = reminder.time.split(":").map(Number);
      const target = new Date();
      target.setHours(hours, minutes, 0, 0);

      // If time already passed today, schedule for tomorrow
      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1);
      }

      const delay = target.getTime() - now.getTime();

      const timer = setTimeout(() => {
        new Notification("💊 Medicine Reminder", {
          body: `Time to take: ${reminder.name}`,
          icon: "/favicon.png",
          tag: reminder.id,
        });
      }, delay);

      timers.push(timer);
    }

    reminders.forEach(scheduleNotification);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [reminders, notifPermission]);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
    }
  };

  const addReminder = useCallback(() => {
    if (!name.trim()) return;
    const newReminder: Reminder = {
      id: generateId(),
      name: name.trim(),
      time,
      frequency,
    };
    setReminders((prev) => [...prev, newReminder]);
    setName("");
    setTime("08:00");
    setFrequency("daily");
  }, [name, time, frequency]);

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-teal-100 dark:border-gray-800">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 hover:bg-teal-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <h1 className="text-lg font-bold text-teal-900 dark:text-teal-100">Medicine Reminders</h1>
          <span className="text-2xl">💊</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Notification Permission */}
        {notifPermission !== "granted" && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl">
            <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
              Enable notifications to get medicine alerts on time.
            </p>
            <button
              onClick={requestPermission}
              className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors"
            >
              Enable Notifications
            </button>
          </div>
        )}

        {/* Add Reminder Form */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-teal-100 dark:border-gray-700 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-teal-800 dark:text-teal-200">Add New Reminder</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Medicine Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Arnica 30"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              onKeyDown={(e) => e.key === "Enter" && addReminder()}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as "daily" | "twice" | "thrice")}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="daily">Once daily</option>
                <option value="twice">Twice daily</option>
                <option value="thrice">Thrice daily</option>
              </select>
            </div>
          </div>

          <button
            onClick={addReminder}
            disabled={!name.trim()}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold rounded-xl transition-colors disabled:cursor-not-allowed"
          >
            Add Reminder
          </button>
        </div>

        {/* Active Reminders List */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-teal-800 dark:text-teal-200">
            Active Reminders {reminders.length > 0 && `(${reminders.length})`}
          </h2>

          {reminders.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-teal-200 dark:border-gray-700">
              <p className="text-4xl mb-3">🕐</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No reminders yet. Add your first medicine reminder above.
              </p>
            </div>
          ) : (
            reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-teal-100 dark:border-gray-700 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-lg">
                    💊
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{reminder.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {reminder.time} · {getFrequencyLabel(reminder.frequency)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label={`Delete ${reminder.name} reminder`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
