# Lumen Google Cloud lifecycle

Configured on 6 September 2026 for project `project-780f8622-4868-45c8-ad6` (`Lumen Cinema`).

- Project labels: `app=lumen`, `managed-by=codex`, `lifecycle=ephemeral`, `expires-on=2026-11-25`, `owner=geoaxis`.
- Reminder: 5 November 2026 at 09:00 Europe/Stockholm (day 60).
- Reminder recipient: `geoaxis@gmail.com`, through Cloud Monitoring email channel `2276827002292839764`.
- Destruction: 25 November 2026 at 09:00 Europe/Stockholm (day 80).
- Scheduler region: `europe-west1`.
- Service account: `lumen-lifecycle@project-780f8622-4868-45c8-ad6.iam.gserviceaccount.com`.
- The service account has only Logs Writer and Project Deleter roles.

The reminder Scheduler job writes a unique lifecycle log entry. A log-based Monitoring alert emails the configured channel. The deletion job calls the Google Cloud Resource Manager `projects.delete` API. This marks the whole project for deletion, covering Cloud Run, builds, Artifact Registry, Scheduler, IAM service accounts, logs, and other project resources.

## Cancel before deletion

```bash
export CLOUDSDK_CONFIG="$PWD/.gcloud"
GCLOUD="$PWD/.tools/google-cloud-sdk/bin/gcloud"

"$GCLOUD" scheduler jobs pause lumen-self-destruct \
  --project=project-780f8622-4868-45c8-ad6 \
  --location=europe-west1
```

To cancel both jobs permanently:

```bash
"$GCLOUD" scheduler jobs delete lumen-self-destruct \
  --project=project-780f8622-4868-45c8-ad6 \
  --location=europe-west1 --quiet

"$GCLOUD" scheduler jobs delete lumen-expiry-reminder \
  --project=project-780f8622-4868-45c8-ad6 \
  --location=europe-west1 --quiet
```

After the deletion request, Google Cloud generally provides a limited recovery period. Restore while recovery remains available with:

```bash
"$GCLOUD" projects undelete project-780f8622-4868-45c8-ad6
```
