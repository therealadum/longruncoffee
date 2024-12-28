import { UseQueryResult } from "react-query";
import { ICartState } from "../../common/product";
import { IProgressBarRewardAnimation } from "../sections/ProgressBar";
import {
  ICartBotItem,
  ICartBotItemTrigger,
  ICartBotItemTriggerEnum,
} from "./CartBot";
import { variantIdInCart } from "../upsells/functions/variantIdInCart";

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
      updates[vid] = foundTrueTrigger && withinDateRange ? 1 : 0;
    });
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
