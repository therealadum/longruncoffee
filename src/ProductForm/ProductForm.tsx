import React, { LegacyRef, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import "./style.css";
import Fullscreen from "./ImageGalleryFullscreenButton";
import ClubPromoRoastInner from "../ClubPromoRoast/inner";
import { plans, referenceString } from "../common/constants";

const productBundleServingSizes: any = {
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
  let plan = null;
  let nextPlan = null;

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
  const arr = [];
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

  if (product.tags.indexOf("Club Member Exclusive") !== -1) {
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

  let variantID = null;
  let variantCost = 0;
  let variant = null;

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

  const promotion_start_date = new Date("9/7/24");
  const promotion_end_date = new Date("9/12/24");
  promotion_start_date.setHours(0, 0, 0, 0);
  promotion_end_date.setHours(0, 0, 0, 0);

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
                                        <svg width="100%" viewBox="0 0 480 480">
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M146.827133,270.297302
                                        C151.251007,259.693726 160.986099,254.072372 171.251694,255.864075
                                        C181.226868,257.605103 189.003616,266.402008 189.329453,276.313232
                                        C189.689468,287.264709 183.141495,296.253479 172.566010,298.754150
                                        C164.710129,300.611664 157.607407,298.690277 151.973236,292.817322
                                        C145.964951,286.554443 144.154419,279.091583 146.827133,270.297302
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M210.560562,189.116791
                                        C195.449890,185.836929 188.452835,169.945557 195.234314,157.017227
                                        C199.918915,148.086395 210.864670,143.576157 220.801575,146.622971
                                        C231.221268,149.817810 237.613449,159.687531 236.246521,170.470428
                                        C234.971359,180.529190 226.022018,188.861557 215.975159,189.291870
                                        C214.316223,189.362900 212.648605,189.231308 210.560562,189.116791
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M261.495605,182.470642
                                        C253.735611,172.315460 253.778610,160.626297 261.351318,152.544403
                                        C268.468903,144.948242 280.461304,143.430893 289.268311,149.012253
                                        C299.637604,155.583679 302.527344,169.492371 295.644989,179.704071
                                        C288.676025,190.044296 274.606537,192.460526 264.366882,185.049622
                                        C263.427887,184.370056 262.618500,183.511444 261.495605,182.470642
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M189.210754,211.420486
                                        C189.541489,223.602570 184.637344,231.569870 174.958237,235.084763
                                        C166.203766,238.263901 156.518570,235.575836 150.641098,228.335678
                                        C144.900162,221.263702 143.933731,212.077652 148.291245,204.042984
                                        C152.823746,195.685654 160.172211,192.252808 169.422760,192.734375
                                        C177.888916,193.175110 185.491638,199.310074 188.244522,207.618851
                                        C188.609772,208.721268 188.861511,209.861328 189.210754,211.420486
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M256.829285,317.325867
                                        C261.835022,306.344421 270.998138,301.042267 281.268280,302.870087
                                        C291.118500,304.623138 298.809937,313.149628 299.324219,322.845428
                                        C299.824707,332.282257 295.850159,339.354370 287.695526,343.863922
                                        C280.066620,348.082764 270.139130,347.050507 263.779083,341.560242
                                        C256.381104,335.173920 253.989105,327.167572 256.829285,317.325867
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M204.396454,343.940735
                                        C195.420990,338.638947 191.430893,330.915497 192.918686,321.135376
                                        C194.299606,312.057922 199.690323,305.657166 208.908401,303.376312
                                        C217.953003,301.138397 225.682419,303.700104 231.653076,310.893860
                                        C237.723770,318.208130 237.942520,329.782928 232.353546,337.349609
                                        C225.996841,345.955658 215.720734,348.476196 204.396454,343.940735
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M308.942627,198.944153
                                        C316.605652,192.392838 324.848663,190.610611 333.790741,194.755066
                                        C341.722290,198.431168 345.954224,204.959412 346.294647,213.703262
                                        C346.669037,223.319031 341.188599,231.545853 332.558228,234.878952
                                        C324.070221,238.157089 314.273529,235.866028 308.309357,229.208130
                                        C302.050140,222.220871 300.845306,212.542404 305.304138,204.118500
                                        C306.228882,202.371384 307.540527,200.829056 308.942627,198.944153
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M307.080750,264.223206
                                        C314.863770,255.894165 323.407593,253.598129 332.510529,257.162323
                                        C340.872406,260.436401 346.274811,268.301483 346.336487,277.290924
                                        C346.400085,286.559418 341.047852,294.521362 332.466278,297.924072
                                        C324.237854,301.186768 314.893280,299.077484 308.588440,292.534363
                                        C302.536743,286.253937 300.911346,276.512726 304.621460,268.401459
                                        C305.240570,267.047974 306.102295,265.805450 307.080750,264.223206
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M349.156708,337.438995
                                        C346.969330,344.530304 342.634796,348.706451 335.506348,349.258881
                                        C329.046722,349.759460 324.204620,346.857574 321.210388,341.164673
                                        C318.398682,335.818848 319.304077,328.529327 323.389679,324.380890
                                        C327.858795,319.843109 333.323456,318.477509 339.429291,320.494141
                                        C345.619324,322.538605 349.065247,327.345612 349.322296,334.031189
                                        C349.360565,335.026672 349.267883,336.027130 349.156708,337.438995
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M235.532349,362.457214
                                        C242.482635,357.373413 250.359940,357.521606 255.849014,362.575409
                                        C260.905792,367.231262 261.824371,375.815613 257.899414,381.737701
                                        C253.909866,387.757263 246.226868,390.014954 239.439331,387.162323
                                        C229.866058,383.138885 227.795090,371.045258 235.532349,362.457214
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M157.905212,319.682709
                                        C167.509521,321.068848 172.668427,326.861115 172.318436,335.390289
                                        C172.020416,342.652893 166.321808,348.648254 159.109024,349.287598
                                        C150.832184,350.021271 143.504440,344.108795 142.705750,336.052368
                                        C141.817612,327.093597 147.788147,320.474487 157.905212,319.682709
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M166.849075,169.002151
                                        C160.748260,173.408798 154.690369,173.556671 148.848785,169.666473
                                        C143.615036,166.181091 141.898224,160.779861 142.883835,154.760696
                                        C143.857773,148.813004 147.637650,144.964844 153.363724,143.198914
                                        C159.447662,141.322647 166.733414,144.076508 170.007294,149.309753
                                        C174.018585,155.721741 172.993256,162.685394 166.849075,169.002151
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M245.900116,133.314148
                                        C236.857254,132.877594 230.671692,126.648148 230.677277,118.425690
                                        C230.682663,110.485138 236.769684,104.048203 244.619919,103.681557
                                        C252.721985,103.303154 259.735962,109.339081 260.313904,117.187111
                                        C260.948761,125.808235 255.532471,132.055069 245.900116,133.314148
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M332.377411,172.237366
                                        C322.142334,169.174026 317.485840,161.131485 320.547119,152.496628
                                        C323.439667,144.337738 332.399933,140.449799 340.486816,143.844635
                                        C346.902649,146.537979 350.641388,153.823242 349.105835,160.639679
                                        C347.448090,167.998627 341.435577,172.290314 332.377411,172.237366
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M365.316925,233.008209
                                        C375.084656,228.481888 383.915009,231.388687 387.284088,239.915497
                                        C390.475311,247.992111 386.338562,256.807587 378.040863,259.612762
                                        C371.518738,261.817719 364.316254,259.147888 360.733917,253.197266
                                        C356.769501,246.611984 358.327881,239.314377 365.316925,233.008209
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M116.370331,230.758347
                                        C127.063591,230.728317 133.724167,237.012009 133.327194,246.309128
                                        C132.972534,254.615280 125.639053,260.957977 117.159134,260.292816
                                        C110.332260,259.757324 104.388863,253.918121 103.706383,247.075912
                                        C102.923019,239.222443 107.260956,233.455521 116.370331,230.758347
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M385.081512,292.341309
                                        C392.004517,296.235474 394.217621,302.473236 391.073853,308.344818
                                        C388.098145,313.902557 381.248169,315.983337 375.587708,313.048981
                                        C370.172241,310.241608 368.088654,303.193359 370.996735,297.518524
                                        C373.380310,292.867126 377.840057,291.128021 385.081512,292.341309
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M296.785706,390.570007
                                        C291.213409,385.193237 290.201385,380.043243 293.409943,374.770782
                                        C295.974579,370.556427 301.581177,368.579712 306.512939,370.150970
                                        C312.505554,372.060242 315.845062,378.603882 313.861206,384.549622
                                        C311.573212,391.406891 304.899933,393.899567 296.785706,390.570007
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M188.995911,99.680756
                                        C196.534302,100.722618 200.261520,104.571579 200.318054,110.939407
                                        C200.366058,116.346832 196.685211,121.005623 191.479996,122.125641
                                        C185.814240,123.344734 180.356003,120.325249 178.298843,114.833809
                                        C175.606995,107.648109 180.185577,100.896286 188.995911,99.680756
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M100.069901,192.265442
                                        C99.347351,184.475357 101.690170,180.088501 107.190041,178.291550
                                        C112.478157,176.563751 118.004532,178.470139 120.689926,182.948502
                                        C124.043343,188.540894 122.179993,195.743713 116.550491,198.949554
                                        C110.512390,202.388062 104.046799,199.899628 100.069901,192.265442
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M101.912537,309.878601
                                        C98.697006,303.566589 99.125755,298.585388 102.953644,294.936188
                                        C106.642715,291.419312 112.084938,290.554291 116.286026,292.988312
                                        C120.527512,295.445709 122.728493,299.127380 122.288574,304.133972
                                        C121.885139,308.725220 119.361519,311.917664 115.179123,313.516724
                                        C110.183899,315.426575 105.732468,314.260803 101.912537,309.878601
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M178.385193,376.960693
                                        C181.895248,371.034241 185.828369,368.911194 191.116776,369.807007
                                        C195.712204,370.585480 199.595703,374.493958 200.219360,379.138824
                                        C200.909073,384.275818 198.954895,388.293274 194.511108,390.868683
                                        C190.603088,393.133575 186.548798,393.011658 182.800354,390.388123
                                        C178.197479,387.166626 176.715454,382.747131 178.385193,376.960693
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M307.757568,100.746201
                                        C313.478394,104.691002 315.368408,108.816689 314.071716,113.883812
                                        C312.952698,118.256653 308.545563,121.950974 304.046570,122.287476
                                        C298.967468,122.667366 294.600159,120.060593 292.559570,115.302444
                                        C290.753998,111.092331 291.429291,107.006157 294.338898,103.686035
                                        C297.809845,99.725403 302.303864,98.526360 307.757568,100.746201
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M376.239075,178.732407
                                        C381.893494,176.553574 386.443848,177.736450 389.935608,182.093674
                                        C393.035980,185.962463 393.289001,190.350143 390.815918,194.627869
                                        C388.350037,198.893250 384.461609,200.884827 379.533844,200.215164
                                        C374.613556,199.546524 371.452454,196.503693 370.023895,191.872192
                                        C368.485840,186.885651 370.482056,182.747986 376.239075,178.732407
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M252.493073,419.500793
                                        C249.296402,421.900330 246.315170,422.047272 243.666916,419.569916
                                        C241.392639,417.442413 240.968933,414.680664 242.513596,411.902283
                                        C243.954163,409.311096 246.357651,408.351685 249.224396,408.809906
                                        C253.912674,409.559265 255.405273,414.004639 252.493073,419.500793
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M416.641327,241.885529
                                        C420.277130,243.253464 421.706390,245.673035 421.201080,249.064697
                                        C420.793060,251.803452 419.011475,253.520187 416.355774,254.156006
                                        C412.716705,255.027267 409.239319,252.508698 408.778259,248.798813
                                        C408.250061,244.548523 410.874481,242.086472 416.641327,241.885529
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M132.967224,367.790527
                                        C129.915161,370.919586 126.806648,371.182434 123.811462,368.703217
                                        C121.550598,366.831787 121.047890,364.149231 122.253006,361.441193
                                        C123.566322,358.490021 126.067894,357.320404 129.194168,357.831451
                                        C133.601364,358.551849 135.116913,362.295074 132.967224,367.790527
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M127.970810,121.725281
                                        C134.015747,123.612183 135.922180,127.240425 133.343155,131.253723
                                        C131.592117,133.978516 128.979919,134.938293 125.980759,134.010635
                                        C123.172470,133.142029 121.664734,130.978668 121.722702,127.944977
                                        C121.795357,124.142387 123.931068,122.219604 127.970810,121.725281
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M248.826538,83.219543
                                        C243.307541,82.228996 240.737244,79.214706 241.941177,75.335098
                                        C243.106781,71.579063 245.925934,70.104080 249.686996,70.960213
                                        C252.319824,71.559540 254.022339,73.404106 254.241074,76.204979
                                        C254.527603,79.874092 252.695938,82.143051 248.826538,83.219543
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M358.582092,367.101135
                                        C357.082977,363.605652 357.492340,360.830475 360.373352,358.807373
                                        C362.631256,357.221741 365.070190,357.291443 367.414124,358.708557
                                        C369.836090,360.172852 370.666687,362.435486 370.200287,365.129211
                                        C369.764130,367.648346 368.140350,369.338226 365.745148,370.022217
                                        C362.903442,370.833679 360.495178,369.984406 358.582092,367.101135
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M357.911560,129.601135
                                        C357.379456,125.310822 358.975952,122.608917 362.830475,121.848839
                                        C366.135345,121.197128 368.807800,122.644371 369.953979,125.887146
                                        C371.005798,128.862885 370.068176,131.470352 367.396759,133.277588
                                        C364.116913,135.496414 360.971039,134.374954 357.911560,129.601135
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M80.817230,252.999084
                                        C75.611732,254.965698 72.201447,253.944824 71.062233,250.164246
                                        C70.030258,246.739548 70.973099,243.817642 74.415253,242.275925
                                        C77.346451,240.963013 80.078102,241.691162 81.973129,244.240616
                                        C84.170280,247.196518 83.779823,250.141983 80.817230,252.999084
                                      z"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          width="100%"
                                          viewBox="0 0 1024 1024"
                                        >
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M429.256287,561.227173
                                        C454.622894,541.639832 482.452393,528.409790 513.887024,523.175415
                                        C530.124268,520.471680 546.312012,520.085205 562.481689,523.643066
                                        C568.332703,524.930481 573.465881,527.382812 575.021423,533.651062
                                        C576.617188,540.081848 574.888184,545.722900 569.708496,550.315796
                                        C561.456726,557.632812 551.869202,563.172058 543.508728,570.317322
                                        C513.089172,596.315369 493.392822,629.060913 482.089539,667.242920
                                        C476.830994,685.006042 475.322998,703.530640 470.283356,721.317139
                                        C461.159454,753.518433 443.516724,779.421021 414.849457,797.399597
                                        C403.880005,804.279053 392.010651,808.169861 379.176239,809.174011
                                        C366.929321,810.132202 358.622070,804.958374 354.082794,792.917908
                                        C348.306366,777.596008 345.126099,761.667297 343.546967,745.341370
                                        C340.721375,716.128845 345.149719,687.954895 354.837158,660.460632
                                        C365.966370,628.874573 384.251038,601.990723 408.617950,579.150635
                                        C415.182159,572.997742 421.809662,566.912537 429.256287,561.227173
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M511.177368,703.314331
                                        C515.394043,686.985413 516.916565,670.515381 521.621338,654.687317
                                        C532.130371,619.332336 553.183777,592.714539 586.161865,575.823059
                                        C596.216248,570.673218 607.054688,569.015015 618.168213,569.838867
                                        C627.503540,570.530884 633.084717,576.511597 636.446228,584.804443
                                        C640.844543,595.655090 643.283691,607.042358 645.290466,618.514343
                                        C655.893372,679.126343 638.665100,732.656982 600.946289,779.418152
                                        C571.275818,816.201599 534.086731,843.391479 486.646973,853.709167
                                        C469.498810,857.438660 452.176453,859.489685 434.648468,856.322815
                                        C430.368927,855.549561 426.269989,854.145813 422.458893,852.014099
                                        C414.606171,847.621704 412.831909,841.300354 417.549225,833.616150
                                        C421.468597,827.231628 427.267822,822.634033 433.422241,818.624084
                                        C454.760712,804.720581 471.437439,786.341309 485.100311,765.090210
                                        C497.280243,746.145630 505.618164,725.528381 511.177368,703.314331
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M631.557983,313.421814
                                        C644.336609,321.929260 658.298889,327.735809 670.373352,336.746887
                                        C692.073792,352.941650 706.289978,373.885803 711.783386,400.580780
                                        C713.883240,410.785339 713.123718,420.778290 710.025330,430.613434
                                        C707.495422,438.644165 700.900330,443.089966 691.691711,443.338440
                                        C658.178162,444.242767 627.536682,435.113953 599.778259,416.501251
                                        C555.835632,387.036591 531.923157,344.746246 522.711060,293.593567
                                        C517.753357,266.064636 520.823425,239.241394 533.448914,213.903992
                                        C536.267456,208.247681 539.517151,202.650146 546.890015,202.976822
                                        C554.839172,203.329041 558.153992,209.225067 560.257690,215.909256
                                        C564.406311,229.090408 568.629272,242.194626 575.446655,254.360031
                                        C589.100281,278.724548 608.024231,297.989716 631.557983,313.421814
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M640.996155,285.114258
                                        C621.824280,274.227997 605.734375,260.616699 594.823364,241.513565
                                        C587.524414,228.734482 583.295288,214.902039 582.021606,200.372620
                                        C581.340637,192.604568 583.188232,184.779404 586.682312,177.638718
                                        C589.495117,171.890366 594.596863,169.199982 600.775635,168.699310
                                        C620.147888,167.129471 638.885498,170.684265 657.231567,176.427567
                                        C690.203369,186.749496 715.842224,207.282166 736.648315,234.352112
                                        C757.741272,261.795319 770.358154,292.819672 773.942383,327.138641
                                        C776.084412,347.648895 773.744141,368.017242 766.526245,387.582489
                                        C764.080627,394.211884 760.896851,400.404449 755.602783,405.254272
                                        C749.934631,410.446716 743.996704,409.872681 739.333679,403.767426
                                        C735.827271,399.176605 733.956787,393.817871 732.417419,388.365540
                                        C720.597534,346.501099 694.013184,316.418579 657.435303,294.324005
                                        C652.166626,291.141510 646.694580,288.295746 640.996155,285.114258
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M281.708282,307.752563
                                        C294.213287,292.530914 308.733276,280.632355 327.306091,274.301605
                                        C329.345001,273.606659 331.445251,272.989746 333.567322,272.658417
                                        C342.370026,271.283936 347.579407,277.731506 344.489136,286.156372
                                        C343.746521,288.180939 342.844086,290.178101 341.765472,292.043518
                                        C322.175720,325.923889 320.990662,361.399445 332.007202,398.165131
                                        C339.392853,422.813507 338.527039,446.824066 324.489807,469.336365
                                        C320.543518,475.665222 315.530060,480.885895 309.174683,484.836121
                                        C300.349060,490.321838 294.074585,489.780090 286.793732,482.369781
                                        C274.727814,470.089325 265.468689,455.968353 259.585815,439.722656
                                        C246.979965,404.911224 249.328491,370.794891 264.209930,337.197205
                                        C268.827057,326.773132 274.547455,317.055054 281.708282,307.752563
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M397.392090,292.624573
                                        C419.118225,317.528076 430.181000,346.135773 429.128967,378.881073
                                        C428.022308,413.326508 416.617065,444.144135 393.444244,469.913635
                                        C381.990387,482.651031 368.365448,492.875488 351.411591,497.510986
                                        C346.618896,498.821350 341.057129,500.126282 337.360229,495.695709
                                        C333.562286,491.144012 335.506317,485.681488 337.947479,481.109863
                                        C343.997833,469.779053 349.772736,458.415466 352.669647,445.754608
                                        C358.116180,421.950409 356.368378,398.528290 349.429108,375.330902
                                        C343.983093,357.125397 342.009521,338.737793 347.926514,320.345825
                                        C352.154480,307.203827 358.203552,294.925507 370.457886,287.140167
                                        C380.927979,280.488373 386.350342,281.262756 395.097107,290.177948
                                        C395.796875,290.891205 396.466248,291.634338 397.392090,292.624573
                                      z"
                                          />
                                        </svg>
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
                                        <svg width="100%" viewBox="0 0 480 480">
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M146.827133,270.297302
                                        C151.251007,259.693726 160.986099,254.072372 171.251694,255.864075
                                        C181.226868,257.605103 189.003616,266.402008 189.329453,276.313232
                                        C189.689468,287.264709 183.141495,296.253479 172.566010,298.754150
                                        C164.710129,300.611664 157.607407,298.690277 151.973236,292.817322
                                        C145.964951,286.554443 144.154419,279.091583 146.827133,270.297302
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M210.560562,189.116791
                                        C195.449890,185.836929 188.452835,169.945557 195.234314,157.017227
                                        C199.918915,148.086395 210.864670,143.576157 220.801575,146.622971
                                        C231.221268,149.817810 237.613449,159.687531 236.246521,170.470428
                                        C234.971359,180.529190 226.022018,188.861557 215.975159,189.291870
                                        C214.316223,189.362900 212.648605,189.231308 210.560562,189.116791
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M261.495605,182.470642
                                        C253.735611,172.315460 253.778610,160.626297 261.351318,152.544403
                                        C268.468903,144.948242 280.461304,143.430893 289.268311,149.012253
                                        C299.637604,155.583679 302.527344,169.492371 295.644989,179.704071
                                        C288.676025,190.044296 274.606537,192.460526 264.366882,185.049622
                                        C263.427887,184.370056 262.618500,183.511444 261.495605,182.470642
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M189.210754,211.420486
                                        C189.541489,223.602570 184.637344,231.569870 174.958237,235.084763
                                        C166.203766,238.263901 156.518570,235.575836 150.641098,228.335678
                                        C144.900162,221.263702 143.933731,212.077652 148.291245,204.042984
                                        C152.823746,195.685654 160.172211,192.252808 169.422760,192.734375
                                        C177.888916,193.175110 185.491638,199.310074 188.244522,207.618851
                                        C188.609772,208.721268 188.861511,209.861328 189.210754,211.420486
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M256.829285,317.325867
                                        C261.835022,306.344421 270.998138,301.042267 281.268280,302.870087
                                        C291.118500,304.623138 298.809937,313.149628 299.324219,322.845428
                                        C299.824707,332.282257 295.850159,339.354370 287.695526,343.863922
                                        C280.066620,348.082764 270.139130,347.050507 263.779083,341.560242
                                        C256.381104,335.173920 253.989105,327.167572 256.829285,317.325867
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M204.396454,343.940735
                                        C195.420990,338.638947 191.430893,330.915497 192.918686,321.135376
                                        C194.299606,312.057922 199.690323,305.657166 208.908401,303.376312
                                        C217.953003,301.138397 225.682419,303.700104 231.653076,310.893860
                                        C237.723770,318.208130 237.942520,329.782928 232.353546,337.349609
                                        C225.996841,345.955658 215.720734,348.476196 204.396454,343.940735
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M308.942627,198.944153
                                        C316.605652,192.392838 324.848663,190.610611 333.790741,194.755066
                                        C341.722290,198.431168 345.954224,204.959412 346.294647,213.703262
                                        C346.669037,223.319031 341.188599,231.545853 332.558228,234.878952
                                        C324.070221,238.157089 314.273529,235.866028 308.309357,229.208130
                                        C302.050140,222.220871 300.845306,212.542404 305.304138,204.118500
                                        C306.228882,202.371384 307.540527,200.829056 308.942627,198.944153
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M307.080750,264.223206
                                        C314.863770,255.894165 323.407593,253.598129 332.510529,257.162323
                                        C340.872406,260.436401 346.274811,268.301483 346.336487,277.290924
                                        C346.400085,286.559418 341.047852,294.521362 332.466278,297.924072
                                        C324.237854,301.186768 314.893280,299.077484 308.588440,292.534363
                                        C302.536743,286.253937 300.911346,276.512726 304.621460,268.401459
                                        C305.240570,267.047974 306.102295,265.805450 307.080750,264.223206
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M349.156708,337.438995
                                        C346.969330,344.530304 342.634796,348.706451 335.506348,349.258881
                                        C329.046722,349.759460 324.204620,346.857574 321.210388,341.164673
                                        C318.398682,335.818848 319.304077,328.529327 323.389679,324.380890
                                        C327.858795,319.843109 333.323456,318.477509 339.429291,320.494141
                                        C345.619324,322.538605 349.065247,327.345612 349.322296,334.031189
                                        C349.360565,335.026672 349.267883,336.027130 349.156708,337.438995
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M235.532349,362.457214
                                        C242.482635,357.373413 250.359940,357.521606 255.849014,362.575409
                                        C260.905792,367.231262 261.824371,375.815613 257.899414,381.737701
                                        C253.909866,387.757263 246.226868,390.014954 239.439331,387.162323
                                        C229.866058,383.138885 227.795090,371.045258 235.532349,362.457214
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M157.905212,319.682709
                                        C167.509521,321.068848 172.668427,326.861115 172.318436,335.390289
                                        C172.020416,342.652893 166.321808,348.648254 159.109024,349.287598
                                        C150.832184,350.021271 143.504440,344.108795 142.705750,336.052368
                                        C141.817612,327.093597 147.788147,320.474487 157.905212,319.682709
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M166.849075,169.002151
                                        C160.748260,173.408798 154.690369,173.556671 148.848785,169.666473
                                        C143.615036,166.181091 141.898224,160.779861 142.883835,154.760696
                                        C143.857773,148.813004 147.637650,144.964844 153.363724,143.198914
                                        C159.447662,141.322647 166.733414,144.076508 170.007294,149.309753
                                        C174.018585,155.721741 172.993256,162.685394 166.849075,169.002151
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M245.900116,133.314148
                                        C236.857254,132.877594 230.671692,126.648148 230.677277,118.425690
                                        C230.682663,110.485138 236.769684,104.048203 244.619919,103.681557
                                        C252.721985,103.303154 259.735962,109.339081 260.313904,117.187111
                                        C260.948761,125.808235 255.532471,132.055069 245.900116,133.314148
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M332.377411,172.237366
                                        C322.142334,169.174026 317.485840,161.131485 320.547119,152.496628
                                        C323.439667,144.337738 332.399933,140.449799 340.486816,143.844635
                                        C346.902649,146.537979 350.641388,153.823242 349.105835,160.639679
                                        C347.448090,167.998627 341.435577,172.290314 332.377411,172.237366
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M365.316925,233.008209
                                        C375.084656,228.481888 383.915009,231.388687 387.284088,239.915497
                                        C390.475311,247.992111 386.338562,256.807587 378.040863,259.612762
                                        C371.518738,261.817719 364.316254,259.147888 360.733917,253.197266
                                        C356.769501,246.611984 358.327881,239.314377 365.316925,233.008209
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M116.370331,230.758347
                                        C127.063591,230.728317 133.724167,237.012009 133.327194,246.309128
                                        C132.972534,254.615280 125.639053,260.957977 117.159134,260.292816
                                        C110.332260,259.757324 104.388863,253.918121 103.706383,247.075912
                                        C102.923019,239.222443 107.260956,233.455521 116.370331,230.758347
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M385.081512,292.341309
                                        C392.004517,296.235474 394.217621,302.473236 391.073853,308.344818
                                        C388.098145,313.902557 381.248169,315.983337 375.587708,313.048981
                                        C370.172241,310.241608 368.088654,303.193359 370.996735,297.518524
                                        C373.380310,292.867126 377.840057,291.128021 385.081512,292.341309
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M296.785706,390.570007
                                        C291.213409,385.193237 290.201385,380.043243 293.409943,374.770782
                                        C295.974579,370.556427 301.581177,368.579712 306.512939,370.150970
                                        C312.505554,372.060242 315.845062,378.603882 313.861206,384.549622
                                        C311.573212,391.406891 304.899933,393.899567 296.785706,390.570007
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M188.995911,99.680756
                                        C196.534302,100.722618 200.261520,104.571579 200.318054,110.939407
                                        C200.366058,116.346832 196.685211,121.005623 191.479996,122.125641
                                        C185.814240,123.344734 180.356003,120.325249 178.298843,114.833809
                                        C175.606995,107.648109 180.185577,100.896286 188.995911,99.680756
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M100.069901,192.265442
                                        C99.347351,184.475357 101.690170,180.088501 107.190041,178.291550
                                        C112.478157,176.563751 118.004532,178.470139 120.689926,182.948502
                                        C124.043343,188.540894 122.179993,195.743713 116.550491,198.949554
                                        C110.512390,202.388062 104.046799,199.899628 100.069901,192.265442
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M101.912537,309.878601
                                        C98.697006,303.566589 99.125755,298.585388 102.953644,294.936188
                                        C106.642715,291.419312 112.084938,290.554291 116.286026,292.988312
                                        C120.527512,295.445709 122.728493,299.127380 122.288574,304.133972
                                        C121.885139,308.725220 119.361519,311.917664 115.179123,313.516724
                                        C110.183899,315.426575 105.732468,314.260803 101.912537,309.878601
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M178.385193,376.960693
                                        C181.895248,371.034241 185.828369,368.911194 191.116776,369.807007
                                        C195.712204,370.585480 199.595703,374.493958 200.219360,379.138824
                                        C200.909073,384.275818 198.954895,388.293274 194.511108,390.868683
                                        C190.603088,393.133575 186.548798,393.011658 182.800354,390.388123
                                        C178.197479,387.166626 176.715454,382.747131 178.385193,376.960693
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M307.757568,100.746201
                                        C313.478394,104.691002 315.368408,108.816689 314.071716,113.883812
                                        C312.952698,118.256653 308.545563,121.950974 304.046570,122.287476
                                        C298.967468,122.667366 294.600159,120.060593 292.559570,115.302444
                                        C290.753998,111.092331 291.429291,107.006157 294.338898,103.686035
                                        C297.809845,99.725403 302.303864,98.526360 307.757568,100.746201
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M376.239075,178.732407
                                        C381.893494,176.553574 386.443848,177.736450 389.935608,182.093674
                                        C393.035980,185.962463 393.289001,190.350143 390.815918,194.627869
                                        C388.350037,198.893250 384.461609,200.884827 379.533844,200.215164
                                        C374.613556,199.546524 371.452454,196.503693 370.023895,191.872192
                                        C368.485840,186.885651 370.482056,182.747986 376.239075,178.732407
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M252.493073,419.500793
                                        C249.296402,421.900330 246.315170,422.047272 243.666916,419.569916
                                        C241.392639,417.442413 240.968933,414.680664 242.513596,411.902283
                                        C243.954163,409.311096 246.357651,408.351685 249.224396,408.809906
                                        C253.912674,409.559265 255.405273,414.004639 252.493073,419.500793
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M416.641327,241.885529
                                        C420.277130,243.253464 421.706390,245.673035 421.201080,249.064697
                                        C420.793060,251.803452 419.011475,253.520187 416.355774,254.156006
                                        C412.716705,255.027267 409.239319,252.508698 408.778259,248.798813
                                        C408.250061,244.548523 410.874481,242.086472 416.641327,241.885529
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M132.967224,367.790527
                                        C129.915161,370.919586 126.806648,371.182434 123.811462,368.703217
                                        C121.550598,366.831787 121.047890,364.149231 122.253006,361.441193
                                        C123.566322,358.490021 126.067894,357.320404 129.194168,357.831451
                                        C133.601364,358.551849 135.116913,362.295074 132.967224,367.790527
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M127.970810,121.725281
                                        C134.015747,123.612183 135.922180,127.240425 133.343155,131.253723
                                        C131.592117,133.978516 128.979919,134.938293 125.980759,134.010635
                                        C123.172470,133.142029 121.664734,130.978668 121.722702,127.944977
                                        C121.795357,124.142387 123.931068,122.219604 127.970810,121.725281
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M248.826538,83.219543
                                        C243.307541,82.228996 240.737244,79.214706 241.941177,75.335098
                                        C243.106781,71.579063 245.925934,70.104080 249.686996,70.960213
                                        C252.319824,71.559540 254.022339,73.404106 254.241074,76.204979
                                        C254.527603,79.874092 252.695938,82.143051 248.826538,83.219543
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M358.582092,367.101135
                                        C357.082977,363.605652 357.492340,360.830475 360.373352,358.807373
                                        C362.631256,357.221741 365.070190,357.291443 367.414124,358.708557
                                        C369.836090,360.172852 370.666687,362.435486 370.200287,365.129211
                                        C369.764130,367.648346 368.140350,369.338226 365.745148,370.022217
                                        C362.903442,370.833679 360.495178,369.984406 358.582092,367.101135
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M357.911560,129.601135
                                        C357.379456,125.310822 358.975952,122.608917 362.830475,121.848839
                                        C366.135345,121.197128 368.807800,122.644371 369.953979,125.887146
                                        C371.005798,128.862885 370.068176,131.470352 367.396759,133.277588
                                        C364.116913,135.496414 360.971039,134.374954 357.911560,129.601135
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M80.817230,252.999084
                                        C75.611732,254.965698 72.201447,253.944824 71.062233,250.164246
                                        C70.030258,246.739548 70.973099,243.817642 74.415253,242.275925
                                        C77.346451,240.963013 80.078102,241.691162 81.973129,244.240616
                                        C84.170280,247.196518 83.779823,250.141983 80.817230,252.999084
                                      z"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          width="100%"
                                          viewBox="0 0 1024 1024"
                                        >
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M429.256287,561.227173
                                        C454.622894,541.639832 482.452393,528.409790 513.887024,523.175415
                                        C530.124268,520.471680 546.312012,520.085205 562.481689,523.643066
                                        C568.332703,524.930481 573.465881,527.382812 575.021423,533.651062
                                        C576.617188,540.081848 574.888184,545.722900 569.708496,550.315796
                                        C561.456726,557.632812 551.869202,563.172058 543.508728,570.317322
                                        C513.089172,596.315369 493.392822,629.060913 482.089539,667.242920
                                        C476.830994,685.006042 475.322998,703.530640 470.283356,721.317139
                                        C461.159454,753.518433 443.516724,779.421021 414.849457,797.399597
                                        C403.880005,804.279053 392.010651,808.169861 379.176239,809.174011
                                        C366.929321,810.132202 358.622070,804.958374 354.082794,792.917908
                                        C348.306366,777.596008 345.126099,761.667297 343.546967,745.341370
                                        C340.721375,716.128845 345.149719,687.954895 354.837158,660.460632
                                        C365.966370,628.874573 384.251038,601.990723 408.617950,579.150635
                                        C415.182159,572.997742 421.809662,566.912537 429.256287,561.227173
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M511.177368,703.314331
                                        C515.394043,686.985413 516.916565,670.515381 521.621338,654.687317
                                        C532.130371,619.332336 553.183777,592.714539 586.161865,575.823059
                                        C596.216248,570.673218 607.054688,569.015015 618.168213,569.838867
                                        C627.503540,570.530884 633.084717,576.511597 636.446228,584.804443
                                        C640.844543,595.655090 643.283691,607.042358 645.290466,618.514343
                                        C655.893372,679.126343 638.665100,732.656982 600.946289,779.418152
                                        C571.275818,816.201599 534.086731,843.391479 486.646973,853.709167
                                        C469.498810,857.438660 452.176453,859.489685 434.648468,856.322815
                                        C430.368927,855.549561 426.269989,854.145813 422.458893,852.014099
                                        C414.606171,847.621704 412.831909,841.300354 417.549225,833.616150
                                        C421.468597,827.231628 427.267822,822.634033 433.422241,818.624084
                                        C454.760712,804.720581 471.437439,786.341309 485.100311,765.090210
                                        C497.280243,746.145630 505.618164,725.528381 511.177368,703.314331
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M631.557983,313.421814
                                        C644.336609,321.929260 658.298889,327.735809 670.373352,336.746887
                                        C692.073792,352.941650 706.289978,373.885803 711.783386,400.580780
                                        C713.883240,410.785339 713.123718,420.778290 710.025330,430.613434
                                        C707.495422,438.644165 700.900330,443.089966 691.691711,443.338440
                                        C658.178162,444.242767 627.536682,435.113953 599.778259,416.501251
                                        C555.835632,387.036591 531.923157,344.746246 522.711060,293.593567
                                        C517.753357,266.064636 520.823425,239.241394 533.448914,213.903992
                                        C536.267456,208.247681 539.517151,202.650146 546.890015,202.976822
                                        C554.839172,203.329041 558.153992,209.225067 560.257690,215.909256
                                        C564.406311,229.090408 568.629272,242.194626 575.446655,254.360031
                                        C589.100281,278.724548 608.024231,297.989716 631.557983,313.421814
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M640.996155,285.114258
                                        C621.824280,274.227997 605.734375,260.616699 594.823364,241.513565
                                        C587.524414,228.734482 583.295288,214.902039 582.021606,200.372620
                                        C581.340637,192.604568 583.188232,184.779404 586.682312,177.638718
                                        C589.495117,171.890366 594.596863,169.199982 600.775635,168.699310
                                        C620.147888,167.129471 638.885498,170.684265 657.231567,176.427567
                                        C690.203369,186.749496 715.842224,207.282166 736.648315,234.352112
                                        C757.741272,261.795319 770.358154,292.819672 773.942383,327.138641
                                        C776.084412,347.648895 773.744141,368.017242 766.526245,387.582489
                                        C764.080627,394.211884 760.896851,400.404449 755.602783,405.254272
                                        C749.934631,410.446716 743.996704,409.872681 739.333679,403.767426
                                        C735.827271,399.176605 733.956787,393.817871 732.417419,388.365540
                                        C720.597534,346.501099 694.013184,316.418579 657.435303,294.324005
                                        C652.166626,291.141510 646.694580,288.295746 640.996155,285.114258
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M281.708282,307.752563
                                        C294.213287,292.530914 308.733276,280.632355 327.306091,274.301605
                                        C329.345001,273.606659 331.445251,272.989746 333.567322,272.658417
                                        C342.370026,271.283936 347.579407,277.731506 344.489136,286.156372
                                        C343.746521,288.180939 342.844086,290.178101 341.765472,292.043518
                                        C322.175720,325.923889 320.990662,361.399445 332.007202,398.165131
                                        C339.392853,422.813507 338.527039,446.824066 324.489807,469.336365
                                        C320.543518,475.665222 315.530060,480.885895 309.174683,484.836121
                                        C300.349060,490.321838 294.074585,489.780090 286.793732,482.369781
                                        C274.727814,470.089325 265.468689,455.968353 259.585815,439.722656
                                        C246.979965,404.911224 249.328491,370.794891 264.209930,337.197205
                                        C268.827057,326.773132 274.547455,317.055054 281.708282,307.752563
                                      z"
                                          />
                                          <path
                                            fill="currentColor"
                                            opacity="1.000000"
                                            stroke="none"
                                            d="
                                      M397.392090,292.624573
                                        C419.118225,317.528076 430.181000,346.135773 429.128967,378.881073
                                        C428.022308,413.326508 416.617065,444.144135 393.444244,469.913635
                                        C381.990387,482.651031 368.365448,492.875488 351.411591,497.510986
                                        C346.618896,498.821350 341.057129,500.126282 337.360229,495.695709
                                        C333.562286,491.144012 335.506317,485.681488 337.947479,481.109863
                                        C343.997833,469.779053 349.772736,458.415466 352.669647,445.754608
                                        C358.116180,421.950409 356.368378,398.528290 349.429108,375.330902
                                        C343.983093,357.125397 342.009521,338.737793 347.926514,320.345825
                                        C352.154480,307.203827 358.203552,294.925507 370.457886,287.140167
                                        C380.927979,280.488373 386.350342,281.262756 395.097107,290.177948
                                        C395.796875,290.891205 396.466248,291.634338 397.392090,292.624573
                                      z"
                                          />
                                        </svg>
                                      )}
                                    </div>
                                    <span className="text-left lowercase text-sm lg:text-base">
                                      {v}
                                    </span>
                                  </button>
                                );
                              default:
                                return;
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
            {product.tags.indexOf("Club Member Exclusive") !== -1 ? (
              <ClubPromoRoastInner
                title="Long Run Club Bonus"
                description="All Long Run Club sign ups through 9/12/24 get this item free with their first shipment"
                promotion_start_date={promotion_start_date}
                promotion_end_date={promotion_end_date}
              />
            ) : product.type == "Gift" ? (
              <div className="bg-neutral-50 w-full h-64 flex items-center justify-center">
                <p className="font-accent text-lg text-neutral-700">
                  Not for Purchase
                </p>
              </div>
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
                    className={`rounded w-full text-base flex items-center justify-center text-center py-3 px-4 font-accent border ${
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
