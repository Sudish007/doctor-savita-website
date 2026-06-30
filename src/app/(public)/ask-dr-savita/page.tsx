"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Ask Dr. Savita - Async Video Consultation Page
 *
 * Allows patients to record a video message (max 2 minutes) describing
 * their symptoms, along with their name, phone, and a brief text description.
 * Uses MediaRecorder API for browser-based recording.
 *
 * Requirements: 31.1, 31.2, 31.3, 31.6, 31.7
 */

type RecordingState = "idle" | "requesting" | "ready" | "recording" | "preview";

interface FormData {
  patientName: string;
  phoneNumber: string;
  description: string;
}

interface FormErrors {
  patientName?: string;
  phoneNumber?: string;
  description?: string;
  video?: string;
}

const MAX_RECORDING_SECONDS = 120; // 2 minutes
const VIDEO_CONSULTATION_FEE = 150;
const UPI_ID = 'savitasinghunstoppable98@oksbi';

export default function AskDrSavitaPage() {
  // Payment gate state
  const [hasPaid, setHasPaid] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Recording state
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [remainingSeconds, setRemainingSeconds] = useState(MAX_RECORDING_SECONDS);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    patientName: "",
    phoneNumber: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
      if (timerRef.current) clearInterval(timerRef.current);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const requestCamera = useCallback(async () => {
    setRecordingState("requesting");
    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play();
      }

      setRecordingState("ready");
    } catch (err) {
      const error = err as Error;
      if (error.name === "NotAllowedError") {
        setCameraError(
          "Camera permission denied. Please allow camera and microphone access in your browser settings and try again."
        );
      } else if (error.name === "NotFoundError") {
        setCameraError(
          "No camera or microphone found. Please connect a camera/microphone and try again."
        );
      } else if (error.name === "NotReadableError") {
        setCameraError(
          "Camera is already in use by another application. Please close other apps using the camera and try again."
        );
      } else {
        setCameraError(
          `Unable to access camera: ${error.message}. Please ensure your browser supports video recording.`
        );
      }
      setRecordingState("idle");
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    setRemainingSeconds(MAX_RECORDING_SECONDS);

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : MediaRecorder.isTypeSupported("video/webm")
      ? "video/webm"
      : "video/mp4";

    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      setRecordedBlob(blob);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      stopStream();
      setRecordingState("preview");
    };

    recorder.start(1000); // Collect data every second
    setRecordingState("recording");

    // Countdown timer
    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopStream]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const discardRecording = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setRecordedBlob(null);
    setPreviewUrl(null);
    setRecordingState("idle");
    setCameraError(null);
  }, [previewUrl]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.patientName.trim()) {
      errors.patientName = "Patient name is required";
    } else if (formData.patientName.trim().length > 100) {
      errors.patientName = "Name must be 100 characters or less";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber.trim())) {
      errors.phoneNumber = "Enter a valid 10-digit Indian mobile number (starting with 6-9)";
    }

    if (!formData.description.trim()) {
      errors.description = "Please describe your concern";
    } else if (formData.description.trim().length > 200) {
      errors.description = "Description must be 200 characters or less";
    }

    if (!recordedBlob) {
      errors.video = "Please record a video before submitting";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const uploadData = new FormData();
      uploadData.append('patientName', formData.patientName.trim());
      uploadData.append('phoneNumber', formData.phoneNumber.trim());
      uploadData.append('description', formData.description.trim());
      uploadData.append('video', recordedBlob!, 'consultation-video.webm');

      // Calculate approximate duration from recording time
      const durationSeconds = MAX_RECORDING_SECONDS - remainingSeconds;
      uploadData.append('duration', String(durationSeconds > 0 ? durationSeconds : MAX_RECORDING_SECONDS));

      const response = await fetch('/api/video-upload', {
        method: 'POST',
        body: uploadData,
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 413) {
          setSubmitError('Video file is too large. Please record a shorter video.');
        } else if (response.status === 400) {
          // Map field errors if available
          if (result.errors) {
            setFormErrors(result.errors);
          }
          setSubmitError(result.message || 'Validation failed. Please check the form fields.');
        } else {
          setSubmitError(result.message || 'Failed to submit video. Please try again.');
        }
        return;
      }

      setIsSubmitted(true);
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Success screen
  if (isSubmitted) {
    return (
      <main className="section-padding min-h-screen flex items-center justify-center">
        <div className="container-content max-w-lg text-center">
          <div
            className="rounded-2xl p-8 md:p-12"
            style={{
              background: "var(--glass-bg-heavy)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow)",
            }}
          >
            {/* Success icon */}
            <div className="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center bg-[var(--accent-light)]">
              <svg
                className="w-10 h-10 text-[var(--accent)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-gradient mb-4">Video Submitted Successfully!</h2>
            <p className="text-[var(--foreground-secondary)] mb-2">
              Thank you, <strong>{formData.patientName}</strong>. Your video consultation
              request has been received.
            </p>
            <p className="text-[var(--foreground-muted)] text-sm mb-6">
              Dr. Savita will review your video and respond at her earliest convenience.
              You will receive a WhatsApp notification on{" "}
              <strong>{formData.phoneNumber}</strong> once the reply is ready.
            </p>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setRecordedBlob(null);
                setPreviewUrl(null);
                setRecordingState("idle");
                setFormData({ patientName: "", phoneNumber: "", description: "" });
                setFormErrors({});
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors touch-target"
            >
              Submit Another Video
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Payment gate — show payment first, then recording
  if (!hasPaid) {
    return (
      <main className="section-padding min-h-screen flex items-center justify-center">
        <div className="container-content max-w-md">
          <div className="text-center mb-6">
            <a href="/" className="text-sm text-[var(--primary)] hover:underline">← Back to website</a>
          </div>
          <div className="glass-card p-6 md:p-8 rounded-2xl">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">📹 Video Consultation</h1>
              <p className="text-sm text-[var(--foreground-muted)]">
                Record a 2-min video describing your symptoms. Dr. Savita will respond with personalized advice.
              </p>
            </div>

            {/* Fee */}
            <div className="text-center mb-6 p-4 rounded-xl bg-[var(--primary-light)]">
              <p className="text-xs text-[var(--foreground-muted)]">Consultation Fee</p>
              <p className="text-3xl font-bold text-[var(--primary)]">₹{VIDEO_CONSULTATION_FEE}</p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-5">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                <img
                  src="/images/upi-qr.jpeg"
                  alt="UPI QR Code"
                  width={180}
                  height={180}
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* UPI ID */}
            <div className="mb-5 p-3 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)]">
              <p className="text-xs text-[var(--foreground-muted)] mb-1 font-medium">UPI ID</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono text-[var(--foreground)] break-all">{UPI_ID}</code>
                <button
                  onClick={() => { navigator.clipboard.writeText(UPI_ID); setCopiedUpi(true); setTimeout(() => setCopiedUpi(false), 2000) }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${copiedUpi ? 'bg-emerald-100 text-emerald-700' : 'bg-[var(--primary-light)] text-[var(--primary)]'}`}
                >
                  {copiedUpi ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* UPI App Icons */}
            <div className="flex justify-center gap-3 mb-6">
              {[
                { name: 'GPay', scheme: 'gpay://upi/pay' },
                { name: 'PhonePe', scheme: 'phonepe://pay' },
                { name: 'Paytm', scheme: 'paytmmp://pay' },
                { name: 'UPI', scheme: 'upi://pay' },
              ].map(app => (
                <a
                  key={app.name}
                  href={`${app.scheme}?pa=${UPI_ID}&pn=Dr%20Savita&am=${VIDEO_CONSULTATION_FEE}&cu=INR&tn=Video%20Consultation`}
                  className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                >
                  {app.name}
                </a>
              ))}
            </div>

            {/* Confirm Payment */}
            <button
              onClick={() => setHasPaid(true)}
              className="w-full py-3.5 rounded-xl font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-lg mb-3"
            >
              ✓ I&apos;ve Paid ₹{VIDEO_CONSULTATION_FEE} — Proceed to Record
            </button>

            {/* Share proof */}
            <a
              href={`https://wa.me/916204309476?text=${encodeURIComponent(`Hi Dr. Savita, I've paid ₹${VIDEO_CONSULTATION_FEE} for video consultation. Payment screenshot attached.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 rounded-xl text-center text-sm font-medium bg-[#25D366] text-white hover:bg-[#1DA851] transition-colors"
            >
              📤 Share Payment Proof on WhatsApp
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section-padding min-h-screen">
      <div className="container-content max-w-3xl">
        {/* Page Header */}
        <header className="mb-8 text-center">
          <h1 className="text-gradient mb-3">Ask Dr. Savita</h1>
          <p className="text-[var(--foreground-muted)] max-w-xl mx-auto">
            Record a short video describing your symptoms and receive a personalized video
            reply from Dr. Savita Kumari.
          </p>
        </header>

        {/* Disclaimer (Req 31.6) */}
        <div
          className="rounded-xl p-4 mb-8 border"
          style={{
            background: "var(--muted)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 mt-0.5 shrink-0 text-[var(--destructive)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-[var(--foreground-secondary)]">
              <strong>Disclaimer:</strong> This is not a substitute for in-person diagnosis.
              For emergencies, please visit the nearest hospital.
            </p>
          </div>
        </div>

        {/* Main Card - Glassmorphism */}
        <div
          className="rounded-2xl p-6 md:p-8"
          style={{
            background: "var(--glass-bg-heavy)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid var(--glass-border)",
            boxShadow: "var(--glass-shadow)",
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            {/* Video Recording Section */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Record Your Video
              </h3>

              {/* Camera Error */}
              {cameraError && (
                <div className="rounded-lg p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-700 dark:text-red-300">{cameraError}</p>
                </div>
              )}

              {/* Video Area */}
              <div className="relative rounded-xl overflow-hidden bg-black/5 dark:bg-black/30 aspect-video mb-4">
                {recordingState === "idle" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
                      <svg className="w-8 h-8 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Click below to start your camera
                    </p>
                  </div>
                )}

                {recordingState === "requesting" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Requesting camera access...
                    </p>
                  </div>
                )}

                {/* Live video feed */}
                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover ${
                    recordingState === "ready" || recordingState === "recording"
                      ? "block"
                      : "hidden"
                  }`}
                  playsInline
                  muted
                />

                {/* Preview video */}
                {recordingState === "preview" && previewUrl && (
                  <video
                    ref={previewVideoRef}
                    className="w-full h-full object-cover"
                    src={previewUrl}
                    controls
                    playsInline
                  />
                )}

                {/* Recording indicator + countdown */}
                {recordingState === "recording" && (
                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5">
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-white text-sm font-mono font-medium">
                      {formatTime(remainingSeconds)}
                    </span>
                  </div>
                )}
              </div>

              {/* Recording Controls */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {recordingState === "idle" && (
                  <button
                    type="button"
                    onClick={requestCamera}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors touch-target"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Start Camera
                  </button>
                )}

                {recordingState === "ready" && (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 transition-colors touch-target"
                  >
                    <span className="w-4 h-4 bg-white rounded-full" />
                    Start Recording
                  </button>
                )}

                {recordingState === "recording" && (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 transition-colors touch-target"
                  >
                    <span className="w-4 h-4 bg-white rounded-sm" />
                    Stop Recording
                  </button>
                )}

                {recordingState === "preview" && (
                  <button
                    type="button"
                    onClick={discardRecording}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-[var(--foreground-secondary)] border border-[var(--border)] hover:bg-[var(--muted)] transition-colors touch-target"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Re-record
                  </button>
                )}
              </div>

              {/* Video error message */}
              {formErrors.video && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">
                  {formErrors.video}
                </p>
              )}

              <p className="mt-3 text-xs text-[var(--foreground-muted)] text-center">
                Maximum recording duration: 2 minutes. Your video will be reviewed by Dr. Savita only.
              </p>
            </section>

            {/* Form Fields */}
            <section className="space-y-5">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Your Details
              </h3>

              {/* Patient Name */}
              <div>
                <label
                  htmlFor="patientName"
                  className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5"
                >
                  Patient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => handleInputChange("patientName", e.target.value)}
                  maxLength={100}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--background-secondary)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-colors ${
                    formErrors.patientName
                      ? "border-red-500"
                      : "border-[var(--border)]"
                  }`}
                />
                {formErrors.patientName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.patientName}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    // Only allow digits, max 10
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    handleInputChange("phoneNumber", val);
                  }}
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--background-secondary)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-colors ${
                    formErrors.phoneNumber
                      ? "border-red-500"
                      : "border-[var(--border)]"
                  }`}
                />
                {formErrors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5"
                >
                  Brief Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  maxLength={200}
                  rows={3}
                  placeholder="Describe your concern in brief (max 200 characters)"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--background-secondary)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-colors resize-none ${
                    formErrors.description
                      ? "border-red-500"
                      : "border-[var(--border)]"
                  }`}
                />
                <div className="flex justify-between mt-1">
                  {formErrors.description ? (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {formErrors.description}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-[var(--foreground-muted)]">
                    {formData.description.length}/200
                  </span>
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="mt-8">
              {submitError && (
                <div className="rounded-lg p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-700 dark:text-red-300">{submitError}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={recordingState === "recording" || isSubmitting}
                className="w-full py-3 px-6 rounded-xl font-semibold text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target"
              >
                {isSubmitting ? "Uploading..." : "Submit Video Consultation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
