import { memo, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../../../common/useOutsideClick";
import { createPortal } from "react-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { BackgroundGradient } from "../../../BackgroundGradient";
import { MovingBorder } from "../../../MovingBorder";

interface IExpandableImageProps {
  id: number;
  title: string;
  img: string;
  perks: string[];
  is_previous: boolean;
}

function _ExpandableImage({
  id,
  title,
  img,
  perks,
  is_previous,
}: IExpandableImageProps) {
  const [active, setActive] = useState<boolean>(false);
  const _id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(false));

  return (
    <>
      {createPortal(
        <>
          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 h-full w-full z-[100]"
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {active && (
              <div className="fixed inset-0 grid place-items-center z-[100] p-4">
                <motion.button
                  key={`button-${id}-${_id}`}
                  layout
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                    transition: {
                      duration: 0.05,
                    },
                  }}
                  className="flex absolute top-2 right-2 items-center justify-center bg-white rounded-full h-6 w-6"
                  onClick={() => setActive(false)}
                >
                  <CloseIcon />
                </motion.button>
                <motion.div
                  layoutId={`card-${id}-${_id}`}
                  ref={ref}
                  className="overflow-visible"
                >
                  <BackgroundGradient className="flex flex-col items-stretch bg-white rounded-lg w-full p-4">
                    <div className="flex items-center justify-center py-4">
                      <motion.img
                        layoutId={`img-${id}-${_id}`}
                        src={img}
                        alt={title}
                        className="h-28 w-28 object-contain object-center"
                      />
                    </div>

                    <div className="p-2 pr-4 flex flex-col space-y-2">
                      <h5 className="text-lg font-accent text-cyan-600">
                        {title}
                      </h5>
                      <div className="flex flex-col space-y-1">
                        {perks.map((perk) => (
                          <div
                            key={perk}
                            className="flex items-start space-x-1 lg:space-x-2"
                          >
                            <CheckCircleIcon className="mt-0.5 flex-0 w-5 h-5 text-cyan-600" />
                            <span className="flex-1 text-base text-cyan-900">
                              {perk}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </BackgroundGradient>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>,
        document.body,
      )}
      <AnimatePresence>
        {!active && (
          <motion.div layoutId={`card-${id}-${_id}`}>
            <MovingBorder
              key={id}
              onClick={() => setActive(true)}
              className="cursor-pointer p-1 bg-white border-none"
              containerClassName="rounded-full h-10 w-10 z-20"
              is_previous={is_previous}
            >
              <div className="border border-transparent">
                <div>
                  <motion.img
                    layoutId={`img-${id}-${_id}`}
                    src={img}
                    alt={title}
                    className="h-full w-full object-contain object-center rounded-full overflow-hidden"
                  />
                </div>
              </div>
            </MovingBorder>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

export const ExpandableImage = memo(_ExpandableImage);
