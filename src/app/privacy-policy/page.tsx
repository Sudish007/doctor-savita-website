import type { Metadata } from "next";
import { Navigation } from "@/components/layout/Navigation";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Saubhagya Multispeciality Clinic App by Dr. Savita Kumari",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-16 md:pt-20 pb-24 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-fluid-h2 font-heading font-bold text-foreground mb-2">
          Privacy Policy
        </h1>
        <p className="text-fluid-body-sm text-foreground-muted mb-8">
          Last updated: July 5, 2026
        </p>

        <div className="prose prose-sm md:prose-base max-w-none text-foreground-secondary space-y-6">
          <section>
            <h2 className="text-fluid-h4 font-heading font-semibold text-foreground mt-8 mb-3">
              1. Introduction
            </h2>
            <p>
              Saubhagya Multispeciality Clinic (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the
              Saubhagya Clinic mobile application and website (drsavitak.netlify.app). This Privacy
              Policy explains how we collect, use, disclose, and safeguard your information when you
              use our application.
            </p>
          </section>

          <section>
            <h2 className="text-fluid-h4 font-heading font-semibold text-foreground mt-8 mb-3">
              2. Information We Collect
            </h2>
            <h3 className="text-fluid-h5 font-heading font-medium text-foreground mt-4 mb-2">
              2.1 Personal Information
            </h3>
            <p>When you use our app, we may collect:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name and contact information (phone number)</li>
              <li>Appointment booking details (preferred date, time, symptoms)</li>
              <li>Queue/token registration data</li>
              <li>Health-related queries submitted to our AI chatbot</li>
            </ul>

            <h3 className="text-fluid-h5 font-heading font-medium text-foreground mt-4 mb-2">
              2.2 Automatically Collected Information
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Device type and operating system</li>
              <li>App usage analytics (pages visited, features used)</li>
              <li>IP address and general location (city level)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-fluid-h4 font-heading font-semibold text-foreground mt-8 mb-3">
              3. How We Use Your Information
            </h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Process and manage your appointment bookings</li>
              <li>Provide queue/token status updates</li>
              <li>Respond to your health queries via AI chatbot</li>
              <li>Send appointment reminders (with your consent)</li>
              <li>Improve our app and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-fluid-h4 font-heading font-semibold text-foreground mt-8 mb-3">
              4. Data Storage & Security
            </h2>
            <p>
              Your data is stored securely using Supabase (hosted on AWS infrastructure) with
              row-level security policies. We implement appropriate technical and organizational
              measures to protect your personal information against unauthorized access, alteration,
              disclosure, or destruction.
            </p>
            <p className="mt-2">
              Health-related chat conversations are processed by AI and are not stored permanently.
              They are used only to provide immediate responses to your queries.
            </p>
          </section>

          <section>
            <h2 className="text-fluid-h4 font-heading font-semibold text-foreground mt-8 mb-3">
              5. Data Sharing
            </h2>
            <p>
              We do <strong>not</strong> sell, trade, or rent your personal information to third
              parties. We may share data only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>With your explicit consent</li>
              <li>To comply with legal requirements or court orders</li>
              <li>With service providers who assist in app operations (under strict data protection agreements)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-fluid-h4 font-heading font-semibold text-foreground mt-8 mb-3">
              6. AI Chatbot Disclaimer
            </h2>
            <p>
              The AI health assistant provides general health information only. It does{" "}
              <strong>not</strong> provide medical diagnoses, prescriptions, or treatment plans.
              Always consult Dr. Savita Kumari or a qualified medical professional for actual
              medical advice. The chatbot responses should not be considered a substitute for
              professional medical consultation.
            </p>
          </section>

          <section>
            <h2 className="text-fluid-h4 font-heading font-semibold text-foreground mt-8 mb-3">
              7. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
              <li>Request a copy of your data in portable format</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, contact us at the details provided below.
            </p>
          </section>

          <section>
            <h2 className="text-fluid-h4 font-heading font-semibold text-foreground mt-8 mb-3">
              8. Children&apos;s Privacy
            </h2>
            <p>
              Our app does not knowingly collect personal information from children under 13.
              Appointment bookings for minors must be made by a parent or legal guardian.
            </p>
          </section>

          <section>
            <h2 className="text-fluid-h4 font-heading font-semibold text-foreground mt-8 mb-3">
              9. Third-Party Services
            </h2>
            <p>Our app may use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Supabase</strong> — Database and authentication</li>
              <li><strong>Google Analytics</strong> — Usage analytics (anonymized)</li>
              <li><strong>WhatsApp</strong> — Communication (via external link)</li>
              <li><strong>UPI Payment Apps</strong> — Payment processing (via external deep links)</li>
            </ul>
            <p className="mt-2">
              Each third-party service has its own privacy policy governing data handling.
            </p>
          </section>

          <section>
            <h2 className="text-fluid-h4 font-heading font-semibold text-foreground mt-8 mb-3">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on
              this page with an updated revision date. Continued use of the app after changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-fluid-h4 font-heading font-semibold text-foreground mt-8 mb-3">
              11. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or wish to exercise your data rights,
              please contact:
            </p>
            <div className="mt-3 p-4 rounded-xl bg-background-secondary border border-border">
              <p className="font-semibold text-foreground">Dr. Savita Kumari</p>
              <p>Saubhagya Multispeciality Clinic</p>
              <p>Village Pipra, Post Khedhay, PS Andar</p>
              <p>Siwan, Bihar, India</p>
              <p className="mt-2">
                Phone: <a href="tel:+916204309476" className="text-primary hover:underline">+91 6204309476</a>
              </p>
              <p>
                WhatsApp: <a href="https://wa.me/919971585873" className="text-primary hover:underline">+91 9971585873</a>
              </p>
            </div>
          </section>
        </div>

        {/* Back to home */}
        <div className="mt-12 pt-6 border-t border-border">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </div>
    </>
  );
}
