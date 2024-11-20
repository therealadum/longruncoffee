import { plans, TUseCartItemProductCosts } from "../../common/constants";
import { IPlan, IPlans } from "../../common/plans";
import {
  ICartState,
  ISubscriptionCartItem,
  ISubscriptionCartState,
} from "../../common/product";

interface ISubscriptionItemProps {
  item: ISubscriptionCartItem;
  subscriptionCartState: ISubscriptionCartState;
  setSubscriptionCartState: (prevState: ISubscriptionCartState) => void;
  useCartItemProductCosts: TUseCartItemProductCosts;
}

function SubscriptionItem({
  item,
  subscriptionCartState,
  setSubscriptionCartState,
  useCartItemProductCosts,
}: ISubscriptionItemProps) {
  const costs = useCartItemProductCosts(
    item.variant.price,
    item.variant.compare_at_price || item.variant.price,
    item.quantity,
  );
  const onClick = (qty: number) => {
    const newItems = [...subscriptionCartState.items];
    let index: null | number = null;
    for (let i = 0; i < newItems.length; i++) {
      if (newItems[i].variantID === item.variantID) {
        index = i;
      }
    }
    if (index === null) {
      console.error("could not remove item.");
      return;
    }
    if (qty <= 0) {
      newItems.splice(index, 1);
    } else {
      newItems[index].quantity = qty;
    }
    setSubscriptionCartState({
      ...subscriptionCartState,
      items: newItems,
    });
  };

  return (
    <div className="grid grid-cols-3 gap-x-2 md:gap-x-4">
      <div className="h-24 relative">
        <div className="relative z-20">
          <img
            src={`${
              item.variant.featured_image && item.variant.featured_image.src
                ? item.variant.featured_image.src
                : item.product.featured_image
            }&width=150`}
            loading="lazy"
            className="h-24 object-contain p-4 mx-auto"
          />
        </div>
        <div className="absolute inset-0 flex justify-center overflow-hidden z-10">
          <img
            src="https://cdn.shopify.com/s/files/1/0761/6924/9081/files/lrc-product-background.webp?v=1722464283"
            loading="lazy"
            className="object-cover w-full h-full rounded-lg overflow-hidden"
          />
        </div>
      </div>
      <div className="col-span-2 flex flex-col justify-center">
        <h5 className="text-base font-accent text-cyan-800 text-left leading-[16px]">
          <a href={item.product.url}>{item.product.title}</a>
        </h5>
        {item.variant.options.filter((v) => v !== "Default Title").length >
        0 ? (
          <p className="mt-1 font-base text-xs text-cyan-800 text-left">
            {item.variant.options
              .filter((v) => v !== "Default Title")
              .join(", ")}
          </p>
        ) : null}
        <div className="mt-2 flex items-center justify-between">
          <div className="border rounded border-neutral-400 flex items-stretch overflow-hidden">
            <button
              onClick={() => onClick(item.quantity - 1)}
              className="text-base text-neutral-700 px-4 hover:bg-neutral-100 hover:text-neutral-800"
            >
              -
            </button>
            <span className="text-base font-bold py-1 w-12 text-center flex justify-center items-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onClick(item.quantity + 1)}
              className="text-base text-neutral-700 px-4 hover:bg-neutral-100 hover:text-neutral-800"
            >
              +
            </button>
          </div>
          <h4 className="text-base font-medium text-cyan-600">
            ${costs.subscribe_and_save_discounted_cost}
          </h4>
        </div>
      </div>
    </div>
  );
}

interface ILongRunClubProps {
  totalSubscriptionItems: number;
  subscriptionCartState: ISubscriptionCartState;
  setSubscriptionCartState: (prevState: ISubscriptionCartState) => void;
  useCartItemProductCosts: TUseCartItemProductCosts;
}

export function LongRunClub({
  totalSubscriptionItems,
  useCartItemProductCosts,
  subscriptionCartState,
  setSubscriptionCartState,
}: ILongRunClubProps) {
  if (totalSubscriptionItems == 0) {
    return null;
  }
  return (
    <div className="flex flex-col space-y-4 px-4">
      <div className="flex items-center space-x-2">
        <div className="flex-1 h-1 rounded bg-cyan-600" />
        <h4 className="text-cyan-600 font-accent text-xl lg:text-2xl">
          Long Run Club
        </h4>
        <div className="flex-1 h-1 rounded bg-cyan-600" />
      </div>

      <div className="grid grid-cols-1 gap-8 pt-2">
        {subscriptionCartState.items.map((item, i: number) => (
          <SubscriptionItem
            key={item.variantID}
            item={item}
            subscriptionCartState={subscriptionCartState}
            setSubscriptionCartState={setSubscriptionCartState}
            useCartItemProductCosts={useCartItemProductCosts}
          />
        ))}
      </div>
    </div>
  );
}
