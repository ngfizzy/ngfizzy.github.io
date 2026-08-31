---
title: "Friday Checkout."
date: "Mid-July 2026"
description: "In 2026, the bottleneck is code review fatigue rather than framework fatigue."
---

Friday Checkout.

We used to have framework fatigue; in 2026, it is code review fatigue.

I thought only I felt this way until a couple of people at work expressed the same sentiment.

Earlier last week, the tech Twitter debate was about whether engineers should read AI-generated code or not. To be honest, I understand both sides.

If your aim is speed, you cannot afford to read everything an AI agent churns out. You have to lean in more, accept some risk, and move.

There are industries where you can afford to do this. A typical example is the coding agent industry itself. If your agent writes the wrong code 10% of the time, you can always say the user did not provide enough context.

But if your aim is accuracy, you cannot afford to let sloppy code go in. In that world, you have to review everything, and with AI, that gets exhausting very fast.

So what do I think?

I think in 2026, code review is broken. It is broken not because reviewing code no longer matters, but because the volume, speed, and shape of code being produced has changed.

Diffs were designed for a world where humans wrote most of the code. Now we are entering a world where humans increasingly review code they did not write, produced at a pace they cannot sustainably inspect line by line. At some point, the reviewer stops being the person in control and becomes the cleanup layer for machine output. That is the reverse-centaur problem Cory Doctorow talks about: the machine is no longer assisting the human; the human is assisting the machine.

And that is not a great place to be.

I do not think the answer is simply “agentic code review.”

That might help, but it is not enough.

When writing code was the bottleneck, we invented syntax highlighting, LSPs, IntelliSense, autocomplete, jump-to-definition, static analysis, and all sorts of tools to help humans write and navigate code better.

Now that reviewing code is becoming the bottleneck, we need a similar leap in tooling.

Tools that help humans review logically.

Tools that show how a change flows through the system.

Tools that group diffs by intent, not just by file.

Tools that visually map the blast radius of a change.

Tools that flag risky areas of the codebase before the reviewer has to manually discover them. Tools that help reviewers understand, “What is the actual behavioral change here?” instead of forcing them to mentally reconstruct it from scattered diffs.

Maybe that looks like logical diffing, like risk maps, dependency-aware reviews, or review interfaces organized around runtime behavior instead of file structure. The possibilities are limited by our imagination right now.

We are asking humans to review machine-scale output with human-scale interfaces. That mismatch is the problem.

Code review does not just need more automation around it.

It needs a new interface for understanding change.
