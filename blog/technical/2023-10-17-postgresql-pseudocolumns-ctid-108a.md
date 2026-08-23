---
title: "POSTGRESQL PSEUDOCOLUMNS: CTID"
date: 2023-10-17
description: "Postgres CTID is an internal table column identifying how Postgres stores table data physically on..."
---

<p>Postgres CTID is an internal table column identifying how Postgres stores table data physically on the disc. It comes as two comma-separated numbers, e.g. (0, 1), 0 here serving as the page number and 1 is the row's location on the page. </p>

<p>Let's establish some knowledge about the CTID column.</p>

<h2>
  <a name="set-up-a-postgres-database" href="#set-up-a-postgres-database">
  </a>
  Set Up a Postgres Database
</h2>

<p>Let's spin up a Postgres container on our local machine.</p>

<div class="highlight js-code-highlight">
<pre class="highlight shell"><code>

docker run <span class="nt">--rm</span> <span class="nt">-it</span> <span class="nt">--name</span> pg-internals-ctid <span class="nt">-p</span> 5438:5432 <span class="nt">-e</span> <span class="nv">POSTGRES_PASSWORD</span><span class="o">=</span>verysecret <span class="nt">-e</span> <span class="nv">POSTGRES_USER</span><span class="o">=</span>verysecretuser <span class="nt">-e</span> <span class="nv">POSTGRES_DB</span><span class="o">=</span>ctidplayground  postgres


</code></pre>
<div class="highlight__panel js-actions-panel">
<div class="highlight__panel-action js-fullscreen-code-action">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-on"><title>Enter fullscreen mode</title>
    <path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"></path>
</svg>

    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-off"><title>Exit fullscreen mode</title>
    <path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"></path>
</svg>

</div>
</div>
</div>

<p>The command above spins up a docker container called <code>pg-internal-ctid</code>, and publishes the container's internal port <code>5432</code> to port <code>5438</code> on your local machine with the default password, "verysecret",  a user named "verysecretuser" and a default db called "ctidplayground".</p>

<p>If that command works, you should get some outputs on your command line, and the last line of that output should look like this:</p>

<div class="highlight js-code-highlight">
<pre class="highlight plaintext"><code>

2023-10-15 01:32:35.278 UTC [1] LOG:  database system is ready to accept connections.


</code></pre>
<div class="highlight__panel js-actions-panel">
<div class="highlight__panel-action js-fullscreen-code-action">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-on"><title>Enter fullscreen mode</title>
    <path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"></path>
</svg>

    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-off"><title>Exit fullscreen mode</title>
    <path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"></path>
</svg>

</div>
</div>
</div>

<p><strong>Note</strong>:<em>If all of the above is foreign to you, drop a comment if you'd like me to start a series on docker.</em></p>

<h2>
  <a name="lets-connect-to-our-database" href="#lets-connect-to-our-database">
  </a>
  Let's Connect To Our Database
</h2>

<p><strong>Note</strong>: <em>You can skip the node project setups and run the queries directly in the docker container created above.</em></p>

<p>I assume you already know how to set up a typescript/nodejs project, so let's install a Postgres client for our database.</p>

<p><code>npm install --save postgres</code></p>

<p>In <code>src/index.ts</code>, let's connect to our Postgres instance and create a "users" table.</p>

<div class="highlight js-code-highlight">
<pre class="highlight typescript"><code>

<span class="k">import</span> <span class="nx">postgres</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">postgres</span><span class="dl">'</span><span class="p">;</span>

<span class="c1">// connect to the postgres instance</span>
<span class="kd">const</span> <span class="nx">sql</span> <span class="o">=</span> <span class="nf">postgres</span><span class="p">();</span>

<span class="k">async</span> <span class="kd">function</span> <span class="nf">createUsersTable</span><span class="p">()</span> <span class="p">{</span>
    <span class="kd">const</span> <span class="nx">result</span> <span class="o">=</span> <span class="k">await</span> <span class="nx">sql</span><span class="s2">`
CREATE TABLE IF NOT EXISTS users (
    name varchar(100) NOT NULL,
    country varchar(100) NOT NULL,
    age integer NOT NULL
    )
`</span><span class="p">;</span>

    <span class="nx">console</span><span class="p">.</span><span class="nf">log</span><span class="p">(</span><span class="dl">'</span><span class="s1">the creation results</span><span class="dl">'</span><span class="p">,</span> <span class="nx">result</span><span class="p">);</span>
<span class="p">}</span>

