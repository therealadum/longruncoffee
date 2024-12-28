import { ICartState, ISubscriptionCartState } from "../../common/product";
import { UseQueryResult } from "react-query";
import {
  IAddToCartDisplayOnly,
  IProgressBarRewardAnimation,
} from "../sections/ProgressBar";
import { variantIdInCart } from "../upsells/functions/variantIdInCart";

export enum ICartBotItemTriggerEnum {
  "SUBSCRIPTION_ITEMS_PRESENT" = "SUBSCRIPTION_ITEMS_PRESENT",
  "CART_VALUE_EXCEEDS" = "CART_VALUE_EXCEEDS",
  "VARIANT_ID_IN_CART" = "VARIANT_ID_IN_CART",
}

export interface ICartBotItemTrigger {
  enum: ICartBotItemTriggerEnum;
  params?: any;
}

export interface ICartBotItem {
  id: number;
  variant_ids: number[];
  a2c_display_only: IAddToCartDisplayOnly[];
  name: string;
  triggers: ICartBotItemTrigger[];
}

interface ICartBotProps {
  cartState: ICartState;
  totalSubscriptionItems: number;
  subscriptionCartState: ISubscriptionCartState;
  loading: boolean;
  update: (updates: any) => Promise<void>;
  cartSubTotal: number;
  cartRewardQuery: UseQueryResult<IProgressBarRewardAnimation[], unknown>;
}

export function useCartBot({
  cartState,
  subscriptionCartState,
  totalSubscriptionItems,
  loading,
  update,
  cartSubTotal,
  cartRewardQuery,
}: ICartBotProps) {
  if (!cartRewardQuery.data) {
    return [];
  }
  const {
    foundMissingItemInCart,
    foundExtraItemInCart,
    updates,
    display_only_cart_items,
  } = getCartBotUpdates({
    cartRewards: cartRewardQuery.data,
    cartSubTotal,
    totalSubscriptionItems,
    cartState,
  });

  if ((foundMissingItemInCart || foundExtraItemInCart) && !loading) {
    update(updates);
  }
  return display_only_cart_items;
}

interface IGetCartBotUpdates {
  cartRewards: IProgressBarRewardAnimation[];
  cartSubTotal: number;
  totalSubscriptionItems: number;
  cartState: ICartState;
}

const todayRightNow = new Date();

export function getCartBotUpdates({
  cartRewards,
  cartSubTotal,
  totalSubscriptionItems,
  cartState,
}: IGetCartBotUpdates) {
  const display_only_cart_items: IAddToCartDisplayOnly[] = [];

  // Convert cartRewardQuery data into cart bot items
  const cartBotItems: ICartBotItem[] = cartRewards.map((reward) => {
    const triggers: ICartBotItemTrigger[] = [];
    if (reward.reward_type === "MONETARY" && reward.reward_threshold) {
      triggers.push({
        enum: ICartBotItemTriggerEnum.CART_VALUE_EXCEEDS,
        params: { value: reward.reward_threshold },
      });
    }
    if (reward.reward_type === "SUBSCRIPTION") {
      triggers.push({
        enum: ICartBotItemTriggerEnum.SUBSCRIPTION_ITEMS_PRESENT,
        params: { value: reward.reward_threshold },
      });
    }
    return {
      id: reward.id,
      name: reward.name,
      variant_ids: reward.add_to_cart.map((a2c) =>
        parseInt(a2c.variant_id.split("/").pop() as string),
      ),
      triggers,
      a2c_display_only: reward.add_to_cart_display_only,
    };
  });

  // Build update object & evaluate if items should be in or out
  const pre_updates: any = {};
  const updates: any = {};

  cartBotItems.forEach((cbi) => {
    let foundTrueTrigger = false;
    let withinDateRange = true;

    // if (cbi.start_date && cbi.end_date) {
    //   if (todayRightNow < cbi.start_date || todayRightNow > cbi.end_date) {
    //     withinDateRange = false;
    //   }
    // }

    cbi.triggers.forEach((trigger) => {
      switch (trigger.enum) {
        case ICartBotItemTriggerEnum.CART_VALUE_EXCEEDS:
          foundTrueTrigger = cartSubTotal >= trigger.params.value;
          break;
        case ICartBotItemTriggerEnum.SUBSCRIPTION_ITEMS_PRESENT:
          foundTrueTrigger = totalSubscriptionItems >= trigger.params.value;
          break;
        case ICartBotItemTriggerEnum.VARIANT_ID_IN_CART:
          foundTrueTrigger = variantIdInCart({
            items: cartState.items,
            variant_ids: trigger.params.variant_ids,
          });
          break;
        default:
          return;
      }
    });

    cbi.variant_ids.forEach((vid) => {
      if (!pre_updates[vid]) {
        pre_updates[vid] = {};
      }
      pre_updates[vid][cbi.id] = foundTrueTrigger && withinDateRange ? 1 : 0;
    });

    if (foundTrueTrigger && withinDateRange) {
      display_only_cart_items.push(...cbi.a2c_display_only);
    }
  });

  // set reward update to MAX quantity found in map
  Object.keys(pre_updates).forEach((pre_update_key) => {
    const obj = pre_updates[pre_update_key];
    let update_quantity = 0;
    Object.keys(obj).forEach((obj_key) => {
      if (obj[obj_key] > update_quantity) {
        update_quantity = obj[obj_key];
      }
    });
    updates[pre_update_key] = update_quantity;
  });

  // temporary rule to prevent adding travel pack if
  // only item in cart is a gift cart
  let cart_contains_only_gift_card_or_mental_health = false;
  const filtered_items_for_gift_cards_and_mental_health =
    cartState.items.filter(
      (item) =>
        [
          48138060661049, 45397908357433, 45397908390201, 45397908422969,
          45397908455737, 45397908488505, 45397908521273,
        ].indexOf(item.variant_id) !== -1,
    );
  const items_that_arent_gifts = cartState.items.filter(
    (item) => item.product_type !== "Gift",
  );
  cart_contains_only_gift_card_or_mental_health =
    items_that_arent_gifts.length ===
    filtered_items_for_gift_cards_and_mental_health.length;

  // free travel set
  if (
    updates[49182276747577] === 1 &&
    cart_contains_only_gift_card_or_mental_health
  ) {
    updates[49182276747577] = 0;
  }

  // sticker
  if (
    updates[48056421482809] === 1 &&
    cart_contains_only_gift_card_or_mental_health
  ) {
    updates[48056421482809] = 0;
  }

  // Compare updates with current cart state
  let foundMissingItemInCart = false;
  Object.keys(updates).forEach((updateVariantId) => {
    if (
      !cartState.items.find(
        (csi) => csi.variant_id === parseInt(updateVariantId),
      ) &&
      updates[updateVariantId] > 0
    ) {
      foundMissingItemInCart = true;
    }
  });

  let foundExtraItemInCart = false;
  cartState.items.forEach((csi) => {
    if (
      cartBotItems.find((cbi) => {
        if (cbi.variant_ids.indexOf(csi.variant_id) !== -1) {
          return true;
        }
        return false;
      }) &&
      updates[csi.variant_id] == 0
    ) {
      foundExtraItemInCart = true;
    }
  });
  return {
    foundMissingItemInCart,
    foundExtraItemInCart,
    updates,
    display_only_cart_items,
  };
}
