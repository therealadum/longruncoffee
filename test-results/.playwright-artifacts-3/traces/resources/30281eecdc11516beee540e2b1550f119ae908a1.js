
class RecomSale {
  constructor(a="pro",b=!0) {
      this.env = a,
      this.host = {
        dev:"https://api-test.recomsale.com",
        test: "https://api-test.recomsale.com",
        pro: "https://api.recomsale.com"
      }[a] || "https://api.recomsale.com",
      this.cache = b 
  }
  init() {
     this.processOnLoadPage(),
     this.logOut("Running====") 
  }
  setCookie(a,b,c) {
    const e = new Date;
    e.setTime(e.getTime() + 1e3 * (60 * 60 * 24 * c));
    let d = "expires=" + e.toUTCString();
    document.cookie = a + "=" + b + ";" + d + ";path=/"
  }
  getCookie(a) {
      let b = a + "="
        , c = decodeURIComponent(document.cookie)
        , d = c.split(";");
      for (let e, c = 0; c < d.length; c++) {
          for (e = d[c]; " " === e.charAt(0); )
              e = e.substring(1);
          if (0 === e.indexOf(b))
              return e.substring(b.length, e.length)
      }
      return ""
  }
  getUuid() {
    const a = URL.createObjectURL(new Blob());
    let b = a.toString();
    URL.revokeObjectURL(a);
    return b.split(/[:\/]/g).pop();
  } 
  getShopDomain() {
    try {
        return Shopify ? Shopify.shop : ""
    } catch (a) {
        return console.error("getShopName() - Error when get shopify domain"),
        ""
    }
  }
  getShopName() {
      return this.getShopDomain().replace(".myshopify.com", "")
  }
  getShopifyCheckoutObject() {
    return Shopify && Shopify.checkout ? Shopify.checkout : null
  }
  getShopifyCheckoutInformationObject() {
      return Shopify && Shopify.Checkout ? Shopify.Checkout : null
  }
  parseQueryStringToObject(a="") {
    try {
      const b = new URLSearchParams(a)
        , c = b.entries()
        , d = {};
      for (const [a,b] of c)
          d[a] = b;
      return d
    } catch (a) {
        return {}
    }
  }
  mustPostClickTracking(a) {
    if (!a)
        return !0;
    const b = new Date().getTime();
    return b - a > 60000
  }  
  processOnLoadPage() {
    const a = this.parseQueryStringToObject(window.location.search.substring(1));
    if (a.rs_ref) {
       const c = {
        affCode: a.rs_ref,
        shopifyDomain: this.getShopName(),
        targetUrl: window.location.href,
        referrerUrl: document.referrer,
        visitorId: localStorage.getItem("rseaf_visitor_id") ? localStorage.getItem("rseaf_visitor_id") : this.getUuid(),
        chwPid: a.rs_pid ? a.rs_pid : "",
        trackId: 0
       }
       , d = localStorage.getItem("rseaf_last_click")
       , e = new Date().getTime();
      if (a.rs_ref == localStorage.getItem("rseaf_code")) {
         console.log("===postClickTracking=====11=========")
         this.setLocalTrackingVariables(c.affCode, !1, e, c.chwPid,c.visitorId),
         localStorage.getItem("rseaf_tid") && (c.trackId = Number(localStorage.getItem("rseaf_tid"))),
         this.mustPostClickTracking(d) ? this.postClickTracking(c) : this.logOut("renderMessageBar----1----");
      } else{
         //上报
         console.log("====postClickTracking====2222=========")
         this.setLocalTrackingVariables(c.affCode, !1, e, c.chwPid,c.visitorId),
         c.trackId = 0 ,
         this.postClickTracking(c) ;
      }
    } else 
      this.logOut("renderMessageBar-----2---");
    this.intervalCheckCartToken(),
    this.postCheckoutToken();
  }
  intervalCheckCartToken() {
      const a = setInterval(()=>{
          const b = localStorage.getItem("rseaf_ctk")
            , c = this.getCookie("cart");
          if (c) {
              const d = localStorage.getItem("rseaf_code")
                  , e = localStorage.getItem("rseaf_tid");
              if (d && e) {
                  const f = localStorage.getItem("rseaf_ep");
                  if (f && f < new Date().getTime())
                      return void clearInterval(a);
                  if (b !== c) {
                      const b = this.getShopifyCheckoutObject();
                      if (b)
                          return void clearInterval(a);
                      this.postCartToken({
                          affCode: localStorage.getItem("rseaf_code"),
                          shopifyDomain: this.getShopName(),
                          visitorId: this.getCookie("rseaf_visitor_id"),
                          chwPid: localStorage.getItem("rseaf_pid"),
                          token: c,
                          eventType: "add_to_cart",
                          trackId: localStorage.getItem("rseaf_tid")
                      })
                  }
              }
          }
      }
      , 1e3) 
  } 
  postCartToken(a, b) {
      localStorage.getItem("rseaf_pid") && (a.sca_source = localStorage.getItem("rseaf_pid")),
      this.fetchAndGetContent(`${this.host}/v1/track/event`, "POST", a).then(c=>200 === c.code ? (
      localStorage.setItem("rseaf_ctk", a.token),
      this.setCookie("rseaf_ctk", a.token, 360),
      void localStorage.setItem("rseaf_received", "true")) : void clearInterval(b)).catch(a=>{
          clearInterval(b),
          console.error(a)
      }
      )
  }
  setLocalTrackingVariables(a, b=!1, d, e, f) {
    localStorage.setItem("rseaf_code", a),
    localStorage.setItem("rseaf_received", b ? "true" : "false"),
    localStorage.setItem("rseaf_last_click", d),
    localStorage.setItem("rseaf_visitor_id", f),
    this.setCookie("rseaf_code", a, 360),
    this.setCookie("rseaf_last_click", d, 360),
    this.setCookie("rseaf_visitor_id", f, 360),
    e && (localStorage.setItem("rseaf_pid", e || ""),
    this.setCookie("rseaf_pid", e || "", 360));
  }
  setLocalTrackingReceivedVariables(a={}) {
    localStorage.setItem("rseaf_received", "true"),
    localStorage.setItem("rseaf_ep", (1e3 * Number(a.expireTime)).toString()),
    localStorage.setItem("rseaf_tid", a.trackId),
    this.setCookie("rseaf_ep", 1e3 * Number(a.expireTime), 360),
    this.setCookie("rseaf_tid", a.trackId, 360);
  }
  postClickTracking(a) {
    localStorage.getItem("rseaf_pid") && (a.chwPid = localStorage.getItem("rseaf_pid")),
    this.fetchAndGetContent(`${this.host}/v1/track/report`, "POST", a).then(d=>200 === d.code ? (
        this.logOut(`Tracking affiliate Code ${a.affCode}`),
        this.setLocalTrackingReceivedVariables(d.data)) : ""
        ).catch(a=>{ 
          console.warn(a)
        }
        )
  }
  mustPostCheckoutToken(a) {
      if (!a)
          return false;
      const b = new Date().getTime();
      return a - b > 0
  }
  postCheckoutToken() {
      const a = this.getShopifyCheckoutObject()
        , b = this.getShopifyCheckoutInformationObject();
      if (b && a && b.step === "thank_you") {
          const c = {
              affCode: localStorage.getItem("rseaf_code"),
              shopifyDomain: this.getShopDomain(),
              visitorId: this.getCookie("rseaf_visitor_id"),
              chwPid: localStorage.getItem("rseaf_pid"),
              token: b.token, 
              orderId: a.order_id,
              eventType: "checkout_finish",
              trackId: localStorage.getItem("rseaf_tid")
          };
          
          if (c.visitorId && c.affCode && c.trackId) { 
            const e = localStorage.getItem("rseaf_ep")
            if (this.mustPostCheckoutToken(Number(e))) {
              this.fetchAndGetContent(`${this.host}/v1/track/event`, "POST", c).then(()=>{}
              ).catch(a=>{
                  console.error(a)
              }
              )
            }            
          } else {
             this.logOut(c)
          }
      }
  }
  async fetchAndGetContent(a="", b="GET", c={}) {
    if (c.shopifyDomain = this.getShopDomain(),
        ["GET", "HEAD"].includes(b)) {
            a = new URL(a);
            const b = new URLSearchParams(c)
              , d = a.searchParams
              , e = new URLSearchParams({
                ...Object.fromEntries(b),
                ...Object.fromEntries(d)
            });
            a = `${a.origin}${a.pathname}?${e.toString()}`;
            const f = await fetch(a);
            return (await f.json()) || null
        } else {
            const e = await fetch(a, {
                method: b,
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(c), // must match 'Content-Type' header
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, same-origin, *omit
            });
            return (await e.json()) || null
        }
  }
  logOut(a) {
    console.log(`RecomSale Affiliate Marketing: (${a})`)
  }
}
const recomSale = new RecomSale();

recomSale.init()
