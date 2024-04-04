
    (function() {
      var baseURL = "https://cdn.shopify.com/shopifycloud/checkout-web/assets/";
      var scripts = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/runtime.baseline.en.fb92b6ffe31448901179.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/625.baseline.en.5c5d0aacc3ee30e93c13.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/192.baseline.en.d8176c99a3312fa8a43b.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/681.baseline.en.5b4bd491ecc33a37785c.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/app.baseline.en.dbd892efcad617a47bc1.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/751.baseline.en.3248b1ea37c8c8287656.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/836.baseline.en.09e3037e8cca27835a34.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/179.baseline.en.cda528453c57df5383cf.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/100.baseline.en.aaf5a5941b77953f0095.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/OnePage.baseline.en.5c2c2bed229ef1e16259.js"];
      var styles = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/625.baseline.en.5eeb7486c5777b0f95a3.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/app.baseline.en.f79e630f70b79519e81e.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/836.baseline.en.5c8be743b69bc96dbc9b.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/268.baseline.en.bb49b10e29810e77451c.css"];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0761/6924/9081/files/Logo_Trim_1_x320.png?v=1685984148"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = [baseURL].concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res[0], next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        })();
      }

      function onLoaded() {
        preconnectAssets();
        prefetchAssets();
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  