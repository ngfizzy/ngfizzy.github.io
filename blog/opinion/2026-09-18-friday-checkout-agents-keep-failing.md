---
title: "Friday Checkout: When Agents Keep Failing, Look at the Codebase"
date: 2026-09-18
description: "Repeated agent failures can reveal how understandable, documented, and verifiable your codebase is."
---

If agents are repeatedly screwing up in your codebase, and you’re using models with at least Sonnet-level capability, I’d start looking at the codebase before blaming the model.

Because there is a decent chance a new developer would struggle with the same things.

A few symptoms I’ve noticed:

**1. The agent changes one thing and something completely unexpected breaks.**

That is pretty close to the classical definition of spaghetti code.

Parts of the system are coupled in ways that are difficult to reason about, and changing one area has consequences somewhere you would not naturally think to look.

**2. The agent keeps breaking something that is obvious to you, and you catch it immediately.**

You probably know something the agent doesn’t.

That knowledge should live closer to the codebase.

Maybe in documentation. Maybe in an AGENTS.md. Maybe as a test, a type constraint, a comment, or an abstraction that makes the wrong thing harder to do.

If the same mistake keeps happening, repeatedly correcting the agent is probably the least useful place to keep that knowledge.

**3. The implementation usually works, but misses the mark slightly, and you only notice after it goes live.**

Your codebase may simply be hard to verify.

You probably have your own way of checking these things already. Maybe you have to click through five screens, run a weird query, inspect a log, or execute some small script.

You’ve done it so many times that the verification process feels automatic to you.

The agent doesn’t have that muscle memory.

And new devs certainly will not.

And if you already have a folder full of little scripts that help you verify changes, give those to the agent too.

**4. The agents used to perform well, but now they keep making silly mistakes.**

Before assuming the model suddenly got worse, look at the environment around it.

How many skills have you installed?

How many plugins and MCPs are loaded?

How large has your AGENTS.md or CLAUDE.md become?

All of these things consume context and attention. At some point, adding more instructions and tools can make it harder for the agent to focus on the actual task.

**There is one thing I’m deliberately leaving out here: scale.**

There are codebases where the problem really is simply the amount of context required to understand the system.

But let’s be real, most startups and scale-ups are not running Google-scale codebases.

So if a capable agent repeatedly cannot work safely in yours, that is useful information.

It may be telling you something about how understandable, documented and verifiable your software actually is.

And that’s Friday Checkout.

[Originally published on LinkedIn](https://www.linkedin.com/pulse/friday-checkout-when-agents-keep-failing-look-olufisayo-bamidele-iw5ef/).
