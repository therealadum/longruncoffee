import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useQuery, UseQueryResult } from "react-query";

export interface IReward {
  id: number;
  name: string;
  image: string;
  reward_type: "SUBSCRIPTION" | "MONETARY";
  reward_threshold: number;
  perks: string[];
  progress: number;
  state: "UNLOCKED" | "ANIMATING" | "LOCKED";
}

// Helper: compute a signature for a reward based on its defining properties.
function getRewardSignature(reward: IReward): string {
  const { id, name, image, reward_type, reward_threshold, perks } = reward;
  return JSON.stringify({
    id,
    name,
    image,
    reward_type,
    reward_threshold,
    perks,
  });
}

function handle_item_change(
  totalSubscriptionItems: number,
  cartSubtotal: number,
  rewards: IReward[],
  rewardQuery: UseQueryResult<IReward[], unknown>,
) {
  if (!rewardQuery.data) {
    return [];
  }
  const targetRewardType =
    totalSubscriptionItems > 0 ? "SUBSCRIPTION" : "MONETARY";
  const filteredRewards = rewards.filter(
    (reward) => reward.reward_type === targetRewardType,
  );
  const netNewUnlocks = filteredRewards.filter((reward) => {
    const currentValue =
      reward.reward_type === "MONETARY" ? cartSubtotal : totalSubscriptionItems;
    return currentValue >= reward.reward_threshold && reward.state === "LOCKED";
  });
  netNewUnlocks.sort((a, b) => a.reward_threshold - b.reward_threshold);
  const updates = netNewUnlocks.map((reward) => ({
    unlocked: true,
    item_id: reward.id,
  }));
  return updates;
}

interface IRewardUpdate {
  unlocked: boolean;
  item_id: number;
}
interface ProcessQueuedUpdateProps {
  update: IRewardUpdate;
  rewards: IReward[];
  setRewards: (newRewards: IReward[]) => void;
}

async function process_queued_update({
  update,
  rewards,
  setRewards,
}: ProcessQueuedUpdateProps): Promise<void> {
  if (!update.unlocked) {
    return;
  }
  const index = rewards.findIndex((r) => r.id === update.item_id);
  if (index === -1) {
    return;
  }
  if (rewards[index].state !== "LOCKED") {
    return;
  }
  // Set state to ANIMATING to trigger RewardCard animation.
  const newRewards = rewards.map((r) =>
    r.id === update.item_id ? { ...r, state: "ANIMATING" } : r,
  );
  setRewards(newRewards as IReward[]);
  const ANIMATION_DELAY = 2250; // adjust as needed
  await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAY));
  // Set state to UNLOCKED after animation finishes.
  const finalRewards = newRewards.map((r) =>
    r.id === update.item_id && r.state === "ANIMATING"
      ? { ...r, state: "UNLOCKED" }
      : r,
  );
  setRewards(finalRewards as IReward[]);
  // Update localStorage: store the signature of the animated reward.
  const updatedReward = finalRewards.find((r) => r.id === update.item_id);
  if (updatedReward) {
    const storedData = localStorage.getItem("animatedRewards");
    const animatedRewards = storedData ? JSON.parse(storedData) : {};
    animatedRewards[updatedReward.id] = getRewardSignature(
      updatedReward as IReward,
    );
    localStorage.setItem("animatedRewards", JSON.stringify(animatedRewards));
  }
}

function filter_and_sort_rewards(
  rewards: IReward[],
  reward_type: "MONETARY" | "SUBSCRIPTION",
  currentValue: number,
  isBusy: boolean, // new parameter to check if an animation is in progress
) {
  const rewardsOfType = rewards.filter((r) => r.reward_type === reward_type);
  const unlockedOrAnimating = rewardsOfType
    .filter((r) => r.state === "UNLOCKED" || r.state === "ANIMATING")
    .sort((a, b) => b.reward_threshold - a.reward_threshold);

  // If an animation is in progress, do not show a preview.
  if (isBusy) {
    return unlockedOrAnimating;
  }

  // Only add a preview reward if no reward is animating.
  const isAnimating = rewardsOfType.some((r) => r.state === "ANIMATING");
  if (!isAnimating) {
    const lockedRewards = rewardsOfType
      .filter((r) => r.state === "LOCKED")
      .sort((a, b) => a.reward_threshold - b.reward_threshold);
    const nextPreview = lockedRewards.find(
      (r) => r.reward_threshold > currentValue,
    );
    if (nextPreview) {
      return [...unlockedOrAnimating, nextPreview].sort(
        (a, b) => b.reward_threshold - a.reward_threshold,
      );
    }
  }
  return unlockedOrAnimating;
}

