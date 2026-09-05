Your last audit was accurate and honest — keep that same standard. Now close out
every remaining 🔴 and 🟡 item for real, then update
SRIMATCH_IMPROVEMENTS_AND_RECOMMENDATIONS.md to reflect the true final state.
Do not mark anything 🟢 unless you can show the actual working code/config and
a real verification step (test, migration run, or manual reproduction) — not
just "compiles."

Work through these in order. Each has a required fix and a required doc update.

---

## PRIORITY 1 — Security-critical, fix before anything else

### A. Remove the insecure default AES key fallback (blocks 1.1 and 1.4)
Currently:
```java
@Value("${app.security.verification.key:srimatch-secret-v-key-32chars-!!}")
private String secretKey;
```
This silently falls back to a hardcoded key — now published in a markdown file —
if the environment variable isn't set. This defeats the encryption entirely.

Fix required:
1. Remove the default value from the `@Value` annotation so there is NO fallback.
2. Add a `@PostConstruct` check in `EncryptionService` that throws a fatal
   startup exception if `app.security.verification.key` is null, blank, or
   under 32 characters — the app must refuse to start rather than run with a
   weak/missing key.
3. Confirm `application-prod.properties` sources this value from an environment
   variable (e.g. `${APP_ENCRYPTION_KEY}`), and confirm it is NOT committed
   anywhere in the repo (check `.env.example` only has a placeholder, real
   value lives in deployment secrets/CI vars).
4. Update the doc's 1.1 and 1.4 sections: show the new fail-fast code, confirm
   where the real production key is actually injected from (name the specific
   mechanism — Docker secret, environment variable, AWS Secrets Manager, etc.),
   and mark 🟢 only once you've shown the app actually fails to start without
   the key (paste the startup error or describe the test).

### B. Add audit logging to ID/selfie document viewing (gap in 1.4)
Currently `UserVerificationService.getDecryptedFile()` has no
`AuditLogService.log(...)` call, so admin access to sensitive ID/selfie images
is completely untracked.

Fix required:
1. Add an audit log entry every time `getDecryptedFile()` is called, recording:
   admin user ID/email, target user ID, which document (front/back/selfie),
   timestamp, and IP address of the request.
2. This must be a REAL structured audit log row (via `AuditLogService`/
   `AuditLog` entity), not just a `log.info()` line — it needs to be queryable
   later for compliance review.
3. Update the doc's 1.4 section: paste the new logging call, and change the
   "Audit Logging Note" from "not yet present" to confirmed present, with the
   exact `AuditLog` action type/enum value used (e.g. `VERIFICATION_DOC_VIEWED`).

### C. Add DB-level GRANT restriction for audit log immutability (finishes 1.9)
`@Immutable` only stops Hibernate from issuing UPDATE/DELETE — it does nothing
against raw SQL, other tools, or a compromised DB credential.

Fix required:
1. Create a new Flyway migration (e.g. `V20__Audit_Log_Immutability_Grants.sql`)
   containing the actual `REVOKE UPDATE, DELETE ON audit_logs FROM <app_db_role>;`
   statement, using the real production DB role name from
   `application-prod.properties` / `docker-compose.yml`.
2. If the app connects as a superuser/owner role in some environments (which
   would make REVOKE ineffective), flag this explicitly and recommend creating
   a separate least-privilege application role — don't silently skip it.
3. Update the doc's 1.9 section to 🟢 only if the migration file actually exists
   and you've confirmed (or clearly stated as a manual DBA step, if the
   deployment doesn't support automated role management) that the revoke is
   applied.

---

## PRIORITY 2 — Complete the two items marked NOT DONE / documented-only

### D. Implement real cursor/keyset pagination for discovery feed (2.4)
Currently OFFSET-based via Spring Data `Pageable`. Implement properly:

