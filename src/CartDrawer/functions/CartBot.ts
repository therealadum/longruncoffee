import { useEffect } from "react";
import { ICartState, ISubscriptionCartState } from "../../common/product";
import { useSessionTime } from "../../common/useSessionTime";

enum ICartBotItemTriggerEnum {
  "ANYTHING_IN_CART" = "ANYTHING_IN_CART",
  "SESSION_TIME" = "SESSION_TIME",
  "SUBSCRIPTION_ITEMS_PRESENT" = "SUBSCRIPTION_ITEMS_PRESENT",
  "CART_VALUE_EXCEEDS" = "CART_VALUE_EXCEEDS",
}

interface ICartBotItemTrigger {
  enum: ICartBotItemTriggerEnum;
  params?: any;
}

interface ICartBotItem {
  variant_id: number;
  name: string;
  triggers: ICartBotItemTrigger[];
  start_date?: Date;
  end_date?: Date;
}

const SANTA_START_DATE = new Date("11/9/24");
SANTA_START_DATE.setHours(23, 0, 0, 0);
const SANTA_END_DATE = new Date("11/15/24");
SANTA_END_DATE.setHours(0, 0, 0, 0);

const todayRightNow = new Date();

const cart_bot_items: ICartBotItem[] = [
  {
    name: "Free Sticker",
    variant_id: 48056421482809,
    triggers: [
      {
        enum: ICartBotItemTriggerEnum.ANYTHING_IN_CART,
      },
      // {
      //   enum: ICartBotItemTriggerEnum.SESSION_TIME,
      // },
    ],
  },
  {
    name: "Free Travel Set",
    variant_id: 49182276747577,
    triggers: [
      {
        enum: ICartBotItemTriggerEnum.ANYTHING_IN_CART,
      },
      // {
      //   enum: ICartBotItemTriggerEnum.SESSION_TIME,
      // },
    ],
  },
  {
    name: "Free Sleighin' Miles",
    variant_id: 50087451951417,
    start_date: SANTA_START_DATE,
    end_date: SANTA_END_DATE,
    triggers: [
      {
        enum: ICartBotItemTriggerEnum.SUBSCRIPTION_ITEMS_PRESENT,
      },
    ],
  },
  {
    name: "Free Experimental - #1",
    variant_id: 48137979953465,
    triggers: [
      {
        enum: ICartBotItemTriggerEnum.SUBSCRIPTION_ITEMS_PRESENT,
      },
    ],
  },
  {
    name: "Free Experimental - #2",
    variant_id: 48138029531449,
    triggers: [
      {
        enum: ICartBotItemTriggerEnum.SUBSCRIPTION_ITEMS_PRESENT,
      },
    ],
  },
];

interface ICartBotProps {
  cartState: ICartState;
  subscriptionCartState: ISubscriptionCartState;
  loading: boolean;
  update: (updates: any) => Promise<void>;
  cartSubTotal: number;
}

export function useCartBot({
  cartState,
  subscriptionCartState,
  loading,
  update,
  cartSubTotal,
}: ICartBotProps) {
  const sessionLengthAdequate = useSessionTime(20);
  useEffect(() => {
    let mounted = true;
    if (loading) {
      return;
    }
    const triggerEvaluations: Map<ICartBotItemTriggerEnum, any> = new Map<
      ICartBotItemTriggerEnum,
      boolean
    >();
    // evaluate if enums are true
    // anything in cart
    triggerEvaluations.set(
      ICartBotItemTriggerEnum.ANYTHING_IN_CART,
      cartState.items.filter((item) => item.product_type !== "Gift").length >
        0 || subscriptionCartState.items.length > 0,
    );
    // subscription items present
    triggerEvaluations.set(
      ICartBotItemTriggerEnum.SUBSCRIPTION_ITEMS_PRESENT,
      subscriptionCartState.items.length > 0,
    );
    // session time
    triggerEvaluations.set(
      ICartBotItemTriggerEnum.SESSION_TIME,
      sessionLengthAdequate,
    );
    // cart value
    triggerEvaluations.set(
      ICartBotItemTriggerEnum.CART_VALUE_EXCEEDS,
      cartSubTotal,
    );
    // build update object & evaluate if items should be in or out
    const updates: any = {};
    cart_bot_items.forEach((cbi) => {
      let found_true_trigger = false;
      let within_date_range = true;
      // if date range is there, evaluate that first
      if (cbi.start_date && cbi.end_date) {
        if (todayRightNow < cbi.start_date || todayRightNow > cbi.end_date) {
          within_date_range = false;
        }
      }
      // otherwise, iterate thru triggers
      cbi.triggers.forEach((trig) => {
        if (trig.enum !== ICartBotItemTriggerEnum.CART_VALUE_EXCEEDS) {
          if (triggerEvaluations.get(trig.enum)) {
            found_true_trigger = true;
          }
        } else {
          const v = triggerEvaluations.get(trig.enum);
          if (v && trig.params.value && v > trig.params.value) {
            found_true_trigger = true;
          }
        }
      });
      updates[cbi.variant_id] = found_true_trigger && within_date_range ? 1 : 0;
    });

    // if updates are materially different from cart, send update
    let found_missing_item_in_cart = false;
    Object.keys(updates).forEach((updateVariantId) => {
      if (
        !cartState.items.find(
          (csi) => csi.variant_id === parseInt(updateVariantId),
        ) &&
        updates[updateVariantId] > 0
      ) {
        found_missing_item_in_cart = true;
      }
    });
    let found_extra_item_in_cart = false;
    cartState.items.forEach((csi) => {
      // if the cart has a cartbot item, but the updates has 0 quantity - remove it
      if (
        cart_bot_items.find((cbi) => cbi.variant_id === csi.variant_id) &&
        updates[csi.variant_id] == 0
      ) {
        found_extra_item_in_cart = true;
      }
    });

    if (found_missing_item_in_cart || (found_extra_item_in_cart && mounted)) {
      update(updates);
    }

    return () => {
      mounted = false;
    };
  }, [cartState, subscriptionCartState, loading, sessionLengthAdequate]);
}
