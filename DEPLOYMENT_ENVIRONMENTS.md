# Frontend deployment environments

This branch is the real API client. `lib/lumen-api.ts` reads `NEXT_PUBLIC_API_URL`
and `NEXT_PUBLIC_LUMEN_API_KEY`, so both values must be supplied **at image build
time**. Next.js compiles `NEXT_PUBLIC_*` values into the browser bundle; setting
them only on the already-built Cloud Run revision has no effect.

The Cloud Build configuration passes the URL as a Docker build argument and
reads the API key from Secret Manager secret `lumen-api-key`. Grant the Cloud
Build service account access once:

```bash
gcloud secrets add-iam-policy-binding lumen-api-key \
  --member="serviceAccount:$(gcloud projects describe "$GOOGLE_CLOUD_PROJECT" --format='value(projectNumber)')@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

Then deploy this branch as `lumen-real`. No key is stored in Git or in trigger
substitutions.

For a mock deployment, use `cloudbuild.mock.yaml`. It deploys `lumen-mock`,
builds with `NEXT_PUBLIC_LUMEN_MODE=mock`, and does not read the production
secret. Mock mode uses the built-in deterministic stream simulator and does not
call the API.

The key is visible to browsers by design for this public-key API. Do not reuse
this configuration for a private credential. A private key should instead be
handled by a server-side proxy and Secret Manager.
