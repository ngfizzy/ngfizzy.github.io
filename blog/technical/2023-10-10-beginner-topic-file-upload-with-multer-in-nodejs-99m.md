---
title: "Beginner Topic: File Upload With Multer In Nodejs"
date: 2023-10-10
description: "I generally don't love writing about topics already covered extensively on the internet. Still, I..."
---

<p>I generally don't love writing about topics already covered extensively on the internet. Still, I decided to write this article due to a question one of my mentees asked. He wanted to know how to programmatically direct uploads to different destinations based on the file type using multer. "Instead of just answering him, why not just write a blog post about it?" I thought. So here goes nothing! If you're already familiar with Nodejs and typescript, you can jump to the second to last section for the answer</p>

<h2>
  <a name="what-is-multer" href="#what-is-multer">
  </a>
  What is Multer?
</h2>

<p>For the benefit of those not familiar with it, multer is a Nodejs library for handling file upload. It is one of, if not the most famous library in this category.<br>
How to use multer.<br>
Without further Ado, I'll stop taking it and show you the code.</p>

<p>Because we don't do js, let's set up a simple typescript project.<br>
</p>

<div class="highlight js-code-highlight">
<pre class="highlight shell"><code>    <span class="nb">mkdir </span>fileupload <span class="o">&amp;&amp;</span> <span class="nb">cd </span>fileupload <span class="o">&amp;&amp;</span> npm init <span class="nt">-y</span> <span class="o">&amp;&amp;</span> npm <span class="nb">install</span> <span class="nt">--save-dev</span> typescript @types/node ts-node nodemon <span class="o">&amp;&amp;</span> npx tsc <span class="nt">--init</span>
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



<p>The block of code above creates a new directory called "fileupload" in your current directory, navigates to the new <code>fileupload</code> directory, creates a new <code>package.json</code>  file with default options, installs some typescript dependencies, and initializes a typescript project.</p>

<p>Let's create a simple HelloWorld program to test our typescript setup.</p>

<p>At this point, you should still be in your file upload folder. Create an index.ts file in that folder and add the code block below.<br>
</p>

<div class="highlight js-code-highlight">
<pre class="highlight typescript"><code>    <span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="dl">'</span><span class="s1">Hello world</span><span class="dl">'</span><span class="p">);</span> <span class="c1">// if you hate semicolons, deal with it ;)</span>
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



<p>In your package.json, add this key-value pair to your scripts.<br>
</p>

<div class="highlight js-code-highlight">
<pre class="highlight json"><code><span class="w">    </span><span class="nl">"start:dev"</span><span class="p">:</span><span class="w"> </span><span class="s2">"nodemon index.ts"</span><span class="w">
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



<p>Your package.json file should now look like this:<br>
</p>

<div class="highlight js-code-highlight">
<pre class="highlight json"><code><span class="p">{</span><span class="w">
  </span><span class="nl">"name"</span><span class="p">:</span><span class="w"> </span><span class="s2">"fileupload"</span><span class="p">,</span><span class="w">
  </span><span class="nl">"version"</span><span class="p">:</span><span class="w"> </span><span class="s2">"1.0.0"</span><span class="p">,</span><span class="w">
  </span><span class="nl">"description"</span><span class="p">:</span><span class="w"> </span><span class="s2">""</span><span class="p">,</span><span class="w">
  </span><span class="nl">"main"</span><span class="p">:</span><span class="w"> </span><span class="s2">"index.js"</span><span class="p">,</span><span class="w">
  </span><span class="nl">"scripts"</span><span class="p">:</span><span class="w"> </span><span class="p">{</span><span class="w">
    </span><span class="nl">"test"</span><span class="p">:</span><span class="w"> </span><span class="s2">"echo </span><span class="se">\"</span><span class="s2">Error: no test specified</span><span class="se">\"</span><span class="s2"> &amp;&amp; exit 1"</span><span class="p">,</span><span class="w">
    </span><span class="nl">"start:dev"</span><span class="p">:</span><span class="w"> </span><span class="s2">"nodemon index.ts"</span><span class="w">
  </span><span class="p">},</span><span class="w">
  </span><span class="nl">"keywords"</span><span class="p">:</span><span class="w"> </span><span class="p">[],</span><span class="w">
  </span><span class="nl">"author"</span><span class="p">:</span><span class="w"> </span><span class="s2">""</span><span class="p">,</span><span class="w">
  </span><span class="nl">"license"</span><span class="p">:</span><span class="w"> </span><span class="s2">"ISC"</span><span class="p">,</span><span class="w">
  </span><span class="nl">"devDependencies"</span><span class="p">:</span><span class="w"> </span><span class="p">{</span><span class="w">
    </span><span class="nl">"@types/node"</span><span class="p">:</span><span class="w"> </span><span class="s2">"^20.8.2"</span><span class="p">,</span><span class="w">
    </span><span class="nl">"nodemon"</span><span class="p">:</span><span class="w"> </span><span class="s2">"^3.0.1"</span><span class="p">,</span><span class="w">
    </span><span class="nl">"ts-node"</span><span class="p">:</span><span class="w"> </span><span class="s2">"^10.9.1"</span><span class="p">,</span><span class="w">
    </span><span class="nl">"typescript"</span><span class="p">:</span><span class="w"> </span><span class="s2">"^5.2.2"</span><span class="w">
  </span><span class="p">}</span><span class="w">
</span><span class="p">}</span><span class="w">
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



