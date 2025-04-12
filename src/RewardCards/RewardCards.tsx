import {
  AnimatePresence,
  AnimateSharedLayout,
  motion,
  useAnimation,
} from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { emojiBlast } from "emoji-blast";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  LockClosedIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useOutsideClick } from "../common/useOutsideClick";
import { createPortal } from "react-dom";
import { IReward } from "../CartDrawer/sections/ProgressBar/hook";

interface BarberPoleProgressProps {
  progress: number;
  height?: string;
  rounded?: string;
}

function BarberPoleProgress({
  progress,
  height = "h-3",
  rounded = "rounded-full",
}: BarberPoleProgressProps) {
  const clampedProgress = Math.max(0, Math.min(progress, 100));

  return (
    <div className={`w-full bg-gray-100 overflow-hidden ${rounded}`}>
      <motion.div
        className={`${height} ${rounded} barber-pole-stripes`}
        initial={{ width: 0, backgroundColor: "#ffcd8f" }}
        animate={{
          width: `${clampedProgress}%`,
          backgroundColor: clampedProgress === 100 ? "#66cdd9" : "#ffcd8f",
          transition: { type: "tween" },
        }}
      />
    </div>
  );
}

const variants = {
  shake: {
    zIndex: 5000,
    rotate: [0, 2.5, 0, -2.5, 0, 2.5, 0, -2.5, 0],
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Tailwind's `shadow-md`
    transition: {
      type: "tween",
    },
  },
  scaleUp: {
    zIndex: 5000,
    scale: 1.1,
    boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.2)", // Tailwind's `shadow-lg`
    transition: {
      type: "tween",
    },
  },
  scaleDown: {
    zIndex: 5000,
    scale: 1,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Reset to `shadow-md`
    transition: {
      type: "tween",
    },
  },
  base: {
    zIndex: 0,
    scale: 1,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Reset to `shadow-md`
    transition: {
      type: "tween",
    },
  },
};

interface IRewardCard {
  reward: IReward;
  compare_val: number;
}

