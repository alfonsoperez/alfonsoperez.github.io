---
layout: post
title:  "React Native: Lessons learned"
date:   2015-09-23 00:08:02
categories: javascript mobile development react react-native
---

This post is intended to be updated while going through the beautiful path of *writing mobile apps* with React Native.


   App animations are going slow
------

Well this can happen for a variety of reasons, the ones I have encountered so far can be split into the following categories:

   Animations are not going smooth
=

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

So in order not to block the UI, we could perform those heavy tasks asynchronously with a [setTimeout](https://rnplay.org/apps/pALAlg), but thankfully, we can make use of [InteractionManager](https://facebook.github.io/react-native/docs/interactionmanager.html) API that allows us to schedule tasks after the animations are completed.

So, hooking the call into a [lifecycle method](https://facebook.github.io/react/docs/component-specs.html) like [componentWillMount](https://facebook.github.io/react/docs/component-specs.html#mounting-componentwillmount), which is invoked only one

{% highlight javascript %}
const {
  ,...
  InteractionManager,
}           = require('react-native');
...
var NewScene = React.createClass({
   getInitialState: function() {
    return {
        showMap: false,
    }
   },
   componentWillMount: function() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({showMaps: true})
    });
   },
   render: function() {

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

Don't forget to _at least_ set a flag if you are making the call directly in _render()_ so you only run `InteractionManager.runAfterInteractions` once, if not horrible things will happen!.

[ To be continued. ]