<p>Back in your terminal,  type <code>npm run start:dev</code>. If everything works fine, you should see  "Hello world"  printed on the terminal.</p>

<p>Okay, that was a lot to get a typescript project running, but now that all of that is out of the way, let's set up an HTTP server with expressjs</p>

<p>Set Up A Simple HTTP Server In ExpressJS<br>
Install Express: In your terminal, enter these commands.<br>
</p>

<div class="highlight js-code-highlight">
<pre class="highlight shell"><code>npm <span class="nb">install </span>express cors <span class="nt">--save</span> <span class="o">&amp;&amp;</span> npm <span class="nb">install</span> <span class="nt">--save-dev</span>  @types/express @types/cors
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



<p>The commands above install expressjs and cors and expressjs's typescript definitions. The cors dependency here controls which origin(websites) can talk to our HTTP server.</p>

<p>Create an HTTP Server: In the index.ts file, enter the following lines of code<br>
</p>

<div class="highlight js-code-highlight">
<pre class="highlight typescript"><code><span class="k">import</span> <span class="nx">express</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">express</span><span class="dl">'</span><span class="p">;</span>
<span class="k">import</span> <span class="nx">cors</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">cors</span><span class="dl">'</span><span class="p">;</span>

<span class="c1">// create an express app</span>
<span class="kd">const</span> <span class="nx">app</span> <span class="o">=</span> <span class="nx">express</span><span class="p">();</span>

<span class="c1">// enable cors for all HTTP verbs and origins</span>
<span class="nx">app</span><span class="p">.</span><span class="nx">use</span><span class="p">(</span><span class="nx">cors</span><span class="p">())</span>

<span class="c1">// create a default endpoint that returns a file uploads response</span>
<span class="nx">app</span><span class="p">.</span><span class="kd">get</span><span class="p">(</span><span class="dl">'</span><span class="s1">/</span><span class="dl">'</span><span class="p">,</span> <span class="p">(</span><span class="nx">req</span><span class="p">,</span> <span class="nx">res</span><span class="p">)</span> <span class="o">=&gt;</span> <span class="p">{</span>
    <span class="k">return</span> <span class="nx">res</span><span class="p">.</span><span class="nx">json</span><span class="p">({</span> <span class="na">message</span><span class="p">:</span> <span class="dl">'</span><span class="s1">welcome to file upload</span><span class="dl">'</span><span class="p">});</span>
<span class="p">})</span>

<span class="c1">// a catch-all middleware for unknown endpoints</span>
<span class="nx">app</span><span class="p">.</span><span class="nx">use</span><span class="p">(</span><span class="dl">'</span><span class="s1">*</span><span class="dl">'</span><span class="p">,</span> <span class="p">(</span><span class="nx">req</span><span class="p">,</span> <span class="nx">res</span><span class="p">)</span> <span class="o">=&gt;</span> <span class="p">{</span>
    <span class="k">return</span> <span class="nx">res</span><span class="p">.</span><span class="nx">status</span><span class="p">(</span><span class="mi">404</span><span class="p">).</span><span class="nx">json</span><span class="p">({</span> <span class="na">message</span><span class="p">:</span> <span class="dl">'</span><span class="s1">resource not found</span><span class="dl">'</span><span class="p">})</span>
<span class="p">})</span>

