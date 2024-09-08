import { IPlans } from "./plans";

export const referenceString = "v2-subscription-items";

export const plans: IPlans = {
  base: {
    display_name: "Base",
    bag_min: 2,
    perk_list: ["10% savings", "Free shipping", "Experimental samples"],
    discount: 0.1,
    type: "base",
  },
  pro: {
    display_name: "Pro",
    bag_min: 3,
    perk_list: [
      "20% savings",
      "Free shipping",
      "Experimental samples",
      "Free Yeti Tumbler",
    ],
    discount: 0.2,
    type: "pro",
  },
  elite: {
    display_name: "Elite",
    bag_min: 4, // or 5 pound bag
    perk_list: [
      "25% savings",
      "Free shipping",
      "Experimental samples",
      "Free Yeti Tumbler",
      "Free BOCO hat",
    ],
    discount: 0.25,
    type: "elite",
  },
};

export type TUseCartItemProductCosts = (
  price: number,
  compare_at_price: number,
  quantity: number,
) => {
  subscribe_and_save_total_cost: string;
  subscribe_and_save_discounted_cost: string;
  one_time_total_cost: string;
  one_time_compare_at_cost: string;
};
