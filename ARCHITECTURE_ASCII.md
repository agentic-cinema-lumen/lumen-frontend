# Lumen architecture — high-level

## 1. Agentic ML training

```text
Historical film data + derived creative features
                       |
                       v
              Agentic training pipeline
  Feature engineering -> candidate training -> evaluation
            ^                                     |
            +---- agent-guided refinement --------+
                                                  |
                                                  v
                         Selected model version + feature schema
                                  + evaluation metrics
                                                  |
                      Used as the runtime inference tool below
```

The training agent guides feature engineering, model selection and evaluation. We train once today using this pipeline. Automated repeat training runs are planned for the future. Training does not run as part of a user prediction request.

## 2. Runtime recommendations

```text
Screenshots / frames / story text / project context
                         |
                         v
              Cloud Run prediction API
                         |
                         v
        Main Gemini agent extracts structured features
                         |
                         v
          Agent chooses tools and schedules calls
                         |
          +--------------+----------------+
          |              |                |
          v              v                v
  Trained ML tool   Comparison tool   Parallel Search API
  Fixed model      Comparable films  Live market and
  + valid features Feature differences audience evidence
          |              |                |
          +--------------+----------------+
                         |
                         v
          Main agent combines selected tool results
                         |
                         v
       Recommendations + reasons + evidence + uncertainty
```

These branches show available tools. The main agent selects the tools needed for each request and runs independent calls concurrently when their inputs are ready. Calls that need another tool's output wait for that result. Comparison findings, model predictions and research evidence inform the final recommendation.

Training and runtime tool selection are agentic. ML inference is deterministic for the same model version and validated input features. The agent's extraction, plan and explanation may vary. Parallel Search is a research service, distinct from the agent's decision to execute calls in parallel.

### Existing backend roles

| Component | Role |
| --- | --- |
| `src/quant/agentic_trainer.py` | Agentic training pipeline |
| `src/quant/quant_agent.py` | Candidate evaluation and champion selection |
| `data/models/champion_model.joblib` | Trained model artifact used for inference |
| `src/ingestion/script_parser.py` | Extract story features |
| `src/ingestion/extract_keyframes.py` | Extract frames from video inputs |
| `src/vision/concept_inspector.py` | Multimodal visual inspection |
| `src/quant/oracle.py` | Deterministic trained-model tool |
| `src/search/parallel_search_client.py` | Live comparison and market research |
| `src/premortem/premortem_agent.py` | Investigation and recommendation synthesis |

These are the backend roles documented in this project, not a claim that all integrations are deployed. The comparison tool is a logical runtime capability; its implementation boundary remains to be confirmed.

The oracle's expected rating and craft residuals need a calibrated outcome adapter before they can support commercial `hit`, `miss`, or `inconclusive` labels. See [the Mermaid architecture](ARCHITECTURE_MERMAID.md) for the same flow and [the API contract](API_CONTRACT.md) for integration details.
