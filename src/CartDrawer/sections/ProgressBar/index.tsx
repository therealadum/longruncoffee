import { useEffect, useState } from "react";
import { cart_progress_bar_request } from "../../testdata";
import { ExpandableImage } from "./ExpandableImage";
import { motion } from "framer-motion";
import { QueryClientProvider, useQuery } from "react-query";
import axios from "axios";
import { queryClient } from "../../../common/queryClient";

interface IProgressBarProps {
  isCartEmpty: boolean;
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

function getProgressPercent(
  compare_val: number,
  prev_val: number | undefined,
  next_val: number | undefined,
  is_subscription: boolean,
): number {
  if (!next_val) {
    return 100;
  }

  let v = 0;
  if (is_subscription || !prev_val) {
    v = (compare_val / next_val) * 100;
  } else if (!is_subscription && prev_val) {
    v = ((compare_val - prev_val) / (next_val - prev_val)) * 100;
  }
  return v;
}

function ProgressBar({
  isCartEmpty,
  totalSubscriptionItems,
  cartSubtotal,
}: IProgressBarProps) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["cart-progress-rewards"],
    queryFn: async () => {
      let data: IProgressBarRewardAnimation[] =
        cart_progress_bar_request.data.map((d) => ({
          ...(d as IProgressBarRewardAnimation),
        }));
      try {
        const response = await axios(
          "https://seal-app-nr7lb.ondigitalocean.app/backend/cart-rewards",
          {
            method: "GET",
          },
        );
        data = response.data.data;
      } catch (e) {
        console.error(e);
      }
      return data;
    },
  });

  const filter_val = totalSubscriptionItems > 0 ? "SUBSCRIPTION" : "MONETARY";
  const applicable_rewards =
    data?.filter((d) => d.reward_type === filter_val)?.map((el) => el) || [];

  // find next reward value
  // make previous reward... previous reward
  let found_next_reward: null | IProgressBarRewardAnimation = null;
  let found_prev_reward: null | IProgressBarRewardAnimation = null;
  const compare_val =
    totalSubscriptionItems > 0 ? totalSubscriptionItems : cartSubtotal;

  for (let i = 0; i < applicable_rewards.length; i++) {
    if (
      applicable_rewards[i].reward_threshold > compare_val &&
      !found_next_reward
    ) {
      applicable_rewards[i].reward_state = "NEXT_REWARD";
      found_next_reward = applicable_rewards[i];
      if (i > 0) {
        applicable_rewards[i - 1].reward_state = "PREV_REWARD";
        found_prev_reward = applicable_rewards[i - 1];
      }
    } else if (applicable_rewards[i].reward_threshold <= compare_val) {
      applicable_rewards[i].reward_state = "REWARDED";
      found_prev_reward = applicable_rewards[i];
    } else {
      applicable_rewards[i].reward_state = "NOT_REWARDED_YET";
    }
  }

  const [percent, setPercent] = useState<number>(
    getProgressPercent(
      compare_val,
      found_prev_reward?.reward_threshold,
      found_next_reward?.reward_threshold,
      totalSubscriptionItems > 0,
    ),
  );
  useEffect(() => {
    if (found_next_reward) {
      setPercent(
        getProgressPercent(
          compare_val,
          // @ts-ignore
          found_prev_reward?.reward_threshold,
          found_next_reward?.reward_threshold,
          totalSubscriptionItems > 0,
        ),
      );
    } else {
      setPercent(100);
    }
  }, [
    totalSubscriptionItems,
    cartSubtotal,
    found_next_reward,
    found_prev_reward,
  ]);

  if (!data || !data.length) {
    return null;
  }

  const percent_offset = found_prev_reward && found_next_reward ? 50 : 0;
  const derrived_percent = !found_next_reward
    ? 100
    : found_prev_reward
    ? (50 * percent) / 100
    : percent;

  const amt_remaining_for_next_reward = found_next_reward
    ? totalSubscriptionItems == 0
      ? (found_next_reward.reward_threshold - compare_val) / 100
      : found_next_reward.reward_threshold - compare_val
    : 0;

  return (
    <div className="p-4 pb-0">
      <div className="relative rounded-full h-4 w-full bg-cyan-50 border border-cyan-500">
        <div
          className="absolute left-0 top-0 bottom-0 rounded-full bg-cyan-400 transition-all duration-500"
          style={{ width: `${derrived_percent + percent_offset}%` }}
        />
        {applicable_rewards.map((reward) => {
          if (
            reward.reward_state === "NEXT_REWARD" ||
            reward.reward_state === "PREV_REWARD"
          ) {
            return (
              <motion.div
                key={reward.id}
                initial={{
                  opacity: 0,
                  right: "0%",
                  transform:
                    reward.reward_state === "PREV_REWARD"
                      ? "translate(50%,-50%)"
                      : "translate(0,-50%)",
                }}
                animate={{
                  opacity: 1,
                  right: reward.reward_state === "PREV_REWARD" ? "50%" : "0%",
                  transform:
                    reward.reward_state === "PREV_REWARD"
                      ? "translate(50%,-50%)"
                      : "translate(0,-50%)",
                }}
                transition={{ duration: 0.5 }}
                className="z-20 absolute top-1/2 -mr-1"
              >
                <ExpandableImage
                  img={`${reward.image}&width=500`}
                  title={reward.name}
                  id={reward.id}
                  perks={reward.perks}
                  is_previous={reward.reward_state === "PREV_REWARD"}
                />
              </motion.div>
            );
          }
        })}
      </div>
      <h4 className="text-cyan-600 font-accent text-xl text-center mt-3 leading-6">
        {found_next_reward
          ? `${
              totalSubscriptionItems > 0 ? "" : "$"
            }${amt_remaining_for_next_reward.toFixed(2)} more${
              totalSubscriptionItems > 0 ? " item " : " "
            }to unlock ${found_next_reward.name}`
          : "All Rewards Unlocked!"}
      </h4>

      {/* <button
        className="mr-4"
        onClick={() => setTotalSubscriptionItems(totalSubscriptionItems + 1)}
      >
        up
      </button>
      <button
        onClick={() =>
          setTotalSubscriptionItems(
            totalSubscriptionItems > 0 ? totalSubscriptionItems - 1 : 0,
          )
        }
      >
        down
      </button> */}
    </div>
  );
}

export default ProgressBar;
