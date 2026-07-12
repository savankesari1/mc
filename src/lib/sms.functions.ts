import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BIRD_SMS_URL = "https://eu1.platform.bird.com/v1/sms/messages";

/**
 * Sends a one-time passcode SMS via the Bird API using the
 * "bird_otp_verification_ttl" template.
 *
 * Server-only: BIRD_API_KEY is never exposed to the browser.
 *
 * @example
 * await sendSmsOtp({ data: { to: "+919876543210", code: "482931", ttl: "10 minutes" } });
 */
export const sendSmsOtp = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { to: string; code: string; ttl: number }) =>
      z
        .object({
          /** E.164 phone number, e.g. "+919876543210" */
          to: z.string().regex(/^\+[1-9]\d{6,14}$/, "Phone must be in E.164 format, e.g. +919876543210"),
          /** The numeric OTP code to embed in the message */
          code: z.string().min(4).max(10),
          /** Expiry in whole minutes shown in the SMS (integer 1–999, per Bird API) */
          ttl: z.number().int().min(1).max(999),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.BIRD_API_KEY;
    if (!apiKey || apiKey === "bk_xxxxxxxxx") {
      throw new Error(
        "BIRD_API_KEY is not configured. Replace 'bk_xxxxxxxxx' in your .env file with your real Bird API key from https://app.bird.com.",
      );
    }

    const res = await fetch(BIRD_SMS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: data.to,
        template: {
          name: "bird_otp_verification_ttl",
          parameters: {
            code: data.code,
            ttl: data.ttl,
          },
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Bird SMS API error (${res.status}): ${body.slice(0, 300)}`);
    }

    const json = (await res.json()) as { id?: string };
    return { ok: true, messageId: json.id };
  });
