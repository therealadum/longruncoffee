import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getDynamicBundleItems,
  initRecharge,
  loginShopifyAppProxy,
} from "@rechargeapps/storefront-client";

import {
  ICartState,
  ISubscriptionCartItem,
  ISubscriptionCartState,
} from "../common/product";
import { plans, referenceString } from "../common/constants";
import { IPlan } from "../common/plans";
import { useCartBot } from "./functions/CartBot";
import {
  addToCart,
  checkoutStatus,
  getCart,
  updateCart,
} from "./functions/CartOps";
import { useUpsells } from "./upsells/useUpsells";

interface IUseCartDrawerStateProps {
  cart: ICartState;
  subscription: ISubscriptionCartState;
}

initRecharge({
  storeIdentifier: "longruncoffee.myshopify.com",
  storefrontAccessToken:
    "strfnt_554c548c9ee33e7dfb04ba981797a8e49a71423f554234f212fbc4de1cb26d63",
  appName: "storefront",
  appVersion: "1.0.0",
  loginRetryFn: async () => {
    const session = await loginShopifyAppProxy();
    return session;
  },
});

export const useCartDrawerState = ({
  cart,
  subscription,
}: IUseCartDrawerStateProps) => {
  // state for the subscription items in local storage
  const [subscriptionCartState, _setSubscriptionCartState] =
    useState<ISubscriptionCartState>(subscription);
  const setSubscriptionCartState = (newState: ISubscriptionCartState) => {
    localStorage.setItem(referenceString, JSON.stringify(newState));
    _setSubscriptionCartState(newState);
  };

  // state for when something async is happening on the cart side of things
  const [loading, setLoading] = useState(false);

  // state for the items within the regular cart
  const [cartState, setCartState] = useState<ICartState>(cart);

  // update items
  const update = useCallback(
    async (
      updates: any,
      shouldOpen: boolean = true,
      shouldSetCartState: boolean = true,
      shouldSetLoading: boolean = true,
    ) => {
      if (shouldSetLoading) {
        setLoading(true);
      }
      try {
        const response = await updateCart(updates);
        const newCart = await response.json();
        if (shouldSetCartState) {
          setCartState(newCart);
        }
        if (newCart.items.length && shouldOpen) {
          setIsOpen(true);
        }
      } catch (e) {
        console.error(e);
      }
      if (shouldSetLoading) {
        setLoading(false);
      }
    },
    [cartState, setCartState],
  );

  // does cart have gift items in it?
  const cartContainsGiftItems = useMemo(() => {
    return (
      cartState.items.filter((item) => item.product_type == "Gift").length >
        0 || subscriptionCartState.items.length > 0
    );
  }, [cartState, subscriptionCartState]);

  // are there one time items? (i.e. no gift items)
  const cartContainsOneTimeItems = useMemo(() => {
    return (
      cartState.items.filter((item) => item.product_type != "Gift").length > 0
    );
  }, [cartState]);

  // state for the drawer being open or not
  const [isOpen, setIsOpen] = useState<boolean>(
    process.env.XSTORYBOOK_EXAMPLE_APP != null ? true : false,
  );
  // listen for call to open drawer
  useEffect(() => {
    const handler = () => setIsOpen(!isOpen);
    document.addEventListener("cart_toggle", handler);
    return () => {
      document.removeEventListener("cart_toggle", handler);
    };
  }, [isOpen, setIsOpen]);

  // function to return cart item costs
  const useCartItemProductCosts = useCallback(
    (price: number, compare_at_price: number, quantity: number) => {
      let qty = 0;
      subscriptionCartState.items.forEach((item) => (qty += item.quantity));

      // get tier
      let plan = plans.base;
      if (qty >= plans.elite.bag_min) {
        plan = plans.elite;
      } else if (qty >= plans.pro.bag_min) {
        plan = plans.pro;
      }

      return {
        subscribe_and_save_total_cost: ((price * quantity) / 100).toFixed(2),
        subscribe_and_save_discounted_cost: (
          (price * quantity * (1 - plan.discount)) /
          100
        ).toFixed(2),
        one_time_total_cost: ((price * quantity) / 100).toFixed(2),
        one_time_compare_at_cost: compare_at_price
          ? ((compare_at_price * quantity) / 100).toFixed(2)
          : ((price * quantity) / 100).toFixed(2),
      };
    },
    [subscriptionCartState],
  );

  // track total number of subscription / cart items
  const totalSubscriptionItems = useMemo(() => {
    let total = 0;
    for (let i = 0; i < subscriptionCartState.items.length; i++) {
      total += subscriptionCartState.items[i].quantity;
    }
    return total;
  }, [subscriptionCartState]);
  const totalCartItems = useMemo(() => {
    let total = 0;
    for (let i = 0; i < cartState.items.length; i++) {
      total += cartState.items[i].quantity;
    }
    return total;
  }, [cartState]);

  // current and plan based on subscription items
  const plan = useMemo(() => {
    let plan = null;
    if (totalSubscriptionItems >= plans.elite.bag_min) {
      plan = plans.elite;
    } else if (totalSubscriptionItems >= plans.pro.bag_min) {
      plan = plans.pro;
    } else if (totalSubscriptionItems >= plans.base.bag_min) {
      plan = plans.base;
    }
    return plan;
  }, [totalSubscriptionItems]);
  const nextPlan = useMemo(() => {
    let newNextPlan: IPlan | null = plans.base;
    if (totalSubscriptionItems >= plans.elite.bag_min) {
      newNextPlan = null;
    } else if (totalSubscriptionItems >= plans.pro.bag_min) {
      newNextPlan = plans.elite;
    } else if (totalSubscriptionItems >= plans.base.bag_min) {
      newNextPlan = plans.pro;
    }
    return newNextPlan;
  }, [plan]);

  // calculate next perks based on current / next plan
  const nextPerks = useMemo(() => {
    const unique = [];
    if (!nextPlan) {
      return null;
    }
    if (!plan) {
      return nextPlan.perk_list;
    }
    for (let i = 0; i < nextPlan.perk_list.length; i++) {
      if (plan.perk_list.indexOf(nextPlan.perk_list[i]) === -1) {
        unique.push(nextPlan.perk_list[i]);
      }
    }
    return unique;
  }, [plan, nextPlan]);

  // listen for buy_button
  const handleBuyButton = useCallback(
    async (event: any) => {
      setLoading(true);
      const { variantId, isSubscription, quantity, available, product_hash } =
        event.detail;
      try {
        if (isSubscription) {
          if (variantId && product_hash) {
            const data = await fetch(`/products/${product_hash}.js`);
            const product = await data.json();

            let variant;
            for (let j = 0; j < product.variants.length; j++) {
              if (product.variants[j].id == variantId) {
                variant = product.variants[j];
              }
            }
            const item = {
              product,
              variantID: variantId,
              variant,
              quantity,
            };

            if (await window.klaviyo.isIdentified()) {
              // report to klayvio
              window.klaviyo.push([
                "track",
                "add_subscription_item_to_cart",
                {
                  product_id: product.id,
                  variant_id: variantId,
                  quantity: quantity,
                },
              ]);
            }

            // if already in subscriptions, add quantity - otherwise add new item
            let existingItemIndex = null;
            for (let j = 0; j < subscriptionCartState.items.length; j++) {
              if (subscriptionCartState.items[j].variantID === item.variantID) {
                existingItemIndex = j;
              }
            }
            if (existingItemIndex !== null) {
              const newItems = [...subscriptionCartState.items];
              newItems[existingItemIndex].quantity += quantity;
              setSubscriptionCartState({
                ...subscriptionCartState,
                items: newItems,
              });
            } else {
              setSubscriptionCartState({
                ...subscriptionCartState,
                items: [
                  ...subscriptionCartState.items,
                  {
                    ...item,
                    quantity,
                  },
                ],
              });
            }
            setIsOpen(true);
            document.dispatchEvent(new CustomEvent("buy_button_complete"));
          } else {
            console.error("not found.");
            document.dispatchEvent(new CustomEvent("buy_button_complete"));
          }
        } else if (available) {
          const update_payload: any = {};
          update_payload[variantId] = quantity;
          // check if item already in cart
          const existing_item = cartState.items.find(
            (item) => item.variant_id === variantId,
          );
          // update qty
          if (existing_item) {
            update_payload[variantId] += existing_item.quantity;
          }
          const response = await updateCart(update_payload);
          const parsed = await response.json();
          setCartState(parsed);
          setIsOpen(true);
        }
      } catch (e: any) {
        console.error(e);
      }
      document.dispatchEvent(new CustomEvent("buy_button_complete"));
      setLoading(false);
    },
    [cartState, setCartState, subscriptionCartState, setSubscriptionCartState],
  );
  useEffect(() => {
    document.addEventListener("buy_button", handleBuyButton);
    return () => {
      document.removeEventListener("buy_button", handleBuyButton);
    };
  }, [handleBuyButton]);

  /////////////////////////
  // cart subtotal
  let cartSubTotal = cartState.original_total_price;
  let cartSubTotalWithDiscounts = cartState.total_price;
  subscriptionCartState.items.forEach((item) => {
    const tmp_costs = useCartItemProductCosts(
      item.variant.price,
      item.variant.compare_at_price || item.variant.price,
      item.quantity,
    );
    cartSubTotal += item.variant.price * item.quantity;
    cartSubTotalWithDiscounts +=
      parseFloat(tmp_costs.subscribe_and_save_discounted_cost) * 100;
  });

  // detect changes in total cart items and broadcast
  useEffect(() => {
    document.dispatchEvent(
      new CustomEvent("cart_count_change", {
        detail: {
          count: totalCartItems + totalSubscriptionItems,
          amountUntilFreeShipping:
            totalSubscriptionItems > 0 ? 0 : 5900 - cartSubTotalWithDiscounts,
        },
      }),
    );
  }, [totalCartItems, totalSubscriptionItems, cartSubTotalWithDiscounts]);

  // checkout
  const checkoutState = checkoutStatus({
    cartState,
    subscriptionCartState,
    plan,
  });
  const checkout = async () => {
    setLoading(true);
    if (
      !cartState.items.filter((item) => item.product_type !== "Gift").length &&
      !subscriptionCartState.items.length
    ) {
      return;
    }

    // prevent checkout if user has only one item in subscription
    if (subscriptionCartState.items.length && !plan) {
      return;
    }

    if (subscriptionCartState.items.length && plan) {
      // calculate tier based on items
      let bundleVariantId = null;
      if (plan.display_name.toLowerCase() === "base") {
        bundleVariantId = "47884295078201";
      } else if (plan.display_name.toLowerCase() === "pro") {
        bundleVariantId = "47884295110969";
      } else if (plan.display_name.toLowerCase() === "elite") {
        bundleVariantId = "47884295143737";
      } else {
        console.error("subscription plan not found");
      }

      // pluck selling plan from items[0].product.selling_plan_groups[name === 'Base'].selling_plans[0].options[0].value
      let bundleSellingPlan = null;
      for (
        let i = 0;
        i < subscriptionCartState.items[0].product.selling_plan_groups.length;
        i++
      ) {
        if (
          subscriptionCartState.items[0].product.selling_plan_groups[
            i
          ].name.toLowerCase() === plan.display_name.toLowerCase()
        ) {
          bundleSellingPlan =
            subscriptionCartState.items[0].product.selling_plan_groups[i]
              .options[0].values[0];
        }
      }

      // iterate through items and add to selection array with sellingPlan = items[0].product.selling_plan_groups[name === 'Base'].selling_plans[0].id
      // instead of pushing duplicates add to single selection
      const selectionMap: any = {};
      for (let i = 0; i < subscriptionCartState.items.length; i++) {
        const item = subscriptionCartState.items[i];
        if (selectionMap[`${item.product.id}-${item.variant.id}`]) {
          selectionMap[`${item.product.id}-${item.variant.id}`].quantity +=
            item.quantity;
        } else {
          let sellingPlan = null;
          for (let j = 0; j < item.product.selling_plan_groups.length; j++) {
            if (
              item.product.selling_plan_groups[j].name.toLowerCase() ===
              plan.display_name.toLowerCase()
            ) {
              sellingPlan =
                item.product.selling_plan_groups[j].selling_plans[0].id;
            }
          }
          if (!sellingPlan) {
            return;
          }
          selectionMap[`${item.product.id}-${item.variant.id}`] = {
            collectionId: "469929230649",
            externalProductId: `${item.product.id}`,
            externalVariantId: `${item.variant.id}`,
            sellingPlan,
            quantity: item.quantity,
          };
        }
      }

      const selections = [];
      const selectionKeys = Object.keys(selectionMap);
      for (let i = 0; i < selectionKeys.length; i++) {
        selections.push(selectionMap[selectionKeys[i]]);
      }

      if (bundleVariantId && bundleSellingPlan && selections) {
        const bundleProductData = {
          productId: "9038832632121",
          variantId: bundleVariantId,
          sellingPlan: bundleSellingPlan,
          handle: "subscribe-save-base",
        };
        const bundle = {
          externalVariantId: bundleProductData.variantId,
          externalProductId: bundleProductData.productId,
          selections,
        };

        const cartItems = getDynamicBundleItems(
          bundle,
          bundleProductData.handle,
        );
        await addToCart(cartItems);

        const newCart = await getCart();
        setCartState(newCart);

        setSubscriptionCartState({
          ...cartState,
          items: [],
        });

        window.location.href = "/checkout";
      }
    } else {
      window.location.href = "/checkout";
    }
  };

  // restore subscriptions
  useEffect(() => {
    if (!loading) {
      if (subscriptionCartState.items.length == 0) {
        // just came back from checkout
        const newCartItems: ISubscriptionCartItem[] = [];
        const cartItemsWithSellingPlans = cartState.items.filter(
          (ca) => ca.selling_plan_allocation,
        );
        if (cartItemsWithSellingPlans.length) {
          const promises = cartItemsWithSellingPlans.map(
            (ca) =>
              new Promise<void>(async (resolve, reject) => {
                const response = await fetch(
                  window.Shopify.routes.root + `products/${ca.handle}.js`,
                );
                const product = await response.json();
                let variant;
                for (let j = 0; j < product.variants.length; j++) {
                  if (product.variants[j].id == ca.variant_id) {
                    variant = product.variants[j];
                  }
                }
                const item = {
                  product,
                  variantID: ca.variant_id,
                  variant,
                  quantity: ca.quantity,
                };
                // if already in subscriptions, add quantity - otherwise add new item
                let existingItemIndex = null;
                for (let j = 0; j < newCartItems.length; j++) {
                  if (newCartItems[j].variantID === item.variantID) {
                    existingItemIndex = j;
                  }
                }
                if (existingItemIndex !== null) {
                  newCartItems[existingItemIndex].quantity += item.quantity;
                } else {
                  newCartItems.push(item);
                }
                resolve();
              }),
          );
          promises.push(
            new Promise(async (resolve, reject) => {
              const vo: any = {};
              cartItemsWithSellingPlans.forEach((ca) => {
                vo[ca.variant_id] = 0;
              });
              await update(vo, false, true, false);
              resolve();
            }),
          );
          const handler = async () => {
            await Promise.all(promises);
            setSubscriptionCartState({
              ...subscriptionCartState,
              items: newCartItems,
            });
          };
          handler();
        }
      } else {
        // clean up any remenants in cart
        const cartItemsWithSellingPlans = cartState.items.filter(
          (ca) => ca.selling_plan_allocation,
        );
        if (cartItemsWithSellingPlans.length) {
          const promises: any = [];
          promises.push(
            new Promise<void>(async (resolve, reject) => {
              const vo: any = {};
              cartItemsWithSellingPlans.forEach((ca) => {
                vo[ca.variant_id] = 0;
              });
              await update(vo, false, true, false);
              resolve();
            }),
          );
          const handler = async () => {
            await Promise.all(promises);
          };
          handler();
        }
      }
    }
  }, [loading]);

  // publish changes to other components
  useEffect(() => {
    document.dispatchEvent(
      new CustomEvent("subscription_changed", {
        detail: {
          newDiscount: plan?.discount || plans.base.discount,
          nextPlan: nextPlan,
        },
      }),
    );
  }, [nextPlan, plan, subscriptionCartState]);

  useCartBot({ cartState, subscriptionCartState, loading, update });
  const upsells = useUpsells({ cartState, loading });

  return {
    loading,
    update,
    checkoutState,
    checkout,
    isOpen,
    setIsOpen,
    cartState,
    setCartState,
    subscriptionCartState,
    setSubscriptionCartState,
    useCartItemProductCosts,
    plan,
    nextPlan,
    nextPerks,
    totalSubscriptionItems,
    cartContainsGiftItems,
    cartContainsOneTimeItems,
    cartSubTotal,
    cartSubTotalWithDiscounts,
    upsells,
  };
};