interface IUseRewards {
  totalSubscriptionItems: number;
  cartSubtotal: number;
}
export function useRewards({
  totalSubscriptionItems,
  cartSubtotal,
}: IUseRewards) {
  const rewardQuery = useQuery<IReward[]>({
    queryKey: ["cart-progress-rewards"],
    queryFn: async () => {
      try {
        const response = await axios(
          "https://seal-app-nr7lb.ondigitalocean.app/backend/cart-rewards",
          { method: "GET" },
        );
        return response.data.data;
      } catch (e) {
        console.error(e);
      }
    },
  });
  const [updateQueue, setUpdateQueue] = useState<IRewardUpdate[]>([]);
  const [busy, setBusy] = useState(false);
  const rewards = useRef<IReward[]>([]);
  // Dummy state to force re-renders when updating the ref.
  const [forceUpdate, setForceUpdate] = useState(0);

  // Determine reward type.
  const reward_type = totalSubscriptionItems > 0 ? "SUBSCRIPTION" : "MONETARY";

  // Initialize rewards when rewardQuery.data is loaded.
  useEffect(() => {
    if (rewardQuery.data && rewards.current.length === 0) {
      const storedData = localStorage.getItem("animatedRewards");
      const animatedRewards = storedData ? JSON.parse(storedData) : {};
      rewards.current = rewardQuery.data.map((r) => {
        const value =
          r.reward_type === "MONETARY" ? cartSubtotal : totalSubscriptionItems;
        const signature = getRewardSignature(r);
        const hasAnimatedBefore = animatedRewards[r.id] === signature;
        return {
          ...r,
          progress:
            value >= r.reward_threshold
              ? 100
              : Math.floor((value * 100) / r.reward_threshold),
          state:
            value >= r.reward_threshold
              ? hasAnimatedBefore
                ? "UNLOCKED"
                : "LOCKED"
              : "LOCKED",
        };
      });

      const updates = handle_item_change(
        totalSubscriptionItems,
        cartSubtotal,
        rewards.current,
        rewardQuery,
      );
      if (updates.length) {
        setUpdateQueue((prevQueue) => [...prevQueue, ...updates]);
      } else {
        setForceUpdate((prev) => prev + 1);
      }
    }
  }, [rewardQuery.data, totalSubscriptionItems, cartSubtotal, setUpdateQueue]);

  // Force re-render when recalculating reward progress and locking/unlocking.
  useEffect(() => {
    rewards.current = rewards.current.map((r) => {
      const currentValue =
        r.reward_type === "MONETARY" ? cartSubtotal : totalSubscriptionItems;
      const newProgress =
        currentValue >= r.reward_threshold
          ? 100
          : Math.floor((currentValue * 100) / r.reward_threshold);
      const storedData = localStorage.getItem("animatedRewards");
      const animatedRewards = storedData ? JSON.parse(storedData) : {};
      const signature = getRewardSignature(r);
      const hasAnimatedBefore = animatedRewards[r.id] === signature;

      // If the reward no longer meets the threshold, remove any stored signature.
      if (currentValue < r.reward_threshold) {
        if (animatedRewards[r.id]) {
          delete animatedRewards[r.id];
          localStorage.setItem(
            "animatedRewards",
            JSON.stringify(animatedRewards),
          );
        }
        return { ...r, progress: newProgress, state: "LOCKED" };
      } else {
        // Otherwise, keep the reward state: if it has animated before, it's UNLOCKED,
        // otherwise leave its current state (which could be LOCKED so that it animates).
        return {
          ...r,
          progress: newProgress,
          state: hasAnimatedBefore ? "UNLOCKED" : r.state,
        };
      }
    });
    if (updateQueue.length === 0) {
      setForceUpdate((prev) => prev + 1);
    }
  }, [cartSubtotal, totalSubscriptionItems, updateQueue]);

  // Queue updates when cart/subscription values change.
  useEffect(() => {
    const updates = handle_item_change(
      totalSubscriptionItems,
      cartSubtotal,
      rewards.current,
      rewardQuery,
    );
    if (updates.length) {
      setUpdateQueue((prevQueue) => [...prevQueue, ...updates]);
    }
  }, [totalSubscriptionItems, cartSubtotal]);

  // Process queue items one at a time.
  useEffect(() => {
    if (updateQueue.length && !busy) {
      const [update, ...remaining_queue] = updateQueue;
      setBusy(true);
      setUpdateQueue(remaining_queue);
      process_queued_update({
        update,
        rewards: rewards.current,
        setRewards: (newRewards) => (rewards.current = newRewards),
      }).then(() => {
        setBusy(false);
      });
    }
  }, [updateQueue, busy]);

  // Return rewards (filtered, sorted in descending order) to the UI.
  return {
    reward_type,
    is_busy: updateQueue.length > 0,
    rewards: filter_and_sort_rewards(
      rewards.current,
      reward_type,
      reward_type === "MONETARY" ? cartSubtotal : totalSubscriptionItems,
      busy,
    ),
  };
}
