import { QueryClientProvider } from "react-query";
import { queryClient } from "../../../common/queryClient";
import { RewardCards } from "../../../RewardCards";
import { useRewards } from "./hook";

interface IProgressBarProps {
  totalSubscriptionItems: number;
  cartSubtotal: number;
}

export interface IAddToCartDisplayOnly {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface IProgressBarRewardAnimation {
  id: number;
  name: string;
  image: string;
  reward_type: "SUBSCRIPTION" | "MONETARY";
  reward_threshold: number;
  perks: string[];
  reward_state: "NOT_REWARDED_YET" | "NEXT_REWARD" | "PREV_REWARD" | "REWARDED";
  add_to_cart: { id: string; handle: string; variant_id: string }[];
  add_to_cart_display_only: IAddToCartDisplayOnly[];
}

export function ProgressBar({
  totalSubscriptionItems,
  cartSubtotal,
}: IProgressBarProps) {
  const { rewards, reward_type } = useRewards({
    totalSubscriptionItems,
    cartSubtotal,
  });

  return (
    <>
      <RewardCards
        rewards={rewards}
        compare_val={
          reward_type === "MONETARY" ? cartSubtotal : totalSubscriptionItems
        }
      />
    </>
  );
}

export function ProgressBarStorybook({
  totalSubscriptionItems,
  cartSubtotal,
}: IProgressBarProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ProgressBar
        totalSubscriptionItems={totalSubscriptionItems}
        cartSubtotal={cartSubtotal}
      />
    </QueryClientProvider>
  );
}
