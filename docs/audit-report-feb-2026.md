# AIMS Security Audit & Integration Report — Feb 2026

## Executive Summary
This audit identified several critical security vulnerabilities and integration issues in the AIMS codebase as of February 15, 2026.

**High-Level Findings:**
- **Critical:** 2 (SSRF and Missing Auth in Sandbox Server)
- **High:** 1 (IDOR in LUC Meter)
- **Medium:** 3 (Missing Auth in New APIs, Race Condition in LUC Storage, Dependency Vulnerabilities)
- **Low:** 2 (Public GCS logos, Middleware IP spoofing potential)

**Integration Status:**
- **Kling AI:** FAILED (Direct API call, violates Gateway policy)
- **Remotion:** VERIFIED
- **LUC Storage Chain:** VERIFIED (with race condition warning)
- **Dashboard Routes:** VERIFIED (but missing Auth)
- **ACHEEVY Brain:** VERIFIED

## Security Findings

### Critical

#### 1. Unauthenticated Command Execution & SSRF in Sandbox Server
**File:** `backend/ii-agent/src/ii_sandbox_server/main.py`
**Description:** The `ii_sandbox_server` is a standalone FastAPI application that lacks any form of authentication or authorization. Furthermore, it contains multiple SSRF vectors.
- **Missing Auth:** Anyone who can reach the server (port 8100 by default) can call endpoints like `/sandboxes/run-cmd` to execute arbitrary commands within a sandbox.
- **SSRF in `upload_file_from_url`:** The endpoint `/sandboxes/upload-file-from-url` takes a URL and fetches it using `httpx.AsyncClient()`, allowing an attacker to probe internal services or cloud metadata endpoints (SSRF).
- **SSRF in `download_to_presigned_url`:** The endpoint `/sandboxes/download-to-presigned-url` allows an attacker to exfiltrate sandbox data to an arbitrary external URL via a PUT request.

#### 2. SSRF in GCS Storage Provider
**File:** `backend/ii-agent/src/ii_agent/storage/gcs.py`
**Description:** The `write_from_url` method in the GCS class uses `requests.get(url, stream=True)` without any URL validation or restriction.
- **Risk:** If this method is exposed through any user-controllable API, it can be used for SSRF to probe internal networks or exfiltrate data to GCS buckets.

### High

#### 1. Insecure Direct Object Reference (IDOR) in LUC Meter
**File:** `frontend/app/api/luc/meter/route.ts`
**Line:** 114
**Code:**
```typescript
const { searchParams } = new URL(req.url);
const userId = searchParams.get("userId") || session.user.email;
```
**Description:** The GET endpoint allows an authenticated user to view the usage quotas of *any* other user by simply providing their `userId` or `email` in the query string. The server uses this parameter directly without verifying if the authenticated user has permission to view that specific user's data.

### Medium

#### 1. Missing Authentication in New API Routes
**Files:** `frontend/app/api/sellers/route.ts`, `frontend/app/api/shopping/route.ts`
**Description:** These new API routes lack any session verification (`getServerSession`). While they currently return demo data, they are publicly accessible and allow anyone to trigger mock actions (e.g., `create-mission`).

#### 2. Race Condition in LUC Server Storage
**File:** `frontend/lib/luc/server-storage.ts`
**Description:** The `addUsageEntry` method reads the entire history file, modifies it in memory, and writes it back.
**Risk:** Under high concurrency (e.g., during `flushPendingEvents` with `Promise.all`), multiple requests may read the same initial state and overwrite each other's updates, leading to data loss in usage history.

#### 3. High Severity Dependency Vulnerabilities
**Files:** `frontend/package.json`
**Description:** `npm audit` identified a high-severity vulnerability in `next` (14.2.35).
- **Vulnerability:** Next.js self-hosted applications are vulnerable to DoS via Image Optimizer remotePatterns configuration and HTTP request deserialization.
- **Recommendation:** Upgrade to a patched version of Next.js.

### Low

#### 1. Public Exposure of Branding Logos
**File:** `backend/ii-agent/src/ii_agent/storage/gcs.py`
**Description:** The `upload_and_get_permanent_url` method explicitly calls `blob.make_public()`.
- **Risk:** While branding logos are often intended to be public, this behavior is hardcoded. If a user uploads a sensitive image as a "logo", it becomes publicly accessible to anyone who can guess or find the URL.

#### 2. Client IP Spoofing in Middleware
**File:** `frontend/middleware.ts`
**Line:** 113
**Description:** `getClientIP` trusts the first element of the `x-forwarded-for` header.
- **Risk:** If the application is not behind a trusted proxy that sanitizes this header, an attacker can spoof their IP to bypass rate limits by providing a fake `x-forwarded-for` header.

## Integration Findings

### Broken/Missing Integrations

#### 1. Kling AI Direct API Calls
**File:** `frontend/lib/kling-video.ts`
**Finding:** The `KlingVideoService` calls `https://api.klingai.com/v1` directly.
**Status:** **FAILED**.
**Violation:** Platform policy requires ALL external API calls to route through the UEF Gateway (Port Authority) for metering, logging, and security enforcement.

### Misconfigured Integrations
- **LUC Storage Concurrency:** The use of `Promise.all` in `flushPendingEvents` (`metering.ts`) combined with non-atomic file writes in `server-storage.ts` creates a race condition.

### Verified Working

#### 1. Remotion Registration
**File:** `frontend/remotion/Root.tsx`
**Status:** **VERIFIED**. All compositions are properly registered and exported.

#### 2. Dashboard Navigation
**File:** `frontend/components/DashboardNav.tsx`
**Status:** **VERIFIED**. "Garage to Global" and "Buy in Bulk" links are correctly added and point to the appropriate routes.

#### 3. ACHEEVY Brain Consistency
**File:** `aims-skills/ACHEEVY_BRAIN.md`
**Status:** **VERIFIED**. Referenced skills (e.g., `orchestrateTurn`, `app-factory/*`) and hooks (e.g., `onSimUserMessage`) have corresponding files in the `aims-skills/` directory.

## Recommendations

1. **IMMEDIATE:** Implement authentication for `ii_sandbox_server` and disable/sanitize SSRF-vulnerable endpoints (`upload_file_from_url`, `download_to_presigned_url`).
2. **HIGH:** Fix the IDOR in `frontend/app/api/luc/meter/route.ts` by ensuring users can only query their own data or data they own.
3. **HIGH:** Route Kling AI API calls through the UEF Gateway to comply with platform standards.
4. **MEDIUM:** Add session checks to `/api/sellers` and `/api/shopping`.
5. **MEDIUM:** Implement a write lock or atomic update mechanism for `server-storage.ts` to prevent usage history data loss.
6. **MEDIUM:** Upgrade `next` and other vulnerable dependencies identified by `npm audit`.

### Broken Build
- **File:** `frontend/app/dashboard/buy-in-bulk/page.tsx`
- **Error:** `'Settings' is not defined.  react/jsx-no-undef`
- **Status:** **FAILED**. The production build (`npm run build`) fails due to this reference error.
