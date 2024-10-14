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
  plan: IPlan | null;
  nextPlan: IPlan | null;
  nextPerks: string[] | null;
  totalSubscriptionItems: number;
  subscriptionCartState: ISubscriptionCartState;
  setSubscriptionCartState: (prevState: ISubscriptionCartState) => void;
  useCartItemProductCosts: TUseCartItemProductCosts;
}

export function LongRunClub({
  plan,
  nextPlan,
  nextPerks,
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
      <div className="flex flex-col space-y-2">
        {/* progress bar & tier name  */}
        {plan ? (
          <div className="flex items-center justify-between">
            <div className="flex w-2/3 rounded-full bg-cyan-50 h-3">
              <div
                className={`bg-cyan-500 rounded-full h-full transition-all delay-200 ${
                  plan.type === "base"
                    ? "w-1/3"
                    : plan.type === "pro"
                    ? "w-2/3"
                    : "w-full"
                }`}
              ></div>
            </div>
            <div className="flex items-center space-x-1.5">
              <h4 className="text-cyan-800 text-xl font-accent">
                {plan.display_name}
              </h4>
              <button
                onClick={() => (window.location.href = "/pages/coffee-club")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8.66667 10.6667H8V8H7.33333M8 5.33333H8.00667M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
                    stroke="#86D7E1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : subscriptionCartState.items.length ? (
          <p className="text-sm text-tan-600 text-center">
            Add {plans.base.bag_min - totalSubscriptionItems} more bag to be
            eligible for our {plans.base.display_name} plan!
          </p>
        ) : null}
        {/* tier benefits */}
        <div className="grid grid-cols-2 gap-y-1">
          {plan
            ? plan.perk_list.map((p) => (
                <div key={p} className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-cyan-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-cyan-800 text-base leading-[1.2rem]">
                    {p}
                  </span>
                </div>
              ))
            : null}
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
      {subscriptionCartState.items.length && nextPlan && nextPerks ? (
        <div className="flex flex-col space-y-4 pt-4">
          <div className="flex items-center justify-center">
            <a
              href="/collections/subscribe-save"
              className="inline-flex items-center rounded-md bg-tan-100 px-2 py-1 text-xs font-semibold text-tan-700 ring-1 ring-inset ring-tan-600/40 relative"
            >
              <span>
                Add {nextPlan.bag_min - totalSubscriptionItems} more bag
              </span>
              <svg
                viewBox="0 0 512.001 512.001"
                className="text-tan-700 absolute -right-3 -bottom-3 w-5 h-5 z-10"
              >
                <path
                  fill="currentColor"
                  d="M429.742,319.31L82.49,0l-0.231,471.744l105.375-100.826l61.89,141.083l96.559-42.358l-61.89-141.083L429.742,319.31z
                            M306.563,454.222l-41.62,18.259l-67.066-152.879l-85.589,81.894l0.164-333.193l245.264,225.529l-118.219,7.512L306.563,454.222z"
                />
              </svg>
            </a>
          </div>
          <div className="pt-2 grid grid-cols-2 gap-y-1">
            {nextPerks.map((p) => (
              <div key={p} className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-cyan-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-cyan-800 text-base leading-[1.2rem]">
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
