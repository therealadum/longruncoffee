interface ICartFooterProps {
  cartSubTotal: number;
  cartSubTotalWithDiscounts: number;
  totalSubscriptionItems: number;
  loading: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  checkout: any;
  checkoutState:
    | "OKAY"
    | "MINIMUM_SPEND"
    | "NOTHING_TO_CHECKOUT"
    | "ONLY_GIFTS";
  minimum_spend?: {
    amount: string;
    variant_id: string;
  };
}

export function CartFooter({
  cartSubTotal,
  cartSubTotalWithDiscounts,
  totalSubscriptionItems,
  loading,
  setIsOpen,
  checkout,
  checkoutState,
  minimum_spend,
}: ICartFooterProps) {
  return (
    <div className="flex-1 mt-4 border-t border-cyan-200 flex flex-col space-y-2 flex-shrink-0 justify-end px-4 py-4">
      <div className="flex items-center">
        <h4 className="flex-1 text-lg font-accent text-cyan-700">Subtotal</h4>
        {totalSubscriptionItems ? (
          <>
            <span className={`line-through text-base text-neutral-500`}>
              ${(cartSubTotal / 100).toFixed(2)}
            </span>
            <span className={`ml-2 text-base font-medium text-cyan-700`}>
              ${(cartSubTotalWithDiscounts / 100).toFixed(2)}
            </span>
          </>
        ) : (
          <span className={`font-medium text-base text-cyan-700`}>
            ${(cartSubTotal / 100).toFixed(2)}
          </span>
        )}
      </div>
      {checkoutState === "MINIMUM_SPEND" && minimum_spend ? (
        <span className="block md:hidden font-medium text-xs pb-1 text-center text-tan-600">
          Your cart requires a minimum spend of $
          {(parseFloat(minimum_spend.amount) / 100).toFixed(2)}
        </span>
      ) : null}
      {checkoutState === "ONLY_GIFTS" ? (
        <span className="block md:hidden font-medium text-xs pb-1 text-center text-tan-600">
          Free Gifts Require Purchase
        </span>
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-md bg-white p-3 text-sm font-accent text-neutral-700 shadow-sm ring-1 ring-inset ring-neutral-300 hover:ring-neutral-400"
        >
          Back to Shop
        </button>
        <button
          disabled={checkoutState !== "OKAY"}
          onClick={checkout}
          className={`ml-4 inline-flex justify-center rounded-md p-3 text-sm font-accent border ${
            checkoutState !== "OKAY"
              ? "cursor-not-allowed has-tooltip border-neutral-600 bg-neutral-100 text-neutral-400 hover:border-neutral-700 hover:text-neutral-500 hover:bg-neutral-200"
              : "border-tan-600 bg-tan-100 text-tan-600 hover:border-tan-700 hover:text-tan-700 hover:bg-tan-200"
          }`}
        >
          {loading ? (
            <svg
              className="animate-spin h-4 w-4 text-tan-700"
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
            "Checkout"
          )}
          {checkoutState === "MINIMUM_SPEND" && minimum_spend ? (
            <span className="hidden md:block tooltip rounded shadow p-1.5 bg-tan-50 text-tan-700 text-sm -mt-24 lg:-mt-16 text-center">
              Your cart requires a minimum spend of $
              {(parseFloat(minimum_spend.amount) / 100).toFixed(2)}
            </span>
          ) : null}
          {checkoutState === "ONLY_GIFTS" ? (
            <span className="hidden md:block tooltip rounded shadow p-1.5 bg-tan-50 text-tan-700 text-sm -mt-24 lg:-mt-16 text-center">
              Free Gifts Require Purchase
            </span>
          ) : null}
        </button>
      </div>
    </div>
  );
}
