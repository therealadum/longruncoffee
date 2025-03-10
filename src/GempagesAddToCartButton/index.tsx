import { useState } from "react";

export default function GempagesAddToCartButton(args: any) {
  const [disabled, setDisabled] = useState<boolean>(false);
  const available = args.container.attributes.getNamedItem("available").value;
  const variantId = args.container.attributes.getNamedItem("variant_id").value;

  const on_submit = () => {
    setDisabled(true);
    document.dispatchEvent(
      new CustomEvent("buy_button", {
        detail: {
          available,
          variantId,
          isSubscription: false,
          quantity: 1,
          product_hash: null,
        },
      }),
    );
    setTimeout(() => {
      setDisabled(false);
    }, 1500);
  };

  return (
    <button
      disabled={disabled}
      className="rounded w-full text-base flex items-center justify-center text-center py-3 px-4 font-accent border border-tan-600 bg-tan-200 text-tan-700 hover:border-tan-800 hover:text-tan-800 hover:bg-tan-300 cursor-pointer"
      onClick={on_submit}
    >
      Add to Cart
    </button>
  );
}