<span class="k">async</span> <span class="kd">function</span> <span class="nf">main</span><span class="p">()</span> <span class="p">{</span>
    <span class="k">await</span> <span class="nf">createUsersTable</span><span class="p">();</span>
<span class="p">}</span>

<span class="nf">main</span><span class="p">();</span>


</code></pre>
<div class="highlight__panel js-actions-panel">
<div class="highlight__panel-action js-fullscreen-code-action">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-on"><title>Enter fullscreen mode</title>
    <path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"></path>
</svg>

    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-off"><title>Exit fullscreen mode</title>
    <path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"></path>
</svg>

</div>
</div>
</div>

<p>In the snippet above, the call to postgres() looks for the following environment variables for connection details:</p>

<p><code>PGHOST,  PGPORT, PGDATABASE, PGUSER, PGPASSWORD</code></p>

<p>The snippet, then, creates a "users" table with columns <code>name, country, and age</code>.</p>

<h3>
  <a name="next-lets-run-our-code-to-see-if-this-works" href="#next-lets-run-our-code-to-see-if-this-works">
  </a>
  Next, let's run our code to see if this works.
</h3>

<p>In your <code>package.json</code> file, add the following script.</p>

<div class="highlight js-code-highlight">
<pre class="highlight json"><code><span class="w">

</span><span class="nl">"start:dev"</span><span class="p">:</span><span class="w">  </span><span class="s2">"PGHOST=localhost PGPORT=5438, PGDATABASE=ctidplayground PGUSER=verysecretuser PGPASSWORD=verysecret nodemon src/index.ts"</span><span class="w">


</span></code></pre>
<div class="highlight__panel js-actions-panel">
<div class="highlight__panel-action js-fullscreen-code-action">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-on"><title>Enter fullscreen mode</title>
    <path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"></path>
</svg>

    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-off"><title>Exit fullscreen mode</title>
    <path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"></path>
</svg>

</div>
</div>
</div>

<p>Now run the just-added script in your terminal</p>

<div class="highlight js-code-highlight">
<pre class="highlight shell"><code>

npm run start:dev


</code></pre>
<div class="highlight__panel js-actions-panel">
<div class="highlight__panel-action js-fullscreen-code-action">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-on"><title>Enter fullscreen mode</title>
    <path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"></path>
</svg>

    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-off"><title>Exit fullscreen mode</title>
    <path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"></path>
</svg>

</div>
</div>
</div>

<p>You should see the following logged in your console.</p>

<div class="highlight js-code-highlight">
<pre class="highlight plaintext"><code>

the creation results Result(0) []


</code></pre>
<div class="highlight__panel js-actions-panel">
<div class="highlight__panel-action js-fullscreen-code-action">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-on"><title>Enter fullscreen mode</title>
    <path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"></path>
</svg>

    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-off"><title>Exit fullscreen mode</title>
    <path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"></path>
</svg>

</div>
</div>
</div>

<p>Execute the following commands to confirm that the table was created.</p>

<div class="highlight js-code-highlight">
<pre class="highlight shell"><code>

docker <span class="nb">exec</span> <span class="nt">-it</span>  pg-internals-ctid psql <span class="nt">-d</span> ctidplayground <span class="nt">-U</span> verysecretuser


</code></pre>
<div class="highlight__panel js-actions-panel">
<div class="highlight__panel-action js-fullscreen-code-action">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-on"><title>Enter fullscreen mode</title>
    <path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"></path>
</svg>

    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-off"><title>Exit fullscreen mode</title>
    <path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"></path>
</svg>

</div>
</div>
</div>

<p>You should get the following prompt if everything works well.</p>

<div class="highlight js-code-highlight">
<pre class="highlight shell"><code>

<span class="nv">ctidplayground</span><span class="o">=</span><span class="c">#</span>


</code></pre>
<div class="highlight__panel js-actions-panel">
<div class="highlight__panel-action js-fullscreen-code-action">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-on"><title>Enter fullscreen mode</title>
    <path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"></path>
</svg>

    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-off"><title>Exit fullscreen mode</title>
    <path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"></path>
</svg>

</div>
</div>
</div>