export function RewardCard({ reward, compare_val }: IRewardCard) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(cardRef, (evt) => {
    if (
      evt.target instanceof HTMLElement &&
      evt.target.classList.contains("seemore")
    ) {
      // do nothing if clicking the See More button
    } else {
      setExpanded(false);
    }
  });

  // Animation controls for the inner card animations
  const controls = useAnimation();

  useEffect(() => {
    async function runSequence() {
      await new Promise((resolve) => setTimeout(() => resolve(true), 500));
      await controls.start("shake");
      await new Promise((resolve) => setTimeout(() => resolve(true), 250));
      await controls.start("scaleUp");
      const element = cardRef.current;
      if (element) {
        emojiBlast({
          emojiCount: 10,
          emojis: ["☕"],
          position() {
            return {
              x: element.getBoundingClientRect().left + element.clientWidth / 2,
              y: element.getBoundingClientRect().top + element.clientHeight / 2,
            };
          },
        });
      }
      await new Promise((resolve) => setTimeout(() => resolve(true), 50));
      await controls.start("scaleDown");
      await controls.start("base");
    }
    if (reward.state === "ANIMATING") {
      runSequence();
    }
  }, [controls, reward.state]);

  // The content of the card that will be shared between collapsed and modal states.
  const cardContent = (
    <motion.div
      ref={cardRef}
      variants={variants}
      initial={{ opacity: 1 }}
      animate={controls}
      transition={{ type: "tween" }}
      className="bg-white relative border shadow-md border-neutral-200 overflow-hidden rounded-lg"
    >
      <div className="relative flex h-[8.5rem]">
        <div className="relative h-full flex-shrink-0 w-1/3 sm:w-[40%] mr-2 z-10 bg-white overflow-hidden rounded-l-lg topography-pattern">
          <img
            src={`${reward.image}&width=500`}
            alt="Reward"
            className="w-full h-full object-contain rounded-l-lg"
          />
        </div>
        <div className="flex flex-col flex-grow z-10 bg-white overflow-hidden rounded-br-lg">
          <div className="pr-3 md:pr-4 pt-2 md:pt-3">
            <BarberPoleProgress progress={reward.progress} />
          </div>
          <h4 className="pr-3 md:pr-4 pt-2 font-accent text-cyan-600 text-[1.15rem] leading-[1.40rem] tracking-tight overflow-hidden">
            {reward.name}
          </h4>
          <p className="mt-auto py-1 pr-3 md:pr-4 font-base text-sm text-neutral-600">
            {reward.reward_threshold - compare_val <= 0
              ? "Unlocked!"
              : reward.reward_type === "MONETARY"
              ? `$${((reward.reward_threshold - compare_val) / 100).toFixed(
                  2,
                )} more to unlock`
              : `${reward.reward_threshold - compare_val} more item${
                  reward.reward_threshold - compare_val > 1 ? "s" : ""
                } to unlock`}
          </p>
          <button
            onClick={() => setExpanded(true)}
            className="seemore border-t border-gray-100 transition-all text-center py-2 text-xs font-semibold text-cyan-700 hover:bg-cyan-600 hover:text-white"
          >
            See More
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Lock icon */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{
          opacity:
            reward.reward_threshold - compare_val <= 0 || expanded ? 0 : 1,
        }}
        transition={{ type: "tween" }}
        className="absolute z-20 -left-2 -top-2 rounded-full size-8 flex items-center justify-center bg-tan-200 shadow shadow-tan-700"
      >
        <LockClosedIcon className="size-4 text-tan-700" />
      </motion.div>

      {/* Render the small card normally (within the scroll container) when not expanded */}
      <AnimatePresence mode="wait">
        {!expanded && (
          <motion.div layoutId={`reward-card-${reward.id}`}>
            {cardContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* When expanded, render the transitioning element in a portal with fixed positioning */}
      {expanded &&
        createPortal(
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full fixed inset-0 pt-4 sm:pt-20 p-4 z-[2000] flex justify-center md:justify-end items-start bg-black bg-opacity-25"
            >
              <motion.div
                layoutId={`reward-card-${reward.id}`}
                className="bg-white shadow-md border border-neutral-200 rounded-lg overflow-hidden
                         w-full max-w-md z-[2000]"
              >
                <BarberPoleProgress
                  height="h-4"
                  rounded="rounded-none"
                  progress={reward.progress}
                />
                <div className="topography-pattern pt-2">
                  <img
                    src={`${reward.image}&width=500`}
                    alt="Reward"
                    className="w-full h-40 sm:h-64 object-contain"
                  />
                </div>
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-2">
                    <h1 className="text-2xl font-accent text-cyan-600 leading-[1.40rem] tracking-tight">
                      {reward.name}
                    </h1>
                    <p className="text-sm text-gray-700 pt-2">
                      {reward.reward_threshold - compare_val <= 0
                        ? "Unlocked!"
                        : reward.reward_type === "MONETARY"
                        ? `$${(
                            (reward.reward_threshold - compare_val) /
                            100
                          ).toFixed(2)} more to unlock`
                        : `${reward.reward_threshold - compare_val} more item${
                            reward.reward_threshold - compare_val > 1 ? "s" : ""
                          } to unlock`}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    {reward.perks.map((perk) => (
                      <div
                        key={perk}
                        className="flex items-start space-x-1 lg:space-x-2"
                      >
                        <CheckCircleIcon className="mt-[0.25rem] sm:mt-[0.07rem] size-3 sm:size-5 text-cyan-600 shrink-0" />
                        <span className="text-sm sm:text-base text-cyan-900">
                          {perk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className="bg-neutral-50 text-neutral-600 lowercase py-2 text-base text-center w-full active:text-neutral-800 active:bg-neutral-100 hover:bg-neutral-100 hover:text-neutral-700"
                  onClick={() => setExpanded(false)}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          </>,
          document.body,
        )}
    </>
  );
}

interface IRewardCards {
  rewards: IReward[];
  compare_val: number;
}
export function RewardCards({ rewards, compare_val }: IRewardCards) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Update container width on mount and on window resize.
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const peek_width = 4 * 20;
  const gap = 4 * 4;

  useEffect(() => {
    if (rewards.length && containerRef.current) {
      containerRef.current.scrollTo({
        left: 0,
      });
    }
  }, [rewards.length]);

  const [scrollOffset, setScrollOffset] = useState(0);
  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const distance =
        direction === "left"
          ? -containerWidth + peek_width
          : containerWidth - peek_width;

      containerRef.current.scrollTo({
        left: distance + containerRef.current.scrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2 px-4 pt-3">
        <div className="flex-1 h-1 rounded bg-cyan-600" />
        <h4 className="text-cyan-600 font-accent text-xl lg:text-2xl">
          Rewards
        </h4>
        <div className="flex-1 h-1 rounded bg-cyan-600" />
      </div>
      <div className="relative group">
        <div className="hidden sm:group-hover:block">
          {scrollOffset > 0 ? (
            <div className="flex items-center justify-center absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-200/50 to-cyan-100/10 w-20 z-50 transition-all">
              <button
                onClick={() => scroll("left")}
                className="rounded-full flex items-center justify-center size-12 bg-cyan-200 border border-cyan-300 text-cyan-600 hover:bg-cyan-300 hover:border-cyan-400 hover:text-cyan-700"
              >
                <ArrowLeftIcon className="size-5" />
              </button>
            </div>
          ) : null}
          {scrollOffset < (rewards.length * (containerWidth - gap)) / 2 &&
          rewards.length > 1 ? (
            <div className="flex items-center justify-center absolute right-0 top-0 bottom-0 bg-gradient-to-l from-cyan-200/50 to-cyan-100/10 w-20 z-50 transition-all">
              <button
                onClick={() => scroll("right")}
                className="rounded-full flex items-center justify-center size-12 bg-cyan-200 border border-cyan-300 text-cyan-600 hover:bg-cyan-300 hover:border-cyan-400 hover:text-cyan-700"
              >
                <ArrowRightIcon className="size-5" />
              </button>
            </div>
          ) : null}
        </div>
        <div
          ref={containerRef}
          onScroll={(e) => setScrollOffset(e.currentTarget.scrollLeft)}
          className={`flex items-stretch group overflow-x-auto scrollbar-hidden py-4 -mb-4 w-full relative`} //snap-x snap-mandatory
          style={{
            paddingRight: gap * 2,
          }}
        >
          {containerWidth > 0 ? (
            <AnimatePresence mode="popLayout">
              {rewards.map((card, index) => {
                return (
                  <motion.div
                    key={card.id}
                    layout
                    exit={{
                      opacity: 0,
                    }}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    className="flex-shrink-0 snap-center overflow-visible relative h-full"
                    style={{
                      width: containerWidth - peek_width,
                      marginLeft: gap,
                    }}
                  >
                    <RewardCard reward={card} compare_val={compare_val} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : null}
        </div>
      </div>
    </div>
  );
}
