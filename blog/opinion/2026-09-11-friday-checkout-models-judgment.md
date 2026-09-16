---
title: "Friday Checkout: Did Models Get Better, or Did Your Judgment Get Weaker?"
date: 2026-09-11
description: "Better automation may quietly weaken the engineering judgment needed when it fails."
---

There is an old idea in automation called the automation paradox.

In 1983, Lisanne Bainbridge wrote a paper called [Ironies of Automation](https://doi.org/10.1016/0005-1098(83)90046-8).

One of the problems she described was what happens when automation takes over the routine parts of a job.

Humans are left with passive monitoring, something we are generally not very good at, and the rare failure modes the automated system cannot handle.

There is another problem too: skill decay.

If the system mostly works by itself, the operator gets fewer opportunities to exercise the judgment required to operate it manually.

Then one day the automation reaches a state it cannot handle, hands control back to the human, and expects that human to suddenly perform at their best.

I’ve been thinking about this a lot with AI-assisted software development.

Little mistakes that would probably have been caught more often in the pre-LLM era now sometimes make it surprisingly far.

Of course, some of that may simply be because the volume of generated code has increased.

But I think there is another possibility worth paying attention to.

What if widespread automation is slowly reducing how often we exercise the judgment required to spot those mistakes?

Did the model get better, or did our ability to notice when it is wrong get weaker?

This is mostly harmless when everybody is vibe-coding another Tinder for X.

It gets more interesting when the software sits underneath something important.

Software already had surprisingly fragile dependency chains long before AI.

A canonical example is the left-pad incident in 2016.

left-pad was a tiny npm package. When its author unpublished it, dependency chains containing projects such as Babel started failing. npm reported hundreds of failures per minute and many thousands of affected projects before restoring the package.

A very small piece of software turned out to be sitting underneath a lot of other software.

That happened before the average Joe could ask an agent to produce 25,000 lines of code in half an hour.

So I do wonder what happens when producing software becomes much easier while understanding the software becomes increasingly optional.

I don’t have a complete answer.

But perhaps there is something software can learn from aviation.

What does flying have to do with coding?

Quite a lot, actually.

Early aviation required pilots to be hands-on for most of the flight.

Modern commercial aircraft automate enormous portions of flying. Much of the time, that is a very good thing.

The difficulty appears when automation suddenly gives control back.

Air France Flight 447 is a painful example.

In 2009, the aircraft encountered unreliable airspeed readings after its Pitot probes were affected by icing. The autopilot and autothrust disconnected and the pilots had to take manual control.

The aircraft subsequently entered a stall that the crew failed to recover from and crashed into the Atlantic Ocean, killing all 228 people aboard.

The [official BEA investigation](https://bea.aero/en/investigation-reports/notified-events/detail/accident-to-the-airbus-a330-203-registered-f-gzcp-and-operated-by-air-france-occured-on-06-01-2009-in-the-atlantic-ocean) is much more complicated than simply saying “automation caused the crash.”

But that complexity is exactly why I find the example useful.

Automation changes the job of the human operating the system.

And when most of a job becomes automated, maintaining the skills required for the remaining part has to become more intentional.

I think software may be heading towards the same problem.

If AI handles more routine implementation work, the remaining human decisions may increasingly be the difficult ones; which in turn might make the Job of a software engineer more difficult and closer to engineering than it is today - you continuously have to make one difficult decision after another.

The ability to make those decisions is exactly the skill you don’t want people becoming rusty at.

So what do we do about it?

I don’t know yet.

Not every vibe-coded side project needs to be treated like aviation software.

But I do think people responsible for software touching finance, health, energy and other critical infrastructure may eventually need stronger expectations around competence, review and accountability.

Perhaps maintaining engineering judgment itself becomes part of the job.

Software is a strange field, so I don’t yet know the above mentioned practices would look like in reality

But I think we should at least pay attention to the possibility that better automation can quietly make the human behind it less prepared for the moment when automation fails.

And that’s Friday Checkout.

See you on Monday.
