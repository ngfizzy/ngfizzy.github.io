---
title: "Kubernetes Services; Expose your app to the Internet"
date: 2023-11-23
description: "A deeper dive into Kubernetes services"
---

<p>In the <a href="https://dev.to/ngfizzy/docker-and-kubernetes-from-localhost-to-production-kubernetes-container-orchestrators-the-what-why-and-how-42gg">last articles</a> in this series, we talked about the main pillars of Kubernetes: Cluster, control pane, nodes, workloads, pods,  containers, and services. We dockerized a simple nodejs echo server and ran it on our machine inside a single-node Kubernetes cluster. In this article, we run that same workload in a Kubernetes cluster in the Cloud, but before that, let's talk about a topic I graced on quickly in the last article: Services.</p>

<h2>
  <a name="kubernetes-services" href="#kubernetes-services">
  </a>
  Kubernetes Services.
</h2>

<p>While writing the <a href="https://dev.to/ngfizzy/docker-and-kubernetes-from-localhost-to-production-kubernetes-container-orchestrators-the-what-why-and-how-42gg">last articles</a>, I realized that the word "service" is overloaded in tech; It could mean a web backend application, a daemon running in an OS, a cloud offering, or even a module in a codebase. A "Service" is also a thing in Kubernetes that differs from all the meanings above. For clarity, we would be very specific when discussing "Services" in Kubernetes. We would call them k8s-Services</p>

<h3>
  <a name="what-is-a-k8sservice" href="#what-is-a-k8sservice">
  </a>
  What is a K8S-Service?
</h3>

<p>A k8s-service is an abstraction that controls communication with a target group of Pods within a cluster and the exposure of those pods outside a Cluster. To be more specific, a k8s-service abstracts the networking of related pods.</p>

<h3>
  <a name="why-do-we-need-k8sservices" href="#why-do-we-need-k8sservices">
  </a>
  Why Do We Need K8s-Services
</h3>

<p>In the last part of this series, we mentioned that a Pod gets assigned a unique IP address that we can use to communicate with the Pod inside the Cluster. Why can't we talk to pods directly using their IP addresses? Yes, we can, but we shouldn't. Pods, by nature, are short-lived. They come in and out of existence depending on many factors. Factors like</p>

<ol>
<li><p><strong>The Pod's health:</strong> If it maxes out its allocated memory and CPU, it will stop receiving traffic. Once Kubernetes detects this, it kills that Pod and replaces it with a new one.</p></li>
<li><p><strong>Initial Configuration Of The Deployment That Started The Pod:</strong> Pods are usually started as deployment members. A deployment is a Kubernetes configuration that describes the desired state of a pod, including when we would like to have a replica. In a deployment, it is possible to specify the number of pods you want when a specific event occurs. For example, one can add a configuration like this: "If the total % of CPU usage goes up to 60%, create a new replica of this Pod to handle extra requests". In the configuration described above, replicas of a pod are expected to come in and out of existence depending on how intensively each Pod is being used.</p></li>
</ol>

<p>Each new Pod replica gets a unique IP address, so using Pod's IP addresses is unreliable as a new replica receives a new IP Address. See the image below.</p>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fvud03ba8t17n53tjcis2.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fvud03ba8t17n53tjcis2.png" alt="Problem with using PodIP for comminication" loading="lazy"></a></p>

<p>K8s-services solve the problem described above. To ensure that we can communicate with a group of Pods without manually keeping track of the Pods' IP addresses, we must create a k8s-service that sits between a request and the destination Pods. Like Pods, k8s-services get assigned unique IP addresses on creation, but unlike Pods, k8s-services  are not ephemera because nothing capable of crashing is running inside them. They are there until deleted. They are just a data structure translated to a network routing configuration on the operating system.</p>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fznefpmdkeg13sjgapxyh.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fznefpmdkeg13sjgapxyh.png" alt="illustration of k8s-service" loading="lazy"></a></p>

<p>With the setup in the image above, clients of Pod replicas do not need to remember the IP address of each Pod. That responsibility is given to k8s-service. Clients only need to remember the k8s-service's IP address.</p>

