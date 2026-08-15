---
title: "Docker and Kubernetes From Localhost To Production: Containers; The what, why, and How"
date: 2023-11-01
description: "A series about containers"
---

<p><em>Warnings:</em> <br>
<em>1. Some concepts in this article are explained like it's meant for 5-year-olds. If you're already an advanced user, this blog post is not for you.</em><br>
<em>2. If you want to see some code, scroll to the How subheading of this blog post. If everything there seems foreign to you or you don't get the point, you can come back to the very beginning.</em></p>

<p>For many people, Docker and Kubernetes are the things they learn halfway and drop, never to touch again after finding alternatives. Some, after learning it, never get to use it on their jobs because they have DevOps/platform teams, but once in a while, they pop up again. They're required to learn/relearn it. Usually, they have to relearn it from scratch.</p>

<h2>
  <a name="why-do-docker-and-kubernetes-never-stick-for-many-people" href="#why-do-docker-and-kubernetes-never-stick-for-many-people">
  </a>
  Why Do Docker and Kubernetes Never Stick For Many People?
</h2>

<p>Why is Docker and Kubernetes(especially Kubernetes) tricky for many to be proficient in? Why is it so easy to forget everything once you stop using them?</p>

<p>As humans, we learn best through association. It is easy to remember new things when you can associate that learning with a simpler but related concept. Your entire knowledge base is a tree, and new learnings need to be attached to existing branches of that tree. The reason why people forget Docker and Kubernetes(k8s) quickly is that they encapsulate the significant pillars of computer systems, i.e., Operating systems, programs(running in userland), and computer networking. My aim in this series is not to graze over these fundamental topics but to go in-depth as necessary. Understanding those basic concepts would increase your chances of not having to relearn everything from scratch each time you return to them.</p>

<h2>
  <a name="the-whats" href="#the-whats">
  </a>
  The Whats
</h2>

<p>What is</p>

<h3>
  <a name="a-container" href="#a-container">
  </a>
  A Container
</h3>

<p>A container is a basic unit of deployment. That's vague, so let's rephrase it. A container is your program coupled with a virtualized operating system alongside every other dependency needed to run it. <em>The virtualized operating system part of that definition is essential.</em></p>

<h3>
  <a name="a-container-image" href="#a-container-image">
  </a>
  A Container Image:
</h3>

<p>A container image is "an executable", runnable by a  container Engine.</p>

<h3>
  <a name="a-container-enginecontainer-runtime" href="#a-container-enginecontainer-runtime">
  </a>
  A Container Engine/Container Runtime:
</h3>

<p>A container engine is a program that knows how to build and execute a container image.</p>

<h3>
  <a name="docker" href="#docker">
  </a>
  Docker
</h3>

<p>Docker is a container technology company. The  Container engine they created is called the <strong>Docker Engine</strong>; a container image built with docker-engine is called <strong>Docker Image</strong>. An executed Docker image is called a <strong>Docker Container</strong>.</p>

<h3>
  <a name="a-dockerfile" href="#a-dockerfile">
  </a>
  A DockerFile
</h3>

<p>A docker file contains information on what a docker image should have.</p>

<h3>
  <a name="lets-relearn-all-the-concepts-above-by-associating-it-with-what-we-already-know-from-bottom-back-to-the-top" href="#lets-relearn-all-the-concepts-above-by-associating-it-with-what-we-already-know-from-bottom-back-to-the-top">
  </a>
  Let's  Relearn All The Concepts Above By Associating It With What We Already Know From Bottom Back To The Top
</h3>

<p>I assume anyone reading this article has written a program at some point, so let's compare the process of creating a program to creating a container.</p>

<ul>
<li>To write a C program, you must first write some instructions in a .c file.

<ul>
<li>A docker file is the source code that contains instructions about what a docker image should have, which is usually a description of the OS your program is built to run on, the dependencies of your program, your program itself, and an instruction about how to start it.</li>
</ul>


</li>

<li>

<p>To transform your C source file into something your machine can understand, you must build the .c file using a c compiler.</p>

<ul>
<li>To transform your DockerFile to a docker image, you must "compile" it with the "docker image builder." The builder comes with the docker engine, and you have access to it through <strong>docker-cli</strong>
</li>
</ul>


</li>

<li>

<p>To run the C executable, you can either open a command line interface and call the executable directly or, if you have access to a GUI, you will double-click on the executable.</p>

<ul>
<li>To run the docker image, you run it through docker-cli.</li>
</ul>


</li>

</ul>

