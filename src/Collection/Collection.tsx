import { Fragment, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { CollectionData, IProductReview } from "./types";
import { Card, Carousel } from "../CardCarousel";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../common/cn";
import {
  getCheckedCountInGroup,
  useSortAndFilterQueryParams,
} from "./util/sort_and_filter_query_params";
import { filter_products } from "./util/filter_products";
import { sort_products } from "./util/sort_products";
import { get_display_product_price } from "./util/get_display_product_price";
import {
  AdjustmentsHorizontalIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";

export interface ICollectionProps {
  container: {
    attributes: {
      getNamedItem: (s: string) => {
        value: string;
      };
    };
  };
}

export function Collection(props: ICollectionProps) {
  const collection: CollectionData = JSON.parse(
    decodeURIComponent(
      props.container.attributes.getNamedItem("collectionjson").value,
    ),
  );
  const collections = collection.collections || [
    {
      category: "Always Long Run",
      title: "All Coffee",
      href: "/collections/coffee",
      src: "https://cdn.shopify.com/s/files/1/0761/6924/9081/collections/Long_Run_Coffee_-_Electrolyte_Infused_Coffee.jpg?v=1723730646&width=300",
      is_all_coffee: true,
    },
    {
      category: "Always Classic",
      title: "Traditional Roasts",
      href: "/collections/traditional-roasts",
      src: "https://cdn.shopify.com/s/files/1/0761/6924/9081/collections/LRC2.jpg?v=1723730795&width=300",
      is_all_coffee: true,
    },
    {
      category: "Always Smooth",
      title: "Flavored Roasts",
      href: "/collections/flavored",
      src: "https://cdn.shopify.com/s/files/1/0761/6924/9081/collections/Flavor_Set.png?v=1723730818&width=300",
      is_all_coffee: true,
    },
    {
      category: "Always Popular",
      title: "Best Selling",
      href: "/collections/best-selling",
      src: "https://cdn.shopify.com/s/files/1/0761/6924/9081/collections/Long_Run_Coffee_-_Electrolyte_Infused_Coffee_for_Athletes.jpg?v=1693654571&width=300",
      is_all_coffee: true,
    },
    {
      category: "Always Reliable",
      title: "Gear",
      href: "/collections/gear",
      src: "https://cdn.shopify.com/s/files/1/0761/6924/9081/collections/11_-_Template.png?v=1723730528&width=300",
      is_all_coffee: false,
    },
  ];

  const {
    handleSortChange,
    handleToggleFilter,
    sortOptions,
    filters,
    mobileFiltersOpen,
    setMobileFiltersOpen,
  } = useSortAndFilterQueryParams();

  let active_index: null | number = null;
  if (collection && collection.collection) {
    collections.forEach((col, idx) => {
      if (`/collections/${collection.collection.handle}` == col.href) {
        active_index = idx;
      }
    });
  }

  const is_all_coffee =
    active_index != null && collections[active_index].is_all_coffee;

  let filtered_collection = filter_products(
    collection.products,
    filters,
    is_all_coffee,
  );
  let sorted_collection = sort_products(
    filtered_collection,
    collection.reviews,
    sortOptions.find((opt) => opt.current),
  );

  return (
    <div className="bg-cyan-50 bg-opacity-20">
      <div>
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-0">
            <Carousel
              active={collection.collection}
              active_index={active_index}
              items={collections.map((c, i) => (
                <Card
                  key={c.src}
                  index={i}
                  card={c}
                  isActive={
                    `/collections/${collection.collection.handle}` == c.href
                  }
                />
              ))}
            />
          </div>
        </div>

        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 sm:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-accent text-cyan-700">Filters</h2>
                <button
                  type="button"
                  data-testid="collection-mobile-close-filters-button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4">
                {filters.map((section) => (
                  <Disclosure
                    key={section.name}
                    as="div"
                    defaultOpen
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton
                        data-testid={`collection-mobile-filter-button-${section.id}`}
                        className="group flex w-full items-center bg-white px-2 py-3 text-sm text-gray-400"
                      >
                        <span className="font-accent text-cyan-700 flex-1 text-left">
                          {section.name}
                        </span>
                        {getCheckedCountInGroup(filters, section.id) !== 0 ? (
                          <span className="ml-1.5 rounded bg-cyan-50 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-cyan-700">
                            {getCheckedCountInGroup(filters, section.id)}
                          </span>
                        ) : null}
                        <span className="ml-1 flex items-center">
                          <ChevronDownIcon
                            aria-hidden="true"
                            className="size-5 text-gray-800 rotate-0 transform group-data-[open]:-rotate-180"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex gap-3">
                            <div className="flex h-5 shrink-0 items-center">
                              <div className="group grid size-4 grid-cols-1">
                                <input
                                  data-testid={`collection-mobile-filter-${section.id}-option-${option.value}`}
                                  onChange={() =>
                                    handleToggleFilter(section.id, option.value)
                                  }
                                  checked={option.checked}
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  type="checkbox"
                                  className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-cyan-600 checked:bg-cyan-600 indeterminate:border-cyan-600 indeterminate:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                />
                                <svg
                                  fill="none"
                                  viewBox="0 0 14 14"
                                  className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                                >
                                  <path
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-[:checked]:opacity-100"
                                  />
                                  <path
                                    d="M3 7H11"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-[:indeterminate]:opacity-100"
                                  />
                                </svg>
                              </div>
                            </div>
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="text-sm text-gray-500"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Filters */}
        <section aria-labelledby="filter-heading">
          <h2 id="filter-heading" className="sr-only">
            Filters
          </h2>

          <div className="border-b border-gray-200 bg-white pb-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              {is_all_coffee ? (
                <button
                  type="button"
                  data-testid="collection-mobile-open-filters-button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="group inline-flex space-x-2 justify-center items-center text-base font-medium text-gray-700 hover:text-gray-900 rounded-lg px-3 py-2 border border-gray-400 hover:border-gray-700 hover:bg-gray-50 sm:hidden"
                >
                  <span>Filter</span>
                  <AdjustmentsHorizontalIcon className="size-5" />
                </button>
              ) : null}

              {is_all_coffee ? (
                <div className="hidden sm:block">
                  <div className="flow-root">
                    <PopoverGroup className="-mx-4 flex items-center divide-x divide-gray-200">
                      {filters.map((section, sectionIdx) => (
                        <Popover
                          key={section.name}
                          className="relative inline-block px-4 text-left"
                        >
                          <PopoverButton
                            data-testid={`collection-desktop-filter-button-${section.id}`}
                            className="group inline-flex justify-center items-center text-base font-medium text-gray-700 hover:text-gray-900 rounded-lg px-3 py-2 border border-gray-400 hover:border-gray-700 hover:bg-gray-50"
                          >
                            <span>{section.name}</span>
                            {getCheckedCountInGroup(filters, section.id) !==
                            0 ? (
                              <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                                {getCheckedCountInGroup(filters, section.id)}
                              </span>
                            ) : null}
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                            />
                          </PopoverButton>

                          <PopoverPanel
                            transition
                            className="absolute left-4 z-10 mt-2 origin-top-left rounded-md bg-white p-4 shadow-2xl ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                          >
                            <form className="space-y-4">
                              {section.options.map((option, optionIdx) => (
                                <div key={option.value} className="flex gap-3">
                                  <div className="flex h-5 shrink-0 items-center">
                                    <div className="group grid size-4 grid-cols-1">
                                      <input
                                        data-testid={`collection-desktop-filter-${section.id}-option-${option.value}`}
                                        onChange={() =>
                                          handleToggleFilter(
                                            section.id,
                                            option.value,
                                          )
                                        }
                                        checked={option.checked}
                                        id={`filter-${section.id}-${optionIdx}`}
                                        name={`${section.id}[]`}
                                        type="checkbox"
                                        className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-cyan-600 checked:bg-cyan-600 indeterminate:border-cyan-600 indeterminate:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                      />
                                      <svg
                                        fill="none"
                                        viewBox="0 0 14 14"
                                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                                      >
                                        <path
                                          d="M3 8L6 11L11 3.5"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="opacity-0 group-has-[:checked]:opacity-100"
                                        />
                                        <path
                                          d="M3 7H11"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="opacity-0 group-has-[:indeterminate]:opacity-100"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                  <label
                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                    className="whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </form>
                          </PopoverPanel>
                        </Popover>
                      ))}
                    </PopoverGroup>
                  </div>
                </div>
              ) : null}

              <Menu as="div" className="ml-auto relative">
                <MenuButton
                  data-testid="collection-open-sort-button"
                  className="group inline-flex space-x-2 justify-center items-center text-base font-medium text-gray-700 hover:text-gray-900 rounded-lg px-3 py-2 border border-gray-400 hover:border-gray-700 hover:bg-gray-50"
                >
                  <span>Sort</span>
                  <ArrowsUpDownIcon className="size-5" />
                </MenuButton>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <button
                          data-testid={`collection-sort-option-${option.value}`}
                          onClick={() => handleSortChange(option.value)}
                          className={cn(
                            option.current
                              ? "font-medium text-gray-900"
                              : "text-gray-500",
                            "text-left w-full block px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:outline-none",
                          )}
                        >
                          {option.name}
                        </button>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </section>

        {/* Product grid */}
        <section
          aria-labelledby="products-heading"
          className="mx-auto max-w-2xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:max-w-7xl lg:px-8"
        >
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            <AnimatePresence mode="popLayout">
              {sorted_collection.map((product, index) => {
                const reviews: IProductReview = collection.reviews[product.id];
                const { price, compare_at_price } =
                  get_display_product_price(product);
                return (
                  <motion.a
                    data-testid={`collection-product-${product.handle}`}
                    key={product.id}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      transition: {
                        type: "spring",
                      },
                    }}
                    layout
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: {
                        type: "spring",
                        delay: 0.1 * index,
                      },
                    }}
                    href={`/products/${product.handle}`}
                    className="group"
                  >
                    <img
                      alt={`${product.title} feature image`}
                      src={`${product.featured_image}&width=450`}
                      className={`aspect-square w-full rounded-lg bg-cyan-50 bg-opacity-20 object-cover transition duration-300 ${
                        product.images.length > 1
                          ? "group-hover:hidden"
                          : "group-hover:border border-cyan-300"
                      }`}
                    />
                    {product.images.length > 1 ? (
                      <img
                        alt={`${product.title} product image`}
                        src={`${product.images[1]}&width=450`}
                        className="aspect-square w-full rounded-lg bg-cyan-50 bg-opacity-20 object-cover transition duration-300 group-hover:block group-hover:border border-cyan-300 hidden"
                      />
                    ) : null}
                    <h3 className="mt-4 font-accent text-base leading-5 text-cyan-700 group-hover:underline underline-offset-2">
                      {product.title}
                    </h3>
                    {reviews ? (
                      <div className="flex items-center space-x-2 -ml-0.5 mt-[2px]">
                        <div className="relative">
                          {/* Base stars (gray background) */}
                          <div className="flex text-gray-300">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <svg
                                key={index}
                                className="h-5 w-5 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ))}
                          </div>

                          {/* Gold stars (foreground, dynamically masked) */}
                          <div
                            className="absolute top-0 left-0 flex overflow-hidden text-yellow-400"
                            style={{
                              clipPath: `inset(0 ${
                                100 -
                                (parseFloat(reviews.rating.value) / 5) * 100
                              }% 0 0)`,
                            }}
                          >
                            {Array.from({ length: 5 }).map((_, index) => (
                              <svg
                                key={index}
                                className="h-5 w-5 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm font-base text-gray-700">
                          ({reviews.rating_count})
                        </p>
                      </div>
                    ) : null}
                    {compare_at_price != price ? (
                      <p className="mt-1 text-sm font-medium text-gray-600 flex items-center space-x-2">
                        <span className="line-through text-gray-500">
                          ${(compare_at_price / 100).toFixed(2)}
                        </span>
                        <span>${(price / 100).toFixed(2)}</span>
                      </p>
                    ) : (
                      <p className="mt-1 text-sm font-medium text-gray-600">
                        ${(price / 100).toFixed(2)}
                      </p>
                    )}
                  </motion.a>
                );
              })}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