<blockquote>
<p>Geek Bit ℹ️: The image above shows that k8s-services keep track of destination pod IP addresses in a table. While most of the diagram oversimplifies a Kubernetes cluster, this part is literal. A component of Kubernetes called Kubeproxy is responsible for translating the specification of your k8s-service to a network configuration. The configuration is usually implemented on your OS as a NAT iptable or as ipvs. Most cloud services providers like AWS and Google run kubeproxy in NAT IPTable mode. If you're running Kubernetes on Linux, you can view the translation of your k8s-service configuration as NAT table by running <code>sudo iptables -t nat -L KUBE-SERVICES -n  | column -t</code>. As a Kubernetes user. Of course, you are usually not concerned about this implementation detail unless you're an administrator. </p>
</blockquote>

<h2>
  <a name="types-of-k8sservice" href="#types-of-k8sservice">
  </a>
  Types Of k8s-Service
</h2>

<h3>
  <a name="clusterip-k8sservice" href="#clusterip-k8sservice">
  </a>
  ClusterIP K8S-Service
</h3>

<p>Whenever you create a k8s-service without specifying the type, the  ClusterIP k8s-service is the type that Kubernetes would create. When you create a ClusterIP k8s-service, Kubernetes assigns a private static IP address to the k8s-service, which routes the request to matching pods. <em>ClusterIPs only allow communication within the Cluster</em>; Machines outside the Cluster cannot communicate with Pods through ClusterIP k8s service by default unless you allow this through something called an <code>ingress.</code> We will cover ingresses in another part of this series. See the illustration below.</p>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fpq3p4n35jj34ozlq8817.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fpq3p4n35jj34ozlq8817.png" alt="ClusterIP Illustration" loading="lazy"></a></p>

<h4>
  <a name="defining-a-clusterip-in-kubernetes" href="#defining-a-clusterip-in-kubernetes">
  </a>
  Defining a ClusterIP in Kubernetes
</h4>

<p>This example edits the k8s-service example in the last article.<br>
<em>file_name: node-echo-service.yaml</em></p>

<div class="highlight js-code-highlight">
<pre class="highlight yaml"><code>

<span class="na">apiVersion</span><span class="pi">:</span> <span class="s">v1</span>
<span class="na">kind</span><span class="pi">:</span> <span class="s">Service</span>
<span class="na">metadata</span><span class="pi">:</span>
  <span class="na">name</span><span class="pi">:</span> <span class="s">node-echo-service</span>
<span class="na">spec</span><span class="pi">:</span>
  <span class="na">selector</span><span class="pi">:</span>
    <span class="na">app</span><span class="pi">:</span> <span class="s">node-echo</span> <span class="c1"># the label of the group of pods that this service maps to</span>
  <span class="na">ports</span><span class="pi">:</span>
    <span class="pi">-</span> <span class="na">port</span><span class="pi">:</span> <span class="s">80</span>
      <span class="na">targetPort</span><span class="pi">:</span> <span class="m">5001</span>


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

<p><code>selector: app: node-echo</code> instructs Kubernetes to put this <strong>ClusterIP k8s-service</strong> in front of any pod with the label <code>app=node-echo</code>. <code>port:80</code> is the port the service binds to. <code>targetPort:50001</code> is the port that our container is listening on; that is where the k8s-service will forward traffic to</p>

<p>To create the service, run <code>kubectl apply -f node-echo-service. yaml</code>. If the configuration does not contain a syntax error, you should get an output that says <code>service/node-echo-service created</code> on your terminal.</p>

<p>To confirm the creation of our service, type</p>

<div class="highlight js-code-highlight">
<pre class="highlight shell"><code>

kubectl get services


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

<p>You should see the following output.</p>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fop283t2hzi00q9jkcnlj.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fop283t2hzi00q9jkcnlj.png" alt="kubectl get services nodeip" loading="lazy"></a></p>

<blockquote>
<p>Geek Bit ℹ️: Pay attention attention, especially to the external IP column. Notice that the value is none. Also, notice that the ClusterIP column is a class A private IP address. Networking 101: Private IPs are only used in LAN. The Kubernetes Cluster's network is the LAN in this scenario. This ClusterIP k8s-service cannot receive internet traffic by default. The other two kinds of k8s services are built on top of ClusterIPs.</p>
</blockquote>