<h2>
  <a name="the-why" href="#the-why">
  </a>
  The Why
</h2>

<h3>
  <a name="i-already-know-how-to-run-a-program-on-a-computer-why-do-i-also-need-to-run-it-in-a-container" href="#i-already-know-how-to-run-a-program-on-a-computer-why-do-i-also-need-to-run-it-in-a-container">
  </a>
  I already know how to run a program on a computer; why do I also need to run it in a container?
</h3>

<p>Yes, you could rent a physical machine and run your web app on it. Well, these days, cloud companies will only give you that deal if you're Facebook or Netflix. If you're a regular Joe like me who wants to run a portfolio website, you won't get a contract to run it on a physical server. </p>

<h3>
  <a name="yes-i-know-this-already-but-these-businesses-can-still-run-multiple-programs-on-a-single-machine" href="#yes-i-know-this-already-but-these-businesses-can-still-run-multiple-programs-on-a-single-machine">
  </a>
  Yes, I know this already, but these businesses can still run multiple programs on a single machine.
</h3>

<p>Yes, they can. There is already a business model for this. It's called Shared Hosting. In this hosting model, the provider runs multiple customer programs on a single machine. This model is more cost-effective for both you(the customer) and the service provider but not suitable for fast-growing startups. One downside to this approach is that websites with heavy traffic might use the shared server resources (CPU and memory), leaving your website with little to no resources. </p>

<p>Another issue that arises in shared hosting is security. A customer running a malicious program on the same server as yours can also infect your website. Of course, these businesses take measures against worse-case scenarios like this, but it requires the expertise of specialized system admins. </p>

<p>Programs running in containers, on the other hand, by default don't have this problem because a container is a completely isolated environment, and resource limits can be easily assigned to the container as part of their startup instructions.</p>

<h3>
  <a name="talking-about-isolation-and-resource-allocation-isnt-that-achievable-through-virtual-machines-why-do-i-still-need-containers" href="#talking-about-isolation-and-resource-allocation-isnt-that-achievable-through-virtual-machines-why-do-i-still-need-containers">
  </a>
  Talking about Isolation and resource allocation, isn't that achievable Through Virtual Machines? Why Do I Still Need Containers?
</h3>

<p>Yes, there is also already a business model for that. Today, you can rent a virtual machine on any cloud platform. They give these things different marketing names, like EC2 on AWS or Cloud Compute Engine on Google  Cloud. Irrespective of what cloud platforms call it, you get a virtual machine running some open-source or proprietary distribution of the Linux operating system.</p>

<h3>
  <a name="so-if-virtual-machines-solve-the-problem-with-shared-hosting-why-do-you-still-need-containers" href="#so-if-virtual-machines-solve-the-problem-with-shared-hosting-why-do-you-still-need-containers">
  </a>
  So, if virtual machines solve the problem with shared hosting, why do you still need containers?
</h3>

<p>Well, businesses are always trying to do two things: make more money and spend less money. Virtual machines virtualize the hardware, so for every virtual machine running on a physical machine, at the very minimum, a virtual CPU, memory, hard drive, and a virtual ROM containing a virtual bootloader would be created. The virtual machine also boots up a full-fledged operating system just to run a Hello World program. Also, for every client hosting software on a physical machine, a new virtual machine would have to be provisioned for them.</p>

<p>All of these leave a huge resource footprint on the host machine. So, in 2006, google added more features to an existing Linux OS kernel feature called namespaces.<br>
Additionally, they implemented something called cgroups. Those two features enabled system administrators to run programs in isolation without hardware virtualization. That work serves as the foundation for container technologies. I would dive deeper into cgroups and namespaces later in this series.</p>

<p>So, with containers, cloud service providers don't need to provision a virtual machine for each customer. With the help of container technologies taking advantage of namespaces and cgroups, you can run your programs in isolated environments with a much lower resource footprint. Additionally, since containers are just programs with limited access to system resources, they have a faster startup time than virtual machines. This kind of efficiency translates to substantial cost savings on hardware for cloud service providers at the same time, allows them to provide cheaper offerings to you, the customer.</p>

<p>Follow the money, my friends; it will lead you to the answers to most modern tech questions. 🙊</p>

<h4>
  <a name="do-container-technologies-solve-the-but-it-works-on-my-machine-problem" href="#do-container-technologies-solve-the-but-it-works-on-my-machine-problem">
  </a>
  Do Container Technologies Solve the: "But it works on my machine problem"
</h4>

