import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Sends a transactional email via the Bird (MessageBird) API.
 *
 * Server-only: the BIRD_API_KEY env var is never exposed to the browser.
 */
export const sendEmail = createServerFn({ method: "POST" })
  .inputValidator((data: { to: string | string[]; subject: string; html: string; from?: string }) =>
    z
      .object({
        to: z.union([z.string().email(), z.array(z.string().email()).min(1)]),
        subject: z.string().min(1).max(500),
        html: z.string().min(1),
        from: z.string().email().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.BIRD_API_KEY;
    if (!apiKey) {
      throw new Error(
        "BIRD_API_KEY is not set. Add it to your .env file (see README for instructions).",
      );
    }

    const { BirdClient } = await import("@messagebird/sdk");
    const bird = new BirdClient({ apiKey });

    const recipients = Array.isArray(data.to) ? data.to : [data.to];

    await bird.email.send({
      from: data.from ?? "onboarding@messagebird.dev",
      to: recipients,
      subject: data.subject,
      html: data.html,
    });

    return { ok: true };
  });
