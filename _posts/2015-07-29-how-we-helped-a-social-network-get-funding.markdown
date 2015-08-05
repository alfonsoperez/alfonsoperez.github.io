---
layout: post
title:  "How we helped a social network get funding"
date:   2015-07-29 00:08:02
categories: web hacking
---

Yesterday I bumped into an old friend from University in Facebook, [@BobString](https://twitter.com/BobString), and the conversation ended up remembering one of the many **funny stories** [@jacano35](https://twitter.com/jacano35), [@zNk](https://twitter.com/zNk) and I had been involved in **during our college time**, in fact, recently I had the luck to meet some of these guys and we spent the night laughing so hard remembering some of these stories than it may turn into a blog post series, just to immortalize them.  

The main story in this post, as stated in the title, is *how we inadvertently helped a Social Network get funding*,... by sort of hacking it.

When I say *sort of* it's because:

> No cats died during the course of this story, nor the intention was to harm the company in any way, it was just for the lulz

This one begins with me going *WTF?!?!* on a Facebook post of an old friend promoting a *unusual* social network (can't say more as I think it's the only one of it's kind).

> \- Hey [@jacano35](https://twitter.com/jacano35), I have an idea, how about if we troll these guys a little?
> \- Yeah, sure, why not?

On the same friday, after class, and after a couple of beers, we design a **mastah-plan**, we are going to create a botnet within the social network, sounds fun right?

We stumble at the registration form, which at the time looked like this:

![Trolling](http://res.cloudinary.com/alfonsoperez/image/upload/c_scale,w_232/v1438180015/trolling_ru4zcn.png){:.center-image .responsive-image }

> \- Hummm.. *Juan*, dunno what to say, there doesn't seem to be a [captcha](https://www.youtube.com/watch?v=WqnXp6Saa8Y) here, it cannot be that easy, I am sure a captcha will appear at the third registration, or they will ban the IP add..
> \- Dude, shut up and let's code, these guys are noobz

##  First step: Creating our bots
All right, so If we are creating a *botnet*, we need bots, right?. So let's get out **Script-Kiddie's Hat** and now that we talk about this, let's get a decent number of them, but without raising suspicions, as we want to succeed in our trolling. This means that the profiles of our bots need to be somehow convincing. But for now let's quickly sort the registration feature.

#### Registering users
We, don't know yet if these guys use some kind of e-mail activation, which would be nice, but before filling our mail server with junk mail, we are going to see if registering ourselves... and *Voila!*, **no activation mail!**, is it going to be that easy?.

We quickly code a function that sends a POST request with the parameters given:

{% highlight php %}
<?php
// PHP was still cool back in the day
...
$pfields = 'name='.urlencode($nombre).'&username='.urlencode($user).'&email1='.urlencode($email).'&email2='.urlencode($email).'&pass1='.urlencode($pass).'&pass2='.urlencode($pass).'&day='.urlencode($day).'&month='.urlencode($mon).'&year='.urlencode($yea).'&terms=1&fbuid=';

curl_setopt($GLOBALS['ch'], CURLOPT_URL, $url);
curl_setopt ($GLOBALS['ch'], CURLOPT_POST, 1);
curl_setopt ($GLOBALS['ch'], CURLOPT_POSTFIELDS, $pfields);
curl_exec ($GLOBALS['ch']); // registramos
{% endhighlight %}

#### Fake names

We want to create fake identities that are difficult to identify if not by `date added` or maybe IP, checking against TOR exit nodes (more on that later), so we use [fakenamegenerator.com](http://fakenamegenerator.com) for that.

I feel obliged to post **some really crappy code** here due to how hilarious it is.

{% highlight php %}
<?php
// programming in spanish cuz I said so
$fakename = file_get_contents("http://es.fakenamegenerator.com/gen-random-sp-sp.php");
preg_match("/<span class=\"given-name\">(.+?)<\/span>/", $fakename, $buf);
$nombre = $buf[1];
// I take out whatever 'weird' characted LOLOMFG NOOB
$nombre = preg_replace("/[^a-zA-Z]/", "", $nombre);
preg_match("/<span class=\"family-name\">(.+?)<\/span>/", $fakename, $buf);
$apellidos = $buf[1];
$apellidos = preg_replace("/[^a-zA-Z ]/", "", $apellidos);
preg_match("/<li class=\"lab\">Username:<\/li>.+?<li>(.+?)<\/li>/ms", $fakename, $buf);
$user = $buf[1];
preg_match("/<li class=\"lab\">Password:<\/li>.+?<li>(.+?)<\/li>/ms", $fakename, $buf);
$pass = $buf[1];
$dominios = array("hotmail.es","gmail.com","yahoo.com", "yahoo.es", "mail.com", "msn.com", "aol.com", "aol.es", "telefonica.es", "vodafone.es","mixmail.com", "terra.es", "ono.es", "jazztel.es", "atl.com", "repsol.com", "orbitel.com");
$pt = array("", ".", "_");
$email = strtolower($nombre). $pt[rand(0,1)]. substr(str_replace(" ", "", strtolower($apellidos)),0,rand(2,strlen($apellidos))).rand(0,100)."@".$dominios[rand(0,count($dominios)-1)];
$d = (string)rand(1,31);
$m = (string)rand(1,12);
$y = (string)rand(1975,1989);
$gn = array("m","f");
$gender = $gn[rand(0,1)];
$ctr = array("Argentina", "Chile", "Colombia", "Spain", "Panama", "Peru");
$country = $ctr[rand(0,count($ctr)-1)];
$cds = array("Sevilla", "Huelva", "Madrid", "Santander", "Malaga", "Barcelona", "Valencia", "Torreblanca", "Rochelambert", "Montevideo", "Mar de plata", "Cali", "Quito", "Guachapas", "Senorito", "Monte Jesus", "Puerto escondido", "Zicatela", "Guayaquil", "Buenos aires", "Cobadonga", "Trujillo", "Cordoba");
$city = $cds[rand(0,count($cds)-1)];
{% endhighlight %}


So basically if the name has something like an áccent, or an ñ, actually really common in spanish, I strip it, thus inserting "lvaro" instead of "Álvaro", resulting later in **a lot of bots** with weird names, duh. 
Let alone not getting the location from fakenamegenerator but creating my cursom random one out of an array, anyway.

#### Religious Avatars

This is the funniest part. Ok I'll say it!, it turns out that this social network, as every other cool social network has to have an avatar for their users, so let's register avatar for our users.

As this social network in particular is Religion-themed, we want our bots to be religious as well.

{% highlight php %}
<?php
...
   $qr = array("virgen", "cristo", "biblia", "virgen maria", "jesus", "santo", "espiritu santo", "papa cristo");
   $query = $qr[rand(0,count($qr)-1)];

   $offset = rand(0,1000);

   $url = "http://api.bing.net/xml.aspx?AppId=XXXXXXXXXXXXXXXXXXXX&query=".     $query."&sources=image&image.count=1&image.offset=".$offset;

   $ch = curl_init();
   curl_setopt($ch, CURLOPT_URL, $url);
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
   $body = curl_exec($ch);
   curl_close($ch);

   preg_match("/<mms:MediaUrl>(.+?)<\/mms:MediaUrl>/", $body, $buf);


if(!isset($buf[1]))
   $res = "http://www.diomedes.com/gua-vestida-virgen.jpg";
   else
   $res = $buf[1];
   
   return $res;


{% endhighlight %}

The avatars turned out to be quite funny, some examples:

![Bot1](http://res.cloudinary.com/alfonsoperez/image/upload/c_scale,w_225/v1438733180/bot1_heeghg.png){:.center-image .responsive-image }
![Bot1](http://res.cloudinary.com/alfonsoperez/image/upload/c_scale,w_327/v1438733345/bot2_vlqt1l.png){:.center-image .responsive-image }


#### Putting it all together

Now that we have some functions, we need to register a big number of users, so if we don't want our IP to be banned or if they log the IP addresses that were used to register the users they could quickly delete our trolls with a simple query, so a workaround would have been to use something like [TOR](https://www.torproject.org/) and send the requests through the SOCKS proxy, but I was really impatient and tired at that point (it was already 3 am or so), so here we go.

{% highlight php %}
<?php
$num = $argv[1];
$pids = array();

function handler($sig)
{
    echo "Destruyendo procesos...\n";
    foreach($pids as $pid)
    {
        $string = $pid." ";
    }
    exec("kill $string");
}

for($i=0;$i<=$num;$i++)
{
    $pid = pcntl_fork();
    if($pid == -1) exit(-1); 
    elseif($pid == 0)
    {
        $pids[] = getmypid();
        exec('php5 doit.php');
        break;
    } else {
        pcntl_signal(SIGINT, "handler");
        while(pcntl_wait($stat) > 0);
    }
}
{% endhighlight %}

having **doit.php** with something like this

{% highlight php %}
<?php
include_once 'functions.php';
// This was the whole joke
$fd = fopen("users".getmypid().".txt", "a");
while(1)
{
    $fake_name = get_fake_name();
    register($fake_name);
    modify($fake_name);

    $url_imagen = imagen();
    $pid = getmypid();
    exec("wget -q -O temp$pid.jpg $url_imagen");
    img("temp$pid.jpg");
    exec("rm temp$pid.jpg");

    fwrite($fd, $email." ".$pass."\n");
}
fclose($fd);
{% endhighlight %}

Hit `php5 processes.php 6` and went to sleep, after getting insulted many times by [@jacano35](https://twitter.com/jacano35) because of the horrid thing above and for not running it through tor. Anyway, I was tired, here you have my IP Address.

Next morning I wake up late, with a little hangover and I suddenly remember what was going on, so I go on and see some huge TXT files full of email addresses and passwords. Ok, it's enough for these guys.


#### Little fun and quick comment

As with almost everything we did for fun, we didn't take it further and we just **upped some messages to the all-time top 2**, did some random followings, some messages, and little more, we could have easily created *havoc*, but then apart from script-kiddies we would be [lamers](https://en.wikipedia.org/wiki/Lamer).

The funny part of the story is that after a while I saw some articles in newspapers talking about the social network, and the owners of it were talking about the *rapid rise* of their userbase and how they had around 100,000K users, I couldn't resist to laugh when I skimmed through my files and realized that I may had almost half of their userbase. 
After that, as I had the first test account registered with my personal e-mail I kept getting eventual e-mails from them through the months, and witnessed how they got to hire some developers, developed and app for android and ios, and given the rapid popularity their userbase started to skyrocket. 

Good for them!