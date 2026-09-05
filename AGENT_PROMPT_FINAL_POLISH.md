This is close to done — no more broad rewrites needed. This is a short, final
polishing pass to close the last few loose ends before this doc is treated as
production sign-off evidence. Don't touch anything else; don't re-verify items
already marked 🟢 with strong evidence (1.1, 1.4, 1.9, 2.4).

---

## 1. Prove the GIN index is actually used (2.1)

The `V21` migration creating GIN indexes on `partner_preferences` and
`interests` is in place, but there's no evidence yet that Postgres actually
uses the index for a real containment query.

Do this:
1. Run the migration against a real (or realistic seeded) database.
2. Run: `EXPLAIN ANALYZE SELECT * FROM profiles WHERE partner_preferences @> '{"educationLevel": "BACHELORS"}';`
3. Paste the actual `EXPLAIN ANALYZE` output into the doc's 2.1 section.
   Confirm the plan shows `Bitmap Index Scan` (or similar) on
   `idx_profiles_partner_preferences_gin`, not a `Seq Scan`.
4. If it shows a Seq Scan (common on small tables — Postgres sometimes skips
   the index if the table is tiny), note that explicitly and explain it's
   expected to switch to the index scan at production data volume — don't
   claim it's "verified" if the plan doesn't actually show index usage.

## 2. Confirm the named tests actually exist and pass

Several items now cite specific test methods
(`EncryptionServiceTest.testFailFastOnWeakOrMissingKey`,
`EncryptionServiceTest.testEncryptAndDecryptString`,
`CursorPaginationTest.testCursorPaginationFirstPage`,
`CursorPaginationTest.testCursorPaginationLastPage`).

Do this:
1. Run `mvnw test` and paste the actual test output/summary (pass/fail count)
   into a new short "Test Execution Log" subsection at the bottom of the doc,
   showing these four tests specifically passing — not just a general "tests
   passed" claim.
2. If any of them don't currently exist or don't pass, say so plainly and fix
   them (or mark the relevant item back down to 🟡 until they do) — don't
   leave a citation to a test that isn't real.

## 3. Note the GDPR/erasure exception to the audit log trigger (1.9)

The Postgres trigger in `V20` blocks ALL updates/deletes on `audit_logs`,
including legitimate cases like a data-subject erasure request that requires
removing PII from old log entries.

Do this:
1. Add a short note to the 1.9 section acknowledging this tradeoff explicitly:
   the trigger is intentionally strict, and any future legitimate need to
   modify audit rows (e.g. GDPR/erasure compliance) will require a manual,
   logged, superuser-executed `DROP TRIGGER` / fix / `CREATE TRIGGER` cycle
   rather than a normal application code path.
2. No code change required — just make sure this isn't a silent gap someone
   discovers during a future compliance request.

## 4. Downgrade "code inspection only" items to reflect real rigor

Items 1.5, 1.6, 1.10, 2.6, 2.7, 2.8 are marked 🟢 but their verification
method is still "code inspection" rather than a test or runtime check.

Do this:
1. For each of these six items, either add one real automated test or a
   documented manual verification step (e.g. an actual curl request showing
   the rate limiter returning 429, an actual JSON response confirming
   `fcmToken` is absent), OR
2. If you don't have time to add tests for all six right now, that's fine —
   just change their status label to be honest about the rigor level, e.g.
   🟢 (code-verified) vs 🟢 (test-verified), so anyone reading the doc later
   can tell which claims have automated proof behind them and which don't.

---

## Final output

Update the doc with these four items only. Keep everything else exactly as
is — this document is now close to final and shouldn't be substantially
rewritten again. When done, add one line at the very top confirming this is
the final reviewed version with today's date.
