---
title: "Frontend Vs Backend: An Objective Look"
date: 2023-10-20
description: "Image credit: geeks for geeks  I wrote a short post about how backend development is more critical..."
---

<p><em>Image credit: <a href="https://media.geeksforgeeks.org/wp-content/uploads/20190712131938/front-end-vs-back-end.png">geeks for geeks</a></em></p>

<p>I wrote a short post about how backend development is more critical than frontend development and shared it among a few friends and colleagues yesterday; that's just me being silly.</p>

<p>Today, I have decided to write a more abjective blog post about the debate. Without further ado, here's what I think.</p>

<h2>
  <a name="there-are-no-frontends-or-backends" href="#there-are-no-frontends-or-backends">
  </a>
  There are no Frontends Or Backends.
</h2>

<p>Yes, there are no frontends or backends. We only have software that runs on machines; any software can be a client or server at anytime. The end user is the only one who doesn't get to serve as a server. What do I mean?</p>

<p>Let's start at the very top of the stack</p>

<p><em>The UI:</em> There are many kinds of UI, but in this instance, I'm talking about the web UI. Yes, it is a client to a web backend (say a RESTful API), but simultaneously a server for the end user.  But a RESTFUL API is also a client to a database server. </p>

<p>It might surprise you that databases also have frontends and backends. Well, databases are as complex as operating systems, but to keep it as simple as possible, I'd say most databases contain two main parts:</p>

<p><strong>The Query Engine:</strong> This is the front end of your database. It takes your query, plans execution,  and optimizes it when possible. The query engine then passes your question to the next component.</p>

<p><strong>The Storage Engine:</strong> This is your database's backend. It takes the prepared query from the query engine and executes it(oversimplification). This layer handles data storage and retriever from disk, what gets stored in memory, scheduled database cleanups, etc. Of course, it achieves this by talking to the operating system, so we can accurately say that a database's storage engine is a client of the operating system. But wait a minute; the operating system also has a front and back end, namely, the userland and kernel, which are the front and back end of the operating system.</p>

<p>Well, by now, you get the gist. No matter what kind of software you choose to write, your software is serving and being served simultaneously.</p>

<h2>
  <a name="but-which-one-is-more-complex" href="#but-which-one-is-more-complex">
  </a>
  But which one is more complex?
</h2>

<p>I can tell you this: creating a database, a compiler, an operating system, and anything that directly talks to the hardware is always difficult. Every other thing is easy, but at scale, nothing is.</p>

<p>You could sort an array containing five items, but let's make that five billion items, and now you'd have to deal with all sorts of demons.</p>

<p>We are all software developers; some prefer to work on the top of the stack, while others prefer to work very close to the bottom. Whatever area you like to stay, ensure you're competent and can build software that works at various scales.</p>
