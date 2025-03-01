import { memo } from "react";
import { IFinalUpsellComponentProps } from "../useUpsells";

const perks = [
  {
    icon: "https://cdn.shopify.com/s/files/1/0761/6924/9081/files/icons8-runner-50.png?v=1725759052",
    title: "strong energy",
  },
  {
    icon: "https://cdn.shopify.com/s/files/1/0761/6924/9081/files/icons8-feather-96.png?v=1725759469",
    title: "light on your feet",
  },
  {
    icon: "https://cdn.shopify.com/s/files/1/0761/6924/9081/files/icons8-lightning-bolt-100.png?v=1725759961",
    title: "reduce fatigue",
  },
];

const stats = [
  {
    l1: "348K+",
    l2: "coffees brewed",
    icon: "https://cdn.shopify.com/s/files/1/0761/6924/9081/files/icons8-coffee-to-go-100.png?v=1725760947",
  },
  {
    l1: "1.7M+",
    l2: "miles fueled",
    icon: "https://cdn.shopify.com/s/files/1/0761/6924/9081/files/icons8-trail-100.png?v=1725761085",
  },
  {
    l1: "1.6K+",
    l2: "5 star reviews",
    icon: "https://cdn.shopify.com/s/files/1/0761/6924/9081/files/icons8-5-star-hotel-100.png?v=1725761206",
  },
];

function _BasicUpsell({
  cartState,
  variant,
  checkout,
  update,
  loading,
  params,
}: IFinalUpsellComponentProps) {
  const qty =
    cartState.items.find((item) => item.variant_id === variant.id)?.quantity ||
    0;

  const today = new Date();
  const snickerdoodle_start = new Date(Date.UTC(2025, 0, 19, 6, 0, 0, 0));

  const updates: any = {};
  updates[variant.id] = qty + 1;

  return (
    <div className="h-full bg-[#4E637C]">
      <div className="flex flex-col bg-white">
        <img className="w-full aspect-square" src={params.img} />
        <div className="grid grid-cols-2 space-x-1 sm:space-x-3 -translate-y-1/2 px-1 sm:px-2">
          <button
            onClick={checkout}
            disabled={loading}
            className="self-center flex items-center justify-center border-neutral-400 border font-accent text-base sm:text-xl text-neutral-500 hover:brightness-90 bg-neutral-50 rounded-full shadow-lg py-2 sm:py-3"
          >
            No Thanks
          </button>
          <button
            onClick={async () => {
              await update(updates, false, true, true);
              await checkout();
            }}
            disabled={loading}
            className="self-center flex items-center justify-center bg-cyan-200 border-cyan-600 text-cyan-700 border font-accent text-base sm:text-xl hover:brightness-90 rounded-full shadow-lg py-2 sm:py-3"
          >
            Add to Cart
          </button>
        </div>
        <h1 className="text-2xl font-accent max-w-xs self-center text-cyan-900 text-center">
          Best Sellers Travel Packs — Light / Medium / PB&J
        </h1>
        <div className="mt-8 px-4 grid grid-cols-3 gap-x-3 w-full">
          {perks.map((perk, i) => (
            <div
              key={i}
              className="flex flex-col space-y-1 items-center sm:space-y-0 sm:flex-row sm:space-x-2"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center p-2 bg-cyan-200">
                <img src={perk.icon} className="w-full h-full" />
              </div>
              <p className="flex-1 text-center sm:text-left text-sm font-semibold text-cyan-900 leading-4 self-center">
                {perk.title}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-neutral-200/25 p-2 flex flex-col items-center justify-center">
          <p className="font-accent text-xs sm:text-base text-cyan-500">
            100% passion & performance guarantee
          </p>
          <p className="font-semibold text-xs sm:text-base text-neutral-700">
            - satisfied or your money back -
          </p>
        </div>
        <img
          src="https://cdn.shopify.com/s/files/1/0761/6924/9081/files/a2215325-da85-49c5-81a4-0eb45dd71a92.png?v=1725760002"
          className="w-full h-16 mt-4 bg-top"
        />
        <div className="bg-[#4E637C] px-4 pt-2 pb-4 grid grid-cols-3 space-x-4">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center">
              <p className="text-center font-accent text-sm text-white">
                {stat.l1}
              </p>
              <p className="mt-1 text-center font-accent text-xs text-white">
                {stat.l2}
              </p>
              <img className="w-8 h-8 mt-2" src={stat.icon} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const BasicUpsell = memo(_BasicUpsell);