<span class="nx">app</span><span class="p">.</span><span class="nx">listen</span><span class="p">(</span><span class="mi">3000</span><span class="p">);</span>
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
  <a name="uploading-single-file-uploads-with-multer" href="#uploading-single-file-uploads-with-multer">
  </a>
  Uploading Single File Uploads with Multer
</h2>

<p>Of course, first, install multer. In index.ts, add the following lines of code.<br>
</p>

<div class="highlight js-code-highlight">
<pre class="highlight typescript"><code> <span class="kd">const</span> <span class="nx">uploader</span> <span class="o">=</span> <span class="nx">multer</span><span class="p">({</span> <span class="na">dest</span><span class="p">:</span> <span class="dl">'</span><span class="s1">tmp/</span><span class="dl">'</span><span class="p">});</span>

<span class="c1">// create an endpoint capable of handling a single file upload at a time</span>
<span class="nx">app</span><span class="p">.</span> <span class="nx">post</span><span class="p">(</span><span class="dl">'</span><span class="s1">/single</span><span class="dl">'</span><span class="p">,</span> <span class="nx">uploader</span><span class="p">.</span><span class="nx">single</span><span class="p">(</span><span class="dl">'</span><span class="s1">myupload</span><span class="dl">'</span><span class="p">),</span> <span class="p">(</span><span class="nx">req</span><span class="p">,</span> <span class="nx">res</span><span class="p">)</span> <span class="o">=&gt;</span> <span class="p">{</span>
    <span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="nx">req</span><span class="p">.</span><span class="nx">file</span><span class="p">);</span>
    <span class="k">return</span> <span class="nx">res</span><span class="p">.</span><span class="nx">status</span><span class="p">(</span><span class="mi">201</span><span class="p">).</span><span class="nx">json</span><span class="p">({</span> <span class="na">message</span><span class="p">:</span> <span class="dl">'</span><span class="s1">file uploaded successfully</span><span class="dl">'</span><span class="p">});</span>
<span class="p">});</span>

<span class="c1">// create a catch-all middleware that handles unhandled errors.</span>
<span class="nx">app</span><span class="p">.</span><span class="nx">use</span><span class="p">((</span><span class="nx">err</span><span class="p">:</span> <span class="nb">Error</span><span class="p">,</span> <span class="nx">req</span><span class="p">:</span> <span class="nx">express</span><span class="p">.</span><span class="nx">Request</span><span class="p">,</span> <span class="nx">res</span><span class="p">:</span> <span class="nx">express</span><span class="p">.</span><span class="nx">Response</span><span class="p">,</span> <span class="nx">next</span><span class="p">:</span> <span class="nx">express</span><span class="p">.</span><span class="nx">NextFunction</span><span class="p">)</span> <span class="o">=&gt;</span> <span class="p">{</span>
    <span class="k">if</span><span class="p">(</span><span class="nx">err</span> <span class="k">instanceof</span> <span class="nx">multer</span><span class="p">.</span><span class="nx">MulterError</span><span class="p">)</span> <span class="p">{</span>
        <span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="dl">'</span><span class="s1">Multer error occurred: </span><span class="dl">'</span><span class="p">,</span> <span class="nx">err</span><span class="p">.</span><span class="nx">stack</span><span class="p">);</span>

        <span class="k">return</span> <span class="nx">res</span><span class="p">.</span><span class="nx">status</span><span class="p">(</span><span class="mi">400</span><span class="p">).</span><span class="nx">json</span><span class="p">({</span> <span class="na">message</span><span class="p">:</span> <span class="dl">'</span><span class="s1">file upload error occurred</span><span class="dl">'</span><span class="p">});</span>
    <span class="p">}</span>

    <span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="dl">'</span><span class="s1">Unexpected error occurred: </span><span class="dl">'</span><span class="p">,</span> <span class="nx">err</span><span class="p">.</span><span class="nx">stack</span><span class="p">);</span>

    <span class="k">return</span> <span class="nx">res</span><span class="p">.</span><span class="nx">status</span><span class="p">(</span><span class="mi">500</span><span class="p">).</span><span class="nx">json</span><span class="p">({</span> <span class="na">error</span><span class="p">:</span> <span class="kc">true</span><span class="p">,</span> <span class="na">message</span><span class="p">:</span> <span class="dl">'</span><span class="s1">Something went wrong</span><span class="dl">'</span><span class="p">});</span>

