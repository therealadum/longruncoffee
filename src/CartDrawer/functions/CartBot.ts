import { ICartState, ISubscriptionCartState } from "../../common/product";
import { UseQueryResult } from "react-query";
import {
  IAddToCartDisplayOnly,
  IProgressBarRewardAnimation,
} from "../sections/ProgressBar";

export enum ICartBotItemTriggerEnum {
  "SUBSCRIPTION_ITEMS_PRESENT" = "SUBSCRIPTION_ITEMS_PRESENT",
  "CART_VALUE_EXCEEDS" = "CART_VALUE_EXCEEDS",
}

export interface ICartBotItemTrigger {
  enum: ICartBotItemTriggerEnum;
  params?: any;
}

export interface ICartBotItem {
  variant_ids: number[];
  a2c_display_only: IAddToCartDisplayOnly[];
  name: string;
  triggers: ICartBotItemTrigger[];
}

const todayRightNow = new Date();

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
      name: reward.name,
      variant_ids: reward.add_to_cart.map((a2c) =>
        parseInt(a2c.variant_id.split("/").pop() as string),
      ),
      triggers,
      a2c_display_only: reward.add_to_cart_display_only,
    };
  });

  // Build update object & evaluate if items should be in or out
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
        default:
          return;
      }
    });

    cbi.variant_ids.forEach((vid) => {
      updates[vid] = foundTrueTrigger && withinDateRange ? 1 : 0;
    });

    if (foundTrueTrigger && withinDateRange) {
      display_only_cart_items.push(...cbi.a2c_display_only);
    }
  });

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
