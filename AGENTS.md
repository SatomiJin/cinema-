# Portable Codex Engineering Rules

This file contains repository-agnostic rules for model routing, RTK usage, and
Code Review Graph-assisted source investigation.

Copy it into another repository as `AGENTS.md`, then add that repository's own
commands and conventions separately.

## Required Greeting

Immediately after reading the project rules, say exactly:

`Xin chào tôi là Jin`

## Mandatory Model Routing

Before actionable work, use the `global-model-router` skill to decide whether
the request should remain one work item or be split into genuinely independent
items.

Do not split small tasks or sequentially dependent work merely to use multiple
models.

For each work item, report:

- the work item and expected outcome;
- the selected tier;
- the target model and reasoning level;
- whether execution is direct or delegated;
- a brief evidence-based routing reason.

Use this routing mapping:

| Tier | Agent profile | Model and reasoning | Use when |
| --- | --- | --- | --- |
| Routine | `model-router-routine` | `gpt-5.6-terra` / low | Explicit, low-risk, mechanically verifiable work |
| Standard | `model-router-standard` | `gpt-5.6-terra` / medium | Bounded implementation, diagnosis, or source investigation |
| Deep | `model-router-deep` | `gpt-5.6-sol` / high | Ambiguous, cross-system, security-sensitive, architectural, or high-impact work |

For one work item, use this receipt:

`[Route] item: <work item> | tier: <Routine|Standard|Deep> | target: <model / reasoning> | execution: <direct or delegated> | reason: <brief reason>`

For multiple work items, show an equivalent compact table before starting.

If the current surface cannot switch models or delegate, label the model as the
recommended target and state the model and execution path actually available.

Re-run routing when:

- scope changes materially;
- one implementation direction fails twice;
- evidence conflicts;
- work is about to make a production, irreversible, security-sensitive, or
  private-data change.

Routing never replaces authorization, approval, verification, or safety rules.

## Parallel Delegation

Delegate only when two or more work items are independent and can run
concurrently without unsafe interaction.

Every delegated task must define:

- bounded scope and expected outcome;
- required inputs and constraints;
- explicit completion criteria;
- evidence the worker must return;
- file or module ownership when code changes are involved.

Do not delegate tasks that:

- depend on one another;
- edit overlapping files;
- share unsafe mutable state;
- cost more to coordinate than to execute directly.

The coordinator remains responsible for integrating results, resolving
conflicts, and performing final verification.

Only report `execution: delegated` after the worker has been created
successfully.

## RTK Usage

Always prefer RTK for source reading, search, Git context, dependency inspection,
build output, and test output.

Prefix supported commands with `rtk`, including every command in a chain:

```bash
rtk git status
rtk git diff
rtk read path/to/file
rtk grep "pattern" .
rtk find "*.ts" .
rtk ls .
rtk deps
rtk tsc
rtk lint
rtk test <command>
```

For chained commands:

```bash
rtk git add . && rtk git commit -m "message" && rtk git push
```

Prefer:

- `rtk read <file>` for source and documentation;
- `rtk grep <pattern> <path>` for targeted text search;
- `rtk find <pattern> <path>` for file discovery;
- `rtk git status`, `rtk git diff`, and `rtk git log` for Git context;
- ecosystem-specific RTK wrappers for build and test output.

Use raw shell commands only when RTK is unavailable, incompatible with the
current shell, or full unfiltered output is required for correctness. State the
fallback reason briefly.

If RTK is installed but not found:

1. run `Get-Command rtk` on Windows or `command -v rtk` on POSIX;
2. confirm the install directory is in the user `PATH`;
3. restart the terminal or Codex session so it inherits the updated `PATH`;
4. verify with `rtk --version`.

Do not hard-code a machine-specific RTK installation path into repository
instructions.

## Code Review Graph Usage

When `code-review-graph` is available, use it as the first pass for:

- codebase understanding;
- architecture mapping;
- code review;
- debugging;
- change-impact analysis.

Preferred workflow:

1. Run `code-review-graph status` to check whether a graph exists and whether it
   is fresh.
2. If no graph exists and local cache writes are allowed, run
   `code-review-graph build`.
3. If the graph is stale and local cache writes are allowed, run
   `code-review-graph update --brief`.
4. For read-only impact analysis, run
   `code-review-graph detect-changes --brief`.
5. Use graph results to identify the smallest relevant files and symbols before
   reading source.

Do not treat a stale graph as authoritative. Confirm material conclusions
against current source.

If the CLI is unavailable:

- check whether it is installed but missing from `PATH`;
- try the known installation location only when the environment documents one;
- otherwise fall back to RTK-backed source investigation without blocking.

Do not build or update the graph when the user requested strictly read-only work
and the operation would create or modify a local graph cache.

## Source-Reading Efficiency

For non-trivial investigation:

1. Use Code Review Graph to narrow the change-impact surface.
2. Use RTK to read only the identified files, symbols, and relevant ranges.
3. Expand the reading scope only when current evidence is insufficient.
4. State why broader reading is needed before expanding substantially.

Avoid broad directory scans, whole-file dumps, and speculative reading of
adjacent code when targeted graph or RTK queries can answer the question.

