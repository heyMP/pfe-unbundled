// VARS TO POWER TEST ENGINE
window.WCGlobalCDNPath = "https://cdn.webcomponents.psu.edu/cdn/";


// set to avoid issues in the unbundling process w/ node vs js front end
window.process = {env: {NODE_ENV: "production"}};
// establish the default as relative to the integration point
// this isn't a cdn but is the easiest to operate obviously
var cdn = "./";
// get named path to a real CDN as the base entryway into loading the assets
if (window.WCGlobalCDNPath) {
  cdn = window.WCGlobalCDNPath;
}
// legacy location of this value; too simple not to support
if (window.__appCDN) {
  cdn = window.__appCDN;
}
// the name of the file containing the registry used to define
// all the dynamically imported element definitions. This is only
// to be changed via WCGlobalRegistryFileName if someone has a real
// desire to change the name manually or for a specific application
var fname = "wc-registry.json";
if (window.WCGlobalRegistryFileName) {
  fname = window.WCGlobalRegistryFileName;
}
// the full patht o accomplish autoloading
window.WCAutoloadRegistryFile = cdn + fname;
// this try block ensures that if anything fails here we always fall back
// to the ES5 version of the assets. While imperfect, a dynamic import()
// will fall almost perfectly along the lines of what to ship the
// end user
try {
  // find the 1st script tag. We know this exists because our own script HAD
  // to be appended to the document that is running. Most likely this finds
  // the code running presently which is humorous.
  var def = document.getElementsByTagName("script")[0];
  // if a dynamic import fails, we bail over to the compiled version
  // this has to be run as a Function executed on its own otherwise FF and
  // older platforms will bomb because they read this as a parse error
  new Function("import('');");
  // insert polyfill for web animations. We don't get here in legacy platforms
  // and this is because not everything supports web animations and it's a popular
  // thing to implement in advanced web development
  var ani = document.createElement("script");
  ani.src = cdn + "build/es6/node_modules/web-animations-js/web-animations-next-lite.min.js";
  def.parentNode.insertBefore(ani, def);
  // create our autoloader script, which is a JS module and inject into the dom
  // this does all the real work of automatically loading our web components
  var build = document.createElement("script");
  build.src = cdn + "build/es6/node_modules/@lrnwebcomponents/wc-autoload/wc-autoload.js";
  build.type = "module";
  def.parentNode.insertBefore(build, def);
} catch (err) {
  // legacy platforms skip to this step. At this point we know we can inject
  // really aggressive polyfills or babel transforms in order to correctly
  // ship to older platforms but not bloating up newer platforms.
  // as of Nov 2020 this code will only run on ~%5 of web traffic at most
  // which is incredible as when we 1st did this script that was ~20%, Oct 2018
  var ancient=false;
  // get named path to a real CDN as the base entryway into loading the assets
  if (window.WCGlobalCDNPath) {
    cdn = window.WCGlobalCDNPath;
  }
  // legacy location of this value; too simple not to support
  if (window.__appCDN) {
    cdn = window.__appCDN;
  }
  // this block is where we figure out if it's IE 11 / something really old
  try {
    if (typeof Symbol == "undefined") { // IE 11, at least try to serve a watered down site
      ancient = true;
    }
    new Function("let a;"); // bizarre but needed for Safari 9 bc of when it was made
  }
  catch (err) {
    ancient = true;
  }
  // if we have something super old, the app can define if the user MUST upgrade
  // in order to view the site. This is deployment policy specific
  if ((window.__appForceUpgrade || window.WCForceUpgrade) && ancient) {
    window.location = cdn + "assets/upgrade-browser.html";
  }
  else {
    // babel compiling to serve the ES5 based code accurately
    "use strict"; (function () { function a(a, b, c) { var d = a; if (d.state = b, d.stateData = c, 0 < d.onNextStateChange.length) { var e = d.onNextStateChange.slice(); d.onNextStateChange.length = 0; for (var f, g = 0, h = e; g < h.length; g++)f = h[g], f() } return d } function b(b) { function d() { try { document.head.removeChild(f) } catch (a) { } } var e = a(b, "Loading", void 0), f = document.createElement("script"); return f.src = b.url, null !== b.crossorigin && f.setAttribute("crossorigin", b.crossorigin), f.onload = function () { var a, b, f; void 0 === r ? (b = [], f = void 0) : (a = r(), b = a[0], f = a[1]), c(e, b, f), d() }, f.onerror = function () { g(b, new TypeError("Failed to fetch " + b.url)), d() }, document.head.appendChild(f), e } function c(b, c, e) { var f = d(b, c), g = f[0], h = f[1]; return a(b, "WaitingForTurn", { args: g, deps: h, moduleBody: e }) } function d(a, c) { for (var e, f = [], g = [], i = 0, j = c; i < j.length; i++) { if (e = j[i], "exports" === e) { f.push(a.exports); continue } if ("require" === e) { f.push(function (b, c, e) { var f = d(a, b), g = f[0], i = f[1]; h(i, function () { c && c.apply(null, g) }, e) }); continue } if ("meta" === e) { f.push({ url: !0 === a.isTopLevel ? a.url.substring(0, a.url.lastIndexOf("#")) : a.url }); continue } var l = k(n(a.urlBase, e), a.crossorigin); f.push(l.exports), g.push(l), "Initialized" === l.state && b(l) } return [f, g] } function e(b) { var c = a(b, "WaitingOnDeps", b.stateData); return h(b.stateData.deps, function () { return f(c) }, function (a) { return g(c, a) }), c } function f(b) { var c = b.stateData; if (null != c.moduleBody) try { c.moduleBody.apply(null, c.args) } catch (a) { return g(b, a) } return a(b, "Executed", void 0) } function g(b, c) { return !0 === b.isTopLevel && setTimeout(function () { throw c }), a(b, "Failed", c) } function h(a, b, c) { var d = a.shift(); return void 0 === d ? void (b && b()) : "WaitingOnDeps" === d.state ? (!1, void h(a, b, c)) : void i(d, function () { h(a, b, c) }, c) } function i(a, b, c) { switch (a.state) { case "WaitingForTurn": return e(a), void i(a, b, c); case "Failed": return void (c && c(a.stateData)); case "Executed": return void b(); case "Loading": case "WaitingOnDeps": return void a.onNextStateChange.push(function () { return i(a, b, c) }); case "Initialized": throw new Error("All dependencies should be loading already before pressureDependencyToExecute is called."); default: throw new Error("Impossible module state: " + a.state); } } function j(a, b) { switch (a.state) { case "Executed": case "Failed": return void b(); default: a.onNextStateChange.push(function () { return j(a, b) }); } } function k(a, b) { void 0 === b && (b = "anonymous"); var c = q[a]; return void 0 === c && (c = q[a] = { url: a, urlBase: m(a), exports: Object.create(null), state: "Initialized", stateData: void 0, isTopLevel: !1, crossorigin: b, onNextStateChange: [] }), c } function l(a) { return v.href = a, v.href } function m(a) { return a = a.split("?")[0], a = a.split("#")[0], a.substring(0, a.lastIndexOf("/") + 1) } function n(a, b) { return -1 === b.indexOf("://") ? l("/" === b[0] ? b : a + b) : b } function o() { return document.baseURI || (document.querySelector("base") || window.location).href } function p() { var b = document.currentScript; if (!b) return u; if (window.HTMLImports) { var c = window.HTMLImports.importForElement(b); return c ? c.href : u } var d = b.ownerDocument.createElement("a"); return d.href = "", d.href } if (!window.define) { var q = Object.create(null), r = void 0, s = 0, t = void 0, u = o(); window.define = function (a, b) { var d = !1; r = function () { return d = !0, r = void 0, [a, b] }; var f = p(), g = document.currentScript && document.currentScript.getAttribute("crossorigin") || "anonymous"; setTimeout(function () { if (!1 == d) { r = void 0; var h = f + "#" + s++, i = k(h, g); i.isTopLevel = !0; var l = c(i, a, b); void 0 === t ? e(l) : j(k(t), function () { e(l) }), t = h } }, 0) }, window.define._reset = function () { for (var a in q) delete q[a]; r = void 0, s = 0, t = void 0, u = o() }; var v = document.createElement("a") } })();
    var defs;
    // if it browser knows about customElements then ship a slightly different build
    // which doesn't have quite as many polyfills but if it doesn't know about
    // customElements then we assume full polyfill via the webcomponents-bundle loader
    if (window.customElements) {
      defs = [
        cdn + "assets/babel-top.js",
        cdn + "build/es5-amd/node_modules/web-animations-js/web-animations-next-lite.min.js",
        cdn + "build/es5-amd/node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js",
      ];
    }
    else {
      defs = [
        cdn + "assets/babel-top.js",
        cdn + "build/es5-amd/node_modules/web-animations-js/web-animations-next-lite.min.js",
        cdn + "build/es5-amd/node_modules/fetch-ie8/fetch.js",
        cdn + "build/es6/node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js",
        cdn + "build/es5-amd/node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js",
      ];
    }
    window.WCAutoloadPolyfillEntryPoint = cdn + "build/es5-amd/node_modules/@lrnwebcomponents/wc-autoload/wc-autoload.js";
    define(defs, function () {"use strict";
      define([cdn + "build/es5-amd/node_modules/@lrnwebcomponents/deduping-fix/deduping-fix.js", window.WCAutoloadPolyfillEntryPoint], function () {"use strict";
        window.WCAutoload.process();
      });
    });
  }
}