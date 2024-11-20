import { useEffect, useState } from "react";
import { ICartState, ISubscriptionCartState } from "../../common/product";
import { UseQueryResult } from "react-query";
import {
  IAddToCartDisplayOnly,
  IProgressBarRewardAnimation,
} from "../sections/ProgressBar";
import { isEqual } from "lodash";

enum ICartBotItemTriggerEnum {
  "SUBSCRIPTION_ITEMS_PRESENT" = "SUBSCRIPTION_ITEMS_PRESENT",
  "CART_VALUE_EXCEEDS" = "CART_VALUE_EXCEEDS",
}

interface ICartBotItemTrigger {
  enum: ICartBotItemTriggerEnum;
  params?: any;
}

interface ICartBotItem {
  variant_ids: number[];
  a2c_display_only: IAddToCartDisplayOnly[];
  name: string;
  triggers: ICartBotItemTrigger[];
  start_date?: Date;
  end_date?: Date;
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
  const display_only_cart_items: IAddToCartDisplayOnly[] = [];
  if (!cartRewardQuery.data) {
    return [];
  }

  // Convert cartRewardQuery data into cart bot items
  const cartBotItems: ICartBotItem[] = cartRewardQuery.data.map((reward) => {
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
      // start_date: reward.start_date ? new Date(reward.start_date) : undefined,
      // end_date: reward.end_date ? new Date(reward.end_date) : undefined,
    };
  });

  // Build update object & evaluate if items should be in or out
  const updates: any = {};
  cartBotItems.forEach((cbi) => {
    let foundTrueTrigger = false;
    let withinDateRange = true;

    if (cbi.start_date && cbi.end_date) {
      if (todayRightNow < cbi.start_date || todayRightNow > cbi.end_date) {
        withinDateRange = false;
      }
    }

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

  if ((foundMissingItemInCart || foundExtraItemInCart) && !loading) {
    update(updates);
  }
  return display_only_cart_items;
}