<p>From my experience, yes, <strong>it could</strong>, but it takes some proficiency to containerize your application such that it works the same way everywhere outside your machine. In short, dockerizing your application does not automatically solve that problem.</p>

<h3>
  <a name="the-how" href="#the-how">
  </a>
  The How
</h3>

<p>Talk is cheap; show me some code.<br>
<em>Prerequisite: Make sure you have docker desktop installed.</em></p>

<h4>
  <a name="step-1-lets-create-a-simple-echo-server-in-nodejs" href="#step-1-lets-create-a-simple-echo-server-in-nodejs">
  </a>
  Step 1: Let's create a simple echo server in nodejs
</h4>



<div class="highlight js-code-highlight">
<pre class="highlight javascript"><code><span class="c1">// index.js</span>
<span class="kd">const</span> <span class="nx">http</span> <span class="o">=</span> <span class="nf">require</span><span class="p">(</span><span class="dl">'</span><span class="s1">http</span><span class="dl">'</span><span class="p">)</span>

<span class="nx">http</span><span class="p">.</span><span class="nf">createServer</span><span class="p">((</span><span class="nx">req</span><span class="p">,</span> <span class="nx">res</span><span class="p">)</span> <span class="o">=&gt;</span> <span class="p">{</span>
    <span class="kd">const</span> <span class="p">{</span><span class="nx">method</span><span class="p">}</span> <span class="o">=</span> <span class="nx">req</span><span class="p">;</span>
    <span class="k">if</span><span class="p">(</span><span class="nx">method</span><span class="p">.</span><span class="nf">toLowerCase</span><span class="p">()</span> <span class="o">===</span> <span class="dl">'</span><span class="s1">get</span><span class="dl">'</span><span class="p">)</span> <span class="p">{</span>
        <span class="nx">res</span><span class="p">.</span><span class="nx">statusCode</span> <span class="o">=</span> <span class="mi">200</span>
        <span class="k">return</span> <span class="nx">res</span><span class="p">.</span> <span class="nf">end</span><span class="p">()</span>
    <span class="p">}</span>

    <span class="kd">const</span> <span class="nx">chunks</span> <span class="o">=</span> <span class="p">[]</span>
    <span class="nx">req</span><span class="p">.</span><span class="nf">on</span><span class="p">(</span><span class="dl">'</span><span class="s1">data</span><span class="dl">'</span><span class="p">,</span> <span class="p">(</span><span class="nx">chunk</span><span class="p">)</span> <span class="o">=&gt;</span> <span class="p">{</span>
        <span class="nx">chunks</span><span class="p">.</span><span class="nf">push</span><span class="p">(</span><span class="nx">chunk</span><span class="p">)</span>
    <span class="p">})</span>
    <span class="p">.</span><span class="nf">on</span><span class="p">(</span><span class="dl">'</span><span class="s1">end</span><span class="dl">'</span><span class="p">,</span> <span class="p">()</span> <span class="o">=&gt;</span> <span class="p">{</span>
        <span class="nx">res</span><span class="p">.</span><span class="nx">statusCode</span> <span class="o">=</span> <span class="mi">200</span>
        <span class="k">return</span> <span class="nx">res</span><span class="p">.</span><span class="nf">end</span><span class="p">(</span><span class="nx">Buffer</span><span class="p">.</span><span class="nf">concat</span><span class="p">(</span><span class="nx">chunks</span><span class="p">).</span><span class="nf">toString</span><span class="p">());</span>
    <span class="p">})</span>
<span class="p">})</span>
<span class="p">.</span><span class="nf">listen</span><span class="p">(</span><span class="mi">5001</span><span class="p">,</span> <span class="p">()</span> <span class="o">=&gt;</span> <span class="p">{</span>
    <span class="nx">console</span><span class="p">.</span><span class="nf">log</span><span class="p">(</span><span class="dl">'</span><span class="s1">started server at localhost:5001</span><span class="dl">'</span><span class="p">)</span>
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



<p>To test that our echo server works, run <code>node index.js</code> and then in another terminal, run <code>curl -d 'hello world" loalhost:5001</code>. The server should echo back "hello world" to you.</p>

<h4>
  <a name="step-2-write-the-requirements-of-your-docker-image-in-a-dockerfile" href="#step-2-write-the-requirements-of-your-docker-image-in-a-dockerfile">
  </a>
  Step 2: Write the requirements of your docker image in a Dockerfile
</h4>



<div class="highlight js-code-highlight">
<pre class="highlight docker"><code>  1 FROM node:20.9.0-alpine-3.18
  2
  3 WORKDIR /web
  4 COPY ./index.js ./index.js
  5
  6 ENTRYPOINT ["node," "./index.js"]
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



<p>Starting from line one</p>

<ul>
<li>We instructed Docker to pull nodejs 20.9 from the docker hub. If "docker hub" sounds foreign,  consider it as GitHub for docker images. That nodejs image is the base(or foundation) to build our application image. A Dockerfile always starts with the <code>FROM</code> instruction.</li>
<li>Next, we define the default working directory of the container. The working directory is the default directory when your container starts. This is similar to the <code>$HOME</code> directory in the Linux operating system or the <code>~</code> directory on Mac.</li>
<li>Next, we copy our source code into a docker image.
And finally, on line six, we tell Docker the command to run when our application container starts up.</li>
</ul>

<h4>
  <a name="step-3-build-the-image-using-the-dockerfile-we-just-created-run-the-following-command" href="#step-3-build-the-image-using-the-dockerfile-we-just-created-run-the-following-command">
  </a>
  Step 3: Build the image using the DockerFile we just created; run the following command
</h4>



<div class="highlight js-code-highlight">
<pre class="highlight shell"><code>docker build <span class="nt">-f</span> Dockerfile <span class="nb">.</span> <span class="nt">-t</span> node-echo<span class="sb">`</span>
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



<p>The <code>-f</code> argument specifies where the Dockefile is located, in this case the current directory.<br>
The <code>.</code> specifies the execution context of the build process, i.e., the folder where the source code(or executable) of your application lives. The command above assumes you're running the "docker build" in the same folder as your source code.<br>
The <code>-t</code> argument assigns a name to the resulting image.<br>
To see information about the resulting image, run <code>docker images</code><br>
The output should be similar to what is in the screenshot below</p>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fhgbgkwl6rrsvzzwv4cz4.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fhgbgkwl6rrsvzzwv4cz4.png" alt="docker images" loading="lazy"></a></p>

<h4>
  <a name="step-4-create-a-running-container-with-the-image" href="#step-4-create-a-running-container-with-the-image">
  </a>
  Step 4: Create a running container with the image
</h4>



<div class="highlight js-code-highlight">
<pre class="highlight shell"><code>docker run <span class="nt">-t</span> <span class="nt">-i</span> <span class="nt">-p</span> 5001:5001 node-echo
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



<p>Breaking that command down,</p>

<ul>
<li>The <code>-t</code> flag allocates a pseudo-tty to the docker container. Assigning a pseudo-tty is a "Linuxy" way of saying, "We allow our program, in this case our container, to accept input from the keyboard.</li>
<li>The -i flag instructs docker that we want to keep the container's <em>stdin</em> open. For beginners, stdin is where your keyboard input goes to.</li>
<li>The <code>-p 5001:5001</code> publishes port 5001 on the container to port 5001 to the host's operating system. That's also a fancy way of saying that we want users to be able to send HTTP requests to port 5001 in the container via port 5001 on the host operating system. This part is essential because, by default, everything running a container, including the network configurations of a container, is isolated from that of the host machine. To expose anything inside the container to the host machine, we need to let the docker engine know we intend to expose it.</li>
<li>
<code>node-echo</code> is the docker image we are executing
After running that command, our echo server should start up quickly. Sending a request to our server like so, <code>curl -d "hello" localhost:5001</code> should send the word hello back to us.</li>
</ul>

<h4>
  <a name="edit-1102023" href="#edit-1102023">
  </a>
  Edit 1/10/2023
</h4>

<p>You can play with the full sourcecode <a href="https://github.com/ngfizzy/blog-demos/tree/main/docker-and-k8s-from-localhost-to-prod/node-echo" target="_blank" rel="noopener noreferrer">here</a></p>

<h2>
  <a name="kubernetes" href="#kubernetes">
  </a>
  Kubernetes
</h2>

<p>Kubernetes is a container orchestration tool for automating the deployment and management of containers. Usually, you don't deploy only one container in the modern web; you deploy tens to hundreds of them, and they have to work in a coordinated manner. This is the job of Kubernetes. I know those words do not hold significant meanings if you're a beginner, but this blog post is too long, so I'll pick up from here in the next part of this series.</p>

<h2>
  <a name="summary" href="#summary">
  </a>
  Summary
</h2>

<p>In this first part of the series, we learned what a container is, why we need a container, the problems container technologies solve, and how you can create a simple nodejs server container using docker. We also introduced Kubernetes. We have just scratched the surface of this subject, so stay tuned for more parts.</p>
