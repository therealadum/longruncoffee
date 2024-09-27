import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FreeShippingProgress } from "./sections/FreeShippingProgress";
import { LongRunClub } from "./sections/LongRunClub";
import { useCartDrawerState } from "./hook";
import { OneTimePurchases } from "./sections/OneTimePurchases";
import { referenceString } from "../common/constants";
import { Addons } from "./sections/Addons";
import { CartFooter } from "./sections/CartFooter";
import { useState } from "react";

export function CartDrawer(args: any) {
  const stored_subscription = localStorage.getItem(referenceString);

  const [upsellActive, setUpsellActive] = useState<boolean>(false);

  const {
    isOpen,
    loading,
    checkout,
    checkoutState,
    setIsOpen,
    subscriptionCartState,
    setSubscriptionCartState,
    useCartItemProductCosts,
    plan,
    nextPlan,
    totalSubscriptionItems,
    nextPerks,
    cartState,
    cartSubTotal,
    cartSubTotalWithDiscounts,
    cartContainsGiftItems,
    cartContainsOneTimeItems,
    update,
    upsells,
  } = useCartDrawerState({
    cart: JSON.parse(
      decodeURIComponent(args.container.attributes.getNamedItem("cart").value),
    ),
    subscription: stored_subscription
      ? JSON.parse(stored_subscription)
      : {
          items: [],
        },
  });

  const upsell = upsells && upsells.length ? upsells[0] : null;

  const UpsellComponent = () => {
    if (upsell) {
      const { Component } = upsell;
      return (
        <Component
          cartState={cartState}
          product={upsell.product}
          variant={upsell.variant}
          params={upsell.params}
          checkout={checkout}
          update={update}
          loading={loading}
        />
      );
    }
  };

  const checkoutOrUpsell = () => {
    if (upsell) {
      setIsOpen(false);
      setUpsellActive(true);
    } else {
      checkout();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={setIsOpen} className="relative z-[70]">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel
                transition
                className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <TransitionChild>
                  <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <span className="absolute -inset-2.5" />
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                    </button>
                  </div>
                </TransitionChild>
                <div className="flex h-full flex-col bg-white shadow-xl">
                  <div className="p-4 sm:p-6 bg-cyan-600">
                    <DialogTitle className="text-xl font-accent leading-6 text-white">
                      Your Cart
                    </DialogTitle>
                  </div>
                  {cartState.items.length > 0 ||
                  subscriptionCartState.items.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 space-y-8 overflow-y-auto">
                        <FreeShippingProgress
                          isCartEmpty={
                            cartState.item_count == 0 &&
                            totalSubscriptionItems == 0
                          }
                          progressOutOf100={
                            totalSubscriptionItems > 0
                              ? 100
                              : cartSubTotalWithDiscounts / 5900
                          }
                          cartSubtotal={cartSubTotalWithDiscounts}
                        />
                        <LongRunClub
                          plan={plan}
                          nextPlan={nextPlan}
                          nextPerks={nextPerks}
                          totalSubscriptionItems={totalSubscriptionItems}
                          subscriptionCartState={subscriptionCartState}
                          setSubscriptionCartState={setSubscriptionCartState}
                          useCartItemProductCosts={useCartItemProductCosts}
                        />
                        <OneTimePurchases
                          cartState={cartState}
                          cartContainsGiftItems={cartContainsGiftItems}
                          cartContainsOneTimeItems={cartContainsOneTimeItems}
                          totalSubscriptionItems={totalSubscriptionItems}
                          useCartItemProductCosts={useCartItemProductCosts}
                          update={update}
                          loading={loading}
                        />
                        <Addons
                          loading={loading}
                          update={update}
                          cartState={cartState}
                        />
                      </div>
                      <CartFooter
                        cartSubTotal={cartSubTotal}
                        cartSubTotalWithDiscounts={cartSubTotalWithDiscounts}
                        totalSubscriptionItems={totalSubscriptionItems}
                        setIsOpen={setIsOpen}
                        checkout={checkoutOrUpsell}
                        checkoutState={checkoutState}
                        loading={loading}
                        minimum_spend={cartState?.attributes?.minimum_spend}
                      />
                    </>
                  ) : (
                    <div className="flex flex-col max-w-xs mx-auto translate-y-full">
                      <svg
                        viewBox="0 0 64 64"
                        xmlns="http://www.w3.org/2000/svg"
                        className="self-center h-40 w-40 text-cyan-600"
                      >
                        <path
                          fill="currentColor"
                          d="m51.36 21.21c.03-.37.04-.74.04-1.11a13.285 13.285 0 0 0 -4.23-9.62c-4.25-4.26-9.4-5.32-15.3-3.15l-2.87-2.88a8.389 8.389 0 0 0 -11.85 0l-1.95 1.95a8.383 8.383 0 0 0 0 11.85l1 1c-1.64 1.86-2.71 3.26-3.01 3.68-.02.01-.02.02-.03.03-.04.05-.06.08-.07.09-.03.05-.06.09-.09.14-1.94 2.73 3.9 9.82 7.77 13.69 3.35 3.35 9.11 8.17 12.37 8.17a2.152 2.152 0 0 0 1.46-.49c.02-.02.06-.05.12-.1 1.58-1.16 15.75-11.95 16.64-23.25zm-36.78 3.15a.855.855 0 0 1 .37-.01l.32.05c.04.01.08.02.13.03a.689.689 0 0 0 .08.03.944.944 0 0 0 .09.03l.08.02a1.28 1.28 0 0 0 .17.05c.08.04.17.07.27.11 2.44.98 6.13 3.76 9.63 7.26s6.28 7.19 7.27 9.64l.08.22c.01.02.01.04.02.06l.03.09c0 .01.01.01.01.02s.01.03.02.05a.857.857 0 0 1 .03.13c.01.02.01.04.02.06a1.209 1.209 0 0 1 .05.18.371.371 0 0 0 .02.09v.01c.01.06.02.12.03.2a.969.969 0 0 1 0 .36c-.9.36-5.42-1.88-11.12-7.57-5.75-5.76-7.98-10.32-7.6-11.11zm20.54 17.26h-.01v-.01c-.01-.03-.02-.06-.03-.1a1.209 1.209 0 0 0 -.05-.18l-.03-.06v-.01a.031.031 0 0 0 -.01-.02c-.01-.03-.02-.09-.03-.12-.04-.1-.08-.21-.12-.3-1.09-2.71-3.97-6.56-7.71-10.3s-7.59-6.62-10.29-7.7c-.11-.05-.22-.09-.37-.15a.254.254 0 0 1 -.07-.02c-.01-.01-.01-.01-.02-.01h-.01a.06.06 0 0 0 -.04-.01l-.01-.01a.647.647 0 0 0 -.13-.04.539.539 0 0 0 -.1-.03c-.02 0-.04-.01-.06-.01.59-.73 1.37-1.65 2.29-2.66a1.007 1.007 0 0 0 -.03-1.38l-1.68-1.67a6.4 6.4 0 0 1 0-9.02l1.95-1.95a6.4 6.4 0 0 1 9.02 0l3.24 3.25a1 1 0 0 0 1.16.31 14.7 14.7 0 0 1 5.51-1.16 11.414 11.414 0 0 1 8.27 3.63 11.322 11.322 0 0 1 3.61 9.16c-.67 8.59-10.27 17.31-14.25 20.57z"
                        />
                        <path
                          fill="currentColor"
                          d="m26.75 6.7a5.215 5.215 0 0 0 -7.35 0l-1.95 1.95a5.2 5.2 0 0 0 0 7.35l1.63 1.62a.96.96 0 0 0 .7.29.982.982 0 0 0 .71-.29 41.864 41.864 0 0 1 8.61-6.78 1.012 1.012 0 0 0 .21-1.58zm-6.96 8.81-.92-.93a3.136 3.136 0 0 1 -.94-2.26 3.17 3.17 0 0 1 .94-2.26l1.94-1.94a3.187 3.187 0 0 1 4.52 0l1.66 1.65a44.523 44.523 0 0 0 -7.2 5.74z"
                        />
                        <path
                          fill="currentColor"
                          d="m32.24 46.53c-.49.72-4.8 7.06-4.8 9.85a5.625 5.625 0 0 0 11.25 0c0-2.79-4.31-9.13-4.8-9.85a1.043 1.043 0 0 0 -1.65 0z"
                        />
                      </svg>
                      <h4 className="text-xl font-accent text-center text-cyan-700 mt-4">
                        It's a little empty around here.
                      </h4>
                      <p className="text-base text-center text-neutral-700 mt-1">
                        Looks like you haven't added any items to your cart yet
                      </p>
                    </div>
                  )}
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={upsellActive}
        onClose={checkout}
        className="relative z-[70]"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel
                transition
                className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <TransitionChild>
                  <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
                    <button
                      type="button"
                      onClick={checkout}
                      className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <span className="absolute -inset-2.5" />
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                    </button>
                  </div>
                </TransitionChild>
                <div className="flex h-full flex-col bg-white shadow-xl">
                  {UpsellComponent()}
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
