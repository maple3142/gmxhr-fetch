# gmxhr-fetch

> A fetch-like polyfill for userscript managers.(TM,GM,VM)

## To use

Add the following content into your script's metablock.

```js
// @require https://unpkg.com/gmxhr-fetch
// @grant   GM_xmlhttpRequest
// @grant   GM.xmlHttpRequest
```

Then you can call `gmfetch` anywhere in the script just like `fetch`.

```js
gmfetch('https://example.com').then(console.log)
```
