---
title: "Friday Checkout: The Harness Is as Important as the Model"
date: 2026-08-28
description: "Reliable agent behaviour depends on the harness around the model as much as the model itself."
---

When I created the session-coordinator skill, I did it in the GitHub Copilot desktop app.

It worked almost exactly how I wanted in that same harness.

Then I started using the same skill in the Codex desktop app and began noticing some undesirable behaviour.

The first one was delegation.

Sometimes, midway through a session, the coordinator would forget that its job was to delegate and start doing the work itself.

I would have to remind it of the coordinator instructions before it returned to the expected behaviour.

My current suspicion is some version of the classic lost-in-the-middle problem, where instructions buried inside a long context get less attention.

I haven’t investigated exactly how Codex organises skills and other session artifacts internally, so that is still just my best guess.

The second problem was stranger; assignment to wrong workers

Sometimes Codex would assign a follow-up task to the wrong worker.

When I investigated, I found that one of my earlier instructions about reusing relevant workers had ended up in memory and was being applied in situations where I didn’t want it.

This is one of the things that makes me cautious about memory features in agent harnesses.

They can be useful, but when something in memory starts influencing behaviour unexpectedly, it can be surprisingly difficult to work backwards and figure out why the agent made a particular decision.

Since then, session-coordinator has gone through several modifications so that it behaves reasonably across Copilot, Codex and Claude Code in their desktop environments.

Even now, each harness behaves slightly differently.

Copilot tends to favour fresh context and retires workers earlier.

Codex tends to keep workers around longer, favouring continuity. In my experience it also maintains coherence better over longer sessions and seems to benefit more from cached context.

Claude Code desktop currently can’t create the same kind of nested sessions in my workflow, so the skill falls back to subagents. Like Codex, it tends to keep those workers around longer.

Working through all of this has changed how I think about models and harnesses.

The Harness is as Important as The Model

The problems we associate with LLMs, hallucinations, instruction drift, lost-in-the-middle and so on, haven’t disappeared.

We’ve become much better at putting deterministic systems around them:

Validation, availale tools, gardrails constraints, memory, context management, retries strategy, delegation strategy etc. Those layers are the harness; They keep the model grounded in truth.

And once you spend enough time working across different harnesses, something becomes obvious: the model is only one part of the behaviour you experience.

GPT inside Codex is not quite the same working environment as GPT inside Copilot.

Opus inside Copilot will not behave exactly like Opus inside Claude Code.

Same underlying model family, different surrounding system.

It also means a new model release can create work for the harness.

A model that follows instructions differently, reasons differently about tools, or handles long context differently can force you to revisit assumptions you encoded around the previous model.

Which leads me to a newer thought.

Software engineering is dead; long-live software engineering

I’m starting to doubt there will ever be one universal agent harness.

Right now, everyone seems to be assembling their own combination of prompts, skills, tools, memory, validation, delegation and context management.

It reminds me a little of the early web.

For a while, everyone built their own way of doing things.

Then frameworks appeared.

Patterns emerged.

Eventually, many of those frameworks started converging around similar ideas.

I think we may be somewhere near that stage with harness engineering.

As mainstream software development changes, a growing amount of engineering work may become less about writing every implementation directly and more about designing the environment in which agents can do reliable work.

The model matters a lot.

I’m increasingly convinced the harness matters just as much.

And that’s Friday Checkout.

Enjoy your weekend.
