import { useEffect, useRef, useState, createContext, useContext } from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../common/cn";
import { useOutsideClick } from "../common/useOutsideClick";
import { Collection } from "../Collection/types";

interface CarouselProps {
  items: JSX.Element[];
  initialScroll?: number;
  active: Collection;
  active_index: null | number;
}

type Card = {
  src: string;
  title: string;
  category: string;
  href: string;
};

export const Carousel = ({
  active,
  items,
  initialScroll = 0,
  active_index,
}: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const itemWidthRem = 16; // 16rem
  const itemSpacingRem = 1; // 1rem

  // Convert rem to pixels dynamically based on root font size
  const remToPx = (rem: number) =>
    rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const scrollLeft = (times: number = 1) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -272 * times, behavior: "smooth" });
    }
  };

  const scrollRight = (times: number = 1) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 272 * times, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (active_index !== null && carouselRef.current) {
      // check if item is visible in horizontal scroll
      // if item is to the left, scroll to be visible
      // if item is to the right, scroll to be visible
      const container = carouselRef.current;
      const scrollLeftPos = container.scrollLeft; // How far the container has scrolled
      const clientWidth = container.clientWidth; // Width of the visible area

      // Calculate the nth item's position
      const itemWidth = remToPx(itemWidthRem);
      const itemSpacing = remToPx(itemSpacingRem);
      const itemTotalWidth = itemWidth + itemSpacing;
      const itemPositionStart = active_index * itemTotalWidth;
      const itemPositionEnd = itemPositionStart + itemWidth;

      // Determine visibility
      const isFullyVisible =
        itemPositionStart >= scrollLeftPos &&
        itemPositionEnd <= scrollLeftPos + clientWidth;

      if (isFullyVisible) return; // Do nothing if the item is visible

      // Calculate how far to scroll
      if (itemPositionStart < scrollLeftPos) {
        const itemsToScroll = Math.ceil(
          (scrollLeftPos - itemPositionStart) / itemTotalWidth,
        );
        setTimeout(() => {
          scrollLeft(itemsToScroll);
        }, 500);
      } else if (itemPositionEnd > scrollLeftPos + clientWidth) {
        const itemsToScroll = Math.ceil(
          (itemPositionEnd - (scrollLeftPos + clientWidth)) / itemTotalWidth,
        );
        setTimeout(() => {
          scrollRight(itemsToScroll);
        }, 500);
      }
    }
  }, [active_index]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-accent text-cyan-700">{active.title}</h2>
        <div className="flex justify-end gap-2">
          <button
            className="relative z-40 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50"
            onClick={() => scrollLeft(1)}
            disabled={!canScrollLeft}
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-gray-500" />
          </button>
          <button
            className="relative z-40 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50"
            onClick={() => scrollRight(1)}
            disabled={!canScrollRight}
          >
            <IconArrowNarrowRight className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
      <div
        className="flex w-full overflow-x-scroll overscroll-x-auto py-8 scroll-smooth [scrollbar-width:none]"
        ref={carouselRef}
        onScroll={checkScrollability}
      >
        <div
          className={cn(
            "absolute right-0  z-[1000] h-auto  w-[5%] overflow-hidden bg-gradient-to-l",
          )}
        ></div>

        <div className={cn("flex flex-row justify-start gap-4", "mx-auto")}>
          {items.map((item, index) => (
            <motion.div
              layout
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  type: "spring",
                  delay: 0.1 * index,
                },
              }}
              key={"card" + index}
              className="rounded-3xl"
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Card = ({
  card,
  isActive,
}: {
  card: Card;
  index: number;
  isActive: boolean;
}) => {
  return (
    <div className="group">
      <a
        href={card.href}
        className="rounded-3xl bg-gray-100 dark:bg-neutral-900 size-64 overflow-hidden flex flex-col items-start justify-start relative z-10"
      >
        <div className="absolute h-full top-0 inset-x-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-30 pointer-events-none" />
        <div className="relative z-40 p-4">
          <p
            className={`text-sm md:text-base font-medium font-base text-left ${
              isActive ? "text-cyan-100" : "text-white"
            }`}
          >
            {card.category}
          </p>
          <p
            className={`font-accent text-xl md:text-3xl font-semibold max-w-xs text-left [text-wrap:balance] mt-2 ${
              isActive ? "text-cyan-100" : "text-white"
            }`}
          >
            {card.title}
          </p>
        </div>
        <BlurImage
          src={card.src}
          alt={card.title}
          fill="true"
          className="object-cover absolute z-10 inset-0"
        />
      </a>
      {isActive ? (
        <div className="bg-cyan-200 flex-1 mx-4 h-1 mt-3 rounded-full group-hover:brightness-75 transition duration-300" />
      ) : (
        <div className="bg-cyan-200 flex-1 mx-4 h-1 mt-3 rounded-full group-hover:opacity-100 opacity-0 hidden transition duration-300" />
      )}
    </div>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: any) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <img
      className={cn(
        "transition duration-300 brightness-75 group-hover:brightness-50",
        isLoading ? "blur-sm" : "blur-0",
        className,
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      alt={alt ? alt : "Background of a beautiful view"}
      {...rest}
    />
  );
};