1. Add a custom repository method using native/JPQL query with
   `WHERE (compatibility_score, id) < (:lastScore, :lastId)
   ORDER BY compatibility_score DESC, id DESC LIMIT :size` (or the equivalent
   Criteria/Specification-based construction if native SQL isn't feasible).
2. Create a `CursorPageResponse<T>` DTO with `items`, `nextCursor` (Base64-
   encoded `lastScore_lastId`), and `hasMore`.
3. Update `DiscoveryService` and its controller endpoint to accept an optional
   `cursor` query param instead of (or alongside, for backward compatibility)
   `page`/`size`.
4. Write one test or manual `curl` walkthrough showing: fetch page 1, take
   `nextCursor`, fetch page 2, confirm no overlapping/duplicate results and
   confirm the query plan doesn't use OFFSET (paste `EXPLAIN` output).
5. Update the doc's 2.4 section to 🟢 with the real query, DTO, and test evidence.
   If full replacement of the existing paginated endpoint is too risky to do
   now, that's fine — but say so explicitly and mark it 🟡 with a concrete
   remaining step, not 🔴 with no plan.

### E. Wire up read replica routing, or explicitly deprioritize it (2.5)
Two acceptable outcomes here — pick one and document it honestly:

- **Option 1 (implement):** Add a second datasource config pointing at a
  replica connection string, implement `AbstractRoutingDataSource` keyed off
  `@Transactional(readOnly = true)`, and route `DiscoveryService`/search/
  reporting queries through it. Confirm with a test that read-only transactions
  hit the replica connection pool (check via connection pool name/logs).
- **Option 2 (defer):** If there's no actual replica database provisioned yet
  in your infrastructure (common at this stage), state that plainly in the doc,
  keep it 🟡, and give a one-paragraph explanation of what's blocking it
  (e.g. "no replica instance provisioned in current environment — requires
  infra change, not just code") so it's clear this isn't being avoided, just
  correctly sequenced.

---

## PRIORITY 3 — Decisions to make explicit (no code required, just a decision + doc update)

### F. Malware/antivirus scanning (1.7)
Currently explicitly skipped due to external daemon requirement. Make an
explicit decision and document it:
- Either integrate a lightweight option (e.g. ClamAV via a Docker sidecar
  container, or a cloud API like VirusTotal for file hash lookups) if
  feasible within current infra, OR
- If genuinely out of scope for now, state that as an accepted risk with a
  named owner and a "revisit by [approximate milestone]" note — don't leave
  it as an open unresolved gap with no decision attached.

### G. JSONB + GIN index migration (2.1)
You already wrote the exact `V20` migration SQL needed in the last doc pass.
Either:
- Actually create and run that migration now (rename appropriately if it
  conflicts with the V20 used in item C above — use the next free version
  number), confirm existing JSON string data in `partner_preferences`,
  `interests`, etc. casts cleanly to JSONB with `::jsonb` (test against a
  copy of real/seed data, since malformed JSON strings will break the cast),
  and update queries in `MatchingService`/`DiscoveryService` that currently
  do in-app JSON parsing to use JSONB containment queries instead where it
  meaningfully helps performance. OR
- If this is being intentionally deferred, say so with a reason (e.g.
  "deferred to avoid a breaking migration on the existing JSON string data
  until a data-cleaning pass is done first") rather than leaving it ambiguous.

---

## Required final doc update

After completing the above, update
`SRIMATCH_IMPROVEONS_AND_RECOMMENDATIONS.md` (fix filename typo if present)
with:

1. A refreshed Executive Implementation Status Overview table with accurate
   counts (🟢 / 🟡 / 🔴) across all sections.
2. Each touched item (1.1, 1.4, 1.9, 1.7, 2.1, 2.4, 2.5) updated in place with
   new file references, code/SQL snippets, and verification method — following
   the exact same format as the rest of the document.
3. A new top-level "Outstanding Items" section at the end of the doc listing
   anything still not 🟢, with a one-line reason and owner/next-step for each
   — there should be zero items left with no explanation.

Do not soften, reword, or upgrade a status to look better than the underlying
code. If something can't be fully verified in this pass, say exactly what
fraction is done and what's left, same as your last update. Honesty and
precision matter more than a clean-looking checklist.