<h3>
  <a name="nodeport-k8sservice" href="#nodeport-k8sservice">
  </a>
  NodePort K8S-Service
</h3>

<p>NodePort k8s-Services builds on top of ClusterIP. In addition to getting a static private IP address, the NodePort  k8s-service receives traffic from outside the Kubernetes cluster by opening up a Port in every Node. The traffic from these open ports can hit any node, and the service can forward requests to the available matching Pods. When configuring a NodePort k8s-service, we must provide three ports.</p>

<p><strong>targetPort</strong>: The destination port of the matching pods. Usually, the port that your container is running on<br>
port: The port that the k8s service binds to<br>
<strong>nodePort</strong>: The port on each Node that accepts public traffic</p>

<p>See the the illustration below.</p>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fta6nplp8c3kyk7sv8gdb.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fta6nplp8c3kyk7sv8gdb.png" alt="NodePort k8s-service" loading="lazy"></a></p>

<blockquote>
<p>💡 I like to describe NodePort K8s-Service as a k8s-service whose public IP address is the address of every Node in the Kubernetes Cluster.</p>
</blockquote>

<p>Although NodePort k8s-services allow clients from outside the Cluster to communicate with our Pods,  they are not production-ready for the following reasons:</p>

<ol>
<li>NodePort k8s-services only allow traffic from ports 30000 to 32767. Those are non-standard ports in a production environment. Browsers and HTTP clients look at port 80 by default and port  443 for HTTPS. Any other port would require users to be specific. Imagine having to remember the port of every website that you visit</li>
<li>NodePort k8s-service receives internet traffic through all the Nodes available in the Cluster. This is problematic in production because clients must keep track of all those IP addresses. At the very least, you need a static, permanent, public IP address associated with the K8S-service for your workload to be production-ready. You can achieve this through the creation of an Ingress(don't think about this for now) or using the next k8s-service type called LoadBalancer</li>
</ol>

<h4>
  <a name="defining-a-nodeport-k8sservice" href="#defining-a-nodeport-k8sservice">
  </a>
  Defining a NodePort K8s-service
</h4>

<p>To define a NodePort k8s-service, we need to add two new properties to the configuration in the ClusterIP section.</p>

<ol>
<li>Under the spec property, add the property "type" whose value is NodePort, i.e., <code>type: NodePort</code> </li>
<li>Under the port object, add the property "nodePort", whose value is any port you choose, i.e., <code>nodePort: 30000</code>
</li>
</ol>

<p><em>file_name: node-echo-service.yaml</em></p>

<div class="highlight js-code-highlight">
<pre class="highlight yaml"><code>

<span class="na">apiVersion</span><span class="pi">:</span> <span class="s">v1</span>
<span class="na">kind</span><span class="pi">:</span> <span class="s">Service</span>
<span class="na">metadata</span><span class="pi">:</span>
  <span class="na">name</span><span class="pi">:</span> <span class="s">node-echo-service</span>
<span class="na">spec</span><span class="pi">:</span>
  <span class="na">type</span><span class="pi">:</span> <span class="s">NodePort</span> <span class="c1"># telling k8s that we are talking about NodePort</span>
  <span class="na">selector</span><span class="pi">:</span>
    <span class="na">app</span><span class="pi">:</span> <span class="s">node-echo</span> <span class="c1"># the label of the group of pods that this service maps to</span>
  <span class="na">ports</span><span class="pi">:</span>
    <span class="pi">-</span> <span class="na">port</span><span class="pi">:</span> <span class="s">80</span>
      <span class="na">targetPort</span><span class="pi">:</span> <span class="m">5001</span>
       <span class="na">nodePort</span><span class="pi">:</span> <span class="m">30000</span> <span class="c1"># The port port that receives traffic from the internet</span>


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

<blockquote>
<p>Note: If you skip the <code>nodePort</code> property, Kubernetes will automatically choose your value.</p>
</blockquote>

<p>Submit the new configuration to Kubernetes by running <code>kubectl apply-f node-echo-service.yaml</code>. If your configuration contains no syntax error, you should get an output that says <code>service/node-echo-service configured.</code></p>

<p>To see the result, run <code>kubectl get services node-echo-service -o wide</code>. Your result should look similar to the screenshot below.</p>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fjd3yfe5rf3qc75bsl0ti.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fjd3yfe5rf3qc75bsl0ti.png" alt="Kubectl get services node-echo-service -o wide" loading="lazy"></a></p>

<p>Pay attention to the type and the port column. The type column now says "NodePort," the ports column maps the k8s-service's port 80 to port 30000 on our machine.</p>

<p>We can now communicate with our workload by running <code>curl -d "amazing" 127.0.0.1:30000</code></p>

<blockquote>
<p>GeekBit ℹ️: NodePort is not useless in production; it's just not unsuitable for most web applications. Assuming I run a compute-intensive workload(say, image processing) in Kubernetes, I have dedicated an entire Cluster to this workload. I want to balance incoming tasks across Nodes so that every Node in the cluster always has the same number of tasks running inside them. I'd go for a NodePort k8s-service and set the <code>externalTrafficPolicy</code> to <code>Local</code>, ensuring that traffic to a Node only fulfills a request inside that Node. Finally, I'd put a network load balancer in front of the k8s-service. Of course, don't worry about it if you don't understand everything. Keep following this series, and it'll eventually make sense.</p>
</blockquote>

<h3>
  <a name="loadbalancer-k8sservice" href="#loadbalancer-k8sservice">
  </a>
  LoadBalancer K8s-service
</h3>

<p>With the LoadBalancer K8s-Service type, Kubernetes assigns it a static public IP address. This is what we want in production for web servers 🤗. The IP address is then announced across the underlying network infrastructure.<br>
See the illustration below.</p>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fogte0drsqtbyh3bdszwr.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fogte0drsqtbyh3bdszwr.png" alt="LoadBalancer Service Type" loading="lazy"></a></p>

<blockquote>
<p>⚠️ Note that Kubernetes doesn't come by default with a network Loadbalancer, so one would usually have to install a plugin such as <code>metallb</code> for load balancing <em>but you don't need to worry about this since your cloud provider would have made this available to your Cluster by default</em></p>
</blockquote>

<p>There are two other types of Kubernetes services which I am intentionally skipping in this part. As we dive deeper into Kubernetes networking in the future, I will talk about these in more detail.</p>

<h4>
  <a name="defining-a-loadbalancer-k8sservice" href="#defining-a-loadbalancer-k8sservice">
  </a>
  Defining a LoadBalancer K8s-service
</h4>

<p>To define a k8s-service of type LoadBalancer,  take the yaml config file from the NodePort section and </p>

<ol>
<li>Change the <code>type</code> from NodePort to <code>LoadBalancer,</code> i.e. <code>type: LoadBalancer</code>
</li>
<li>remove the <code>nodePort</code> property. The resulting yaml should look like so</li>
</ol>

<p><em>file_name: node-echo-service.yaml</em></p>

<div class="highlight js-code-highlight">
<pre class="highlight yaml"><code>

<span class="na">apiVersion</span><span class="pi">:</span> <span class="s">v1</span>
<span class="na">kind</span><span class="pi">:</span> <span class="s">Service</span>
<span class="na">metadata</span><span class="pi">:</span>
  <span class="na">name</span><span class="pi">:</span> <span class="s">node-echo-service</span>
<span class="na">spec</span><span class="pi">:</span>
  <span class="na">type</span><span class="pi">:</span> <span class="s">LoadBalancer</span>
  <span class="na">selector</span><span class="pi">:</span>
    <span class="na">app</span><span class="pi">:</span> <span class="s">node-echo</span> <span class="c1"># the label of the group of pods that this service maps to</span>
  <span class="na">ports</span><span class="pi">:</span>
    <span class="pi">-</span> <span class="na">port</span><span class="pi">:</span> <span class="s">80</span>
      <span class="na">targetPort</span><span class="pi">:</span> <span class="m">5001</span>


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

<p>Apply the configuration by running <code>kubectl apply -f node-echo-service.yaml</code>. You should get the following output; <code>service/node-echo-service configured</code></p>

<p>Running <code>kubectl get services node-echo-service -o wide</code>, you should get an output similar to the screenshot below.</p>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fxwq179qofeu52f8vi2oz.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fxwq179qofeu52f8vi2oz.png" alt="load balancer" loading="lazy"></a></p>

<p>Observe the external ip column. Now it says <code>localhost</code>; This is because I don't have a load balancer installed in the Cluster, but you would get a public IP address in the Cloud.<br>
If we run <code>curl -d "load balancers are amazing" localhost</code> without specifying any port, we should get those exact words echoed back to us. </p>

<h2>
  <a name="deploying-our-kubernetes-workload-to-the-cloud" href="#deploying-our-kubernetes-workload-to-the-cloud">
  </a>
  Deploying our Kubernetes Workload to the Cloud
</h2>

<p>From the <a href="https://dev.to/ngfizzy/containers-the-what-why-and-how-391n">first part of this series</a> to this particular article, we have learned the very basics things we need to nail down to deploy stuff workloads to a Kubernetes Cluster in the Cloud. Now it's time to do the do. Let's take our workload to the Cloud.</p>

<p>I chose Google Cloud for this demo because I've had more experience with Kubernetes on GCP.</p>

<h3>
  <a name="step-1-set-up-the-projects-we-want-to-deploy" href="#step-1-set-up-the-projects-we-want-to-deploy">
  </a>
  Step 1: Set up the projects we want to deploy
</h3>

<p>We will be using the <a href="https://github.com/ngfizzy/blog-demos/tree/main/docker-and-k8s-from-localhost-to-prod/k8s-node-echo" target="_blank" rel="noopener noreferrer">project we used</a> in <a href="https://dev.to/ngfizzy/docker-and-kubernetes-from-localhost-to-production-kubernetes-container-orchestrators-the-what-why-and-how-42gg">the previous part</a>.</p>

<ol>
<li><p>Clone the repository and duplicate the folder "k8s-node-echo</p></li>
<li><p>Rename the duplicate folder with a name of your choice. I'm calling mine "k8s-node-echo-with-loadbalancer".</p></li>
<li><p><code>cd</code> into the <code>k8s-node-echo-with-loadbalancer</code></p></li>
</ol>

<h3>
  <a name="step-2-build-the-project-as-a-docker-image" href="#step-2-build-the-project-as-a-docker-image">
  </a>
  Step 2: Build The Project As a Docker Image
</h3>

<ol>
<li><p>Create a <a href="https://hub.docker.com" target="_blank" rel="noopener noreferrer">Docker Hub account</a> - Docker Hub, like GitHub for Docker Images. This is where we would push our docker image. Note: DockerHub is not the only place we can push our images, just as GitHub is not the only place to push our code. Docker hub is just one of the popular destinations for your open-source docker images. <em>Take note of your username while signing up. It would be useful later on</em></p></li>
<li><p>Log in to your docker hub account on your docker desktop. Click on the Login icon on the docker hub UI, as shown in the screenshot below. <a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Femi7cshj6nnr84nbd3zx.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Femi7cshj6nnr84nbd3zx.png" alt="Docker desktop login" loading="lazy"></a></p></li>
<li><p>Back in your terminal, in our project folder, run the following command </p></li>
</ol>

<div class="highlight js-code-highlight">
<pre class="highlight shell"><code>

 build <span class="nt">-f</span> Dockerfile <span class="nb">.</span> <span class="nt">-t</span> &lt;yourdockerhubusername&gt;/node-echo:v1 <span class="nt">-t</span> &lt;yourdockerhubusername&gt;/node-echo:latest


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

<p>For example, for me, that would be</p>

<div class="highlight js-code-highlight">
<pre class="highlight shell"><code>

docker build <span class="nt">-f</span> Dockerfile  <span class="nb">.</span> <span class="nt">-t</span> ngfizzy/node-echo:v1 <span class="nt">-t</span> ngfizzy/node-echo:latest


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

<blockquote>
<p>🚨 If you're working on an M1 and above Macbook, remember to add the <code>--platform linux/amd</code> flag, i.e <code>docker build --platform linux/amd -f Dockerfile. -t ngfizzy/node-echo:v1 -t</code>. This is because arm architecture(which m1 chips are based on) is not the default chip most cloud service providers use.</p>
</blockquote>

<p>The -t flag specifies the name of your image. The image name contains three parts.<br>
<strong>ngfizzy</strong>: your docker hub username<br>
<strong>node</strong>-echo: our application name<br>
<strong>v1</strong>: the version of our application</p>

<p>The second -t option only aliases v1 as the latest version.</p>

<p>Running <code>docker images | grep "REPOSITORY\|ngfizzy"</code> should show you more information about the image you just built, like the screenshot below</p>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fipr4xf8nfazbhf2hufvd.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fipr4xf8nfazbhf2hufvd.png" alt="Docker images" loading="lazy"></a></p>

<h3>
  <a name="step-4-push-the-image-to-docker-hub" href="#step-4-push-the-image-to-docker-hub">
  </a>
  Step 4: Push the image to Docker Hub
</h3>

<p>Run </p>

<div class="highlight js-code-highlight">
<pre class="highlight shell"><code>

docker push ngfizzy/node-echo:v1


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

<p>If everything works out, your output should look similar to mine in the screenshot below.</p>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fon9q5r5toshk8ql7j1re.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fon9q5r5toshk8ql7j1re.png" alt="Docker push" loading="lazy"></a></p>

<p>Run the same command for the <code>ngfizzy/node-echo:latest</code>. If you visit your docker hub account, you should be able to see those images there now. Here's <a href="https://hub.docker.com/repository/docker/ngfizzy/node-echo/general" target="_blank" rel="noopener noreferrer">mine</a></p>

<h2>
  <a name="step-5-update-your-raw-nodeechodeploymentyaml-endraw-file1" href="#step-5-update-your-raw-nodeechodeploymentyaml-endraw-file1">
  </a>
  Step 5: Update your  <code>node-echo-deployment.yaml</code> file1.
</h2>

<ol>
<li>Clear the excessive comments I used for explaining the file in the last part of this article</li>
<li>Update the <code>image</code> property <code>ngfizzy/node-echo:latest</code>
</li>
<li>Change the <code>imagePullPolicy</code> property's value to <code>Always</code>
</li>
</ol>

<p>The resulting configuration should look like this.</p>

<div class="highlight js-code-highlight">
<pre class="highlight yaml"><code>

<span class="na">apiVersion</span><span class="pi">:</span> <span class="s">apps/v1</span>
<span class="na">kind</span><span class="pi">:</span> <span class="s">Deployment</span>
<span class="na">metadata</span><span class="pi">:</span>
  <span class="na">name</span><span class="pi">:</span> <span class="s">node-echo-deployment</span>
<span class="na">spec</span><span class="pi">:</span>
  <span class="na">replicas</span><span class="pi">:</span> <span class="s">1</span>
  <span class="na">selector</span><span class="pi">:</span>
    <span class="na">matchLabels</span><span class="pi">:</span>
      <span class="na">app</span><span class="pi">:</span> <span class="s">node-echo</span>
  <span class="na">template</span><span class="pi">:</span>
    <span class="na">metadata</span><span class="pi">:</span>
      <span class="na">labels</span><span class="pi">:</span>
        <span class="na">app</span><span class="pi">:</span> <span class="s">node-echo</span>
    <span class="na">spec</span><span class="pi">:</span>
      <span class="na">containers</span><span class="pi">:</span>
        <span class="pi">-</span> <span class="na">name</span><span class="pi">:</span> <span class="s">node-echo</span>
          <span class="na">image</span><span class="pi">:</span> <span class="s">ngfizzy/node-echo:latest</span>
          <span class="na">imagePullPolicy</span><span class="pi">:</span> <span class="s">Always</span>
          <span class="na">resources</span><span class="pi">:</span>
            <span class="na">limits</span><span class="pi">:</span>
              <span class="na">cpu</span><span class="pi">:</span> <span class="s">1</span>
              <span class="na">memory</span><span class="pi">:</span> <span class="s">256Mi</span>
          <span class="na">ports</span><span class="pi">:</span>
            <span class="pi">-</span> <span class="na">name</span><span class="pi">:</span> <span class="s">node-echo-port</span>
              <span class="na">containerPort</span><span class="pi">:</span> <span class="m">5001</span>
          <span class="na">livenessProbe</span><span class="pi">:</span>
            <span class="na">httpGet</span><span class="pi">:</span>
              <span class="na">path</span><span class="pi">:</span> <span class="s">/</span>
              <span class="na">port</span><span class="pi">:</span> <span class="s">node-echo-port</span>
          <span class="na">readinessProbe</span><span class="pi">:</span>
            <span class="na">httpGet</span><span class="pi">:</span>
              <span class="na">path</span><span class="pi">:</span> <span class="s">/</span>
              <span class="na">port</span><span class="pi">:</span> <span class="s">node-echo-port</span>
          <span class="na">startupProbe</span><span class="pi">:</span> <span class="c1"># configuration for endpoints</span>
            <span class="na">httpGet</span><span class="pi">:</span>
              <span class="na">path</span><span class="pi">:</span> <span class="s">/</span>
              <span class="na">port</span><span class="pi">:</span> <span class="s">node-echo-port</span>


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

<p>Only lines 16 - 18 changed in the configuration above.</p>

<h3>
  <a name="step-6-update-the-nodeechoserviceyaml-file" href="#step-6-update-the-nodeechoserviceyaml-file">
  </a>
  Step 6: Update the node-echo-service.yaml file
</h3>

<p>Replace the content of node-echo-service.yaml with the <code>LoadBalancer</code> configuration in the load balancer section of this article. Here's the configuration to save you from scrolling</p>

<div class="highlight js-code-highlight">
<pre class="highlight yaml"><code>

<span class="na">apiVersion</span><span class="pi">:</span> <span class="s">v1</span>
<span class="na">kind</span><span class="pi">:</span> <span class="s">Service</span>
<span class="na">metadata</span><span class="pi">:</span>
  <span class="na">name</span><span class="pi">:</span> <span class="s">node-echo-service</span>
<span class="na">spec</span><span class="pi">:</span>
  <span class="na">type</span><span class="pi">:</span> <span class="s">LoadBalancer</span>
  <span class="na">selector</span><span class="pi">:</span>
    <span class="na">app</span><span class="pi">:</span> <span class="s">node-echo</span> <span class="c1"># the label of the group of pods that this service maps to</span>
  <span class="na">ports</span><span class="pi">:</span>
    <span class="pi">-</span> <span class="na">port</span><span class="pi">:</span> <span class="s">80</span>
      <span class="na">targetPort</span><span class="pi">:</span> <span class="m">5001</span>


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
<h3>
  <a name="step-7-create-a-gke-cluster-on-gcp" href="#step-7-create-a-gke-cluster-on-gcp">
  </a>
  Step 7: Create a GKE Cluster On GCP
</h3>

<ol>
<li>Create a GCP account if you don't already have one</li>
<li>Create a GCP Project if you don't have one previously</li>
<li>On the home page, click on the <code>Create GKE Cluster</code> button as shown in the image below
<img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F7o3npsjdc7t2yo7upim6.png" alt="GCP Home" loading="lazy">
</li>
</ol>

<blockquote>
<p>⚠️ If you have previously enabled if you have not previously enabled Cloud Compute and GKE API, you'd be prompted to do so by following the prompts. When you're done, return to the home page and click the <code>Create GKE Cluster</code> button again. </p>
</blockquote>

<p>You'd be presented with the following page settings page after clicking.</p>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F59prxyu4f402rrxgfkt1.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F59prxyu4f402rrxgfkt1.png" alt="GKE Autopilot config" loading="lazy"></a></p>

<p>For demo purposes, we would accept all the default settings and click the submit button at the bottom of the screen.</p>

<p>That should redirect you to this, as seen in the screenshot below. </p>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fmltcz4214xvzyh7cwsbv.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fmltcz4214xvzyh7cwsbv.png" alt="Cluster creating" loading="lazy"></a></p>

<p>It takes a couple of minutes for the Cluster to be created.</p>
<h3>
  <a name="step-8-install-gcloud-cli-if-youve-not-done-that-already" href="#step-8-install-gcloud-cli-if-youve-not-done-that-already">
  </a>
  Step 8: Install GCloud CLI if you've not done that already
</h3>

<p>Follow the instructions here <a href="https://cloud.google.com/sdk/docs/install" target="_blank" rel="noopener noreferrer">https://cloud.google.com/sdk/docs/install</a></p>
<h3>
  <a name="step-9-log-in-to-google-cloud-on-your-cli-and-your-gcloud-project" href="#step-9-log-in-to-google-cloud-on-your-cli-and-your-gcloud-project">
  </a>
  Step 9: Log in to Google Cloud on your CLI and your gcloud project
</h3>

<ol>
<li><code>gcloud auth login</code></li>
<li><code>gcloud config set project &lt;your-project-id&gt;</code></li>
</ol>
<h3>
  <a name="step-9-connect-to-your-gke-cluster-on-your-local-machine" href="#step-9-connect-to-your-gke-cluster-on-your-local-machine">
  </a>
  Step 9: Connect to your GKE Cluster on your local machine
</h3>

<p>On the GKE Cluster page, click on the connect button. Follow the numbers in the screenshot below for Navigation.</p>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fg69lqu9h96lm699prwhy.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fg69lqu9h96lm699prwhy.png" alt="Connect to ke" loading="lazy"></a></p>

<p>Click on the pop-up box after clicking connect, then click the copy icon to copy the connection command to your clipboard. Go back to your CLI and paste the command. You should get the following output.</p>
<div class="highlight js-code-highlight">
<pre class="highlight plaintext"><code>

Fetching cluster endpoint and auth data.
kubeconfig entry generated for &lt;your cluster name&gt;.


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

<p>Confirm that you are now connected by running <code>kubectl config get-contexts</code>, you should see at least one entry in the table. The name of one of them should start with <code>gke_*</code></p>

<h3>
  <a name="deploy-to-gke-cluster" href="#deploy-to-gke-cluster">
  </a>
  Deploy To GKE Cluster
</h3>

<p>Now that we are connected to the GKE cluster</p>

<ol>
<li>Apply our deployment by running <code>kubectl apply -f node-echo-deployment.yaml</code>. You might get a warning saying, <code>Warning: autopilot-default-resources-mutator:Autopilot updated Deployment...</code> Don't worry about this</li>
<li>Apply your k8s-service config by running <code>kubectl apply -f node-echo-service.yaml</code>
</li>
<li>Confirm the deployment by running <code>kubectl get all</code>. You should see an output similar to the screenshot below.</li>
</ol>

<p><a href="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fb3gnb6xwjxpp1jphy8up.png" class="article-body-image-wrapper"><img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fb3gnb6xwjxpp1jphy8up.png" alt="Kubectl get all" loading="lazy"></a></p>

<h3>
  <a name="test-your-deployment" href="#test-your-deployment">
  </a>
  Test your deployment
</h3>

<ol>
<li>Run <code>kubectl get services node-echo-service</code>
</li>
<li>Copy the IP address under the <code>External IP</code> column and send a post request to it like the one below
```bash
</li>
</ol>

<p>curl -d "hello world" 34.123.423.124</p>

<h1>
  <a name="the-server-would-echo-hello-world-back-to-you" href="#the-server-would-echo-hello-world-back-to-you">
  </a>
  The server would echo "Hello world" back to you
</h1>



<div class="highlight js-code-highlight">
<pre class="highlight plaintext"><code>
## Summary
In this article, we took a more detailed look at Kubernetes services; we then used our knowledge to deploy a simple server to the Internet. We are just scratching the surface of Kubernetes. In this series, I aim to gradually reveal containers, and Kubernetes features until we can paint a complete picture of how everything works from end to end.

In the next article, we will take a full circle look deeper at containers, and explore how they do what they do.




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
