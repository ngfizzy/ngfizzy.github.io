---
title: "Friday Checkout | How I prompt in 2026"
date: 2026-11-21
description: How I give agents a clear outcome, ask for proof of work, and set guardrails.
---

![A white sports car on a winding forest road beside the words “How I prompt in 2026”.](../../images/friday-checkout-how-i-prompt-2026.jpg)

It’s been about two weeks since my last Friday Checkout, so let me break my
silence.

A few conversations with friends got me thinking about how I prompt now. Writing
elaborate prompts feels very 2023. You still have to prompt, of course. But
models have gotten better at picking up intent, so I spend less time trying to
word everything just right.

There are three things I pay attention to now.

## 1. Have a clear picture of what you want

What do you want to see when the agent is done? I start with the destination and
leave it some room to figure out the route.

> I want a spinner to show while the HTTP request is in flight. Users should
> still be able to interact with the page. Show me a few mockups so I can pick
> one before you implement it.

Words leave room for interpretation. You might say “spinner” and picture one
next to a button. The agent might put it in the middle of the page. A few
mockups help you settle that before any code gets written.

These models can work through some pretty hard maths. I’m comfortable leaving
the mechanics of a spinner to them.

## 2. Ask for proof of work

Once we’ve agreed on a mockup, I want the agent to show me what it built. That
might be a screenshot, a screen recording, or, for backend work, a script I can
run to reproduce exactly what it claims.

> Capture a screenshot while the request is in flight and compare it with the
> mockup we agreed on. If it doesn’t match, fix it and take another screenshot.
> Record a short clip showing that you can still interact with the page while
> the spinner is visible.

There you go. You’ve built a loop. When the agent thinks it’s done, it has
something concrete to check. If the screenshot doesn’t match what we agreed on,
it goes back to work before handing it over.

## 3. Set guardrails where they matter

For everyday vibe coding, I think the first two will get you pretty far. The
more specific the guardrail, the more you usually need to know about the domain
to see why it matters.

Take an extreme example. If I ask an agent to make me €1 million in a week, I’d
rather it didn’t rob a bank. There are many ways to interpret the job I gave it,
and some routes are plainly off-limits.

Back to the spinner, a more practical guardrail would be: “Don’t manipulate the
DOM directly.” That rules out one implementation approach and leaves the agent
free to find another.

Once we agree on what done looks like and how to prove it, I’m happy to leave
room for the agent to find a route I wouldn’t have thought of.

*Complex agentic systems are a little more involved, but for everyday prompting,
this is how I’d go about it.*

[Originally published on LinkedIn](https://www.linkedin.com/pulse/friday-checkout-how-i-prompt-2026-olufisayo-bamidele-nrmaf/)