<span class="p">});</span>
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



<p>The code snippet above first adds a route for single file uploads(/single). We use multer to create a middleware that automatically handles upload. The middleware writes the uploaded file into a folder called tmp in the root directory of your project based on the configuration on the first line of the snippet.</p>

<p>Note: Multer renames the file uploaded. For example, if you uploaded a file named myprofilepic.png on the server, the resulting file name would be a random string such as '97ec5eeb74caf50a093d76568c52b87d'. Multer adds the metadata of the uploaded document to the <code>request.file</code>, which contains the following sample metadata.<br>
</p>

<div class="highlight js-code-highlight">
<pre class="highlight javascript"><code><span class="p">{</span>
  <span class="nl">fieldname</span><span class="p">:</span> <span class="dl">'</span><span class="s1">myupload</span><span class="dl">'</span><span class="p">,</span>
  <span class="nx">originalname</span><span class="p">:</span> <span class="dl">'</span><span class="s1">package.json</span><span class="dl">'</span><span class="p">,</span>
  <span class="nx">encoding</span><span class="p">:</span> <span class="dl">'</span><span class="s1">7bit</span><span class="dl">'</span><span class="p">,</span>
  <span class="nx">mimetype</span><span class="p">:</span> <span class="dl">'</span><span class="s1">application/octet-stream</span><span class="dl">'</span><span class="p">,</span>
  <span class="nx">destination</span><span class="p">:</span> <span class="dl">'</span><span class="s1">tmp/</span><span class="dl">'</span><span class="p">,</span>
  <span class="nx">filename</span><span class="p">:</span> <span class="dl">'</span><span class="s1">97ec5eeb74caf50a093d76568c52b87d</span><span class="dl">'</span><span class="p">,</span>
  <span class="nx">path</span><span class="p">:</span> <span class="dl">'</span><span class="s1">tmp/97ec5eeb74caf50a093d76568c52b87d</span><span class="dl">'</span><span class="p">,</span>
  <span class="nx">size</span><span class="p">:</span> <span class="mi">594</span>
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



<p>You can read the original name of the uploaded file from the metadata and rename the upload if you wish.</p>

<p>The following middleware in the code snippet catches all unhandled errors and returns an appropriate response.</p>

<h2>
  <a name="uploading-multiple-files-uploads-with-multer" href="#uploading-multiple-files-uploads-with-multer">
  </a>
  Uploading Multiple Files Uploads With Multer
</h2>

<p>Creating a route for multiple uploads is as simple as making a route for a single upload. Replace <code>uploader.single('myupload')</code> with <code>uploader.array('uploads')</code>. To access the metadata of all uploaded files, read from <code>req.files</code>; rather than <code>req.file</code>.<br>
</p>

<div class="highlight js-code-highlight">
<pre class="highlight typescript"><code><span class="c1">// create an endpoint capable of handling multiple file upload</span>
<span class="nx">app</span><span class="p">.</span><span class="nx">post</span><span class="p">(</span><span class="dl">'</span><span class="s1">/multi</span><span class="dl">'</span><span class="p">,</span> <span class="nx">uploader</span><span class="p">.</span><span class="nx">array</span><span class="p">(</span><span class="dl">'</span><span class="s1">myuploads</span><span class="dl">'</span><span class="p">),</span> <span class="p">(</span><span class="nx">req</span><span class="p">,</span> <span class="nx">res</span><span class="p">)</span> <span class="o">=&gt;</span> <span class="p">{</span>
    <span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="nx">req</span><span class="p">.</span><span class="nx">files</span><span class="p">);</span>

    <span class="k">return</span> <span class="nx">res</span><span class="p">.</span><span class="nx">status</span><span class="p">(</span><span class="mi">201</span><span class="p">).</span><span class="nx">json</span><span class="p">({</span> <span class="na">message</span><span class="p">:</span> <span class="dl">'</span><span class="s1">files  uploaded successfully</span><span class="dl">'</span><span class="p">});</span>
<span class="p">});</span>
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



