---
title: "Friday Checkout: Agent BS"
date: 2026-10-09
description: "Vague claims get expensive. Concrete explanations, fresh-context verification, and runtime evidence help expose confident fiction."
---

![Agent BS: Finally learning how to catch them before they eat my time. A man considers his laptop in a home office.](../../images/friday-checkout-agent-bs.png)

AI agents will confidently make false claims about how a system works.

We call that hallucination, although I sometimes feel like nobody talks about it anymore because we’ve all just accepted that it happens.

The expensive part is not the wrong sentence itself.

It is the hour of work and tokens you can burn chasing a dead end that started from that sentence.

After working heavily with agents over the past few months, I’ve started developing a gut instinct for when they are making things up.

One signal is vague language.

Overly general explanations. Sentences padded with technical jargon. An answer that sounds sophisticated but becomes harder to understand the more closely you read it.

I’ve learned that if I read a line twice and still don’t understand what it is actually saying, I should stop.

Previously, especially when I was tired from information overload, I would sometimes let my eyes glaze over vague explanations and move on.

I don’t do that anymore.

My tokens are precious to me.

This is partly why I created my "say-what" and "better-docs" skills.

Simple phrases like:

“I don’t get it.”

“Say what?”

“Wie bitte?”

…trigger another attempt at explaining the claim.

If it still doesn’t make sense, I ask for an illustration.

A diagram.

A high-level flow chart.

A UI sketch.

Anything that forces the agent to make the claim concrete.

I’ve noticed something interesting when doing this.

The more specific you force the explanation to become, the harder it is for a weak claim to survive.

Eventually you start seeing phrases like:

“I think I overstated that.”

“There is a catch I didn’t consider.”

“You’re actually right.”

“What I missed was…”

That is basically LLM-speak for: the original answer was wrong.

The second thing I do is verification from a fresh context.

Open another session and ask another agent to verify the claim independently.

This works best when the second session does not inherit the same memory or assumptions.

I’ve also found it useful to cross providers.

If GPT makes a claim that looks suspicious, I might ask Opus to verify it.

And vice versa.

There is something surprisingly useful about asking one model to review another model’s work.

Even just telling Claude, “Codex did this,” seems to put it in a much more adversarial review mode.

The third thing is asking for proof.

The simplest version is asking for documentation.

But even that is not enough.

Models can provide a perfectly real link that does not actually support the claim they made.

So you still have to read it.

Where possible, I now prefer giving the agent tools that let it inspect the actual system.

My current team sits underneath several other engineering teams.

A lot of our work is asynchronous. We consume thousands of events, and many of the third-party systems we integrate with are asynchronous too.

That makes understanding what actually happened difficult even for the engineers working on the system.

You can imagine what that environment does to an agent trying to infer behaviour from code alone.

There is plenty of room for plausible but completely wrong explanations.

This week, I built a harness that can open parts of the system in an isolated environment and let the agent actually operate it.

I originally built it for process verification.

But I realised afterwards that I had unintentionally made the agent better at documentation too.

Instead of only reading the code and guessing how the system behaves, it can now run the system, interact with it and observe what actually happens.

The downside is that the agent may work for longer before returning control to me.

That is fine.

I would rather spend more tokens getting a high-fidelity answer than spend my own time going back and forth correcting a confident fiction.

More and more, I’m becoming interested in agent observability.

And that interest is slowly pulling me deeper into the AI stack.

Formal verification.

Explainability.

Interpretability.

What evidence did the agent actually use?

Why did it reach this conclusion?

How do we know the explanation corresponds to what the system really did?

Those questions are becoming much more interesting to me than simply making the agent faster.

And that’s Friday Checkout.
