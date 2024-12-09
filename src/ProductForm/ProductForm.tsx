import React, { LegacyRef, useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import "./style.css";
import Fullscreen from "./ImageGalleryFullscreenButton";
import ClubPromoRoastInner from "../ClubPromoRoast/inner";
import { plans, referenceString } from "../common/constants";
import { IPlan } from "../common/plans";
import WholeBeanSVG from "./WholeBeanSVG";
import FreshGroundSVG from "./FreshGroundSVG";
import BackInStockNotificationSignUp from "./BackInStockNotificationSignUp";

const productBundleServingSizes: any = {
  // ready to run
  9670153044281: {
    "1 Pack": 1 * 20,
    "5 Pack": 5 * 20,
  },
  // ready to run - free gift
  9670942622009: {
    "1 Pack": 1 * 20,
    "5 Pack": 5 * 20,
  },
  // ultramarathon set
  8281672483129: {
    "1 lbs": 4 * 40, // 4 bags, 1lb each
    "5 lbs": 4 * 200, // 4 bags, 5lb each
  },
  // new athlete sample kit
  9445138465081: (3 * 4 + 2 * 1.5) * 2.5, // 3 bags of 4 ounces, 2 bags of 1.5 ounces
  // run brunch bundle
  9413945721145: 3 * 40, // 3 bags, 1lb each
  // speedwork set
  8281671237945: {
    "1 lbs": 3 * 40, // 3 bags, 1lb each
    "5 lbs": 3 * 200, // 3 bags, 5lb each
  },
  // flavored travel pack set
  9107582288185: 10 * 1.5 * 2.5, // 10 bags of 1.5oz
};

function useIsMobile() {
  const [windowSize, setWindowSize] = React.useState({
    width: 0,
    height: 0,
  });

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  React.useLayoutEffect(() => {
    handleSize();
    window.addEventListener("resize", handleSize);
    return () => {
      window.removeEventListener("resize", handleSize);
    };
  }, []);

  return windowSize.width < 500;
}

function getProductCosts(
  variant: any,
  quantity: any,
  subscriptionItems: any,
): any {
  if (!variant || !quantity) {
    return {
      subscribe_and_save_total_cost: 0,
      subscribe_and_save_discounted_cost: 0,
      one_time_total_cost: 0,
      one_time_compare_at_cost: 0,
    };
  }

  let qty = 0;
  subscriptionItems.forEach((item: any) => (qty += item.quantity));
  qty += quantity;

  // get tier
  let plan = plans.base;
  if (qty >= plans.elite.bag_min) {
    plan = plans.elite;
  } else if (qty >= plans.pro.bag_min) {
    plan = plans.pro;
  }

  return {
    subscribe_and_save_total_cost: ((variant.price * quantity) / 100).toFixed(
      2,
    ),
    subscribe_and_save_discounted_cost: (
      (variant.price * quantity * (1 - plan.discount)) /
      100
    ).toFixed(2),
    one_time_total_cost: ((variant.price * quantity) / 100).toFixed(2),
    one_time_compare_at_cost: variant.compare_at_price
      ? ((variant.compare_at_price * quantity) / 100).toFixed(2)
      : ((variant.price * quantity) / 100).toFixed(2),
  };
}

function useProductCosts(variant: any, quantity: any): any {
  // @ts-ignore
  const [subscriptionItems, setSubscriptionItems] = React.useState(
    localStorage.getItem(referenceString)
      ? // @ts-ignore
        JSON.parse(localStorage.getItem(referenceString)).items
      : [],
  );

  React.useEffect(() => {
    const handler = (data: any) => {
      // @ts-ignore
      setSubscriptionItems(
        localStorage.getItem(referenceString)
          ? // @ts-ignore
            JSON.parse(localStorage.getItem(referenceString)).items
          : [],
      );
    };
    document.addEventListener("subscription_changed", handler);
    return () => {
      document.removeEventListener("subscription_changed", handler);
    };
  }, [setSubscriptionItems]);

  if (!variant || !quantity) {
    return {
      subscribe_and_save_total_cost: 0,
      subscribe_and_save_discounted_cost: 0,
      one_time_total_cost: 0,
      one_time_compare_at_cost: 0,
    };
  }

  let qty = 0;
  subscriptionItems.forEach((item: any) => (qty += item.quantity));
  qty += quantity;

  // get tier
  let plan = plans.base;
  if (qty >= plans.elite.bag_min) {
    plan = plans.elite;
  } else if (qty >= plans.pro.bag_min) {
    plan = plans.pro;
  }

  return {
    subscribe_and_save_total_cost: ((variant.price * quantity) / 100).toFixed(
      2,
    ),
    subscribe_and_save_discounted_cost: (
      (variant.price * quantity * (1 - plan.discount)) /
      100
    ).toFixed(2),
    one_time_total_cost: ((variant.price * quantity) / 100).toFixed(2),
    one_time_compare_at_cost: variant.compare_at_price
      ? ((variant.compare_at_price * quantity) / 100).toFixed(2)
      : ((variant.price * quantity) / 100).toFixed(2),
  };
}

function getServingCostSize(sizeString: any, productId: any) {
  let denominator = 1;
  if (productBundleServingSizes[productId]) {
    if (typeof productBundleServingSizes[productId] === "number") {
      denominator = productBundleServingSizes[productId];
    } else {
      denominator = productBundleServingSizes[productId][sizeString];
    }
  } else {
    switch (sizeString) {
      case "12 oz":
        denominator = 30;
        break;
      case "1 lbs":
        denominator = 40;
        break;
      case "5 lbs":
        denominator = 200;
        break;
    }
  }
  return denominator;
}

function isRechargeAvailableOnProduct(product: any) {
  let available = false;
  for (let i = 0; i < product.selling_plan_groups.length; i++) {
    if (product.selling_plan_groups[i].app_id === "294517") {
      available = true;
    }
  }
  return available;
}

function calculateServingCost(discount: any, product: any, sizeString: any) {
  let cost = product.price;
  for (let i = 0; i < product.variants.length; i++) {
    if (product.variants[i].option1 === sizeString) {
      cost = product.variants[i].price;
    }
  }
  let denominator = 1;
  switch (sizeString) {
    case "12 oz":
      denominator = 30;
      break;
    case "1 lbs":
      denominator = 40;
      break;
    case "5 lbs":
      denominator = 200;
      break;
  }

  return `$${((cost - cost * discount) / (denominator * 100)).toFixed(
    2,
  )} / serving`;
}

function calculateCurrentDiscountInformation() {
  const { items } = localStorage.getItem(referenceString)
    ? // @ts-ignore
      JSON.parse(localStorage.getItem(referenceString))
    : {
        items: [],
      };
  let plan: null | IPlan = null;
  let nextPlan: null | IPlan = null;

  // tier information
  if (items.length >= plans.elite.bag_min - 1) {
    plan = plans.elite;
  } else if (items.length >= plans.pro.bag_min - 1) {
    plan = plans.pro;
  } else if (items.length >= plans.base.bag_min - 1) {
    plan = plans.base;
  } else {
    plan = null;
  }

  // next plan
  if (items.length === plans.elite.bag_min - 1) {
    nextPlan = plans.elite;
  } else if (items.length === plans.pro.bag_min - 1) {
    nextPlan = plans.pro;
  } else {
    nextPlan = plans.base;
  }

  return {
    discount: plan ? plan.discount : 0.1,
    nextPlan,
  };
}

function ReviewSummary({ reviews }: any) {
  if (!reviews.rating) {
    return null;
  }
  const reviewRating = parseFloat(reviews.rating.value);
  const maxRating = parseFloat(reviews.rating.scale_max);
  if (reviewRating === 0) {
    return null;
  }
  const ceil = Math.ceil((reviewRating * 5) / maxRating);
  const arr: any = [];
  for (let i = 0; i < ceil; i++) {
    arr.push(i);
  }
  return (
    <div className="flex flex-row items-center">
      {arr.map((r, i) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-tan-600"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
            clipRule="evenodd"
          />
        </svg>
      ))}
      <span className="pl-2 text-base text-cyan-700 font-bold">
        ({reviews.rating_count})
      </span>
    </div>
  );
}