<p>How Do I Upload To Different Folders Depending On File Type With Multer<br>
The question above was the original question that led to the writing of this blog post. It reveals that my mentee still has some knowledge gap about the node standard library, especially the fs standard library.</p>

<p>Already, we know that multer helps us get any file from our client to a specific folder by default, the <code>tmp</code> folder in our case. The next problem we must solve is getting the uploaded file out of the tmp folder to where we want it to be.;  This is where the <code>fs</code> library comes into play.</p>

<p>Assuming we would like to move all files to different folders based on their extension, say all JSON files to a directory called json-files and all txt files to a directory called text-files. First, we read the uploaded files' original name from the request object and then act based on the name's extension.<br>
</p>

<div class="highlight js-code-highlight">
<pre class="highlight typescript"><code><span class="p">...</span>
<span class="kd">const</span> <span class="nx">fileNameParts</span> <span class="o">=</span> <span class="nx">req</span><span class="p">?.</span><span class="nx">file</span><span class="p">?.</span><span class="nx">originalname</span><span class="p">?.</span><span class="nx">split</span><span class="p">?.(</span><span class="dl">'</span><span class="s1">.</span><span class="dl">'</span><span class="p">);</span>
<span class="c1">// if the file has an extension, get the extension; else, make the extension an empty string</span>
<span class="kd">const</span> <span class="nx">fileExt</span> <span class="o">=</span> <span class="nx">fileNameParts</span><span class="p">?.</span><span class="nx">pop</span><span class="p">?.()</span> <span class="o">||</span> <span class="dl">''</span><span class="p">;</span>

<span class="k">switch</span><span class="p">(</span><span class="nx">fileExt</span><span class="p">.</span><span class="nx">toLowerCase</span><span class="p">())</span> <span class="p">{</span>
    <span class="k">case</span> <span class="dl">'</span><span class="s1">json</span><span class="dl">'</span><span class="p">:</span>
        <span class="c1">// Move file to json</span>
        <span class="k">break</span><span class="p">;</span>
    <span class="k">case</span>  <span class="dl">'</span><span class="s1">txt</span><span class="dl">'</span><span class="p">:</span>
        <span class="c1">// move file to text</span>
        <span class="k">break</span><span class="p">;</span>
    <span class="nl">default</span><span class="p">:</span>
        <span class="c1">// move to others</span>
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



<p>Now, with the help of the fs module, we move the files to their permanent locations.<br>
</p>

<div class="highlight js-code-highlight">
<pre class="highlight typescript"><code><span class="c1">// create the text-files folder if it doesn't exist</span>
  <span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">fs</span><span class="p">.</span><span class="nx">existsSync</span><span class="p">(</span><span class="dl">"</span><span class="s2">./text-files</span><span class="dl">"</span><span class="p">))</span> <span class="p">{</span>
        <span class="nx">fs</span><span class="p">.</span><span class="nx">mkdirSync</span><span class="p">(</span><span class="dl">"</span><span class="s2">./text-files</span><span class="dl">"</span><span class="p">);</span>
      <span class="p">}</span>

<span class="c1">// Write the uploaded file into the text-files folder</span>
   <span class="nx">fs</span><span class="p">.</span><span class="nx">writeFileSync</span><span class="p">(</span>
      <span class="s2">`./text-files/</span><span class="p">${</span><span class="nx">req</span><span class="p">.</span><span class="nx">file</span><span class="o">!</span><span class="p">.</span><span class="nx">filename</span><span class="p">}</span><span class="s2">`</span><span class="p">,</span>
      <span class="nx">fs</span><span class="p">.</span><span class="nx">readFileSync</span><span class="p">(</span><span class="s2">`./tmp/</span><span class="p">${</span><span class="nx">req</span><span class="p">.</span><span class="nx">file</span><span class="o">!</span><span class="p">.</span><span class="nx">filename</span><span class="p">}</span><span class="s2">`</span><span class="p">)</span>
    <span class="p">);</span>

<span class="c1">//Repeat the same code for JSON files and others</span>
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



