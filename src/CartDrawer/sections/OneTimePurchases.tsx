import { TUseCartItemProductCosts } from "../../common/constants";
import { ICartItem, ICartState } from "../../common/product";
import { IAddToCartDisplayOnly } from "./ProgressBar";

interface IOneTimePurchasesProps {
  cartState: ICartState;
  cartContainsOneTimeItems: boolean;
  cartContainsGiftItems: boolean;
  totalSubscriptionItems: number;
  useCartItemProductCosts: TUseCartItemProductCosts;
  display_only_cart_items: IAddToCartDisplayOnly[];
  update: (updates: any) => Promise<void>;
  loading: boolean;
}

export function OneTimePurchases({
  cartState,
  cartContainsOneTimeItems,
  cartContainsGiftItems,
  display_only_cart_items,
  useCartItemProductCosts,
  update,
  loading,
}: IOneTimePurchasesProps) {
  if (cartState.items.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-col space-y-4 px-4">
      <div className="flex items-center space-x-2">
        <div className="flex-1 h-1 rounded bg-cyan-600" />
        <h4 className="text-cyan-600 font-accent text-xl lg:text-2xl">
          One-Time
        </h4>
        <div className="flex-1 h-1 rounded bg-cyan-600" />
      </div>
      {cartContainsOneTimeItems ? (
        <div className="grid grid-cols-1 gap-8 pt-2">
          {cartState.items
            .filter((item) => item.product_type !== "Gift")
            .filter((item) => item.handle)
            .map((item, i) => (
              <CartItem
                key={item.variant_id}
                cart_attributes={cartState.attributes}
                item={item}
                useCartItemProductCosts={useCartItemProductCosts}
                update={update}
                loading={loading}
              />
            ))}
        </div>
      ) : null}
      {cartContainsGiftItems ? (
        <div className="flex flex-col space-y-4 bg-cyan-50 bg-opacity-50 -mx-2 py-3 rounded">
          <h4 className="px-2 text-cyan-600 font-accent text-base text-center lg:text-lg">
            Free With Your Order
          </h4>
          <div className="w-full h-px bg-cyan-200 -my-1" />
          <div className="px-2 grid grid-cols-3 gap-3">
            {display_only_cart_items.map((doci) => (
              <BonusItem
                key={doci.id}
                update={update}
                loading={loading}
                cart_attributes={cartState.attributes}
                title={doci.title}
                href="/products/club-exclusive-lrc-x-yeti-tumbler-1"
                header={doci.description}
                image={`${doci.image}&width=150`}
              />
            ))}
            {cartState.items
              .filter((item) => item.product_type === "Gift")
              .sort((a, b) => {
                // put hat in first
                if (a.variant_id === 50182315376953) {
                  return -1;
                } else if (b.variant_id === 50182315376953) {
                  return 1;
                }
                // put sticker last
                else if (a.variant_id === 48056421482809) {
                  return 1;
                } else if (b.variant_id === 48056421482809) {
                  return -1;
                } else return a.variant_id - b.variant_id;
              })
              .map((item) => (
                <BonusItem
                  key={item.variant_id}
                  href={item.url}
                  title={item.product_title}
                  image={`${item.featured_image.url}&width=150`}
                  update={update}
                  loading={loading}
                  cart_attributes={cartState.attributes}
                  item={item}
                />
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface ICartItemProps {
  useCartItemProductCosts: TUseCartItemProductCosts;
  item: ICartItem;
  update: (
    updates: any,
    shouldOpen?: boolean,
    shouldSetCartState?: boolean,
    shouldSetLoading?: boolean,
    attributes?: any,
  ) => Promise<void>;
  loading: boolean;
  cart_attributes?: any;
}

function CartItem({
  useCartItemProductCosts,
  item,
  update,
  loading,
  cart_attributes,
}: ICartItemProps) {
  const costs = useCartItemProductCosts(item.price, item.price, item.quantity);

  const onClick = (int: number) => {
    const payload: any = {};
    payload[item.variant_id] = int;

    // check if cart_attributes has min spend related to this item and clear it if so
    if (
      int == 0 &&
      cart_attributes?.minimum_spend &&
      cart_attributes?.minimum_spend?.variant_id == item.variant_id
    ) {
      update(payload, false, true, true, {
        minimum_spend: null,
      });
    } else {
      update(payload);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-x-2 md:gap-x-4">
      <div className="h-24 relative">
        <div className="relative z-20">
          <img
            src={`${item.featured_image.url}&width=150`}
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
          <a href={item.url}>{item.product_title}</a>
        </h5>
        {item.variant_options.filter((v) => v !== "Default Title").length >
        0 ? (
          <p className="mt-1 font-base text-xs text-cyan-800 text-left">
            {item.variant_options
              .filter((v) => v !== "Default Title")
              .join(", ")}
          </p>
        ) : null}
        <div className="mt-2 flex items-center justify-between">
          <div className="border rounded border-neutral-400 flex items-stretch overflow-hidden">
            <button
              disabled={loading}
              onClick={() => onClick(item.quantity - 1)}
              className="text-base text-neutral-700 px-4 hover:bg-neutral-100 hover:text-neutral-800"
            >
              -
            </button>
            <span className="text-base font-bold py-1 w-12 text-center flex justify-center items-center">
              {!loading ? (
                item.quantity
              ) : (
                <svg
                  className="animate-spin h-6 w-6 p-1 text-cyan-500"
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
              )}
            </span>
            <button
              disabled={loading}
              onClick={() => onClick(item.quantity + 1)}
              className="text-base text-neutral-700 px-4 hover:bg-neutral-100 hover:text-neutral-800"
            >
              +
            </button>
          </div>
          <h4 className="text-base font-medium text-cyan-600">
            ${costs.one_time_total_cost}
          </h4>
        </div>
      </div>
    </div>
  );
}

interface ICartBonusItemProps {
  title: string;
  href: string;
  image: string;
  header?: string;
  quantity?: number;
  item?: ICartItem;
  update: (
    updates: any,
    shouldOpen?: boolean,
    shouldSetCartState?: boolean,
    shouldSetLoading?: boolean,
    attributes?: any,
  ) => Promise<void>;
  loading: boolean;
  cart_attributes: any;
}
function BonusItem({
  title,
  href,
  image,
  header,
  quantity,
  item,
  update,
  loading,
  cart_attributes,
}: ICartBonusItemProps) {
  const onClick = () => {
    if (item) {
      const payload: any = {};
      payload[item.variant_id] = 0;
      update(payload, false, true, true, {
        minimum_spend: {
          amount: 0,
          variant_id: "",
        },
      });
    }
  };

  return (
    <div className="flex flex-col space-y-2 group relative">
      {cart_attributes &&
      cart_attributes?.minimum_spend &&
      cart_attributes.minimum_spend.variant_id == item?.variant_id ? (
        <div className="absolute top-2 left-0 right-0 flex items-stretch space-x-2">
          <button
            disabled={loading}
            onClick={onClick}
            className="ml-auto shadow-md z-10 rounded-full h-8 w-8 bg-neutral-50 flex items-center justify-center"
          >
            {!loading ? (
              <span className="flex items-end self-center">
                <span className="text-xs">x</span>
              </span>
            ) : (
              <svg
                className="animate-spin h-6 w-6 p-1 text-cyan-500"
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
            )}
          </button>
        </div>
      ) : null}
      {quantity ? (
        <div className="absolute top-2 left-0 right-0 flex items-stretch space-x-2">
          <div className="ml-auto shadow-md z-10 rounded-full h-8 w-8 bg-neutral-50 flex items-center justify-center">
            <span className="flex items-end self-center">
              <span className="text-sm">{quantity}</span>
              <span className="text-xs">x</span>
            </span>
          </div>
        </div>
      ) : null}
      <a href={href}>
        <img
          src={image}
          loading="lazy"
          className="w-full h-32 object-contain"
        />
      </a>
      {header ? (
        <h6 className="font-base text-xs text-cyan-800 text-center">
          {header}
        </h6>
      ) : null}
      <h5 className="font-base text-sm text-cyan-800 font-[700] text-center leading-[16px] tracking-tight">
        <a href={href}>{title}</a>
      </h5>
    </div>
  );
}
