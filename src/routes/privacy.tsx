import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

const EFFECTIVE_DATE = "July 20, 2025";
const CONTACT_EMAIL = "contact@payaleducation.in";
const COMPANY_NAME = "Payal Education Society Computers";
const OWNER = "Subhash";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Payal Education Society Computers" },
      {
        name: "description",
        content:
          "Learn how Payal Education Society Computers collects, uses, and protects your personal information.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 pt-40 pb-32 min-h-screen">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Legal</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tighter">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Effective date: <strong>{EFFECTIVE_DATE}</strong>
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-muted-foreground">

          <Section title="1. Who We Are">
            <p>
              {COMPANY_NAME} ("we", "our", or "us") is an educational resource platform operated by{" "}
              <strong className="text-foreground">{OWNER}</strong> under Payal Education Society. We offer
              curated digital learning materials including videos, PDFs, notes, and assignments related
              to computer education, programming, competitive exams, and related subjects.
            </p>
            <p className="mt-3">
              If you have any questions about this Privacy Policy, contact us at:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We collect information you provide directly and information generated through your use of our platform.</p>
            <SubList items={[
              {
                heading: "Account information",
                body: "When you register, we collect your full name, email address, and (if you sign up via Google OAuth) your Google profile details such as your profile picture.",
              },
              {
                heading: "Payment information",
                body: "Payments are processed by Razorpay. We do not store your card number, CVV, or full bank details. We receive a transaction ID, order amount, and payment status from Razorpay.",
              },
              {
                heading: "Usage data",
                body: "We may collect information about which resources you view, download, or purchase, and general platform activity.",
              },
              {
                heading: "Technical data",
                body: "IP address, browser type, device type, operating system, and pages visited. This is collected automatically via server logs.",
              },
              {
                heading: "Communications",
                body: "If you contact us through our contact form or email, we retain those communications.",
              },
            ]} />
          </Section>

          <Section title="3. How We Use Your Information">
            <SubList items={[
              { heading: "Account & service delivery", body: "To create and manage your account, authenticate you, and provide access to purchased content." },
              { heading: "Purchases & payments", body: "To process transactions and verify entitlements to digital resources." },
              { heading: "Communications", body: "To send you purchase confirmations, account-related notices, and (with your consent) product updates." },
              { heading: "Platform improvement", body: "To understand how users interact with our platform and improve the experience." },
              { heading: "Legal & security", body: "To detect fraud, enforce our Terms of Service, and comply with legal obligations." },
            ]} />
          </Section>

          <Section title="4. Sharing of Information">
            <p>We do not sell, rent, or trade your personal information. We may share data with:</p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>
                <strong className="text-foreground">Supabase</strong> — our database and authentication
                provider. Your account data and session tokens are stored securely on Supabase infrastructure.
              </li>
              <li>
                <strong className="text-foreground">Razorpay</strong> — our payment processor. Transactions
                are subject to Razorpay's own privacy policy.
              </li>
              <li>
                <strong className="text-foreground">Google</strong> — if you choose Google OAuth sign-in,
                Google processes your authentication data per their own privacy policy.
              </li>
              <li>
                <strong className="text-foreground">Legal authorities</strong> — if required by law, court
                order, or to protect the rights and safety of our users or ourselves.
              </li>
            </ul>
          </Section>

          <Section title="5. Cookies and Tracking">
            <p>
              We use cookies and similar technologies to maintain your login session and remember your
              preferences. These are strictly necessary for the platform to function. We do not use
              advertising cookies or third-party tracking pixels.
            </p>
            <p className="mt-3">
              You can configure your browser to refuse cookies, but this may prevent you from logging in
              or using certain features.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <p>
              We retain your personal data for as long as your account is active or as needed to provide
              our services. If you delete your account, we will delete or anonymize your personal data
              within <strong className="text-foreground">30 days</strong>, except where we are required to
              retain it for legal, tax, or fraud-prevention purposes.
            </p>
          </Section>

          <Section title="7. Your Rights">
            <p>You have the following rights regarding your personal data:</p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li><strong className="text-foreground">Access</strong> — Request a copy of the personal data we hold about you.</li>
              <li><strong className="text-foreground">Correction</strong> — Request that we correct inaccurate data.</li>
              <li><strong className="text-foreground">Deletion</strong> — Request deletion of your account and associated data.</li>
              <li><strong className="text-foreground">Portability</strong> — Request your data in a structured, machine-readable format.</li>
              <li><strong className="text-foreground">Objection</strong> — Object to certain processing of your data.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              . We will respond within 30 days.
            </p>
          </Section>

          <Section title="8. Data Security">
            <p>
              We implement industry-standard technical and organizational measures to protect your data,
              including encrypted connections (HTTPS/TLS), secure database access controls, and regular
              security reviews. However, no method of transmission over the Internet is 100% secure, and
              we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>
              Our platform is not directed to children under the age of <strong className="text-foreground">13</strong>.
              We do not knowingly collect personal information from children under 13. If we learn that we
              have collected such information, we will delete it promptly. If you believe a child has
              provided us with personal data, please contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="10. Third-Party Links">
            <p>
              Our platform may contain links to external websites. We are not responsible for the privacy
              practices of those sites. We encourage you to review the privacy policies of any third-party
              sites you visit.
            </p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do, we will revise the
              "Effective date" at the top of this page and, for material changes, notify you via email
              or a prominent notice on our platform. Continued use of the platform after changes are posted
              constitutes your acceptance of the updated policy.
            </p>
          </Section>

          <Section title="12. Contact Us">
            <p>
              For any privacy-related questions or requests, please contact:
            </p>
            <address className="mt-3 not-italic space-y-1">
              <p><strong className="text-foreground">{COMPANY_NAME}</strong></p>
              <p>Operated by {OWNER}</p>
              <p>
                Email:{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline underline-offset-4">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </address>
          </Section>

        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-foreground mb-3">{title}</h2>
      {children}
    </section>
  );
}

function SubList({ items }: { items: { heading: string; body: string }[] }) {
  return (
    <ul className="mt-3 list-disc pl-5 space-y-3">
      {items.map((item) => (
        <li key={item.heading}>
          <strong className="text-foreground">{item.heading}</strong> — {item.body}
        </li>
      ))}
    </ul>
  );
}