<p>In the snippet above, we first check if a folder called "text-files" exists in the current director. If it doesn't exist, we create it and then write the uploaded file into this folder. </p>

<p>Here's what your final single upload route code would look like:<br>
</p>

<div class="highlight js-code-highlight">
<pre class="highlight typescript"><code><span class="c1">// create an endpoint capable of handling a single file upload at a time</span>
<span class="nx">app</span><span class="p">.</span><span class="nx">post</span><span class="p">(</span><span class="dl">"</span><span class="s2">/single</span><span class="dl">"</span><span class="p">,</span> <span class="nx">uploader</span><span class="p">.</span><span class="nx">single</span><span class="p">(</span><span class="dl">"</span><span class="s2">myupload</span><span class="dl">"</span><span class="p">),</span> <span class="p">(</span><span class="nx">req</span><span class="p">,</span> <span class="nx">res</span><span class="p">)</span> <span class="o">=&gt;</span> <span class="p">{</span>
  <span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="nx">req</span><span class="p">.</span><span class="nx">file</span><span class="p">);</span>
  <span class="kd">const</span> <span class="nx">fileNameParts</span> <span class="o">=</span> <span class="nx">req</span><span class="p">?.</span><span class="nx">file</span><span class="p">?.</span><span class="nx">originalname</span><span class="p">?.</span><span class="nx">split</span><span class="p">?.(</span><span class="dl">"</span><span class="s2">.</span><span class="dl">"</span><span class="p">);</span>
  <span class="c1">// if the file has an extension, get the extension; else, make the extension an empty string</span>
  <span class="kd">const</span> <span class="nx">fileExt</span> <span class="o">=</span> <span class="nx">fileNameParts</span><span class="p">?.</span><span class="nx">pop</span><span class="p">?.()</span> <span class="o">||</span> <span class="dl">""</span><span class="p">;</span>

  <span class="k">switch</span> <span class="p">(</span><span class="nx">fileExt</span><span class="p">.</span><span class="nx">toLowerCase</span><span class="p">())</span> <span class="p">{</span>
    <span class="k">case</span> <span class="dl">"</span><span class="s2">json</span><span class="dl">"</span><span class="p">:</span>
      <span class="c1">// move file to json</span>
      <span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">fs</span><span class="p">.</span><span class="nx">existsSync</span><span class="p">(</span><span class="dl">"</span><span class="s2">./json-files</span><span class="dl">"</span><span class="p">))</span> <span class="p">{</span>
        <span class="nx">fs</span><span class="p">.</span><span class="nx">mkdirSync</span><span class="p">(</span><span class="dl">"</span><span class="s2">./json-files</span><span class="dl">"</span><span class="p">);</span>
      <span class="p">}</span>

      <span class="nx">fs</span><span class="p">.</span><span class="nx">writeFileSync</span><span class="p">(</span>
        <span class="s2">`./json-files/</span><span class="p">${</span><span class="nx">req</span><span class="p">.</span><span class="nx">file</span><span class="o">!</span><span class="p">.</span><span class="nx">filename</span><span class="p">}</span><span class="s2">`</span><span class="p">,</span>
        <span class="nx">fs</span><span class="p">.</span><span class="nx">readFileSync</span><span class="p">(</span><span class="s2">`./tmp/</span><span class="p">${</span><span class="nx">req</span><span class="p">.</span><span class="nx">file</span><span class="o">!</span><span class="p">.</span><span class="nx">filename</span><span class="p">}</span><span class="s2">`</span><span class="p">)</span>
      <span class="p">);</span>
      <span class="k">break</span><span class="p">;</span>
    <span class="k">case</span> <span class="dl">"</span><span class="s2">txt</span><span class="dl">"</span><span class="p">:</span>
      <span class="c1">// move file to text</span>
      <span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">fs</span><span class="p">.</span><span class="nx">existsSync</span><span class="p">(</span><span class="dl">"</span><span class="s2">./text-files</span><span class="dl">"</span><span class="p">))</span> <span class="p">{</span>
        <span class="nx">fs</span><span class="p">.</span><span class="nx">mkdirSync</span><span class="p">(</span><span class="dl">"</span><span class="s2">./text-files</span><span class="dl">"</span><span class="p">);</span>
      <span class="p">}</span>
      <span class="nx">fs</span><span class="p">.</span><span class="nx">writeFileSync</span><span class="p">(</span>
        <span class="s2">`./text-files/</span><span class="p">${</span><span class="nx">req</span><span class="p">.</span><span class="nx">file</span><span class="o">!</span><span class="p">.</span><span class="nx">filename</span><span class="p">}</span><span class="s2">`</span><span class="p">,</span>
        <span class="nx">fs</span><span class="p">.</span><span class="nx">readFileSync</span><span class="p">(</span><span class="s2">`./tmp/</span><span class="p">${</span><span class="nx">req</span><span class="p">.</span><span class="nx">file</span><span class="o">!</span><span class="p">.</span><span class="nx">filename</span><span class="p">}</span><span class="s2">`</span><span class="p">)</span>
      <span class="p">);</span>
      <span class="k">break</span><span class="p">;</span>
    <span class="nl">default</span><span class="p">:</span>
      <span class="c1">// move to others</span>
      <span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">fs</span><span class="p">.</span><span class="nx">existsSync</span><span class="p">(</span><span class="dl">"</span><span class="s2">./other-files</span><span class="dl">"</span><span class="p">))</span> <span class="p">{</span>
        <span class="nx">fs</span><span class="p">.</span><span class="nx">mkdirSync</span><span class="p">(</span><span class="dl">"</span><span class="s2">./other-files</span><span class="dl">"</span><span class="p">);</span>
      <span class="p">}</span>
      <span class="nx">fs</span><span class="p">.</span><span class="nx">writeFileSync</span><span class="p">(</span>
        <span class="s2">`./text-files/</span><span class="p">${</span><span class="nx">req</span><span class="p">.</span><span class="nx">file</span><span class="o">!</span><span class="p">.</span><span class="nx">filename</span><span class="p">}</span><span class="s2">`</span><span class="p">,</span>
        <span class="nx">fs</span><span class="p">.</span><span class="nx">readFileSync</span><span class="p">(</span><span class="s2">`./tmp/</span><span class="p">${</span><span class="nx">req</span><span class="p">.</span><span class="nx">file</span><span class="o">!</span><span class="p">.</span><span class="nx">filename</span><span class="p">}</span><span class="s2">`</span><span class="p">)</span>
      <span class="p">);</span>
  <span class="p">}</span>
  <span class="k">return</span> <span class="nx">res</span><span class="p">.</span><span class="nx">status</span><span class="p">(</span><span class="mi">201</span><span class="p">).</span><span class="nx">json</span><span class="p">({</span> <span class="na">message</span><span class="p">:</span> <span class="dl">"</span><span class="s2">file uploaded successfully</span><span class="dl">"</span> <span class="p">});</span>
