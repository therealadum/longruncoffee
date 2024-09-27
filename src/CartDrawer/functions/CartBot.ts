import { useEffect } from "react";
import { ICartState, ISubscriptionCartState } from "../../common/product";
import { useSessionTime } from "../../common/useSessionTime";

enum ICartBotItemTriggerEnum {
  "ANYTHING_IN_CART" = "ANYTHING_IN_CART",
  "SESSION_TIME" = "SESSION_TIME",
  "SUBSCRIPTION_ITEMS_PRESENT" = "SUBSCRIPTION_ITEMS_PRESENT",
}

interface ICartBotItemTrigger {
  enum: ICartBotItemTriggerEnum;
  //   params?: any;
}

interface ICartBotItem {
  variant_id: number;
  name: string;
  triggers: ICartBotItemTrigger[];
  start_date?: Date;
  end_date?: Date;
}

const RACE_SEASON_ROAST_START_DATE = new Date("9/8/24");
RACE_SEASON_ROAST_START_DATE.setHours(0, 0, 0, 0);
const RACE_SEASON_ROAST_END_DATE = new Date("9/14/24");
RACE_SEASON_ROAST_END_DATE.setHours(0, 0, 0, 0);

const todayRightNow = new Date();

const cart_bot_items: ICartBotItem[] = [
  {
    name: "Free Sticker",
    variant_id: 48056421482809,
    triggers: [
      {
        enum: ICartBotItemTriggerEnum.ANYTHING_IN_CART,
      },
      {
        enum: ICartBotItemTriggerEnum.SESSION_TIME,
      },
    ],
  },
  {
    name: "Free Travel Set",
    variant_id: 49182276747577,
    triggers: [
      {
        enum: ICartBotItemTriggerEnum.ANYTHING_IN_CART,
      },
      {
        enum: ICartBotItemTriggerEnum.SESSION_TIME,
      },
    ],
  },
  {
    name: "Free Race Season Roast",
    variant_id: 49843237552441,
    start_date: RACE_SEASON_ROAST_START_DATE,
    end_date: RACE_SEASON_ROAST_END_DATE,
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
}

export function useCartBot({
  cartState,
  subscriptionCartState,
  loading,
  update,
}: ICartBotProps) {
  const sessionLengthAdequate = useSessionTime(20);
  useEffect(() => {
    let mounted = true;
    if (loading) {
      return;
    }
    const triggerEvaluations: Map<ICartBotItemTriggerEnum, boolean> = new Map<
      ICartBotItemTriggerEnum,
      boolean
    >();
    // evaluate if enums are true
    // anything in cart
    triggerEvaluations.set(
      ICartBotItemTriggerEnum.ANYTHING_IN_CART,
      cartState.items.filter((item) => item.product_type !== "Gift").length > 0,
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
        if (triggerEvaluations.get(trig.enum)) {
          found_true_trigger = true;
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
