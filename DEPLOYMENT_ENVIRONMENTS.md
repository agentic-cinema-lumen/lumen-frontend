# Frontend deployment environments

This branch is the real API client. `lib/lumen-api.ts` reads `NEXT_PUBLIC_API_URL`
and `NEXT_PUBLIC_LUMEN_API_KEY`, so both values must be supplied **at image build
time**. Next.js compiles `NEXT_PUBLIC_*` values into the browser bundle; setting
them only on the already-built Cloud Run revision has no effect.

The Cloud Build configuration passes the two values as Docker build arguments.
Set `_NEXT_PUBLIC_API_URL` and `_NEXT_PUBLIC_LUMEN_API_KEY` on the trigger (or
override them with `gcloud builds submit --substitutions=...`) and deploy this
branch as `lumen-real`.

The key is visible to browsers by design for this public-key API. Do not reuse
this configuration for a private credential. A private key should instead be
handled by a server-side proxy and Secret Manager.
