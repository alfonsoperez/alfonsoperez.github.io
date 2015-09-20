---
layout: post
title:  "Testing with Slim Framework ~Modifying Request body"
date:   2015-07-16 00:08:02
categories: php development
---

I while ago I was setting up a test environment on a PHP project that was using [Slim Framework](http://www.slimframework.com/) and found that had to do some digging in order to find a couple of features.

In particular, I wanted to be able to modify the request body on a mocked Slim environment, the docs were't of help so I though I would share this.

For instance, let's imagine that we want to send a POST request with parameters, like this:

{% highlight php %}
<?php
namespace Ourproject\Tests;
// We manage our dependencies with Composer
require_once __DIR__. '/../vendor/autoload.php';

class ExampleTest extends IntegrationTest
{
    public function testSendForm()
    {
        $post_vars = array
        (
            'field_1' => "1"
        );
        $this->post('/form/new', $post_vars);
    }
}
{% endhighlight %}

Then how can we create a POST request with some example parameters?, I got a hint by looking at the [Web Test Client](https://github.com/there4/slim-test-helpers/blob/master/src/There4/Slim/Test/WebTestClient.php) by the guys at *There4*.

We can compose a string with our parameters and add it to the `options` array with the key `slim.input`, so for example we create an **IntegrationTest.php**

{% highlight php %}
<?php
namespace OurProject\Tests;
// We manage our dependencies with Composer
require_once __DIR__. '/../vendor/autoload.php';

class IntegrationTest extends \PHPUnit_Framework_TestCase {

    public function request($method, $path, $options=array())
    {
        // Capture STDOUT
        ob_start();

        // Prepare a mock environment

        \Slim\Environment::mock(array_merge(array(
            'REQUEST_METHOD' => $method,
            'SERVER_PORT' => '80',
            'PATH_INFO' => $path,
            'SERVER_NAME' => 'our.server.dev',
        ), $options));


        // Run the application
        // this creates an Slim $app
        require __DIR__ . '/../../public/bootstrap.php';

        $this->app = $app;
        $this->request = $app->request();
        $this->response = $app->response();

        // We fire the routes
        $this->app->run();

        // Return STDOUT
        return ob_get_clean();
    }

    public function post($path, $post_vars = array(), $options = array())
    {
        $options['slim.input'] = http_build_query($post_vars);
        return $this->request('POST', $path, $options);
    }
}
{% endhighlight %}

Looking at the [Slim Http Request](https://github.com/slimphp/Slim/blob/master/Slim/Http/Request.php#L250) source code we can see that `slim.input` is used to parse the parameters string into the output body.

So that's it!