<p>Now instruct Postgres to describe the user table with the command <code>\d users</code>. Your output should be similar to the one in the screenshot below</p>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F3wb8oqari9cmclprp2sx.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F3wb8oqari9cmclprp2sx.png" alt="Describe users table" loading="lazy"></a></p>

<p>If something went wrong in our code, the output would be "Did not find any relation named users."</p>

<h3>
  <a name="now-lets-insert-some-records-into-our-users-table" href="#now-lets-insert-some-records-into-our-users-table">
  </a>
  Now, let's insert some records into our user's table.
</h3>

<p>Inserts three users into the database and calls the function in the main.</p>

<div class="highlight js-code-highlight">
<pre class="highlight typescript"><code>

<span class="k">async</span> <span class="kd">function</span> <span class="nf">insertUsers</span><span class="p">()</span> <span class="p">{</span>
    <span class="kd">const</span> <span class="nx">result</span> <span class="o">=</span> <span class="k">await</span> <span class="nx">sql</span><span class="s2">`
        INSERT INTO users (name, country, age)
        VALUES(
            UNNEST(ARRAY['John Doe', 'Tom Williman', 'Billy Wilson']),
            UNNEST(ARRAY['Nigeria', 'Canada', 'USA']),
            UNNEST(ARRAY[32, 16, 16])
        )
        RETURNING *

    `</span><span class="p">;</span>
    <span class="nx">console</span><span class="p">.</span><span class="nf">log</span><span class="p">(</span><span class="dl">'</span><span class="s1">insersion results</span><span class="dl">'</span><span class="p">,</span> <span class="nx">result</span><span class="p">);</span>
<span class="p">}</span>

<span class="k">async</span> <span class="kd">function</span> <span class="nf">main</span><span class="p">()</span> <span class="p">{</span>
    <span class="k">await</span> <span class="nf">insertUsers</span><span class="p">();</span>
<span class="p">}</span>


</code></pre>
<div class="highlight__panel js-actions-panel">
<div class="highlight__panel-action js-fullscreen-code-action">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-on"><title>Enter fullscreen mode</title>
    <path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"></path>
</svg>

    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-off"><title>Exit fullscreen mode</title>
    <path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"></path>
</svg>

</div>
</div>
</div>

<p>If that works,  the inserted users should be logged on your console like so:</p>

<div class="highlight js-code-highlight">
<pre class="highlight plaintext"><code>

