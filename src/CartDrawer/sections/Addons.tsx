import { useState, useEffect } from "react";
import { ICartState, IProduct } from "../../common/product";

interface ICartAddonsProps {
  cartState: ICartState;
  loading: boolean;
  update: (updates: any) => Promise<void>;
}

export function Addons({ cartState, loading, update }: ICartAddonsProps) {
  const [upsellItems, setUpsellItems] = useState<IProduct[]>([]);
  useEffect(() => {
    let mounted = true;
    const handler = async () => {
      const response = await fetch("/collections/cart-upsell/products.json");
      const parsed = await response.json();
      if (mounted) {
        setUpsellItems(parsed.products);
      }
    };
    handler();
    return () => {
      mounted = false;
    };
  }, [setUpsellItems]);

  if (cartState.items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-4 px-4">
      <div className="flex items-center space-x-2">
        <div className="flex-1 h-1 rounded bg-cyan-600" />
        <h4 className="text-cyan-600 font-accent text-xl lg:text-2xl">
          Add Ons
        </h4>
        <div className="flex-1 h-1 rounded bg-cyan-600" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {upsellItems
          .filter((item) => {
            let found = false;
            cartState.items.forEach((ca) => {
              if (ca.product_id == item.id) {
                found = true;
              }
            });
            return !found;
          })
          .map((item, i) => (
            <div key={i} className="flex flex-col space-y-2 group relative">
              <button
                onClick={() => {
                  const updates: any = {};
                  updates[item.variants[0].id] = 1;
                  update(updates);
                }}
                className={`absolute right-0 top-2 shadow-md z-10 rounded-full h-8 w-8 bg-neutral-50 flex items-center justify-center ${
                  loading ? "cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-4 w-4 text-cyan-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-cyan-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <img
                //   @ts-ignore
                src={`${item.images[0].src}&width=150`}
                loading="lazy"
                onClick={() => {
                  const updates: any = {};
                  updates[item.variants[0].id] = 1;
                  update(updates);
                }}
                className="w-full h-32 object-contain cursor-pointer"
              />
              <h6 className="font-base text-xs text-cyan-800 text-center">
                + ${item.variants[0].price}
              </h6>
              <h5 className="font-base text-sm text-cyan-800 font-[700] text-center leading-[16px] tracking-tight">
                <a href={`/products/${item.handle}`}>{item.title}</a>
              </h5>
            </div>
          ))}
      </div>
    </div>
  );
}
