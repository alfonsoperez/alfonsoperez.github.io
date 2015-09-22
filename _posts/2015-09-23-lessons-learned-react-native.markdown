---
layout: post
title:  "React Native: Lessons learned"
date:   2015-07-23 00:08:02
categories: php development
---

This post is intended to be updated while going through the beautiful path of *writing mobile apps* with React Native.


# App animations are going slow

Well this can happen for a variety of reasons, the ones I have encountered so far can be split into the following categories:

### Animations are not going smooth

When, for example, you are using [Navigator](https://facebook.github.io/react-native/docs/navigator.html), and while pushing a new Route, you see that the animation is everything but smooth, then it's probably because there is some heavy task being performed within the new Scene being rendered, for instance, imagine that we are pushing a scene with a MapView, and we see that when _sliding_ to that scene, everything goes slow.

{% highlight javascript %}
...
var NewScene = React.createClass({
   ...
   render: function() {
    return (
        <View>
            <MapView

            />
        </View>
    );
   }
});
{% endhighlight %}

Thankfully, we can make use of InteractionManager API that allows us to schedule tasks after the animations are completed, so:

{% highlight javascript %}
...
var NewScene = React.createClass({
   getInitialState: function() {
    return {
        showMap: false,
    }
   },
   render: function() {

    if (this.state.showMaps === false) {
      InteractionManager.runAfterInteractions(() => {
        this.setState({showMaps: true});
      });
    }

    if(this.state.showMaps) {
        return (
            <View>
                <MapView
                    ...
                >
            </View>
        );
    }
   }
});
{% endhighlight %}

Don't forget to set a flag so you only run `InteractionManager.runAfterInteractions` once, if not horrible things will happen!.


[ To be continued. ]