<span class="p">});</span>
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



<p>For multiple uploads, wrap the code above in a loop.<br>
</p>

<div class="highlight js-code-highlight">
<pre class="highlight typescript"><code><span class="p">...</span>
<span class="k">for</span> <span class="p">(</span><span class="kd">const</span> <span class="nx">file</span> <span class="k">of</span> <span class="nx">req</span><span class="p">.</span><span class="nx">files</span><span class="o">!</span><span class="p">)</span> <span class="p">{</span>
    <span class="c1">//Copy and paste the code in the single upload  here</span>
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



<p>And that is all it takes.</p>

<h2>
  <a name="final-notes" href="#final-notes">
  </a>
  Final Notes
</h2>

<p>I mentioned initially that this is a beginner tutorial, so some apparent violations of popular best practices are intentionally left in the code snippets. I did this not to veer away from the primary purpose of the blog post.</p>

<p>You will likely deploy your code on an ephemera server in the cloud, so never upload your file to your server's filesystem. Uploading files like this is only valid for quick file content processing, but 99% of the time, you need a cloud storage bucket like AWS S3 or, in some cases, a separate FTP server. Also,  remember to always clean up any temporary folders after processing their content lest you run out of disk space quickly.</p>

<h2>
  <a name="edit-12102023" href="#edit-12102023">
  </a>
  Edit: 12/10/2023
</h2>

<p>If you'd like to play with the code samples in this article, check out this <a href="https://github.com/ngfizzy/blog-demos/tree/main/file-upload-with-multer-in-nodejs">repo</a></p>