const useScreenSize = () => {
  const [screenSize, setScreenSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenSize;
};

function OnScrollBuyButton({
  product,
  variantID,
  productForm,
  setProductForm,
  variantQuantityMap,
  variant,
  variantCost,
  discountInformation,
  reviews,
  images,
}: any) {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const { width } = useScreenSize();
  const productCosts: any = useProductCosts(variant, productForm.quantity);

  const [isSelectingDelivery, setIsSelectingDelivery] = React.useState(false);
  const [isSelectingQuantity, setIsSelectingQuantity] = React.useState(false);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  React.useEffect(() => {
    const handler = () => {
      setIsLoading(false);
    };
    document.addEventListener("buy_button_complete", handler);
    return () => {
      document.removeEventListener("buy_button_complete", handler);
    };
  }, [setIsLoading]);

  React.useEffect(() => {
    const handler = () => {
      setIsLoading(true);
    };
    document.addEventListener("buy_button_retry", handler);
    return () => {
      document.removeEventListener("buy_button_retry", handler);
    };
  }, [setIsLoading]);

  if (
    product.tags.indexOf("Club Member Exclusive") !== -1 ||
    product.tags.indexOf("Product Launch") !== -1
  ) {
    return null;
  }

  // mobile -- desktop
  return scrollPosition > 1300 && width < 700 ? (
    <div className="fixed z-30 bottom-0 left-0 right-0 p-4 flex">
      <button
        data-testid="lrc-on-scroll-add-to-cart-button"
        onClick={() => {
          setIsLoading(true);
          document.dispatchEvent(
            new CustomEvent("buy_button", {
              detail: {
                available: product.available,
                variantId: variantID,
                isSubscription: productForm.isSubscription,
                quantity: productForm.quantity,
                product_hash: product.handle,
              },
            }),
          );
        }}
        disabled={
          (productForm.isSubscription &&
            !isRechargeAvailableOnProduct(product)) ||
          (!productForm.isSubscription &&
            (!product.available || variantQuantityMap[variantID] <= 0)) ||
          isLoading
        }
        className={`shadow-lg shadow-tan-900/50 rounded w-full text-base flex items-center justify-center text-center py-3 px-4 font-accent border ${
          !productForm.isSubscription &&
          (!product.available || variantQuantityMap[variantID] <= 0)
            ? "border-neutral-600 bg-neutral-100 text-neutral-600 hover:border-neutral-700 hover:text-neutral-700 hover:bg-neutral-200 cursor-not-allowed"
            : "border-tan-600 bg-tan-100 text-tan-600 hover:border-tan-700 hover:text-tan-700 hover:bg-tan-200 cursor-pointer"
        }`}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 text-tan-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : productForm.isSubscription ? (
          `Add to Bag - $${productCosts.subscribe_and_save_discounted_cost}`
        ) : product.available ? (
          `Add to Cart - $${productCosts.one_time_total_cost}`
        ) : (
          "Out of Stock"
        )}
      </button>
    </div>
  ) : scrollPosition > 860 && width >= 700 ? (
    <div className="fixed z-30 bottom-8 left-8 right-8 flex">
      <div className="w-full shadow-lg shadow-cyan-900/50 rounded-full border border-cyan-900/50 bg-white flex items-center space-x-4 p-4">
        <img
          src={images[0].thumbnail}
          loading="lazy"
          width="150"
          height="150"
          className="ml-4 w-16 h-16 object-contain"
          alt="Product image"
        />
        <div className="flex flex-col space-y-2">
          <h4 className="font-accent text-xl lg:text-2xl text-cyan-700 tracking-tight">
            {product.title}
          </h4>
          <ReviewSummary reviews={reviews} />
        </div>
        <div className="flex-1 justify-end flex space-x-8">
          <div className="hidden lg:flex items-center relative w-32 border rounded-md bg-white border-cyan-500 group hover:border-cyan-600 ">
            <span
              onClick={() => setIsSelectingQuantity(!isSelectingQuantity)}
              className="w-full text-base font-accent rounded p-3 ml-1 mb-0.5 cursor-pointer text-cyan-600 group-hover:text-cyan-700"
            >
              {productForm.quantity}
            </span>
            <span className="absolute bg-white text-sm z-10 -bottom-2 left-2 px-1">
              Quantity
            </span>
            {isSelectingQuantity ? (
              <div className="z-20 py-1 rounded-md bg-white border border-cyan-600 absolute -top-2 left-0 right-0 w-full -translate-y-full flex flex-col">
                <span
                  onClick={() => {
                    setProductForm({
                      ...productForm,
                      quantity: 1,
                    });
                    setIsSelectingQuantity(false);
                  }}
                  className="text-base font-accent rounded p-3 ml-1 cursor-pointer text-cyan-600 hover:text-cyan-700"
                >
                  1
                </span>
                <div className="w-full h-px bg-cyan-50" />
                <span
                  onClick={() => {
                    setProductForm({
                      ...productForm,
                      quantity: 2,
                    });
                    setIsSelectingQuantity(false);
                  }}
                  className="text-base font-accent rounded p-3 ml-1 cursor-pointer text-cyan-600 hover:text-cyan-700"
                >
                  2
                </span>
                <div className="w-full h-px bg-cyan-50" />
                <span
                  onClick={() => {
                    setProductForm({
                      ...productForm,
                      quantity: 3,
                    });
                    setIsSelectingQuantity(false);
                  }}
                  className="text-base font-accent rounded p-3 ml-1 cursor-pointer text-cyan-600 hover:text-cyan-700"
                >
                  3
                </span>
              </div>
            ) : null}
          </div>
          {isRechargeAvailableOnProduct(product) ? (
            <div className="hidden lg:flex items-center relative w-48 border rounded-md bg-white border-cyan-500 group hover:border-cyan-600 ">
              <span
                onClick={() => {
                  if (
                    !product.available ||
                    !(variantQuantityMap[variantID] > 0)
                  ) {
                    return;
                  }
                  setIsSelectingDelivery(!isSelectingDelivery);
                }}
                className={`w-full text-base font-accent rounded p-3 mb-0.5 text-cyan-600 group-hover:text-cyan-700 ${
                  !product.available || !(variantQuantityMap[variantID] > 0)
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {productForm.isSubscription
                  ? "Ship every 30 days"
                  : "One-time order"}
              </span>
              <span className="absolute bg-white text-sm z-10 -bottom-2 left-2 px-1">
                Delivery
              </span>
              {isSelectingDelivery ? (
                <div className="z-20 py-1 rounded-md bg-white border border-cyan-600 absolute -top-2 left-0 right-0 w-full -translate-y-full flex flex-col">
                  <span
                    onClick={() => {
                      setProductForm({
                        ...productForm,
                        isSubscription: true,
                      });
                      setIsSelectingDelivery(false);
                    }}
                    className="text-base font-accent rounded p-3 cursor-pointer text-cyan-600 hover:text-cyan-700"
                  >
                    Ship every 30 days
                  </span>
                  <div className="w-full h-px bg-cyan-50" />
                  <span
                    onClick={() => {
                      setProductForm({
                        ...productForm,
                        isSubscription: false,
                      });
                      setIsSelectingDelivery(false);
                    }}
                    className="text-base font-accent rounded p-3 cursor-pointer text-cyan-600 hover:text-cyan-700"
                  >
                    One-time order
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-col justify-center w-48 items-end">
            <div className="flex items-center space-x-2">
              {!productForm.isSubscription ? (
                variantQuantityMap[variantID] > 0 ? (
                  productCosts.one_time_compare_at_cost !=
                  productCosts.one_time_total_cost ? (
                    <React.Fragment>
                      <span
                        className={`line-through ${
                          !productForm.isSubscription
                            ? "text-neutral-500"
                            : "text-neutral-300"
                        }`}
                      >
                        ${productCosts.one_time_compare_at_cost}
                      </span>
                      <span
                        className={`font-medium text-right ${
                          !productForm.isSubscription
                            ? "text-cyan-700"
                            : "text-neutral-300"
                        }`}
                      >
                        ${productCosts.one_time_total_cost}
                      </span>
                    </React.Fragment>
                  ) : (
                    <span
                      className={`font-medium text-right w-full ${
                        productForm.isSubscription
                          ? "text-neutral-300"
                          : "text-neutral-500"
                      }`}
                    >
                      ${productCosts.one_time_total_cost}
                    </span>
                  )
                ) : (
                  <span className="text-neutral-300">sold out</span>
                )
              ) : !isRechargeAvailableOnProduct(product) ? (
                <span className="text-neutral-300">unavailable</span>
              ) : (
                <React.Fragment>
                  <span
                    className={`line-through ${
                      productForm.isSubscription
                        ? "text-neutral-500"
                        : "text-neutral-300"
                    }`}
                  >
                    ${productCosts.subscribe_and_save_total_cost}
                  </span>
                  <span
                    className={`font-medium ${
                      productForm.isSubscription
                        ? "text-cyan-700"
                        : "text-neutral-300"
                    }`}
                  >
                    ${productCosts.subscribe_and_save_discounted_cost}
                  </span>
                </React.Fragment>
              )}
            </div>
            {product.tags.indexOf("All Coffee") !== -1 ? (
              <span className="text-base w-full text-right">
                $
                {(
                  (productForm.isSubscription
                    ? productCosts.subscribe_and_save_discounted_cost
                    : productCosts.one_time_total_cost) /
                  (getServingCostSize(variant.option1, product.id) *
                    productForm.quantity)
                ).toFixed(2)}{" "}
                / serving
              </span>
            ) : null}
          </div>
          <button
            data-testid="lrc-on-scroll-add-to-cart-button"
            onClick={() => {
              setIsLoading(true);
              document.dispatchEvent(
                new CustomEvent("buy_button", {
                  detail: {
                    available: product.available,
                    variantId: variantID,
                    isSubscription: productForm.isSubscription,
                    quantity: productForm.quantity,
                    product_hash: product.handle,
                  },
                }),
              );
            }}
            disabled={
              (productForm.isSubscription &&
                !isRechargeAvailableOnProduct(product)) ||
              (!productForm.isSubscription &&
                (!product.available || variantQuantityMap[variantID] <= 0)) ||
              isLoading
            }
            className={`rounded-full text-base flex items-center w-40 justify-center text-center py-3 px-4 font-accent border ${
              !productForm.isSubscription &&
              (!product.available || variantQuantityMap[variantID] <= 0)
                ? "border-neutral-600 bg-neutral-100 text-neutral-600 hover:border-neutral-700 hover:text-neutral-700 hover:bg-neutral-200 cursor-not-allowed"
                : "border-tan-600 bg-tan-100 text-tan-600 hover:border-tan-700 hover:text-tan-700 hover:bg-tan-200 cursor-pointer"
            }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-4 w-4 text-tan-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : productForm.isSubscription ? (
              "Add to Bag"
            ) : product.available ? (
              "Add to Cart"
            ) : (
              "Out of Stock"
            )}
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

function Tags({ product }: any) {
  const tags = product.tags.filter(
    (f: any) =>
      [
        "All Coffee",
        "SEASONAL_OUT_OF_STOCK",
        "Flavor",
        "Bundle",
        "Traditional",
        "Gear",
        "__hidden",
        "bonsai_excluded",
        "Exclude From Back In Stock",
        "exclude_rebuy",
        "exclude_recommendations",
        "exclude_review",
        "hidden",
        "Hidden recommendation",
        "Hide",
        "judgeme_excluded",
        "NO",
        "nocart",
        "not-on-sale",
        "SEARCHANISE_IGNORE",
        "spo-default",
        "spo-disabled",
        "Medium Roast",
        "Set",
        "Light Roast",
        "Dark Roast",
        "free-gift",
        "Members Only",
        "Club Member Exclusive",
        "Product Launch",
      ].indexOf(f) == -1,
  );
  return (
    <div className="flex flex-row items-center mt-2 space-x-2">
      {tags.map((t: any) => (
        <span
          key={t}
          className="inline-flex items-center rounded-full bg-cyan-50 px-2 py-1 text-xs text-cyan-700 ring-1 ring-inset ring-cyan-600/10 font-semibold"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function getDefaultOptionValues(product: any, options: any) {
  let defaultVariantIndex = 0;
  for (let i = 0; i < product.variants.length; i++) {
    const v = product.variants[i];
    if (
      v.options.indexOf("Fresh Ground") !== -1 &&
      v.options.indexOf("1 lbs") !== -1
    ) {
      defaultVariantIndex = i;
    }
  }
  const d = product.variants[defaultVariantIndex];
  const keys = options.map((o: any) => o.name);
  const productFormDefault: any = {};
  for (let i = 0; i < keys.length; i++) {
    productFormDefault[keys[i]] = d.options[i];
  }
  return productFormDefault;
}

function generateOptionsFromProductVariants(product: any) {
  // build option array
  const optionNames = product.options;
  const options: any = {};
  optionNames.forEach((on: any) => {
    options[on] = {
      name: on,
      values: [],
    };
  });

  product.variants.forEach((variant: any) => {
    variant.options.forEach((opt: any, idx: any) => {
      const optionIdx = optionNames[idx];
      if (options[optionIdx].values.indexOf(opt) == -1) {
        options[optionIdx].values.push(opt);
      }
    });
  });

  const retArr: any = [];
  Object.keys(options).forEach((key) => {
    retArr.push(options[key]);
  });

  return retArr;
}

export function ProductForm(args: any) {
  const product = JSON.parse(
    decodeURIComponent(
      args.container.attributes.getNamedItem("productjson").value,
    ),
  );
  const reviews = JSON.parse(
    decodeURIComponent(args.container.attributes.getNamedItem("reviews").value),
  );
  const variantQuantityMap = JSON.parse(
    decodeURIComponent(
      args.container.attributes.getNamedItem("variantquantitymap").value,
    ),
  );
  const isMobile = useIsMobile();
  const [images, setImages] = React.useState(
    product.images.map((img: string) => ({
      original: `https:${img}${isMobile ? "&width=450" : "&width=1000"}`,
      thumbnail: `https:${img}${isMobile ? "&width=150" : "&width=250"}`,
      originalHeight: "200",
      originalWidth: "200",
    })),
  );
  const options = generateOptionsFromProductVariants(product);

  console.log(product);

  const [productForm, setProductForm] = React.useState({
    hasSellingPlan: isRechargeAvailableOnProduct(product),
    options: getDefaultOptionValues(product, options),
    isSubscription: isRechargeAvailableOnProduct(product),
    quantity: 1,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  let variantID: any = null;
  let variantCost = 0;
  let variant: any = null;

  if (product && product.variants) {
    for (let i = 0; i < product.variants.length; i++) {
      let foundMatch = true;
      const productFormOptionKeyValues = Object.keys(productForm.options).map(
        (k) => productForm.options[k],
      );
      for (let j = 0; j < productFormOptionKeyValues.length; j++) {
        // can just substring match on object.keys values because we
        // should have all unique options
        if (
          !product.variants[i].options.includes(productFormOptionKeyValues[j])
        ) {
          foundMatch = false;
          break;
        }
      }
      if (foundMatch) {
        variantID = product.variants[i].id;
        variantCost = product.variants[i].price;
        variant = product.variants[i];
      }
    }
  }

  const [discountInformation, setDiscountInformation] = React.useState(
    calculateCurrentDiscountInformation(),
  );

  React.useEffect(() => {
    const handler = () => {
      setIsLoading(false);
    };
    document.addEventListener("buy_button_complete", handler);
    return () => {
      document.removeEventListener("buy_button_complete", handler);
    };
  }, [setIsLoading]);

  React.useEffect(() => {
    const handler = () => {
      setIsLoading(true);
    };
    document.addEventListener("buy_button_retry", handler);
    return () => {
      document.removeEventListener("buy_button_retry", handler);
    };
  }, [setIsLoading]);

  const [subscriptionItems, setSubscriptionItems] = React.useState(
    localStorage.getItem(referenceString)
      ? // @ts-ignore
        JSON.parse(localStorage.getItem(referenceString)).items
      : [],
  );
  React.useEffect(() => {
    const handler = (data: any) => {
      setDiscountInformation({
        discount: data.detail.newDiscount,
        nextPlan: data.detail.nextPlan,
      });
      setSubscriptionItems(
        localStorage.getItem(referenceString)
          ? //   @ts-ignore
            JSON.parse(localStorage.getItem(referenceString)).items
          : [],
      );
    };
    document.addEventListener("subscription_changed", handler);
    return () => {
      document.removeEventListener("subscription_changed", handler);
    };
  }, [discountInformation, setDiscountInformation, setSubscriptionItems]);

  const [amountUntilFreeShipping, setAmountUntilFreeShipping] =
    React.useState(5900);
  React.useEffect(() => {
    const handler = (data: any) => {
      setAmountUntilFreeShipping(data.detail.amountUntilFreeShipping);
    };
    document.addEventListener("cart_count_change", handler);
    return () => {
      document.removeEventListener("cart_count_change", handler);
    };
  }, [setAmountUntilFreeShipping]);

  const productCosts = useProductCosts(variant, productForm.quantity);

  const [isImageGalleryFullscreen, setIsImageGalleryFullscreen] =
    useState<boolean>(false);
  const ImageGalleryRef = useRef<ImageGallery>();
  const onImageGalleryOnClick = () => {
    if (ImageGalleryRef.current) {
      if (isImageGalleryFullscreen) {
        ImageGalleryRef.current.exitFullScreen();
      } else {
        ImageGalleryRef.current.fullScreen();
      }
      setIsImageGalleryFullscreen(!isImageGalleryFullscreen);
    }
  };

  React.useEffect(() => {
    let originalWidth = isMobile ? "&width=650" : "&width=2000";
    let thumbnailWidth = isMobile ? "&width=250" : "&width=500";
    if (variant && variant.featured_image) {
      setImages([
        {
          original: `https:${variant.featured_image.src}${originalWidth}`,
          thumbnail: `https:${variant.featured_image.src}${thumbnailWidth}`,
          originalHeight: "200",
          originalWidth: "200",
        },
        ...product.images.map((img: string) => ({
          original: `https:${img}${originalWidth}`,
          thumbnail: `https:${img}${thumbnailWidth}`,
          originalHeight: "200",
          originalWidth: "200",
        })),
      ]);
    } else {
      setImages(
        product.images.map((img: string) => ({
          original: `https:${img}${originalWidth}`,
          thumbnail: `https:${img}${thumbnailWidth}`,
          originalHeight: "200",
          originalWidth: "200",
        })),
      );
    }
  }, [variantID, isImageGalleryFullscreen]);

  const should_show_sold_out_notification =
    (!(variantQuantityMap[variantID] > 0) &&
      !isRechargeAvailableOnProduct(product)) ||
    product?.tags?.includes("SEASONAL_OUT_OF_STOCK");

  return (
    <div className="relative bg-cyan-50 bg-opacity-20 z-30">
      {product.type !== "Gift" ? (
        <OnScrollBuyButton
          images={images}
          product={product}
          variantID={variantID}
          productForm={productForm}
          setProductForm={setProductForm}
          variantQuantityMap={variantQuantityMap}
          variant={variant}
          variantCost={variantCost}
          discountInformation={discountInformation}
          reviews={reviews}
        />
      ) : null}

      <div className="flex flex-col p-4 lg:py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="flex flex-col">
            <div className="flex flex-col lg:hidden mb-4">
              <h1 className="font-accent text-2xl text-cyan-700 tracking-tight">
                {product.title}
              </h1>
              <ReviewSummary reviews={reviews} />
              <Tags product={product} />
            </div>
            <ImageGallery
              ref={ImageGalleryRef as LegacyRef<ImageGallery>}
              items={images}
              showPlayButton={false}
              onClick={onImageGalleryOnClick}
              renderFullscreenButton={() => (
                <Fullscreen
                  isFullscreen={isImageGalleryFullscreen}
                  onClick={onImageGalleryOnClick}
                />
              )}
              additionalClass="z-60 bg-center bg-cover bg-[url('https://cdn.shopify.com/s/files/1/0761/6924/9081/files/lrc-product-background.webp?v=1722464283')]"
            />
          </div>
          <div
            id="lrc-product-form"
            className="flex flex-col space-y-4 lg:space-y-6"
          >
            <div className="flex-col hidden lg:flex mt-4">
              <h1 className="font-accent text-4xl text-cyan-700">
                {product.title}
              </h1>
              <ReviewSummary reviews={reviews} />
              <Tags product={product} />
            </div>
            <div
              className={`grid gap-4 ${
                product.variants.length < 2
                  ? "grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {options
                .filter(
                  (option: any) =>
                    option.values.indexOf("Default Title") === -1,
                )
                .map((option: any, i: any) => {
                  return (
                    <div key={i} className="flex flex-col space-y-1.5">
                      <p
                        className={`font-medium text-sm uppercase tracking-wider text-cyan-600`}
                      >
                        {option.name === "Size" &&
                        product &&
                        product.tags &&
                        product.tags.includes("All Coffee")
                          ? "Bag size"
                          : option.name === "Form"
                          ? "Bean Style"
                          : option.name}
                      </p>
                      <div
                        className={`grid gap-4 ${
                          product.variants.length < 2
                            ? "grid-cols-1 h-full"
                            : "grid-cols-2 lg:grid-cols-3"
                        }`}
                      >
                        {option.values.map((v: any) => {
                          if (
                            product &&
                            product.tags &&
                            product.tags.includes("All Coffee")
                          ) {
                            switch (option.name) {
                              case "Size":
                                let optionVariant = null;
                                for (
                                  let i = 0;
                                  i < product.variants.length;
                                  i++
                                ) {
                                  let foundMatch = true;
                                  const productFormOptionKeyValues =
                                    Object.keys(productForm.options).map(
                                      (k) => {
                                        if (k == option.name) {
                                          return v;
                                        } else {
                                          return productForm.options[k];
                                        }
                                      },
                                    );
                                  for (
                                    let j = 0;
                                    j < productFormOptionKeyValues.length;
                                    j++
                                  ) {
                                    // can just substring match on object.keys values because we
                                    // should have all unique options
                                    if (
                                      !product.variants[i].options.includes(
                                        productFormOptionKeyValues[j],
                                      )
                                    ) {
                                      foundMatch = false;
                                      break;
                                    }
                                  }
                                  if (foundMatch) {
                                    optionVariant = product.variants[i];
                                  }
                                }
                                const optionCosts = getProductCosts(
                                  optionVariant,
                                  productForm.quantity,
                                  subscriptionItems,
                                );
                                return (
                                  <button
                                    data-testid={`product-page-option-${option.name}-${v}`}
                                    key={v}
                                    onClick={() => {
                                      const newOptions = Object.assign(
                                        {},
                                        productForm.options,
                                      );
                                      newOptions[option.name] = v;
                                      setProductForm({
                                        ...productForm,
                                        options: newOptions,
                                      });
                                    }}
                                    className={`text-base font-accent border-[0.5px] rounded p-3 relative flex flex-col justify-center items-center ${
                                      productForm.options[option.name] === v
                                        ? "bg-cyan-200/90 border-cyan-600 text-cyan-700"
                                        : "border-cyan-500 text-cyan-600 hover:bg-cyan-100 hover:border-cyan-600 hover:text-cyan-700"
                                    }`}
                                  >
                                    <span className="text-lg font-accent">
                                      {v}
                                    </span>
                                    <span className="text-sm -mt-1">
                                      $
                                      {(
                                        (productForm.isSubscription
                                          ? optionCosts.subscribe_and_save_discounted_cost
                                          : optionCosts.one_time_total_cost) /
                                        (getServingCostSize(v, product.id) *
                                          productForm.quantity)
                                      ).toFixed(2)}{" "}
                                      / serving
                                    </span>
                                  </button>
                                );
                              case "Form":
                                return (
                                  <button
                                    data-testid={`product-page-option-${option.name}-${v}`}
                                    key={v}
                                    onClick={() => {
                                      const newOptions = Object.assign(
                                        {},
                                        productForm.options,
                                      );
                                      newOptions[option.name] = v;
                                      setProductForm({
                                        ...productForm,
                                        options: newOptions,
                                      });
                                    }}
                                    className={`text-base font-accent border-[0.5px] rounded p-3 relative flex items-center justify-center space-x-2 pl-0 ${
                                      productForm.options[option.name] === v
                                        ? "bg-cyan-200/90 border-cyan-600 text-cyan-700"
                                        : "border-cyan-500 text-cyan-600 hover:bg-cyan-100 hover:border-cyan-600 hover:text-cyan-700"
                                    }`}
                                  >
                                    <div className="w-8 h-8">
                                      {v === "Fresh Ground" ? (
                                        <FreshGroundSVG />
                                      ) : (
                                        <WholeBeanSVG />
                                      )}
                                    </div>
                                    <span className="text-left lowercase text-sm lg:text-base">
                                      {v}
                                    </span>
                                  </button>
                                );
                              case "Roast":
                                return (
                                  <button
                                    data-testid={`product-page-option-${option.name}-${v}`}
                                    key={v}
                                    onClick={() => {
                                      const newOptions = Object.assign(
                                        {},
                                        productForm.options,
                                      );
                                      newOptions[option.name] = v;
                                      setProductForm({
                                        ...productForm,
                                        options: newOptions,
                                      });
                                    }}
                                    className={`text-base font-accent border-[0.5px] rounded p-3 relative flex items-center justify-center space-x-2 pl-0 ${
                                      productForm.options[option.name] === v
                                        ? "bg-cyan-200/90 border-cyan-600 text-cyan-700"
                                        : "border-cyan-500 text-cyan-600 hover:bg-cyan-100 hover:border-cyan-600 hover:text-cyan-700"
                                    }`}
                                  >
                                    <div className="w-8 h-8">
                                      {v === "Fresh Ground" ? (
                                        <FreshGroundSVG />
                                      ) : (
                                        <WholeBeanSVG />
                                      )}
                                    </div>
                                    <span className="text-left lowercase text-sm lg:text-base">
                                      {v}
                                    </span>
                                  </button>
                                );
                              default:
                                return (
                                  <button
                                    data-testid={`product-page-option-${option.name}-${v}`}
                                    key={v}
                                    onClick={() => {
                                      const newOptions = Object.assign(
                                        {},
                                        productForm.options,
                                      );
                                      newOptions[option.name] = v;
                                      setProductForm({
                                        ...productForm,
                                        options: newOptions,
                                      });
                                    }}
                                    className={`text-base font-accent border-[0.5px] rounded p-3 relative flex flex-col justify-center items-center ${
                                      productForm.options[option.name] === v
                                        ? "bg-cyan-200/90 border-cyan-600 text-cyan-700"
                                        : "border-cyan-500 text-cyan-600 hover:bg-cyan-100 hover:border-cyan-600 hover:text-cyan-700"
                                    }`}
                                  >
                                    <span className="text-lg font-accent">
                                      {v}
                                    </span>
                                  </button>
                                );
                            }
                          } else {
                            return (
                              <button
                                data-testid={`product-page-option-${option.name}-${v}`}
                                key={v}
                                onClick={() => {
                                  const newOptions = Object.assign(
                                    {},
                                    productForm.options,
                                  );
                                  newOptions[option.name] = v;
                                  setProductForm({
                                    ...productForm,
                                    options: newOptions,
                                  });
                                }}
                                className={`text-base font-accent border-[0.5px] rounded p-3 relative flex flex-col justify-center items-center ${
                                  productForm.options[option.name] === v
                                    ? "bg-cyan-200/90 border-cyan-600 text-cyan-700"
                                    : "border-cyan-500 text-cyan-600 hover:bg-cyan-100 hover:border-cyan-600 hover:text-cyan-700"
                                }`}
                              >
                                <span className="text-lg font-accent">{v}</span>
                              </button>
                            );
                          }
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
            {product.tags.indexOf("Product Launch") !== -1 ? (
              <ClubPromoRoastInner
                title="Coming Soon!"
                description="Through Wednesday, October 16th get Long Run's new electrolyte powder free with any order $79+"
              />
            ) : product.type == "Gift" ? (
              <div className="bg-neutral-50 w-full h-64 flex items-center justify-center">
                <p className="font-accent text-lg text-neutral-700">
                  Not for Purchase
                </p>
              </div>
            ) : should_show_sold_out_notification ? (
              <BackInStockNotificationSignUp
                variant_id={variantID}
                product={product}
              />
            ) : (
              <React.Fragment>
                <div className="flex flex-col space-y-3 pt-2 lg:pt-0">
                  <button
                    data-testid="lrc-select-subscription-checkout"
                    disabled={!isRechargeAvailableOnProduct(product)}
                    onClick={() => {
                      if (isRechargeAvailableOnProduct(product)) {
                        setProductForm({
                          ...productForm,
                          isSubscription: true,
                        });
                      }
                    }}
                    className={`flex items-center space-x-2`}
                  >
                    <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border border-cyan-700 flex items-center justify-center">
                      {productForm.isSubscription ? (
                        <div className="h-2 w-2 lg:w-3 lg:h-3 rounded-full bg-cyan-400" />
                      ) : null}
                    </div>
                    <h4
                      className={`text-left flex-1 font-accent text-xl lg:text-2xl tracking-tight ${
                        productForm.isSubscription
                          ? "text-cyan-700"
                          : "text-neutral-300"
                      } ${
                        !isRechargeAvailableOnProduct(product)
                          ? "line-through"
                          : ""
                      }`}
                    >
                      Subscribe & Save
                    </h4>
                    <div className="text-sm flex space-x-1 font-base">
                      {!isRechargeAvailableOnProduct(product) ? (
                        <span className="text-neutral-300">unavailable</span>
                      ) : (
                        <React.Fragment>
                          <span
                            className={`line-through ${
                              productForm.isSubscription
                                ? "text-neutral-500"
                                : "text-neutral-300"
                            }`}
                          >
                            ${productCosts.subscribe_and_save_total_cost}
                          </span>
                          <span
                            className={`font-medium ${
                              productForm.isSubscription
                                ? "text-cyan-700"
                                : "text-neutral-300"
                            }`}
                          >
                            ${productCosts.subscribe_and_save_discounted_cost}
                          </span>
                        </React.Fragment>
                      )}
                    </div>
                  </button>
                  {product &&
                  product.tags.indexOf("Members Only") !== -1 ? null : (
                    <button
                      data-testid="lrc-select-one-time-checkout"
                      disabled={
                        !product.available ||
                        !(variantQuantityMap[variantID] > 0)
                      }
                      onClick={() =>
                        setProductForm({
                          ...productForm,
                          isSubscription: false,
                        })
                      }
                      className={`flex items-center space-x-2 ${
                        !product.available ||
                        !(variantQuantityMap[variantID] > 0)
                          ? "cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border border-cyan-700 flex items-center justify-center">
                        {!productForm.isSubscription ? (
                          <div className="h-2 w-2 lg:w-3 lg:h-3 rounded-full bg-cyan-400" />
                        ) : null}
                      </div>
                      <h4
                        className={`text-left flex-1 font-accent text-xl lg:text-2xl tracking-tight ${
                          !productForm.isSubscription
                            ? "text-cyan-700"
                            : "text-neutral-300"
                        } ${
                          variantQuantityMap[variantID] <= 0
                            ? "line-through"
                            : ""
                        }`}
                      >
                        One-Time Purchase
                      </h4>
                      <div className="text-sm flex space-x-1 font-base">
                        {variantQuantityMap[variantID] > 0 ? (
                          productCosts.one_time_compare_at_cost !=
                          productCosts.one_time_total_cost ? (
                            <React.Fragment>
                              <span
                                className={`line-through ${
                                  !productForm.isSubscription
                                    ? "text-neutral-500"
                                    : "text-neutral-300"
                                }`}
                              >
                                ${productCosts.one_time_compare_at_cost}
                              </span>
                              <span
                                className={`font-medium ${
                                  !productForm.isSubscription
                                    ? "text-cyan-700"
                                    : "text-neutral-300"
                                }`}
                              >
                                ${productCosts.one_time_total_cost}
                              </span>
                            </React.Fragment>
                          ) : (
                            <span
                              className={`font-medium text-sm ${
                                productForm.isSubscription
                                  ? "text-neutral-300"
                                  : "text-neutral-500"
                              }`}
                            >
                              ${productCosts.one_time_total_cost}
                            </span>
                          )
                        ) : (
                          <span className="text-neutral-300">sold out</span>
                        )}
                      </div>
                    </button>
                  )}
                </div>
                <div className="lg:pt-1 flex flex-col space-y-4 lg:space-y-8">
                  {productForm.isSubscription ? (
                    <div className="grid grid-cols-2 gap-y-1">
                      {[
                        "Save 10-25%",
                        "Free shipping",
                        "Experimental samples",
                        "Free welcome gear",
                      ].map((p) => (
                        <div key={p} className="flex items-center space-x-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 text-cyan-400"
                          >
                            <path
                              fillRule="evenodd"
                              d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-cyan-800 text-base">{p}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <div
                    data-testid="product-page-purchase-quantity-selector"
                    className="grid grid-cols-3 gap-x-2"
                  >
                    <button
                      data-testid="product-page-purchase-quantity-selector-1"
                      onClick={() =>
                        setProductForm({
                          ...productForm,
                          quantity: 1,
                        })
                      }
                      className={`text-base font-accent border-[0.5px] rounded p-3 relative flex flex-col items-center justify-center space-y-2 ${
                        productForm.quantity === 1
                          ? "bg-cyan-200/90 border-cyan-600 text-cyan-700"
                          : "border-cyan-500 text-cyan-600 hover:bg-cyan-100 hover:border-cyan-600 hover:text-cyan-700"
                      }`}
                    >
                      <span className="text-left lowercase text-sm lg:text-base">
                        1
                      </span>
                      {!productForm.isSubscription &&
                      amountUntilFreeShipping - variantCost >= 0 ? null : (
                        <span className="text-left text-[0.5rem] lg:text-xs leading-[0.5rem] absolute bottom-0 w-auto py-1 px-2 mx-auto transform translate-y-1/2 bg-cyan-50 rounded-full border border-cyan-500">
                          Free Shipping
                        </span>
                      )}
                    </button>
                    <button
                      data-testid="product-page-purchase-quantity-selector-2"
                      onClick={() =>
                        setProductForm({
                          ...productForm,
                          quantity: 2,
                        })
                      }
                      className={`text-base font-accent border-[0.5px] rounded p-3 relative flex flex-col items-center justify-center space-y-2 ${
                        productForm.quantity === 2
                          ? "bg-cyan-200/90 border-cyan-600 text-cyan-700"
                          : "border-cyan-500 text-cyan-600 hover:bg-cyan-100 hover:border-cyan-600 hover:text-cyan-700"
                      }`}
                    >
                      <span className="text-left lowercase text-sm lg:text-base">
                        2
                      </span>
                      {!productForm.isSubscription &&
                      amountUntilFreeShipping - variantCost * 2 >= 0 ? null : (
                        <span className="text-left text-[0.5rem] lg:text-xs leading-[0.5rem] absolute bottom-0 w-auto py-1 px-2 mx-auto transform translate-y-1/2 bg-cyan-50 rounded-full border border-cyan-500">
                          Free Shipping
                        </span>
                      )}
                    </button>
                    <button
                      data-testid="product-page-purchase-quantity-selector-3"
                      onClick={() =>
                        setProductForm({
                          ...productForm,
                          quantity: 3,
                        })
                      }
                      className={`text-base font-accent border-[0.5px] rounded p-3 relative flex flex-col items-center justify-center space-y-2 ${
                        productForm.quantity === 3
                          ? "bg-cyan-200/90 border-cyan-600 text-cyan-700"
                          : "border-cyan-500 text-cyan-600 hover:bg-cyan-100 hover:border-cyan-600 hover:text-cyan-700"
                      }`}
                    >
                      <span className="text-left lowercase text-sm lg:text-base">
                        3
                      </span>
                      {!productForm.isSubscription &&
                      amountUntilFreeShipping - variantCost * 3 >= 0 ? null : (
                        <span className="text-left text-[0.5rem] lg:text-xs leading-[0.5rem] absolute bottom-0 w-auto py-1 px-2 mx-auto transform translate-y-1/2 bg-cyan-50 rounded-full border border-cyan-500">
                          Free Shipping
                        </span>
                      )}
                    </button>
                  </div>
                </div>
                <div className="lg:pt-1">
                  <button
                    data-testid="lrc-add-to-cart-button"
                    onClick={() => {
                      setIsLoading(true);
                      document.dispatchEvent(
                        new CustomEvent("buy_button", {
                          detail: {
                            available: product.available,
                            variantId: variantID,
                            isSubscription: productForm.isSubscription,
                            quantity: productForm.quantity,
                            product_hash: product.handle,
                          },
                        }),
                      );
                    }}
                    disabled={
                      (productForm.isSubscription &&
                        !isRechargeAvailableOnProduct(product)) ||
                      (!productForm.isSubscription &&
                        (!product.available ||
                          variantQuantityMap[variantID] <= 0)) ||
                      isLoading
                    }
                    className={`relative rounded w-full text-base flex items-center justify-center text-center py-3 px-4 font-accent border ${
                      !productForm.isSubscription &&
                      (!product.available || variantQuantityMap[variantID] <= 0)
                        ? "border-neutral-600 bg-neutral-100 text-neutral-600 hover:border-neutral-700 hover:text-neutral-700 hover:bg-neutral-200 cursor-not-allowed"
                        : "border-tan-600 bg-tan-100 text-tan-600 hover:border-tan-700 hover:text-tan-700 hover:bg-tan-200 cursor-pointer"
                    }`}
                  >
                    <span id="buy-button-reward-id" />
                    {isLoading ? (
                      <svg
                        className="animate-spin h-4 w-4 text-tan-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : productForm.isSubscription ? (
                      "Add to Bag"
                    ) : product.available ? (
                      "Add to Cart"
                    ) : (
                      "Out of Stock"
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 lg:px-4">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        viewBox="0 0 512 512"
                        className="w-6 h-6 text-cyan-800"
                      >
                        <path
                          fill="currentColor"
                          d="M491.729,112.971L259.261,0.745c-2.061-0.994-4.461-0.994-6.521,0L20.271,112.971c-2.592,1.251-4.239,3.876-4.239,6.754
                        v272.549c0,2.878,1.647,5.503,4.239,6.754l232.468,112.226c1.03,0.497,2.146,0.746,3.261,0.746s2.23-0.249,3.261-0.746
                        l232.468-112.226c2.592-1.251,4.239-3.876,4.239-6.754V119.726C495.968,116.846,494.32,114.223,491.729,112.971z M256,15.828
                        l215.217,103.897l-62.387,30.118c-0.395-0.301-0.812-0.579-1.27-0.8L193.805,45.853L256,15.828z M176.867,54.333l214.904,103.746
                        l-44.015,21.249L132.941,75.624L176.867,54.333z M396.799,172.307v78.546l-41.113,19.848v-78.546L396.799,172.307z
                        M480.968,387.568L263.5,492.55V236.658l51.873-25.042c3.73-1.801,5.294-6.284,3.493-10.015
                        c-1.801-3.729-6.284-5.295-10.015-3.493L256,223.623l-20.796-10.04c-3.731-1.803-8.214-0.237-10.015,3.493
                        c-1.801,3.73-0.237,8.214,3.493,10.015l19.818,9.567V492.55L31.032,387.566V131.674l165.6,79.945
                        c1.051,0.508,2.162,0.748,3.255,0.748c2.788,0,5.466-1.562,6.759-4.241c1.801-3.73,0.237-8.214-3.493-10.015l-162.37-78.386
                        l74.505-35.968L340.582,192.52c0.033,0.046,0.07,0.087,0.104,0.132v89.999c0,2.581,1.327,4.98,3.513,6.353
                        c1.214,0.762,2.599,1.147,3.988,1.147c1.112,0,2.227-0.247,3.26-0.746l56.113-27.089c2.592-1.251,4.239-3.875,4.239-6.754v-90.495
                        l69.169-33.392V387.568z"
                        />
                        <path
                          fill="currentColor"
                          d="M92.926,358.479L58.811,342.01c-3.732-1.803-8.214-0.237-10.015,3.493c-1.801,3.73-0.237,8.214,3.493,10.015
                        l34.115,16.469c1.051,0.508,2.162,0.748,3.255,0.748c2.788,0,5.466-1.562,6.759-4.241
                        C98.22,364.763,96.656,360.281,92.926,358.479z"
                        />
                        <path
                          fill="currentColor"
                          d="M124.323,338.042l-65.465-31.604c-3.731-1.801-8.214-0.237-10.015,3.494c-1.8,3.73-0.236,8.214,3.494,10.015
                        l65.465,31.604c1.051,0.507,2.162,0.748,3.255,0.748c2.788,0,5.466-1.562,6.759-4.241
                        C129.617,344.326,128.053,339.842,124.323,338.042z"
                        />
                      </svg>
                    </div>
                    <svg
                      viewBox="0 0 200 200"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-20 h-20 -m-4"
                    >
                      <path
                        fill="#AFE4EB"
                        d="M52.9,-17.1C61.2,8.1,55.3,38,38.1,49.9C20.9,61.8,-7.5,55.6,-29.5,39.8C-51.6,24,-67.3,-1.5,-61.3,-23.6C-55.3,-45.7,-27.6,-64.4,-2.6,-63.5C22.4,-62.7,44.7,-42.2,52.9,-17.1Z"
                        transform="translate(100 100)"
                      />
                    </svg>
                  </div>
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-20 h-20">
                        <div className="has-tooltip absolute right-2 bottom-2 z-10">
                          {/* {% render 'icon-info' %} */}
                          <span className="tooltip rounded w-[200px] shadow p-1.5 max-w-xs bg-tan-50 text-tan-700 text-sm text-center transform -translate-x-full mr-4">
                            We guarantee an excellent brand experience, or your
                            money back.
                          </span>
                        </div>
                        <svg
                          viewBox="0 0 512 512"
                          className="ml-[1.75rem] mt-6 w-6 h-6 text-cyan-800 relative"
                        >
                          <path
                            fill="currentColor"
                            d="M423.445,327.065a33.313,33.313,0,0,0-33.276-33.276h-100.7a138.457,138.457,0,0,0,.141-105.277,7.878,7.878,0,0,0-.415-.864,31.414,31.414,0,0,0-56.2,2.583,8.028,8.028,0,0,0-.661,2.668l-2.377,33.747A81.547,81.547,0,0,1,200.5,275.76c-6.182,2.17-17.5,9.846-47.026,37.941v-.839a16.7,16.7,0,0,0-16.684-16.683H52.805a16.7,16.7,0,0,0-16.683,16.683v167.6A16.7,16.7,0,0,0,52.805,497.15h83.98a16.7,16.7,0,0,0,16.684-16.683v-.735c23.094,5.094,35.147,11.148,49.206,24.208A29.265,29.265,0,0,0,223.193,512H353.368a33.26,33.26,0,0,0,25.607-54.5c10.389-6.249,17.78-17.437,17.78-29.324a33.112,33.112,0,0,0-7.011-20.41c10.582-6.267,18.174-17.836,18.174-30.143a33.091,33.091,0,0,0-6.211-19.339A33.332,33.332,0,0,0,423.445,327.065Zm-285.976,153.4a.71.71,0,0,1-.684.683H52.805a.709.709,0,0,1-.683-.683v-167.6a.71.71,0,0,1,.683-.683h83.98a.711.711,0,0,1,.684.683Zm252.7-136.125H362.364a8,8,0,1,0,0,16h12.278a17.3,17.3,0,0,1,17.276,17.276c0,9-8.894,18.156-18.022,18.946a33.154,33.154,0,0,0-10.417-1.669,8,8,0,0,0,0,16,17.2,17.2,0,0,1,5.93,1.048c.211.093.425.177.645.251a17.307,17.307,0,0,1,10.7,15.977c0,8.82-9.248,17.8-18.664,18.436a33.207,33.207,0,0,0-8.723-1.16,8,8,0,0,0,0,16,17.235,17.235,0,0,1,4.947.722c.189.068.382.13.578.184A17.277,17.277,0,0,1,353.368,496H223.193a13.389,13.389,0,0,1-9.629-3.782c-16.99-15.785-31.841-22.971-60.095-28.85V335.915l1.419-1.381c39.266-38.133,48.885-43.084,50.927-43.685a8.018,8.018,0,0,0,3.262-1.49,97.523,97.523,0,0,0,36.706-60.3,8.358,8.358,0,0,0,.106-.848l2.3-32.645a15.415,15.415,0,0,1,26.8-.52,122.526,122.526,0,0,1-5.169,103.027,8,8,0,0,0,7.083,11.72H390.169a17.277,17.277,0,0,1,0,34.553Zm-279.819-5.88v.965a8,8,0,0,1-16,0v-.965a8,8,0,0,1,16,0ZM350.4,68.582a8,8,0,0,0-6.858-5.493l-57.339-5.4L263.343,4.825a8,8,0,0,0-14.686,0L225.8,57.688l-57.338,5.4a8,8,0,0,0-4.538,13.967l43.213,38.072-12.582,56.2a8,8,0,0,0,11.881,8.632L256,150.628l49.562,29.333a8,8,0,0,0,11.881-8.632l-12.581-56.2,43.213-38.072A8,8,0,0,0,350.4,68.582Zm-59.663,37.671a8,8,0,0,0-2.518,7.75l9.574,42.765-37.713-22.321a8,8,0,0,0-8.15,0l-37.713,22.321L223.786,114a8,8,0,0,0-2.518-7.75l-32.881-28.97,43.63-4.11a8,8,0,0,0,6.592-4.79L256,28.159l17.391,40.224a8,8,0,0,0,6.592,4.79l43.631,4.11Zm200.506,9.207a8,8,0,0,0-6.858-5.493l-40.407-3.806L427.867,68.908a8,8,0,0,0-14.686,0l-16.106,37.253-40.408,3.806a8,8,0,0,0-4.538,13.968l30.453,26.829-8.866,39.606A8,8,0,0,0,385.6,199l34.927-20.671L455.451,199a8,8,0,0,0,11.882-8.632l-8.867-39.606,30.452-26.829A8,8,0,0,0,491.238,115.46Zm-46.9,26.429a8,8,0,0,0-2.518,7.75l5.859,26.17L424.6,162.15a8,8,0,0,0-8.15,0l-23.077,13.659,5.858-26.17a8,8,0,0,0-2.518-7.75L376.59,124.162l26.7-2.516a8,8,0,0,0,6.593-4.79l10.642-24.615,10.642,24.615a8,8,0,0,0,6.593,4.79l26.7,2.516Zm-289-31.922-40.407-3.806L98.819,68.908a8,8,0,0,0-14.686,0L68.027,106.161,27.62,109.967a8,8,0,0,0-4.538,13.968l30.452,26.829L44.667,190.37A8,8,0,0,0,56.549,199l34.927-20.671L126.4,199a8,8,0,0,0,11.881-8.632l-8.867-39.606,30.453-26.829a8,8,0,0,0-4.538-13.968Zm-40.044,31.922a8,8,0,0,0-2.518,7.75l5.858,26.169L95.551,162.15a8,8,0,0,0-8.15,0L64.323,175.809l5.859-26.17a8,8,0,0,0-2.518-7.75L47.542,124.162l26.7-2.516a8,8,0,0,0,6.593-4.79L91.476,92.242l10.642,24.614a8,8,0,0,0,6.592,4.79l26.7,2.516Z"
                          />
                        </svg>
                      </div>
                    </div>
                    <svg
                      viewBox="0 0 200 200"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-20 h-20 -m-4"
                    >
                      <path
                        fill="#AFE4EB"
                        d="M52.9,-17.1C61.2,8.1,55.3,38,38.1,49.9C20.9,61.8,-7.5,55.6,-29.5,39.8C-51.6,24,-67.3,-1.5,-61.3,-23.6C-55.3,-45.7,-27.6,-64.4,-2.6,-63.5C22.4,-62.7,44.7,-42.2,52.9,-17.1Z"
                        transform="translate(100 100)"
                      />
                    </svg>
                  </div>
                  <span className="font-accent text-cyan-700 text-xs text-center leading-[1rem]">
                    Free Shipping on Orders Over $59
                  </span>
                  <div className="font-accent text-cyan-700 text-xs text-center leading-[1rem]">
                    <span>100% Passion & Performance Guarantee</span>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