insertion results Result(3) [
  { name: 'John Doe', country: 'Nigeria', age: 32 },
  { name: 'Tom Williman', country: 'Canada', age: 16 },
  { name: 'Billy Wilson', country: 'USA', age: 16 }


</code></pre>
<div class="highlight__panel js-actions-panel">
<div class="highlight__panel-action js-fullscreen-code-action">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-on"><title>Enter fullscreen mode</title>
    <path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"></path>
</svg>

    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-off"><title>Exit fullscreen mode</title>
    <path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"></path>
</svg>

</div>
</div>
</div>
<h2>
  <a name="confirming-the-characteristics-of-ctid-the-column" href="#confirming-the-characteristics-of-ctid-the-column">
  </a>
  Confirming The Characteristics Of CTID the Column
</h2>

<p>Now, let's establish some characteristics of the CTID column.</p>
<h3>
  <a name="1-inserted-columns-have-sequential-ctids-and-the-latest-modified-records-always-have-higher-ctid-values" href="#1-inserted-columns-have-sequential-ctids-and-the-latest-modified-records-always-have-higher-ctid-values">
  </a>
  1. Inserted columns have Sequential CTIDs, and the latest modified records always have higher CTID values.
</h3>

<p>If you've already closed your Postgres shell, reopen it by running the previous docker exec command </p>
<div class="highlight js-code-highlight">
<pre class="highlight shell"><code>

docker <span class="nb">exec</span> <span class="nt">-it</span>  pg-internals-ctid psql <span class="nt">-d</span> ctidplayground <span class="nt">-U</span> verysecretuser


</code></pre>
<div class="highlight__panel js-actions-panel">
<div class="highlight__panel-action js-fullscreen-code-action">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-on"><title>Enter fullscreen mode</title>
    <path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"></path>
</svg>

    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-off"><title>Exit fullscreen mode</title>
    <path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"></path>
</svg>

</div>
</div>
</div>

<p>Next, list the inserted record with their ctid by running the following query.</p>

<div class="highlight js-code-highlight">
<pre class="highlight sql"><code>

<span class="k">SELECT</span> <span class="o">*</span><span class="p">,</span> <span class="n">ctid</span> <span class="k">FROM</span> <span class="n">users</span><span class="p">;</span>


</code></pre>
<div class="highlight__panel js-actions-panel">
<div class="highlight__panel-action js-fullscreen-code-action">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-on"><title>Enter fullscreen mode</title>
    <path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"></path>
</svg>

    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-off"><title>Exit fullscreen mode</title>
    <path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"></path>
</svg>

</div>
</div>
</div>

<p>Your result should look like the one in the screenshot below, confirming the above facts.</p>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fmrqw42z8z2pqnyw6f12f.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fmrqw42z8z2pqnyw6f12f.png" alt="List users citds" loading="lazy"></a></p>

<h3>
  <a name="2-ctids-cannot-be-a-unique-identifier" href="#2-ctids-cannot-be-a-unique-identifier">
  </a>
  2. CTIDs cannot be a unique identifier
</h3>

<p>You cannot use a ctid as a unique identifier because an update operation or a full vacuum command after deletion can reassign new CTIDs existing rows. Let's see this in action. </p>

<p>Run the following query against the user database.</p>

<div class="highlight js-code-highlight">
<pre class="highlight sql"><code>

<span class="k">UPDATE</span> <span class="n">users</span> <span class="k">SET</span> <span class="n">age</span><span class="o">=</span><span class="mi">35</span> <span class="k">WHERE</span> <span class="n">name</span> <span class="o">=</span> <span class="s1">'John Doe'</span><span class="p">;</span>


</code></pre>
<div class="highlight__panel js-actions-panel">
<div class="highlight__panel-action js-fullscreen-code-action">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-on"><title>Enter fullscreen mode</title>
    <path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"></path>
</svg>

    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-off"><title>Exit fullscreen mode</title>
    <path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"></path>
</svg>

</div>
</div>
</div>

<p>Now select all records from the user's table again;</p>

<div class="highlight js-code-highlight">
<pre class="highlight sql"><code>

<span class="k">SELECT</span> <span class="o">*</span><span class="p">,</span> <span class="n">ctid</span> <span class="k">FROM</span> <span class="n">users</span><span class="p">;</span>


</code></pre>
<div class="highlight__panel js-actions-panel">
<div class="highlight__panel-action js-fullscreen-code-action">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-on"><title>Enter fullscreen mode</title>
    <path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"></path>
</svg>

    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-off"><title>Exit fullscreen mode</title>
    <path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"></path>
</svg>

</div>
</div>
</div>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F2sjdv0yb5wjcslloljj5.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F2sjdv0yb5wjcslloljj5.png" alt="CTIDs after update" loading="lazy"></a></p>

<p>John Doe now has a CTID of (0, 4)  instead of the original (0, 1) ctid. The first record on the table is now that of Tom Williman with a CTID of (0,2).</p>

<p>What happened to ctid (0,1)? Just by this observation, it can be established that Postgres doesn't mutate existing tuples. An update inserts a new record into the database and assigns the pointer to the old record to the new one. That leaves old records as garbage, which are automatically skipped during scans.</p>

<p>To reclaim this space taken by the garbage, run the <code>VACUUM FULL;</code> command in your pg shell. Making a <code>select *, ctid</code> again. This should make our record completely sequential again; the ctid now starts from (0, 1).</p>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Flfqxv6ze8kqjianolv8q.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Flfqxv6ze8kqjianolv8q.png" alt="CTID reset after full vacuum" loading="lazy"></a></p>

<p>To summarise the preceding paragraphs, the last modified record always has the highest ctid on a table, and ctids should never be used as identifiers. However, if there is a table without a updated_at column, or for some reason (e.g., during a bulk concurrent insert), multiple columns end up having the same <code>updated_at</code> timestamp, the ctid column can be used to decide which record gets updated last.</p>

<h2>
  <a name="use-case-for-ctid-identifying-the-lastfirst-inserted-record-in-duplicates-and-deduplication" href="#use-case-for-ctid-identifying-the-lastfirst-inserted-record-in-duplicates-and-deduplication">
  </a>
  USE CASE FOR CTID: Identifying the last/first inserted record in duplicates and Deduplication.
</h2>

<p>Since we've observed that the last modified record always holds the highest ctid value, ctid is a great candidate for picking the latest record between two duplicates. At some point in our career, we would have to insert records from CSV files prone to human errors into a database table; Human errors like multiple entries of the same record. Whenever you have a guarantee that a database table is an append-only table (i.e., the records are immutable), selecting the record with the max ctid value would give you the latest value of that record.</p>

<p>Let's modify our <code>insertUsers</code> function to </p>

<div class="highlight js-code-highlight">
<pre class="highlight typescript"><code>

<span class="k">async</span> <span class="kd">function</span> <span class="nf">insertUsers</span><span class="p">()</span> <span class="p">{</span>
    <span class="c1">// clear users table</span>
    <span class="k">await</span> <span class="nx">sql</span><span class="dl">'</span><span class="s1">TRUNCATE users;`;

    // insert data into the users table;
    const result = await sql`
        INSERT INTO users (name, country, age)
        VALUES(
            UNNEST(ARRAY[</span><span class="dl">'</span><span class="nx">John</span> <span class="nx">Doe</span><span class="dl">'</span><span class="s1">,</span><span class="dl">'</span> <span class="nx">Tom</span> <span class="nx">Williman</span><span class="dl">'</span><span class="s1">, </span><span class="dl">'</span><span class="nx">Billy</span> <span class="nx">Wilson</span><span class="dl">'</span><span class="s1">,</span><span class="dl">'</span> <span class="nx">John</span> <span class="nx">Doe</span><span class="dl">'</span><span class="s1">,</span><span class="dl">'</span> <span class="nx">Tom</span> <span class="nx">Williman</span><span class="dl">'</span><span class="s1">, </span><span class="dl">'</span><span class="nx">Billy</span> <span class="nx">Wilson</span><span class="dl">'</span><span class="s1">]),
            UNNEST(ARRAY[</span><span class="dl">'</span><span class="nx">Nigeria</span><span class="dl">'</span><span class="s1">, </span><span class="dl">'</span><span class="nx">Canada</span><span class="dl">'</span><span class="s1">, </span><span class="dl">'</span><span class="nx">USA</span><span class="dl">'</span><span class="s1">, </span><span class="dl">'</span><span class="nx">Nigeria</span><span class="dl">'</span><span class="s1">, </span><span class="dl">'</span><span class="nx">Canada</span><span class="dl">'</span><span class="s1">, </span><span class="dl">'</span><span class="nx">USA</span><span class="dl">'</span><span class="s1">]),
            UNNEST(ARRAY[32, 16, 16, 25, 21, 22])
        )
        RETURNING *

    `;
    console.log(</span><span class="dl">'</span><span class="nx">insersion</span> <span class="nx">results</span><span class="dl">'</span><span class="s1">, result);
}
```
The snippet would insert six records into the database. Each unique record has one duplicate. Our table should now look like that in the screenshot below.


![Insert duplicate rows](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kgdo50tjbxcgoja598z8.png)


To select the latest duplicate record, use the query below

```sql
SELECT users.*, users.ctid  FROM  users INNER JOIN (SELECT max(ctid) AS max_ctid, name FROM users GROUP BY name) AS latest_duplicate
ON users.ctid = latest_duplicate.max_ctid;
```
The query above has a subquery that groups the records in the user</span><span class="dl">'</span><span class="nx">s</span> <span class="nx">table</span> <span class="nx">by</span> <span class="nf">name</span><span class="p">(</span><span class="nx">assuming</span> <span class="nx">the</span> <span class="nx">name</span> <span class="k">is</span> <span class="nx">supposed</span> <span class="nx">to</span> <span class="nx">be</span> <span class="nx">the</span> <span class="nx">user</span> <span class="nx">identifier</span> <span class="nx">here</span><span class="p">).</span> <span class="nx">From</span> <span class="nx">each</span> <span class="nx">group</span><span class="p">,</span> <span class="nx">we</span> <span class="nx">select</span> <span class="nx">the</span> <span class="nx">record</span> <span class="kd">with</span> <span class="nx">the</span> <span class="nx">maximum</span> <span class="nx">user</span> <span class="nx">ctid</span><span class="p">.</span> <span class="nx">We</span> <span class="nx">join</span> <span class="k">this</span> <span class="nx">subquery</span> <span class="kd">with</span> <span class="nx">the</span> <span class="nx">original</span> <span class="nx">users</span><span class="dl">'</span><span class="s1"> table to select all users</span><span class="dl">'</span> <span class="nx">properties</span><span class="p">.</span>

<span class="nx">Your</span> <span class="nx">output</span> <span class="nx">should</span> <span class="nx">look</span> <span class="nx">like</span> <span class="nx">the</span> <span class="nx">screenshot</span> <span class="nx">below</span>

<span class="o">!</span><span class="p">[</span><span class="nx">Deduplicating</span> <span class="kd">with</span> <span class="nx">ctid</span><span class="p">](</span><span class="nx">https</span><span class="p">:</span><span class="c1">//dev-to-uploads.s3.amazonaws.com/uploads/articles/lss7qfzprtm4sy5r1d2v.png)</span>
<span class="nx">We</span> <span class="nx">ended</span> <span class="nx">up</span> <span class="kd">with</span> <span class="nx">the</span> <span class="nx">last</span> <span class="nx">inserted</span> <span class="nx">duplicate</span> <span class="nx">record</span><span class="p">.</span>

<span class="err">##</span> <span class="nx">What</span> <span class="k">if</span> <span class="nx">You</span> <span class="nx">can</span><span class="dl">'</span><span class="s1">t Guarantee That Your Database Table is an Append-Only Table

Solving the above problem in your database strictly depends on problem-solving skills. I would solve this problem by creating an intermediate table that guarantees immutability(I would probably use a Postgresql materialized view for this). I would always perform the Deduplication on the intermediate table and merge the Deduplication result with the final table. The algorithm would be something like this.

• insert records from the users CSV file into the `temp_users` table
• deduplicate by selecting max ctid record from the DB
• merge the deduplicated record with the existing users</span><span class="dl">'</span> <span class="nx">table</span><span class="p">,</span> <span class="nx">i</span><span class="p">.</span><span class="nx">e</span>
    <span class="err">•</span> <span class="k">if</span> <span class="nx">a</span> <span class="nx">user</span> <span class="nx">record</span> <span class="nx">already</span> <span class="nx">exists</span> <span class="k">in</span> <span class="nx">the</span> <span class="nx">users</span><span class="dl">'</span><span class="s1"> table, update the record with the latest record, `temp_users`
    • else insert a new user record.

## Why Can</span><span class="dl">'</span><span class="nx">t</span> <span class="nx">I</span> <span class="nx">DO</span> <span class="nx">This</span> <span class="nx">In</span> <span class="nx">Memory</span><span class="p">?</span>

<span class="nx">Sometimes</span><span class="p">,</span> <span class="nx">you</span> <span class="nx">just</span> <span class="nx">can</span><span class="dl">'</span><span class="s1">t. Let</span><span class="dl">'</span><span class="nx">s</span> <span class="nx">assume</span> <span class="nx">you</span><span class="dl">'</span><span class="s1">re to insert and dedupe a file with 10 million rows, and all you have is a virtual machine with just 1 gig of memory. Well, you could try doing that in memory which would end up eating up all the resources on your server. Or you could actually do the deduplication in the database, which was built to handle that kind of task.

Conclusion

Beyond just coding, having a deep understanding of how your tool works internally is always beneficial. If you</span><span class="dl">'</span><span class="nx">re</span> <span class="nx">interested</span> <span class="k">in</span> <span class="nx">topics</span> <span class="nx">like</span> <span class="k">this</span><span class="p">,</span> <span class="nx">follow</span> <span class="k">for</span> <span class="nx">more</span><span class="p">.</span>

<span class="nx">If</span> <span class="nx">you</span><span class="dl">'</span><span class="s1">re a beginner, this article introduces some new database concepts. Feel free to request a deep dive on any of them; as usual, I appreciate all forms of feedback.


</span></code></pre>
<div class="highlight__panel js-actions-panel">
<div class="highlight__panel-action js-fullscreen-code-action">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-on"><title>Enter fullscreen mode</title>
    <path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"></path>
</svg>

    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewbox="0 0 24 24" class="highlight-action crayons-icon highlight-action--fullscreen-off"><title>Exit fullscreen mode</title>
    <path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"></path>
</svg>

</div>
</div>
</div>
