import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

const EFFECTIVE_DATE = "July 20, 2025";
const CONTACT_EMAIL = "contact@payaleducation.in";
const COMPANY_NAME = "Payal Education Society Computers";
const OWNER = "Subhash";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Payal Education Society Computers" },
      {
        name: "description",
        content:
          "Terms of Service for Payal Education Society Computers — your rights and responsibilities when using our platform.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 pt-40 pb-32 min-h-screen">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Legal</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tighter">Terms of Service</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Effective date: <strong>{EFFECTIVE_DATE}</strong>
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-muted-foreground">

          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using{" "}
              <strong className="text-foreground">{COMPANY_NAME}</strong> (the "Platform"), you agree to
              be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use
              the Platform. These Terms apply to all visitors, registered users, and purchasers.
            </p>
            <p className="mt-3">
              These Terms constitute a legally binding agreement between you and {COMPANY_NAME}, operated
              by <strong className="text-foreground">{OWNER}</strong> under Payal Education Society.
            </p>
          </Section>

          <Section title="2. Eligibility">
            <p>
              You must be at least <strong className="text-foreground">13 years old</strong> to create an
              account. If you are under 18, you confirm that you have your parent's or guardian's permission
              to use the Platform and accept these Terms. By using the Platform, you represent that you
              meet these eligibility requirements.
            </p>
          </Section>

          <Section title="3. Account Registration">
            <ul className="list-disc pl-5 space-y-2">
              <li>You may register using your email address and a password, or via Google OAuth.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree to provide accurate, complete, and current information during registration.</li>
              <li>
                You must notify us immediately at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline underline-offset-4">
                  {CONTACT_EMAIL}
                </a>{" "}
                if you suspect unauthorized access to your account.
              </li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
            </ul>
          </Section>

          <Section title="4. Purchases and Digital Content">
            <p>
              Resources on the Platform (videos, PDFs, notes, assignments) are sold as digital goods.
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>
                <strong className="text-foreground">Payment</strong> — Payments are processed securely
                through Razorpay. All prices are listed in Indian Rupees (INR) and are inclusive of
                applicable taxes unless stated otherwise.
              </li>
              <li>
                <strong className="text-foreground">Access</strong> — Upon successful payment, you receive
                a personal, non-transferable, non-exclusive licence to access the purchased content for
                your own educational use.
              </li>
              <li>
                <strong className="text-foreground">No resale or redistribution</strong> — You may not
                resell, redistribute, share login credentials, copy, reproduce, or publicly display any
                purchased content without our prior written permission.
              </li>
              <li>
                <strong className="text-foreground">Personal use only</strong> — Purchased resources are
                for your individual study and may not be used for commercial purposes, classroom instruction
                to paying students, or any other non-personal use.
              </li>
            </ul>
          </Section>

          <Section title="5. Refunds">
            <p>
              Please review our{" "}
              <a href="/refund" className="text-foreground underline underline-offset-4">
                Refund Policy
              </a>{" "}
              for full details. In summary:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>Digital goods are generally non-refundable once accessed.</li>
              <li>Refund requests must be submitted within 7 days of purchase.</li>
              <li>Approved refunds will be processed to the original payment method within 7–10 business days.</li>
            </ul>
          </Section>

          <Section title="6. Acceptable Use">
            <p>You agree not to:</p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>Use the Platform for any unlawful purpose or in violation of any applicable laws.</li>
              <li>Attempt to gain unauthorized access to any part of the Platform or its systems.</li>
              <li>Upload or transmit viruses, malware, or any other harmful code.</li>
              <li>Scrape, crawl, or systematically extract data from the Platform without permission.</li>
              <li>Impersonate another person or entity.</li>
              <li>Harass, abuse, or harm other users.</li>
              <li>Use automated tools, bots, or scripts to interact with the Platform.</li>
              <li>Attempt to reverse-engineer, decompile, or disassemble any part of the Platform.</li>
            </ul>
            <p className="mt-3">
              Violation of these rules may result in immediate account termination without refund.
            </p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>
              All content on the Platform — including but not limited to course materials, PDFs, videos,
              images, graphics, and source code — is the property of {COMPANY_NAME} or its licensors
              and is protected under applicable intellectual property laws.
            </p>
            <p className="mt-3">
              Nothing in these Terms grants you any ownership of Platform content. Your licence to use
              purchased resources ends if your account is terminated or if you violate these Terms.
            </p>
          </Section>

          <Section title="8. Third-Party Services">
            <p>
              The Platform integrates with third-party services including Supabase (database &
              authentication), Razorpay (payments), and Google (OAuth sign-in). Your use of these services
              is subject to their respective terms and privacy policies. We are not responsible for the
              conduct or content of third-party services.
            </p>
          </Section>

          <Section title="9. Disclaimers">
            <p>
              The Platform is provided on an{" "}
              <strong className="text-foreground">"as is" and "as available"</strong> basis. We make no
              warranties, express or implied, including but not limited to warranties of merchantability,
              fitness for a particular purpose, or non-infringement.
            </p>
            <p className="mt-3">
              We do not guarantee that the Platform will be error-free, uninterrupted, or free of viruses
              or other harmful components. Educational content is provided for informational purposes and
              does not constitute professional advice.
            </p>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>
              To the fullest extent permitted by applicable law, {COMPANY_NAME} and its owner,{" "}
              {OWNER}, shall not be liable for any indirect, incidental, special, consequential, or
              punitive damages, including but not limited to loss of profits, data, or goodwill, arising
              from your use of or inability to use the Platform.
            </p>
            <p className="mt-3">
              Our total liability to you for any claim arising from or relating to these Terms shall not
              exceed the amount you paid us in the 3 months preceding the event giving rise to the claim.
            </p>
          </Section>

          <Section title="11. Indemnification">
            <p>
              You agree to indemnify, defend, and hold harmless {COMPANY_NAME}, its owner, affiliates,
              and service providers from any claims, losses, damages, liabilities, costs, and expenses
              (including legal fees) arising from your use of the Platform, violation of these Terms, or
              infringement of any third-party rights.
            </p>
          </Section>

          <Section title="12. Modifications to the Platform and Terms">
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the Platform at any time
              without notice. We also reserve the right to update these Terms. Material changes will be
              communicated via email or a prominent notice on the Platform. Continued use after changes
              are posted constitutes acceptance of the updated Terms.
            </p>
          </Section>

          <Section title="13. Governing Law and Dispute Resolution">
            <p>
              These Terms are governed by and construed in accordance with the laws of{" "}
              <strong className="text-foreground">India</strong>, without regard to its conflict-of-law
              provisions. Any disputes arising from these Terms shall be subject to the exclusive
              jurisdiction of the courts located in India.
            </p>
            <p className="mt-3">
              Before initiating any legal proceedings, you agree to first attempt to resolve disputes
              informally by contacting us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              . We will make good-faith efforts to resolve any issue within 30 days.
            </p>
          </Section>

          <Section title="14. Termination">
            <p>
              We may suspend or terminate your account at any time, with or without notice, for conduct
              that violates these Terms or is otherwise harmful to the Platform, other users, or third
              parties. Upon termination, your licence to access purchased content will end. Provisions
              that by their nature should survive termination (including Intellectual Property, Disclaimers,
              Limitation of Liability, and Governing Law) shall survive.
            </p>
          </Section>

          <Section title="15. Contact Us">
            <p>If you have questions about these Terms, please contact us:</p>
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
