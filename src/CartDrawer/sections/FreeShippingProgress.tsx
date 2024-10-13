// import ConfettiExplosion, { ConfettiProps } from "react-confetti-explosion";

// const smallProps: ConfettiProps = {
//   force: 0.4,
//   duration: 2200,
//   particleCount: 30,
//   width: 500,
//   zIndex: 100,
//   colors: ["#2CA4B2", "#86D7E1", "#FFF6EB", "#FFDAAE"],
// };

interface IFreeShippingProgressProps {
  isCartEmpty: boolean;
  progressOutOf100: number;
  cartSubtotal: number;
}

export function FreeShippingProgress({
  isCartEmpty,
  progressOutOf100,
  cartSubtotal,
}: IFreeShippingProgressProps) {
  const shippingStyle = { width: `${progressOutOf100 * 100}%` };

  return !isCartEmpty ? (
    <div className="flex flex-col space-y-4 p-4 pb-0">
      <div
        className="flex w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={progressOutOf100}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          style={shippingStyle}
          className={`flex flex-col transition-all delay-200 justify-center rounded-full overflow-hidden bg-cyan-600 text-xs text-white text-center whitespace-nowrap duration-500`}
        />
        {/* {progressOutOf100 === 100 ? (
          <ConfettiExplosion {...smallProps} />
        ) : null} */}
      </div>
      <h4 className="px-4 font-accent text-lg text-center text-cyan-600 leading-[1.50rem]">
        {/* {progressOutOf100 >= 1
          ? "Congratulations, you've unlocked free shipping!"
          : `You're only $${((5900 - cartSubtotal) / 100).toFixed(
              2,
            )} away from free shipping!`} */}
        {progressOutOf100 >= 1
          ? "Congratulations, a free Ready to Run is in your cart!"
          : `You're only $${((7900 - cartSubtotal) / 100).toFixed(
              2,
            )} away from a free Ready to Run!`}
      </h4>
    </div>
  ) : null;
}
