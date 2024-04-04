(()=>{"use strict";var t;!function(t){t.FACEBOOK="facebook",t.TIKTOK="tiktok",t.GOOGLE="google",t.SNAPCHAT="snapchat"}(t||(t={}));var n=function(t,n,e,o){return new(e||(e=Promise))((function(i,c){function r(t){try{d(o.next(t))}catch(t){c(t)}}function a(t){try{d(o.throw(t))}catch(t){c(t)}}function d(t){var n;t.done?i(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(r,a)}d((o=o.apply(t,n||[])).next())}))};var e=function(t,n,e,o){return new(e||(e=Promise))((function(i,c){function r(t){try{d(o.next(t))}catch(t){c(t)}}function a(t){try{d(o.throw(t))}catch(t){c(t)}}function d(t){var n;t.done?i(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(r,a)}d((o=o.apply(t,n||[])).next())}))};const o=t=>e(void 0,void 0,void 0,(function*(){return crypto.subtle.digest("SHA-256",(new TextEncoder).encode(t)).then((t=>{let n=[],e=new DataView(t);for(let t=0;t<e.byteLength;t+=4)n.push(("00000000"+e.getUint32(t).toString(16)).slice(-8));return n.join("")}))}));const i=(t,n)=>{return i=void 0,c=void 0,a=function*(){const i=`${window.Shopify.checkout.order_id}`,c=window.Shopify.checkout.line_items.map((t=>{return{content_id:`${t.product_id}`,content_name:t.title,content_type:"product",content_description:"",content_image:(e=(null==t?void 0:t.image_url)||"",e.startsWith("//cdn.shopify.com")?"https:"+e:""),price:(n=t.price,n.includes(",")&&(n=","===n[n.length-3]?n.replace(".","").replace(",","."):n.replace(",","")),n),quantity:t.quantity};var n,e}));if(yield e(void 0,void 0,void 0,(function*(){var t,n,i,c,r,a;const d=null===(n=null===(t=window.Shopify)||void 0===t?void 0:t.checkout)||void 0===n?void 0:n.customer_id,u=null===(c=null===(i=window.Shopify)||void 0===i?void 0:i.checkout)||void 0===c?void 0:c.phone,s=null===(a=null===(r=window.Shopify)||void 0===r?void 0:r.checkout)||void 0===a?void 0:a.email,f=yield(l=s,e(void 0,void 0,void 0,(function*(){if(!l)return"";const t=l.trim().toLowerCase();return yield o(t)})));var l;const v=yield(p=u,e(void 0,void 0,void 0,(function*(){if(!p)return"";const t=p.trim().toLowerCase();return yield o(t)})));var p;const h=yield(t=>e(void 0,void 0,void 0,(function*(){if(!t)return"";const n=t.toString();return yield o(n)})))(d);window.ttq.identify({sha256_email:f,sha256_phone_number:v,sha256_external_id:h})})),((t,n)=>{window.ttq.track("CompletePayment",{contents:n.map((t=>({content_id:t.content_id,content_name:t.content_name,content_type:t.content_type,price:t.price,quantity:t.quantity}))),currency:window.Shopify.checkout.currency,value:window.Shopify.checkout.total_price,quantity:window.Shopify.checkout.line_items.reduce(((t,n)=>t+n.quantity),0)},{event_id:t})})(i,c),n)try{yield function(t,n,e){return fetch("https://events.adtrace.ai/event",{method:"POST",headers:{"Content-Type":"application/json","Shopify-Domain":n,"User-Agent":navigator.userAgent},body:JSON.stringify({event_id:t,event_name:"CompletePayment",contents:Array.isArray(e)?e:[e],currency:window.Shopify.checkout.currency,totalPrice:window.Shopify.checkout.total_price,event_context:{page:{url:window.location.href,referrer:document.referrer}},cookie:document.cookie})})}(i,t,c)}catch(t){console.log(t)}},new((r=void 0)||(r=Promise))((function(t,n){function e(t){try{d(a.next(t))}catch(t){n(t)}}function o(t){try{d(a.throw(t))}catch(t){n(t)}}function d(n){var i;n.done?t(n.value):(i=n.value,i instanceof r?i:new r((function(t){t(i)}))).then(e,o)}d((a=a.apply(i,c||[])).next())}));var i,c,r,a};!function(){var e,o,c,r;e=this,o=void 0,r=function*(){window.adtApps=window.adtApps||[],window.adtApps.push("tiktok");const e=window.location.href,o=(t=>{const n=-1!==t.indexOf("thank_you"),e=-1!==t.indexOf("orders");return n||e})(e);if(!o)return;const c=window.Shopify.shop;var r,a,d,u,s;if(c)if(r=yield((t,e)=>n(void 0,void 0,void 0,(function*(){const o=yield((t,e)=>n(void 0,void 0,void 0,(function*(){return(yield fetch(`https://events.adtrace.ai/checkout?shop=${t}&platform=${e}`)).json()})))(t,e),{serverSideApiEnabled:i,pixelCodes:c}=o;return{serverSideApiEnabled:i,pixelCodes:c}})))(c,t.TIKTOK),a=void 0,d=void 0,s=function*(){!function(t,n,e){t.TiktokAnalyticsObject=e;var o=t[e]=t[e]||[];o.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],o.setAndDefer=function(t,n){t[n]=function(){t.push([n].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<o.methods.length;i++)o.setAndDefer(o,o.methods[i]);o.instance=function(t){for(var n=o._i[t]||[],e=0;e<o.methods.length;e++)o.setAndDefer(n,o.methods[e]);return n},o.load=function(t,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";o._i=o._i||{},o._i[t]=[],o._i[t]._u=i,o._t=o._t||{},o._t[t]=+new Date,o._o=o._o||{},o._o[t]=n||{};var c=document.createElement("script");c.type="text/javascript",c.async=!0,c.src=i+"?sdkid="+t+"&lib="+e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(c,r)},r.pixelCodes.forEach((function(t){o.load(t)}))}(window,document,"ttq")},new((u=void 0)||(u=Promise))((function(t,n){function e(t){try{i(s.next(t))}catch(t){n(t)}}function o(t){try{i(s.throw(t))}catch(t){n(t)}}function i(n){var i;n.done?t(n.value):(i=n.value,i instanceof u?i:new u((function(t){t(i)}))).then(e,o)}i((s=s.apply(a,d||[])).next())})),-1!==e.indexOf("thank_you")){const t=!1;yield i(c,t)}else(n=>{switch(n){case t.FACEBOOK:window.fbq("track","PageView");break;case t.TIKTOK:window.ttq.page();break;case t.GOOGLE:break;case t.SNAPCHAT:window.snaptr("track","PAGE_VIEW")}})(t.TIKTOK)},new((c=void 0)||(c=Promise))((function(t,n){function i(t){try{d(r.next(t))}catch(t){n(t)}}function a(t){try{d(r.throw(t))}catch(t){n(t)}}function d(n){var e;n.done?t(n.value):(e=n.value,e instanceof c?e:new c((function(t){t(e)}))).then(i,a)}d((r=r.apply(e,o||[])).next())}))}()})();