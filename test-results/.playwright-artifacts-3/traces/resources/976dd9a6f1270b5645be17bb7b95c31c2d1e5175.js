const AppIdManager = function() {
  let appId = void 0;
  let orgId = void 0;
  let appName = void 0;
  let connectionId = void 0;
  return (() => ({
    setAppId: (id) => appId = id,
    getAppId: () => appId || "",
    setMappedOrgId: (MappingOrgId) => orgId = MappingOrgId,
    getMappedOrgId: () => orgId || "",
    setAppName: (name) => appName = name,
    getAppName: () => appName || "",
    setConnectionId: (name) => connectionId = name,
    getConnectionId: () => connectionId || ""
  }))();
}();
const getShopifyAuth = (e) => {
  const Qe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  for (var t, n = String(e), r = 0, i = 0, a = Qe, o = ""; n.charAt(0 | i) || (a = "=", i % 1); o += a.charAt(63 & r >> 8 - i % 1 * 8)) {
    if ((t = n.charCodeAt(i += 0.75)) > 255)
      console.log("error");
    r = r << 8 | t;
  }
  return o;
};

// https://stackoverflow.com/a/8809472
function generateUUID() {
    let d = new Date().getTime();
    // Time in microseconds since page-load or 0 if unsupported
    let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16; // random number between 0 and 16
        if (d > 0) { // Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        }
        else { // Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
// https://www.robots.ox.ac.uk/~adutta/blog/standalone_uuid_generator_in_javascript.html
function uuid4() {
    const tempUrl = URL.createObjectURL(new Blob());
    const uuid = tempUrl.toString();
    URL.revokeObjectURL(tempUrl);
    const key = uuid.split(/[:/]/g).pop();
    return key ? key.toLowerCase() : generateUUID();
}

(globalThis && globalThis.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function scriptLoader(scriptLink, onLoad) {
    const [firstScript] = document.getElementsByTagName('script');
    const script = document.createElement('script');
    if (onLoad) {
        script.onload = onLoad;
    }
    script.async = true;
    script.src = scriptLink;
    if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
    }
    else {
        (document.getElementsByTagName('head')[0] || document.body).appendChild(script);
    }
}

const KIT_NAME = 'amStorefrontKit';
// export const SCP_LID = 'amSCPLid';
const COOKIE_GA = '_ga';
const COOKIE_USER_PSEUDO_ID = '_ama';
const DEFAULT_COOKIE_PATH = '/';
const AMA_MAX_AGE_EXPIRES = 31536000; // 1 years - 365 days

let thisAppName;
let dataCollectLoaded = false;
let buffer = [];
function getSdkEntry(appEnv) {
    if (!appEnv) {
        appEnv = {"APP_ENV":"staging","APP_MAIN":"AM_WIDGET"}.APP_ENV;
    }
    if (!appEnv && "production" !== 'development') {
        throw new Error('{"APP_ENV":"staging","APP_MAIN":"AM_WIDGET"}.APP_ENV not found');
    }
    const sdkEntry = '/analytics/v1/dc.js';
    const sdkEnvHosts = {
        testing: 'sdks.automizely-analytics.io',
        staging: 'staging-sdks.automizely-analytics.com',
        production: 'sdks.automizely-analytics.com',
    };
    return `https://${sdkEnvHosts[appEnv || 'testing'] || sdkEnvHosts.testing}${sdkEntry}`;
}
function appEventData(data) {
    if ((data === null || data === void 0 ? void 0 : data.promotion) && !data.promotion.app_name) {
        data.promotion.app_name = thisAppName;
    }
    return data;
}
function clearBuffer() {
    if (window[KIT_NAME]) {
        for (let [eventNameOrEvent, data] of buffer) {
            window[KIT_NAME].collect(eventNameOrEvent, appEventData(data));
        }
    }
    buffer = [];
}
function initDataCollect(appName, callback, options) {
    var _a;
    if (typeof document === 'undefined') { // ssr
        return;
    }
    if (((_a = options === null || options === void 0 ? void 0 : options.basicData) === null || _a === void 0 ? void 0 : _a.promotion) && !options.basicData.promotion.app_name) {
        options.basicData.promotion.app_name = appName;
    }
    thisAppName = appName;
    scriptLoader(getSdkEntry(options === null || options === void 0 ? void 0 : options.appEnv), () => {
        if (!window[KIT_NAME]) {
            return;
        }
        window[KIT_NAME].initCollect(appName, (kit) => {
            const pushData = (event, data) => {
                return kit.pushData(event, appEventData(data));
            };
            const appKit = Object.assign(Object.assign({}, kit), { pushData });
            callback && callback(appKit);
            dataCollectLoaded = true;
            clearBuffer();
        }, options);
    });
}
function collect$1(eventNameOrEvent, data) {
    if (typeof document === 'undefined') { // ssr
        return;
    }
    if (dataCollectLoaded) {
        if (window[KIT_NAME]) {
            window[KIT_NAME].collect(eventNameOrEvent, appEventData(data));
        }
        return;
    }
    buffer.push([eventNameOrEvent, data]);
}

function getCookie(name) {
    let cookies = [];
    try {
        // it will throw a SecurityError if document is in a sandboxed iframe
        cookies = document.cookie.split(';');
    }
    catch (_a) { }
    const prefix = `${name}=`;
    for (let item of cookies) {
        item = item.trim();
        if (item.substring(0, prefix.length) === prefix) {
            return item.substring(prefix.length);
        }
    }
    return '';
}
function setCookie(name, value, options) {
    let values = `${name}=${value}`;
    (options === null || options === void 0 ? void 0 : options.path) !== undefined && (values += `;path=${options.path}`);
    (options === null || options === void 0 ? void 0 : options.domain) !== undefined && (values += `;domain=${options.domain}`);
    (options === null || options === void 0 ? void 0 : options.maxAge) !== undefined && (values += `;max-age=${options.maxAge}`);
    (options === null || options === void 0 ? void 0 : options.secure) && (values += `;secure`);
    (options === null || options === void 0 ? void 0 : options.sameSite) !== undefined &&
        (values += `;samesite=${options.sameSite}`);
    try {
        // it will throw a SecurityError if document is in a sandboxed iframe
        document.cookie = values;
    }
    catch (_a) { }
}

var ShopifyPageType;
(function (ShopifyPageType) {
    ShopifyPageType["Home"] = "P00001";
    ShopifyPageType["Collections"] = "P00002";
    ShopifyPageType["SearchResults"] = "P00003";
    ShopifyPageType["Product"] = "P00004";
    ShopifyPageType["Cart"] = "P00005";
    ShopifyPageType["ThankYou"] = "P00006";
})(ShopifyPageType || (ShopifyPageType = {}));
var Url;
(function (Url) {
    Url["cart"] = "/cart.js";
    Url["cartCheckout"] = "/cart";
})(Url || (Url = {}));
const pageMapping = [
    {
        page_type: 'home',
        regexp: /^\/$/,
        page_sn: ShopifyPageType.Home,
    },
    {
        // Collections
        page_type: 'collections',
        regexp: /^\/collections\/((?!products\/).)*$/,
        page_sn: ShopifyPageType.Collections,
    },
    {
        // Search Result
        page_type: 'searchresults',
        regexp: /^\/search$/,
        page_sn: ShopifyPageType.SearchResults,
    },
    {
        page_type: 'product',
        regexp: /^\/products\/[^/]+$/,
        page_sn: ShopifyPageType.Product,
    },
    {
        // Cart
        page_type: '',
        regexp: /^\/cart$/,
        page_sn: ShopifyPageType.Cart,
    },
    {
        // Thank You
        page_type: '',
        regexp: /^\/([^/]+\/)?checkouts(\/c)?\/[^/]+\/thank_you/,
        page_sn: ShopifyPageType.ThankYou,
    }
];
function getPage() {
    var _a, _b, _c;
    const pathName = window.location.pathname;
    const pageType = (_c = (_b = (_a = window.ShopifyAnalytics) === null || _a === void 0 ? void 0 : _a.meta) === null || _b === void 0 ? void 0 : _b.page) === null || _c === void 0 ? void 0 : _c.pageType;
    return pageMapping.find((page) => {
        return page.regexp.test(pathName) || pageType === page.page_type;
    }) || {
        page_type: pageType,
        regexp: /.+/,
        page_sn: '',
    };
}

var __awaiter$1 = (globalThis && globalThis.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Platform;
(function (Platform) {
    Platform["woo"] = "woocommerce";
    Platform["shopify"] = "shopify";
})(Platform || (Platform = {}));
function isShopify() {
    return 'Shopify' in window;
}
// brand tracking page
const isBTP = function () {
    return !!document.querySelector('meta[name="as-btp"][content="true"]');
};
function getComplianceUrl(appEnv) {
    if (!appEnv) {
        appEnv = {"APP_ENV":"staging","APP_MAIN":"AM_WIDGET"}.APP_ENV;
    }
    if (!appEnv && "production" !== 'development') {
        throw new Error('{"APP_ENV":"staging","APP_MAIN":"AM_WIDGET"}.APP_ENV not found');
    }
    const sdkEnvHosts = {
        testing: 'bff-api.aftership.io',
        staging: 'bff-api.aftership.com',
        production: 'bff-api.aftership.com',
    };
    return `https://${sdkEnvHosts[appEnv || 'testing'] || sdkEnvHosts.testing}/business/compliance/v1/requirement`;
}
// GDPR 规范 && CCPA 规范
// https://shopify.dev/api/consent-tracking
// 1、isShopify:
//		a、userCanBeTraked = TRUE && userDataCanBeSold = TRUE -> start tracking
//		b、other: FALSE
// 2、other - BTP:
//		a、BTP 页面，未接入 cookie consent SDK 前，全部采集，接入后由 cookie consent SDK 决定；
//		b、非 BTP 页面，调用 IP Address
// 			(1)IP Address 属于非欧盟、非加州地区时，则允许采集；
//			(2)IP Address 处于欧盟或者加州时，则不允许采集；
//			(3)IP Address 请求出错时，默认不采集； 
function userCanBeTrackedByLawAsync() {
    var _a;
    return __awaiter$1(this, void 0, void 0, function* () {
        if (isShopify()) {
            // !!! 当页面处于 thankyoupage 时，不进行 tracked 的检查
            if (getPage().page_sn === ShopifyPageType.ThankYou) {
                return true;
            }
            if (typeof ((_a = window === null || window === void 0 ? void 0 : window.Shopify) === null || _a === void 0 ? void 0 : _a.loadFeatures) === 'function') {
                return new Promise((resolve, reject) => {
                    window.Shopify.loadFeatures([
                        {
                            name: 'consent-tracking-api',
                            version: '0.1',
                        }
                    ], function (e) {
                        if (e) {
                            reject(e);
                            return;
                        }
                        resolve(hasCustomPrivacyPermission());
                    });
                });
            }
            return hasCustomPrivacyPermission();
        }
        // BTP 页面检测是不是有 AM_CONTENT_SDK 存在	
        if (isBTP() || existAmConsentSdk()) {
            return true;
        }
        // IP Address 合规判断
        return getIpAddressCompliance();
    });
}
// 调用 Shopify API 获取隐私权限许可状态
function hasCustomPrivacyPermission() {
    var _a, _b, _c, _d;
    let userDataCanBeSold = false;
    if (typeof ((_b = (_a = window === null || window === void 0 ? void 0 : window.Shopify) === null || _a === void 0 ? void 0 : _a.customerPrivacy) === null || _b === void 0 ? void 0 : _b.userDataCanBeSold) ===
        'function') {
        userDataCanBeSold = window.Shopify.customerPrivacy.userDataCanBeSold();
    }
    let userCanBeTracked = false;
    if (typeof ((_d = (_c = window === null || window === void 0 ? void 0 : window.Shopify) === null || _c === void 0 ? void 0 : _c.customerPrivacy) === null || _d === void 0 ? void 0 : _d.userCanBeTracked) ===
        'function') {
        userCanBeTracked = window.Shopify.customerPrivacy.userCanBeTracked();
    }
    return userCanBeTracked && userDataCanBeSold;
}
/**
 * 获取当前用户的 IP 信息描述：
 * 	ccpa 为 true， 表明是: 加州的 IP
 * 	gdpr 为 true， 表明是: 是欧盟的 IP
 * 	uk_gdpr 为true, 表明是: 英国的 IP
 * -> 如果当前用户处于任何一个地区，则不允许收集信息
 * -> 其他情况都收集信息
 */
function getIpAddressCompliance() {
    return new Promise((resolve, reject) => {
        fetch(getComplianceUrl(), {})
            .then((response) => {
            return response.json();
        })
            .then(json => {
            const ccpa = json['data']['ccpa'];
            const gdpr = json['data']['gdpr'];
            const ukGdpr = json['data']['uk_gdpr'];
            let notAllowed = ccpa || gdpr || ukGdpr;
            resolve(!notAllowed);
        })
            .catch((error) => {
            reject(error);
        });
    });
}
/**
 * cookie-banner consent SDK 是否存在
 * 	1、如果存在 window.AM_CONSENT_SDK，则采集
 * 	2、如果不存在，则不采集
*/
function existAmConsentSdk() {
    return (typeof window.AM_CONSENT_SDK === 'object');
}

var __awaiter = (globalThis && globalThis.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// https://stackoverflow.com/questions/16102436/what-are-the-values-in-ga-cookie
function readLegacyUserPseudoId() {
    const ga = getCookie(COOKIE_GA);
    let i = ga.indexOf('.');
    if (i > -1) {
        i = ga.indexOf('.', i + 1);
        if (i > -1) {
            const value = ga.substring(i + 1);
            return value.length >= 12 ? value : '';
        }
    }
    return '';
}
function getUserPseudoId() {
    const id = readLegacyUserPseudoId() || getCookie(COOKIE_USER_PSEUDO_ID) || uuid4();
    setCookie(COOKIE_USER_PSEUDO_ID, id, {
        path: DEFAULT_COOKIE_PATH,
        maxAge: AMA_MAX_AGE_EXPIRES,
    });
    return id;
}
function getUserPseudoIdByLawAsync() {
    return __awaiter(this, void 0, void 0, function* () {
        const userCanBeTracked = yield userCanBeTrackedByLawAsync();
        if (!userCanBeTracked) {
            return '';
        }
        return getUserPseudoId();
    });
}

var EventType;
(function (EventType) {
    EventType["click"] = "click";
    EventType["impr"] = "impr";
    EventType["page_enter"] = "page_enter";
    EventType["page_leave"] = "page_leave";
    EventType["modal_view"] = "modal_view";
    EventType["modal_close"] = "modal_close";
    EventType["add_to_cart"] = "add_to_cart";
    EventType["cart_updated"] = "cart_updated";
    EventType["remove_from_cart"] = "remove_from_cart";
    EventType["view_item"] = "view_item";
    EventType["click_item"] = "click_item";
    EventType["checkout"] = "checkout";
    EventType["purchase"] = "purchase";
    EventType["subscribe"] = "subscribe";
    EventType["get_coupon"] = "get_coupon";
    EventType["search"] = "search";
})(EventType || (EventType = {}));

/**
 * ```
 * WhiteSpace ::
 *   - "Horizontal Tab (U+0009)"
 *   - "Space (U+0020)"
 * ```
 * @internal
 */
function isWhiteSpace(code) {
  return code === 0x0009 || code === 0x0020;
}

/**
 * Print a block string in the indented block form by adding a leading and
 * trailing blank line. However, if a block string starts with whitespace and is
 * a single-line, adding a leading blank line would strip that whitespace.
 *
 * @internal
 */

function printBlockString(value, options) {
  const escapedValue = value.replace(/"""/g, '\\"""'); // Expand a block string's raw value into independent lines.

  const lines = escapedValue.split(/\r\n|[\n\r]/g);
  const isSingleLine = lines.length === 1; // If common indentation is found we can fix some of those cases by adding leading new line

  const forceLeadingNewLine =
    lines.length > 1 &&
    lines
      .slice(1)
      .every((line) => line.length === 0 || isWhiteSpace(line.charCodeAt(0))); // Trailing triple quotes just looks confusing but doesn't force trailing new line

  const hasTrailingTripleQuotes = escapedValue.endsWith('\\"""'); // Trailing quote (single or double) or slash forces trailing new line

  const hasTrailingQuote = value.endsWith('"') && !hasTrailingTripleQuotes;
  const hasTrailingSlash = value.endsWith('\\');
  const forceTrailingNewline = hasTrailingQuote || hasTrailingSlash;
  const printAsMultipleLines =
    !(options !== null && options !== void 0 && options.minimize) && // add leading and trailing new lines only if it improves readability
    (!isSingleLine ||
      value.length > 70 ||
      forceTrailingNewline ||
      forceLeadingNewLine ||
      hasTrailingTripleQuotes);
  let result = ''; // Format a multi-line block quote to account for leading space.

  const skipLeadingNewLine = isSingleLine && isWhiteSpace(value.charCodeAt(0));

  if ((printAsMultipleLines && !skipLeadingNewLine) || forceLeadingNewLine) {
    result += '\n';
  }

  result += escapedValue;

  if (printAsMultipleLines || forceTrailingNewline) {
    result += '\n';
  }

  return '"""' + result + '"""';
}

/**
 * Prints a string as a GraphQL StringValue literal. Replaces control characters
 * and excluded characters (" U+0022 and \\ U+005C) with escape sequences.
 */
function printString(str) {
  return `"${str.replace(escapedRegExp, escapedReplacer)}"`;
} // eslint-disable-next-line no-control-regex

const escapedRegExp = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;

function escapedReplacer(str) {
  return escapeSequences[str.charCodeAt(0)];
} // prettier-ignore

const escapeSequences = [
  '\\u0000',
  '\\u0001',
  '\\u0002',
  '\\u0003',
  '\\u0004',
  '\\u0005',
  '\\u0006',
  '\\u0007',
  '\\b',
  '\\t',
  '\\n',
  '\\u000B',
  '\\f',
  '\\r',
  '\\u000E',
  '\\u000F',
  '\\u0010',
  '\\u0011',
  '\\u0012',
  '\\u0013',
  '\\u0014',
  '\\u0015',
  '\\u0016',
  '\\u0017',
  '\\u0018',
  '\\u0019',
  '\\u001A',
  '\\u001B',
  '\\u001C',
  '\\u001D',
  '\\u001E',
  '\\u001F',
  '',
  '',
  '\\"',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '', // 2F
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '', // 3F
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '', // 4F
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '\\\\',
  '',
  '',
  '', // 5F
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '', // 6F
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '\\u007F',
  '\\u0080',
  '\\u0081',
  '\\u0082',
  '\\u0083',
  '\\u0084',
  '\\u0085',
  '\\u0086',
  '\\u0087',
  '\\u0088',
  '\\u0089',
  '\\u008A',
  '\\u008B',
  '\\u008C',
  '\\u008D',
  '\\u008E',
  '\\u008F',
  '\\u0090',
  '\\u0091',
  '\\u0092',
  '\\u0093',
  '\\u0094',
  '\\u0095',
  '\\u0096',
  '\\u0097',
  '\\u0098',
  '\\u0099',
  '\\u009A',
  '\\u009B',
  '\\u009C',
  '\\u009D',
  '\\u009E',
  '\\u009F',
];

function devAssert(condition, message) {
  const booleanCondition = Boolean(condition);

  if (!booleanCondition) {
    throw new Error(message);
  }
}

const MAX_ARRAY_LENGTH = 10;
const MAX_RECURSIVE_DEPTH = 2;
/**
 * Used to print values in error messages.
 */

function inspect(value) {
  return formatValue(value, []);
}

function formatValue(value, seenValues) {
  switch (typeof value) {
    case 'string':
      return JSON.stringify(value);

    case 'function':
      return value.name ? `[function ${value.name}]` : '[function]';

    case 'object':
      return formatObjectValue(value, seenValues);

    default:
      return String(value);
  }
}

function formatObjectValue(value, previouslySeenValues) {
  if (value === null) {
    return 'null';
  }

  if (previouslySeenValues.includes(value)) {
    return '[Circular]';
  }

  const seenValues = [...previouslySeenValues, value];

  if (isJSONable(value)) {
    const jsonValue = value.toJSON(); // check for infinite recursion

    if (jsonValue !== value) {
      return typeof jsonValue === 'string'
        ? jsonValue
        : formatValue(jsonValue, seenValues);
    }
  } else if (Array.isArray(value)) {
    return formatArray(value, seenValues);
  }

  return formatObject(value, seenValues);
}

function isJSONable(value) {
  return typeof value.toJSON === 'function';
}

function formatObject(object, seenValues) {
  const entries = Object.entries(object);

  if (entries.length === 0) {
    return '{}';
  }

  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return '[' + getObjectTag(object) + ']';
  }

  const properties = entries.map(
    ([key, value]) => key + ': ' + formatValue(value, seenValues),
  );
  return '{ ' + properties.join(', ') + ' }';
}

function formatArray(array, seenValues) {
  if (array.length === 0) {
    return '[]';
  }

  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return '[Array]';
  }

  const len = Math.min(MAX_ARRAY_LENGTH, array.length);
  const remaining = array.length - len;
  const items = [];

  for (let i = 0; i < len; ++i) {
    items.push(formatValue(array[i], seenValues));
  }

  if (remaining === 1) {
    items.push('... 1 more item');
  } else if (remaining > 1) {
    items.push(`... ${remaining} more items`);
  }

  return '[' + items.join(', ') + ']';
}

function getObjectTag(object) {
  const tag = Object.prototype.toString
    .call(object)
    .replace(/^\[object /, '')
    .replace(/]$/, '');

  if (tag === 'Object' && typeof object.constructor === 'function') {
    const name = object.constructor.name;

    if (typeof name === 'string' && name !== '') {
      return name;
    }
  }

  return tag;
}

/**
 * Contains a range of UTF-8 character offsets and token references that
 * identify the region of the source from which the AST derived.
 */
/**
 * The list of all possible AST node types.
 */

/**
 * @internal
 */
const QueryDocumentKeys = {
  Name: [],
  Document: ['definitions'],
  OperationDefinition: [
    'name',
    'variableDefinitions',
    'directives',
    'selectionSet',
  ],
  VariableDefinition: ['variable', 'type', 'defaultValue', 'directives'],
  Variable: ['name'],
  SelectionSet: ['selections'],
  Field: ['alias', 'name', 'arguments', 'directives', 'selectionSet'],
  Argument: ['name', 'value'],
  FragmentSpread: ['name', 'directives'],
  InlineFragment: ['typeCondition', 'directives', 'selectionSet'],
  FragmentDefinition: [
    'name', // Note: fragment variable definitions are deprecated and will removed in v17.0.0
    'variableDefinitions',
    'typeCondition',
    'directives',
    'selectionSet',
  ],
  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ['values'],
  ObjectValue: ['fields'],
  ObjectField: ['name', 'value'],
  Directive: ['name', 'arguments'],
  NamedType: ['name'],
  ListType: ['type'],
  NonNullType: ['type'],
  SchemaDefinition: ['description', 'directives', 'operationTypes'],
  OperationTypeDefinition: ['type'],
  ScalarTypeDefinition: ['description', 'name', 'directives'],
  ObjectTypeDefinition: [
    'description',
    'name',
    'interfaces',
    'directives',
    'fields',
  ],
  FieldDefinition: ['description', 'name', 'arguments', 'type', 'directives'],
  InputValueDefinition: [
    'description',
    'name',
    'type',
    'defaultValue',
    'directives',
  ],
  InterfaceTypeDefinition: [
    'description',
    'name',
    'interfaces',
    'directives',
    'fields',
  ],
  UnionTypeDefinition: ['description', 'name', 'directives', 'types'],
  EnumTypeDefinition: ['description', 'name', 'directives', 'values'],
  EnumValueDefinition: ['description', 'name', 'directives'],
  InputObjectTypeDefinition: ['description', 'name', 'directives', 'fields'],
  DirectiveDefinition: ['description', 'name', 'arguments', 'locations'],
  SchemaExtension: ['directives', 'operationTypes'],
  ScalarTypeExtension: ['name', 'directives'],
  ObjectTypeExtension: ['name', 'interfaces', 'directives', 'fields'],
  InterfaceTypeExtension: ['name', 'interfaces', 'directives', 'fields'],
  UnionTypeExtension: ['name', 'directives', 'types'],
  EnumTypeExtension: ['name', 'directives', 'values'],
  InputObjectTypeExtension: ['name', 'directives', 'fields'],
};
const kindValues = new Set(Object.keys(QueryDocumentKeys));
/**
 * @internal
 */

function isNode(maybeNode) {
  const maybeKind =
    maybeNode === null || maybeNode === void 0 ? void 0 : maybeNode.kind;
  return typeof maybeKind === 'string' && kindValues.has(maybeKind);
}
/** Name */

let OperationTypeNode;

(function (OperationTypeNode) {
  OperationTypeNode['QUERY'] = 'query';
  OperationTypeNode['MUTATION'] = 'mutation';
  OperationTypeNode['SUBSCRIPTION'] = 'subscription';
})(OperationTypeNode || (OperationTypeNode = {}));

/**
 * The set of allowed kind values for AST nodes.
 */
let Kind;
/**
 * The enum type representing the possible kind values of AST nodes.
 *
 * @deprecated Please use `Kind`. Will be remove in v17.
 */

(function (Kind) {
  Kind['NAME'] = 'Name';
  Kind['DOCUMENT'] = 'Document';
  Kind['OPERATION_DEFINITION'] = 'OperationDefinition';
  Kind['VARIABLE_DEFINITION'] = 'VariableDefinition';
  Kind['SELECTION_SET'] = 'SelectionSet';
  Kind['FIELD'] = 'Field';
  Kind['ARGUMENT'] = 'Argument';
  Kind['FRAGMENT_SPREAD'] = 'FragmentSpread';
  Kind['INLINE_FRAGMENT'] = 'InlineFragment';
  Kind['FRAGMENT_DEFINITION'] = 'FragmentDefinition';
  Kind['VARIABLE'] = 'Variable';
  Kind['INT'] = 'IntValue';
  Kind['FLOAT'] = 'FloatValue';
  Kind['STRING'] = 'StringValue';
  Kind['BOOLEAN'] = 'BooleanValue';
  Kind['NULL'] = 'NullValue';
  Kind['ENUM'] = 'EnumValue';
  Kind['LIST'] = 'ListValue';
  Kind['OBJECT'] = 'ObjectValue';
  Kind['OBJECT_FIELD'] = 'ObjectField';
  Kind['DIRECTIVE'] = 'Directive';
  Kind['NAMED_TYPE'] = 'NamedType';
  Kind['LIST_TYPE'] = 'ListType';
  Kind['NON_NULL_TYPE'] = 'NonNullType';
  Kind['SCHEMA_DEFINITION'] = 'SchemaDefinition';
  Kind['OPERATION_TYPE_DEFINITION'] = 'OperationTypeDefinition';
  Kind['SCALAR_TYPE_DEFINITION'] = 'ScalarTypeDefinition';
  Kind['OBJECT_TYPE_DEFINITION'] = 'ObjectTypeDefinition';
  Kind['FIELD_DEFINITION'] = 'FieldDefinition';
  Kind['INPUT_VALUE_DEFINITION'] = 'InputValueDefinition';
  Kind['INTERFACE_TYPE_DEFINITION'] = 'InterfaceTypeDefinition';
  Kind['UNION_TYPE_DEFINITION'] = 'UnionTypeDefinition';
  Kind['ENUM_TYPE_DEFINITION'] = 'EnumTypeDefinition';
  Kind['ENUM_VALUE_DEFINITION'] = 'EnumValueDefinition';
  Kind['INPUT_OBJECT_TYPE_DEFINITION'] = 'InputObjectTypeDefinition';
  Kind['DIRECTIVE_DEFINITION'] = 'DirectiveDefinition';
  Kind['SCHEMA_EXTENSION'] = 'SchemaExtension';
  Kind['SCALAR_TYPE_EXTENSION'] = 'ScalarTypeExtension';
  Kind['OBJECT_TYPE_EXTENSION'] = 'ObjectTypeExtension';
  Kind['INTERFACE_TYPE_EXTENSION'] = 'InterfaceTypeExtension';
  Kind['UNION_TYPE_EXTENSION'] = 'UnionTypeExtension';
  Kind['ENUM_TYPE_EXTENSION'] = 'EnumTypeExtension';
  Kind['INPUT_OBJECT_TYPE_EXTENSION'] = 'InputObjectTypeExtension';
})(Kind || (Kind = {}));

/**
 * A visitor is provided to visit, it contains the collection of
 * relevant functions to be called during the visitor's traversal.
 */

const BREAK = Object.freeze({});
/**
 * visit() will walk through an AST using a depth-first traversal, calling
 * the visitor's enter function at each node in the traversal, and calling the
 * leave function after visiting that node and all of its child nodes.
 *
 * By returning different values from the enter and leave functions, the
 * behavior of the visitor can be altered, including skipping over a sub-tree of
 * the AST (by returning false), editing the AST by returning a value or null
 * to remove the value, or to stop the whole traversal by returning BREAK.
 *
 * When using visit() to edit an AST, the original AST will not be modified, and
 * a new version of the AST with the changes applied will be returned from the
 * visit function.
 *
 * ```ts
 * const editedAST = visit(ast, {
 *   enter(node, key, parent, path, ancestors) {
 *     // @return
 *     //   undefined: no action
 *     //   false: skip visiting this node
 *     //   visitor.BREAK: stop visiting altogether
 *     //   null: delete this node
 *     //   any value: replace this node with the returned value
 *   },
 *   leave(node, key, parent, path, ancestors) {
 *     // @return
 *     //   undefined: no action
 *     //   false: no action
 *     //   visitor.BREAK: stop visiting altogether
 *     //   null: delete this node
 *     //   any value: replace this node with the returned value
 *   }
 * });
 * ```
 *
 * Alternatively to providing enter() and leave() functions, a visitor can
 * instead provide functions named the same as the kinds of AST nodes, or
 * enter/leave visitors at a named key, leading to three permutations of the
 * visitor API:
 *
 * 1) Named visitors triggered when entering a node of a specific kind.
 *
 * ```ts
 * visit(ast, {
 *   Kind(node) {
 *     // enter the "Kind" node
 *   }
 * })
 * ```
 *
 * 2) Named visitors that trigger upon entering and leaving a node of a specific kind.
 *
 * ```ts
 * visit(ast, {
 *   Kind: {
 *     enter(node) {
 *       // enter the "Kind" node
 *     }
 *     leave(node) {
 *       // leave the "Kind" node
 *     }
 *   }
 * })
 * ```
 *
 * 3) Generic visitors that trigger upon entering and leaving any node.
 *
 * ```ts
 * visit(ast, {
 *   enter(node) {
 *     // enter any node
 *   },
 *   leave(node) {
 *     // leave any node
 *   }
 * })
 * ```
 */

function visit(root, visitor, visitorKeys = QueryDocumentKeys) {
  const enterLeaveMap = new Map();

  for (const kind of Object.values(Kind)) {
    enterLeaveMap.set(kind, getEnterLeaveForKind(visitor, kind));
  }
  /* eslint-disable no-undef-init */

  let stack = undefined;
  let inArray = Array.isArray(root);
  let keys = [root];
  let index = -1;
  let edits = [];
  let node = root;
  let key = undefined;
  let parent = undefined;
  const path = [];
  const ancestors = [];
  /* eslint-enable no-undef-init */

  do {
    index++;
    const isLeaving = index === keys.length;
    const isEdited = isLeaving && edits.length !== 0;

    if (isLeaving) {
      key = ancestors.length === 0 ? undefined : path[path.length - 1];
      node = parent;
      parent = ancestors.pop();

      if (isEdited) {
        if (inArray) {
          node = node.slice();
          let editOffset = 0;

          for (const [editKey, editValue] of edits) {
            const arrayKey = editKey - editOffset;

            if (editValue === null) {
              node.splice(arrayKey, 1);
              editOffset++;
            } else {
              node[arrayKey] = editValue;
            }
          }
        } else {
          node = Object.defineProperties(
            {},
            Object.getOwnPropertyDescriptors(node),
          );

          for (const [editKey, editValue] of edits) {
            node[editKey] = editValue;
          }
        }
      }

      index = stack.index;
      keys = stack.keys;
      edits = stack.edits;
      inArray = stack.inArray;
      stack = stack.prev;
    } else if (parent) {
      key = inArray ? index : keys[index];
      node = parent[key];

      if (node === null || node === undefined) {
        continue;
      }

      path.push(key);
    }

    let result;

    if (!Array.isArray(node)) {
      var _enterLeaveMap$get, _enterLeaveMap$get2;

      isNode(node) || devAssert(false, `Invalid AST Node: ${inspect(node)}.`);
      const visitFn = isLeaving
        ? (_enterLeaveMap$get = enterLeaveMap.get(node.kind)) === null ||
          _enterLeaveMap$get === void 0
          ? void 0
          : _enterLeaveMap$get.leave
        : (_enterLeaveMap$get2 = enterLeaveMap.get(node.kind)) === null ||
          _enterLeaveMap$get2 === void 0
        ? void 0
        : _enterLeaveMap$get2.enter;
      result =
        visitFn === null || visitFn === void 0
          ? void 0
          : visitFn.call(visitor, node, key, parent, path, ancestors);

      if (result === BREAK) {
        break;
      }

      if (result === false) {
        if (!isLeaving) {
          path.pop();
          continue;
        }
      } else if (result !== undefined) {
        edits.push([key, result]);

        if (!isLeaving) {
          if (isNode(result)) {
            node = result;
          } else {
            path.pop();
            continue;
          }
        }
      }
    }

    if (result === undefined && isEdited) {
      edits.push([key, node]);
    }

    if (isLeaving) {
      path.pop();
    } else {
      var _node$kind;

      stack = {
        inArray,
        index,
        keys,
        edits,
        prev: stack,
      };
      inArray = Array.isArray(node);
      keys = inArray
        ? node
        : (_node$kind = visitorKeys[node.kind]) !== null &&
          _node$kind !== void 0
        ? _node$kind
        : [];
      index = -1;
      edits = [];

      if (parent) {
        ancestors.push(parent);
      }

      parent = node;
    }
  } while (stack !== undefined);

  if (edits.length !== 0) {
    // New root
    return edits[edits.length - 1][1];
  }

  return root;
}
/**
 * Given a visitor instance and a node kind, return EnterLeaveVisitor for that kind.
 */

function getEnterLeaveForKind(visitor, kind) {
  const kindVisitor = visitor[kind];

  if (typeof kindVisitor === 'object') {
    // { Kind: { enter() {}, leave() {} } }
    return kindVisitor;
  } else if (typeof kindVisitor === 'function') {
    // { Kind() {} }
    return {
      enter: kindVisitor,
      leave: undefined,
    };
  } // { enter() {}, leave() {} }

  return {
    enter: visitor.enter,
    leave: visitor.leave,
  };
}

/**
 * Converts an AST into a string, using one set of reasonable
 * formatting rules.
 */

function print(ast) {
  return visit(ast, printDocASTReducer);
}
const MAX_LINE_LENGTH = 80;
const printDocASTReducer = {
  Name: {
    leave: (node) => node.value,
  },
  Variable: {
    leave: (node) => '$' + node.name,
  },
  // Document
  Document: {
    leave: (node) => join(node.definitions, '\n\n'),
  },
  OperationDefinition: {
    leave(node) {
      const varDefs = wrap('(', join(node.variableDefinitions, ', '), ')');
      const prefix = join(
        [
          node.operation,
          join([node.name, varDefs]),
          join(node.directives, ' '),
        ],
        ' ',
      ); // Anonymous queries with no directives or variable definitions can use
      // the query short form.

      return (prefix === 'query' ? '' : prefix + ' ') + node.selectionSet;
    },
  },
  VariableDefinition: {
    leave: ({ variable, type, defaultValue, directives }) =>
      variable +
      ': ' +
      type +
      wrap(' = ', defaultValue) +
      wrap(' ', join(directives, ' ')),
  },
  SelectionSet: {
    leave: ({ selections }) => block(selections),
  },
  Field: {
    leave({ alias, name, arguments: args, directives, selectionSet }) {
      const prefix = wrap('', alias, ': ') + name;
      let argsLine = prefix + wrap('(', join(args, ', '), ')');

      if (argsLine.length > MAX_LINE_LENGTH) {
        argsLine = prefix + wrap('(\n', indent(join(args, '\n')), '\n)');
      }

      return join([argsLine, join(directives, ' '), selectionSet], ' ');
    },
  },
  Argument: {
    leave: ({ name, value }) => name + ': ' + value,
  },
  // Fragments
  FragmentSpread: {
    leave: ({ name, directives }) =>
      '...' + name + wrap(' ', join(directives, ' ')),
  },
  InlineFragment: {
    leave: ({ typeCondition, directives, selectionSet }) =>
      join(
        [
          '...',
          wrap('on ', typeCondition),
          join(directives, ' '),
          selectionSet,
        ],
        ' ',
      ),
  },
  FragmentDefinition: {
    leave: (
      { name, typeCondition, variableDefinitions, directives, selectionSet }, // Note: fragment variable definitions are experimental and may be changed
    ) =>
      // or removed in the future.
      `fragment ${name}${wrap('(', join(variableDefinitions, ', '), ')')} ` +
      `on ${typeCondition} ${wrap('', join(directives, ' '), ' ')}` +
      selectionSet,
  },
  // Value
  IntValue: {
    leave: ({ value }) => value,
  },
  FloatValue: {
    leave: ({ value }) => value,
  },
  StringValue: {
    leave: ({ value, block: isBlockString }) =>
      isBlockString ? printBlockString(value) : printString(value),
  },
  BooleanValue: {
    leave: ({ value }) => (value ? 'true' : 'false'),
  },
  NullValue: {
    leave: () => 'null',
  },
  EnumValue: {
    leave: ({ value }) => value,
  },
  ListValue: {
    leave: ({ values }) => '[' + join(values, ', ') + ']',
  },
  ObjectValue: {
    leave: ({ fields }) => '{' + join(fields, ', ') + '}',
  },
  ObjectField: {
    leave: ({ name, value }) => name + ': ' + value,
  },
  // Directive
  Directive: {
    leave: ({ name, arguments: args }) =>
      '@' + name + wrap('(', join(args, ', '), ')'),
  },
  // Type
  NamedType: {
    leave: ({ name }) => name,
  },
  ListType: {
    leave: ({ type }) => '[' + type + ']',
  },
  NonNullType: {
    leave: ({ type }) => type + '!',
  },
  // Type System Definitions
  SchemaDefinition: {
    leave: ({ description, directives, operationTypes }) =>
      wrap('', description, '\n') +
      join(['schema', join(directives, ' '), block(operationTypes)], ' '),
  },
  OperationTypeDefinition: {
    leave: ({ operation, type }) => operation + ': ' + type,
  },
  ScalarTypeDefinition: {
    leave: ({ description, name, directives }) =>
      wrap('', description, '\n') +
      join(['scalar', name, join(directives, ' ')], ' '),
  },
  ObjectTypeDefinition: {
    leave: ({ description, name, interfaces, directives, fields }) =>
      wrap('', description, '\n') +
      join(
        [
          'type',
          name,
          wrap('implements ', join(interfaces, ' & ')),
          join(directives, ' '),
          block(fields),
        ],
        ' ',
      ),
  },
  FieldDefinition: {
    leave: ({ description, name, arguments: args, type, directives }) =>
      wrap('', description, '\n') +
      name +
      (hasMultilineItems(args)
        ? wrap('(\n', indent(join(args, '\n')), '\n)')
        : wrap('(', join(args, ', '), ')')) +
      ': ' +
      type +
      wrap(' ', join(directives, ' ')),
  },
  InputValueDefinition: {
    leave: ({ description, name, type, defaultValue, directives }) =>
      wrap('', description, '\n') +
      join(
        [name + ': ' + type, wrap('= ', defaultValue), join(directives, ' ')],
        ' ',
      ),
  },
  InterfaceTypeDefinition: {
    leave: ({ description, name, interfaces, directives, fields }) =>
      wrap('', description, '\n') +
      join(
        [
          'interface',
          name,
          wrap('implements ', join(interfaces, ' & ')),
          join(directives, ' '),
          block(fields),
        ],
        ' ',
      ),
  },
  UnionTypeDefinition: {
    leave: ({ description, name, directives, types }) =>
      wrap('', description, '\n') +
      join(
        ['union', name, join(directives, ' '), wrap('= ', join(types, ' | '))],
        ' ',
      ),
  },
  EnumTypeDefinition: {
    leave: ({ description, name, directives, values }) =>
      wrap('', description, '\n') +
      join(['enum', name, join(directives, ' '), block(values)], ' '),
  },
  EnumValueDefinition: {
    leave: ({ description, name, directives }) =>
      wrap('', description, '\n') + join([name, join(directives, ' ')], ' '),
  },
  InputObjectTypeDefinition: {
    leave: ({ description, name, directives, fields }) =>
      wrap('', description, '\n') +
      join(['input', name, join(directives, ' '), block(fields)], ' '),
  },
  DirectiveDefinition: {
    leave: ({ description, name, arguments: args, repeatable, locations }) =>
      wrap('', description, '\n') +
      'directive @' +
      name +
      (hasMultilineItems(args)
        ? wrap('(\n', indent(join(args, '\n')), '\n)')
        : wrap('(', join(args, ', '), ')')) +
      (repeatable ? ' repeatable' : '') +
      ' on ' +
      join(locations, ' | '),
  },
  SchemaExtension: {
    leave: ({ directives, operationTypes }) =>
      join(
        ['extend schema', join(directives, ' '), block(operationTypes)],
        ' ',
      ),
  },
  ScalarTypeExtension: {
    leave: ({ name, directives }) =>
      join(['extend scalar', name, join(directives, ' ')], ' '),
  },
  ObjectTypeExtension: {
    leave: ({ name, interfaces, directives, fields }) =>
      join(
        [
          'extend type',
          name,
          wrap('implements ', join(interfaces, ' & ')),
          join(directives, ' '),
          block(fields),
        ],
        ' ',
      ),
  },
  InterfaceTypeExtension: {
    leave: ({ name, interfaces, directives, fields }) =>
      join(
        [
          'extend interface',
          name,
          wrap('implements ', join(interfaces, ' & ')),
          join(directives, ' '),
          block(fields),
        ],
        ' ',
      ),
  },
  UnionTypeExtension: {
    leave: ({ name, directives, types }) =>
      join(
        [
          'extend union',
          name,
          join(directives, ' '),
          wrap('= ', join(types, ' | ')),
        ],
        ' ',
      ),
  },
  EnumTypeExtension: {
    leave: ({ name, directives, values }) =>
      join(['extend enum', name, join(directives, ' '), block(values)], ' '),
  },
  InputObjectTypeExtension: {
    leave: ({ name, directives, fields }) =>
      join(['extend input', name, join(directives, ' '), block(fields)], ' '),
  },
};
/**
 * Given maybeArray, print an empty string if it is null or empty, otherwise
 * print all items together separated by separator if provided
 */

function join(maybeArray, separator = '') {
  var _maybeArray$filter$jo;

  return (_maybeArray$filter$jo =
    maybeArray === null || maybeArray === void 0
      ? void 0
      : maybeArray.filter((x) => x).join(separator)) !== null &&
    _maybeArray$filter$jo !== void 0
    ? _maybeArray$filter$jo
    : '';
}
/**
 * Given array, print each item on its own line, wrapped in an indented `{ }` block.
 */

function block(array) {
  return wrap('{\n', indent(join(array, '\n')), '\n}');
}
/**
 * If maybeString is not null or empty, then wrap with start and end, otherwise print an empty string.
 */

function wrap(start, maybeString, end = '') {
  return maybeString != null && maybeString !== ''
    ? start + maybeString + end
    : '';
}

function indent(str) {
  return wrap('  ', str.replace(/\n/g, '\n  '));
}

function hasMultilineItems(maybeArray) {
  var _maybeArray$some;

  // FIXME: https://github.com/graphql/graphql-js/issues/2203

  /* c8 ignore next */
  return (_maybeArray$some =
    maybeArray === null || maybeArray === void 0
      ? void 0
      : maybeArray.some((str) => str.includes('\n'))) !== null &&
    _maybeArray$some !== void 0
    ? _maybeArray$some
    : false;
}

const fetchRecommendationPublicBffApi = async (gql, variables) => {
  return fetch("https://bff-api.automizely.com/recommendation/public/graphql" , {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "conversions-connection-id": AppIdManager.getAppId(),
      "am-mapped-org-id": AppIdManager.getMappedOrgId()
    },
    body: JSON.stringify({
      query: typeof gql === "string" ? gql : print(gql),
      ...variables && { variables }
    })
  }).then((res) => res.json()).catch((err) => {
    console.error(err);
  });
};

const getCustomerId = () => {
  return window?.ShopifyAnalytics?.meta?.page?.customerId;
};

var ButtonActionType = /* @__PURE__ */ ((ButtonActionType2) => {
  ButtonActionType2["GoCartPage"] = "go_cart_page";
  ButtonActionType2["StaySamePage"] = "stay_same_page";
  return ButtonActionType2;
})(ButtonActionType || {});
var ButtonType = /* @__PURE__ */ ((ButtonType2) => {
  ButtonType2["AddToCart"] = "add_to_cart";
  ButtonType2["DynamicCheckout"] = "dynamic_checkout";
  ButtonType2["Redirect"] = "redirect";
  return ButtonType2;
})(ButtonType || {});
var MediaType = /* @__PURE__ */ ((MediaType2) => {
  MediaType2["ExternalVideo"] = "external_video";
  MediaType2["Image"] = "image";
  MediaType2["Video"] = "video";
  return MediaType2;
})(MediaType || {});
const GetRecommendationProductsDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "GetRecommendationProducts" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } }, "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "PublicRecommendationInput" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "getRecommendationProducts" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "input" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "products" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "imageUrls" } }, { "kind": "Field", "name": { "kind": "Name", "value": "title" } }, { "kind": "Field", "name": { "kind": "Name", "value": "price" } }, { "kind": "Field", "name": { "kind": "Name", "value": "currency" } }, { "kind": "Field", "name": { "kind": "Name", "value": "compareAtPrice" } }, { "kind": "Field", "name": { "kind": "Name", "value": "externalId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "productUrl" } }, { "kind": "Field", "name": { "kind": "Name", "value": "variantId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "variants" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "external_id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "options" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "name" } }, { "kind": "Field", "name": { "kind": "Name", "value": "value" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "available_quantity" } }, { "kind": "Field", "name": { "kind": "Name", "value": "sku" } }, { "kind": "Field", "name": { "kind": "Name", "value": "price" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "currency" } }, { "kind": "Field", "name": { "kind": "Name", "value": "amount" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "title" } }, { "kind": "Field", "name": { "kind": "Name", "value": "compare_at_price" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "currency" } }, { "kind": "Field", "name": { "kind": "Name", "value": "amount" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "available" } }, { "kind": "Field", "name": { "kind": "Name", "value": "image_url" } }, { "kind": "Field", "name": { "kind": "Name", "value": "image_urls" } }, { "kind": "Field", "name": { "kind": "Name", "value": "available_quantity" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "options" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "name" } }, { "kind": "Field", "name": { "kind": "Name", "value": "values" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "media" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "external_product_media_id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "type" } }, { "kind": "Field", "name": { "kind": "Name", "value": "sort" } }, { "kind": "Field", "name": { "kind": "Name", "value": "thumbnail" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "url" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "url" } }, { "kind": "Field", "name": { "kind": "Name", "value": "mime_type" } }, { "kind": "Field", "name": { "kind": "Name", "value": "external_video_host" } }] } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "campaign" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "status" } }, { "kind": "Field", "name": { "kind": "Name", "value": "campaign_id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "campaign_title" } }, { "kind": "Field", "name": { "kind": "Name", "value": "location" } }, { "kind": "Field", "name": { "kind": "Name", "value": "presentation_settings" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "layout" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "products_of_row" } }, { "kind": "Field", "name": { "kind": "Name", "value": "number_of_products" } }, { "kind": "Field", "name": { "kind": "Name", "value": "image_shape" } }, { "kind": "Field", "name": { "kind": "Name", "value": "image_height" } }, { "kind": "Field", "name": { "kind": "Name", "value": "image_max_width" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "desktop_layout" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "display_style" } }, { "kind": "Field", "name": { "kind": "Name", "value": "media_width" } }, { "kind": "Field", "name": { "kind": "Name", "value": "columns" } }, { "kind": "Field", "name": { "kind": "Name", "value": "number_of_products" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "mobile_layout" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "display_style" } }, { "kind": "Field", "name": { "kind": "Name", "value": "columns" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "product_info" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "alignment" } }, { "kind": "Field", "name": { "kind": "Name", "value": "image_crop" } }, { "kind": "Field", "name": { "kind": "Name", "value": "image_radius" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "color" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "product_name" } }, { "kind": "Field", "name": { "kind": "Name", "value": "product_price" } }, { "kind": "Field", "name": { "kind": "Name", "value": "compare_at_price" } }, { "kind": "Field", "name": { "kind": "Name", "value": "action_button_background" } }, { "kind": "Field", "name": { "kind": "Name", "value": "action_button_text" } }, { "kind": "Field", "name": { "kind": "Name", "value": "widget_background" } }, { "kind": "Field", "name": { "kind": "Name", "value": "campaign_title_text" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "content" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "show_product_name" } }, { "kind": "Field", "name": { "kind": "Name", "value": "show_product_price" } }, { "kind": "Field", "name": { "kind": "Name", "value": "show_compare_at_price" } }, { "kind": "Field", "name": { "kind": "Name", "value": "action_button_text" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "text" } }, { "kind": "Field", "name": { "kind": "Name", "value": "enabled" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "action_button" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "text" } }, { "kind": "Field", "name": { "kind": "Name", "value": "enabled" } }, { "kind": "Field", "name": { "kind": "Name", "value": "button_type" } }, { "kind": "Field", "name": { "kind": "Name", "value": "button_action" } }, { "kind": "Field", "name": { "kind": "Name", "value": "product_variant_picker_type" } }] } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "font" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "heading_text_font_size" } }, { "kind": "Field", "name": { "kind": "Name", "value": "heading_text_font_family" } }, { "kind": "Field", "name": { "kind": "Name", "value": "product_info_text_font_family" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "padding" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "top" } }, { "kind": "Field", "name": { "kind": "Name", "value": "bottom" } }] } }] } }] } }] } }] } }] };
const GetUserProfileDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "GetUserProfile" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "userProfile" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "commonSettings" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "content" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "automizely_brand" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "hidden" } }] } }] } }] } }] } }] } }] };

function isCartItem(data) {
  return data && typeof data?.product_id === "number";
}
function formatItemData(item, itemIndex) {
  if (!isCartItem(item)) {
    return null;
  }
  return {
    item_name: item?.product_title || "",
    item_id: `${item?.product_id || ""}`,
    item_variant_id: `${item?.variant_id || ""}`,
    quantity: item?.quantity,
    price: item?.price,
    currency_code: window?.Shopify?.currency?.active || "",
    item_brand: item?.vendor || "",
    item_category: "",
    item_list_name: window.document.title || "",
    idx: itemIndex !== void 0 ? itemIndex + 1 : 0,
    item_url: item?.url
  };
}

const callFetch = window.fetch;

const commonFetchConfig = {
  headers: {
    "Content-Type": "application/json"
  },
  mode: "cors"
};
async function callAutomizely(path, options) {
  const url = path?.includes("http") ? path : `${__API_AUTOMIZELY_URL__}${path}`;
  const response = await callFetch(url, Object.assign({}, commonFetchConfig, options));
  if (!response.ok) {
    throw response;
  }
  const data = await response.json();
  return data.data || data;
}
async function getShopifyCart() {
  const url = "/cart.js";
  const response = await callFetch(url);
  if (!response.ok) {
    throw response;
  }
  const data = await response.json();
  return data || {};
}

async function tryFetchApi(apiFn) {
  try {
    const res = await apiFn();
    return res;
  } catch (e) {
    return null;
  }
}

/**
 * @description Return `null` if not match any cart information
 * @returns {Promise<AM.ShopifyCart|null>}
 */
async function fetchCart() {
	// shopify store has this global variable
	if (window.Shopify) {
		const cart = await tryFetchApi(getShopifyCart);
		return cart;
	}
	// no result
	return null;
}

/**
 * @description Call add cart on Shopify
 * @param {import('../react/types/messageActions').ActionAddCart} params
 * @returns {Promise<{price:number}>} cart item
 */
async function addCart({
	variantId,
	promotion,
	eventId,
	sceneId,
	sellingPlanId,
}) {
	let requestUrl = '/cart/add.js';
	//TODO: if it has promotion, add query param to identify popup
	if (promotion) {
		requestUrl += '?v=';
		requestUrl += `&q0=${promotion?.promotion_id}`;
	}

	const properties =
		undefined;

	// docs: https://shopify.dev/api/ajax/reference/cart#post-cart-add-js
	// use json to send request body is more convenient than use FormData
	const requestBody = {
		items: [
			{
				id: variantId,
				quantity: 1,
				properties: properties,
			},
		],
		sections: 'cart-icon-bubble',
	};
	if (sellingPlanId) {
		requestBody.items = requestBody.items.map((item) => {
			return {
				...item,
				selling_plan: Number(sellingPlanId),
			};
		});
	}
	// NOTE: if you use callFetch, can not hijack this request
	const res = await window.fetch(requestUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		mode: 'cors',
		body: JSON.stringify(requestBody),
	});

	let data = await res.json();

	if (!res.ok) {
		if (data.status === 422 || res.status === 422) {
			const message = data.description.replace('.', '');
			throw Error(message);
		}

		throw Error('Something went wrong. Please try again');
	}

	data.items = data.items.map((e) => {
		e.url = `${e.url}&algo_id=${promotion?.algoId}`;
		return e;
	});

	data?.items.map((item) => formatItemData(item));

	// 手动刷新 home 页面购物车数据
	if (data?.sections?.['cart-icon-bubble']) {
		const cartIconBubble = document.getElementById('cart-icon-bubble');
		cartIconBubble &&
			(cartIconBubble.innerHTML = data?.sections?.['cart-icon-bubble']);
	}

	// Template bubba
	if (window?.BOOMR?.themeName === 'Template bubba') {
		const themeIconBubble = document.getElementsByClassName(
			'cart-item-count-header'
		);
		if (themeIconBubble?.length > 0) {
			Array(...themeIconBubble).forEach((element) => {
				const count = Number(element.innerHTML);
				element.textContent = count + 1;
				element.textContent = count + 1;
			});
			return data;
		}
	}

	// Wolf gray
	if (window?.BOOMR?.themeName === 'Wolf gray') {
		const wolfGrayIconBubble = document
			.getElementById('cart-link')
			?.getElementsByClassName('badge');
		if (wolfGrayIconBubble?.length > 0) {
			Array(...wolfGrayIconBubble).forEach((element) => {
				const count = Number(element.innerHTML);
				element.textContent = count + 1;
				element.textContent = count + 1;
			});
			return data;
		}
	}

	// minimal wholesaleclub
	if (window?.BOOMR?.themeName === 'Minimal') {
		const cartPageLink = document.getElementsByClassName('cart-page-link');
		const minimalWholesaleclubIconBubble = Array(...cartPageLink).find(
			(item) => item.getElementsByClassName('cart-count').length > 0
		);
		const bubble =
			minimalWholesaleclubIconBubble.getElementsByClassName('cart-count');
		if (bubble?.length > 0) {
			Array(...bubble).forEach((element) => {
				const count = Number(element.innerHTML);
				element.textContent = count + 1;
				element.textContent = count + 1;
				if (count == 0) {
					element.classList.remove('hidden-count');
				}
			});
			return data;
		}
	}

	// debut
	if (window?.BOOMR?.themeName === 'Debut') {
		const debut = document.getElementById('CartCount');
		const debutElements = debut?.getElementsByTagName('span');
		if (debutElements?.length > 0) {
			Array(...debutElements).forEach((element) => {
				const count = Number(element.innerText);
				if (count >= 0) {
					element.textContent = count + 1;
					element.textContent = count + 1;
					if (count == 0) {
						debut.classList.remove('hide');
					}
				}
			});
			return data;
		}
	}

	// sendEvent('add_to_cart', {
	// 	promotion: {
	// 		promotion_type: promotion.popupType,
	// 		app_name: promotion.appName,
	// 		promotion_id: promotion.popupId,
	// 	},
	// 	ecommerce: {items},
	// });

	return data;
}

const getPageType = () => {
  const pageType = window?.ShopifyAnalytics?.meta?.page?.pageType;
  if (pageType) {
    if (pageType == "searchresults") {
      return "search-results";
    }
    if (pageType === "page") {
      return "";
    }
    return window?.ShopifyAnalytics?.meta?.page?.pageType;
  }
  if (location.href.includes("orders") || location.href.includes("checkouts")) {
    return "thank-you";
  }
  const { pathname } = new URL(location.href);
  const paths = pathname.split("/");
  if (paths.includes("cart")) {
    return "cart";
  }
  return "";
};
const getCurProductIds = async () => {
  if (window?.ShopifyAnalytics?.meta?.products?.length) {
    return window?.ShopifyAnalytics?.meta?.products.map((item) => item.id.toString());
  }
  if (window?.ShopifyAnalytics?.meta?.product) {
    return [window?.ShopifyAnalytics?.meta?.product?.id.toString()];
  }
  if (window?.Shopify?.checkout?.line_items?.length) {
    return window.Shopify.checkout.line_items?.map((item) => item.product_id.toString());
  }
  if (getPageType() === "cart") {
    const cart = await fetchCart();
    return cart?.items?.map((item) => item.product_id.toString());
  }
  return [];
};

const sharedConfig = {};
function setHydrateContext(context) {
  sharedConfig.context = context;
}

const equalFn = (a, b) => a === b;
const $PROXY = Symbol("solid-proxy");
const $TRACK = Symbol("solid-track");
const signalOptions = {
  equals: equalFn
};
let ERROR = null;
let runEffects = runQueue;
const NOTPENDING = {};
const STALE = 1;
const PENDING = 2;
const UNOWNED = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var Owner = null;
let Transition = null;
let Listener = null;
let Pending = null;
let Updates = null;
let Effects = null;
let ExecCount = 0;
function createRoot(fn, detachedOwner) {
  const listener = Listener,
        owner = Owner,
        unowned = fn.length === 0,
        root = unowned && !false ? UNOWNED : {
    owned: null,
    cleanups: null,
    context: null,
    owner: detachedOwner || owner
  },
        updateFn = unowned ? fn : () => fn(() => cleanNode(root));
  Owner = root;
  Listener = null;
  try {
    return runUpdates(updateFn, true);
  } finally {
    Listener = listener;
    Owner = owner;
  }
}
function createSignal(value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const s = {
    value,
    observers: null,
    observerSlots: null,
    pending: NOTPENDING,
    comparator: options.equals || undefined
  };
  const setter = value => {
    if (typeof value === "function") {
      value = value(s.pending !== NOTPENDING ? s.pending : s.value);
    }
    return writeSignal(s, value);
  };
  return [readSignal.bind(s), setter];
}
function createComputed(fn, value, options) {
  const c = createComputation(fn, value, true, STALE);
  updateComputation(c);
}
function createRenderEffect(fn, value, options) {
  const c = createComputation(fn, value, false, STALE);
  updateComputation(c);
}
function createEffect(fn, value, options) {
  runEffects = runUserEffects;
  const c = createComputation(fn, value, false, STALE),
        s = SuspenseContext && lookup(Owner, SuspenseContext.id);
  if (s) c.suspense = s;
  c.user = true;
  Effects ? Effects.push(c) : updateComputation(c);
}
function createMemo(fn, value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const c = createComputation(fn, value, true, 0);
  c.pending = NOTPENDING;
  c.observers = null;
  c.observerSlots = null;
  c.comparator = options.equals || undefined;
  updateComputation(c);
  return readSignal.bind(c);
}
function batch(fn) {
  if (Pending) return fn();
  let result;
  const q = Pending = [];
  try {
    result = fn();
  } finally {
    Pending = null;
  }
  runUpdates(() => {
    for (let i = 0; i < q.length; i += 1) {
      const data = q[i];
      if (data.pending !== NOTPENDING) {
        const pending = data.pending;
        data.pending = NOTPENDING;
        writeSignal(data, pending);
      }
    }
  }, false);
  return result;
}
function untrack(fn) {
  let result,
      listener = Listener;
  Listener = null;
  result = fn();
  Listener = listener;
  return result;
}
function on(deps, fn, options) {
  const isArray = Array.isArray(deps);
  let prevInput;
  let defer = options && options.defer;
  return prevValue => {
    let input;
    if (isArray) {
      input = Array(deps.length);
      for (let i = 0; i < deps.length; i++) input[i] = deps[i]();
    } else input = deps();
    if (defer) {
      defer = false;
      return undefined;
    }
    const result = untrack(() => fn(input, prevInput, prevValue));
    prevInput = input;
    return result;
  };
}
function onMount(fn) {
  createEffect(() => untrack(fn));
}
function onCleanup(fn) {
  if (Owner === null) ;else if (Owner.cleanups === null) Owner.cleanups = [fn];else Owner.cleanups.push(fn);
  return fn;
}
function onError(fn) {
  ERROR || (ERROR = Symbol("error"));
  if (Owner === null) ;else if (Owner.context === null) Owner.context = {
    [ERROR]: [fn]
  };else if (!Owner.context[ERROR]) Owner.context[ERROR] = [fn];else Owner.context[ERROR].push(fn);
}
function getListener() {
  return Listener;
}
function getOwner() {
  return Owner;
}
function resumeEffects(e) {
  Effects.push.apply(Effects, e);
  e.length = 0;
}
function createContext(defaultValue) {
  const id = Symbol("context");
  return {
    id,
    Provider: createProvider(id),
    defaultValue
  };
}
function useContext(context) {
  let ctx;
  return (ctx = lookup(Owner, context.id)) !== undefined ? ctx : context.defaultValue;
}
function children$1(fn) {
  const children = createMemo(fn);
  return createMemo(() => resolveChildren(children()));
}
let SuspenseContext;
function getSuspenseContext() {
  return SuspenseContext || (SuspenseContext = createContext({}));
}
function readSignal() {
  const runningTransition = Transition ;
  if (this.sources && (this.state || runningTransition )) {
    const updates = Updates;
    Updates = null;
    this.state === STALE || runningTransition  ? updateComputation(this) : lookUpstream(this);
    Updates = updates;
  }
  if (Listener) {
    const sSlot = this.observers ? this.observers.length : 0;
    if (!Listener.sources) {
      Listener.sources = [this];
      Listener.sourceSlots = [sSlot];
    } else {
      Listener.sources.push(this);
      Listener.sourceSlots.push(sSlot);
    }
    if (!this.observers) {
      this.observers = [Listener];
      this.observerSlots = [Listener.sources.length - 1];
    } else {
      this.observers.push(Listener);
      this.observerSlots.push(Listener.sources.length - 1);
    }
  }
  return this.value;
}
function writeSignal(node, value, isComp) {
  if (Pending) {
    if (node.pending === NOTPENDING) Pending.push(node);
    node.pending = value;
    return value;
  }
  if (node.comparator) {
    if (node.comparator(node.value, value)) return value;
  }
  let TransitionRunning = false;
  node.value = value;
  if (node.observers && node.observers.length) {
    runUpdates(() => {
      for (let i = 0; i < node.observers.length; i += 1) {
        const o = node.observers[i];
        if (TransitionRunning && Transition.disposed.has(o)) ;
        if (TransitionRunning && !o.tState || !TransitionRunning && !o.state) {
          if (o.pure) Updates.push(o);else Effects.push(o);
          if (o.observers) markDownstream(o);
        }
        if (TransitionRunning) ;else o.state = STALE;
      }
      if (Updates.length > 10e5) {
        Updates = [];
        if (false) ;
        throw new Error();
      }
    }, false);
  }
  return value;
}
function updateComputation(node) {
  if (!node.fn) return;
  cleanNode(node);
  const owner = Owner,
        listener = Listener,
        time = ExecCount;
  Listener = Owner = node;
  runComputation(node, node.value, time);
  Listener = listener;
  Owner = owner;
}
function runComputation(node, value, time) {
  let nextValue;
  try {
    nextValue = node.fn(value);
  } catch (err) {
    handleError(err);
  }
  if (!node.updatedAt || node.updatedAt <= time) {
    if (node.observers && node.observers.length) {
      writeSignal(node, nextValue);
    } else node.value = nextValue;
    node.updatedAt = time;
  }
}
function createComputation(fn, init, pure, state = STALE, options) {
  const c = {
    fn,
    state: state,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: init,
    owner: Owner,
    context: null,
    pure
  };
  if (Owner === null) ;else if (Owner !== UNOWNED) {
    {
      if (!Owner.owned) Owner.owned = [c];else Owner.owned.push(c);
    }
  }
  return c;
}
function runTop(node) {
  const runningTransition = Transition ;
  if (node.state === 0 || runningTransition ) return;
  if (node.state === PENDING || runningTransition ) return lookUpstream(node);
  if (node.suspense && untrack(node.suspense.inFallback)) return node.suspense.effects.push(node);
  const ancestors = [node];
  while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
    if (node.state || runningTransition ) ancestors.push(node);
  }
  for (let i = ancestors.length - 1; i >= 0; i--) {
    node = ancestors[i];
    if (node.state === STALE || runningTransition ) {
      updateComputation(node);
    } else if (node.state === PENDING || runningTransition ) {
      const updates = Updates;
      Updates = null;
      lookUpstream(node, ancestors[0]);
      Updates = updates;
    }
  }
}
function runUpdates(fn, init) {
  if (Updates) return fn();
  let wait = false;
  if (!init) Updates = [];
  if (Effects) wait = true;else Effects = [];
  ExecCount++;
  try {
    const res = fn();
    completeUpdates(wait);
    return res;
  } catch (err) {
    handleError(err);
  } finally {
    Updates = null;
    if (!wait) Effects = null;
  }
}
function completeUpdates(wait) {
  if (Updates) {
    runQueue(Updates);
    Updates = null;
  }
  if (wait) return;
  if (Effects.length) batch(() => {
    runEffects(Effects);
    Effects = null;
  });else {
    Effects = null;
  }
}
function runQueue(queue) {
  for (let i = 0; i < queue.length; i++) runTop(queue[i]);
}
function runUserEffects(queue) {
  let i,
      userLength = 0;
  for (i = 0; i < queue.length; i++) {
    const e = queue[i];
    if (!e.user) runTop(e);else queue[userLength++] = e;
  }
  if (sharedConfig.context) setHydrateContext();
  const resume = queue.length;
  for (i = 0; i < userLength; i++) runTop(queue[i]);
  for (i = resume; i < queue.length; i++) runTop(queue[i]);
}
function lookUpstream(node, ignore) {
  const runningTransition = Transition ;
  node.state = 0;
  for (let i = 0; i < node.sources.length; i += 1) {
    const source = node.sources[i];
    if (source.sources) {
      if (source.state === STALE || runningTransition ) {
        if (source !== ignore) runTop(source);
      } else if (source.state === PENDING || runningTransition ) lookUpstream(source, ignore);
    }
  }
}
function markDownstream(node) {
  const runningTransition = Transition ;
  for (let i = 0; i < node.observers.length; i += 1) {
    const o = node.observers[i];
    if (!o.state || runningTransition ) {
      o.state = PENDING;
      if (o.pure) Updates.push(o);else Effects.push(o);
      o.observers && markDownstream(o);
    }
  }
}
function cleanNode(node) {
  let i;
  if (node.sources) {
    while (node.sources.length) {
      const source = node.sources.pop(),
            index = node.sourceSlots.pop(),
            obs = source.observers;
      if (obs && obs.length) {
        const n = obs.pop(),
              s = source.observerSlots.pop();
        if (index < obs.length) {
          n.sourceSlots[s] = index;
          obs[index] = n;
          source.observerSlots[index] = s;
        }
      }
    }
  }
  if (node.owned) {
    for (i = 0; i < node.owned.length; i++) cleanNode(node.owned[i]);
    node.owned = null;
  }
  if (node.cleanups) {
    for (i = 0; i < node.cleanups.length; i++) node.cleanups[i]();
    node.cleanups = null;
  }
  node.state = 0;
  node.context = null;
}
function handleError(err) {
  const fns = ERROR && lookup(Owner, ERROR);
  if (!fns) throw err;
  fns.forEach(f => f(err));
}
function lookup(owner, key) {
  return owner ? owner.context && owner.context[key] !== undefined ? owner.context[key] : lookup(owner.owner, key) : undefined;
}
function resolveChildren(children) {
  if (typeof children === "function" && !children.length) return resolveChildren(children());
  if (Array.isArray(children)) {
    const results = [];
    for (let i = 0; i < children.length; i++) {
      const result = resolveChildren(children[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children;
}
function createProvider(id) {
  return function provider(props) {
    let res;
    createComputed(() => res = untrack(() => {
      Owner.context = {
        [id]: props.value
      };
      return children$1(() => props.children);
    }));
    return res;
  };
}

const FALLBACK = Symbol("fallback");
function dispose(d) {
  for (let i = 0; i < d.length; i++) d[i]();
}
function mapArray(list, mapFn, options = {}) {
  let items = [],
      mapped = [],
      disposers = [],
      len = 0,
      indexes = mapFn.length > 1 ? [] : null;
  onCleanup(() => dispose(disposers));
  return () => {
    let newItems = list() || [],
        i,
        j;
    newItems[$TRACK];
    return untrack(() => {
      let newLen = newItems.length,
          newIndices,
          newIndicesNext,
          temp,
          tempdisposers,
          tempIndexes,
          start,
          end,
          newEnd,
          item;
      if (newLen === 0) {
        if (len !== 0) {
          dispose(disposers);
          disposers = [];
          items = [];
          mapped = [];
          len = 0;
          indexes && (indexes = []);
        }
        if (options.fallback) {
          items = [FALLBACK];
          mapped[0] = createRoot(disposer => {
            disposers[0] = disposer;
            return options.fallback();
          });
          len = 1;
        }
      }
      else if (len === 0) {
        mapped = new Array(newLen);
        for (j = 0; j < newLen; j++) {
          items[j] = newItems[j];
          mapped[j] = createRoot(mapper);
        }
        len = newLen;
      } else {
        temp = new Array(newLen);
        tempdisposers = new Array(newLen);
        indexes && (tempIndexes = new Array(newLen));
        for (start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++);
        for (end = len - 1, newEnd = newLen - 1; end >= start && newEnd >= start && items[end] === newItems[newEnd]; end--, newEnd--) {
          temp[newEnd] = mapped[end];
          tempdisposers[newEnd] = disposers[end];
          indexes && (tempIndexes[newEnd] = indexes[end]);
        }
        newIndices = new Map();
        newIndicesNext = new Array(newEnd + 1);
        for (j = newEnd; j >= start; j--) {
          item = newItems[j];
          i = newIndices.get(item);
          newIndicesNext[j] = i === undefined ? -1 : i;
          newIndices.set(item, j);
        }
        for (i = start; i <= end; i++) {
          item = items[i];
          j = newIndices.get(item);
          if (j !== undefined && j !== -1) {
            temp[j] = mapped[i];
            tempdisposers[j] = disposers[i];
            indexes && (tempIndexes[j] = indexes[i]);
            j = newIndicesNext[j];
            newIndices.set(item, j);
          } else disposers[i]();
        }
        for (j = start; j < newLen; j++) {
          if (j in temp) {
            mapped[j] = temp[j];
            disposers[j] = tempdisposers[j];
            if (indexes) {
              indexes[j] = tempIndexes[j];
              indexes[j](j);
            }
          } else mapped[j] = createRoot(mapper);
        }
        mapped = mapped.slice(0, len = newLen);
        items = newItems.slice(0);
      }
      return mapped;
    });
    function mapper(disposer) {
      disposers[j] = disposer;
      if (indexes) {
        const [s, set] = createSignal(j);
        indexes[j] = set;
        return mapFn(newItems[j], s);
      }
      return mapFn(newItems[j]);
    }
  };
}
function createComponent(Comp, props) {
  return untrack(() => Comp(props || {}));
}
function trueFn() {
  return true;
}
const propTraps = {
  get(_, property, receiver) {
    if (property === $PROXY) return receiver;
    return _.get(property);
  },
  has(_, property) {
    return _.has(property);
  },
  set: trueFn,
  deleteProperty: trueFn,
  getOwnPropertyDescriptor(_, property) {
    return {
      configurable: true,
      enumerable: true,
      get() {
        return _.get(property);
      },
      set: trueFn,
      deleteProperty: trueFn
    };
  },
  ownKeys(_) {
    return _.keys();
  }
};
function resolveSource(s) {
  return (s = typeof s === "function" ? s() : s) == null ? {} : s;
}
function mergeProps(...sources) {
  return new Proxy({
    get(property) {
      for (let i = sources.length - 1; i >= 0; i--) {
        const v = resolveSource(sources[i])[property];
        if (v !== undefined) return v;
      }
    },
    has(property) {
      for (let i = sources.length - 1; i >= 0; i--) {
        if (property in resolveSource(sources[i])) return true;
      }
      return false;
    },
    keys() {
      const keys = [];
      for (let i = 0; i < sources.length; i++) keys.push(...Object.keys(resolveSource(sources[i])));
      return [...new Set(keys)];
    }
  }, propTraps);
}
function splitProps(props, ...keys) {
  const blocked = new Set(keys.flat());
  const descriptors = Object.getOwnPropertyDescriptors(props);
  const res = keys.map(k => {
    const clone = {};
    for (let i = 0; i < k.length; i++) {
      const key = k[i];
      Object.defineProperty(clone, key, descriptors[key] ? descriptors[key] : {
        get() {
          return props[key];
        },
        set() {
          return true;
        }
      });
    }
    return clone;
  });
  res.push(new Proxy({
    get(property) {
      return blocked.has(property) ? undefined : props[property];
    },
    has(property) {
      return blocked.has(property) ? false : property in props;
    },
    keys() {
      return Object.keys(props).filter(k => !blocked.has(k));
    }
  }, propTraps));
  return res;
}

function For(props) {
  const fallback = "fallback" in props && {
    fallback: () => props.fallback
  };
  return createMemo(mapArray(() => props.each, props.children, fallback ? fallback : undefined));
}
function Show(props) {
  let strictEqual = false;
  const condition = createMemo(() => props.when, undefined, {
    equals: (a, b) => strictEqual ? a === b : !a === !b
  });
  return createMemo(() => {
    const c = condition();
    if (c) {
      const child = props.children;
      return (strictEqual = typeof child === "function" && child.length > 0) ? untrack(() => child(c)) : child;
    }
    return props.fallback;
  });
}
function Switch(props) {
  let strictEqual = false;
  const conditions = children$1(() => props.children),
        evalConditions = createMemo(() => {
    let conds = conditions();
    if (!Array.isArray(conds)) conds = [conds];
    for (let i = 0; i < conds.length; i++) {
      const c = conds[i].when;
      if (c) return [i, c, conds[i]];
    }
    return [-1];
  }, undefined, {
    equals: (a, b) => a[0] === b[0] && (strictEqual ? a[1] === b[1] : !a[1] === !b[1]) && a[2] === b[2]
  });
  return createMemo(() => {
    const [index, when, cond] = evalConditions();
    if (index < 0) return props.fallback;
    const c = cond.children;
    return (strictEqual = typeof c === "function" && c.length > 0) ? untrack(() => c(when)) : c;
  });
}
function Match(props) {
  return props;
}
let Errors;
const NoErrors = {};
function ErrorBoundary(props) {
  let err = NoErrors;
  if (sharedConfig.context && sharedConfig.load) {
    err = sharedConfig.load(sharedConfig.context.id + sharedConfig.context.count) || NoErrors;
  }
  const [errored, setErrored] = createSignal(err);
  Errors || (Errors = new Set());
  Errors.add(setErrored);
  onCleanup(() => Errors.delete(setErrored));
  return createMemo(() => {
    let e;
    if ((e = errored()) !== NoErrors) {
      const f = props.fallback;
      return typeof f === "function" && f.length ? untrack(() => f(e, () => setErrored(NoErrors))) : f;
    }
    onError(setErrored);
    return props.children;
  });
}

const SuspenseListContext = createContext();
function Suspense(props) {
  let counter = 0,
      showContent,
      showFallback,
      ctx,
      p,
      flicker,
      error;
  const [inFallback, setFallback] = createSignal(false),
        SuspenseContext = getSuspenseContext(),
        store = {
    increment: () => {
      if (++counter === 1) setFallback(true);
    },
    decrement: () => {
      if (--counter === 0) setFallback(false);
    },
    inFallback,
    effects: [],
    resolved: false
  },
        owner = getOwner();
  if (sharedConfig.context && sharedConfig.load) {
    const key = sharedConfig.context.id + sharedConfig.context.count;
    p = sharedConfig.load(key);
    if (p) {
      if (typeof p !== "object" || !("then" in p)) p = Promise.resolve(p);
      const [s, set] = createSignal(undefined, {
        equals: false
      });
      flicker = s;
      p.then(err => {
        if ((error = err) || sharedConfig.done) return set();
        sharedConfig.gather(key);
        setHydrateContext(ctx);
        set();
        setHydrateContext();
      });
    }
  }
  const listContext = useContext(SuspenseListContext);
  if (listContext) [showContent, showFallback] = listContext.register(store.inFallback);
  let dispose;
  onCleanup(() => dispose && dispose());
  return createComponent(SuspenseContext.Provider, {
    value: store,
    get children() {
      return createMemo(() => {
        if (error) throw error;
        ctx = sharedConfig.context;
        if (flicker) {
          flicker();
          return flicker = undefined;
        }
        if (ctx && p === undefined) setHydrateContext();
        const rendered = createMemo(() => props.children);
        return createMemo(() => {
          const inFallback = store.inFallback(),
                visibleContent = showContent ? showContent() : true,
                visibleFallback = showFallback ? showFallback() : true;
          dispose && dispose();
          if ((!inFallback || p !== undefined) && visibleContent) {
            store.resolved = true;
            ctx = p = undefined;
            resumeEffects(store.effects);
            return rendered();
          }
          if (!visibleFallback) return;
          return createRoot(disposer => {
            dispose = disposer;
            if (ctx) {
              setHydrateContext({
                id: ctx.id + "f",
                count: 0
              });
              ctx = undefined;
            }
            return props.fallback;
          }, owner);
        });
      });
    }
  });
}

function memo(fn, equals) {
  return createMemo(fn, undefined, !equals ? {
    equals
  } : undefined);
}

function reconcileArrays(parentNode, a, b) {
  let bLength = b.length,
      aEnd = a.length,
      bEnd = bLength,
      aStart = 0,
      bStart = 0,
      after = a[aEnd - 1].nextSibling,
      map = null;
  while (aStart < aEnd || bStart < bEnd) {
    if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
      continue;
    }
    while (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    if (aEnd === aStart) {
      const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
      while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node);
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(a[aStart])) a[aStart].remove();
        aStart++;
      }
    } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
      const node = a[--aEnd].nextSibling;
      parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
      parentNode.insertBefore(b[--bEnd], node);
      a[aEnd] = b[bEnd];
    } else {
      if (!map) {
        map = new Map();
        let i = bStart;
        while (i < bEnd) map.set(b[i], i++);
      }
      const index = map.get(a[aStart]);
      if (index != null) {
        if (bStart < index && index < bEnd) {
          let i = aStart,
              sequence = 1,
              t;
          while (++i < aEnd && i < bEnd) {
            if ((t = map.get(a[i])) == null || t !== index + sequence) break;
            sequence++;
          }
          if (sequence > index - bStart) {
            const node = a[aStart];
            while (bStart < index) parentNode.insertBefore(b[bStart++], node);
          } else parentNode.replaceChild(b[bStart++], a[aStart++]);
        } else aStart++;
      } else a[aStart++].remove();
    }
  }
}

const $$EVENTS = "_$DX_DELEGATE";
function render(code, element, init) {
  let disposer;
  createRoot(dispose => {
    disposer = dispose;
    element === document ? code() : insert(element, code(), element.firstChild ? null : undefined, init);
  });
  return () => {
    disposer();
    element.textContent = "";
  };
}
function template(html, check, isSVG) {
  const t = document.createElement("template");
  t.innerHTML = html;
  let node = t.content.firstChild;
  if (isSVG) node = node.firstChild;
  return node;
}
function delegateEvents(eventNames, document = window.document) {
  const e = document[$$EVENTS] || (document[$$EVENTS] = new Set());
  for (let i = 0, l = eventNames.length; i < l; i++) {
    const name = eventNames[i];
    if (!e.has(name)) {
      e.add(name);
      document.addEventListener(name, eventHandler);
    }
  }
}
function setAttribute$1(node, name, value) {
  if (value == null) node.removeAttribute(name);else node.setAttribute(name, value);
}
function className(node, value) {
  if (value == null) node.removeAttribute("class");else node.className = value;
}
function addEventListener(node, name, handler, delegate) {
  if (delegate) {
    if (Array.isArray(handler)) {
      node[`$$${name}`] = handler[0];
      node[`$$${name}Data`] = handler[1];
    } else node[`$$${name}`] = handler;
  } else if (Array.isArray(handler)) {
    const handlerFn = handler[0];
    node.addEventListener(name, handler[0] = e => handlerFn.call(node, handler[1], e));
  } else node.addEventListener(name, handler);
}
function style$1(node, value, prev = {}) {
  const nodeStyle = node.style;
  const prevString = typeof prev === "string";
  if (value == null && prevString || typeof value === "string") return nodeStyle.cssText = value;
  prevString && (nodeStyle.cssText = undefined, prev = {});
  value || (value = {});
  let v, s;
  for (s in prev) {
    value[s] == null && nodeStyle.removeProperty(s);
    delete prev[s];
  }
  for (s in value) {
    v = value[s];
    if (v !== prev[s]) {
      nodeStyle.setProperty(s, v);
      prev[s] = v;
    }
  }
  return prev;
}
function insert(parent, accessor, marker, initial) {
  if (marker !== undefined && !initial) initial = [];
  if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
  createRenderEffect(current => insertExpression(parent, accessor(), current, marker), initial);
}
function eventHandler(e) {
  const key = `$$${e.type}`;
  let node = e.composedPath && e.composedPath()[0] || e.target;
  if (e.target !== node) {
    Object.defineProperty(e, "target", {
      configurable: true,
      value: node
    });
  }
  Object.defineProperty(e, "currentTarget", {
    configurable: true,
    get() {
      return node || document;
    }
  });
  if (sharedConfig.registry && !sharedConfig.done) {
    sharedConfig.done = true;
    document.querySelectorAll("[id^=pl-]").forEach(elem => elem.remove());
  }
  while (node !== null) {
    const handler = node[key];
    if (handler && !node.disabled) {
      const data = node[`${key}Data`];
      data !== undefined ? handler.call(node, data, e) : handler.call(node, e);
      if (e.cancelBubble) return;
    }
    node = node.host && node.host !== node && node.host instanceof Node ? node.host : node.parentNode;
  }
}
function insertExpression(parent, value, current, marker, unwrapArray) {
  if (sharedConfig.context && !current) current = [...parent.childNodes];
  while (typeof current === "function") current = current();
  if (value === current) return current;
  const t = typeof value,
        multi = marker !== undefined;
  parent = multi && current[0] && current[0].parentNode || parent;
  if (t === "string" || t === "number") {
    if (sharedConfig.context) return current;
    if (t === "number") value = value.toString();
    if (multi) {
      let node = current[0];
      if (node && node.nodeType === 3) {
        node.data = value;
      } else node = document.createTextNode(value);
      current = cleanChildren(parent, current, marker, node);
    } else {
      if (current !== "" && typeof current === "string") {
        current = parent.firstChild.data = value;
      } else current = parent.textContent = value;
    }
  } else if (value == null || t === "boolean") {
    if (sharedConfig.context) return current;
    current = cleanChildren(parent, current, marker);
  } else if (t === "function") {
    createRenderEffect(() => {
      let v = value();
      while (typeof v === "function") v = v();
      current = insertExpression(parent, v, current, marker);
    });
    return () => current;
  } else if (Array.isArray(value)) {
    const array = [];
    if (normalizeIncomingArray(array, value, unwrapArray)) {
      createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
      return () => current;
    }
    if (sharedConfig.context) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].parentNode) return current = array;
      }
    }
    if (array.length === 0) {
      current = cleanChildren(parent, current, marker);
      if (multi) return current;
    } else if (Array.isArray(current)) {
      if (current.length === 0) {
        appendNodes(parent, array, marker);
      } else reconcileArrays(parent, current, array);
    } else {
      current && cleanChildren(parent);
      appendNodes(parent, array);
    }
    current = array;
  } else if (value instanceof Node) {
    if (sharedConfig.context && value.parentNode) return current = multi ? [value] : value;
    if (Array.isArray(current)) {
      if (multi) return current = cleanChildren(parent, current, marker, value);
      cleanChildren(parent, current, null, value);
    } else if (current == null || current === "" || !parent.firstChild) {
      parent.appendChild(value);
    } else parent.replaceChild(value, parent.firstChild);
    current = value;
  } else ;
  return current;
}
function normalizeIncomingArray(normalized, array, unwrap) {
  let dynamic = false;
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i],
        t;
    if (item instanceof Node) {
      normalized.push(item);
    } else if (item == null || item === true || item === false) ; else if (Array.isArray(item)) {
      dynamic = normalizeIncomingArray(normalized, item) || dynamic;
    } else if ((t = typeof item) === "string") {
      normalized.push(document.createTextNode(item));
    } else if (t === "function") {
      if (unwrap) {
        while (typeof item === "function") item = item();
        dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item]) || dynamic;
      } else {
        normalized.push(item);
        dynamic = true;
      }
    } else normalized.push(document.createTextNode(item.toString()));
  }
  return dynamic;
}
function appendNodes(parent, array, marker) {
  for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
}
function cleanChildren(parent, current, marker, replacement) {
  if (marker === undefined) return parent.textContent = "";
  const node = replacement || document.createTextNode("");
  if (current.length) {
    let inserted = false;
    for (let i = current.length - 1; i >= 0; i--) {
      const el = current[i];
      if (node !== el) {
        const isParent = el.parentNode === parent;
        if (!inserted && !i) isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);else isParent && el.remove();
      } else inserted = true;
    }
  } else parent.insertBefore(node, marker);
  return [node];
}

const _tmpl$$g = /*#__PURE__*/template(`<style></style>`),
      _tmpl$2$b = /*#__PURE__*/template(`<div></div>`);

const StyleComponent = ({
  styles,
  children,
  displayStyle,
  className: className$1
}) => {
  return (() => {
    const _el$ = _tmpl$2$b.cloneNode(true);

    _el$.style.setProperty("display", displayStyle);

    className(_el$, className$1);

    insert(_el$, createComponent(Show, {
      when: styles,

      get children() {
        const _el$2 = _tmpl$$g.cloneNode(true);

        insert(_el$2, styles);

        return _el$2;
      }

    }), null);

    insert(_el$, children, null);

    return _el$;
  })();
};

const $RAW = Symbol("store-raw"),
      $NODE = Symbol("store-node"),
      $NAME = Symbol("store-name");
function wrap$1(value, name) {
  let p = value[$PROXY];
  if (!p) {
    Object.defineProperty(value, $PROXY, {
      value: p = new Proxy(value, proxyTraps$1)
    });
    const keys = Object.keys(value),
          desc = Object.getOwnPropertyDescriptors(value);
    for (let i = 0, l = keys.length; i < l; i++) {
      const prop = keys[i];
      if (desc[prop].get) {
        const get = desc[prop].get.bind(p);
        Object.defineProperty(value, prop, {
          get
        });
      }
    }
  }
  return p;
}
function isWrappable(obj) {
  let proto;
  return obj != null && typeof obj === "object" && (obj[$PROXY] || !(proto = Object.getPrototypeOf(obj)) || proto === Object.prototype || Array.isArray(obj));
}
function unwrap(item, set = new Set()) {
  let result, unwrapped, v, prop;
  if (result = item != null && item[$RAW]) return result;
  if (!isWrappable(item) || set.has(item)) return item;
  if (Array.isArray(item)) {
    if (Object.isFrozen(item)) item = item.slice(0);else set.add(item);
    for (let i = 0, l = item.length; i < l; i++) {
      v = item[i];
      if ((unwrapped = unwrap(v, set)) !== v) item[i] = unwrapped;
    }
  } else {
    if (Object.isFrozen(item)) item = Object.assign({}, item);else set.add(item);
    const keys = Object.keys(item),
          desc = Object.getOwnPropertyDescriptors(item);
    for (let i = 0, l = keys.length; i < l; i++) {
      prop = keys[i];
      if (desc[prop].get) continue;
      v = item[prop];
      if ((unwrapped = unwrap(v, set)) !== v) item[prop] = unwrapped;
    }
  }
  return item;
}
function getDataNodes(target) {
  let nodes = target[$NODE];
  if (!nodes) Object.defineProperty(target, $NODE, {
    value: nodes = {}
  });
  return nodes;
}
function getDataNode(nodes, property, value) {
  return nodes[property] || (nodes[property] = createDataNode(value, true));
}
function proxyDescriptor(target, property) {
  const desc = Reflect.getOwnPropertyDescriptor(target, property);
  if (!desc || desc.get || !desc.configurable || property === $PROXY || property === $NODE || property === $NAME) return desc;
  delete desc.value;
  delete desc.writable;
  desc.get = () => target[$PROXY][property];
  return desc;
}
function trackSelf(target) {
  if (getListener()) {
    const nodes = getDataNodes(target);
    (nodes._ || (nodes._ = createDataNode()))();
  }
}
function ownKeys$1(target) {
  trackSelf(target);
  return Reflect.ownKeys(target);
}
function createDataNode(value, equals) {
  const [s, set] = createSignal(value, equals ? {
    internal: true
  } : {
    equals: false,
    internal: true
  });
  s.$ = set;
  return s;
}
const proxyTraps$1 = {
  get(target, property, receiver) {
    if (property === $RAW) return target;
    if (property === $PROXY) return receiver;
    if (property === $TRACK) return trackSelf(target);
    const nodes = getDataNodes(target);
    const tracked = nodes[property];
    let value = tracked ? nodes[property]() : target[property];
    if (property === $NODE || property === "__proto__") return value;
    if (!tracked) {
      const desc = Object.getOwnPropertyDescriptor(target, property);
      if (getListener() && (typeof value !== "function" || target.hasOwnProperty(property)) && !(desc && desc.get)) value = getDataNode(nodes, property, value)();
    }
    return isWrappable(value) ? wrap$1(value) : value;
  },
  set() {
    return true;
  },
  deleteProperty() {
    return true;
  },
  ownKeys: ownKeys$1,
  getOwnPropertyDescriptor: proxyDescriptor
};
function setProperty(state, property, value) {
  if (state[property] === value) return;
  const prev = state[property];
  const len = state.length;
  if (value === undefined) {
    delete state[property];
  } else state[property] = value;
  let nodes = getDataNodes(state),
      node;
  if (node = getDataNode(nodes, property, prev)) node.$(() => value);
  if (Array.isArray(state) && state.length !== len) (node = getDataNode(nodes, "length", len)) && node.$(state.length);
  (node = nodes._) && node.$();
}
function mergeStoreNode(state, value) {
  const keys = Object.keys(value);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    setProperty(state, key, value[key]);
  }
}
function updateArray(current, next) {
  if (typeof next === "function") next = next(current);
  next = unwrap(next);
  if (Array.isArray(next)) {
    if (current === next) return;
    let i = 0,
        len = next.length;
    for (; i < len; i++) {
      const value = next[i];
      if (current[i] !== value) setProperty(current, i, value);
    }
    setProperty(current, "length", len);
  } else mergeStoreNode(current, next);
}
function updatePath(current, path, traversed = []) {
  let part,
      prev = current;
  if (path.length > 1) {
    part = path.shift();
    const partType = typeof part,
          isArray = Array.isArray(current);
    if (Array.isArray(part)) {
      for (let i = 0; i < part.length; i++) {
        updatePath(current, [part[i]].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "function") {
      for (let i = 0; i < current.length; i++) {
        if (part(current[i], i)) updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "object") {
      const {
        from = 0,
        to = current.length - 1,
        by = 1
      } = part;
      for (let i = from; i <= to; i += by) {
        updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (path.length > 1) {
      updatePath(current[part], path, [part].concat(traversed));
      return;
    }
    prev = current[part];
    traversed = [part].concat(traversed);
  }
  let value = path[0];
  if (typeof value === "function") {
    value = value(prev, traversed);
    if (value === prev) return;
  }
  if (part === undefined && value == undefined) return;
  value = unwrap(value);
  if (part === undefined || isWrappable(prev) && isWrappable(value) && !Array.isArray(value)) {
    mergeStoreNode(prev, value);
  } else setProperty(current, part, value);
}
function createStore(store, options) {
  const unwrappedStore = unwrap(store || {});
  const isArray = Array.isArray(unwrappedStore);
  const wrappedStore = wrap$1(unwrappedStore);
  function setStore(...args) {
    batch(() => {
      isArray && args.length === 1 ? updateArray(unwrappedStore, args[0]) : updatePath(unwrappedStore, args);
    });
  }
  return [wrappedStore, setStore];
}

var styles$d = /* #__PURE__ */ (() => ".am_recommendation_container{padding:0%;width:100%;text-align:center;margin:0 auto;position:relative;padding-left:2rem;padding-right:2rem}.am_rec_product_list_section{margin:0 auto;overflow:hidden}.am_rec_product_list_section .title{width:100%;margin-top:48px;margin-bottom:36px;line-height:44px;text-align:center;font-weight:700;overflow-wrap:break-word}.am_rec_product_wrap_box{margin:0 auto}.am_rec_product_list_box{margin:0%;display:grid;justify-content:center;column-gap:20px;row-gap:20px;justify-items:center}.am_rec_modal li{list-style:none}.am_rec_modal ul,.am_rec_modal li{padding:0;margin:0}.am_recommendation_container li{list-style:none}.am_recommendation_container ul,.am_recommendation_container li{padding:0;margin:0}.am_rec_poweryby{font-size:14px;margin:0 auto;display:flex}.am_rec_poweryby.pc,.am_rec_poweryby.mobile{justify-content:end;flex-direction:row-reverse;gap:8px}.am_rec_powerby_remove_btn{color:#2c6ecb;cursor:pointer}\n")();

var styles$c = /* #__PURE__ */ (() => ".am-product-carousel--wrapper .splide{width:100%}.am-product-carousel--wrapper .splide__arrow{width:32px!important;height:32px!important;background:rgba(92,95,98,.6)!important;min-width:32px!important}.am-product-carousel--wrapper .splide__arrow:hover{background:rgba(26,28,29,.6)!important}.am-product-carousel--wrapper .splide__arrow:disabled{background:rgba(186,190,195,.6)!important;opacity:1}.am-product-carousel--wrapper .splide__arrow svg{fill:#fff;width:16px}.am-product-carousel--wrapper .splide__arrow:focus{outline:none}.am-product-carousel--wrapper .splide__arrow--prev{left:0}.am-product-carousel--wrapper .splide__arrow--next{right:0}.am-rec-productWrapper{width:100%}.am-rec-productWrapper.center{justify-content:center}.am-rec-productWrapper.center .am_product_splide--item:last-child{margin-right:0!important}.splide__slide__container{height:100%}\n")();

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*!
 * Splide.js
 * Version  : 4.0.7
 * License  : MIT
 * Copyright: 2022 Naotoshi Fujita
 */
var MEDIA_PREFERS_REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
var CREATED = 1;
var MOUNTED = 2;
var IDLE = 3;
var MOVING = 4;
var SCROLLING = 5;
var DRAGGING = 6;
var DESTROYED = 7;
var STATES = {
  CREATED: CREATED,
  MOUNTED: MOUNTED,
  IDLE: IDLE,
  MOVING: MOVING,
  SCROLLING: SCROLLING,
  DRAGGING: DRAGGING,
  DESTROYED: DESTROYED
};

function empty(array) {
  array.length = 0;
}

function slice(arrayLike, start, end) {
  return Array.prototype.slice.call(arrayLike, start, end);
}

function apply(func) {
  return func.bind.apply(func, [null].concat(slice(arguments, 1)));
}

var nextTick = setTimeout;

var noop = function noop() {};

function raf(func) {
  return requestAnimationFrame(func);
}

function typeOf(type, subject) {
  return typeof subject === type;
}

function isObject(subject) {
  return !isNull(subject) && typeOf("object", subject);
}

var isArray = Array.isArray;
var isFunction = apply(typeOf, "function");
var isString = apply(typeOf, "string");
var isUndefined = apply(typeOf, "undefined");

function isNull(subject) {
  return subject === null;
}

function isHTMLElement(subject) {
  return subject instanceof HTMLElement;
}

function toArray(value) {
  return isArray(value) ? value : [value];
}

function forEach(values, iteratee) {
  toArray(values).forEach(iteratee);
}

function includes(array, value) {
  return array.indexOf(value) > -1;
}

function push(array, items) {
  array.push.apply(array, toArray(items));
  return array;
}

function toggleClass(elm, classes, add) {
  if (elm) {
    forEach(classes, function (name) {
      if (name) {
        elm.classList[add ? "add" : "remove"](name);
      }
    });
  }
}

function addClass(elm, classes) {
  toggleClass(elm, isString(classes) ? classes.split(" ") : classes, true);
}

function append(parent, children) {
  forEach(children, parent.appendChild.bind(parent));
}

function before(nodes, ref) {
  forEach(nodes, function (node) {
    var parent = (ref || node).parentNode;

    if (parent) {
      parent.insertBefore(node, ref);
    }
  });
}

function matches(elm, selector) {
  return isHTMLElement(elm) && (elm["msMatchesSelector"] || elm.matches).call(elm, selector);
}

function children(parent, selector) {
  var children2 = parent ? slice(parent.children) : [];
  return selector ? children2.filter(function (child) {
    return matches(child, selector);
  }) : children2;
}

function child(parent, selector) {
  return selector ? children(parent, selector)[0] : parent.firstElementChild;
}

var ownKeys = Object.keys;

function forOwn(object, iteratee, right) {
  if (object) {
    var keys = ownKeys(object);
    keys = right ? keys.reverse() : keys;

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key !== "__proto__") {
        if (iteratee(object[key], key) === false) {
          break;
        }
      }
    }
  }

  return object;
}

function assign(object) {
  slice(arguments, 1).forEach(function (source) {
    forOwn(source, function (value, key) {
      object[key] = source[key];
    });
  });
  return object;
}

function merge(object) {
  slice(arguments, 1).forEach(function (source) {
    forOwn(source, function (value, key) {
      if (isArray(value)) {
        object[key] = value.slice();
      } else if (isObject(value)) {
        object[key] = merge({}, isObject(object[key]) ? object[key] : {}, value);
      } else {
        object[key] = value;
      }
    });
  });
  return object;
}

function omit(object, keys) {
  toArray(keys || ownKeys(object)).forEach(function (key) {
    delete object[key];
  });
}

function removeAttribute(elms, attrs) {
  forEach(elms, function (elm) {
    forEach(attrs, function (attr) {
      elm && elm.removeAttribute(attr);
    });
  });
}

function setAttribute(elms, attrs, value) {
  if (isObject(attrs)) {
    forOwn(attrs, function (value2, name) {
      setAttribute(elms, name, value2);
    });
  } else {
    forEach(elms, function (elm) {
      isNull(value) || value === "" ? removeAttribute(elm, attrs) : elm.setAttribute(attrs, String(value));
    });
  }
}

function create(tag, attrs, parent) {
  var elm = document.createElement(tag);

  if (attrs) {
    isString(attrs) ? addClass(elm, attrs) : setAttribute(elm, attrs);
  }

  parent && append(parent, elm);
  return elm;
}

function style(elm, prop, value) {
  if (isUndefined(value)) {
    return getComputedStyle(elm)[prop];
  }

  if (!isNull(value)) {
    elm.style[prop] = "" + value;
  }
}

function display(elm, display2) {
  style(elm, "display", display2);
}

function focus(elm) {
  elm["setActive"] && elm["setActive"]() || elm.focus({
    preventScroll: true
  });
}

function getAttribute(elm, attr) {
  return elm.getAttribute(attr);
}

function hasClass(elm, className) {
  return elm && elm.classList.contains(className);
}

function rect(target) {
  return target.getBoundingClientRect();
}

function remove(nodes) {
  forEach(nodes, function (node) {
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  });
}

function parseHtml(html) {
  return child(new DOMParser().parseFromString(html, "text/html").body);
}

function prevent(e, stopPropagation) {
  e.preventDefault();

  if (stopPropagation) {
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
}

function query(parent, selector) {
  return parent && parent.querySelector(selector);
}

function queryAll(parent, selector) {
  return selector ? slice(parent.querySelectorAll(selector)) : [];
}

function removeClass(elm, classes) {
  toggleClass(elm, classes, false);
}

function timeOf(e) {
  return e.timeStamp;
}

function unit(value) {
  return isString(value) ? value : value ? value + "px" : "";
}

var PROJECT_CODE = "splide";
var DATA_ATTRIBUTE = "data-" + PROJECT_CODE;

function assert(condition, message) {
  if (!condition) {
    throw new Error("[" + PROJECT_CODE + "] " + (message || ""));
  }
}

var min = Math.min,
    max = Math.max,
    floor = Math.floor,
    ceil = Math.ceil,
    abs = Math.abs;

function approximatelyEqual(x, y, epsilon) {
  return abs(x - y) < epsilon;
}

function between(number, minOrMax, maxOrMin, exclusive) {
  var minimum = min(minOrMax, maxOrMin);
  var maximum = max(minOrMax, maxOrMin);
  return exclusive ? minimum < number && number < maximum : minimum <= number && number <= maximum;
}

function clamp(number, x, y) {
  var minimum = min(x, y);
  var maximum = max(x, y);
  return min(max(minimum, number), maximum);
}

function sign(x) {
  return +(x > 0) - +(x < 0);
}

function format(string, replacements) {
  forEach(replacements, function (replacement) {
    string = string.replace("%s", "" + replacement);
  });
  return string;
}

function pad(number) {
  return number < 10 ? "0" + number : "" + number;
}

var ids = {};

function uniqueId(prefix) {
  return "" + prefix + pad(ids[prefix] = (ids[prefix] || 0) + 1);
}

function EventBinder() {
  var listeners = [];

  function bind(targets, events, callback, options) {
    forEachEvent(targets, events, function (target, event, namespace) {
      var isEventTarget = ("addEventListener" in target);
      var remover = isEventTarget ? target.removeEventListener.bind(target, event, callback, options) : target["removeListener"].bind(target, callback);
      isEventTarget ? target.addEventListener(event, callback, options) : target["addListener"](callback);
      listeners.push([target, event, namespace, callback, remover]);
    });
  }

  function unbind(targets, events, callback) {
    forEachEvent(targets, events, function (target, event, namespace) {
      listeners = listeners.filter(function (listener) {
        if (listener[0] === target && listener[1] === event && listener[2] === namespace && (!callback || listener[3] === callback)) {
          listener[4]();
          return false;
        }

        return true;
      });
    });
  }

  function dispatch(target, type, detail) {
    var e;
    var bubbles = true;

    if (typeof CustomEvent === "function") {
      e = new CustomEvent(type, {
        bubbles: bubbles,
        detail: detail
      });
    } else {
      e = document.createEvent("CustomEvent");
      e.initCustomEvent(type, bubbles, false, detail);
    }

    target.dispatchEvent(e);
    return e;
  }

  function forEachEvent(targets, events, iteratee) {
    forEach(targets, function (target) {
      target && forEach(events, function (events2) {
        events2.split(" ").forEach(function (eventNS) {
          var fragment = eventNS.split(".");
          iteratee(target, fragment[0], fragment[1]);
        });
      });
    });
  }

  function destroy() {
    listeners.forEach(function (data) {
      data[4]();
    });
    empty(listeners);
  }

  return {
    bind: bind,
    unbind: unbind,
    dispatch: dispatch,
    destroy: destroy
  };
}

var EVENT_MOUNTED = "mounted";
var EVENT_READY = "ready";
var EVENT_MOVE = "move";
var EVENT_MOVED = "moved";
var EVENT_SHIFTED = "shifted";
var EVENT_CLICK = "click";
var EVENT_ACTIVE = "active";
var EVENT_INACTIVE = "inactive";
var EVENT_VISIBLE = "visible";
var EVENT_HIDDEN = "hidden";
var EVENT_SLIDE_KEYDOWN = "slide:keydown";
var EVENT_REFRESH = "refresh";
var EVENT_UPDATED = "updated";
var EVENT_RESIZE = "resize";
var EVENT_RESIZED = "resized";
var EVENT_DRAG = "drag";
var EVENT_DRAGGING = "dragging";
var EVENT_DRAGGED = "dragged";
var EVENT_SCROLL = "scroll";
var EVENT_SCROLLED = "scrolled";
var EVENT_DESTROY = "destroy";
var EVENT_ARROWS_MOUNTED = "arrows:mounted";
var EVENT_ARROWS_UPDATED = "arrows:updated";
var EVENT_PAGINATION_MOUNTED = "pagination:mounted";
var EVENT_PAGINATION_UPDATED = "pagination:updated";
var EVENT_NAVIGATION_MOUNTED = "navigation:mounted";
var EVENT_AUTOPLAY_PLAY = "autoplay:play";
var EVENT_AUTOPLAY_PLAYING = "autoplay:playing";
var EVENT_AUTOPLAY_PAUSE = "autoplay:pause";
var EVENT_LAZYLOAD_LOADED = "lazyload:loaded";

function EventInterface(Splide2) {
  var bus = Splide2 ? Splide2.event.bus : document.createDocumentFragment();
  var binder = EventBinder();

  function on(events, callback) {
    binder.bind(bus, toArray(events).join(" "), function (e) {
      callback.apply(callback, isArray(e.detail) ? e.detail : []);
    });
  }

  function emit(event) {
    binder.dispatch(bus, event, slice(arguments, 1));
  }

  if (Splide2) {
    Splide2.event.on(EVENT_DESTROY, binder.destroy);
  }

  return assign(binder, {
    bus: bus,
    on: on,
    off: apply(binder.unbind, bus),
    emit: emit
  });
}

function RequestInterval(interval, onInterval, onUpdate, limit) {
  var now = Date.now;
  var startTime;
  var rate = 0;
  var id;
  var paused = true;
  var count = 0;

  function update() {
    if (!paused) {
      rate = interval ? min((now() - startTime) / interval, 1) : 1;
      onUpdate && onUpdate(rate);

      if (rate >= 1) {
        onInterval();
        startTime = now();

        if (limit && ++count >= limit) {
          return pause();
        }
      }

      raf(update);
    }
  }

  function start(resume) {
    !resume && cancel();
    startTime = now() - (resume ? rate * interval : 0);
    paused = false;
    raf(update);
  }

  function pause() {
    paused = true;
  }

  function rewind() {
    startTime = now();
    rate = 0;

    if (onUpdate) {
      onUpdate(rate);
    }
  }

  function cancel() {
    id && cancelAnimationFrame(id);
    rate = 0;
    id = 0;
    paused = true;
  }

  function set(time) {
    interval = time;
  }

  function isPaused() {
    return paused;
  }

  return {
    start: start,
    rewind: rewind,
    pause: pause,
    cancel: cancel,
    set: set,
    isPaused: isPaused
  };
}

function State(initialState) {
  var state = initialState;

  function set(value) {
    state = value;
  }

  function is(states) {
    return includes(toArray(states), state);
  }

  return {
    set: set,
    is: is
  };
}

function Throttle(func, duration) {
  var interval;

  function throttled() {
    if (!interval) {
      interval = RequestInterval(duration || 0, function () {
        func();
        interval = null;
      }, null, 1);
      interval.start();
    }
  }

  return throttled;
}

function Media(Splide2, Components2, options) {
  var state = Splide2.state;
  var breakpoints = options.breakpoints || {};
  var reducedMotion = options.reducedMotion || {};
  var binder = EventBinder();
  var queries = [];

  function setup() {
    var isMin = options.mediaQuery === "min";
    ownKeys(breakpoints).sort(function (n, m) {
      return isMin ? +n - +m : +m - +n;
    }).forEach(function (key) {
      register(breakpoints[key], "(" + (isMin ? "min" : "max") + "-width:" + key + "px)");
    });
    register(reducedMotion, MEDIA_PREFERS_REDUCED_MOTION);
    update();
  }

  function destroy(completely) {
    if (completely) {
      binder.destroy();
    }
  }

  function register(options2, query) {
    var queryList = matchMedia(query);
    binder.bind(queryList, "change", update);
    queries.push([options2, queryList]);
  }

  function update() {
    var destroyed = state.is(DESTROYED);
    var direction = options.direction;
    var merged = queries.reduce(function (merged2, entry) {
      return merge(merged2, entry[1].matches ? entry[0] : {});
    }, {});
    omit(options);
    set(merged);

    if (options.destroy) {
      Splide2.destroy(options.destroy === "completely");
    } else if (destroyed) {
      destroy(true);
      Splide2.mount();
    } else {
      direction !== options.direction && Splide2.refresh();
    }
  }

  function reduce(enable) {
    if (matchMedia(MEDIA_PREFERS_REDUCED_MOTION).matches) {
      enable ? merge(options, reducedMotion) : omit(options, ownKeys(reducedMotion));
    }
  }

  function set(opts, user) {
    merge(options, opts);
    user && merge(Object.getPrototypeOf(options), opts);

    if (!state.is(CREATED)) {
      Splide2.emit(EVENT_UPDATED, options);
    }
  }

  return {
    setup: setup,
    destroy: destroy,
    reduce: reduce,
    set: set
  };
}

var ARROW = "Arrow";
var ARROW_LEFT = ARROW + "Left";
var ARROW_RIGHT = ARROW + "Right";
var ARROW_UP = ARROW + "Up";
var ARROW_DOWN = ARROW + "Down";
var RTL = "rtl";
var TTB = "ttb";
var ORIENTATION_MAP = {
  width: ["height"],
  left: ["top", "right"],
  right: ["bottom", "left"],
  x: ["y"],
  X: ["Y"],
  Y: ["X"],
  ArrowLeft: [ARROW_UP, ARROW_RIGHT],
  ArrowRight: [ARROW_DOWN, ARROW_LEFT]
};

function Direction(Splide2, Components2, options) {
  function resolve(prop, axisOnly, direction) {
    direction = direction || options.direction;
    var index = direction === RTL && !axisOnly ? 1 : direction === TTB ? 0 : -1;
    return ORIENTATION_MAP[prop] && ORIENTATION_MAP[prop][index] || prop.replace(/width|left|right/i, function (match, offset) {
      var replacement = ORIENTATION_MAP[match.toLowerCase()][index] || match;
      return offset > 0 ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
    });
  }

  function orient(value) {
    return value * (options.direction === RTL ? 1 : -1);
  }

  return {
    resolve: resolve,
    orient: orient
  };
}

var ROLE = "role";
var TAB_INDEX = "tabindex";
var DISABLED = "disabled";
var ARIA_PREFIX = "aria-";
var ARIA_CONTROLS = ARIA_PREFIX + "controls";
var ARIA_CURRENT = ARIA_PREFIX + "current";
var ARIA_SELECTED = ARIA_PREFIX + "selected";
var ARIA_LABEL = ARIA_PREFIX + "label";
var ARIA_LABELLEDBY = ARIA_PREFIX + "labelledby";
var ARIA_HIDDEN = ARIA_PREFIX + "hidden";
var ARIA_ORIENTATION = ARIA_PREFIX + "orientation";
var ARIA_ROLEDESCRIPTION = ARIA_PREFIX + "roledescription";
var ARIA_LIVE = ARIA_PREFIX + "live";
var ARIA_BUSY = ARIA_PREFIX + "busy";
var ARIA_ATOMIC = ARIA_PREFIX + "atomic";
var ALL_ATTRIBUTES = [ROLE, TAB_INDEX, DISABLED, ARIA_CONTROLS, ARIA_CURRENT, ARIA_LABEL, ARIA_LABELLEDBY, ARIA_HIDDEN, ARIA_ORIENTATION, ARIA_ROLEDESCRIPTION];
var CLASS_ROOT = PROJECT_CODE;
var CLASS_TRACK = PROJECT_CODE + "__track";
var CLASS_LIST = PROJECT_CODE + "__list";
var CLASS_SLIDE = PROJECT_CODE + "__slide";
var CLASS_CLONE = CLASS_SLIDE + "--clone";
var CLASS_CONTAINER = CLASS_SLIDE + "__container";
var CLASS_ARROWS = PROJECT_CODE + "__arrows";
var CLASS_ARROW = PROJECT_CODE + "__arrow";
var CLASS_ARROW_PREV = CLASS_ARROW + "--prev";
var CLASS_ARROW_NEXT = CLASS_ARROW + "--next";
var CLASS_PAGINATION = PROJECT_CODE + "__pagination";
var CLASS_PAGINATION_PAGE = CLASS_PAGINATION + "__page";
var CLASS_PROGRESS = PROJECT_CODE + "__progress";
var CLASS_PROGRESS_BAR = CLASS_PROGRESS + "__bar";
var CLASS_TOGGLE = PROJECT_CODE + "__toggle";
var CLASS_SPINNER = PROJECT_CODE + "__spinner";
var CLASS_SR = PROJECT_CODE + "__sr";
var CLASS_INITIALIZED = "is-initialized";
var CLASS_ACTIVE = "is-active";
var CLASS_PREV = "is-prev";
var CLASS_NEXT = "is-next";
var CLASS_VISIBLE = "is-visible";
var CLASS_LOADING = "is-loading";
var CLASS_FOCUS_IN = "is-focus-in";
var STATUS_CLASSES = [CLASS_ACTIVE, CLASS_VISIBLE, CLASS_PREV, CLASS_NEXT, CLASS_LOADING, CLASS_FOCUS_IN];
var CLASSES = {
  slide: CLASS_SLIDE,
  clone: CLASS_CLONE,
  arrows: CLASS_ARROWS,
  arrow: CLASS_ARROW,
  prev: CLASS_ARROW_PREV,
  next: CLASS_ARROW_NEXT,
  pagination: CLASS_PAGINATION,
  page: CLASS_PAGINATION_PAGE,
  spinner: CLASS_SPINNER
};

function closest(from, selector) {
  if (isFunction(from.closest)) {
    return from.closest(selector);
  }

  var elm = from;

  while (elm && elm.nodeType === 1) {
    if (matches(elm, selector)) {
      break;
    }

    elm = elm.parentElement;
  }

  return elm;
}

var FRICTION = 5;
var LOG_INTERVAL = 200;
var POINTER_DOWN_EVENTS = "touchstart mousedown";
var POINTER_MOVE_EVENTS = "touchmove mousemove";
var POINTER_UP_EVENTS = "touchend touchcancel mouseup click";

function Elements(Splide2, Components2, options) {
  var _EventInterface = EventInterface(Splide2),
      on = _EventInterface.on,
      bind = _EventInterface.bind;

  var root = Splide2.root;
  var i18n = options.i18n;
  var elements = {};
  var slides = [];
  var rootClasses = [];
  var trackClasses = [];
  var track;
  var list;
  var isUsingKey;

  function setup() {
    collect();
    init();
    update();
  }

  function mount() {
    on(EVENT_REFRESH, destroy);
    on(EVENT_REFRESH, setup);
    on(EVENT_UPDATED, update);
    bind(document, POINTER_DOWN_EVENTS + " keydown", function (e) {
      isUsingKey = e.type === "keydown";
    }, {
      capture: true
    });
    bind(root, "focusin", function () {
      toggleClass(root, CLASS_FOCUS_IN, !!isUsingKey);
    });
  }

  function destroy(completely) {
    var attrs = ALL_ATTRIBUTES.concat("style");
    empty(slides);
    removeClass(root, rootClasses);
    removeClass(track, trackClasses);
    removeAttribute([track, list], attrs);
    removeAttribute(root, completely ? attrs : ["style", ARIA_ROLEDESCRIPTION]);
  }

  function update() {
    removeClass(root, rootClasses);
    removeClass(track, trackClasses);
    rootClasses = getClasses(CLASS_ROOT);
    trackClasses = getClasses(CLASS_TRACK);
    addClass(root, rootClasses);
    addClass(track, trackClasses);
    setAttribute(root, ARIA_LABEL, options.label);
    setAttribute(root, ARIA_LABELLEDBY, options.labelledby);
  }

  function collect() {
    track = find("." + CLASS_TRACK);
    list = child(track, "." + CLASS_LIST);
    assert(track && list, "A track/list element is missing.");
    push(slides, children(list, "." + CLASS_SLIDE + ":not(." + CLASS_CLONE + ")"));
    forOwn({
      arrows: CLASS_ARROWS,
      pagination: CLASS_PAGINATION,
      prev: CLASS_ARROW_PREV,
      next: CLASS_ARROW_NEXT,
      bar: CLASS_PROGRESS_BAR,
      toggle: CLASS_TOGGLE
    }, function (className, key) {
      elements[key] = find("." + className);
    });
    assign(elements, {
      root: root,
      track: track,
      list: list,
      slides: slides
    });
  }

  function init() {
    var id = root.id || uniqueId(PROJECT_CODE);
    var role = options.role;
    root.id = id;
    track.id = track.id || id + "-track";
    list.id = list.id || id + "-list";

    if (!getAttribute(root, ROLE) && root.tagName !== "SECTION" && role) {
      setAttribute(root, ROLE, role);
    }

    setAttribute(root, ARIA_ROLEDESCRIPTION, i18n.carousel);
    setAttribute(list, ROLE, "presentation");
  }

  function find(selector) {
    var elm = query(root, selector);
    return elm && closest(elm, "." + CLASS_ROOT) === root ? elm : void 0;
  }

  function getClasses(base) {
    return [base + "--" + options.type, base + "--" + options.direction, options.drag && base + "--draggable", options.isNavigation && base + "--nav", base === CLASS_ROOT && CLASS_ACTIVE];
  }

  return assign(elements, {
    setup: setup,
    mount: mount,
    destroy: destroy
  });
}

var SLIDE = "slide";
var LOOP = "loop";
var FADE = "fade";

function Slide$1(Splide2, index, slideIndex, slide) {
  var event = EventInterface(Splide2);
  var on = event.on,
      emit = event.emit,
      bind = event.bind;
  var Components = Splide2.Components,
      root = Splide2.root,
      options = Splide2.options;
  var isNavigation = options.isNavigation,
      updateOnMove = options.updateOnMove,
      i18n = options.i18n,
      pagination = options.pagination,
      slideFocus = options.slideFocus;
  var resolve = Components.Direction.resolve;
  var styles = getAttribute(slide, "style");
  var label = getAttribute(slide, ARIA_LABEL);
  var isClone = slideIndex > -1;
  var container = child(slide, "." + CLASS_CONTAINER);
  var focusableNodes = queryAll(slide, options.focusableNodes || "");
  var destroyed;

  function mount() {
    if (!isClone) {
      slide.id = root.id + "-slide" + pad(index + 1);
      setAttribute(slide, ROLE, pagination ? "tabpanel" : "group");
      setAttribute(slide, ARIA_ROLEDESCRIPTION, i18n.slide);
      setAttribute(slide, ARIA_LABEL, label || format(i18n.slideLabel, [index + 1, Splide2.length]));
    }

    listen();
  }

  function listen() {
    bind(slide, "click", apply(emit, EVENT_CLICK, self));
    bind(slide, "keydown", apply(emit, EVENT_SLIDE_KEYDOWN, self));
    on([EVENT_MOVED, EVENT_SHIFTED, EVENT_SCROLLED], update);
    on(EVENT_NAVIGATION_MOUNTED, initNavigation);

    if (updateOnMove) {
      on(EVENT_MOVE, onMove);
    }
  }

  function destroy() {
    destroyed = true;
    event.destroy();
    removeClass(slide, STATUS_CLASSES);
    removeAttribute(slide, ALL_ATTRIBUTES);
    setAttribute(slide, "style", styles);
    setAttribute(slide, ARIA_LABEL, label || "");
  }

  function initNavigation() {
    var controls = Splide2.splides.map(function (target) {
      var Slide2 = target.splide.Components.Slides.getAt(index);
      return Slide2 ? Slide2.slide.id : "";
    }).join(" ");
    setAttribute(slide, ARIA_LABEL, format(i18n.slideX, (isClone ? slideIndex : index) + 1));
    setAttribute(slide, ARIA_CONTROLS, controls);
    setAttribute(slide, ROLE, slideFocus ? "button" : "");
    slideFocus && removeAttribute(slide, ARIA_ROLEDESCRIPTION);
  }

  function onMove() {
    if (!destroyed) {
      update();
    }
  }

  function update() {
    if (!destroyed) {
      var curr = Splide2.index;
      updateActivity();
      updateVisibility();
      toggleClass(slide, CLASS_PREV, index === curr - 1);
      toggleClass(slide, CLASS_NEXT, index === curr + 1);
    }
  }

  function updateActivity() {
    var active = isActive();

    if (active !== hasClass(slide, CLASS_ACTIVE)) {
      toggleClass(slide, CLASS_ACTIVE, active);
      setAttribute(slide, ARIA_CURRENT, isNavigation && active || "");
      emit(active ? EVENT_ACTIVE : EVENT_INACTIVE, self);
    }
  }

  function updateVisibility() {
    var visible = isVisible();
    var hidden = !visible && (!isActive() || isClone);

    if (!Splide2.state.is([MOVING, SCROLLING])) {
      setAttribute(slide, ARIA_HIDDEN, hidden || "");
    }

    setAttribute(focusableNodes, TAB_INDEX, hidden ? -1 : "");

    if (slideFocus) {
      setAttribute(slide, TAB_INDEX, hidden ? -1 : 0);
    }

    if (visible !== hasClass(slide, CLASS_VISIBLE)) {
      toggleClass(slide, CLASS_VISIBLE, visible);
      emit(visible ? EVENT_VISIBLE : EVENT_HIDDEN, self);
    }

    if (!visible && document.activeElement === slide) {
      var Slide2 = Components.Slides.getAt(Splide2.index);
      Slide2 && focus(Slide2.slide);
    }
  }

  function style$1(prop, value, useContainer) {
    style(useContainer && container || slide, prop, value);
  }

  function isActive() {
    var curr = Splide2.index;
    return curr === index || options.cloneStatus && curr === slideIndex;
  }

  function isVisible() {
    if (Splide2.is(FADE)) {
      return isActive();
    }

    var trackRect = rect(Components.Elements.track);
    var slideRect = rect(slide);
    var left = resolve("left", true);
    var right = resolve("right", true);
    return floor(trackRect[left]) <= ceil(slideRect[left]) && floor(slideRect[right]) <= ceil(trackRect[right]);
  }

  function isWithin(from, distance) {
    var diff = abs(from - index);

    if (!isClone && (options.rewind || Splide2.is(LOOP))) {
      diff = min(diff, Splide2.length - diff);
    }

    return diff <= distance;
  }

  var self = {
    index: index,
    slideIndex: slideIndex,
    slide: slide,
    container: container,
    isClone: isClone,
    mount: mount,
    destroy: destroy,
    update: update,
    style: style$1,
    isWithin: isWithin
  };
  return self;
}

function Slides(Splide2, Components2, options) {
  var _EventInterface2 = EventInterface(Splide2),
      on = _EventInterface2.on,
      emit = _EventInterface2.emit,
      bind = _EventInterface2.bind;

  var _Components2$Elements = Components2.Elements,
      slides = _Components2$Elements.slides,
      list = _Components2$Elements.list;
  var Slides2 = [];

  function mount() {
    init();
    on(EVENT_REFRESH, destroy);
    on(EVENT_REFRESH, init);
    on([EVENT_MOUNTED, EVENT_REFRESH], function () {
      Slides2.sort(function (Slide1, Slide2) {
        return Slide1.index - Slide2.index;
      });
    });
  }

  function init() {
    slides.forEach(function (slide, index) {
      register(slide, index, -1);
    });
  }

  function destroy() {
    forEach$1(function (Slide2) {
      Slide2.destroy();
    });
    empty(Slides2);
  }

  function update() {
    forEach$1(function (Slide2) {
      Slide2.update();
    });
  }

  function register(slide, index, slideIndex) {
    var object = Slide$1(Splide2, index, slideIndex, slide);
    object.mount();
    Slides2.push(object);
  }

  function get(excludeClones) {
    return excludeClones ? filter(function (Slide2) {
      return !Slide2.isClone;
    }) : Slides2;
  }

  function getIn(page) {
    var Controller = Components2.Controller;
    var index = Controller.toIndex(page);
    var max = Controller.hasFocus() ? 1 : options.perPage;
    return filter(function (Slide2) {
      return between(Slide2.index, index, index + max - 1);
    });
  }

  function getAt(index) {
    return filter(index)[0];
  }

  function add(items, index) {
    forEach(items, function (slide) {
      if (isString(slide)) {
        slide = parseHtml(slide);
      }

      if (isHTMLElement(slide)) {
        var ref = slides[index];
        ref ? before(slide, ref) : append(list, slide);
        addClass(slide, options.classes.slide);
        observeImages(slide, apply(emit, EVENT_RESIZE));
      }
    });
    emit(EVENT_REFRESH);
  }

  function remove$1(matcher) {
    remove(filter(matcher).map(function (Slide2) {
      return Slide2.slide;
    }));
    emit(EVENT_REFRESH);
  }

  function forEach$1(iteratee, excludeClones) {
    get(excludeClones).forEach(iteratee);
  }

  function filter(matcher) {
    return Slides2.filter(isFunction(matcher) ? matcher : function (Slide2) {
      return isString(matcher) ? matches(Slide2.slide, matcher) : includes(toArray(matcher), Slide2.index);
    });
  }

  function style(prop, value, useContainer) {
    forEach$1(function (Slide2) {
      Slide2.style(prop, value, useContainer);
    });
  }

  function observeImages(elm, callback) {
    var images = queryAll(elm, "img");
    var length = images.length;

    if (length) {
      images.forEach(function (img) {
        bind(img, "load error", function () {
          if (! --length) {
            callback();
          }
        });
      });
    } else {
      callback();
    }
  }

  function getLength(excludeClones) {
    return excludeClones ? slides.length : Slides2.length;
  }

  function isEnough() {
    return Slides2.length > options.perPage;
  }

  return {
    mount: mount,
    destroy: destroy,
    update: update,
    register: register,
    get: get,
    getIn: getIn,
    getAt: getAt,
    add: add,
    remove: remove$1,
    forEach: forEach$1,
    filter: filter,
    style: style,
    getLength: getLength,
    isEnough: isEnough
  };
}

function Layout(Splide2, Components2, options) {
  var _EventInterface3 = EventInterface(Splide2),
      on = _EventInterface3.on,
      bind = _EventInterface3.bind,
      emit = _EventInterface3.emit;

  var Slides = Components2.Slides;
  var resolve = Components2.Direction.resolve;
  var _Components2$Elements2 = Components2.Elements,
      root = _Components2$Elements2.root,
      track = _Components2$Elements2.track,
      list = _Components2$Elements2.list;
  var getAt = Slides.getAt,
      styleSlides = Slides.style;
  var vertical;
  var rootRect;

  function mount() {
    init();
    bind(window, "resize load", Throttle(apply(emit, EVENT_RESIZE)));
    on([EVENT_UPDATED, EVENT_REFRESH], init);
    on(EVENT_RESIZE, resize);
  }

  function init() {
    rootRect = null;
    vertical = options.direction === TTB;
    style(root, "maxWidth", unit(options.width));
    style(track, resolve("paddingLeft"), cssPadding(false));
    style(track, resolve("paddingRight"), cssPadding(true));
    resize();
  }

  function resize() {
    var newRect = rect(root);

    if (!rootRect || rootRect.width !== newRect.width || rootRect.height !== newRect.height) {
      style(track, "height", cssTrackHeight());
      styleSlides(resolve("marginRight"), unit(options.gap));
      styleSlides("width", cssSlideWidth());
      styleSlides("height", cssSlideHeight(), true);
      rootRect = newRect;
      emit(EVENT_RESIZED);
    }
  }

  function cssPadding(right) {
    var padding = options.padding;
    var prop = resolve(right ? "right" : "left");
    return padding && unit(padding[prop] || (isObject(padding) ? 0 : padding)) || "0px";
  }

  function cssTrackHeight() {
    var height = "";

    if (vertical) {
      height = cssHeight();
      assert(height, "height or heightRatio is missing.");
      height = "calc(" + height + " - " + cssPadding(false) + " - " + cssPadding(true) + ")";
    }

    return height;
  }

  function cssHeight() {
    return unit(options.height || rect(list).width * options.heightRatio);
  }

  function cssSlideWidth() {
    return options.autoWidth ? null : unit(options.fixedWidth) || (vertical ? "" : cssSlideSize());
  }

  function cssSlideHeight() {
    return unit(options.fixedHeight) || (vertical ? options.autoHeight ? null : cssSlideSize() : cssHeight());
  }

  function cssSlideSize() {
    var gap = unit(options.gap);
    return "calc((100%" + (gap && " + " + gap) + ")/" + (options.perPage || 1) + (gap && " - " + gap) + ")";
  }

  function listSize() {
    return rect(list)[resolve("width")];
  }

  function slideSize(index, withoutGap) {
    var Slide = getAt(index || 0);
    return Slide ? rect(Slide.slide)[resolve("width")] + (withoutGap ? 0 : getGap()) : 0;
  }

  function totalSize(index, withoutGap) {
    var Slide = getAt(index);

    if (Slide) {
      var right = rect(Slide.slide)[resolve("right")];
      var left = rect(list)[resolve("left")];
      return abs(right - left) + (withoutGap ? 0 : getGap());
    }

    return 0;
  }

  function sliderSize() {
    return totalSize(Splide2.length - 1, true) - totalSize(-1, true);
  }

  function getGap() {
    var Slide = getAt(0);
    return Slide && parseFloat(style(Slide.slide, resolve("marginRight"))) || 0;
  }

  function getPadding(right) {
    return parseFloat(style(track, resolve("padding" + (right ? "Right" : "Left")))) || 0;
  }

  return {
    mount: mount,
    listSize: listSize,
    slideSize: slideSize,
    sliderSize: sliderSize,
    totalSize: totalSize,
    getPadding: getPadding
  };
}

var MULTIPLIER = 2;

function Clones(Splide2, Components2, options) {
  var _EventInterface4 = EventInterface(Splide2),
      on = _EventInterface4.on,
      emit = _EventInterface4.emit;

  var Elements = Components2.Elements,
      Slides = Components2.Slides;
  var resolve = Components2.Direction.resolve;
  var clones = [];
  var cloneCount;

  function mount() {
    init();
    on(EVENT_REFRESH, destroy);
    on(EVENT_REFRESH, init);
    on([EVENT_UPDATED, EVENT_RESIZE], observe);
  }

  function init() {
    if (cloneCount = computeCloneCount()) {
      generate(cloneCount);
      emit(EVENT_RESIZE);
    }
  }

  function destroy() {
    remove(clones);
    empty(clones);
  }

  function observe() {
    if (cloneCount < computeCloneCount()) {
      emit(EVENT_REFRESH);
    }
  }

  function generate(count) {
    var slides = Slides.get().slice();
    var length = slides.length;

    if (length) {
      while (slides.length < count) {
        push(slides, slides);
      }

      push(slides.slice(-count), slides.slice(0, count)).forEach(function (Slide, index) {
        var isHead = index < count;
        var clone = cloneDeep(Slide.slide, index);
        isHead ? before(clone, slides[0].slide) : append(Elements.list, clone);
        push(clones, clone);
        Slides.register(clone, index - count + (isHead ? 0 : length), Slide.index);
      });
    }
  }

  function cloneDeep(elm, index) {
    var clone = elm.cloneNode(true);
    addClass(clone, options.classes.clone);
    clone.id = Splide2.root.id + "-clone" + pad(index + 1);
    return clone;
  }

  function computeCloneCount() {
    var clones2 = options.clones;

    if (!Splide2.is(LOOP)) {
      clones2 = 0;
    } else if (!clones2) {
      var fixedSize = options[resolve("fixedWidth")] && Components2.Layout.slideSize(0);
      var fixedCount = fixedSize && ceil(rect(Elements.track)[resolve("width")] / fixedSize);
      clones2 = fixedCount || options[resolve("autoWidth")] && Splide2.length || options.perPage * MULTIPLIER;
    }

    return clones2;
  }

  return {
    mount: mount,
    destroy: destroy
  };
}

function Move(Splide2, Components2, options) {
  var _EventInterface5 = EventInterface(Splide2),
      on = _EventInterface5.on,
      emit = _EventInterface5.emit;

  var set = Splide2.state.set;
  var _Components2$Layout = Components2.Layout,
      slideSize = _Components2$Layout.slideSize,
      getPadding = _Components2$Layout.getPadding,
      totalSize = _Components2$Layout.totalSize,
      listSize = _Components2$Layout.listSize,
      sliderSize = _Components2$Layout.sliderSize;
  var _Components2$Directio = Components2.Direction,
      resolve = _Components2$Directio.resolve,
      orient = _Components2$Directio.orient;
  var _Components2$Elements3 = Components2.Elements,
      list = _Components2$Elements3.list,
      track = _Components2$Elements3.track;
  var Transition;

  function mount() {
    Transition = Components2.Transition;
    on([EVENT_MOUNTED, EVENT_RESIZED, EVENT_UPDATED, EVENT_REFRESH], reposition);
  }

  function reposition() {
    if (!Components2.Controller.isBusy()) {
      Components2.Scroll.cancel();
      jump(Splide2.index);
      Components2.Slides.update();
    }
  }

  function move(dest, index, prev, callback) {
    if (dest !== index && canShift(dest > prev)) {
      cancel();
      translate(shift(getPosition(), dest > prev), true);
    }

    set(MOVING);
    emit(EVENT_MOVE, index, prev, dest);
    Transition.start(index, function () {
      set(IDLE);
      emit(EVENT_MOVED, index, prev, dest);
      callback && callback();
    });
  }

  function jump(index) {
    translate(toPosition(index, true));
  }

  function translate(position, preventLoop) {
    if (!Splide2.is(FADE)) {
      var destination = preventLoop ? position : loop(position);
      style(list, "transform", "translate" + resolve("X") + "(" + destination + "px)");
      position !== destination && emit(EVENT_SHIFTED);
    }
  }

  function loop(position) {
    if (Splide2.is(LOOP)) {
      var index = toIndex(position);
      var exceededMax = index > Components2.Controller.getEnd();
      var exceededMin = index < 0;

      if (exceededMin || exceededMax) {
        position = shift(position, exceededMax);
      }
    }

    return position;
  }

  function shift(position, backwards) {
    var excess = position - getLimit(backwards);
    var size = sliderSize();
    position -= orient(size * (ceil(abs(excess) / size) || 1)) * (backwards ? 1 : -1);
    return position;
  }

  function cancel() {
    translate(getPosition());
    Transition.cancel();
  }

  function toIndex(position) {
    var Slides = Components2.Slides.get();
    var index = 0;
    var minDistance = Infinity;

    for (var i = 0; i < Slides.length; i++) {
      var slideIndex = Slides[i].index;
      var distance = abs(toPosition(slideIndex, true) - position);

      if (distance <= minDistance) {
        minDistance = distance;
        index = slideIndex;
      } else {
        break;
      }
    }

    return index;
  }

  function toPosition(index, trimming) {
    var position = orient(totalSize(index - 1) - offset(index));
    return trimming ? trim(position) : position;
  }

  function getPosition() {
    var left = resolve("left");
    return rect(list)[left] - rect(track)[left] + orient(getPadding(false));
  }

  function trim(position) {
    if (options.trimSpace && Splide2.is(SLIDE)) {
      position = clamp(position, 0, orient(sliderSize() - listSize()));
    }

    return position;
  }

  function offset(index) {
    var focus = options.focus;
    return focus === "center" ? (listSize() - slideSize(index, true)) / 2 : +focus * slideSize(index) || 0;
  }

  function getLimit(max) {
    return toPosition(max ? Components2.Controller.getEnd() : 0, !!options.trimSpace);
  }

  function canShift(backwards) {
    var shifted = orient(shift(getPosition(), backwards));
    return backwards ? shifted >= 0 : shifted <= list[resolve("scrollWidth")] - rect(track)[resolve("width")];
  }

  function exceededLimit(max, position) {
    position = isUndefined(position) ? getPosition() : position;
    var exceededMin = max !== true && orient(position) < orient(getLimit(false));
    var exceededMax = max !== false && orient(position) > orient(getLimit(true));
    return exceededMin || exceededMax;
  }

  return {
    mount: mount,
    move: move,
    jump: jump,
    translate: translate,
    shift: shift,
    cancel: cancel,
    toIndex: toIndex,
    toPosition: toPosition,
    getPosition: getPosition,
    getLimit: getLimit,
    exceededLimit: exceededLimit,
    reposition: reposition
  };
}

function Controller(Splide2, Components2, options) {
  var _EventInterface6 = EventInterface(Splide2),
      on = _EventInterface6.on;

  var Move = Components2.Move;
  var getPosition = Move.getPosition,
      getLimit = Move.getLimit,
      toPosition = Move.toPosition;
  var _Components2$Slides = Components2.Slides,
      isEnough = _Components2$Slides.isEnough,
      getLength = _Components2$Slides.getLength;
  var isLoop = Splide2.is(LOOP);
  var isSlide = Splide2.is(SLIDE);
  var getNext = apply(getAdjacent, false);
  var getPrev = apply(getAdjacent, true);
  var currIndex = options.start || 0;
  var prevIndex = currIndex;
  var slideCount;
  var perMove;
  var perPage;

  function mount() {
    init();
    on([EVENT_UPDATED, EVENT_REFRESH], init);
  }

  function init() {
    slideCount = getLength(true);
    perMove = options.perMove;
    perPage = options.perPage;
    var index = clamp(currIndex, 0, slideCount - 1);

    if (index !== currIndex) {
      currIndex = index;
      Move.reposition();
    }
  }

  function go(control, allowSameIndex, callback) {
    if (!isBusy()) {
      var dest = parse(control);
      var index = loop(dest);

      if (index > -1 && (allowSameIndex || index !== currIndex)) {
        setIndex(index);
        Move.move(dest, index, prevIndex, callback);
      }
    }
  }

  function scroll(destination, duration, snap, callback) {
    Components2.Scroll.scroll(destination, duration, snap, function () {
      setIndex(loop(Move.toIndex(getPosition())));
      callback && callback();
    });
  }

  function parse(control) {
    var index = currIndex;

    if (isString(control)) {
      var _ref = control.match(/([+\-<>])(\d+)?/) || [],
          indicator = _ref[1],
          number = _ref[2];

      if (indicator === "+" || indicator === "-") {
        index = computeDestIndex(currIndex + +("" + indicator + (+number || 1)), currIndex);
      } else if (indicator === ">") {
        index = number ? toIndex(+number) : getNext(true);
      } else if (indicator === "<") {
        index = getPrev(true);
      }
    } else {
      index = isLoop ? control : clamp(control, 0, getEnd());
    }

    return index;
  }

  function getAdjacent(prev, destination) {
    var number = perMove || (hasFocus() ? 1 : perPage);
    var dest = computeDestIndex(currIndex + number * (prev ? -1 : 1), currIndex, !(perMove || hasFocus()));

    if (dest === -1 && isSlide) {
      if (!approximatelyEqual(getPosition(), getLimit(!prev), 1)) {
        return prev ? 0 : getEnd();
      }
    }

    return destination ? dest : loop(dest);
  }

  function computeDestIndex(dest, from, snapPage) {
    if (isEnough()) {
      var end = getEnd();
      var index = computeMovableDestIndex(dest);

      if (index !== dest) {
        from = dest;
        dest = index;
        snapPage = false;
      }

      if (dest < 0 || dest > end) {
        if (!perMove && (between(0, dest, from, true) || between(end, from, dest, true))) {
          dest = toIndex(toPage(dest));
        } else {
          if (isLoop) {
            dest = snapPage ? dest < 0 ? -(slideCount % perPage || perPage) : slideCount : dest;
          } else if (options.rewind) {
            dest = dest < 0 ? end : 0;
          } else {
            dest = -1;
          }
        }
      } else {
        if (snapPage && dest !== from) {
          dest = toIndex(toPage(from) + (dest < from ? -1 : 1));
        }
      }
    } else {
      dest = -1;
    }

    return dest;
  }

  function computeMovableDestIndex(dest) {
    if (isSlide && options.trimSpace === "move" && dest !== currIndex) {
      var position = getPosition();

      while (position === toPosition(dest, true) && between(dest, 0, Splide2.length - 1, !options.rewind)) {
        dest < currIndex ? --dest : ++dest;
      }
    }

    return dest;
  }

  function loop(index) {
    return isLoop ? (index + slideCount) % slideCount || 0 : index;
  }

  function getEnd() {
    return max(slideCount - (hasFocus() || isLoop && perMove ? 1 : perPage), 0);
  }

  function toIndex(page) {
    return clamp(hasFocus() ? page : perPage * page, 0, getEnd());
  }

  function toPage(index) {
    return hasFocus() ? index : floor((index >= getEnd() ? slideCount - 1 : index) / perPage);
  }

  function toDest(destination) {
    var closest = Move.toIndex(destination);
    return isSlide ? clamp(closest, 0, getEnd()) : closest;
  }

  function setIndex(index) {
    if (index !== currIndex) {
      prevIndex = currIndex;
      currIndex = index;
    }
  }

  function getIndex(prev) {
    return prev ? prevIndex : currIndex;
  }

  function hasFocus() {
    return !isUndefined(options.focus) || options.isNavigation;
  }

  function isBusy() {
    return Splide2.state.is([MOVING, SCROLLING]) && !!options.waitForTransition;
  }

  return {
    mount: mount,
    go: go,
    scroll: scroll,
    getNext: getNext,
    getPrev: getPrev,
    getAdjacent: getAdjacent,
    getEnd: getEnd,
    setIndex: setIndex,
    getIndex: getIndex,
    toIndex: toIndex,
    toPage: toPage,
    toDest: toDest,
    hasFocus: hasFocus,
    isBusy: isBusy
  };
}

var XML_NAME_SPACE = "http://www.w3.org/2000/svg";
var PATH = "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z";
var SIZE = 40;

function Arrows(Splide2, Components2, options) {
  var event = EventInterface(Splide2);
  var on = event.on,
      bind = event.bind,
      emit = event.emit;
  var classes = options.classes,
      i18n = options.i18n;
  var Elements = Components2.Elements,
      Controller = Components2.Controller;
  var userArrows = Elements.arrows,
      track = Elements.track;
  var wrapper = userArrows;
  var prev = Elements.prev;
  var next = Elements.next;
  var created;
  var wrapperClasses;
  var arrows = {};

  function mount() {
    init();
    on(EVENT_UPDATED, remount);
  }

  function remount() {
    destroy();
    mount();
  }

  function init() {
    var enabled = options.arrows;

    if (enabled && !(prev && next)) {
      createArrows();
    }

    if (prev && next) {
      assign(arrows, {
        prev: prev,
        next: next
      });
      display(wrapper, enabled ? "" : "none");
      addClass(wrapper, wrapperClasses = CLASS_ARROWS + "--" + options.direction);

      if (enabled) {
        listen();
        update();
        setAttribute([prev, next], ARIA_CONTROLS, track.id);
        emit(EVENT_ARROWS_MOUNTED, prev, next);
      }
    }
  }

  function destroy() {
    event.destroy();
    removeClass(wrapper, wrapperClasses);

    if (created) {
      remove(userArrows ? [prev, next] : wrapper);
      prev = next = null;
    } else {
      removeAttribute([prev, next], ALL_ATTRIBUTES);
    }
  }

  function listen() {
    on([EVENT_MOVED, EVENT_REFRESH, EVENT_SCROLLED], update);
    bind(next, "click", apply(go, ">"));
    bind(prev, "click", apply(go, "<"));
  }

  function go(control) {
    Controller.go(control, true);
  }

  function createArrows() {
    wrapper = userArrows || create("div", classes.arrows);
    prev = createArrow(true);
    next = createArrow(false);
    created = true;
    append(wrapper, [prev, next]);
    !userArrows && before(wrapper, track);
  }

  function createArrow(prev2) {
    var arrow = "<button class=\"" + classes.arrow + " " + (prev2 ? classes.prev : classes.next) + "\" type=\"button\"><svg xmlns=\"" + XML_NAME_SPACE + "\" viewBox=\"0 0 " + SIZE + " " + SIZE + "\" width=\"" + SIZE + "\" height=\"" + SIZE + "\" focusable=\"false\"><path d=\"" + (options.arrowPath || PATH) + "\" />";
    return parseHtml(arrow);
  }

  function update() {
    var index = Splide2.index;
    var prevIndex = Controller.getPrev();
    var nextIndex = Controller.getNext();
    var prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
    var nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
    prev.disabled = prevIndex < 0;
    next.disabled = nextIndex < 0;
    setAttribute(prev, ARIA_LABEL, prevLabel);
    setAttribute(next, ARIA_LABEL, nextLabel);
    emit(EVENT_ARROWS_UPDATED, prev, next, prevIndex, nextIndex);
  }

  return {
    arrows: arrows,
    mount: mount,
    destroy: destroy
  };
}

var INTERVAL_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-interval";

function Autoplay(Splide2, Components2, options) {
  var _EventInterface7 = EventInterface(Splide2),
      on = _EventInterface7.on,
      bind = _EventInterface7.bind,
      emit = _EventInterface7.emit;

  var interval = RequestInterval(options.interval, Splide2.go.bind(Splide2, ">"), onAnimationFrame);
  var isPaused = interval.isPaused;
  var Elements = Components2.Elements,
      _Components2$Elements4 = Components2.Elements,
      root = _Components2$Elements4.root,
      toggle = _Components2$Elements4.toggle;
  var autoplay = options.autoplay;
  var hovered;
  var focused;
  var stopped = autoplay === "pause";

  function mount() {
    if (autoplay) {
      listen();
      toggle && setAttribute(toggle, ARIA_CONTROLS, Elements.track.id);
      stopped || play();
      update();
    }
  }

  function listen() {
    if (options.pauseOnHover) {
      bind(root, "mouseenter mouseleave", function (e) {
        hovered = e.type === "mouseenter";
        autoToggle();
      });
    }

    if (options.pauseOnFocus) {
      bind(root, "focusin focusout", function (e) {
        focused = e.type === "focusin";
        autoToggle();
      });
    }

    if (toggle) {
      bind(toggle, "click", function () {
        stopped ? play() : pause(true);
      });
    }

    on([EVENT_MOVE, EVENT_SCROLL, EVENT_REFRESH], interval.rewind);
    on(EVENT_MOVE, onMove);
  }

  function play() {
    if (isPaused() && Components2.Slides.isEnough()) {
      interval.start(!options.resetProgress);
      focused = hovered = stopped = false;
      update();
      emit(EVENT_AUTOPLAY_PLAY);
    }
  }

  function pause(stop) {
    if (stop === void 0) {
      stop = true;
    }

    stopped = !!stop;
    update();

    if (!isPaused()) {
      interval.pause();
      emit(EVENT_AUTOPLAY_PAUSE);
    }
  }

  function autoToggle() {
    if (!stopped) {
      hovered || focused ? pause(false) : play();
    }
  }

  function update() {
    if (toggle) {
      toggleClass(toggle, CLASS_ACTIVE, !stopped);
      setAttribute(toggle, ARIA_LABEL, options.i18n[stopped ? "play" : "pause"]);
    }
  }

  function onAnimationFrame(rate) {
    var bar = Elements.bar;
    bar && style(bar, "width", rate * 100 + "%");
    emit(EVENT_AUTOPLAY_PLAYING, rate);
  }

  function onMove(index) {
    var Slide = Components2.Slides.getAt(index);
    interval.set(Slide && +getAttribute(Slide.slide, INTERVAL_DATA_ATTRIBUTE) || options.interval);
  }

  return {
    mount: mount,
    destroy: interval.cancel,
    play: play,
    pause: pause,
    isPaused: isPaused
  };
}

function Cover(Splide2, Components2, options) {
  var _EventInterface8 = EventInterface(Splide2),
      on = _EventInterface8.on;

  function mount() {
    if (options.cover) {
      on(EVENT_LAZYLOAD_LOADED, apply(toggle, true));
      on([EVENT_MOUNTED, EVENT_UPDATED, EVENT_REFRESH], apply(cover, true));
    }
  }

  function cover(cover2) {
    Components2.Slides.forEach(function (Slide) {
      var img = child(Slide.container || Slide.slide, "img");

      if (img && img.src) {
        toggle(cover2, img, Slide);
      }
    });
  }

  function toggle(cover2, img, Slide) {
    Slide.style("background", cover2 ? "center/cover no-repeat url(\"" + img.src + "\")" : "", true);
    display(img, cover2 ? "none" : "");
  }

  return {
    mount: mount,
    destroy: apply(cover, false)
  };
}

var BOUNCE_DIFF_THRESHOLD = 10;
var BOUNCE_DURATION = 600;
var FRICTION_FACTOR = 0.6;
var BASE_VELOCITY = 1.5;
var MIN_DURATION = 800;

function Scroll(Splide2, Components2, options) {
  var _EventInterface9 = EventInterface(Splide2),
      on = _EventInterface9.on,
      emit = _EventInterface9.emit;

  var set = Splide2.state.set;
  var Move = Components2.Move;
  var getPosition = Move.getPosition,
      getLimit = Move.getLimit,
      exceededLimit = Move.exceededLimit,
      translate = Move.translate;
  var interval;
  var callback;
  var friction = 1;

  function mount() {
    on(EVENT_MOVE, clear);
    on([EVENT_UPDATED, EVENT_REFRESH], cancel);
  }

  function scroll(destination, duration, snap, onScrolled, noConstrain) {
    var from = getPosition();
    clear();

    if (snap) {
      var size = Components2.Layout.sliderSize();
      var offset = sign(destination) * size * floor(abs(destination) / size) || 0;
      destination = Move.toPosition(Components2.Controller.toDest(destination % size)) + offset;
    }

    var noDistance = approximatelyEqual(from, destination, 1);
    friction = 1;
    duration = noDistance ? 0 : duration || max(abs(destination - from) / BASE_VELOCITY, MIN_DURATION);
    callback = onScrolled;
    interval = RequestInterval(duration, onEnd, apply(update, from, destination, noConstrain), 1);
    set(SCROLLING);
    emit(EVENT_SCROLL);
    interval.start();
  }

  function onEnd() {
    set(IDLE);
    callback && callback();
    emit(EVENT_SCROLLED);
  }

  function update(from, to, noConstrain, rate) {
    var position = getPosition();
    var target = from + (to - from) * easing(rate);
    var diff = (target - position) * friction;
    translate(position + diff);

    if (Splide2.is(SLIDE) && !noConstrain && exceededLimit()) {
      friction *= FRICTION_FACTOR;

      if (abs(diff) < BOUNCE_DIFF_THRESHOLD) {
        scroll(getLimit(exceededLimit(true)), BOUNCE_DURATION, false, callback, true);
      }
    }
  }

  function clear() {
    if (interval) {
      interval.cancel();
    }
  }

  function cancel() {
    if (interval && !interval.isPaused()) {
      clear();
      onEnd();
    }
  }

  function easing(t) {
    var easingFunc = options.easingFunc;
    return easingFunc ? easingFunc(t) : 1 - Math.pow(1 - t, 4);
  }

  return {
    mount: mount,
    destroy: clear,
    scroll: scroll,
    cancel: cancel
  };
}

var SCROLL_LISTENER_OPTIONS = {
  passive: false,
  capture: true
};

function Drag(Splide2, Components2, options) {
  var _EventInterface10 = EventInterface(Splide2),
      on = _EventInterface10.on,
      emit = _EventInterface10.emit,
      bind = _EventInterface10.bind,
      unbind = _EventInterface10.unbind;

  var state = Splide2.state;
  var Move = Components2.Move,
      Scroll = Components2.Scroll,
      Controller = Components2.Controller,
      track = Components2.Elements.track,
      reduce = Components2.Media.reduce;
  var _Components2$Directio2 = Components2.Direction,
      resolve = _Components2$Directio2.resolve,
      orient = _Components2$Directio2.orient;
  var getPosition = Move.getPosition,
      exceededLimit = Move.exceededLimit;
  var basePosition;
  var baseEvent;
  var prevBaseEvent;
  var isFree;
  var dragging;
  var exceeded = false;
  var clickPrevented;
  var disabled;
  var target;

  function mount() {
    bind(track, POINTER_MOVE_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
    bind(track, POINTER_UP_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
    bind(track, POINTER_DOWN_EVENTS, onPointerDown, SCROLL_LISTENER_OPTIONS);
    bind(track, "click", onClick, {
      capture: true
    });
    bind(track, "dragstart", prevent);
    on([EVENT_MOUNTED, EVENT_UPDATED], init);
  }

  function init() {
    var drag = options.drag;
    disable(!drag);
    isFree = drag === "free";
  }

  function onPointerDown(e) {
    clickPrevented = false;

    if (!disabled) {
      var isTouch = isTouchEvent(e);

      if (isDraggable(e.target) && (isTouch || !e.button)) {
        if (!Controller.isBusy()) {
          target = isTouch ? track : window;
          dragging = state.is([MOVING, SCROLLING]);
          prevBaseEvent = null;
          bind(target, POINTER_MOVE_EVENTS, onPointerMove, SCROLL_LISTENER_OPTIONS);
          bind(target, POINTER_UP_EVENTS, onPointerUp, SCROLL_LISTENER_OPTIONS);
          Move.cancel();
          Scroll.cancel();
          save(e);
        } else {
          prevent(e, true);
        }
      }
    }
  }

  function onPointerMove(e) {
    if (!state.is(DRAGGING)) {
      state.set(DRAGGING);
      emit(EVENT_DRAG);
    }

    if (e.cancelable) {
      if (dragging) {
        Move.translate(basePosition + constrain(diffCoord(e)));
        var expired = diffTime(e) > LOG_INTERVAL;
        var hasExceeded = exceeded !== (exceeded = exceededLimit());

        if (expired || hasExceeded) {
          save(e);
        }

        clickPrevented = true;
        emit(EVENT_DRAGGING);
        prevent(e);
      } else if (isSliderDirection(e)) {
        dragging = shouldStart(e);
        prevent(e);
      }
    }
  }

  function onPointerUp(e) {
    if (state.is(DRAGGING)) {
      state.set(IDLE);
      emit(EVENT_DRAGGED);
    }

    if (dragging) {
      move(e);
      prevent(e);
    }

    unbind(target, POINTER_MOVE_EVENTS, onPointerMove);
    unbind(target, POINTER_UP_EVENTS, onPointerUp);
    dragging = false;
  }

  function onClick(e) {
    if (!disabled && clickPrevented) {
      prevent(e, true);
    }
  }

  function save(e) {
    prevBaseEvent = baseEvent;
    baseEvent = e;
    basePosition = getPosition();
  }

  function move(e) {
    var velocity = computeVelocity(e);
    var destination = computeDestination(velocity);
    var rewind = options.rewind && options.rewindByDrag;
    reduce(false);

    if (isFree) {
      Controller.scroll(destination, 0, options.snap);
    } else if (Splide2.is(FADE)) {
      Controller.go(orient(sign(velocity)) < 0 ? rewind ? "<" : "-" : rewind ? ">" : "+");
    } else if (Splide2.is(SLIDE) && exceeded && rewind) {
      Controller.go(exceededLimit(true) ? ">" : "<");
    } else {
      Controller.go(Controller.toDest(destination), true);
    }

    reduce(true);
  }

  function shouldStart(e) {
    var thresholds = options.dragMinThreshold;
    var isObj = isObject(thresholds);
    var mouse = isObj && thresholds.mouse || 0;
    var touch = (isObj ? thresholds.touch : +thresholds) || 10;
    return abs(diffCoord(e)) > (isTouchEvent(e) ? touch : mouse);
  }

  function isSliderDirection(e) {
    return abs(diffCoord(e)) > abs(diffCoord(e, true));
  }

  function computeVelocity(e) {
    if (Splide2.is(LOOP) || !exceeded) {
      var time = diffTime(e);

      if (time && time < LOG_INTERVAL) {
        return diffCoord(e) / time;
      }
    }

    return 0;
  }

  function computeDestination(velocity) {
    return getPosition() + sign(velocity) * min(abs(velocity) * (options.flickPower || 600), isFree ? Infinity : Components2.Layout.listSize() * (options.flickMaxPages || 1));
  }

  function diffCoord(e, orthogonal) {
    return coordOf(e, orthogonal) - coordOf(getBaseEvent(e), orthogonal);
  }

  function diffTime(e) {
    return timeOf(e) - timeOf(getBaseEvent(e));
  }

  function getBaseEvent(e) {
    return baseEvent === e && prevBaseEvent || baseEvent;
  }

  function coordOf(e, orthogonal) {
    return (isTouchEvent(e) ? e.changedTouches[0] : e)["page" + resolve(orthogonal ? "Y" : "X")];
  }

  function constrain(diff) {
    return diff / (exceeded && Splide2.is(SLIDE) ? FRICTION : 1);
  }

  function isDraggable(target2) {
    var noDrag = options.noDrag;
    return !matches(target2, "." + CLASS_PAGINATION_PAGE + ", ." + CLASS_ARROW) && (!noDrag || !matches(target2, noDrag));
  }

  function isTouchEvent(e) {
    return typeof TouchEvent !== "undefined" && e instanceof TouchEvent;
  }

  function isDragging() {
    return dragging;
  }

  function disable(value) {
    disabled = value;
  }

  return {
    mount: mount,
    disable: disable,
    isDragging: isDragging
  };
}

var NORMALIZATION_MAP = {
  Spacebar: " ",
  Right: ARROW_RIGHT,
  Left: ARROW_LEFT,
  Up: ARROW_UP,
  Down: ARROW_DOWN
};

function normalizeKey(key) {
  key = isString(key) ? key : key.key;
  return NORMALIZATION_MAP[key] || key;
}

var KEYBOARD_EVENT = "keydown";

function Keyboard(Splide2, Components2, options) {
  var _EventInterface11 = EventInterface(Splide2),
      on = _EventInterface11.on,
      bind = _EventInterface11.bind,
      unbind = _EventInterface11.unbind;

  var root = Splide2.root;
  var resolve = Components2.Direction.resolve;
  var target;
  var disabled;

  function mount() {
    init();
    on(EVENT_UPDATED, destroy);
    on(EVENT_UPDATED, init);
    on(EVENT_MOVE, onMove);
  }

  function init() {
    var keyboard = options.keyboard;

    if (keyboard) {
      target = keyboard === "global" ? window : root;
      bind(target, KEYBOARD_EVENT, onKeydown);
    }
  }

  function destroy() {
    unbind(target, KEYBOARD_EVENT);
  }

  function disable(value) {
    disabled = value;
  }

  function onMove() {
    var _disabled = disabled;
    disabled = true;
    nextTick(function () {
      disabled = _disabled;
    });
  }

  function onKeydown(e) {
    if (!disabled) {
      var key = normalizeKey(e);

      if (key === resolve(ARROW_LEFT)) {
        Splide2.go("<");
      } else if (key === resolve(ARROW_RIGHT)) {
        Splide2.go(">");
      }
    }
  }

  return {
    mount: mount,
    destroy: destroy,
    disable: disable
  };
}

var SRC_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-lazy";
var SRCSET_DATA_ATTRIBUTE = SRC_DATA_ATTRIBUTE + "-srcset";
var IMAGE_SELECTOR = "[" + SRC_DATA_ATTRIBUTE + "], [" + SRCSET_DATA_ATTRIBUTE + "]";

function LazyLoad(Splide2, Components2, options) {
  var _EventInterface12 = EventInterface(Splide2),
      on = _EventInterface12.on,
      off = _EventInterface12.off,
      bind = _EventInterface12.bind,
      emit = _EventInterface12.emit;

  var isSequential = options.lazyLoad === "sequential";
  var events = [EVENT_MOUNTED, EVENT_REFRESH, EVENT_MOVED, EVENT_SCROLLED];
  var entries = [];

  function mount() {
    if (options.lazyLoad) {
      init();
      on(EVENT_REFRESH, init);
      isSequential || on(events, observe);
    }
  }

  function init() {
    empty(entries);
    Components2.Slides.forEach(function (Slide) {
      queryAll(Slide.slide, IMAGE_SELECTOR).forEach(function (img) {
        var src = getAttribute(img, SRC_DATA_ATTRIBUTE);
        var srcset = getAttribute(img, SRCSET_DATA_ATTRIBUTE);

        if (src !== img.src || srcset !== img.srcset) {
          var className = options.classes.spinner;
          var parent = img.parentElement;
          var spinner = child(parent, "." + className) || create("span", className, parent);
          entries.push([img, Slide, spinner]);
          img.src || display(img, "none");
        }
      });
    });
    isSequential && loadNext();
  }

  function observe() {
    entries = entries.filter(function (data) {
      var distance = options.perPage * ((options.preloadPages || 1) + 1) - 1;
      return data[1].isWithin(Splide2.index, distance) ? load(data) : true;
    });
    entries.length || off(events);
  }

  function load(data) {
    var img = data[0];
    addClass(data[1].slide, CLASS_LOADING);
    bind(img, "load error", apply(onLoad, data));
    setAttribute(img, "src", getAttribute(img, SRC_DATA_ATTRIBUTE));
    setAttribute(img, "srcset", getAttribute(img, SRCSET_DATA_ATTRIBUTE));
    removeAttribute(img, SRC_DATA_ATTRIBUTE);
    removeAttribute(img, SRCSET_DATA_ATTRIBUTE);
  }

  function onLoad(data, e) {
    var img = data[0],
        Slide = data[1];
    removeClass(Slide.slide, CLASS_LOADING);

    if (e.type !== "error") {
      remove(data[2]);
      display(img, "");
      emit(EVENT_LAZYLOAD_LOADED, img, Slide);
      emit(EVENT_RESIZE);
    }

    isSequential && loadNext();
  }

  function loadNext() {
    entries.length && load(entries.shift());
  }

  return {
    mount: mount,
    destroy: apply(empty, entries)
  };
}

function Pagination(Splide2, Components2, options) {
  var event = EventInterface(Splide2);
  var on = event.on,
      emit = event.emit,
      bind = event.bind;
  var Slides = Components2.Slides,
      Elements = Components2.Elements,
      Controller = Components2.Controller;
  var hasFocus = Controller.hasFocus,
      getIndex = Controller.getIndex,
      go = Controller.go;
  var resolve = Components2.Direction.resolve;
  var items = [];
  var list;
  var paginationClasses;

  function mount() {
    destroy();
    on([EVENT_UPDATED, EVENT_REFRESH], mount);

    if (options.pagination && Slides.isEnough()) {
      on([EVENT_MOVE, EVENT_SCROLL, EVENT_SCROLLED], update);
      createPagination();
      update();
      emit(EVENT_PAGINATION_MOUNTED, {
        list: list,
        items: items
      }, getAt(Splide2.index));
    }
  }

  function destroy() {
    if (list) {
      remove(Elements.pagination ? slice(list.children) : list);
      removeClass(list, paginationClasses);
      empty(items);
      list = null;
    }

    event.destroy();
  }

  function createPagination() {
    var length = Splide2.length;
    var classes = options.classes,
        i18n = options.i18n,
        perPage = options.perPage;
    var max = hasFocus() ? length : ceil(length / perPage);
    list = Elements.pagination || create("ul", classes.pagination, Elements.track.parentElement);
    addClass(list, paginationClasses = CLASS_PAGINATION + "--" + getDirection());
    setAttribute(list, ROLE, "tablist");
    setAttribute(list, ARIA_LABEL, i18n.select);
    setAttribute(list, ARIA_ORIENTATION, getDirection() === TTB ? "vertical" : "");

    for (var i = 0; i < max; i++) {
      var li = create("li", null, list);
      var button = create("button", {
        class: classes.page,
        type: "button"
      }, li);
      var controls = Slides.getIn(i).map(function (Slide) {
        return Slide.slide.id;
      });
      var text = !hasFocus() && perPage > 1 ? i18n.pageX : i18n.slideX;
      bind(button, "click", apply(onClick, i));

      if (options.paginationKeyboard) {
        bind(button, "keydown", apply(onKeydown, i));
      }

      setAttribute(li, ROLE, "presentation");
      setAttribute(button, ROLE, "tab");
      setAttribute(button, ARIA_CONTROLS, controls.join(" "));
      setAttribute(button, ARIA_LABEL, format(text, i + 1));
      setAttribute(button, TAB_INDEX, -1);
      items.push({
        li: li,
        button: button,
        page: i
      });
    }
  }

  function onClick(page) {
    go(">" + page, true);
  }

  function onKeydown(page, e) {
    var length = items.length;
    var key = normalizeKey(e);
    var dir = getDirection();
    var nextPage = -1;

    if (key === resolve(ARROW_RIGHT, false, dir)) {
      nextPage = ++page % length;
    } else if (key === resolve(ARROW_LEFT, false, dir)) {
      nextPage = (--page + length) % length;
    } else if (key === "Home") {
      nextPage = 0;
    } else if (key === "End") {
      nextPage = length - 1;
    }

    var item = items[nextPage];

    if (item) {
      focus(item.button);
      go(">" + nextPage);
      prevent(e, true);
    }
  }

  function getDirection() {
    return options.paginationDirection || options.direction;
  }

  function getAt(index) {
    return items[Controller.toPage(index)];
  }

  function update() {
    var prev = getAt(getIndex(true));
    var curr = getAt(getIndex());

    if (prev) {
      var button = prev.button;
      removeClass(button, CLASS_ACTIVE);
      removeAttribute(button, ARIA_SELECTED);
      setAttribute(button, TAB_INDEX, -1);
    }

    if (curr) {
      var _button = curr.button;
      addClass(_button, CLASS_ACTIVE);
      setAttribute(_button, ARIA_SELECTED, true);
      setAttribute(_button, TAB_INDEX, "");
    }

    emit(EVENT_PAGINATION_UPDATED, {
      list: list,
      items: items
    }, prev, curr);
  }

  return {
    items: items,
    mount: mount,
    destroy: destroy,
    getAt: getAt,
    update: update
  };
}

var TRIGGER_KEYS = [" ", "Enter"];

function Sync(Splide2, Components2, options) {
  var isNavigation = options.isNavigation,
      slideFocus = options.slideFocus;
  var events = [];

  function setup() {
    Splide2.options = {
      slideFocus: isUndefined(slideFocus) ? isNavigation : slideFocus
    };
  }

  function mount() {
    Splide2.splides.forEach(function (target) {
      if (!target.isParent) {
        sync(Splide2, target.splide);
        sync(target.splide, Splide2);
      }
    });

    if (isNavigation) {
      navigate();
    }
  }

  function destroy() {
    events.forEach(function (event) {
      event.destroy();
    });
    empty(events);
  }

  function remount() {
    destroy();
    mount();
  }

  function sync(splide, target) {
    var event = EventInterface(splide);
    event.on(EVENT_MOVE, function (index, prev, dest) {
      target.go(target.is(LOOP) ? dest : index);
    });
    events.push(event);
  }

  function navigate() {
    var event = EventInterface(Splide2);
    var on = event.on;
    on(EVENT_CLICK, onClick);
    on(EVENT_SLIDE_KEYDOWN, onKeydown);
    on([EVENT_MOUNTED, EVENT_UPDATED], update);
    events.push(event);
    event.emit(EVENT_NAVIGATION_MOUNTED, Splide2.splides);
  }

  function update() {
    setAttribute(Components2.Elements.list, ARIA_ORIENTATION, options.direction === TTB ? "vertical" : "");
  }

  function onClick(Slide) {
    Splide2.go(Slide.index);
  }

  function onKeydown(Slide, e) {
    if (includes(TRIGGER_KEYS, normalizeKey(e))) {
      onClick(Slide);
      prevent(e);
    }
  }

  return {
    setup: setup,
    mount: mount,
    destroy: destroy,
    remount: remount
  };
}

function Wheel(Splide2, Components2, options) {
  var _EventInterface13 = EventInterface(Splide2),
      bind = _EventInterface13.bind;

  var lastTime = 0;

  function mount() {
    if (options.wheel) {
      bind(Components2.Elements.track, "wheel", onWheel, SCROLL_LISTENER_OPTIONS);
    }
  }

  function onWheel(e) {
    if (e.cancelable) {
      var deltaY = e.deltaY;
      var backwards = deltaY < 0;
      var timeStamp = timeOf(e);

      var _min = options.wheelMinThreshold || 0;

      var sleep = options.wheelSleep || 0;

      if (abs(deltaY) > _min && timeStamp - lastTime > sleep) {
        Splide2.go(backwards ? "<" : ">");
        lastTime = timeStamp;
      }

      shouldPrevent(backwards) && prevent(e);
    }
  }

  function shouldPrevent(backwards) {
    return !options.releaseWheel || Splide2.state.is(MOVING) || Components2.Controller.getAdjacent(backwards) !== -1;
  }

  return {
    mount: mount
  };
}

var SR_REMOVAL_DELAY = 90;

function Live(Splide2, Components2, options) {
  var _EventInterface14 = EventInterface(Splide2),
      on = _EventInterface14.on;

  var track = Components2.Elements.track;
  var enabled = options.live && !options.isNavigation;
  var sr = create("span", CLASS_SR);
  var interval = RequestInterval(SR_REMOVAL_DELAY, apply(toggle, false));

  function mount() {
    if (enabled) {
      disable(!Components2.Autoplay.isPaused());
      setAttribute(track, ARIA_ATOMIC, true);
      sr.textContent = "\u2026";
      on(EVENT_AUTOPLAY_PLAY, apply(disable, true));
      on(EVENT_AUTOPLAY_PAUSE, apply(disable, false));
      on([EVENT_MOVED, EVENT_SCROLLED], apply(toggle, true));
    }
  }

  function toggle(active) {
    setAttribute(track, ARIA_BUSY, active);

    if (active) {
      append(track, sr);
      interval.start();
    } else {
      remove(sr);
    }
  }

  function destroy() {
    removeAttribute(track, [ARIA_LIVE, ARIA_ATOMIC, ARIA_BUSY]);
    remove(sr);
  }

  function disable(disabled) {
    if (enabled) {
      setAttribute(track, ARIA_LIVE, disabled ? "off" : "polite");
    }
  }

  return {
    mount: mount,
    disable: disable,
    destroy: destroy
  };
}

var ComponentConstructors = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Media: Media,
  Direction: Direction,
  Elements: Elements,
  Slides: Slides,
  Layout: Layout,
  Clones: Clones,
  Move: Move,
  Controller: Controller,
  Arrows: Arrows,
  Autoplay: Autoplay,
  Cover: Cover,
  Scroll: Scroll,
  Drag: Drag,
  Keyboard: Keyboard,
  LazyLoad: LazyLoad,
  Pagination: Pagination,
  Sync: Sync,
  Wheel: Wheel,
  Live: Live
});
var I18N = {
  prev: "Previous slide",
  next: "Next slide",
  first: "Go to first slide",
  last: "Go to last slide",
  slideX: "Go to slide %s",
  pageX: "Go to page %s",
  play: "Start autoplay",
  pause: "Pause autoplay",
  carousel: "carousel",
  slide: "slide",
  select: "Select a slide to show",
  slideLabel: "%s of %s"
};
var DEFAULTS = {
  type: "slide",
  role: "region",
  speed: 400,
  perPage: 1,
  cloneStatus: true,
  arrows: true,
  pagination: true,
  paginationKeyboard: true,
  interval: 5e3,
  pauseOnHover: true,
  pauseOnFocus: true,
  resetProgress: true,
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
  drag: true,
  direction: "ltr",
  trimSpace: true,
  focusableNodes: "a, button, textarea, input, select, iframe",
  live: true,
  classes: CLASSES,
  i18n: I18N,
  reducedMotion: {
    speed: 0,
    rewindSpeed: 0,
    autoplay: "pause"
  }
};

function Fade(Splide2, Components2, options) {
  var _EventInterface15 = EventInterface(Splide2),
      on = _EventInterface15.on;

  function mount() {
    on([EVENT_MOUNTED, EVENT_REFRESH], function () {
      nextTick(function () {
        Components2.Slides.style("transition", "opacity " + options.speed + "ms " + options.easing);
      });
    });
  }

  function start(index, done) {
    var track = Components2.Elements.track;
    style(track, "height", unit(rect(track).height));
    nextTick(function () {
      done();
      style(track, "height", "");
    });
  }

  return {
    mount: mount,
    start: start,
    cancel: noop
  };
}

function Slide(Splide2, Components2, options) {
  var _EventInterface16 = EventInterface(Splide2),
      bind = _EventInterface16.bind;

  var Move = Components2.Move,
      Controller = Components2.Controller,
      Scroll = Components2.Scroll;
  var list = Components2.Elements.list;
  var transition = apply(style, list, "transition");
  var endCallback;

  function mount() {
    bind(list, "transitionend", function (e) {
      if (e.target === list && endCallback) {
        cancel();
        endCallback();
      }
    });
  }

  function start(index, done) {
    var destination = Move.toPosition(index, true);
    var position = Move.getPosition();
    var speed = getSpeed(index);

    if (abs(destination - position) >= 1 && speed >= 1) {
      if (options.useScroll) {
        Scroll.scroll(destination, speed, false, done);
      } else {
        transition("transform " + speed + "ms " + options.easing);
        Move.translate(destination, true);
        endCallback = done;
      }
    } else {
      Move.jump(index);
      done();
    }
  }

  function cancel() {
    transition("");
    Scroll.cancel();
  }

  function getSpeed(index) {
    var rewindSpeed = options.rewindSpeed;

    if (Splide2.is(SLIDE) && rewindSpeed) {
      var prev = Controller.getIndex(true);
      var end = Controller.getEnd();

      if (prev === 0 && index >= end || prev >= end && index === 0) {
        return rewindSpeed;
      }
    }

    return options.speed;
  }

  return {
    mount: mount,
    start: start,
    cancel: cancel
  };
}

var _Splide = /*#__PURE__*/function () {
  function _Splide(target, options) {
    this.event = EventInterface();
    this.Components = {};
    this.state = State(CREATED);
    this.splides = [];
    this._o = {};
    this._E = {};
    var root = isString(target) ? query(document, target) : target;
    assert(root, root + " is invalid.");
    this.root = root;
    options = merge({
      label: getAttribute(root, ARIA_LABEL) || "",
      labelledby: getAttribute(root, ARIA_LABELLEDBY) || ""
    }, DEFAULTS, _Splide.defaults, options || {});

    try {
      merge(options, JSON.parse(getAttribute(root, DATA_ATTRIBUTE)));
    } catch (e) {
      assert(false, "Invalid JSON");
    }

    this._o = Object.create(merge({}, options));
  }

  var _proto = _Splide.prototype;

  _proto.mount = function mount(Extensions, Transition) {
    var _this = this;

    var state = this.state,
        Components2 = this.Components;
    assert(state.is([CREATED, DESTROYED]), "Already mounted!");
    state.set(CREATED);
    this._C = Components2;
    this._T = Transition || this._T || (this.is(FADE) ? Fade : Slide);
    this._E = Extensions || this._E;
    var Constructors = assign({}, ComponentConstructors, this._E, {
      Transition: this._T
    });
    forOwn(Constructors, function (Component, key) {
      var component = Component(_this, Components2, _this._o);
      Components2[key] = component;
      component.setup && component.setup();
    });
    forOwn(Components2, function (component) {
      component.mount && component.mount();
    });
    this.emit(EVENT_MOUNTED);
    addClass(this.root, CLASS_INITIALIZED);
    state.set(IDLE);
    this.emit(EVENT_READY);
    return this;
  };

  _proto.sync = function sync(splide) {
    this.splides.push({
      splide: splide
    });
    splide.splides.push({
      splide: this,
      isParent: true
    });

    if (this.state.is(IDLE)) {
      this._C.Sync.remount();

      splide.Components.Sync.remount();
    }

    return this;
  };

  _proto.go = function go(control) {
    this._C.Controller.go(control);

    return this;
  };

  _proto.on = function on(events, callback) {
    this.event.on(events, callback);
    return this;
  };

  _proto.off = function off(events) {
    this.event.off(events);
    return this;
  };

  _proto.emit = function emit(event) {
    var _this$event;

    (_this$event = this.event).emit.apply(_this$event, [event].concat(slice(arguments, 1)));

    return this;
  };

  _proto.add = function add(slides, index) {
    this._C.Slides.add(slides, index);

    return this;
  };

  _proto.remove = function remove(matcher) {
    this._C.Slides.remove(matcher);

    return this;
  };

  _proto.is = function is(type) {
    return this._o.type === type;
  };

  _proto.refresh = function refresh() {
    this.emit(EVENT_REFRESH);
    return this;
  };

  _proto.destroy = function destroy(completely) {
    if (completely === void 0) {
      completely = true;
    }

    var event = this.event,
        state = this.state;

    if (state.is(CREATED)) {
      EventInterface(this).on(EVENT_READY, this.destroy.bind(this, completely));
    } else {
      forOwn(this._C, function (component) {
        component.destroy && component.destroy(completely);
      }, true);
      event.emit(EVENT_DESTROY);
      event.destroy();
      completely && empty(this.splides);
      state.set(DESTROYED);
    }

    return this;
  };

  _createClass(_Splide, [{
    key: "options",
    get: function get() {
      return this._o;
    },
    set: function set(options) {
      this._C.Media.set(options, true);
    }
  }, {
    key: "length",
    get: function get() {
      return this._C.Slides.getLength(true);
    }
  }, {
    key: "index",
    get: function get() {
      return this._C.Controller.getIndex();
    }
  }]);

  return _Splide;
}();

var Splide = _Splide;
Splide.defaults = {};
Splide.STATES = STATES;

var splideStyles = /* #__PURE__ */ (() => ".splide__container{box-sizing:border-box;position:relative}.splide__list{-webkit-backface-visibility:hidden;backface-visibility:hidden;display:-ms-flexbox;display:flex;height:100%;margin:0!important;padding:0!important}.splide.is-initialized:not(.is-active) .splide__list{display:block}.splide__pagination{-ms-flex-align:center;align-items:center;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-pack:center;justify-content:center;margin:0;pointer-events:none}.splide__pagination li{display:inline-block;line-height:1;list-style-type:none;margin:0;pointer-events:auto}.splide__progress__bar{width:0}.splide{position:relative;visibility:hidden}.splide.is-initialized,.splide.is-rendered{visibility:visible}.splide__slide{-webkit-backface-visibility:hidden;backface-visibility:hidden;box-sizing:border-box;-ms-flex-negative:0;flex-shrink:0;list-style-type:none!important;margin:0;position:relative}.splide__slide img{vertical-align:bottom}.splide__spinner{animation:splide-loading 1s linear infinite;border:2px solid #999;border-left-color:transparent;border-radius:50%;contain:strict;display:inline-block;height:20px;inset:0;margin:auto;position:absolute;width:20px}.splide__sr{clip:rect(0 0 0 0);border:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.splide__toggle.is-active .splide__toggle__play,.splide__toggle__pause{display:none}.splide__toggle.is-active .splide__toggle__pause{display:inline}.splide__track{overflow:hidden;position:relative;z-index:0}@keyframes splide-loading{0%{transform:rotate(0)}to{transform:rotate(1turn)}}.splide__track--draggable{-webkit-touch-callout:none;-webkit-user-select:none;-ms-user-select:none;user-select:none}.splide__track--fade>.splide__list{display:block}.splide__track--fade>.splide__list>.splide__slide{left:0;opacity:0;position:absolute;top:0;z-index:0}.splide__track--fade>.splide__list>.splide__slide.is-active{opacity:1;position:relative;z-index:1}.splide--rtl{direction:rtl}.splide__track--ttb>.splide__list{display:block}.splide__arrow{-ms-flex-align:center;align-items:center;background:#ccc;border:0;border-radius:50%;cursor:pointer;display:-ms-flexbox;display:flex;height:2em;-ms-flex-pack:center;justify-content:center;opacity:.7;padding:0;position:absolute;top:50%;transform:translateY(-50%);width:2em;z-index:1}.splide__arrow svg{fill:#000;height:1.2em;width:1.2em}.splide__arrow:hover:not(:disabled){opacity:.9}.splide__arrow:disabled{opacity:.3}.splide__arrow:focus-visible{outline:3px solid #0bf;outline-offset:3px}.splide__arrow--prev{left:1em}.splide__arrow--prev svg{transform:scaleX(-1)}.splide__arrow--next{right:1em}.splide.is-focus-in .splide__arrow:focus{outline:3px solid #0bf;outline-offset:3px}.splide__pagination{bottom:.5em;left:0;padding:0 1em;position:absolute;right:0;z-index:1}.splide__pagination__page{background:#ccc;border:0;border-radius:50%;display:inline-block;height:8px;margin:3px;opacity:.7;padding:0;position:relative;transition:transform .2s linear;width:8px}.splide__pagination__page.is-active{background:#fff;transform:scale(1.4);z-index:1}.splide__pagination__page:hover{cursor:pointer;opacity:.9}.splide__pagination__page:focus-visible{outline:3px solid #0bf;outline-offset:3px}.splide.is-focus-in .splide__pagination__page:focus{outline:3px solid #0bf;outline-offset:3px}.splide__progress__bar{background:#ccc;height:3px}.splide__slide{-webkit-tap-highlight-color:transparent}.splide__slide:focus{outline:0}@supports (outline-offset:-3px){.splide__slide:focus-visible{outline:3px solid #0bf;outline-offset:-3px}}@media screen and (-ms-high-contrast:none){.splide__slide:focus-visible{border:3px solid #0bf}}@supports (outline-offset:-3px){.splide.is-focus-in .splide__slide:focus{outline:3px solid #0bf;outline-offset:-3px}}@media screen and (-ms-high-contrast:none){.splide.is-focus-in .splide__slide:focus{border:3px solid #0bf}.splide.is-focus-in .splide__track>.splide__list>.splide__slide:focus{border-color:#0bf}}.splide__toggle{cursor:pointer}.splide__toggle:focus-visible{outline:3px solid #0bf;outline-offset:3px}.splide.is-focus-in .splide__toggle:focus{outline:3px solid #0bf;outline-offset:3px}.splide__track--nav>.splide__list>.splide__slide{border:3px solid transparent;cursor:pointer}.splide__track--nav>.splide__list>.splide__slide.is-active{border:3px solid #000}.splide__arrows--rtl .splide__arrow--prev{left:auto;right:1em}.splide__arrows--rtl .splide__arrow--prev svg{transform:scaleX(1)}.splide__arrows--rtl .splide__arrow--next{left:1em;right:auto}.splide__arrows--rtl .splide__arrow--next svg{transform:scaleX(-1)}.splide__arrows--ttb .splide__arrow{left:50%;transform:translate(-50%)}.splide__arrows--ttb .splide__arrow--prev{top:1em}.splide__arrows--ttb .splide__arrow--prev svg{transform:rotate(-90deg)}.splide__arrows--ttb .splide__arrow--next{bottom:1em;top:auto}.splide__arrows--ttb .splide__arrow--next svg{transform:rotate(90deg)}.splide__pagination--ttb{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;inset:0 .5em 0 auto;padding:1em 0}\n")();

const campaignProductRecommendation$1 = {
	impr: {
		required: {
			page: null,
			params: {
				campaign_id: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: "",
				page_el_sn: ""
			},
			params: null,
			promotion: null
		},
		data: {
			page_st_sn: "S99980",
			page_st_desc: "campaign-product_recommendation",
			event_name: "impr",
			platform: "WEB",
			promotion_type: "campaign:product_recommendation"
		}
	},
	viewItemProductItemE99956: {
		required: {
			page: null,
			params: {
				campaign_id: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: ""
			},
			params: null,
			promotion: null
		},
		data: {
			page_st_sn: "S99980",
			page_st_desc: "campaign-product_recommendation",
			page_el_sn: "E99956",
			page_el_sn_desc: "product item",
			event_name: "view_item",
			platform: "WEB",
			note: "item_url: 包含 algo_id + campaign_id\nindex (1,2,3 ...)",
			promotion_type: "campaign:product_recommendation"
		}
	},
	clickItemProductItemE99956: {
		required: {
			page: null,
			params: {
				campaign_id: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: ""
			},
			params: null,
			promotion: null
		},
		data: {
			page_st_sn: "S99980",
			page_st_desc: "campaign-product_recommendation",
			page_el_sn: "E99956",
			page_el_sn_desc: "product item",
			event_name: "click_item",
			platform: "WEB",
			note: "item_url: 包含 algo_id + campaign_id\nindex (1,2,3 ...)",
			promotion_type: "campaign:product_recommendation"
		}
	},
	clickItemProductItemTitleE99955: {
		required: {
			page: null,
			params: {
				campaign_id: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: ""
			},
			params: null,
			promotion: null
		},
		data: {
			page_st_sn: "S99980",
			page_st_desc: "campaign-product_recommendation",
			page_el_sn: "E99955",
			page_el_sn_desc: "product item title",
			event_name: "click_item",
			platform: "WEB",
			note: "item_url: 包含 algo_id + campaign_id\nindex (1,2,3 ...)",
			promotion_type: "campaign:product_recommendation"
		}
	},
	clickBuyNowButtonE99954: {
		required: {
			page: null,
			params: {
				campaign_id: "",
				label: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: ""
			},
			params: {
				link_url: ""
			},
			promotion: null
		},
		data: {
			page_st_sn: "S99980",
			page_st_desc: "campaign-product_recommendation",
			page_el_sn: "E99954",
			page_el_sn_desc: "buy now button",
			event_name: "click",
			platform: "WEB",
			note: "item_url: 包含 algo_id + campaign_id\n",
			promotion_type: "campaign:product_recommendation"
		}
	},
	clickCheckoutButtonE99946: {
		required: {
			page: null,
			params: {
				campaign_id: "",
				label: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: ""
			},
			params: {
				link_url: ""
			},
			promotion: null
		},
		data: {
			page_st_sn: "S99980",
			page_st_desc: "campaign-product_recommendation",
			page_el_sn: "E99946",
			page_el_sn_desc: "checkout button",
			event_name: "click",
			platform: "WEB",
			note: "item_url: 包含 algo_id + campaign_id\n",
			promotion_type: "campaign:product_recommendation"
		}
	},
	clickRedirectButtonE99945: {
		required: {
			page: null,
			params: {
				campaign_id: "",
				label: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: ""
			},
			params: {
				link_url: ""
			},
			promotion: null
		},
		data: {
			page_st_sn: "S99980",
			page_st_desc: "campaign-product_recommendation",
			page_el_sn: "E99945",
			page_el_sn_desc: "redirect button",
			event_name: "click",
			platform: "WEB",
			note: "item_url: 包含 algo_id + campaign_id\n",
			promotion_type: "campaign:product_recommendation"
		}
	},
	checkout: {
		required: {
			page: null,
			params: {
				campaign_id: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: ""
			},
			params: null,
			promotion: null
		},
		data: {
			page_st_sn: "S99980",
			page_st_desc: "campaign-product_recommendation",
			event_name: "checkout",
			platform: "WEB",
			note: "item_url: 包含 algo_id + campaign_id\n",
			promotion_type: "campaign:product_recommendation"
		}
	},
	addToCart: {
		required: {
			page: null,
			params: {
				campaign_id: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: ""
			},
			params: null,
			promotion: null
		},
		data: {
			page_st_sn: "S99980",
			page_st_desc: "campaign-product_recommendation",
			event_name: "add_to_cart",
			platform: "WEB",
			note: "item_url: 包含 algo_id + campaign_id\n",
			promotion_type: "campaign:product_recommendation"
		}
	},
	cartUpdated: {
		required: {
			page: null,
			params: {
				campaign_id: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: ""
			},
			params: null,
			promotion: null
		},
		data: {
			page_st_sn: "S99980",
			page_st_desc: "campaign-product_recommendation",
			event_name: "cart_updated",
			platform: "WEB",
			note: "item_url: 包含 algo_id + campaign_id\n",
			promotion_type: "campaign:product_recommendation"
		}
	}
};
var schemaConf$1 = {
	campaignProductRecommendation: campaignProductRecommendation$1
};

const PROMOTION_TYPE$1 = "campaign:product_recommendation";
var automizelyMarketingDataCollectorCore = {
  sendImpr: (data) => {
    collect$1("impr", {
      promotion: {
        promotion_id: data.campaign_id,
        promotion_type: PROMOTION_TYPE$1
      },
      params: {
        campaign_id: data.campaign_id
      },
      page: {
        page_st_sn: schemaConf$1.campaignProductRecommendation.impr.data.page_st_sn
      }
    });
  },
  sendAddToCart: (data) => {
    collect$1("add_to_cart", {
      promotion: {
        promotion_id: data.campaign_id,
        promotion_type: PROMOTION_TYPE$1
      },
      params: {
        campaign_id: data.campaign_id
      },
      page: {
        page_st_sn: schemaConf$1.campaignProductRecommendation.addToCart.data.page_st_sn
      },
      ecommerce: {
        items: [
          {
            item_url: data.item_url,
            item_id: data.product_id
          }
        ]
      }
    });
  },
  sendCheckout: (data) => {
    collect$1("checkout", {
      promotion: {
        promotion_id: data.campaign_id,
        promotion_type: PROMOTION_TYPE$1
      },
      params: {
        campaign_id: data.campaign_id
      },
      page: {
        page_st_sn: schemaConf$1.campaignProductRecommendation.checkout.data.page_st_sn
      },
      ecommerce: {
        items: [
          {
            item_url: data.item_url,
            item_id: data.product_id
          }
        ]
      }
    });
  },
  sendViewItem: (data) => {
    collect$1("view_item", {
      promotion: {
        promotion_id: data.campaign_id,
        promotion_type: PROMOTION_TYPE$1
      },
      params: {
        campaign_id: data.campaign_id
      },
      page: {
        page_el_sn: schemaConf$1.campaignProductRecommendation.viewItemProductItemE99956.data.page_el_sn,
        page_st_sn: schemaConf$1.campaignProductRecommendation.viewItemProductItemE99956.data.page_st_sn
      },
      ecommerce: {
        items: [
          {
            item_url: data.item_url,
            item_id: data.product_id
          }
        ]
      }
    });
  },
  sendClickItem: (data) => {
    collect$1("click_item", {
      promotion: {
        promotion_id: data.campaign_id,
        promotion_type: PROMOTION_TYPE$1
      },
      params: {
        campaign_id: data.campaign_id
      },
      page: {
        page_el_sn: schemaConf$1.campaignProductRecommendation.clickItemProductItemE99956.data.page_el_sn,
        page_st_sn: schemaConf$1.campaignProductRecommendation.clickItemProductItemE99956.data.page_st_sn
      },
      ecommerce: {
        items: [
          {
            item_url: data.item_url,
            item_id: data.product_id
          }
        ]
      }
    });
  },
  sendClickProductTitle: (data) => {
    collect$1("click_item", {
      promotion: {
        promotion_id: data.campaign_id,
        promotion_type: PROMOTION_TYPE$1
      },
      page: {
        page_el_sn: schemaConf$1.campaignProductRecommendation.clickItemProductItemTitleE99955.data.page_el_sn,
        page_st_sn: schemaConf$1.campaignProductRecommendation.clickItemProductItemTitleE99955.data.page_st_sn
      },
      params: {
        campaign_id: data.campaign_id
      },
      ecommerce: {
        items: [
          {
            item_url: data.item_url,
            item_id: data.product_id
          }
        ]
      }
    });
  },
  sendCartUpdated: (data) => {
    collect$1("cart_updated", {
      promotion: {
        promotion_id: data.campaign_id,
        promotion_type: PROMOTION_TYPE$1
      },
      page: {
        page_st_sn: schemaConf$1.campaignProductRecommendation.cartUpdated.data.page_st_sn
      },
      params: {
        campaign_id: data.campaign_id
      },
      ecommerce: {
        items: data.cart?.items ?? []
      }
    });
  },
  sendClick: (data) => {
    const recommendationSchemaConf = schemaConf$1.campaignProductRecommendation;
    let page_el_sn = recommendationSchemaConf.clickBuyNowButtonE99954.data.page_el_sn;
    let page_st_sn = recommendationSchemaConf.clickBuyNowButtonE99954.data.page_st_sn;
    if (data.button_type === "redirect") {
      page_el_sn = recommendationSchemaConf.clickRedirectButtonE99945.data.page_el_sn;
      page_st_sn = recommendationSchemaConf.clickRedirectButtonE99945.data.page_st_sn;
    } else if (data.button_type === "dynamic_checkout") {
      page_el_sn = recommendationSchemaConf.clickCheckoutButtonE99946.data.page_el_sn;
      page_st_sn = recommendationSchemaConf.clickCheckoutButtonE99946.data.page_st_sn;
    }
    collect$1("click", {
      promotion: {
        promotion_id: data.campaign_id,
        promotion_type: PROMOTION_TYPE$1
      },
      page: {
        page_el_sn,
        page_st_sn
      },
      params: {
        campaign_id: data.campaign_id,
        label: data.label || ""
      },
      ecommerce: {
        items: [
          {
            item_url: data.item_url,
            item_id: data.product_id
          }
        ]
      }
    });
  }
};

const campaignProductRecommendation = {
	impr: {
		required: {
			page: null,
			params: {
				campaign_id: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: "",
				page_el_sn: ""
			},
			params: null,
			promotion: null
		},
		data: {
			page_st_sn: "S69999",
			page_st_desc: "campaign-product_recommendation",
			event_name: "impr",
			platform: "WEB",
			promotion_type: "campaign:product_recommendation"
		}
	},
	viewItemProductItemE69999: {
		required: {
			page: null,
			params: {
				campaign_id: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: ""
			},
			params: null,
			promotion: null
		},
		data: {
			page_st_sn: "S69999",
			page_st_desc: "campaign-product_recommendation",
			page_el_sn: "E69999",
			page_el_sn_desc: "product item",
			event_name: "view_item",
			platform: "WEB",
			note: "item_url: 包含 algo_id + campaign_id\nindex (1,2,3 ...)",
			promotion_type: "campaign:product_recommendation"
		}
	},
	clickItemProductItemE69999: {
		required: {
			page: null,
			params: {
				campaign_id: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: ""
			},
			params: null,
			promotion: null
		},
		data: {
			page_st_sn: "S69999",
			page_st_desc: "campaign-product_recommendation",
			page_el_sn: "E69999",
			page_el_sn_desc: "product item",
			event_name: "click_item",
			platform: "WEB",
			note: "item_url: 包含 algo_id + campaign_id\nindex (1,2,3 ...)",
			promotion_type: "campaign:product_recommendation"
		}
	},
	clickItemProductItemTitleE69998: {
		required: {
			page: null,
			params: {
				campaign_id: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: ""
			},
			params: null,
			promotion: null
		},
		data: {
			page_st_sn: "S69999",
			page_st_desc: "campaign-product_recommendation",
			page_el_sn: "E69998",
			page_el_sn_desc: "product item title",
			event_name: "click_item",
			platform: "WEB",
			note: "item_url: 包含 algo_id + campaign_id\nindex (1,2,3 ...)",
			promotion_type: "campaign:product_recommendation"
		}
	},
	clickBuyNowButtonE69997: {
		required: {
			page: null,
			params: {
				campaign_id: "",
				label: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: ""
			},
			params: {
				link_url: ""
			},
			promotion: null
		},
		data: {
			page_st_sn: "S69999",
			page_st_desc: "campaign-product_recommendation",
			page_el_sn: "E69997",
			page_el_sn_desc: "buy now button",
			event_name: "click",
			platform: "WEB",
			note: "item_url: 包含 algo_id + campaign_id\n",
			promotion_type: "campaign:product_recommendation"
		}
	},
	clickCheckoutButtonE69996: {
		required: {
			page: null,
			params: {
				campaign_id: "",
				label: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: ""
			},
			params: {
				link_url: ""
			},
			promotion: null
		},
		data: {
			page_st_sn: "S69999",
			page_st_desc: "campaign-product_recommendation",
			page_el_sn: "E69996",
			page_el_sn_desc: "checkout button",
			event_name: "click",
			platform: "WEB",
			note: "item_url: 包含 algo_id + campaign_id\n",
			promotion_type: "campaign:product_recommendation"
		}
	},
	clickRedirectButtonE69995: {
		required: {
			page: null,
			params: {
				campaign_id: "",
				label: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: ""
			},
			params: {
				link_url: ""
			},
			promotion: null
		},
		data: {
			page_st_sn: "S69999",
			page_st_desc: "campaign-product_recommendation",
			page_el_sn: "E69995",
			page_el_sn_desc: "redirect button",
			event_name: "click",
			platform: "WEB",
			note: "item_url: 包含 algo_id + campaign_id\n",
			promotion_type: "campaign:product_recommendation"
		}
	},
	checkout: {
		required: {
			page: null,
			params: {
				campaign_id: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: ""
			},
			params: null,
			promotion: null
		},
		data: {
			page_st_sn: "S69999",
			page_st_desc: "campaign-product_recommendation",
			event_name: "checkout",
			platform: "WEB",
			note: "item_url: 包含 algo_id + campaign_id\n",
			promotion_type: "campaign:product_recommendation"
		}
	},
	addToCart: {
		required: {
			page: null,
			params: {
				campaign_id: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: ""
			},
			params: null,
			promotion: null
		},
		data: {
			page_st_sn: "S69999",
			page_st_desc: "campaign-product_recommendation",
			event_name: "add_to_cart",
			platform: "WEB",
			note: "item_url: 包含 algo_id + campaign_id\n",
			promotion_type: "campaign:product_recommendation"
		}
	},
	cartUpdated: {
		required: {
			page: null,
			params: {
				campaign_id: ""
			},
			promotion: {
				promotion_id: ""
			}
		},
		optional: {
			page: {
				page_sn: ""
			},
			params: null,
			promotion: null
		},
		data: {
			page_st_sn: "S69999",
			page_st_desc: "campaign-product_recommendation",
			event_name: "cart_updated",
			platform: "WEB",
			note: "item_url: 包含 algo_id + campaign_id\n",
			promotion_type: "campaign:product_recommendation"
		}
	}
};
var schemaConf = {
	campaignProductRecommendation: campaignProductRecommendation
};

const PROMOTION_TYPE = "campaign:product_recommendation";
const collect = () => {
  return "";
};
var personalizationDataCollectorCore = {
  sendImpr(data) {
    collect("impr", {
      promotion: {
        promotion_id: data.campaign_id,
        promotion_type: PROMOTION_TYPE
      },
      params: {
        campaign_id: data.campaign_id
      },
      page: {
        page_st_sn: schemaConf.campaignProductRecommendation.impr.data.page_st_sn
      }
    });
  },
  sendAddToCart(data) {
    collect("add_to_cart", {
      promotion: {
        promotion_id: data.campaign_id,
        promotion_type: PROMOTION_TYPE
      },
      params: {
        campaign_id: data.campaign_id
      },
      page: {
        page_st_sn: schemaConf.campaignProductRecommendation.addToCart.data.page_st_sn
      },
      ecommerce: {
        items: [
          {
            item_url: data.item_url,
            item_id: data.product_id
          }
        ]
      }
    });
  },
  sendCheckout(data) {
    collect("checkout", {
      promotion: {
        promotion_id: data.campaign_id,
        promotion_type: PROMOTION_TYPE
      },
      params: {
        campaign_id: data.campaign_id
      },
      page: {
        page_st_sn: schemaConf.campaignProductRecommendation.checkout.data.page_st_sn
      },
      ecommerce: {
        items: [
          {
            item_url: data.item_url,
            item_id: data.product_id
          }
        ]
      }
    });
  },
  sendViewItem(data) {
    collect("view_item", {
      promotion: {
        promotion_id: data.campaign_id,
        promotion_type: PROMOTION_TYPE
      },
      params: {
        campaign_id: data.campaign_id
      },
      page: {
        page_el_sn: schemaConf.campaignProductRecommendation.viewItemProductItemE69999.data.page_el_sn,
        page_st_sn: schemaConf.campaignProductRecommendation.viewItemProductItemE69999.data.page_st_sn
      },
      ecommerce: {
        items: [
          {
            item_url: data.item_url,
            item_id: data.product_id
          }
        ]
      }
    });
  },
  sendClickProductTitle(data) {
    collect("click_item", {
      promotion: {
        promotion_id: data.campaign_id,
        promotion_type: PROMOTION_TYPE
      },
      page: {
        page_el_sn: schemaConf.campaignProductRecommendation.clickItemProductItemTitleE69998.data.page_el_sn,
        page_st_sn: schemaConf.campaignProductRecommendation.clickItemProductItemTitleE69998.data.page_st_sn
      },
      params: {
        campaign_id: data.campaign_id
      },
      ecommerce: {
        items: [
          {
            item_url: data.item_url,
            item_id: data.product_id
          }
        ]
      }
    });
  },
  sendCartUpdated(data) {
    collect("cart_updated", {
      promotion: {
        promotion_id: data.campaign_id,
        promotion_type: PROMOTION_TYPE
      },
      page: {
        page_st_sn: schemaConf.campaignProductRecommendation.cartUpdated.data.page_st_sn
      },
      params: {
        campaign_id: data.campaign_id
      },
      ecommerce: {
        items: data.cart?.items ?? []
      }
    });
  },
  sendClick(data) {
    const recommendationSchemaConf = schemaConf.campaignProductRecommendation;
    let page_el_sn = recommendationSchemaConf.clickBuyNowButtonE69997.data.page_el_sn;
    let page_st_sn = recommendationSchemaConf.clickBuyNowButtonE69997.data.page_st_sn;
    if (data.button_type === "redirect") {
      page_el_sn = recommendationSchemaConf.clickRedirectButtonE69995.data.page_el_sn;
      page_st_sn = recommendationSchemaConf.clickRedirectButtonE69995.data.page_st_sn;
    } else if (data.button_type === "dynamic_checkout") {
      page_el_sn = recommendationSchemaConf.clickCheckoutButtonE69996.data.page_el_sn;
      page_st_sn = recommendationSchemaConf.clickCheckoutButtonE69996.data.page_st_sn;
    }
    collect("click", {
      promotion: {
        promotion_id: data.campaign_id,
        promotion_type: PROMOTION_TYPE
      },
      page: {
        page_el_sn,
        page_st_sn
      },
      params: {
        campaign_id: data.campaign_id,
        label: data.label || ""
      },
      ecommerce: {
        items: [
          {
            item_url: data.item_url,
            item_id: data.product_id
          }
        ]
      }
    });
  },
  sendClickItem(data) {
    collect("click_item", {
      promotion: {
        promotion_id: data.campaign_id,
        promotion_type: PROMOTION_TYPE
      },
      params: {
        campaign_id: data.campaign_id
      },
      page: {
        page_el_sn: schemaConf.campaignProductRecommendation.clickItemProductItemE69999.data.page_el_sn,
        page_st_sn: schemaConf.campaignProductRecommendation.clickItemProductItemE69999.data.page_st_sn
      },
      ecommerce: {
        items: [
          {
            item_url: data.item_url,
            item_id: data.product_id
          }
        ]
      }
    });
  }
};

const DataCollectorCoreMapping = {
  "AM_WIDGET": automizelyMarketingDataCollectorCore,
  "AM_ADMIN_PREVIEW": automizelyMarketingDataCollectorCore,
  "NPM": automizelyMarketingDataCollectorCore,
  "PZ_WIDGET": personalizationDataCollectorCore
};
const DataCollectorCore = DataCollectorCoreMapping[{"APP_ENV":"staging","APP_MAIN":"AM_WIDGET"}.APP_MAIN] || DataCollectorCoreMapping["AM_WIDGET"];
const sendImpr = DataCollectorCore.sendImpr;
const sendAddToCart = DataCollectorCore.sendAddToCart;
const sendCheckout = DataCollectorCore.sendCheckout;
const sendViewItem = DataCollectorCore.sendViewItem;
const sendClickItem = DataCollectorCore.sendClickItem;
const sendClickProductTitle = DataCollectorCore.sendClickProductTitle;
const sendCartUpdated = DataCollectorCore.sendCartUpdated;
const sendClick = DataCollectorCore.sendClick;

function getShopifyInfo() {
  const countryCode = window?.Shopify?.country;
  const currencyCode = window?.Shopify?.currency?.active;
  const exchangeRate = window?.Shopify?.currency?.rate;
  const languageCode = window?.Shopify?.locale;
  return {
    countryCode,
    currencyCode,
    exchangeRate,
    languageCode
  };
}
function formatLocalPrice(price, backup = []) {
  if (typeof price !== "number")
    return void 0;
  const { countryCode, currencyCode, exchangeRate, languageCode } = getShopifyInfo();
  const transforms = [
    {
      country: countryCode,
      active: currencyCode,
      rate: exchangeRate,
      language: languageCode
    },
    ...backup
  ];
  for (const i in transforms) {
    const { country, active, rate, language } = transforms[i];
    if (active && rate && country && language) {
      const localParam = language ? language.includes("-") ? language : `${language}-${country}` : void 0;
      const formatPrice2 = new Intl.NumberFormat(localParam, {
        style: "currency",
        currency: active
      }).format(price * rate);
      const finalPrice = handleSpecialCurrency(formatPrice2, price, active, rate, localParam);
      return finalPrice;
    }
  }
  return null;
}
const SPECIAL_CURRENCY_MAP = ["JPY", "KRW", "VND", "IDR"];
function handleSpecialCurrency(formatPrice2, unformatPrice, active, rate, localParam) {
  if (!SPECIAL_CURRENCY_MAP.includes(active)) {
    return formatPrice2;
  }
  return new Intl.NumberFormat(localParam, {
    style: "currency",
    currency: active,
    maximumFractionDigits: 0
  }).format(Math.round(unformatPrice * rate));
}

var ButtonStatus = /* @__PURE__ */ ((ButtonStatus2) => {
  ButtonStatus2["default"] = "default";
  ButtonStatus2["loading"] = "loading";
  ButtonStatus2["success"] = "success";
  ButtonStatus2["fail"] = "fail";
  return ButtonStatus2;
})(ButtonStatus || {});

const goToCheckoutUrl = async (variantId, currency, campaignId, productId, productUrl, e) => {
  if (!variantId || !currency) {
    throw new Error("variantId or currency unavailable.");
  }
  const shopifyData = document.querySelector("#shopify-features");
  const { accessToken } = JSON.parse(shopifyData.innerHTML);
  const res = await callAutomizely(`${location.origin}/wallets/checkouts.json`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${getShopifyAuth(accessToken)}`
    },
    body: JSON.stringify({
      checkout: {
        line_items: [
          {
            variant_id: variantId,
            quantity: 1
          }
        ],
        secret: true,
        wallet_name: "Checkout",
        is_upstream_button: true,
        page_type: "product",
        has_selling_plans: false,
        presentment_currency: currency
      }
    })
  });
  productUrl && sendCheckout({
    campaign_id: campaignId,
    item_url: productUrl,
    product_id: productId
  });
  const {
    checkout: { web_url }
  } = res;
  location.href = web_url;
};
const handleAddToCart = ({
  campaignId,
  traceId,
  variantId,
  productId,
  productUrl,
  sellingPlanId,
  cb,
  errorCallback
}) => {
  const promotion = {
    promotion_id: campaignId,
    promotion_type: "campaign:product_recommendation"
  };
  addCart({ variantId, promotion, eventId: traceId, sellingPlanId }).then(() => {
    productUrl && sendAddToCart({
      campaign_id: campaignId,
      item_url: productUrl,
      product_id: productId
    });
  }).then(fetchCart).then((cart) => {
    productUrl && sendCartUpdated({
      campaign_id: campaignId,
      cart
    });
    cb && cb();
  }).catch((error) => {
    errorCallback && errorCallback(error);
  });
};

var successIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0wIDEwQzAgMTUuNTE0IDQuNDg2IDIwIDEwIDIwQzE1LjUxNCAyMCAyMCAxNS41MTQgMjAgMTBDMjAgNC40ODYgMTUuNTE0IDAgMTAgMEM0LjQ4NiAwIDAgNC40ODYgMCAxMFpNMTUuMjA3MSA4LjIwNzExQzE1LjU5NzYgNy44MTY1OCAxNS41OTc2IDcuMTgzNDIgMTUuMjA3MSA2Ljc5Mjg5QzE0LjgxNjYgNi40MDIzNyAxNC4xODM0IDYuNDAyMzcgMTMuNzkyOSA2Ljc5Mjg5TDkgMTEuNTg1OEw2LjcwNzExIDkuMjkyODlDNi4zMTY1OCA4LjkwMjM3IDUuNjgzNDIgOC45MDIzNyA1LjI5Mjg5IDkuMjkyODlDNC45MDIzNyA5LjY4MzQyIDQuOTAyMzcgMTAuMzE2NiA1LjI5Mjg5IDEwLjcwNzFMOC4yOTI4OSAxMy43MDcxQzguNjgzNDIgMTQuMDk3NiA5LjMxNjU4IDE0LjA5NzYgOS43MDcxMSAxMy43MDcxTDE1LjIwNzEgOC4yMDcxMVoiIGZpbGw9IiMwMDdGNUYiLz4KPC9zdmc+Cg==";

var emptyIcon = "data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjIyNSIgaGVpZ2h0PSIyMjUiIHZpZXdCb3g9IjAgMCAyMjUgMjI1IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTAgMFYyMjVIMjI1VjBIMFoiIGZpbGw9IiNGQUZBRkEiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMDUuNSAxMDNDMTA0LjY3MiAxMDMgMTA0IDEwMy42NzIgMTA0IDEwNC41VjExOS41QzEwNCAxMjAuMzI4IDEwNC42NzIgMTIxIDEwNS41IDEyMUgxMjAuNUMxMjEuMzI4IDEyMSAxMjIgMTIwLjMyOCAxMjIgMTE5LjVWMTA0LjVDMTIyIDEwMy42NzIgMTIxLjMyOCAxMDMgMTIwLjUgMTAzSDEwNS41Wk0xMTAuNSAxMDYuNUMxMTEuNiAxMDYuNSAxMTIuNSAxMDcuNCAxMTIuNSAxMDguNUMxMTIuNSAxMDkuNiAxMTEuNiAxMTAuNSAxMTAuNSAxMTAuNUMxMDkuNCAxMTAuNSAxMDguNSAxMDkuNiAxMDguNSAxMDguNUMxMDguNSAxMDcuNCAxMDkuNCAxMDYuNSAxMTAuNSAxMDYuNVpNMTE5LjQ5OSAxMTlIMTA2LjQ5N0MxMDYuMDg3IDExOSAxMDUuODU3IDExOC41NCAxMDYuMDk3IDExOC4yMUwxMDkuNjUgMTE0LjE1OUMxMDkuODQgMTEzLjk0OSAxMTAuMTcgMTEzLjk0OSAxMTAuMzcgMTE0LjE0OUwxMTIgMTE2TDExNS4wNiAxMTEuMjE5QzExNS4yNyAxMTAuOTE5IDExNS43MSAxMTAuOTI5IDExNS45IDExMS4yMzlMMTE5LjkzOSAxMTguMjVDMTIwLjExOSAxMTguNTkgMTE5Ljg3OSAxMTkgMTE5LjQ5OSAxMTlaIiBmaWxsPSIjOEM5MTk2Ii8+Cjwvc3ZnPg==";

var failIcon$1 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMCAyMEMxNS41MTQgMjAgMjAgMTUuNTE0IDIwIDEwQzIwIDQuNDg2IDE1LjUxNCAtNC44MjA0OWUtMDcgMTAgMEM0LjQ4NiA0LjgyMDQ5ZS0wNyAtNC44MjA0OWUtMDcgNC40ODYgMCAxMEM0LjgyMDQ5ZS0wNyAxNS41MTQgNC40ODYgMjAgMTAgMjBaTTExIDE0QzExIDE0LjU1MjMgMTAuNTUyMyAxNSAxMCAxNUM5LjQ0NzcxIDE1IDkgMTQuNTUyMyA5IDE0VjEwQzkgOS40NDc3MiA5LjQ0NzcxIDkgMTAgOUMxMC41NTIzIDkgMTEgOS40NDc3MiAxMSAxMFYxNFpNMTAgNUM5LjQ0NzcxIDUgOSA1LjQ0NzcxIDkgNkM5IDYuNTUyMjkgOS40NDc3MSA3IDEwIDdDMTAuNTUyMyA3IDExIDYuNTUyMjkgMTEgNkMxMSA1LjQ0NzcxIDEwLjU1MjMgNSAxMCA1WiIgZmlsbD0iI0Q3MkMwRCIvPgo8L3N2Zz4K";

const SectionWidthMapping = {
  small: 480,
  standard: 960,
  large: 1440
};

const isSmallScreen = () => document.body.getBoundingClientRect().width <= 600;
const conversionHeightRatio = (image_crop = "") => {
  if (!/^\d+:\d+$/.test(image_crop)) {
    image_crop = "1:1";
  }
  const numbers = image_crop.split(":");
  const [denominator, numerator] = numbers;
  return 100 * Number(numerator) / Number(denominator);
};

const context = createContext({ traceId: "" });

const GlobalStateProvider = props => {
  return createComponent(context.Provider, {
    value: props,

    get children() {
      return props.children;
    }

  });
};

const useGlobalState = () => useContext(context);

const _tmpl$$f = /*#__PURE__*/template(`<div class="am_rec_item_title"></div>`),
      _tmpl$2$a = /*#__PURE__*/template(`<span class="am_rec_item_price"></span>`),
      _tmpl$3$7 = /*#__PURE__*/template(`<span class="am_rec_compare_price"></span>`),
      _tmpl$4$4 = /*#__PURE__*/template(`<div class="am_rec_price_content"></div>`),
      _tmpl$5$2 = /*#__PURE__*/template(`<div class="am_rec_button_container"><button class="am_rec_add_to_cart_button"><span class="button-text"></span><div class="button-loading"></div></button></div>`),
      _tmpl$6$1 = /*#__PURE__*/template(`<div class="add_to_cart_status"><span></span></div>`),
      _tmpl$7$1 = /*#__PURE__*/template(`<div class="am_rec_item_wrap"><a class="am_productInfo_container"><div class="am_rec_item_img" id="am_rec_item_img"><img alt="AfterShip recommendation product"></div></a></div>`),
      _tmpl$8$1 = /*#__PURE__*/template(`<div class="am_rec_item"></div>`),
      _tmpl$9$1 = /*#__PURE__*/template(`<img alt="fail">`),
      _tmpl$10 = /*#__PURE__*/template(`<img alt="success">`);

const ProductItem = props => {
  const {
    product,
    settings,
    id,
    index
  } = props;
  const globalState = useGlobalState();
  const [state, setState] = createStore({
    width: 0,
    height: 0,
    buttonType: props.settings?.content.action_button?.button_type || 'add_to_cart',
    variantId: product?.variantId || '',
    productId: product?.externalId || '',
    promotion: {
      promotion_id: id,
      promotion_type: 'campaign:product_recommendation'
    }
  });
  createEffect(() => {
    if ((settings?.mobile_layout?.display_style === 'grid' || settings?.desktop_layout?.display_style === 'grid') && product?.productUrl) {
      sendViewItem({
        campaign_id: id,
        item_url: `${product?.productUrl}&index=${index}`,
        product_id: state.productId
      });
    }
  });
  const [addToCartStatus, setAddToCartStatus] = createSignal(ButtonStatus.default);
  const [errorDescription, setErrorDescription] = createSignal('Something went wrong. Please try again');

  const changeBuyNowButtonStatus = (button, status) => {
    const addToCartBtn = button instanceof HTMLButtonElement ? button : button && button.parentElement;

    if (!addToCartBtn) {
      return;
    }

    setAddToCartStatus(status);

    switch (status) {
      case ButtonStatus.loading:
        addToCartBtn.classList.add('buy-now-button--loading');
        addToCartBtn.disabled = true;
        break;

      case ButtonStatus.success:
        addToCartBtn.classList.remove('buy-now-button--loading');
        addToCartBtn.disabled = false;
        break;

      case ButtonStatus.fail:
        addToCartBtn.classList.remove('buy-now-button--loading');
        addToCartBtn.disabled = false;
        break;
    }

    if (status === ButtonStatus.success || status === ButtonStatus.fail) {
      const timer = setTimeout(() => {
        setAddToCartStatus(ButtonStatus.default);
        clearTimeout(timer);
      }, 3000);
    }
  };

  const autoStyle = globalState.style;
  return (() => {
    const _el$ = _tmpl$8$1.cloneNode(true);

    insert(_el$, createComponent(StyleComponent, {
      displayStyle: "initial",

      get children() {
        const _el$2 = _tmpl$7$1.cloneNode(true),
              _el$3 = _el$2.firstChild,
              _el$4 = _el$3.firstChild,
              _el$5 = _el$4.firstChild;

        _el$3.$$click = () => {
          product?.productUrl && sendClickItem({
            campaign_id: id,
            item_url: `${product?.productUrl}&index=${index}`,
            product_id: state.productId
          });
        };

        insert(_el$3, createComponent(Show, {
          get when() {
            return settings?.content.show_product_name;
          },

          get children() {
            const _el$6 = _tmpl$$f.cloneNode(true);

            _el$6.$$click = () => {
              sendClickProductTitle({
                campaign_id: id,
                item_url: `${product?.productUrl}&index=${index}`,
                product_id: state.productId
              });
            };

            insert(_el$6, () => product.title);

            createRenderEffect(_p$ => {
              const _v$ = `${settings?.font.product_info_text_font_family}`,
                    _v$2 = `${autoStyle?.productName?.color ?? settings?.color.product_name}`,
                    _v$3 = autoStyle?.productName?.fontWeight;

              _v$ !== _p$._v$ && _el$6.style.setProperty("font-family", _p$._v$ = _v$);
              _v$2 !== _p$._v$2 && _el$6.style.setProperty("color", _p$._v$2 = _v$2);
              _v$3 !== _p$._v$3 && _el$6.style.setProperty("font-weight", _p$._v$3 = _v$3);
              return _p$;
            }, {
              _v$: undefined,
              _v$2: undefined,
              _v$3: undefined
            });

            return _el$6;
          }

        }), null);

        insert(_el$3, createComponent(Show, {
          get when() {
            return settings?.content.show_product_price || settings?.content.show_compare_at_price;
          },

          get children() {
            const _el$7 = _tmpl$4$4.cloneNode(true);

            insert(_el$7, createComponent(Show, {
              get when() {
                return settings?.content.show_product_price;
              },

              get children() {
                const _el$8 = _tmpl$2$a.cloneNode(true);

                insert(_el$8, () => formatLocalPrice(product.price));

                createRenderEffect(_p$ => {
                  const _v$4 = `${settings?.font.product_info_text_font_family}`,
                        _v$5 = `${autoStyle?.price?.color ?? settings?.color.product_price}`,
                        _v$6 = autoStyle?.price?.fontWeight;

                  _v$4 !== _p$._v$4 && _el$8.style.setProperty("font-family", _p$._v$4 = _v$4);
                  _v$5 !== _p$._v$5 && _el$8.style.setProperty("color", _p$._v$5 = _v$5);
                  _v$6 !== _p$._v$6 && _el$8.style.setProperty("font-weight", _p$._v$6 = _v$6);
                  return _p$;
                }, {
                  _v$4: undefined,
                  _v$5: undefined,
                  _v$6: undefined
                });

                return _el$8;
              }

            }), null);

            insert(_el$7, createComponent(Show, {
              get when() {
                return memo(() => !!(settings?.content.show_compare_at_price && Number(product.compareAtPrice)), true)() && Number(product.compareAtPrice) !== Number(product.price);
              },

              get children() {
                const _el$9 = _tmpl$3$7.cloneNode(true);

                insert(_el$9, (() => {
                  const _c$ = memo(() => !!product.compareAtPrice, true);

                  return () => _c$() ? formatLocalPrice(product.compareAtPrice) : null;
                })());

                createRenderEffect(_p$ => {
                  const _v$7 = `${settings?.font.product_info_text_font_family}`,
                        _v$8 = autoStyle?.price?.color ?? `${settings?.color.compare_at_price}`,
                        _v$9 = autoStyle?.price?.color ? 0.5 : 1;

                  _v$7 !== _p$._v$7 && _el$9.style.setProperty("font-family", _p$._v$7 = _v$7);
                  _v$8 !== _p$._v$8 && _el$9.style.setProperty("color", _p$._v$8 = _v$8);
                  _v$9 !== _p$._v$9 && _el$9.style.setProperty("opacity", _p$._v$9 = _v$9);
                  return _p$;
                }, {
                  _v$7: undefined,
                  _v$8: undefined,
                  _v$9: undefined
                });

                return _el$9;
              }

            }), null);

            return _el$7;
          }

        }), null);

        insert(_el$2, createComponent(Show, {
          get when() {
            return settings?.content.action_button?.enabled;
          },

          get children() {
            return [(() => {
              const _el$10 = _tmpl$5$2.cloneNode(true),
                    _el$11 = _el$10.firstChild,
                    _el$12 = _el$11.firstChild,
                    _el$13 = _el$12.nextSibling;

              _el$11.$$click = event => {
                sendClick({
                  label: settings?.content.action_button?.text || 'add to cart',
                  campaign_id: id,
                  item_url: `${product?.productUrl}&index=${index}`,
                  product_id: state.productId,
                  button_type: state.buttonType
                });

                if (state.buttonType === ButtonType.Redirect) {
                  location.href = `${product?.productUrl}&index=${index}`;
                  return;
                }

                if (state.buttonType === ButtonType.DynamicCheckout && !product.options?.length) {
                  goToCheckoutUrl(state.variantId, product.currency, id, state.productId, `${product?.productUrl}&index=${index}`);
                  return;
                }

                if ([ButtonType.AddToCart, ButtonType.DynamicCheckout].includes(state.buttonType) && product.options?.length) {
                  props.openVariantPicker && props.openVariantPicker(state.productId);
                  return;
                }

                changeBuyNowButtonStatus(event.target, ButtonStatus.loading);
                addCart({
                  variantId: state.variantId,
                  promotion: state.promotion,
                  eventId: globalState.traceId
                }).then(() => {
                  product?.productUrl && sendAddToCart({
                    campaign_id: id,
                    item_url: `${product?.productUrl}`,
                    product_id: state.productId
                  });
                }).then(fetchCart).then(cart => {
                  product?.productUrl && sendCartUpdated({
                    campaign_id: id,
                    cart: cart
                  });
                  changeBuyNowButtonStatus(event.target, ButtonStatus.success);

                  if (state.buttonType === ButtonType.AddToCart && props.settings?.content.action_button?.button_action === ButtonActionType.GoCartPage) {
                    location.href = '/cart';
                  }

                  const {
                    pathname
                  } = new URL(location.href);
                  const [, path] = pathname.split('/');

                  if (['cart'].includes(path)) {
                    window.location.reload();
                  }
                }).catch(error => {
                  changeBuyNowButtonStatus(event.target, ButtonStatus.fail);
                  const message = error.name === 'TypeError' ? 'Network error. Please try again' : error.message;
                  setErrorDescription(message);
                });
              };

              insert(_el$12, () => settings?.content.action_button?.text);

              createRenderEffect(_p$ => {
                const _v$10 = `
							color: ${autoStyle?.button?.color ?? settings?.color.action_button_text} !important;
							font-family: ${settings?.font.product_info_text_font_family}, "system-ui";
							cursor: 'pointer';
							border: ${autoStyle?.button?.border ?? `1px solid ${settings?.color.action_button_background}`};
							background: ${autoStyle?.button?.background ?? settings?.color.action_button_background} !important;
							font-weight: ${autoStyle?.button?.fontWeight ?? ''};
							border-radius: ${autoStyle?.button?.borderRadius ?? ''};
						`,
                      _v$11 = autoStyle?.button?.color ?? '#fff';

                _p$._v$10 = style$1(_el$11, _v$10, _p$._v$10);
                _v$11 !== _p$._v$11 && _el$13.style.setProperty("border-color", _p$._v$11 = _v$11);
                return _p$;
              }, {
                _v$10: undefined,
                _v$11: undefined
              });

              return _el$10;
            })(), createComponent(Show, {
              get when() {
                return addToCartStatus() === ButtonStatus.success || addToCartStatus() === ButtonStatus.fail;
              },

              get children() {
                const _el$14 = _tmpl$6$1.cloneNode(true),
                      _el$15 = _el$14.firstChild;

                insert(_el$14, (() => {
                  const _c$2 = memo(() => addToCartStatus() === ButtonStatus.fail, true);

                  return () => _c$2() ? (() => {
                    const _el$16 = _tmpl$9$1.cloneNode(true);

                    setAttribute$1(_el$16, "src", failIcon$1);

                    return _el$16;
                  })() : (() => {
                    const _el$17 = _tmpl$10.cloneNode(true);

                    setAttribute$1(_el$17, "src", successIcon);

                    return _el$17;
                  })();
                })(), _el$15);

                insert(_el$15, (() => {
                  const _c$3 = memo(() => addToCartStatus() === ButtonStatus.fail, true);

                  return () => _c$3() ? errorDescription() : 'Added to cart';
                })());

                createRenderEffect(() => _el$14.style.setProperty("justify-content", `${settings?.product_info?.alignment === 'left' ? 'flex-start' : settings?.product_info?.alignment === 'right' ? 'flex-end' : 'center'}`));

                return _el$14;
              }

            })];
          }

        }), null);

        createRenderEffect(_p$ => {
          const _v$12 = `${settings?.product_info?.alignment}` || 'center',
                _v$13 = product.productUrl,
                _v$14 = `${settings?.product_info?.alignment}`,
                _v$15 = `${settings?.product_info?.image_radius}px`,
                _v$16 = `${conversionHeightRatio(settings?.product_info?.image_crop ?? '')}%`,
                _v$17 = product.imageUrls[0] ?? emptyIcon,
                _v$18 = `
								border-radius: ${settings?.product_info?.image_radius}px;
							`;

          _v$12 !== _p$._v$12 && _el$2.style.setProperty("text-align", _p$._v$12 = _v$12);
          _v$13 !== _p$._v$13 && setAttribute$1(_el$3, "href", _p$._v$13 = _v$13);
          _v$14 !== _p$._v$14 && _el$3.style.setProperty("text-align", _p$._v$14 = _v$14);
          _v$15 !== _p$._v$15 && _el$4.style.setProperty("border-radius", _p$._v$15 = _v$15);
          _v$16 !== _p$._v$16 && _el$4.style.setProperty("padding-bottom", _p$._v$16 = _v$16);
          _v$17 !== _p$._v$17 && setAttribute$1(_el$5, "src", _p$._v$17 = _v$17);
          _p$._v$18 = style$1(_el$5, _v$18, _p$._v$18);
          return _p$;
        }, {
          _v$12: undefined,
          _v$13: undefined,
          _v$14: undefined,
          _v$15: undefined,
          _v$16: undefined,
          _v$17: undefined,
          _v$18: undefined
        });

        return _el$2;
      }

    }));

    return _el$;
  })();
};

delegateEvents(["click"]);

var styles$b = /* #__PURE__ */ (() => ".am_rec_modal-wrapper{position:fixed;left:0;bottom:0;background:rgba(0,0,0,.25);z-index:10001;width:100vw;height:100vh}.am_rec_modal{padding:20px;position:absolute;background:#fff;z-index:inherit}.am_rec_modal_pc{border-radius:16px;box-shadow:0 -18px 40px #0000000f;left:50%;top:50%;transform:translate(-50%,-50%)}.am_rec_modal_mobile{left:0;right:0;bottom:0;border-radius:0;position:fixed}.am_rec_modal-close{cursor:pointer;position:absolute;right:20px;top:20px;width:20px;height:20px;line-height:16px;text-align:center;display:inline-block}\n")();

var CloseIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkuNDEzODUgNy45OTk4NUwxNS43MDY5IDEuNzA2ODVDMTUuODk0NCAxLjUxOTM0IDE1Ljk5OTcgMS4yNjUwMyAxNS45OTk3IDAuOTk5ODQ5QzE1Ljk5OTcgMC43MzQ2NzMgMTUuODk0NCAwLjQ4MDM1NyAxNS43MDY5IDAuMjkyODQ5QzE1LjUxOTMgMC4xMDUzNDEgMTUuMjY1IDAgMTQuOTk5OCAwQzE0LjczNDcgMCAxNC40ODA0IDAuMTA1MzQxIDE0LjI5MjggMC4yOTI4NDlMNy45OTk4NSA2LjU4NTg1TDEuNzA2ODUgMC4yOTI4NDlDMS42MTQgMC4yMDAwMDUgMS41MDM3OCAwLjEyNjM1NiAxLjM4MjQ3IDAuMDc2MTA5MkMxLjI2MTE3IDAuMDI1ODYyMSAxLjEzMTE1IDAgMC45OTk4NDkgMEMwLjg2ODU0NyAwIDAuNzM4NTMxIDAuMDI1ODYyMSAwLjYxNzIyNCAwLjA3NjEwOTJDMC40OTU5MTYgMC4xMjYzNTYgMC4zODU2OTQgMC4yMDAwMDUgMC4yOTI4NDkgMC4yOTI4NDlDMC4xMDUzNDEgMC40ODAzNTcgMCAwLjczNDY3MyAwIDAuOTk5ODQ5QzAgMS4yNjUwMyAwLjEwNTM0MSAxLjUxOTM0IDAuMjkyODQ5IDEuNzA2ODVMNi41ODU4NSA3Ljk5OTg1TDAuMjkyODQ5IDE0LjI5MjhDMC4xMDUzNDEgMTQuNDgwNCAwIDE0LjczNDcgMCAxNC45OTk4QzAgMTUuMjY1IDAuMTA1MzQxIDE1LjUxOTMgMC4yOTI4NDkgMTUuNzA2OUMwLjQ4MDM1NyAxNS44OTQ0IDAuNzM0NjczIDE1Ljk5OTcgMC45OTk4NDkgMTUuOTk5N0MxLjI2NTAzIDE1Ljk5OTcgMS41MTkzNCAxNS44OTQ0IDEuNzA2ODUgMTUuNzA2OUw3Ljk5OTg1IDkuNDEzODVMMTQuMjkyOCAxNS43MDY5QzE0LjM4NTUgMTUuOCAxNC40OTU3IDE1Ljg3NCAxNC42MTcgMTUuOTI0NEMxNC43MzgzIDE1Ljk3NDkgMTQuODY4NCAxNi4wMDA5IDE0Ljk5OTggMTYuMDAwOUMxNS4xMzEzIDE2LjAwMDkgMTUuMjYxNCAxNS45NzQ5IDE1LjM4MjcgMTUuOTI0NEMxNS41MDQgMTUuODc0IDE1LjYxNDIgMTUuOCAxNS43MDY5IDE1LjcwNjlDMTUuNzk5OCAxNS42MTQxIDE1Ljg3MzUgMTUuNTAzOSAxNS45MjM4IDE1LjM4MjVDMTUuOTc0MiAxNS4yNjEyIDE2IDE1LjEzMTIgMTYgMTQuOTk5OEMxNiAxNC44Njg1IDE1Ljk3NDIgMTQuNzM4NSAxNS45MjM4IDE0LjYxNzJDMTUuODczNSAxNC40OTU4IDE1Ljc5OTggMTQuMzg1NiAxNS43MDY5IDE0LjI5MjhMOS40MTM4NSA3Ljk5OTg1WiIgZmlsbD0iIzVDNUY2MiIvPgo8L3N2Zz4K";

const _tmpl$$e = /*#__PURE__*/template(`<span class="am_rec_modal-close"><img alt=""></span>`),
      _tmpl$2$9 = /*#__PURE__*/template(`<div class="am_rec_modal-wrapper"><div></div></div>`);

const Modal = props => {
  const [open, setOpen] = createSignal(false);
  const [ref, setRef] = createSignal();
  createEffect(() => {
    setOpen(props.showModal);

    if (props.showModal) {
      document.body.setAttribute('style', 'overflow-y: hidden');
    }
  }, props.showModal);
  createEffect(() => {
    ref()?.addEventListener('click', e => {
      e.preventDefault();

      if (e.target === ref() && isSmallScreen()) {
        setOpen(false);
        props.onClose?.();
        document.body.setAttribute('style', 'overflow-y: auto');
      }
    });
    ref()?.addEventListener('touchmove', e => {
      if (e.target === ref() && isSmallScreen()) {
        e.preventDefault();
      }
    });
  });
  onCleanup(() => {
    setRef(undefined);
  });
  return createComponent(Show, {
    get when() {
      return open();
    },

    get children() {
      return createComponent(StyleComponent, {
        styles: styles$b,

        get children() {
          const _el$ = _tmpl$2$9.cloneNode(true),
                _el$2 = _el$.firstChild;

          (el => setRef(el))(_el$);

          insert(_el$2, createComponent(Show, {
            get when() {
              return !props.hiddenClose;
            },

            get children() {
              const _el$3 = _tmpl$$e.cloneNode(true),
                    _el$4 = _el$3.firstChild;

              _el$3.$$click = () => {
                setOpen(false);
                props.onClose?.();
                document.body.setAttribute('style', 'overflow-y: auto');
              };

              setAttribute$1(_el$4, "src", CloseIcon);

              return _el$3;
            }

          }), null);

          insert(_el$2, () => props.children, null);

          createRenderEffect(() => className(_el$2, isSmallScreen() ? 'am_rec_modal am_rec_modal_mobile' : 'am_rec_modal am_rec_modal_pc'));

          return _el$;
        }

      });
    }

  });
};

delegateEvents(["click"]);

var styles$a = /* #__PURE__ */ (() => ".am_rec_mobileVariantPicker{display:grid;row-gap:16px;width:100%;text-align:left}.am_rec_button{position:relative}@media screen and (max-width: 600px){.am_rec_button-action{text-align:left}}.am_rec_mobileVariantPicker.desktop{display:grid;row-gap:16px;max-width:280px;min-height:338px}.am_rec_variantPicker-header{max-width:280px;font-weight:400;font-size:16px;line-height:24px;margin-bottom:4px}.am_rec_variantPicker-header.mobile{font-weight:400;font-size:14px;line-height:20px;color:#000}.am_rec_product-name{overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;margin:0}.am_rec_price{font-weight:700;line-height:24px}.am_rec_price.mobile{line-height:20px}.am_rec_price .origin{margin-left:8px}.am_rec_skuList{overflow-y:scroll;padding-right:50px;height:186px;margin-right:-56px}.am_rec_skuList.mobile{height:unset;min-height:186px;padding-right:0}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{border-radius:3px;background-color:#d9d9d9}.am_rec_button-action{display:inherit}@media screen and (max-width: 600px){.am_rec_skuList{max-height:calc(100vh - 40px);overflow-y:scroll;min-height:186px;max-width:calc(100vw - 40px)}::-webkit-scrollbar{width:0px}}\n")();

var styles$9 = /* #__PURE__ */ (() => ".am_rec_skuSelector{display:grid;row-gap:16px}.am_rec_sku-title{font-weight:400;font-size:14px;line-height:20px;color:#000;margin-bottom:8px}.am_rec_sku-list{margin:0;padding:0;list-style:none;display:flex;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;flex-direction:row;-webkit-flex-direction:row;align-items:flex-start;flex-wrap:wrap}.am_rec_modal li.am_rec_sku--item{margin-right:10px;margin-bottom:10px}\n")();

var styles$8 = /* #__PURE__ */ (() => ".am_rec_button{color:#000;font-weight:400;font-size:14px;border-radius:8px;border:1px solid #CBCBCB;background:#fff;line-height:1;text-align:center;cursor:pointer;display:inherit}.am_rec_button--primary{background:#3E4042;color:#fff;border:1px solid #FFFFFF}.am_rec_button--default{background:#fff;border:1px solid rgba(0,0,0,.08);color:#000}.am_rec_button--large{height:44px;width:100%}.am_rec_button--small{padding:6px 12px}.am_rec_button--medium{padding:8px 16px}.am_rec_button--text{background:none;color:#000;border:none}.am_rec_button--disabled{background:#EFEFF1;cursor:not-allowed;border:1px solid #EFEFF1;color:#d4d6d9!important}.am_rec_button:hover{filter:drop-shadow(0px 4px 6px rgba(0,0,0,.25))}.am_rec_button:active{border:1px solid rgba(0,0,0,.14)!important}\n")();

const _tmpl$$d = /*#__PURE__*/template(`<button id="am-rec-button"><span></span></button>`);

const Button = props => {
  const [classList, setClassList] = createSignal('am_rec_button');
  createEffect(() => {
    let curClass = 'am_rec_button';

    if (props.type) {
      curClass = `${curClass} am_rec_button--${props.type}`;
    }

    if (props.size) {
      curClass = `${curClass} am_rec_button--${props.size}`;
    }

    if (props.disabled) {
      curClass = `${curClass} am_rec_button--disabled`;
    }

    if (props.plain) {
      curClass = 'am_rec_button--text';
    }

    setClassList(curClass);
  });
  return createComponent(StyleComponent, {
    styles: styles$8,

    get children() {
      const _el$ = _tmpl$$d.cloneNode(true),
            _el$2 = _el$.firstChild;

      _el$.$$click = () => {
        props.onClick && props.onClick();
      };

      insert(_el$2, createComponent(Show, {
        get when() {
          return props.text;
        },

        get children() {
          return props.text;
        }

      }), null);

      insert(_el$2, createComponent(Show, {
        get when() {
          return props.children;
        },

        get children() {
          return props.children;
        }

      }), null);

      createRenderEffect(_p$ => {
        const _v$ = classList(),
              _v$2 = props.customStyle,
              _v$3 = props.disabled,
              _v$4 = props.text;

        _v$ !== _p$._v$ && className(_el$, _p$._v$ = _v$);
        _p$._v$2 = style$1(_el$, _v$2, _p$._v$2);
        _v$3 !== _p$._v$3 && (_el$.disabled = _p$._v$3 = _v$3);
        _v$4 !== _p$._v$4 && setAttribute$1(_el$, "data-id", _p$._v$4 = _v$4);
        return _p$;
      }, {
        _v$: undefined,
        _v$2: undefined,
        _v$3: undefined,
        _v$4: undefined
      });

      return _el$;
    }

  });
};

delegateEvents(["click"]);

const createSelect = props => {
  const config = mergeProps({
    multiple: false,
    disabled: false,
    optionToValue: option => option,
    isOptionDisabled: option => false
  }, props);

  const parseValue = value => {
    if (config.multiple && Array.isArray(value)) {
      return value;
    } else if (!config.multiple && !Array.isArray(value)) {
      return value !== null ? [value] : [];
    } else {
      throw new Error(`Incompatible value type for ${config.multiple ? "multple" : "single"} select.`);
    }
  };

  const [_value, _setValue] = createSignal(config.initialValue ? parseValue(config.initialValue) : []);

  const value = () => config.multiple ? _value() : _value()[0] || null;

  const setValue = value => _setValue(parseValue(value));

  const clearValue = () => _setValue([]);

  const hasValue = () => !!(config.multiple ? value().length : value());

  createEffect(on(_value, () => config.onChange?.(value()), {
    defer: true
  }));
  const [inputValue, setInputValue] = createSignal("");

  const clearInputValue = () => setInputValue("");

  createEffect(on(inputValue, inputValue => config.onInput?.(inputValue), {
    defer: true
  }));
  createEffect(on(inputValue, inputValue => {
    if (inputValue && !isOpen()) {
      open();
    }
  }, {
    defer: true
  }));
  const options = typeof config.options === "function" ? createMemo(() => config.options(inputValue()), config.options(inputValue())) : () => config.options;

  const optionsCount = () => options().length;

  const pickOption = option => {
    if (config.isOptionDisabled(option)) return;
    const value = config.optionToValue(option);

    if (config.multiple) {
      setValue([..._value(), value]);
    } else {
      setValue(value);
      hideInput();
    }

    close();
  };

  const [inputIsHidden, setInputIsHidden] = createSignal(false);

  const showInput = () => setInputIsHidden(false);

  const hideInput = () => setInputIsHidden(true);

  const [isOpen, setIsOpen] = createSignal(false);

  const open = () => setIsOpen(true);

  const close = () => setIsOpen(false);

  const toggle = () => setIsOpen(!isOpen());

  const isDisabled = () => config.disabled;

  const [focusedOptionIndex, setFocusedOptionIndex] = createSignal(-1);

  const focusedOption = () => options()[focusedOptionIndex()];

  const isOptionFocused = option => option === focusedOption();

  const focusOption = direction => {
    if (!optionsCount()) setFocusedOptionIndex(-1);
    const max = optionsCount() - 1;
    const delta = direction === "next" ? 1 : -1;
    let index = focusedOptionIndex() + delta;

    if (index > max) {
      index = 0;
    }

    if (index < 0) {
      index = max;
    }

    setFocusedOptionIndex(index);
  };

  const focusPreviousOption = () => focusOption("previous");

  const focusNextOption = () => focusOption("next");

  createEffect(on(options, options => {
    if (isOpen()) setFocusedOptionIndex(Math.min(0, options.length - 1));
  }, {
    defer: true
  }));
  createEffect(on(isDisabled, isDisabled => {
    if (isDisabled && isOpen()) {
      close();
    }
  }));
  createEffect(on(isOpen, isOpen => {
    if (isOpen) {
      if (focusedOptionIndex() === -1) focusNextOption();
      showInput();
    } else {
      if (focusedOptionIndex() > -1) setFocusedOptionIndex(-1);
      clearInputValue();
    }
  }, {
    defer: true
  }));
  createEffect(on(focusedOptionIndex, focusedOptionIndex => {
    if (focusedOptionIndex > -1 && !isOpen()) {
      open();
    }
  }, {
    defer: true
  }));
  const refs = {
    containerRef: null,
    inputRef: null,
    listRef: null
  };

  const containerRef = element => {
    refs.containerRef = element;

    if (!element.getAttribute("tabIndex")) {
      element.tabIndex = -1;
    }

    element.addEventListener("focusin", () => {
      showInput();
    });
    element.addEventListener("focusout", event => {
      const target = event.relatedTarget;

      for (const relatedElement of Object.values(refs)) {
        if (relatedElement?.contains(target)) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
      }

      close();
    });
    element.addEventListener("pointerdown", event => {
      if (refs.inputRef && event.target !== refs.inputRef) {
        event.preventDefault();
      }
    });
    element.addEventListener("click", event => {
      if (!refs.listRef || !refs.listRef.contains(event.target)) {
        if (refs.inputRef) {
          refs.inputRef.focus();
        }

        toggle();
      }
    });
  };

  const inputRef = element => {
    refs.inputRef = element;

    if (!element.getAttribute("tabIndex")) {
      element.tabIndex = -1;
    }

    createRenderEffect(() => element.value = inputValue());
    element.addEventListener("input", event => {
      setInputValue(event.target.value);
    });
    createRenderEffect(() => {
      element.style.setProperty("opacity", inputIsHidden() ? "0" : "1");
    });
    element.addEventListener("focus", event => {
      if (config.onFocus) {
        config.onFocus(event);
      }
    });
    element.addEventListener("blur", event => {
      if (config.onBlur) {
        config.onBlur(event);
      }
    });
    element.addEventListener("keydown", event => {
      switch (event.key) {
        case "ArrowDown":
          focusNextOption();
          break;

        case "ArrowUp":
          focusPreviousOption();
          break;

        case "Enter":
          if (isOpen() && focusedOption()) {
            pickOption(focusedOption());
            break;
          }

          return;

        case "Escape":
          if (isOpen()) {
            close();
            break;
          }

          return;

        case "Delete":
        case "Backspace":
          if (inputValue()) {
            return;
          }

          if (config.multiple) {
            const currentValue = value();
            setValue([...currentValue.slice(0, -1)]);
          } else {
            clearValue();
          }

          break;

        case " ":
          if (inputValue()) {
            return;
          }

          if (!isOpen()) {
            open();
          } else {
            if (focusedOption()) {
              pickOption(focusedOption());
            }
          }

          break;

        case "Tab":
          if (focusedOption() && isOpen()) {
            pickOption(focusedOption());
            break;
          }

          return;

        default:
          return;
      }

      event.preventDefault();
      event.stopPropagation();
    });
  };

  const listRef = element => {
    refs.listRef = element;

    if (!element.getAttribute("tabIndex")) {
      element.tabIndex = -1;
    }

    element.addEventListener("pointerdown", event => {
      event.preventDefault();
      event.stopPropagation();
    });
  };

  return {
    get value() {
      return value();
    },

    get hasValue() {
      return hasValue();
    },

    setValue,

    get options() {
      return options();
    },

    get inputValue() {
      return inputValue();
    },

    get isOpen() {
      return isOpen();
    },

    multiple: config.multiple,

    get disabled() {
      return isDisabled();
    },

    pickOption,
    isOptionFocused,
    isOptionDisabled: config.isOptionDisabled,
    containerRef,
    inputRef,
    listRef
  };
};

const _tmpl$$c = /*#__PURE__*/template(`<div></div>`),
      _tmpl$2$8 = /*#__PURE__*/template(`<div class="solid-select-control"></div>`),
      _tmpl$3$6 = /*#__PURE__*/template(`<div class="solid-select-placeholder"></div>`),
      _tmpl$4$3 = /*#__PURE__*/template(`<div class="solid-select-single-value"></div>`),
      _tmpl$5$1 = /*#__PURE__*/template(`<div class="solid-select-multi-value"><button type="button" class="solid-select-multi-value-remove">⨯</button></div>`),
      _tmpl$6 = /*#__PURE__*/template(`<input class="solid-select-input" type="text" tabindex="0" autocomplete="off" autocapitalize="none" size="1">`),
      _tmpl$7 = /*#__PURE__*/template(`<div class="solid-select-list"></div>`),
      _tmpl$8 = /*#__PURE__*/template(`<div class="solid-select-list-placeholder"></div>`),
      _tmpl$9 = /*#__PURE__*/template(`<div class="solid-select-option"></div>`);

const Select = props => {
  const [selectProps, local] = splitProps(mergeProps({
    format: (data, type) => data,
    placeholder: "Select...",
    readonly: typeof props.options !== "function",
    loading: false,
    loadingPlaceholder: "Loading...",
    emptyPlaceholder: "No options"
  }, props), ["options", "optionToValue", "isOptionDisabled", "multiple", "disabled", "onInput", "onChange", "onBlur"]);
  const select = createSelect(selectProps);

  if (local.initialValue !== undefined) {
    createEffect(on(() => local.initialValue, value => select.setValue(value)));
  }

  return createComponent(Container, {
    get ["class"]() {
      return local.class;
    },

    ref(r$) {
      const _ref$ = select.containerRef;
      typeof _ref$ === "function" ? _ref$(r$) : select.containerRef = r$;
    },

    get disabled() {
      return select.disabled;
    },

    get children() {
      return [createComponent(Control, {
        get format() {
          return local.format;
        },

        get placeholder() {
          return local.placeholder;
        },

        get id() {
          return local.id;
        },

        get name() {
          return local.name;
        },

        get autofocus() {
          return local.autofocus;
        },

        get readonly() {
          return local.readonly;
        },

        get disabled() {
          return select.disabled;
        },

        get value() {
          return select.value;
        },

        get hasValue() {
          return select.hasValue;
        },

        get setValue() {
          return select.setValue;
        },

        get inputValue() {
          return select.inputValue;
        },

        get inputRef() {
          return select.inputRef;
        },

        get multiple() {
          return select.multiple;
        }

      }), createComponent(List, {
        ref(r$) {
          const _ref$2 = select.listRef;
          typeof _ref$2 === "function" ? _ref$2(r$) : select.listRef = r$;
        },

        get isOpen() {
          return select.isOpen;
        },

        get options() {
          return select.options;
        },

        get loading() {
          return local.loading;
        },

        get loadingPlaceholder() {
          return local.loadingPlaceholder;
        },

        get emptyPlaceholder() {
          return local.emptyPlaceholder;
        },

        children: option => createComponent(Option, {
          get isDisabled() {
            return select.isOptionDisabled(option);
          },

          get isFocused() {
            return select.isOptionFocused(option);
          },

          get pickOption() {
            return [select.pickOption, option];
          },

          get children() {
            return local.format(option, "option");
          }

        })
      })];
    }

  });
};

const Container = props => {
  return (() => {
    const _el$ = _tmpl$$c.cloneNode(true);

    const _ref$3 = props.ref;
    typeof _ref$3 === "function" ? _ref$3(_el$) : props.ref = _el$;

    insert(_el$, () => props.children);

    createRenderEffect(_p$ => {
      const _v$ = `solid-select-container ${props.class !== undefined ? props.class : ""}`,
            _v$2 = props.disabled;
      _v$ !== _p$._v$ && className(_el$, _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && setAttribute$1(_el$, "data-disabled", _p$._v$2 = _v$2);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined
    });

    return _el$;
  })();
};

const Control = props => {
  const removeValue = index => {
    const value = props.value;
    props.setValue([...value.slice(0, index), ...value.slice(index + 1)]);
  };

  return (() => {
    const _el$2 = _tmpl$2$8.cloneNode(true);

    insert(_el$2, createComponent(Show, {
      get when() {
        return !props.hasValue && !props.inputValue;
      },

      get children() {
        return createComponent(Placeholder, {
          get children() {
            return props.placeholder;
          }

        });
      }

    }), null);

    insert(_el$2, createComponent(Show, {
      get when() {
        return props.hasValue && !props.multiple && !props.inputValue;
      },

      get children() {
        return createComponent(SingleValue, {
          get children() {
            return props.format(props.value, "value");
          }

        });
      }

    }), null);

    insert(_el$2, createComponent(Show, {
      get when() {
        return props.hasValue && props.multiple;
      },

      get children() {
        return createComponent(For, {
          get each() {
            return props.value;
          },

          children: (value, index) => createComponent(MultiValue, {
            onRemove: () => removeValue(index()),

            get children() {
              return props.format(value, "value");
            }

          })
        });
      }

    }), null);

    insert(_el$2, createComponent(Input, {
      ref(r$) {
        const _ref$4 = props.inputRef;
        typeof _ref$4 === "function" ? _ref$4(r$) : props.inputRef = r$;
      },

      get id() {
        return props.id;
      },

      get name() {
        return props.name;
      },

      get autofocus() {
        return props.autofocus;
      },

      get disabled() {
        return props.disabled;
      },

      get readonly() {
        return props.readonly;
      }

    }), null);

    createRenderEffect(_p$ => {
      const _v$3 = props.multiple,
            _v$4 = props.hasValue,
            _v$5 = props.disabled;
      _v$3 !== _p$._v$3 && setAttribute$1(_el$2, "data-multiple", _p$._v$3 = _v$3);
      _v$4 !== _p$._v$4 && setAttribute$1(_el$2, "data-has-value", _p$._v$4 = _v$4);
      _v$5 !== _p$._v$5 && setAttribute$1(_el$2, "data-disabled", _p$._v$5 = _v$5);
      return _p$;
    }, {
      _v$3: undefined,
      _v$4: undefined,
      _v$5: undefined
    });

    return _el$2;
  })();
};

const Placeholder = props => {
  return (() => {
    const _el$3 = _tmpl$3$6.cloneNode(true);

    insert(_el$3, () => props.children);

    return _el$3;
  })();
};

const SingleValue = props => {
  return (() => {
    const _el$4 = _tmpl$4$3.cloneNode(true);

    insert(_el$4, () => props.children);

    return _el$4;
  })();
};

const MultiValue = props => {
  return (() => {
    const _el$5 = _tmpl$5$1.cloneNode(true),
          _el$6 = _el$5.firstChild;

    insert(_el$5, () => props.children, _el$6);

    _el$6.addEventListener("click", event => {
      event.stopPropagation();
      props.onRemove();
    });

    return _el$5;
  })();
};

const Input = props => {
  return (() => {
    const _el$7 = _tmpl$6.cloneNode(true);

    _el$7.$$keydown = event => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        event.target.blur();
      }
    };

    const _ref$5 = props.ref;
    typeof _ref$5 === "function" ? _ref$5(_el$7) : props.ref = _el$7;

    createRenderEffect(_p$ => {
      const _v$6 = props.id,
            _v$7 = props.name,
            _v$8 = props.autofocus,
            _v$9 = props.readonly,
            _v$10 = props.disabled;
      _v$6 !== _p$._v$6 && setAttribute$1(_el$7, "id", _p$._v$6 = _v$6);
      _v$7 !== _p$._v$7 && setAttribute$1(_el$7, "name", _p$._v$7 = _v$7);
      _v$8 !== _p$._v$8 && (_el$7.autofocus = _p$._v$8 = _v$8);
      _v$9 !== _p$._v$9 && (_el$7.readOnly = _p$._v$9 = _v$9);
      _v$10 !== _p$._v$10 && (_el$7.disabled = _p$._v$10 = _v$10);
      return _p$;
    }, {
      _v$6: undefined,
      _v$7: undefined,
      _v$8: undefined,
      _v$9: undefined,
      _v$10: undefined
    });

    return _el$7;
  })();
};

const List = props => {
  return createComponent(Show, {
    get when() {
      return props.isOpen;
    },

    get children() {
      const _el$8 = _tmpl$7.cloneNode(true);

      const _ref$6 = props.ref;
      typeof _ref$6 === "function" ? _ref$6(_el$8) : props.ref = _el$8;

      insert(_el$8, createComponent(Show, {
        get when() {
          return !props.loading;
        },

        get fallback() {
          return (() => {
            const _el$9 = _tmpl$8.cloneNode(true);

            insert(_el$9, () => props.loadingPlaceholder);

            return _el$9;
          })();
        },

        get children() {
          return createComponent(For, {
            get each() {
              return props.options;
            },

            get fallback() {
              return (() => {
                const _el$10 = _tmpl$8.cloneNode(true);

                insert(_el$10, () => props.emptyPlaceholder);

                return _el$10;
              })();
            },

            get children() {
              return props.children;
            }

          });
        }

      }));

      return _el$8;
    }

  });
};

const Option = props => {
  const scrollIntoViewOnFocus = element => {
    createEffect(() => {
      if (props.isFocused) {
        element.scrollIntoView({
          block: "nearest"
        });
      }
    });
  };

  return (() => {
    const _el$11 = _tmpl$9.cloneNode(true);

    addEventListener(_el$11, "click", props.pickOption, true);

    scrollIntoViewOnFocus(_el$11);

    insert(_el$11, () => props.children);

    createRenderEffect(_p$ => {
      const _v$11 = props.isDisabled,
            _v$12 = props.isFocused;
      _v$11 !== _p$._v$11 && setAttribute$1(_el$11, "data-disabled", _p$._v$11 = _v$11);
      _v$12 !== _p$._v$12 && setAttribute$1(_el$11, "data-focused", _p$._v$12 = _v$12);
      return _p$;
    }, {
      _v$11: undefined,
      _v$12: undefined
    });

    return _el$11;
  })();
};

delegateEvents(["keydown", "click"]);

var styles$7 = /* #__PURE__ */ (() => ".solid-select-container[data-disabled=true]{pointer-events:none}.solid-select-container{position:relative}.solid-select-control[data-disabled=true]{--tw-bg-opacity: 1;background-color:rgba(243,244,246,var(--tw-bg-opacity));--tw-border-opacity: 1;border-color:rgba(209,213,219,var(--tw-border-opacity))}.solid-select-control{--tw-border-opacity: 1;border-color:rgba(229,231,235,var(--tw-border-opacity));border-radius:.25rem;border-width:1px;display:-ms-grid;display:grid;line-height:1.5;padding:.25rem .5rem;grid-template-columns:repeat(1,minmax(0,1fr))}.solid-select-control[data-multiple=true][data-has-value=true]{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-ms-flex-wrap:wrap;-webkit-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-align:stretch;-ms-flex-align:stretch;-webkit-align-items:stretch;align-items:stretch;grid-gap:.25rem;gap:.25rem}.solid-select-control:focus-within{outline-offset:2px}.solid-select-placeholder{--tw-text-opacity: 1;color:rgba(156,163,175,var(--tw-text-opacity));grid-column-start:1;grid-row-start:1}.solid-select-single-value{grid-column-start:1;grid-row-start:1}.solid-select-multi-value{--tw-bg-opacity: 1;background-color:rgba(243,244,246,var(--tw-bg-opacity));border-radius:.25rem;display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center;font-size:85%;line-height:1;line-height:inherit;padding-left:4px;padding-right:4px}.solid-select-multi-value-remove{padding-left:.25rem;padding-right:.25rem}.solid-select-multi-value-remove:hover{text-shadow:1px 1px 3px rgb(0 0 0 / 29%),2px 4px 7px rgb(73 64 125 / 35%)}.solid-select-input{background-color:transparent;border-width:0px;-webkit-box-flex:1;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%;margin:0;outline:2px solid transparent;outline-offset:2px;padding:0;grid-column-start:1;grid-row-start:1;font:inherit}.solid-select-input:read-only{cursor:default}.solid-select-list{background-color:inherit;border-radius:.125rem;margin-top:.25rem;max-height:50vh;overflow-y:auto;padding:.5rem;position:absolute;--tw-shadow: 0 10px 15px -3px rgb(0 0 0/.1),0 4px 6px -4px rgb(0 0 0/.1);--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color);-webkit-box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);white-space:nowrap;z-index:1}.solid-select-option:hover{--tw-bg-opacity: 1;background-color:rgba(229,231,235,var(--tw-bg-opacity))}.solid-select-option[data-focused=true]{--tw-bg-opacity: 1}.solid-select-option>mark{--tw-bg-opacity: 1;background-color:rgba(unset,var(--tw-bg-opacity));--tw-text-opacity: 1;color:rgba(unset,var(--tw-text-opacity));-webkit-text-decoration-line:underline;text-decoration-line:underline}.solid-select-option{cursor:default;padding:.5rem .8rem;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.solid-select-option[data-disabled=true]{pointer-events:none;--tw-text-opacity: 1;color:rgba(156,163,175,var(--tw-text-opacity))}.solid-select-list-placeholder{cursor:default;padding:.5rem 1rem;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.blur{--tw-blur: blur(8px)}.am_rec_custom.solid-select-container{color:#3e4042;background:#fff;border:1px solid #E3E3E3;box-shadow:0 1px #0000000d;border-radius:4px;height:36px;position:static;cursor:pointer}.am_rec_custom.solid-select-container .solid-select-input{height:36px;line-height:1;border:none;background:none}.am_rec_custom.solid-select-container .solid-select-input:focus-visible{box-shadow:none}.am_rec_custom.solid-select-container .solid-select-input:focus{border:none}.am_rec_custom .solid-select-control{height:36px;padding:0 16px;font-size:14px;position:relative}.am_rec_custom .solid-select-control:after{content:\"\";height:12px;width:8px;position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:12px;background:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDggMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNCAxMkwwIDhIOEw0IDEyWk00IDBMOCA0SDBMNCAwWiIgZmlsbD0iIzVDNUY2MiIvPgo8L3N2Zz4K) center center no-repeat;background-size:contain}.am_rec_custom .solid-select-placeholder{color:#3e4042;height:20px;padding:8px 0}.am_rec_custom .solid-select-single-value{line-height:36px}.am_rec_custom .solid-select-option{font-weight:400;font-size:14px;color:#202223;border-radius:4px;cursor:pointer;line-height:1.5;height:36px!important;padding:8px;margin:0 0 0 5px}.am_rec_custom .solid-select-option:hover{background-color:#f2f7fe;position:relative}.am_rec_custom .solid-select-option:hover:before{content:\"\";height:36px;width:3px;border-radius:0 4px 4px 0;background:#2C6ECB;position:absolute;left:-10px;top:0;display:block}.am_rec_custom .solid-select-list{box-shadow:0 0 2px #0003,0 2px 10px #0000001a;border-radius:8px;width:280px}@media screen and (max-width: 600px){.am_rec_custom .solid-select-list{width:calc(100vw - 42px)}}.am_rec_custom .solid-select-option[data-disabled=true]{background:#FAFBFB;color:#8c9196}\n")();

var SceneEnum = /* @__PURE__ */ ((SceneEnum2) => {
  SceneEnum2["Cart"] = "Cart";
  SceneEnum2["Checkout"] = "Checkout";
  SceneEnum2["Others"] = "Others";
  SceneEnum2["Purchase"] = "Purchase";
  SceneEnum2["UpsellCheckout"] = "UpsellCheckout";
  SceneEnum2["UpsellHome"] = "UpsellHome";
  SceneEnum2["UpsellProduct"] = "UpsellProduct";
  SceneEnum2["UpsellThankYou"] = "UpsellThankYou";
  return SceneEnum2;
})(SceneEnum || {});
var WidgetTypeEnum = /* @__PURE__ */ ((WidgetTypeEnum2) => {
  WidgetTypeEnum2["CartDrawer"] = "CartDrawer";
  WidgetTypeEnum2["FreeShipping"] = "FreeShipping";
  WidgetTypeEnum2["SmartOffer"] = "SmartOffer";
  return WidgetTypeEnum2;
})(WidgetTypeEnum || {});

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native = {
  randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }

  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return unsafeStringify(rnds);
}

({
  [WidgetTypeEnum.CartDrawer]: "https://www.aftership.com/personalization?utm_source=automizely_personalization&utm_medium=referral&utm_content=poweredby_cart_drawer",
  [SceneEnum.Cart]: "https://www.aftership.com/personalization?utm_source=automizely_personalization&utm_medium=referral&utm_content=poweredby_cart_page",
  [SceneEnum.Purchase]: "https://www.aftership.com/personalization?utm_source=automizely_personalization&utm_medium=referral&utm_content=poweredby_post_purchase",
  [SceneEnum.UpsellHome]: "https://www.aftership.com/personalization?utm_source=automizely_personalization&utm_medium=referral&utm_content=poweredby_home_page",
  [SceneEnum.UpsellProduct]: "https://www.aftership.com/personalization?utm_source=automizely_personalization&utm_medium=referral&utm_content=poweredby_product_page",
  [SceneEnum.UpsellThankYou]: "https://www.aftership.com/personalization?utm_source=automizely_personalization&utm_medium=referral&utm_content=poweredby_thank_you_page"
});

const getElementOffsetTop = (element) => {
  let actualTop = element.offsetTop;
  let current = element.offsetParent;
  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }
  return actualTop;
};
const getFooterElement = (id) => {
  if (id) {
    return document.getElementById(id);
  }
  const idEl = document.getElementById("shopify-section-footer");
  if (idEl) {
    return idEl;
  }
  const [classEl] = Array.from(document.getElementsByClassName("main__footer"));
  if (classEl) {
    return classEl;
  }
  const [tagEl] = Array.from(document.getElementsByTagName("footer"));
  return tagEl;
};

const Dropdown = props => {
  const disabledOptions = props.disabledOptions || [];
  const configStyles = styles$7 + `.am_rec_custom .solid-select-placeholder {
		font-family: ${props.fontFamily};
	  }`;
  onMount(() => {
    // handel dropdown position
    const containers = document.querySelectorAll('.am_rec_custom.solid-select-container');
    Array.from(containers)?.forEach(container => {
      container.addEventListener('click', () => {
        const listDom = container?.getElementsByClassName('solid-select-list')[0];
        const {
          bottom
        } = container.getBoundingClientRect();
        const modalRootDom = document.getElementsByClassName('am_rec_modal')[0];
        const {
          top: containerTop,
          height
        } = modalRootDom.getBoundingClientRect();
        const selectContainerTop = getElementOffsetTop(container);
        const modalContainerTop = getElementOffsetTop(modalRootDom);

        if (isSmallScreen() || props.isMobile) {
          if (listDom && modalRootDom) {
            listDom.setAttribute('style', `
							bottom: ${height - (selectContainerTop - modalContainerTop) + 5}px;
						`);
          }
        } else {
          if (listDom && containerTop) {
            listDom.setAttribute('style', `
							top: ${bottom - containerTop}px;
						`);
          }
        }
      });
    });
  });
  return createComponent(StyleComponent, {
    styles: configStyles,

    get children() {
      return createComponent(Select, {
        "class": "am_rec_custom",

        get options() {
          return props.options;
        },

        isOptionDisabled: option => disabledOptions.includes(option),
        onChange: value => props.handleSelect(value),
        placeholder: 'select...',

        get initialValue() {
          return props.selected;
        }

      });
    }

  });
};

const _tmpl$$b = /*#__PURE__*/template(`<div class="am_rec_skuSelector"></div>`),
      _tmpl$2$7 = /*#__PURE__*/template(`<ul class="am_rec_sku-list"></ul>`),
      _tmpl$3$5 = /*#__PURE__*/template(`<div><div class="am_rec_sku-title"></div></div>`),
      _tmpl$4$2 = /*#__PURE__*/template(`<li></li>`);

const SKUSelector = props => {
  const globalState = useGlobalState();
  const [state, setState] = createStore({
    type: props.settings?.content.action_button?.product_variant_picker_type || 'button',
    selectedSku: {},
    skuAttrs: [],
    skuList: []
  });
  const [customStyle, setCustomStyle] = createSignal({});
  const [activeCustomStyle, setActiveCustomStyle] = createSignal({});
  const autoStyle = globalState.style;

  const getFirstAvailableVariant = () => {
    try {
      const firstAvailableVariant = props.productInfo?.variants?.filter(item => item?.available)[0];
      if (!firstAvailableVariant || !firstAvailableVariant?.options?.length) return {};
      const data = firstAvailableVariant.options.reduce((pre, cur) => {
        return { ...pre,
          [cur.name]: cur.value
        };
      }, {});
      props.handleSelect(data);
      return data;
    } catch (error) {
      console.log(error, 'error');
      return {};
    }
  };

  createMemo(() => {
    setState({
      skuAttrs: props.productInfo?.options,
      skuList: props.productInfo?.variants?.map(product => {
        return {
          skuId: product?.external_id,
          available: product?.available,
          price: product?.price,
          skuInfo: product?.options
        };
      }),
      selectedSku: getFirstAvailableVariant()
    });
  }, props.productInfo);

  const onSelectSku = (attrKey, optValue) => {
    setState('selectedSku', { ...state.selectedSku,
      [attrKey]: state.selectedSku[attrKey] === optValue && props.type === 'button' ? '' : optValue
    });
    props.handleSelect(state.selectedSku);
  };

  const isSkuValid = (attrKey, optValue) => {
    // 先假设当前属性值已选中，拼入已选对象里
    const tempSelectedSku = { ...state.selectedSku,
      [attrKey]: optValue
    }; // 过滤出已选对象中属性值不为空的

    const skuToBeChecked = Object.keys(tempSelectedSku).filter(key => tempSelectedSku[key] !== ''); // 在skuList里找到所有包含已选择属性的sku且库存>0的sku

    const filteredSkuList = state.skuList.filter(sku => skuToBeChecked.every(skuKey => {
      const curItem = sku.skuInfo.find(item => item.name === skuKey)?.value;
      return tempSelectedSku[skuKey] === curItem && sku.available;
    }));
    return filteredSkuList.length > 0;
  };

  createMemo(() => {
    setActiveCustomStyle(`
			color: ${autoStyle?.button?.color ?? props.settings?.color?.action_button_text} !important;
			background: ${autoStyle?.button?.background ?? props.settings?.color?.action_button_background} !important;
			border: ${autoStyle?.button?.border ?? `1px solid ${props.settings?.color?.action_button_background}`};
			font-weight: ${autoStyle?.button?.fontWeight ?? ''};
		`);
  }, [state.selectedSku, props.settings]);
  onMount(() => {
    setCustomStyle({
      color: props.settings?.color?.product_name
    });
  });
  return createComponent(StyleComponent, {
    styles: styles$9,

    get children() {
      const _el$ = _tmpl$$b.cloneNode(true);

      insert(_el$, createComponent(For, {
        get each() {
          return state.skuAttrs;
        },

        children: attr => {
          return (() => {
            const _el$2 = _tmpl$3$5.cloneNode(true),
                  _el$3 = _el$2.firstChild;

            insert(_el$3, () => attr.name);

            insert(_el$2, createComponent(Switch, {
              get children() {
                return [createComponent(Match, {
                  get when() {
                    return state.type === 'dropdown';
                  },

                  get children() {
                    return createComponent(Dropdown, {
                      get options() {
                        return attr.values || [];
                      },

                      get disabledOptions() {
                        return attr.values?.filter(opt => !isSkuValid(attr?.name || '', opt));
                      },

                      handleSelect: value => onSelectSku(attr?.name || '', value),

                      get selected() {
                        return state.selectedSku[attr?.name || ''] || '';
                      },

                      get fontFamily() {
                        return props.settings?.font.product_info_text_font_family;
                      },

                      get isMobile() {
                        return props.isMobile;
                      }

                    });
                  }

                }), createComponent(Match, {
                  get when() {
                    return state.type === 'button';
                  },

                  get children() {
                    const _el$4 = _tmpl$2$7.cloneNode(true);

                    insert(_el$4, createComponent(For, {
                      get each() {
                        return attr.values;
                      },

                      children: opt => (() => {
                        const _el$5 = _tmpl$4$2.cloneNode(true);

                        insert(_el$5, createComponent(Button, {
                          get disabled() {
                            return !isSkuValid(attr?.name || '', opt);
                          },

                          onClick: () => onSelectSku(attr?.name || '', opt),

                          get size() {
                            return Number(opt) ? 'small' : 'medium';
                          },

                          text: opt,

                          get customStyle() {
                            return memo(() => opt === state.selectedSku[attr?.name || ''], true)() ? activeCustomStyle() : customStyle();
                          }

                        }));

                        createRenderEffect(() => className(_el$5, `am_rec_sku--item ${opt === state.selectedSku[attr?.name || ''] ? 'am_rec_sku--item--active' : ''}`));

                        return _el$5;
                      })()
                    }));

                    return _el$4;
                  }

                })];
              }

            }), null);

            createRenderEffect(() => _el$3.style.setProperty("font-family", props.settings?.font.product_info_text_font_family));

            return _el$2;
          })();
        }
      }));

      return _el$;
    }

  });
};

var styles$6 = /* #__PURE__ */ (() => ".shopify-payment-button__button{font-family:inherit;min-height:4.6rem;width:100%}.shopify-payment-button__button [role=button].focused,.no-js .shopify-payment-button__button [role=button]:focus{outline:.2rem solid rgba(var(--color-foreground),.5)!important;outline-offset:.3rem;box-shadow:0 0 0 .1rem rgba(var(--color-button),var(--alpha-button-border)),0 0 0 .3rem rgb(var(--color-background)),0 0 .5rem .4rem rgba(var(--color-foreground),.3)!important}.shopify-payment-button__button [role=button]:focus:not(:focus-visible){outline:0;box-shadow:none!important}.shopify-payment-button__button [role=button]:focus-visible{outline:.2rem solid rgba(var(--color-foreground),.5)!important;box-shadow:0 0 0 .1rem rgba(var(--color-button),var(--alpha-button-border)),0 0 0 .3rem rgb(var(--color-background)),0 0 .5rem .4rem rgba(var(--color-foreground),.3)!important}.shopify-payment-button__button--unbranded{background-color:rgba(var(--color-button),var(--alpha-button-background));color:rgb(var(--color-button-text));font-size:1.4rem;line-height:calc(1 + .2 / var(--font-body-scale));letter-spacing:.07rem}.shopify-payment-button__button--unbranded::selection{background-color:rgba(var(--color-button-text),.3)}.shopify-payment-button__button--unbranded:hover,.shopify-payment-button__button--unbranded:hover:not([disabled]){background-color:rgba(var(--color-button),var(--alpha-button-background))}.shopify-payment-button__more-options{margin:1.6rem 0 1rem;font-size:1.2rem;line-height:calc(1 + .5 / var(--font-body-scale));letter-spacing:.05rem;text-decoration:underline;text-underline-offset:.3rem}.shopify-payment-button__button--hidden{display:none}\n")();

const _tmpl$$a = /*#__PURE__*/template(`<div data-shopify="payment-button" data-has-selling-plan="false" data-has-fixed-selling-plan="false" class="shopify-payment-button"><div class="shopify-cleanslate"></div><button type="button" class="buy-now-btn shopify-payment-button__button shopify-payment-button__button--unbranded am_rec_payment _2ogcW-Q9I-rgsSkNbRiJzA _2EiMjnumZ6FVtlC7RViKtj _2-dUletcCZ2ZL1aaH0GXxT" data-testid="Checkout-button"></button></div>`);

const ShopifyDynamicButton = props => {
  const customStyle = `
		.shopify-payment-button__button--unbranded.am_rec_payment {
			background-color: ${props.settings?.color.action_button_background};
			color: ${props.settings?.color.action_button_text};
			border-color: ${props.settings?.color?.action_button_background};
			font-family: ${props.settings?.font.product_info_text_font_family};
			width: 100%;
			border-radius: 8px
		}
	`;
  return createComponent(StyleComponent, {
    styles: `${styles$6} ${customStyle}`,

    get children() {
      const _el$ = _tmpl$$a.cloneNode(true),
            _el$2 = _el$.firstChild,
            _el$3 = _el$2.nextSibling;

      _el$3.$$click = e => goToCheckoutUrl(props.variantId, props.currency, props.campaignId, props.productId, props.productUrl);

      insert(_el$3, () => props.buttonText ?? 'buy it now');

      return _el$;
    }

  });
};

delegateEvents(["click"]);

var styles$5 = /* #__PURE__ */ (() => ".am_loader{display:block;position:absolute;width:20px;height:20px;border:2px solid white;border-top-color:transparent!important;border-radius:100%;left:calc(50% - 10px);top:calc(50% - 10px);animation:loadingRotate 1.2s linear infinite}@keyframes loadingRotate{0%{-webkit-transform:rotate(0deg)}to{-webkit-transform:rotate(360deg)}}\n")();

const _tmpl$$9 = /*#__PURE__*/template(`<span class="am_loader"></span>`);

const Loader = props => {
  return createComponent(StyleComponent, {
    styles: styles$5,

    get children() {
      const _el$ = _tmpl$$9.cloneNode(true);

      createRenderEffect(_p$ => {
        const _v$ = props.color ?? '#fff',
              _v$2 = props.size ?? '20px',
              _v$3 = props.size ?? '20px';

        _v$ !== _p$._v$ && _el$.style.setProperty("border-color", _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && _el$.style.setProperty("width", _p$._v$2 = _v$2);
        _v$3 !== _p$._v$3 && _el$.style.setProperty("height", _p$._v$3 = _v$3);
        return _p$;
      }, {
        _v$: undefined,
        _v$2: undefined,
        _v$3: undefined
      });

      return _el$;
    }

  });
};

var failIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMCAyMEMxNS41MTQgMjAgMjAgMTUuNTE0IDIwIDEwQzIwIDQuNDg2IDE1LjUxNCAtNC44MjA0OWUtMDcgMTAgMEM0LjQ4NiA0LjgyMDQ5ZS0wNyAtNC44MjA0OWUtMDcgNC40ODYgMCAxMEM0LjgyMDQ5ZS0wNyAxNS41MTQgNC40ODYgMjAgMTAgMjBaTTExIDE0QzExIDE0LjU1MjMgMTAuNTUyMyAxNSAxMCAxNUM5LjQ0NzcxIDE1IDkgMTQuNTUyMyA5IDE0VjEwQzkgOS40NDc3MiA5LjQ0NzcxIDkgMTAgOUMxMC41NTIzIDkgMTEgOS40NDc3MiAxMSAxMFYxNFpNMTAgNUM5LjQ0NzcxIDUgOSA1LjQ0NzcxIDkgNkM5IDYuNTUyMjkgOS40NDc3MSA3IDEwIDdDMTAuNTUyMyA3IDExIDYuNTUyMjkgMTEgNkMxMSA1LjQ0NzcxIDEwLjU1MjMgNSAxMCA1WiIgZmlsbD0iI0Q3MkMwRCIvPgo8L3N2Zz4K";

const _tmpl$$8 = /*#__PURE__*/template(`<del class="origin"></del>`),
      _tmpl$2$6 = /*#__PURE__*/template(`<span></span>`),
      _tmpl$3$4 = /*#__PURE__*/template(`<div class="add_to_cart_status"><img alt="fail"><span></span></div>`),
      _tmpl$4$1 = /*#__PURE__*/template(`<div class="am_rec_button-action"></div>`),
      _tmpl$5 = /*#__PURE__*/template(`<div><div><p class="am_rec_product-name"></p><div><span class="current"></span></div></div><div></div></div>`);

const ProductInfo = props => {
  const globalState = useGlobalState();
  const [state, setState] = createStore({
    product_title: props.productInfo?.title || '',
    price: props.productInfo?.price || '',
    comparePrice: props.productInfo?.compareAtPrice || '',
    showComparePrice: props.settings?.content.show_compare_at_price,
    currency: props.productInfo?.currency,
    variantPickerType: props.settings?.content.action_button?.product_variant_picker_type,
    buttonType: props.settings?.content.action_button?.button_type,
    buttonText: props.settings?.content.action_button?.text,
    showButton: props.settings?.content.action_button?.enabled,
    selectedVariantId: '',
    productId: props.productInfo?.externalId || '',
    productUrl: props.productInfo?.productUrl || '',
    loading: false
  });
  const autoStyle = globalState.style;
  const [customStyle, setCustomStyle] = createSignal({});
  const [errorDescription, setErrorDescription] = createSignal('');
  createMemo(() => {
    setCustomStyle(`
				color: ${autoStyle?.button?.color ?? props.settings?.color?.action_button_text} !important;
				background: ${autoStyle?.button?.background ?? props.settings?.color?.action_button_background} !important;
				border: ${autoStyle?.button?.border ?? `1px solid ${props.settings?.color?.action_button_background}`};
				font-weight: ${autoStyle?.button?.fontWeight ?? ''};
				border-radius: ${autoStyle?.button?.borderRadius ?? ''};
			`);
  }, props.settings);

  const getSelectedVariantId = selectedSku => {
    const totalOptionCount = props.productInfo?.variants?.[0]?.options?.length || 0;
    const selectedKeys = Object.keys(selectedSku);
    let vls = Object.values(selectedSku);
    vls && (vls = vls.filter(item => item));
    const selectedOptionCount = vls?.length;

    if (selectedOptionCount < totalOptionCount) {
      console.error('not select all sku');
    }

    const allSku = props.productInfo?.variants?.map(variant => {
      return {
        variantId: variant?.external_id,
        sku: variant?.options?.reduce((pre, cur) => {
          return { ...pre,
            [cur.name]: cur.value
          };
        }, {})
      };
    });
    const selectedItem = allSku?.find(item => {
      let match = true;
      selectedKeys.forEach(key => {
        if (selectedSku[key] !== item.sku[key]) {
          return match = false;
        }
      });

      if (match) {
        return item;
      }
    });
    return selectedItem?.variantId;
  };

  createEffect(() => {
    const selectedVariant = props.productInfo?.variants?.find(variant => variant?.external_id === state.selectedVariantId);

    if (selectedVariant) {
      setState({
        price: selectedVariant.price?.amount || state.price,
        comparePrice: selectedVariant.compare_at_price?.amount || state.comparePrice
      });

      if (props.getCurrentVariantImageUrl && selectedVariant.image_url) {
        props.getCurrentVariantImageUrl(selectedVariant.image_url);
      }
    }
  }, [state.selectedVariantId]);
  return createComponent(StyleComponent, {
    styles: styles$a,

    get children() {
      const _el$ = _tmpl$5.cloneNode(true),
            _el$2 = _el$.firstChild,
            _el$3 = _el$2.firstChild,
            _el$4 = _el$3.nextSibling,
            _el$5 = _el$4.firstChild,
            _el$7 = _el$2.nextSibling;

      insert(_el$3, () => state.product_title);

      insert(_el$5, () => formatLocalPrice(Number(state.price)));

      insert(_el$4, createComponent(Show, {
        get when() {
          return memo(() => !!(state.showComparePrice && state.comparePrice > 0), true)() && Number(state.comparePrice) !== Number(state.price);
        },

        get children() {
          const _el$6 = _tmpl$$8.cloneNode(true);

          insert(_el$6, () => formatLocalPrice(Number(state.comparePrice)));

          createRenderEffect(_p$ => {
            const _v$ = autoStyle?.price?.color ?? props.settings?.color.compare_at_price,
                  _v$2 = props.settings?.font.product_info_text_font_family,
                  _v$3 = autoStyle?.price?.color ? 0.5 : 1;

            _v$ !== _p$._v$ && _el$6.style.setProperty("color", _p$._v$ = _v$);
            _v$2 !== _p$._v$2 && _el$6.style.setProperty("font-family", _p$._v$2 = _v$2);
            _v$3 !== _p$._v$3 && _el$6.style.setProperty("opacity", _p$._v$3 = _v$3);
            return _p$;
          }, {
            _v$: undefined,
            _v$2: undefined,
            _v$3: undefined
          });

          return _el$6;
        }

      }), null);

      insert(_el$7, createComponent(SKUSelector, {
        get type() {
          return state.variantPickerType || 'button';
        },

        get productInfo() {
          return props.productInfo;
        },

        handleSelect: selectedSku => {
          const variantId = getSelectedVariantId(selectedSku);
          setState({
            selectedVariantId: variantId || ''
          });
        },

        get settings() {
          return props.settings;
        },

        get isMobile() {
          return props.isMobile;
        }

      }));

      insert(_el$, createComponent(Show, {
        get when() {
          return state.showButton;
        },

        get children() {
          const _el$8 = _tmpl$4$1.cloneNode(true);

          insert(_el$8, createComponent(Switch, {
            get children() {
              return [createComponent(Match, {
                get when() {
                  return state.buttonType === ButtonType.AddToCart;
                },

                get children() {
                  return [createComponent(Button, {
                    size: "large",
                    type: "default",

                    get customStyle() {
                      return customStyle();
                    },

                    onClick: () => {
                      if (state.loading) return;
                      setState({
                        loading: true
                      });
                      handleAddToCart({
                        campaignId: props.campaignId,
                        traceId: globalState.traceId,
                        variantId: state.selectedVariantId,
                        productId: state.productId,
                        productUrl: state.productUrl,
                        cb: () => {
                          setErrorDescription('');
                          setState({
                            loading: false
                          });
                          props.close();
                          document.body.setAttribute('style', 'overflow-y: auto');

                          if (state.buttonType === ButtonType.AddToCart && props.settings?.content.action_button?.button_action === ButtonActionType.GoCartPage) {
                            location.href = '/cart';
                          }

                          const {
                            pathname
                          } = new URL(location.href);
                          const [, path] = pathname.split('/');

                          if (['cart'].includes(path)) {
                            window.location.reload();
                          }
                        },
                        errorCallback: error => {
                          setState({
                            loading: false
                          });
                          const message = error.name === 'TypeError' ? 'Network error. Please try again' : error.message;
                          setErrorDescription(message);
                        }
                      });
                    },

                    get children() {
                      return [createComponent(Show, {
                        get when() {
                          return state.loading;
                        },

                        get children() {
                          return createComponent(Loader, {
                            get color() {
                              return autoStyle?.button?.color;
                            }

                          });
                        }

                      }), createComponent(Show, {
                        get when() {
                          return !state.loading;
                        },

                        get children() {
                          const _el$9 = _tmpl$2$6.cloneNode(true);

                          insert(_el$9, () => state.buttonText);

                          return _el$9;
                        }

                      })];
                    }

                  }), createComponent(Show, {
                    get when() {
                      return Boolean(errorDescription());
                    },

                    get children() {
                      const _el$10 = _tmpl$3$4.cloneNode(true),
                            _el$11 = _el$10.firstChild,
                            _el$12 = _el$11.nextSibling;

                      setAttribute$1(_el$11, "src", failIcon);

                      insert(_el$12, errorDescription);

                      return _el$10;
                    }

                  })];
                }

              }), createComponent(Match, {
                get when() {
                  return state.buttonType === ButtonType.DynamicCheckout;
                },

                get children() {
                  return createComponent(ShopifyDynamicButton, {
                    get variantId() {
                      return state.selectedVariantId;
                    },

                    get currency() {
                      return state.currency || '';
                    },

                    get buttonText() {
                      return state.buttonText;
                    },

                    get campaignId() {
                      return props.campaignId;
                    },

                    get productId() {
                      return state.productId;
                    },

                    get productUrl() {
                      return state.productUrl;
                    },

                    get settings() {
                      return props.settings;
                    }

                  });
                }

              })];
            }

          }));

          return _el$8;
        }

      }), null);

      createRenderEffect(_p$ => {
        const _v$4 = `am_rec_mobileVariantPicker ${props.isMobile ? '' : 'desktop'}`,
              _v$5 = `am_rec_variantPicker-header ${props.isMobile ? 'mobile' : ''}`,
              _v$6 = autoStyle?.productName?.color ?? props.settings?.color.product_name,
              _v$7 = props.settings?.font.heading_text_font_family,
              _v$8 = props.settings?.font.heading_text_font_size,
              _v$9 = autoStyle?.productName?.fontWeight,
              _v$10 = `am_rec_price ${props.isMobile ? 'mobile' : ''}`,
              _v$11 = autoStyle?.price?.color ?? props.settings?.color.product_price,
              _v$12 = props.settings?.font.product_info_text_font_family,
              _v$13 = autoStyle?.price?.fontWeight,
              _v$14 = `am_rec_skuList ${props.isMobile ? 'mobile' : ''}`;

        _v$4 !== _p$._v$4 && className(_el$, _p$._v$4 = _v$4);
        _v$5 !== _p$._v$5 && className(_el$2, _p$._v$5 = _v$5);
        _v$6 !== _p$._v$6 && _el$3.style.setProperty("color", _p$._v$6 = _v$6);
        _v$7 !== _p$._v$7 && _el$3.style.setProperty("font-family", _p$._v$7 = _v$7);
        _v$8 !== _p$._v$8 && _el$3.style.setProperty("font-size", _p$._v$8 = _v$8);
        _v$9 !== _p$._v$9 && _el$3.style.setProperty("font-weight", _p$._v$9 = _v$9);
        _v$10 !== _p$._v$10 && className(_el$4, _p$._v$10 = _v$10);
        _v$11 !== _p$._v$11 && _el$5.style.setProperty("color", _p$._v$11 = _v$11);
        _v$12 !== _p$._v$12 && _el$5.style.setProperty("font-family", _p$._v$12 = _v$12);
        _v$13 !== _p$._v$13 && _el$5.style.setProperty("font-weight", _p$._v$13 = _v$13);
        _v$14 !== _p$._v$14 && className(_el$7, _p$._v$14 = _v$14);
        return _p$;
      }, {
        _v$4: undefined,
        _v$5: undefined,
        _v$6: undefined,
        _v$7: undefined,
        _v$8: undefined,
        _v$9: undefined,
        _v$10: undefined,
        _v$11: undefined,
        _v$12: undefined,
        _v$13: undefined,
        _v$14: undefined
      });

      return _el$;
    }

  });
};

var styles$4 = /* #__PURE__ */ (() => ".am_rec_imageGallery{width:280px}.am_thumbnails_container{margin-top:10px;max-width:280px;overflow-x:hidden;flex-direction:row;display:flex;padding:0}.am_thumbnails_container .splide__slide{width:48px!important;height:48px;margin-right:10px;cursor:pointer;border:1px solid #FAFBFC;overflow:hidden;padding:1px}.am_thumbnails_container .splide__slide>div{height:100%}.am_thumbnails_container .splide__slide.is-active{border-color:#8c9196}.am_rec_imageGallery .splide__arrow{background:rgba(33,43,54,.8)!important;border-radius:4px;width:24px;height:24px;min-width:24px}.am_rec_imageGallery .splide__arrow--next{right:4px}.am_rec_imageGallery .splide__arrow--prev{left:4px}.am_rec_imageGallery .splide__arrow svg{fill:#fff;width:14px!important;height:14px!important}.am_rec_imageGallery .splide__arrow:disabled{display:none!important}.am_thumbnails_container .splide--slide .splide__arrow:disabled{display:none!important}.splide__arrow{transition:opacity .3s ease-in-out}\n")();

var styles$3 = /* #__PURE__ */ (() => ".am_thumbnail--itemContainer{position:relative;height:100%}.am_thumbnail--itemContainer--image{display:flex;height:100%}.am_thumbnail--itemContainer--image>img{object-fit:contain;width:100%;height:100%}.am_thumbnail--itemContainer--player{position:absolute;top:50%;left:50%;width:20px;height:20px;margin-left:-10px;margin-top:-10px}\n")();

const _tmpl$$7 = /*#__PURE__*/template(`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 20c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm-2-13.138v6.276a.5.5 0 0 0 .748.434l5.492-3.138a.5.5 0 0 0 0-.868l-5.492-3.139a.5.5 0 0 0-.748.435z"></path></svg>`);

const PlayCircleMajor = props => {
  return (// <svg fill={props.color} class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9425" width="200" height="200"><path d="M512 24C242.48 24 24 242.48 24 512s218.48 488 488 488 488-218.48 488-488S781.52 24 512 24z m198.992 538.688L449.92 713.408c-48.288 27.872-87.792 5.072-87.792-50.688V361.28c0-55.76 39.504-78.56 87.792-50.688l261.072 150.72c48.288 27.872 48.288 73.504 0 101.376z" p-id="9426"></path></svg>
    (() => {
      const _el$ = _tmpl$$7.cloneNode(true);

      createRenderEffect(() => setAttribute$1(_el$, "fill", props.color));

      return _el$;
    })()
  );
};

const _tmpl$$6 = /*#__PURE__*/template(`<div class="am_thumbnail--itemContainer--player"></div>`),
      _tmpl$2$5 = /*#__PURE__*/template(`<div class="am_thumbnail--itemContainer"><div class="am_thumbnail--itemContainer--image"><img alt=""></div></div>`);

const Thumbnail = props => {
  const [state] = createStore({
    mediaItem: props.mediaItem
  });
  return createComponent(StyleComponent, {
    styles: `${styles$3}`,

    get children() {
      const _el$ = _tmpl$2$5.cloneNode(true),
            _el$2 = _el$.firstChild,
            _el$3 = _el$2.firstChild;

      insert(_el$, createComponent(Show, {
        get when() {
          return state.mediaItem.type !== MediaType.Image;
        },

        get children() {
          const _el$4 = _tmpl$$6.cloneNode(true);

          insert(_el$4, createComponent(PlayCircleMajor, {
            color: 'rgba(0, 0, 0, 0.6)'
          }));

          return _el$4;
        }

      }), null);

      createRenderEffect(() => setAttribute$1(_el$3, "src", state.mediaItem.thumbnail?.url ?? state.mediaItem.url));

      return _el$;
    }

  });
};

var styles$2 = /* #__PURE__ */ (() => ".am_rec_splide--previewContainer{position:relative}.am_rec_splide--previewContainer>*{width:280px;height:280px;background-color:#fafbfc;object-fit:contain}.am_rec_splide--previewContainer--ExternalVideo{border:none}\n")();

const YOUTUBE_EMBED_REGEXP = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((?:\w|-){11})(?:\S+)?$/;
const formatYouTubeUrl = (url) => {
  const urlMath = url.match(YOUTUBE_EMBED_REGEXP);
  const embedCode = urlMath && urlMath?.length > 1 ? urlMath[1] : "g3H28h4lD40";
  const embedUrl = `https://www.youtube.com/embed/${embedCode}?controls=1&enablejsapi=1&modestbranding=1`;
  return embedUrl;
};
const callYouTubePlayer = (currentElement, func, ...args) => {
  const youtubeIframe = currentElement;
  const youtubeSrc = youtubeIframe?.getAttribute("src") || "";
  if (youtubeSrc?.includes("youtube.com/embed")) {
    youtubeIframe?.contentWindow?.postMessage(JSON.stringify({
      event: "command",
      func,
      args: args || []
    }), "*");
  }
};
const callYouTubePlayVideo = (currentElement) => {
  currentElement && callYouTubePlayer(currentElement, "playVideo");
};
const callYouTubePauseVideo = (currentElement) => {
  currentElement && callYouTubePlayer(currentElement, "pauseVideo");
};

const callVimeoPlayer = (currentElement, func, args) => {
  const vimeoIframe = currentElement;
  vimeoIframe?.contentWindow?.postMessage({
    method: func,
    ...args ? { value: args } : {}
  }, "*");
};
const callVimeoPlayVideo = (currentElement) => {
  currentElement && callVimeoPlayer(currentElement, "play");
};
const callVimeoPauseVideo = (currentElement) => {
  currentElement && callVimeoPlayer(currentElement, "pause");
};

const _tmpl$$5 = /*#__PURE__*/template(`<img alt="">`),
      _tmpl$2$4 = /*#__PURE__*/template(`<iframe class="am_rec_splide--previewContainer--ExternalVideo" allowfullscreen allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>`),
      _tmpl$3$3 = /*#__PURE__*/template(`<li class="am_rec_splide--previewContainer"></li>`),
      _tmpl$4 = /*#__PURE__*/template(`<video class="am_rec_splide--previewContainer--video" controls><source></video>`);
var ExternalVideoHostEnum;

(function (ExternalVideoHostEnum) {
  ExternalVideoHostEnum["YouTube"] = "youtube";
  ExternalVideoHostEnum["Vimeo"] = "vimeo";
})(ExternalVideoHostEnum || (ExternalVideoHostEnum = {}));

const handleNormalPlayVideo = Element => {
  Element?.play();
};

const handleNormalPauseVideo = Element => {
  Element?.pause();
};

const ExternalVideoHostMap = {
  [ExternalVideoHostEnum.YouTube]: {
    play: callYouTubePlayVideo,
    pause: callYouTubePauseVideo,
    // render: (url:string, ref: HTMLIFrameElement) => <iframe ref={ref} class="am_rec_splide--previewContainer--ExternalVideo" src={formatYouTubeUrl(url)}   allowfullscreen></iframe>
    formatUrl: formatYouTubeUrl
  },
  [ExternalVideoHostEnum.Vimeo]: {
    play: callVimeoPlayVideo,
    pause: callVimeoPauseVideo,
    formatUrl: url => url
  }
};

const Preview = props => {
  const [state] = createStore({
    mediaItem: props.mediaItem
  });
  let normalVideoDom;
  let externalVideoDom;
  const mediaType = createMemo(() => state.mediaItem.type, [state.mediaItem.type])();
  const externalVideoHost = createMemo(() => state.mediaItem.external_video_host, [state.mediaItem.external_video_host])();
  const externalVideoFn = createMemo(() => ExternalVideoHostMap[externalVideoHost], [state.mediaItem.external_video_host])();

  const handlePlay = () => {
    if (mediaType === MediaType.Image) return;
    if (mediaType === MediaType.Video) return handleNormalPlayVideo(normalVideoDom);
    externalVideoFn?.play(externalVideoDom);
  };

  const handlePause = () => {
    if (mediaType === MediaType.Image) return;
    if (mediaType === MediaType.Video) return handleNormalPauseVideo(normalVideoDom);
    externalVideoFn?.pause(externalVideoDom);
  };

  createEffect(() => {
    if (props.isPlaying) {
      handlePlay();
    } else {
      handlePause();
    }
  }, [props.isPlaying]);
  return createComponent(StyleComponent, {
    styles: `${styles$2}`,

    get children() {
      const _el$ = _tmpl$3$3.cloneNode(true);

      insert(_el$, createComponent(Switch, {
        get fallback() {
          return (() => {
            const _el$4 = _tmpl$4.cloneNode(true),
                  _el$5 = _el$4.firstChild;

            const _ref$2 = normalVideoDom;
            typeof _ref$2 === "function" ? _ref$2(_el$4) : normalVideoDom = _el$4;

            createRenderEffect(() => setAttribute$1(_el$5, "src", state.mediaItem.url));

            return _el$4;
          })();
        },

        get children() {
          return [createComponent(Match, {
            get when() {
              return mediaType === MediaType.Image;
            },

            get children() {
              const _el$2 = _tmpl$$5.cloneNode(true);

              createRenderEffect(() => setAttribute$1(_el$2, "src", state.mediaItem.url));

              return _el$2;
            }

          }), createComponent(Match, {
            when: !!externalVideoFn,

            get children() {
              const _el$3 = _tmpl$2$4.cloneNode(true);

              const _ref$ = externalVideoDom;
              typeof _ref$ === "function" ? _ref$(_el$3) : externalVideoDom = _el$3;

              createRenderEffect(() => setAttribute$1(_el$3, "src", externalVideoFn.formatUrl?.(state.mediaItem.url) ?? state.mediaItem.url));

              return _el$3;
            }

          })];
        }

      }));

      return _el$;
    }

  });
};

const _tmpl$$4 = /*#__PURE__*/template(`<div class="am_rec_imageGallery"><section id="am-main-carousel" class="splide am_preview_container" aria-label="My Awesome Gallery"><div class="splide__track"><ul class="splide__list"></ul></div></section><section id="am-gallery-carousel" class="splide am_thumbnails_container" aria-label="My Awesome Gallery"><div class="splide__track"><ul class="splide__list"></ul></div></section></div>`),
      _tmpl$2$3 = /*#__PURE__*/template(`<li class="splide__slide am_rec_splide--imageContainer"></li>`),
      _tmpl$3$2 = /*#__PURE__*/template(`<li class="splide__slide"></li>`);

const ImageGallery = props => {
  const [state, setState] = createStore({
    media: props.media,
    currPreviewIndex: 0
  });
  const [mainSplide, setMainSplide] = createSignal();
  createEffect(() => {
    if (props.currentVariantImageUrl) {
      const index = state.media?.findIndex(item => item.url === props.currentVariantImageUrl);

      if (index !== -1) {
        mainSplide()?.go(index);
      }
    }
  }, [props.currentVariantImageUrl, state.media]);
  const [timer, setTimer] = createSignal();

  const handleShowArrows = () => {
    if (timer()) {
      clearTimeout(timer());
    }

    const cTimer = setTimeout(() => {
      toggleArrowsDisplay(false);
      clearTimeout(timer());
    }, 6000);
    setTimer(cTimer);
  };

  const toggleArrowsDisplay = isShow => {
    const arrows = document.querySelectorAll('.am_rec_imageGallery .splide__arrow');
    Array.from(arrows).forEach(arrow => {
      arrow.setAttribute('style', `opacity: ${isShow ? 1 : 0}`);
    });
    handleShowArrows();
  };

  const mainSplideAddEvent = () => {
    const mainImages = document.querySelectorAll('.am_preview_container .splide__slide');

    for (let i = 0; i < mainImages.length; i++) {
      initMainImage(mainImages[i]);
    }

    function initMainImage(image) {
      image.addEventListener('mouseenter', function () {
        toggleArrowsDisplay(true);
      });
    }
  };

  const initSplide = () => {
    const thumbnails = document.querySelectorAll('.am_thumbnails_container .splide__slide');
    const mainSplide = new Splide('#am-main-carousel', {
      pagination: false,
      arrows: thumbnails.length > 1
    });
    const gallerySplide = new Splide('#am-gallery-carousel', {
      pagination: false,
      arrows: thumbnails.length > 5,
      perMove: 5
    });
    toggleArrowsDisplay(false);
    setMainSplide(mainSplide);
    let current;

    for (let i = 0; i < thumbnails.length; i++) {
      initThumbnail(thumbnails[i], i);
    }

    function initThumbnail(thumbnail, index) {
      thumbnail.addEventListener('click', function () {
        mainSplide.go(index);
        toggleArrowsDisplay(true);
      });
      thumbnail.addEventListener('mouseenter', function () {
        mainSplide.go(index);
        toggleArrowsDisplay(true);
      });
    }

    mainSplideAddEvent();
    mainSplide.on('mounted move', function (e) {
      const thumbnail = thumbnails[mainSplide.index];

      if (thumbnail) {
        if (current) {
          current.classList.remove('is-active');
        }

        thumbnail.classList.add('is-active');
        thumbnail.scrollIntoView({
          behavior: 'smooth'
        });
        current = thumbnail;
      }

      handleShowArrows();
      setState({
        currPreviewIndex: e
      });
    });
    gallerySplide.on('mounted move', function () {
      mainSplide.go(gallerySplide.index);
      handleShowArrows();
    });
    mainSplide.mount();
    gallerySplide.mount();
  };

  onMount(() => {
    initSplide();
  });
  return createComponent(StyleComponent, {
    styles: `${styles$4}; ${splideStyles}`,

    get children() {
      const _el$ = _tmpl$$4.cloneNode(true),
            _el$2 = _el$.firstChild,
            _el$3 = _el$2.firstChild,
            _el$4 = _el$3.firstChild,
            _el$5 = _el$2.nextSibling,
            _el$6 = _el$5.firstChild,
            _el$7 = _el$6.firstChild;

      insert(_el$4, createComponent(For, {
        get each() {
          return state.media;
        },

        children: (item, index) => (() => {
          const _el$8 = _tmpl$2$3.cloneNode(true);

          insert(_el$8, createComponent(Preview, {
            mediaItem: item,

            get isPlaying() {
              return index() === state.currPreviewIndex;
            }

          }));

          return _el$8;
        })()
      }));

      insert(_el$7, createComponent(For, {
        get each() {
          return state.media;
        },

        children: item => (() => {
          const _el$9 = _tmpl$3$2.cloneNode(true);

          insert(_el$9, createComponent(Thumbnail, {
            mediaItem: item
          }));

          return _el$9;
        })()
      }));

      return _el$;
    }

  });
};

var styles$1 = /* #__PURE__ */ (() => ".am_rec_desktop--wrapper{display:grid;column-gap:20px;grid-template-columns:280px auto;width:616px;text-align:left}\n")();

const _tmpl$$3 = /*#__PURE__*/template(`<div></div>`);

const conversionMedia = imageUrls => {
  return imageUrls.filter(item => !!item).map((item, index) => ({
    external_product_media_id: item,
    id: item,
    mime_type: 'image/png',
    sort: index,
    thumbnail: {
      url: item
    },
    type: MediaType.Image,
    url: item
  }));
};

const VariantPicker = props => {
  const [state, setState] = createStore({
    isMobile: isSmallScreen(),
    media: props.productInfo?.media?.length ? props.productInfo.media : conversionMedia(props.productInfo?.imageUrls?.length ? props.productInfo?.imageUrls : [emptyIcon]),
    campaign: props.campaign
  });
  const [open, setOpen] = createSignal(false);
  const [currentVariantImageUrl, setCurrentVariantImageUrl] = createSignal();
  createEffect(() => {
    setOpen(props.open);
  }, props.open);

  const handleResize = () => {
    const result = isSmallScreen();

    if (result !== state.isMobile) {
      setState({
        isMobile: result
      });
    }
  };

  onMount(() => {
    window.addEventListener('resize', handleResize);
  });
  return createComponent(StyleComponent, {
    styles: styles$1,

    get children() {
      return createComponent(Modal, {
        get showModal() {
          return open();
        },

        get onClose() {
          return props.onClose;
        },

        get children() {
          const _el$ = _tmpl$$3.cloneNode(true);

          insert(_el$, createComponent(Show, {
            get when() {
              return !state.isMobile && state.media?.length;
            },

            get children() {
              return createComponent(ImageGallery, {
                get media() {
                  return state.media;
                },

                get currentVariantImageUrl() {
                  return currentVariantImageUrl();
                }

              });
            }

          }), null);

          insert(_el$, createComponent(ProductInfo, {
            get isMobile() {
              return state.isMobile;
            },

            get productInfo() {
              return props.productInfo;
            },

            get settings() {
              return props.campaign?.presentation_settings;
            },

            get campaignId() {
              return state.campaign?.campaign_id || '';
            },

            close: () => {
              setOpen(false);
              props.onClose?.();
            },
            getCurrentVariantImageUrl: imageUrl => {
              setCurrentVariantImageUrl(imageUrl);
            }
          }), null);

          createRenderEffect(() => className(_el$, `${!state.isMobile ? 'am_rec_desktop--wrapper' : ''}`));

          return _el$;
        }

      });
    }

  });
};

const GAP_SIZE = 20;

const _tmpl$$2 = /*#__PURE__*/template(`<ul></ul>`),
      _tmpl$2$2 = /*#__PURE__*/template(`<div class="am-product-carousel--wrapper"><section class="splide" aria-label="AfterShip recommendation carousel"><div></div></section></div>`),
      _tmpl$3$1 = /*#__PURE__*/template(`<li class="splide__slide am_product_splide--item" data-width="120"><div class="splide__slide__container"></div></li>`);

const CarouselProductList = props => {
  // add uuid to fix multi splide display error at same time
  const splideId = `am-product-carousel-${v4()}`;
  const [state, setState] = createStore({
    productList: props.data.products,
    campaign: props.data.campaign,
    campaignId: props.data.campaign?.campaign_id || '',
    settings: props.data.campaign?.presentation_settings,
    columns: props.data.campaign?.presentation_settings?.desktop_layout?.columns || 3,
    mobileColumns: props.data.campaign?.presentation_settings?.mobile_layout?.columns || 2,
    numberOfProducts: props.data.campaign?.presentation_settings?.desktop_layout?.number_of_products ?? props.data.products?.length,
    isMobile: isSmallScreen() || props.isMobile,
    showArrow: true,
    currentColumn: 2
  });
  const [isOpenVariantPicker, setIsOpenVariantPicker] = createSignal(false);
  const [curProductInfo, setCurProductInfo] = createSignal();
  const [ref, setRef] = createSignal();

  const sendViewItemWithMoveSplide = () => {
    const elements = document.querySelectorAll(`#${splideId} .am_product_splide--item`);
    const visibleItems = [];

    for (let index = 0; index < elements.length; index++) {
      const element = elements[index];

      if (element.classList.contains('is-visible')) {
        const product = state?.productList?.[index];
        visibleItems.push(product);
      }
    }

    setCurImprItems(visibleItems);
  };

  const [curImprItems, setCurImprItems] = createSignal();
  const [preImprItems, setPreImprItems] = createSignal();

  const sendImprItem = products => {
    products.forEach(product => {
      const index = state.productList?.indexOf(product);
      sendViewItem({
        campaign_id: state.campaignId,
        item_url: `${product?.productUrl}&index=${index}`,
        product_id: product.externalId
      });
    });
  };

  const handleSettingColumns = () => {
    const columns = props.isMobile || isSmallScreen() ? props.data.campaign?.presentation_settings?.mobile_layout?.columns ?? 2 : props.data.campaign?.presentation_settings?.desktop_layout?.columns ?? 3;
    setState({
      currentColumn: columns
    });
    return columns;
  };

  onMount(() => {
    // to fix toggle device type, column not reactive
    window.addEventListener('resize', handleSettingColumns);
  });
  createMemo(() => {
    handleSettingColumns();
  }, [state.isMobile, props.data.campaign?.presentation_settings?.mobile_layout?.columns, props.data.campaign?.presentation_settings?.desktop_layout?.columns]);
  createEffect(() => {
    if (ref()) {
      const col = state.currentColumn;
      const isShowArrow = Boolean(state?.productList?.length && state?.productList?.length > col);
      setState({
        showArrow: isShowArrow
      });
      const productSplide = new Splide(`#${splideId}`, {
        pagination: false,
        arrows: isShowArrow,
        perMove: col,
        perPage: col,
        gap: GAP_SIZE,
        rewind: true,
        focus: 0
      });
      productSplide.on('moved', () => {
        sendViewItemWithMoveSplide();
      });
      productSplide.mount();
    }
  });
  createEffect(() => {
    const preItems = preImprItems();
    const curItems = curImprItems();

    if (!curItems || curItems.length === 0) {
      return;
    }

    if (!preItems || preItems.length === 0) {
      sendImprItem(curItems);
      setPreImprItems(curItems);
      return;
    }

    const diffItems = curItems && preItems && Array.from(new Set(curItems.filter(i => !preItems.includes(i))));
    sendImprItem(diffItems);
    setPreImprItems(curImprItems);
  });
  createEffect(() => {
    if (isOpenVariantPicker()) {
      const modalRoot = document.getElementById('am_rec_container_root');
      if (!modalRoot) return;
      modalRoot.innerHTML = '';
      render(() => createComponent(VariantPicker, {
        get open() {
          return isOpenVariantPicker();
        },

        get productInfo() {
          return curProductInfo();
        },

        get campaign() {
          return props.data.campaign;
        }

      }), modalRoot);
    }
  });
  onMount(() => {
    const col = isSmallScreen() ? state.mobileColumns : state.columns;
    const isShowArrow = Boolean(state?.productList?.length && state?.productList?.length > col);
    const products = (state?.productList && state.productList) ?? [];

    if (!isShowArrow) {
      sendImprItem(products);
      return;
    }

    const initialItems = products.slice(0, col);
    setCurImprItems(initialItems);
  });
  return createComponent(StyleComponent, {
    styles: `${styles$c}; ${splideStyles};`,

    get children() {
      const _el$ = _tmpl$2$2.cloneNode(true),
            _el$2 = _el$.firstChild,
            _el$3 = _el$2.firstChild;

      (el => setRef(el))(_el$2);

      setAttribute$1(_el$2, "id", splideId);

      insert(_el$3, createComponent(Show, {
        get when() {
          return state.productList?.length && state.settings;
        },

        get children() {
          const _el$4 = _tmpl$$2.cloneNode(true);

          insert(_el$4, createComponent(For, {
            get each() {
              return state.productList;
            },

            children: (product, index) => {
              return product && (() => {
                const _el$5 = _tmpl$3$1.cloneNode(true),
                      _el$6 = _el$5.firstChild;

                insert(_el$6, createComponent(ProductItem, {
                  product: product,

                  get index() {
                    return index();
                  },

                  get id() {
                    return state.campaignId;
                  },

                  get settings() {
                    return props.data.campaign?.presentation_settings;
                  },

                  openVariantPicker: productId => {
                    setIsOpenVariantPicker(false);
                    const cur = state.productList?.find(item => item?.externalId === productId);
                    setCurProductInfo(cur);
                    setIsOpenVariantPicker(true);
                  }
                }));

                return _el$5;
              })();
            }
          }));

          createRenderEffect(() => className(_el$4, `splide__list am-rec-productWrapper ${state.showArrow ? '' : 'center'}`));

          return _el$4;
        }

      }));

      createRenderEffect(_p$ => {
        const _v$ = state.showArrow ? 'block' : 'inline-block',
              _v$2 = `splide__track ${isSmallScreen() || props.isMobile ? 'mobile' : ''}`;

        _v$ !== _p$._v$ && _el$2.style.setProperty("display", _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && className(_el$3, _p$._v$2 = _v$2);
        return _p$;
      }, {
        _v$: undefined,
        _v$2: undefined
      });

      return _el$;
    }

  });
};

var styles = /* #__PURE__ */ (() => ".am_rec_product_list_box{align-content:center;display:grid;column-gap:20px}\n")();

const _tmpl$$1 = /*#__PURE__*/template(`<ul class="am_rec_product_list_box"></ul>`),
      _tmpl$2$1 = /*#__PURE__*/template(`<div><section id="am-product-grid"></section></div>`);

const GridProductList = props => {
  const getDefaultGridStyle = () => {
    const columns = props.data.campaign?.presentation_settings?.desktop_layout?.columns || 3;
    const mobileColumns = props.data.campaign?.presentation_settings?.mobile_layout?.columns || 2;

    if (props.isMobile || isSmallScreen()) {
      return `grid-template-columns: repeat(${mobileColumns}, 1fr)`;
    }

    return `grid-template-columns: repeat(${columns}, 1fr)`;
  };

  const [state, setState] = createStore({
    campaign: props.data.campaign,
    campaignId: props.data.campaign?.campaign_id || '',
    settings: props.data.campaign?.presentation_settings,
    columns: props.data.campaign?.presentation_settings?.desktop_layout?.columns || 3,
    mobileColumns: props.data.campaign?.presentation_settings?.mobile_layout?.columns || 2,
    gridStyle: getDefaultGridStyle(),
    isMobile: props.isMobile || false
  });
  const [isOpenVariantPicker, setIsOpenVariantPicker] = createSignal(false);
  const [curProductInfo, setCurProductInfo] = createSignal();

  const handleShapeChange = () => {
    const settingColumns = props.isMobile || isSmallScreen() ? props.data.campaign?.presentation_settings?.mobile_layout?.columns ?? 2 : props.data.campaign?.presentation_settings?.desktop_layout?.columns ?? 3;
    const columns = Math.min(settingColumns, props.data.products?.length ?? 0);
    const width = `calc((100% - ${(settingColumns - 1) * GAP_SIZE}px)/${settingColumns})`;
    setState({
      gridStyle: `grid-template-columns: repeat(${columns}, ${width})`
    });
  };

  createMemo(handleShapeChange, [props.isMobile, props.data.campaign?.presentation_settings?.desktop_layout?.columns, props.data.campaign?.presentation_settings?.mobile_layout?.columns, props.data.products?.length]);
  onMount(() => {
    window.addEventListener('resize', handleShapeChange);
  });
  createEffect(() => {
    if (isOpenVariantPicker()) {
      const modalRoot = document.getElementById('am_rec_container_root');
      if (!modalRoot) return;
      modalRoot.innerHTML = '';
      render(() => createComponent(VariantPicker, {
        get open() {
          return isOpenVariantPicker();
        },

        get productInfo() {
          return curProductInfo();
        },

        get campaign() {
          return props.data.campaign;
        }

      }), modalRoot);
    }
  });
  return createComponent(StyleComponent, {
    styles: styles,

    get children() {
      const _el$ = _tmpl$2$1.cloneNode(true),
            _el$2 = _el$.firstChild;

      insert(_el$2, createComponent(Show, {
        get when() {
          return props.data.products?.length && props.data.campaign?.presentation_settings;
        },

        get children() {
          const _el$3 = _tmpl$$1.cloneNode(true);

          insert(_el$3, createComponent(For, {
            get each() {
              return props.data.products;
            },

            children: (item, index) => {
              return item && createComponent(ProductItem, {
                get id() {
                  return state.campaignId;
                },

                product: item,

                get settings() {
                  return props.data.campaign?.presentation_settings;
                },

                get index() {
                  return index();
                },

                openVariantPicker: productId => {
                  setIsOpenVariantPicker(false);
                  const cur = props.data.products?.find(item => item?.externalId === productId);
                  cur && setCurProductInfo(cur);
                  setIsOpenVariantPicker(true);
                }
              });
            }
          }));

          createRenderEffect(_$p => style$1(_el$3, state.gridStyle, _$p));

          return _el$3;
        }

      }));

      return _el$;
    }

  });
};

var productItemStyles = /* #__PURE__ */ (() => ".am_rec_item{width:100%;height:100%}.am_rec_item_wrap{height:100%;width:100%;display:flex;flex-direction:column;justify-content:start;align-content:flex-end;font-family:Arial;font-size:16px;line-height:24px}.am_rec_item_img{position:relative;width:100%;overflow:hidden;margin-bottom:12px;display:inline-block}.am_rec_item_img img{width:100%;height:100%;margin:0 auto;position:absolute;left:50%;transform:translate(-50%);object-fit:cover}.am_rec_item_title{color:#666;word-wrap:break-word;flex-grow:1;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;font-size:16px;line-height:24px}.am_rec_item_title a,.am_productInfo_container{text-decoration:none}.am_productInfo_container{display:inline-block;display:flex;flex-direction:column}.am_rec_price_content{line-height:24px}.am_rec_item_price{margin-bottom:12px;word-wrap:break-word;color:#333;font-size:16px}.am_rec_compare_price{color:#8c9196;text-decoration:line-through;word-wrap:break-word;padding-left:8px;font-size:16px}.am_rec_button_container{display:\"inline-block\"}.am_rec_add_to_cart_button{width:100%;color:#f2f2f2;background-color:#333;font-weight:400;font-size:14px;border-radius:4px;border:1px solid #333;margin-top:12px;padding:10px 16px;overflow-wrap:break-word;position:relative;visibility:visible;line-height:20px;display:inline-block;text-align:center;cursor:pointer}.am_rec_add_to_cart_button:hover{filter:drop-shadow(0px 4px 6px rgba(0,0,0,.25))}.am_rec_add_to_cart_button:active{border-color:#00000024!important}.button-loading{display:block!important;visibility:hidden;position:absolute;width:20px;height:20px;border:2px solid white;border-top-color:transparent!important;border-radius:100%;left:calc(50% - 10px);top:calc(50% - 10px)}.buy-now-button--loading>.button-text{visibility:hidden}.buy-now-button--loading>.button-loading{visibility:visible;animation:loadingRotate 1.2s linear infinite}.buy-now-button--success>.button-text{visibility:hidden}.buy-now-button--success>.button-loading{visibility:hidden}@keyframes loadingRotate{0%{-webkit-transform:rotate(0deg)}to{-webkit-transform:rotate(360deg)}}.add_to_cart_status{margin-top:8px;display:flex;justify-content:center}.add_to_cart_status div{width:20px;height:20px}.add_to_cart_status span{color:#44474a;font-size:14px;line-height:20px;margin-left:8px;text-align:left}\n")();

let titleHeightTimer;
const handleProductTitleHeightFn = (selector) => {
  clearTimeout(titleHeightTimer);
  titleHeightTimer = setTimeout(() => {
    const itemTitleElements = document.querySelectorAll(`${selector}`);
    if (!Array.from(itemTitleElements)?.length)
      return;
    let productTitleHeight = 24;
    const allHeight = Array.from(itemTitleElements).map((item) => item.clientHeight);
    productTitleHeight = Math.max(...allHeight);
    for (const itemTitleElement of itemTitleElements) {
      const styles = itemTitleElement.getAttribute("style");
      itemTitleElement.setAttribute("style", `
						${styles ?? ""};
						height: ${productTitleHeight}px;
						max-height: 48px;
						flex-grow: 0;
					`);
    }
    clearTimeout(titleHeightTimer);
  }, 500);
};
let priceHeightTimer;
const handlePriceHeightFn = (selector) => {
  priceHeightTimer && clearTimeout(priceHeightTimer);
  priceHeightTimer = setTimeout(() => {
    const itemTitleElements = document.querySelectorAll(`${selector}`);
    if (!Array.from(itemTitleElements)?.length)
      return;
    let productTitleHeight = 24;
    const allHeight = Array.from(itemTitleElements).map((item) => item.clientHeight);
    productTitleHeight = Math.max(...allHeight);
    for (const itemTitleElement of itemTitleElements) {
      const styles = itemTitleElement.getAttribute("style");
      itemTitleElement.setAttribute("style", `
						${styles ?? ""};
						min-height: ${productTitleHeight}px;
						max-height: 48px;
						flex-grow: 0;
					`);
    }
    clearTimeout(priceHeightTimer);
  }, 500);
};

const _tmpl$ = /*#__PURE__*/template(`<div class="am_recommendation_container"><div class="am_rec_product_list_section"><div class="title"></div><div class="am_rec_product_wrap_box"></div></div></div>`),
      _tmpl$2 = /*#__PURE__*/template(`<span class="am_rec_powerby_remove_btn">Click to remove</span>`),
      _tmpl$3 = /*#__PURE__*/template(`<div><a target="_blank" rel="noopener"><span>Powered by AfterShip</span></a></div>`);
const APZ_ROOT_DOM_ID = `am_rec_root_${v4()}`;

const ProductList = props => {
  const [state, setState] = createStore({
    data: props.data,
    campaign: props.data.campaign,
    campaignId: props.data.campaign?.campaign_id || '',
    settings: props.data.campaign?.presentation_settings,
    title: props.data.campaign?.campaign_title || '',
    mobileStyle: props.data.campaign?.presentation_settings?.mobile_layout?.display_style || 'grid',
    desktopStyle: props.data.campaign?.presentation_settings?.desktop_layout?.display_style || 'grid'
  });
  const productList = createMemo(() => {
    const productSettingCount = props.data.campaign?.presentation_settings?.desktop_layout?.number_of_products || 3;
    const productRecCount = state.data.products?.length || 0;
    const needCount = Math.min(productSettingCount, productRecCount);
    if (!needCount || !state.data.products?.length) return;
    const list = state.data.products?.splice(0, needCount);
    return list;
  }, [props.data.campaign]);
  const [rootRef, setRootRef] = createSignal();
  const [isMobile, setMobileStatus] = createSignal(props.isMobile ?? isSmallScreen());
  createEffect(() => {
    const search = new URL(location.href).search;
    const searchObj = new URLSearchParams(search);
    const hasPreview = searchObj.get('preview');

    if (hasPreview) {
      rootRef()?.scrollIntoView(true);
    }
  }, [location.href]);
  createEffect(() => {
    handleProductTitleHeightFn(`#${APZ_ROOT_DOM_ID} .am_rec_item_title`);
    handlePriceHeightFn(`#${APZ_ROOT_DOM_ID} .am_rec_price_content`);
  });
  createEffect(() => {
    setMobileStatus(props.isMobile ?? isSmallScreen());
  }); // to observe carousel component change and then update product title height

  let count = 0;

  const handleObserve = () => {
    // get target node
    const targetNode = document.querySelector(`#${APZ_ROOT_DOM_ID} .am-product-carousel--wrapper`); // config of observer

    const config = {
      attributes: true,
      childList: true,
      subtree: true
    };

    const callback = function (mutationsList, observer) {
      // Use traditional 'for loops' for IE 11
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          count++;
          handleProductTitleHeightFn(`#${APZ_ROOT_DOM_ID} .am_rec_item_title`);
          const title = document.querySelector(`#${APZ_ROOT_DOM_ID} .am_rec_item_title`);

          if (title?.clientHeight || count > 5000) {
            // stop observe
            observer.disconnect();
          }
        }
      }
    };

    const observer = new MutationObserver(callback); // start observe

    targetNode && observer.observe(targetNode, config);
  };

  const handleDisplayStyle = createMemo(() => {
    if (isMobile()) {
      return state.mobileStyle;
    }

    return state.desktopStyle;
  }, [props.data.campaign?.presentation_settings?.desktop_layout?.display_style, props.data.campaign?.presentation_settings?.mobile_layout?.display_style]);

  const handleResize = () => {
    setMobileStatus(props.isMobile ?? isSmallScreen());
  };

  onMount(async () => {
    compatRecommendationSectionThemePosition();
    sendImpr({
      campaign_id: state.campaignId
    });
    handleObserve();
    window.addEventListener('resize', handleResize);
  });
  onCleanup(() => {
    window.removeEventListener('resize', handleResize);
  }); // compat theme: Narrative and Debut

  const compatRecommendationSectionThemePosition = () => {
    if (!window.Shopify) return;
    const theme = window.Shopify.theme.name;
    const location = props.data.campaign?.location;

    if (theme === 'Narrative' && location === 'footer') {
      const mainContentDom = document.getElementById('MainContent');

      if (mainContentDom) {
        const marginBottom = getComputedStyle(mainContentDom, null).marginBottom;
        const rootDom = document.getElementsByClassName('am_rec_product_list_section')[0];
        rootDom?.setAttribute('style', `margin-bottom: ${marginBottom}`);
      }
    }

    if (theme === 'Debut' && location === 'footer') {
      const lastIndexSectionDom = document.querySelector('[class*=index-section--flush]:last-child');

      if (lastIndexSectionDom) {
        const marginBottom = getComputedStyle(lastIndexSectionDom, null).marginBottom;
        const marginBottomCount = marginBottom.replace('-', '');
        const rootDom = document.getElementsByClassName('am_rec_product_list_section')[0];
        rootDom?.setAttribute('style', `margin-top: ${marginBottomCount}`);
      }
    }
  };

  const traceId = 'traceId' in props.data ? props.data.traceId : '';
  const autoStyle = 'style' in props.data ? props.data.style : undefined;
  return createComponent(ErrorBoundary, {
    fallback: true,

    get children() {
      return createComponent(Suspense, {
        get children() {
          return createComponent(GlobalStateProvider, {
            traceId: traceId,
            style: autoStyle,

            get children() {
              return createComponent(StyleComponent, {
                styles: `${styles$d} ${productItemStyles}`,

                get children() {
                  return [(() => {
                    const _el$ = _tmpl$.cloneNode(true),
                          _el$2 = _el$.firstChild,
                          _el$3 = _el$2.firstChild,
                          _el$4 = _el$3.nextSibling;

                    (el => setRootRef(el))(_el$);

                    setAttribute$1(_el$, "id", APZ_ROOT_DOM_ID);

                    insert(_el$3, () => props.data.campaign?.campaign_title);

                    insert(_el$4, createComponent(Switch, {
                      get children() {
                        return [createComponent(Match, {
                          get when() {
                            return handleDisplayStyle() === 'grid';
                          },

                          get children() {
                            return createComponent(GridProductList, {
                              get data() {
                                return {
                                  campaign: props.data.campaign,
                                  products: productList()
                                };
                              },

                              get isMobile() {
                                return isMobile();
                              },

                              get isPreview() {
                                return props.isPreview;
                              }

                            });
                          }

                        }), createComponent(Match, {
                          get when() {
                            return handleDisplayStyle() === 'carousel';
                          },

                          get children() {
                            return createComponent(CarouselProductList, {
                              get data() {
                                return {
                                  campaign: props.data.campaign,
                                  products: productList()
                                };
                              },

                              get isMobile() {
                                return isMobile();
                              },

                              get isPreview() {
                                return props.isPreview;
                              }

                            });
                          }

                        })];
                      }

                    }));

                    createRenderEffect(_p$ => {
                      const _v$ = `
						background-color: ${state.settings?.color?.widget_background};
						font-family: ${state.settings?.font.heading_text_font_family};
						font-size: ${state.settings?.font.heading_text_font_size}px;
						max-width: ${SectionWidthMapping[state.settings?.desktop_layout?.media_width || 'standard']}px;
						width: ${'100%'};
						padding-top: ${state.settings?.padding.top}px;
						padding-bottom: ${state.settings?.padding.bottom}px;
					`,
                            _v$2 = `${autoStyle?.title?.color ?? state.settings?.color.campaign_title_text}`,
                            _v$3 = autoStyle?.title?.fontSize ?? `${state.settings?.font.heading_text_font_size}px`,
                            _v$4 = `${state.settings?.font?.heading_text_font_family}`,
                            _v$5 = autoStyle?.title?.fontWeight,
                            _v$6 = autoStyle?.title?.textAlign,
                            _v$7 = `max-width: ${!isMobile() && props.maxWidth ? props.maxWidth : SectionWidthMapping[state.settings?.desktop_layout?.media_width || 'standard']}px;`;

                      _p$._v$ = style$1(_el$, _v$, _p$._v$);
                      _v$2 !== _p$._v$2 && _el$3.style.setProperty("color", _p$._v$2 = _v$2);
                      _v$3 !== _p$._v$3 && _el$3.style.setProperty("font-size", _p$._v$3 = _v$3);
                      _v$4 !== _p$._v$4 && _el$3.style.setProperty("font-family", _p$._v$4 = _v$4);
                      _v$5 !== _p$._v$5 && _el$3.style.setProperty("font-weight", _p$._v$5 = _v$5);
                      _v$6 !== _p$._v$6 && _el$3.style.setProperty("text-align", _p$._v$6 = _v$6);
                      _p$._v$7 = style$1(_el$4, _v$7, _p$._v$7);
                      return _p$;
                    }, {
                      _v$: undefined,
                      _v$2: undefined,
                      _v$3: undefined,
                      _v$4: undefined,
                      _v$5: undefined,
                      _v$6: undefined,
                      _v$7: undefined
                    });

                    return _el$;
                  })(), createComponent(Show, {
                    get when() {
                      return props.showPowerby;
                    },

                    get children() {
                      const _el$5 = _tmpl$3.cloneNode(true),
                            _el$6 = _el$5.firstChild,
                            _el$7 = _el$6.firstChild;

                      _el$6.style.setProperty("text-decoration", "none");

                      _el$7.style.setProperty("color", "#6D7175");

                      insert(_el$5, createComponent(Show, {
                        get when() {
                          return props.isPreview && props.handleRemovePowerby;
                        },

                        get children() {
                          const _el$8 = _tmpl$2.cloneNode(true);

                          addEventListener(_el$8, "click", props.handleRemovePowerby, true);

                          return _el$8;
                        }

                      }), null);

                      createRenderEffect(_p$ => {
                        const _v$8 = `am_rec_poweryby ${isMobile() ? 'mobile' : 'pc'}`,
                              _v$9 = `
						max-width: ${SectionWidthMapping[state.settings?.desktop_layout?.media_width || 'standard']}px;
						background-color: ${state.settings?.color?.widget_background}
					`,
                              _v$10 = props.poweredbyUtmLink;
                        _v$8 !== _p$._v$8 && className(_el$5, _p$._v$8 = _v$8);
                        _p$._v$9 = style$1(_el$5, _v$9, _p$._v$9);
                        _v$10 !== _p$._v$10 && setAttribute$1(_el$6, "href", _p$._v$10 = _v$10);
                        return _p$;
                      }, {
                        _v$8: undefined,
                        _v$9: undefined,
                        _v$10: undefined
                      });

                      return _el$5;
                    }

                  })];
                }

              });
            }

          });
        }

      });
    }

  });
};

delegateEvents(["click"]);

const PoweredbyUtmLink = "https://www.automizely.com/marketing?utm_source=poweredby&utm_medium=onsite_reco";

const renderContainer = props => {
  try {
    if (!props.el || !props.data?.products?.length || !props.data.campaign) {
      return;
    }

    let containerDom = props.el;

    if (props.el.innerHTML) {
      containerDom = document.createElement('div');
      props.el?.parentNode?.insertBefore(containerDom, props.el);
    }

    render(() => createComponent(ProductList, {
      get data() {
        return props.data;
      },

      get isMobile() {
        return props.option?.isMobile;
      },

      get isPreview() {
        return props.option?.isPreview;
      },

      get showPowerby() {
        return props.option?.showPowerby;
      },

      get handleRemovePowerby() {
        return props.option?.handleRemovePowerby;
      },

      get poweredbyUtmLink() {
        return props.option?.poweredbyUtmLink ?? PoweredbyUtmLink;
      }

    }), containerDom);
  } catch (e) {
    console.log(e);
  }
};

const renderVariantPicker = props => {
  try {
    if (!props.el || !props.data?.product || !props.data.campaign) {
      return;
    }

    let containerDom = props.el;

    if (props.el.innerHTML) {
      containerDom = document.createElement('div');
      props.el?.parentNode?.insertBefore(containerDom, props.el);
    }

    render(() => createComponent(VariantPicker, {
      open: true,

      get productInfo() {
        return props.data.product;
      },

      get onClose() {
        return props.option?.handleCloseVariantPicker;
      },

      get campaign() {
        return props.data.campaign;
      }

    }), containerDom);
  } catch (e) {
    console.log(e);
  }
};

const renderRecommendations = async () => {
  const pageType = getPageType();
  if (!pageType)
    return;
  const curProductIds = await getCurProductIds();
  const cookieId = await getUserPseudoIdByLawAsync();
  const input = {
    cookieId,
    customerId: getCustomerId()?.toString(),
    placeId: "",
    targetProducts: [],
    sceneId: `mk_page_${pageType}-page`,
    curProductIds
  };
  const [recommendationProducts, commonSettings] = await Promise.all([fetchRecommendationPublicBffApi(GetRecommendationProductsDocument, { input }), fetchRecommendationPublicBffApi(GetUserProfileDocument)]);
  const hiddenPoweredby = commonSettings?.data?.userProfile?.commonSettings?.content?.automizely_brand?.hidden || false;
  const campaignsSectionData = recommendationProducts?.data?.getRecommendationProducts && recommendationProducts.data.getRecommendationProducts;
  if (!campaignsSectionData)
    return;
  if (document.readyState !== "loading") {
    handleRender({ campaignsSectionData, hiddenPoweredby });
    createRootContainer();
  } else {
    window.addEventListener("DOMContentLoaded", () => {
      handleRender({ campaignsSectionData, hiddenPoweredby });
      createRootContainer();
    });
  }
};
const handleRender = (params) => {
  let curEl;
  const { campaignsSectionData, hiddenPoweredby = false } = params;
  const location = campaignsSectionData?.campaign?.location;
  if (location === "footer") {
    curEl = getFooterElement();
  } else if (location === "customize") {
    curEl = document.querySelector(`[campaignId="${campaignsSectionData?.campaign?.campaign_id}"]`);
  }
  if (curEl && campaignsSectionData && campaignsSectionData?.products?.length && campaignsSectionData?.campaign) {
    handleInit(AppIdManager.getAppName(), AppIdManager.getMappedOrgId());
    renderContainer({ data: campaignsSectionData, el: curEl, option: { showPowerby: !hiddenPoweredby, poweredbyUtmLink: PoweredbyUtmLink } });
  }
};
const createRootContainer = () => {
  const dom = document.getElementById("am_rec_container_root");
  if (dom)
    return;
  const containerDom = document.createElement("div");
  containerDom.setAttribute("id", "am_rec_container_root");
  document.body.appendChild(containerDom);
};
const handleInit = (appName, orgId) => {
  initDataCollect(appName, function() {
  }, { entry: "recommendations", productShortCode: "mt", mappedOrgId: orgId });
};

new URLSearchParams(window.location.search);
const Cache = {};
function getAppIdAndCustomDataFromUrl(url) {
  const result = {};
  if (!url) {
    return void 0;
  }
  const urlStr = `${url.startsWith("http") ? "" : "http://"}${url.replace(/\\u0026/g, "&")}`;
  const scriptUrl = new URL(urlStr);
  const params = new URLSearchParams(scriptUrl.search);
  for (const pair of params.entries()) {
    const [key, value] = pair;
    result[key] = value;
  }
  return result;
}
function getFromScriptTag(uri, documentObject = document) {
  if (!documentObject) {
    return void 0;
  }
  const scripts = Array.from(documentObject.getElementsByTagName("script"));
  const scriptUrl = scripts.find((item) => item.src.includes(uri))?.getAttribute("src");
  return getAppIdAndCustomDataFromUrl(scriptUrl);
}
function getFromScriptString(uri, documentObject = document) {
  if (!documentObject)
    return void 0;
  const matchs = [...documentObject.querySelectorAll("script")].map((el) => el.innerHTML).join("").replace(/\\\//g, "/").match(new RegExp(`${uri}\\?[^"']+`, "g"));
  const scriptUrl = matchs?.find((item) => item.includes(uri));
  if (!scriptUrl)
    return void 0;
  return getAppIdAndCustomDataFromUrl(scriptUrl);
}
const getScriptTagSearchParams = (scriptUri) => {
  let result = Cache[scriptUri];
  if (!result) {
    result = getFromScriptTag(scriptUri, document);
  }
  if (!result) {
    result = getFromScriptString(scriptUri, document);
  }
  result = result ?? {};
  Cache[scriptUri] = result;
  return result;
};

const initRecommendationSdk = async (appName, orgId, appId) => {
  if (!appId) {
    throw new Error("no appId available.");
  }
  AppIdManager.setAppId(appId || "");
  AppIdManager.setMappedOrgId(orgId || "");
  AppIdManager.setAppName(appName || "");
  renderRecommendations();
};
const getOrgInfo = () => {
  let { appName, orgId, appId } = window.AmRec.OrgInfo;
  const params = getScriptTagSearchParams("conversions.js?");
  orgId = params?.mapped_org_id ?? orgId;
  const appIdKeys = [
    "app_connection_id",
    "store_id",
    "id",
    "key",
    "conversions_id",
    "conversions_key",
    "connection_id",
    "automizely_key",
    "automizely_id"
  ];
  const appIdKey = appIdKeys.find((key) => !!params?.[key]);
  appId = appIdKey ? params?.[appIdKey] : appId;
  return { appName, orgId, appId };
};
const initialRecommendation = () => {
  if (!window.AmRec || !window.AmRec.OrgInfo)
    return;
  const { appName, orgId, appId } = getOrgInfo();
  if (!orgId || !appId) {
    throw new Error("no appId available.");
  }
  initRecommendationSdk(appName, orgId, appId);
};
initialRecommendation();

export { initRecommendationSdk, initialRecommendation, renderContainer, renderVariantPicker };
//# sourceMappingURL=am-recommendations.es.js.map
