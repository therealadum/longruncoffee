import { UseQueryResult } from "react-query";
import { ICartState } from "../../common/product";
import { IProgressBarRewardAnimation } from "../sections/ProgressBar";
import {
  getCartBotUpdates,
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
  const { foundMissingItemInCart, foundExtraItemInCart } = getCartBotUpdates({
    cartRewards: cartRewardQuery.data,
    cartSubTotal,
    totalSubscriptionItems,
    cartState,
  });
  if (foundMissingItemInCart) {
    return IVerifyCartItemsResponse.MISSING_CART_ITEMS;
  }
  if (foundExtraItemInCart) {
    return IVerifyCartItemsResponse.TOO_MANY_CART_ITEMS;
  }

  return IVerifyCartItemsResponse.VALID;
}
