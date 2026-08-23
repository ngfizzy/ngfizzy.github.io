---
title: "Friday Checkout: Say What?"
date: 2026-08-14
description: "A small pair of skills for making verbose AI output easier to understand without flattening the vocabulary."
---

I have missed the last two Friday Checkouts. The past couple of weeks have been full: onboarding a new teammate, keeping up with multiple streams of work, and a busy stretch in my personal life. It has felt like juggling twenty balls at once.

But we are back.

Today, I want to share a small solution to a problem I mentioned in my last Monday Check-in: AI verbosity.

AI can be useful. It can also be exhausting.

Sometimes an agent gives you a 1,500-word essay when the real answer is:

> “I would refactor this class into two: one publishes and the other subscribes.”

You could ignore the long explanations. But one time out of ten, there is something important buried inside them. So you read everything. Every single time.

That is the cognitive overload I am talking about.

So I use two small skills:

1. [better-docs](https://github.com/ngfizzy/skills/blob/main/skills/better-docs/SKILL.md) rewrites jargon-heavy technical docs writing into language I can follow without losing the important meaning.
2. [say-what?](https://github.com/ngfizzy/skills/blob/main/skills/say-what/SKILL.md) lets me ask the agent to explain what it just said, inline, using the rules from better-docs.

For example, I gave an agent a very dense explanation of moving from polling to WebSockets: persistent connections, event channels, retries, backpressure, snapshots, ordered deltas, deduplication, and recovery.

Then I asked:

`/say-what?`

Here is what I got back:

> WebSockets let the server tell the app about changes immediately, instead of the app repeatedly asking for updates. Think of polling like checking your mailbox every ten seconds; WebSockets are like keeping a phone call open so the server can speak as soon as something happens. A safe migration keeps polling temporarily as a fallback, handles reconnects and missed updates, and uses event IDs so the client can recover safely. WebSockets are fast, but they do not guarantee that every update arrives exactly once.

Same idea.

Far less effort to understand.

You might ask: why not put this in a personality prompt or an `AGENTS.md` file?

Two reasons.

First, agents are discovery tools for me as much as they are execution tools. I still want to encounter unfamiliar technical terms and learn what they mean. I do not want every response flattened before I have a chance to see the real vocabulary.

Second, turning a useful prompt into a skill makes it easier to evolve, reuse, and carry across projects and machines. `AGENTS.md` files are usually project- or machine-specific. Skills can become more portable.

If this is useful to you, the repository includes installation scripts. You can also just copy the instructions directly. It is MIT-licensed.

Over the coming weeks and months, more of my private skills will follow the same path: start close to the work, prove themselves through real use, then gradually shed project-specific details until the reusable parts are ready for the skills repository.

That is Friday Checkout. Enjoy your weekend
