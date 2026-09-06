# Lumen Google Cloud deployment notes

Last updated: 2026-09-06

## Current Google resources

- Project ID: `project-780f8622-4868-45c8-ad6`
- Project name: `Lumen Cinema`
- Project number: `480750414136`
- Billing account: `016844-C8492F-E92DC2`
- Region: `europe-north1`
- Artifact Registry repository: `lumen-images`
- Cloud Run service: `lumen`
- Build identity: `lumen-build@project-780f8622-4868-45c8-ad6.iam.gserviceaccount.com`
- Runtime identity: `lumen-runtime@project-780f8622-4868-45c8-ad6.iam.gserviceaccount.com`
- Local Google CLI configuration: `.gcloud/` (ignored by Git)
- Local Google CLI installation: `.tools/google-cloud-sdk/` (ignored by Git)

## Pipeline

`cloudbuild.yaml` builds the repository's `Dockerfile`, pushes a private image to Artifact Registry, and deploys it to Cloud Run. The first pipeline run built and pushed the image successfully; its deploy-step placeholder was fixed afterward. The same image was then deployed manually to confirm the Google-hosted runtime.

- Live Cloud Run URL: `https://lumen-480750414136.europe-north1.run.app`
- Active revision: `lumen-00001-tt7`
- Health check: HTTP 200

The trigger is active: GitHub push or merge to `okay-lets-go-org/frontend` branch `main` → Google Cloud Build → Artifact Registry → Cloud Run. Build status and its Google Cloud log link are reported to GitHub.

- Cloud Build connection: `lumen-github` (complete)
- Linked repository: `okay-lets-go-org/frontend`
- Trigger: `lumen-main-deploy`
- Branch pattern: `^main$`
- Build identity: `lumen-build@project-780f8622-4868-45c8-ad6.iam.gserviceaccount.com`

The verification trigger reached GitHub successfully but stopped because the repository's current `main` branch does not yet contain `cloudbuild.yaml`. Push the current workspace, including `Dockerfile`, `.dockerignore`, and `cloudbuild.yaml`, before rerunning the trigger.

## Access and security

- The build and runtime use separate service accounts.
- The runtime service account has no build/deploy permissions.
- The build service account can write images, deploy Cloud Run, write build logs, and act only as the Lumen runtime identity.
- Local credentials, environment files, build output, and tooling are excluded from uploads and Git.
- User sign-up/sign-in is parked until a backend API and authorization model exist.

## Cost controls requested

- Email recipient: `geoaxis@gmail.com`
- Alert when actual monthly project spend reaches `$20`.
- At `$100`, notify and best-effort pause automated build activity by disabling triggers and cancelling active builds. This cannot guarantee a hard spending cap because billing data is delayed and already-running or unrelated services can continue generating charges.

Budget notification setup is still pending.
