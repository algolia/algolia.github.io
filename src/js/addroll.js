var adroll_adv_id = "TGR7R4XSGVGYVPX4LQBDFQ";
var adroll_pix_id = "YQNWNHGUUBD2JMY7BVOBWM";
(function () {
    var _onload = function(){
        if (document.readyState && !/loaded|complete/.test(document.readyState)){setTimeout(_onload, 10);return;}
        if (!window.__adroll_loaded){var __adroll_loaded=true;setTimeout(_onload, 50);return;}
        var scr = document.createElement("script");
        var host = (("https:" == document.location.protocol) ? "https://s.adroll.com" : "http://a.adroll.com");
        scr.setAttribute('async', 'true');
        scr.type = "text/javascript";
        scr.src = host + "/j/roundtrip.js";
        ((document.getElementsByTagName('head') || [null])[0] ||
            document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
    };
    if (window.addEventListener) {window.addEventListener('load', _onload, false);}
    else {window.attachEvent('onload', _onload);}
}());
