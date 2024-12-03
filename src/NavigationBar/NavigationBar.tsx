import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Announcements from "./Announcements";

const today = new Date();
const bundles_week_end = new Date("12/2/24");
bundles_week_end.setHours(0);
bundles_week_end.setMinutes(0);
bundles_week_end.setSeconds(0);

const navigation = {
  categories: [
    {
      id: "shop",
      name: "Shop",
      featured: [
        today > bundles_week_end
          ? {
              name: "Sugar Cookie",
              href: "/products/santa-sleighin-miles",
              imageSrc:
                "https://cdn.shopify.com/s/files/1/0761/6924/9081/files/Santa.gif?v=1730944454&width=500",
              imageAlt: "Sleighin' Miles Blend",
              description: "Shop now",
            }
          : {
              name: "Bundles Week",
              href: "/pages/bundlesweekend",
              imageSrc:
                "https://cdn.shopify.com/s/files/1/0761/6924/9081/files/Navigation_Banner_Gif.gif?v=1732498817&width=500",
              imageAlt: "Bundles Week",
              description: "Save up to 35%",
            },
        {
          name: "Long Run Club",
          href: "/pages/long-run-club",
          imageSrc:
            "https://cdn.shopify.com/s/files/1/0761/6924/9081/files/subscribe_and_save.png?v=1731189577&width=500",
          imageAlt: "Subscribe and save with Long Run Club.",
          description: "Subscribe & Save",
        },
      ],
      sections: [
        {
          order: 2,
          id: "coffee",
          name: "Coffee",
          items: [
            { name: "All", href: "/collections/coffee" },
            { name: "Traditional", href: "/collections/traditional-roasts" },
            { name: "Flavored", href: "/collections/flavored" },
            { name: "Bundles", href: "/collections/bundle-save" },
          ],
        },
        {
          order: 3,
          id: "gear",
          name: "Gear",
          items: [
            { name: "All", href: "/collections/gear" },
            { name: "Drinkware", href: "/collections/drinkware" },
            { name: "Clothing", href: "/collections/clothing" },
            { name: "Reusable Pods", href: "/collections/reusable-pods" },
            { name: "Decals", href: "/products/brand-decal-set" },
          ],
        },
        {
          order: 1,
          id: "hot-right-now",
          name: "Hot Right Now",
          items: [
            {
              name: "Bundles Weekend",
              href: "/pages/bundlesweekend",
              label: "Sale",
            },
            {
              name: "Ready to Run",
              href: "/products/ready-to-run",
            },
            {
              name: "Gift Cards",
              href: "/products/long-run-coffee-card",
            },
          ],
        },
      ],
    },
    {
      id: "info",
      name: "Info",
      featured: [
        {
          name: "Sugar Cookie",
          href: "/products/santa-sleighin-miles",
          imageSrc:
            "https://cdn.shopify.com/s/files/1/0761/6924/9081/files/Santa.gif?v=1730944454&width=500",
          imageAlt: "Sleighin' Miles Blend",
          description: "Shop now",
        },
        {
          name: "Long Run Coffee's First Instant Powder Is Here!",
          href: "/blogs/news/ready-to-run",
          imageSrc:
            "https://cdn.shopify.com/s/files/1/0761/6924/9081/files/Adam_Gif.gif?v=1728772600",
          imageAlt:
            "After a year of development, Long Run Coffee's first instant electrolyte powder is here.",
          description: "Read now",
        },
      ],
      sections: [
        {
          order: 1,
          id: "lrc",
          name: "Long Run Coffee",
          items: [
            { name: "Reviews", href: "/pages/long-run-reviews" },
            { name: "The Science", href: "/pages/the-science" },
            { name: "Mission", href: "/pages/mission" },
          ],
        },
        {
          order: 2,
          id: "community",
          name: "Community",
          items: [
            { name: "Ambassador Program", href: "/pages/ambassador-program" },
            { name: "Long Run Library", href: "/pages/blogs" },
          ],
        },
        {
          order: 3,
          id: "inqueries",
          name: "Inqueries",
          items: [
            { name: "Wholesale & Custom", href: "/pages/wholesale" },
            { name: "Customer Service", href: "/pages/customer-service" },
            { name: "FAQ", href: "/pages/faq" },
          ],
        },
      ],
    },
  ],
  pages: [{ name: "Long Run Club", href: "/pages/long-run-club" }],
};

