---
title: "Monday Check-in: Slop Your Way Into Reliability"
date: 2026-08-17
description: "Some generated code should be written with the expectation that you may never read it."
---

While the debate over whether we should read all AI-generated code is still going on, I think I’ve landed somewhere close to Theo’s side(https://lnkd.in/dpCcji9P).

Some generated code should be written with the expectation that you may never read it.

I just don’t think production code belongs in that category.

I read every line of generated code that goes into production. At least, every line I generate for my employer.

That is the code the customer eventually consumes, and if I’m responsible for shipping it, I want to understand what went in.

My personal projects are slightly different.

There, I’m increasingly trying to build abstractions that reduce how much new code I need to write as the codebase matures.

You can imagine it as slowly building my own standard library around the domain.

The stable parts change less. New features become different ways of stitching those pieces together with control structures.

It requires more thought about program design upfront, but the payoff is that I’m actually writing less new code per feature over time.

Then there is the code I barely read.

Tests are one example.

Before LLMs, pushing towards extremely high test coverage often felt like high effort for a metric that could still be gamed.

Today, generating a large test harness is cheap enough that I’d rather go all in.

90% coverage or nothing.

But I don’t carefully read every generated test.

I pay particular attention when an existing test is modified or deleted.

That is a signal.

Something that described how the system worked yesterday has changed. I want to know whether that behavioural change was intentional.

New tests? I mostly scan them.

The second category is something I call slop QA.

My slop QA is a collection of throwaway scripts generated from the task description to simulate how a human might interact with the system.

Click this.

Send this request.

Create this thing.

Change that value.

Try the unhappy path.

The scripts are version-controlled locally, and my agent instructions require the results to be written into an MD file.

The agent also has to tell me what it could not test and why.

Sometimes that becomes the next instruction: figure out how to test the thing you could not test.

I barely read these scripts.

I care much more about what they exercised, what happened, and what remains untested.

If the agent gets stuck, then I start looking at the machinery.

So, do I read AI-generated code?

Most production code, yes.

Test harnesses, throwaway scripts and slop QA? Barely.

AI has made code cheap enough that some code can simply be scaffolding around the thing I actually care about.

The important part is knowing which code deserves your attention.

More on slop QA in Friday’s checkout.
