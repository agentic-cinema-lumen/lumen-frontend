# Lumen architecture — high-level

```text
                         OFFLINE / INTERNAL (not shown to producers)

  IMDb + film metadata + derived craft features
                    |
                    v
       Agentic model-training loop on Google Cloud
       (feature engineering -> model tournament ->
        cross-validation -> champion model artifact)
                    |
                    v
       Versioned hit/miss model + evaluation diagnostics
                    |
                    +------------------------------+
                                                   |
                                                   v
PRODUCER UI                                      Cloud Run API
  story text                                      /v1/predictions
  images / frames  ---- HTTPS JSON + signed URIs ----+
  classifications                                  |
  medium + geography                               v
                                      Gemini agent orchestrator
                                                   |
                         +-------------------------+-------------------------+
                         |                         |                         |
                         v                         v                         v
                 Story agent              Audience agent              Visual agent
                 script / premise         segments / affinity         frames / campaign
                         |                         |                         |
                         +-------------------------+-------------------------+
                                                   |
                                                   v
                                           Market agent
                                                   |
                                                   v
                                  Parallel Search API (live evidence)
                                  comparables / demand / audience / timing
                                                   |
                                                   v
                                         Evidence + claims
                                                   |
                                                   v
                         Active hit/miss model inference + agent synthesis
                                                   |
                                                   v
             outcome: hit | miss | inconclusive + score + confidence + why

INTERNAL DIAGNOSTICS (separate access) ------------+
  GET /v1/diagnostics/model
  trainer status, active model version, last run, feature count, metrics
```

## How `agentic-cinema-hack` maps into Lumen

| Existing project | Lumen role |
| --- | --- |
| `src/ingestion/script_parser.py` | Parse uploaded scripts into story features |
| `src/ingestion/extract_keyframes.py` | Extract frames when a video/trailer is uploaded |
| `src/vision/concept_inspector.py` | Visual agent / Gemini multimodal inspection |
| `src/search/parallel_search_client.py` | Market agent’s Parallel Search tool |
| `src/quant/agentic_trainer.py` | Offline agentic model-training pipeline |
| `src/quant/quant_agent.py` | Model tournament and champion selection |
| `src/quant/oracle.py` | Low-latency inference tool used by agents |
| `src/premortem/premortem_agent.py` | Lead investigator / synthesis behavior |
| `data/models/champion_model.joblib` | Prototype model artifact; move to a versioned Cloud Storage/Vertex registry artifact |
| Investigation Board in `README.md` | Runtime case file containing hypotheses, claims, sources, and agent outputs |

## Important integration gap

The existing `QuantOracle` returns expected rating, residual delta, craft verdict, vulnerabilities, and feature attributions. Lumen’s API returns `hit`, `miss`, or `inconclusive`. The backend should add a calibrated outcome layer that maps the model score and uncertainty to that contract, or retrain the champion model directly on a defined commercial-success target. Do not label an IMDb rating as a hit probability without calibration and an agreed target definition.
