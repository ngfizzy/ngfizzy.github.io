/* Generated from the public skills repository's SKILL.md files. */
window.PUBLIC_SKILLS = [
  {
    name: 'better-docs',
    title: 'Better Docs',
    description: 'Write, rewrite, review, or explain technical documentation with direct, precise, runtime-grounded language.',
    source: 'https://github.com/ngfizzy/skills/tree/main/skills/better-docs',
    readme: `# Better Docs

Make technical writing easy to parse without weakening its meaning.

## Output mode

Respond inline when the user asks to explain, clarify, or rewrite text. Create or edit a document only when they explicitly request a file, note, knowledge-base entry, or documentation update.

Use \`document-runtime\` for a durable runtime explainer, deep dive, or walkthrough. Do not invoke it merely because the user asks for clearer prose.

## Voice

- Lead with the real problem, decision, or observed behavior.
- Use concrete subjects and active claims. Name the owning boundary and what stays unchanged.
- Keep code identifiers, field names, state names, API values, and technical terms when they carry contract meaning.
- Separate facts, decisions, assumptions, risks, validation, and open questions.
- Prefer short paragraphs, tables for contracts or state, numbered steps for flows, and bullets for requirements or risks.

Avoid vague labels such as “handling,” “support,” or “integration” unless the text defines the exact behavior. Do not replace precise terms with friendlier but incorrect language.

## Editing discipline

Simplify syntax, not semantics. Before changing text, classify the problem:

- **unclear:** actor, behavior, owner, or consequence is missing
- **ambiguous:** multiple technical readings are possible
- **overcompressed:** concise wording hides runtime meaning
- **verbose:** wording repeats or cushions meaning
- **precise enough:** technical but accurate and scannable
- **meaning at risk:** further simplification would remove a necessary distinction

When rewriting, identify the real subject and action, retain necessary terms, split dense qualifiers into a second sentence when useful, and state the consequence plainly.

## Technical tickets and handoffs

- Make the outcome, owner, scope, non-goals, and acceptance criteria explicit.
- Describe concrete change points only when they improve implementation clarity; do not turn a ticket into a full design document.
- Make acceptance criteria prove outcomes rather than repeat implementation bullets.
- Do not include private paths, agent workflow history, or irrelevant process notes in human-facing artifacts.

Before returning, review once for vague ownership, duplicated requirements, false certainty, and simplifications that damaged technical meaning.`
  },
  {
    name: 'cracked-debugging',
    title: 'Cracked Debugging',
    description: 'Diagnose unclear bugs by tracing normal and failing runtime paths to the earliest divergence and smallest viable fix point.',
    source: 'https://github.com/ngfizzy/skills/tree/main/skills/cracked-debugging',
    readme: `# Cracked Debugging

This is \`execution-path-tracing\` focused on causal diagnosis. Do not implement changes until the user asks after diagnosis.

## Grounding

- Read applicable repository guidance, runtime docs, and relevant contracts.
- Gather or infer the symptom, expected behavior, reproduction, entrypoint, fields/state, components, and available evidence.
- Ground claims in code paths, contracts, payloads, logs, or screenshots. Mark unknowns rather than guessing.
- Treat rendered state, documentation, labels, and queue names as non-authoritative until code or contracts prove otherwise.

## Workflow

1. Trace from the actual entrypoint one hop at a time, including requests, callbacks, events, queues, state updates, reads/writes, and renders.
2. For each hop record component, trigger, input/state, handler, effect/state change, and next handoff.
3. Trace relevant fields from authoring through transformation and consumption; classify each as authoritative, synchronized, cached, derived, or presentation-only.
4. Compare the normal and failing paths to identify the earliest divergence.
5. Classify the divergence: data, timing, state ownership, event wiring, policy/configuration, or an external boundary.
6. Identify the narrowest safe fix point and the adjacent layers that should remain unchanged.
7. State unknowns, evidence needed to resolve them, and the highest-value regression or manual checks after a fix.

## Output

Return a causal summary, numbered trace, authority map, normal-vs-failing comparison, earliest divergence, smallest viable fix point, unknowns, and suggested tests.`
  },
  {
    name: 'document-runtime',
    title: 'Document Runtime',
    description: 'Write documentation grounded in real execution paths, including runtime overviews, explainers, deep dives, and walkthroughs.',
    source: 'https://github.com/ngfizzy/skills/tree/main/skills/document-runtime',
    readme: `# Document Runtime

Trace first, document second. Use \`execution-path-tracing\` to establish the path and \`cracked-debugging\` when the goal is diagnosis rather than explanation.

## Grounding rules

- Read applicable repository guidance, target docs, contracts, and code before writing.
- Every important claim must come from a trace, contract, observed payload, or prior grounded investigation.
- Do not turn architectural intention into runtime fact. Mark unknowns explicitly.
- Distinguish authoritative state from synchronized, cached, derived, and presentation state.
- Write to the repository's established docs location, a user-provided path, or ask when the destination is material and unclear.

## Choose the narrowest useful form

- **Overview:** purpose, components, top-level path, boundaries, caveats.
- **Explainer:** behavior, main path, important modules, state/contracts, common variations.
- **Deep dive:** entrypoint, numbered trace, field flow, authority, branches, unknowns.
- **Walkthrough:** prerequisites, starting state, actions, observations, troubleshooting tied to real evidence.
- **Field note:** meaning, source of truth, transformations, consumers, common confusion.
- **Diagram-backed document:** use a Mermaid sequence, flow, or component diagram only when it clarifies the runtime.

## Workflow

1. Infer audience, question, depth, systems, fields/state, and target location.
2. Trace from the entrypoint or state origin, one hop at a time; record field flow, branches, and authority boundaries.
3. Extract the narrative spine and omit details that do not help that audience without breaking causality.
4. Use code references, tables, diagrams, and troubleshooting cues only when they improve understanding.
5. Verify the finished document against the traced path.

The result must clearly explain what happens, where it happens, which state is authoritative, which branches matter, what remains unknown, and how a reader can verify it.`
  },
  {
    name: 'execution-path-tracing',
    title: 'Execution Path Tracing',
    description: 'Trace real runtime paths across requests, webhooks, events, queues, callbacks, database reads and writes, and UI updates.',
    source: 'https://github.com/ngfizzy/skills/tree/main/skills/execution-path-tracing',
    readme: `# Execution Path Tracing

Use when causal runtime understanding matters more than a file-by-file summary.

## Rules

- Start from an actual entrypoint or authoritative state origin, then follow one real hop at a time.
- Ground claims in code, contracts, observed payloads, or runtime evidence. Mark unknowns explicitly.
- Track important values end to end: authoring, validation, persistence, transformation, fallback, and consumption.
- Separate authoritative state from synchronized, cached, derived, and presentation state.
- Keep external APIs, queues, event buses, databases, caches, UI stores, and permission boundaries explicit.

## Workflow

1. Identify the goal, entrypoint, expected outcome, components, fields, and available evidence.
2. Read applicable guidance and inspect the entrypoint, registrations, call sites, contracts, tests, and persistence boundaries.
3. Build a numbered trace. For every hop record trigger, input/state, handler, side effect/state change, error or fallback behavior, and next handoff.
4. Identify authority changes, branch conditions, retries, partial success, and externally visible effects.
5. Extract invariants and verify where they are enforced; flag risks such as swallowed failure, duplicate side effect, stale cache, or misleading UI state.
6. Shape the result for the task: diagnosis, feature scope, documentation, or validation plan.

## Output

Return the relevant trace, authority map, affected boundaries, important branches and invariants, unknowns, and concrete validation steps. Do not invent hidden writes, payloads, or transitions.`
  },
  {
    name: 'say-what',
    title: 'Say What',
    description: 'Re-explain something in plainer language when the first explanation did not land, while preserving its precise meaning.',
    source: 'https://github.com/ngfizzy/skills/tree/main/skills/say-what',
    readme: `# Say What

Your explanation already failed once. Fix the explanation, not the claim.

Use \`better-docs\` for the writing itself. This skill governs what to do
differently on a second attempt.

## Find what actually failed

Re-explaining everything is the usual mistake. Identify which part lost them:

- **Volume** — it was correct but too long. Cut it; do not rephrase it.
- **Vocabulary** — a term carried the meaning and was never defined. Define it
  where it appears.
- **Leap** — a step was assumed. Add the missing hop.
- **Framing** — the angle itself did not land. Change the angle. A second pass
  from the same angle fails the same way.

When you cannot tell which it was, ask which part rather than replaying all of
it.

## Rewriting

- Lead with the single claim that matters most, in one sentence, before
  anything else.
- Cut length before reaching for simpler words. Most confusion is volume.
- Keep terms that carry contract meaning — field names, state names, API
  values. Define them in place. Never swap a precise term for a friendlier one
  that is wrong.
- Reach for a concrete example or a comparison when the abstract version has
  already failed.
- Preserve hedges. What was uncertain stays uncertain; simplifying must not
  manufacture confidence.

## Do not

- Repeat the same explanation at greater length.
- Apologize, preamble, or announce that you are simplifying.
- Restate the original alongside the simpler version.
- Talk down. Simpler wording, same respect.

Stop when the point lands. If it still does not, change the framing again
rather than adding more.`
  }
];
