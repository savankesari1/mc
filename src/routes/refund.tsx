import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

const EFFECTIVE_DATE = "July 20, 2025";
const CONTACT_EMAIL = "contact@payaleducation.in";
const COMPANY_NAME = "Payal Education Society Computers";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Payal Education Society Computers" },
      {
        name: "description",
        content:
          "Refund and cancellation policy for digital resources purchased on Payal Education Society Computers.",
      },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 pt-40 pb-32 min-h-screen">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Legal</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tighter">Refund Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Effective date: <strong>{EFFECTIVE_DATE}</strong>
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-muted-foreground">

          <Section title="1. Overview">
            <p>
              At <strong className="text-foreground">{COMPANY_NAME}</strong>, we are committed to your
              satisfaction. Because our products are digital goods (videos, PDFs, notes, and other
              downloadable content), our refund policy is necessarily different from physical-goods
              retailers. Please read this policy carefully before making a purchase.
            </p>
          </Section>

          <Section title="2. Digital Goods — General No-Refund Policy">
            <p>
              All sales of digital resources are <strong className="text-foreground">final</strong> once
              the content has been accessed or downloaded. We invest significant time in curating and
              producing every resource, and digital delivery cannot be "returned" in the traditional sense.
            </p>
            <p className="mt-3">
              By completing a purchase, you acknowledge that you understand the nature of digital goods
              and agree that access to the content is granted immediately upon payment.
            </p>
          </Section>

          <Section title="3. Eligibility for Refunds">
            <p>You may request a refund under the following limited circumstances:</p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>
                <strong className="text-foreground">Unaccessed content</strong> — The resource has not
                been opened, streamed, or downloaded, and the request is made within{" "}
                <strong className="text-foreground">7 days</strong> of the original purchase date.
              </li>
              <li>
                <strong className="text-foreground">Duplicate purchase</strong> — You were accidentally
                charged twice for the same resource. We will fully refund the duplicate charge.
              </li>
              <li>
                <strong className="text-foreground">Technical failure</strong> — The content is genuinely
                inaccessible due to a platform error and we are unable to resolve the issue within 5
                business days.
              </li>
              <li>
                <strong className="text-foreground">Significantly not-as-described</strong> — The
                delivered content materially differs from what was described on the product page at the
                time of purchase.
              </li>
            </ul>
          </Section>

          <Section title="4. Non-Refundable Situations">
            <p>Refunds will <strong className="text-foreground">not</strong> be issued for:</p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>Content that has been opened, streamed, or downloaded.</li>
              <li>Requests made more than 7 days after the purchase date.</li>
              <li>Change of mind after accessing content.</li>
              <li>Failure to meet your device's technical requirements (please check compatibility before purchasing).</li>
              <li>Accounts that have been suspended or terminated for violating our Terms of Service.</li>
              <li>Partial completion of a course or resource bundle.</li>
            </ul>
          </Section>

          <Section title="5. How to Request a Refund">
            <p>To request a refund, email us at:</p>
            <p className="mt-2">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Refund Request`}
                className="text-foreground underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
            <p className="mt-3">Please include the following in your email:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Your registered email address</li>
              <li>The name of the resource(s) you purchased</li>
              <li>Your Razorpay Order ID or Transaction ID (found in your purchase confirmation email)</li>
              <li>The reason for your refund request</li>
            </ul>
            <p className="mt-3">
              We will review your request and respond within{" "}
              <strong className="text-foreground">3 business days</strong>.
            </p>
          </Section>

          <Section title="6. Refund Processing">
            <p>
              Approved refunds will be processed to your original payment method (UPI, credit/debit card,
              net banking, etc.) through Razorpay. Processing typically takes:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li><strong className="text-foreground">UPI / Wallets</strong> — 1–3 business days</li>
              <li><strong className="text-foreground">Debit / Credit cards</strong> — 5–7 business days</li>
              <li><strong className="text-foreground">Net Banking</strong> — 5–7 business days</li>
            </ul>
            <p className="mt-3">
              Refund timelines are subject to your bank or payment provider's processing times, which are
              outside our control.
            </p>
          </Section>

          <Section title="7. Subscription / Membership Plans">
            <p>
              If we offer subscription-based access in the future, specific cancellation and pro-rata
              refund terms will be outlined at the time of purchase and will supersede the general policy
              in this document for those products.
            </p>
          </Section>

          <Section title="8. Chargebacks">
            <p>
              We strongly encourage you to contact us before initiating a chargeback with your bank.
              Initiating a chargeback without first contacting us may result in suspension of your account
              and loss of access to all purchased content while the dispute is pending.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We reserve the right to modify this Refund Policy at any time. Changes will be effective
              upon posting to the Platform with an updated effective date. Your continued use of the
              Platform after changes are posted constitutes acceptance of the revised policy.
            </p>
          </Section>

          <Section title="10. Contact Us">
            <p>For any questions about this Refund Policy:</p>
            <address className="mt-3 not-italic space-y-1">
              <p><strong className="text-foreground">{COMPANY_NAME}</strong></p>
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
