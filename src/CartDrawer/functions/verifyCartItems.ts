import { UseQueryResult } from "react-query";
import { ICartState } from "../../common/product";
import { IProgressBarRewardAnimation } from "../sections/ProgressBar";
import {
  ICartBotItem,
  ICartBotItemTrigger,
  ICartBotItemTriggerEnum,
} from "./CartBot";

interface IVerifyCartItemsProps {
  cartState: ICartState;
  totalSubscriptionItems: number;
  cartSubTotal: number;
  cartRewardQuery: UseQueryResult<IProgressBarRewardAnimation[], unknown>;
}

const todayRightNow = new Date();

export enum IVerifyCartItemsResponse {
  "VALID",
  "MISSING_DATA",
  "TOO_MANY_CART_ITEMS",
  "MISSING_CART_ITEMS",
}

export function verifyCartItems({
  cartState,
  totalSubscriptionItems,
  cartSubTotal,
  cartRewardQuery,
}: IVerifyCartItemsProps): IVerifyCartItemsResponse {
  if (!cartRewardQuery.data) {
    return IVerifyCartItemsResponse.MISSING_DATA;
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
  if (foundMissingItemInCart) {
    return IVerifyCartItemsResponse.MISSING_CART_ITEMS;
  }

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
  if (foundExtraItemInCart) {
    return IVerifyCartItemsResponse.TOO_MANY_CART_ITEMS;
  }

  return IVerifyCartItemsResponse.VALID;
}
