# A.I.M.S. Project Structure

```text
/
├── frontend/                  # Next.js 14 App (User Surface)
│   ├── app/
│   │   ├── api/acp/route.ts   # Proxy route to UEF
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Acheevy Chat Interface
│   ├── components/
│   │   └── AcheevyChat.tsx    # Chat UI Component
│   └── lib/
│       ├── acp-client.ts      # Frontend ACP Client
│       └── luc/
│           ├── luc.stub.ts    # Deterministic stubs
│           └── luc-client.ts  # Real LUC quote fetcher
├── backend/
│   └── uef-gateway/           # Node/TS Middleware (UEF)
│       ├── src/
│       │   ├── acp/           # Protocol definitions & handlers
│       │   ├── ucp/           # Commerce & Quote logic
│       │   ├── luc/           # Locale Usage Calculator engine
│       │   ├── oracle/        # 7-Gate Verification Stubs
│       │   ├── byterover/     # Memory Stubs
│       │   ├── vl-jepa/       # Vision/Hallucination Stubs
│       │   ├── agents/        # Downstream agent clients
│       │   └── index.ts       # Server Entrypoint
├── mcp-tools/                 # MCP Tool Definitions (JSON/TS)
├── infra/                     # Infrastructure Config
│   ├── docker-compose.yml     # Service Orchestration
│   └── .env.example           # Environment Config
└── docs/                      # Documentation
    ├── AIMS_OVERVIEW.md
    ├── PROTOCOLS_ACP_UCP_MCP.md
    ├── ORACLE_CONCEPTUAL_FRAMEWORK.md
    └── LUC_INTEGRATION_GUIDE.md
```

## Top-Level Folders Extraction
- **frontend/**: The user-facing Next.js application where ACHEEVY lives.
- **backend/uef-gateway/**: The central nervous system (UEF) handling protocol translation (ACP), commerce (UCP), and logic.
- **mcp-tools/**: Definitions for Model Context Protocol tools.
- **infra/**: Docker and environment configuration.
- **docs/**: Architectural documentation.