export function NavigationBar() {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handler = function (event: any) {
      const { count } = event.detail;
      setCartCount(count);
    };
    document.addEventListener("cart_count_change", handler);
    return () => {
      document.removeEventListener("cart_count_change", handler);
    };
  }, [setCartCount]);

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <div className="flex px-4 pb-2 pt-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                data-testid="close-navbar"
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>

            {/* Links */}
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-base font-accent text-cyan-700 data-[selected]:border-cyan-600 data-[selected]:text-cyan-600"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel
                    key={category.name}
                    className="space-y-10 px-4 pb-8 pt-10"
                  >
                    <div className="grid grid-cols-2 gap-x-4">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative text-sm">
                          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                            <img
                              alt={item.imageAlt}
                              src={item.imageSrc}
                              className="object-cover object-center"
                            />
                          </div>
                          <a
                            href={item.href}
                            className="mt-6 block font-accent text-cyan-700"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 z-10"
                            />
                            {item.name}
                          </a>
                          <p
                            aria-hidden="true"
                            className="mt-1 font-base text-gray-500"
                          >
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                    {category.sections
                      .sort((a, b) => a.order - b.order)
                      .map((section) => (
                        <div key={section.name}>
                          <p
                            id={`${category.id}-${section.id}-heading-mobile`}
                            className="font-accent text-cyan-700"
                          >
                            {section.name}
                          </p>
                          <ul
                            role="list"
                            aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                            className="mt-6 flex flex-col space-y-6"
                          >
                            {section.items.map((item) => (
                              <li key={item.name} className="flow-root">
                                <a
                                  href={item.href}
                                  className="hover:text-cyan-800 flex group items-center space-x-1"
                                >
                                  {/* @ts-ignore */}
                                  {item?.label ? (
                                    <div className="mr-1 bg-cyan-200 rounded-md p-1 text-cyan-700 group-hover:text-cyan-800 group-hover:bg-cyan-300 text-xs font-medium">
                                      {/* @ts-ignore */}
                                      {item.label}
                                    </div>
                                  ) : null}
                                  <span>{item.name}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page: any) => (
                <div key={page.name} className="flow-root">
                  <a
                    href={page.href}
                    className="-m-2 block p-2 font-accent text-cyan-700"
                  >
                    {page.name}
                  </a>
                </div>
              ))}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-white">
        <Announcements
          texts={[
            "Free Shipping on Orders $59+",
            "1% Donated to Mental Health",
          ]}
        />

        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                data-testid="open-navbar"
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="h-6 w-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <a href="/">
                  <span className="sr-only">Long Run Coffee</span>
                  <img
                    alt=""
                    src="//longruncoffee.com/cdn/shop/files/LRC_Sticker_13.png?v=1697587388&width=600"
                    className="h-8 w-auto"
                  />
                </a>
              </div>

              {/* Flyout menus */}
              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch z-40">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      <div className="relative flex">
                        <PopoverButton className="relative z-10 -mb-px flex items-center border-b-2 border-transparent pt-px text-base lg:text-lg font-accent text-cyan-700 transition-colors duration-200 ease-out hover:text-cyan-800 data-[open]:border-cyan-600 data-[open]:text-cyan-600">
                          {category.name}
                        </PopoverButton>
                      </div>

                      <PopoverPanel
                        transition
                        className="absolute inset-x-0 top-full text-sm text-gray-500 transition data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                      >
                        {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 top-1/2 bg-white shadow"
                        />

                        <div className="relative bg-white">
                          <div className="mx-auto max-w-7xl px-8">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                              <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                {category.featured.map((item) => (
                                  <div
                                    key={item.name}
                                    className="group relative text-base sm:text-sm"
                                  >
                                    <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                      <img
                                        alt={item.imageAlt}
                                        src={item.imageSrc}
                                        className="object-cover object-center"
                                      />
                                    </div>
                                    <a
                                      href={item.href}
                                      className="mt-6 block font-accent text-cyan-700"
                                    >
                                      <span
                                        aria-hidden="true"
                                        className="absolute inset-0 z-10"
                                      />
                                      {item.name}
                                    </a>
                                    <p aria-hidden="true" className="mt-1">
                                      {item.description}
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                {category.sections.map((section) => (
                                  <div key={section.name}>
                                    <p
                                      id={`${section.name}-heading`}
                                      className="font-accent text-cyan-700"
                                    >
                                      {section.name}
                                    </p>
                                    <ul
                                      role="list"
                                      aria-labelledby={`${section.name}-heading`}
                                      className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                    >
                                      {section.items.map((item) => (
                                        <li key={item.name} className="flex">
                                          <a
                                            href={item.href}
                                            className="hover:text-cyan-800 flex group"
                                          >
                                            {/* @ts-ignore */}
                                            {item?.label ? (
                                              <div className="mr-1 -mt-px bg-cyan-200 rounded-md p-1 text-cyan-700 group-hover:text-cyan-800 group-hover:bg-cyan-300 text-xs font-medium">
                                                {/* @ts-ignore */}
                                                {item.label}
                                              </div>
                                            ) : null}
                                            {item.name}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverPanel>
                    </Popover>
                  ))}

                  {navigation.pages.map((page: any) => (
                    <a
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-base lg:text-lg font-accent text-cyan-700 hover:text-cyan-800"
                    >
                      {page.name}
                    </a>
                  ))}
                </div>
              </PopoverGroup>

              <div className="ml-auto flex items-center">
                {/* Search */}
                <div className="flex">
                  <a
                    href="/search"
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon
                      aria-hidden="true"
                      className="h-6 w-6"
                    />
                  </a>
                </div>
                {/* Account */}
                <div className="flex lg:ml-4">
                  <a
                    href="/account"
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Account</span>
                    <UserIcon aria-hidden="true" className="h-6 w-6" />
                  </a>
                </div>

                {/* Cart */}
                <div className="flex ml-2 lg:ml-4">
                  <button
                    onClick={() =>
                      document.dispatchEvent(new CustomEvent("cart_toggle"))
                    }
                    data-testid="navbar-open-cart"
                    className="group -m-2 flex items-center p-2"
                  >
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                    <span
                      data-testid="navbar-cart-count"
                      className="ml-2 text-sm font-medium text-gray-500 group-hover:text-gray-700"
                    >
                      {cartCount}
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
