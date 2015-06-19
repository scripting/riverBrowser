# riverBrowser

JavaScript code to display a <a href="http://scripting.com/2014/06/02/whatIsARiverOfNewsAggregator.html">river of news</a>.

Here's a blog post announcing this project.

#### What is a river?

A river is a reverse-chronologic list of new stories. 

<a href="https://github.com/scripting/river4">River4</a> is a Node.js app that generates these files. 

It's an open, <a href="http://riverjs.org/">documented</a> format, available for anyone to use.

#### Demo app

Here's the <a href="http://fargo.io/code/browsers/riverbrowserdemo.html">demo app</a> for riverBrowser.

I took a snapshot of one of my rivers, so the content would stay fixed. It can be difficult to discuss rivers because they're always changing. The content in this river won't change. 

The <a href="https://github.com/scripting/riverBrowser/blob/master/riverbrowserdemo.html">source</a> for the demo app is included in this repository.

#### httpGetRiver

To load a river from the web, call httpGetRiver.

<code>httpGetRiver ("http://fargo.io/code/browsers/frozenriver.js", "idRiverDisplay");</code>

The first parameter is the address of the river file. The second parameter is the id of a div, which is where you want the river to be displayed. From there everything is handled for you. 

#### Projects that use riverBrowser

These are my real-world projects that use riverBrowser. 

1. <a href="http://techblast.org/">techblast.org</a> -- "A blast of tech all day every day."

2. <a href="http://radio3.io/rivers/">Radio's rivers</a> -- These are the rivers I follow.  

3. <a href="http://podcatch.com/">Podcatch.com</a> -- "A good podcast listen, now."

4. <a href="http://scripting.com/">Scripting News</a> -- My first blog, still going strong. Little-known fact, every tab is a river. ;-)

5. <a href="http://fargo.io/code/helloriver/index.html">Hello River</a> -- The <a href="http://river4.smallpict.com/2014/10/05/theHelloWorldOfRivers.html">hello world</a> of rivers. 

#### Questions, support

Since this project is so closely related to River4, we'll use its <a href="https://groups.google.com/forum/?fromgroups#!forum/river4">mail list</a> for questions and support. 

