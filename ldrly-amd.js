(function(root, factory) {
    // AMD set?
    if(typeof define === 'function' && define.amd) {
        define(['vex'], function(vex) {
            return factory(vex);
        });
    }
    else {
        root.ldrlyPlugin = factory(root.vex);
    }
})(this, function(vex) {
    'use strict';
    var apiUrl='';
    var queryString;
    var debug=false;

    /*
     * @TODO Replace this with own CDN (HTTPS?), or some JS manipulation
     */
    var styleRootSrc = '/css/ldrly';

    function trace(s) {
        if (debug) {
            try {
                console.log(s);
            } catch (e) {
                //alert(s)
            }
        }
    }

    function setVexTheme () {
        vex.defaultOptions.className = 'vex-theme-flat-attack';
    }

    function buildCSSlink (hrefValue) {
        trace('Build Css Called');
        var e = document.createElement('link');
        e.setAttribute('rel','stylesheet');
        e.setAttribute('type','text/css');
        e.setAttribute('href',styleRootSrc+'/'+hrefValue);
        document.getElementsByTagName('head')[0].appendChild(e);
        return;
    }

    var hrefValues = ['pluginstyle.css','vex-theme-flat-attack.css','vex.css'];
    for (var i = hrefValues.length - 1; i >= 0; i--) {
        buildCSSlink(hrefValues[i]);
    }

    function encode(str) {
        var s = [];
        for (var i = 0; i < str.length; i ++) {
            var idx = str.charCodeAt(i);
            if ((idx >= 48) && (idx <= 57)) {
                if (idx <= 52) {
                    s[i] = String.fromCharCode(((idx + 5)));
                } else {
                    s[i] = String.fromCharCode(((idx - 5)));
                }
            } else {
                s[i] = String.fromCharCode(idx);
            }
        }
        if(s[0]==='0'){
            s[0]='a';
        } else if(s[0]==='a') {
            s[0]='5';
        }
        return s.join('');
    }

    var ldrlyPlugin;
    var userId;
    var friendData;
    var gameNamespace;
    ldrlyPlugin = {
        init: function(game_namespace,user_id,friend_data) {
            trace('init');
            setVexTheme();

            gameNamespace = game_namespace;
            userId = encode(user_id);

            var friendArray = [];
            for (var key in friend_data) {
                friendArray.push(encode(friend_data[key]));
            }
            friendData = friendArray;

            return;
        },
        setApiUrl: function (env) {
            trace('env='+apiUrl);
            apiUrl = env;
        },
        open: function(portal_url) {
            portal_url = typeof portal_url !== 'undefined' ? portal_url : 'portalstaging.ldrly.com';

            function serialize (obj, prefix) {
                var str = [];
                for(var p in obj) {
                    var k = prefix ? prefix + '[' + p + ']' : p, v = obj[p];
                    str.push(typeof v == 'object' ?
                        serialize(v, k) :
                        encodeURIComponent(k) + '=' + encodeURIComponent(v));
                }
                return str.join('&');
            }

            var serial = serialize(friendData);
            queryString = 'user_id='+userId+'&api_url='+apiUrl+'&game_namespace='+gameNamespace+'&data='+serial;
            if (queryString.length>2056) {
                var index = queryString.lastIndexOf('=',2056);
                queryString = queryString.substring(0,index-4);
                trace(queryString);
            }

            vex.open({
                content:'<iframe id="frame-id" width="100%" height="100%" src="//'+portal_url+'/leaderboard/index.php?'+queryString+'" style="left:0px; padding:0px; border:0"></iframe>',
                afterOpen: function($vexContent) {
                    document.getElementsByClassName('vex-theme-flat-attack')[0].style.paddingTop = window.scrollY + 50 + 'px';
                }
            });
        }
    };
    return ldrlyPlugin;
});