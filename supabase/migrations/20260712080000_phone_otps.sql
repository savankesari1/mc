-- phone_otps: stores short-lived OTP challenges for Bird SMS phone auth.
-- One row per phone number; upsert on each new request, expire after 10 min.

create table if not exists public.phone_otps (
  phone        text primary key,
  otp_hash     text        not null,          -- sha-256 hex of the 6-digit code
  expires_at   timestamptz not null,
  created_at   timestamptz not null default now()
);

-- Only the service role (server) may read/write this table.
alter table public.phone_otps enable row level security;
-- No client-side access at all — all operations go through server functions.
