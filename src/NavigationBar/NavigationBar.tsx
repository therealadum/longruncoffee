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

const navigation = {
  categories: [
    {
      id: "shop",
      name: "Shop",
      featured: [
        {
          name: "Stroopwafel",
          href: "/products/stroopwafel",
          imageSrc:
            "https://cdn.shopify.com/s/files/1/0761/6924/9081/files/stroop-2.png?v=1721500555&width=500",
          imageAlt: "Stroopwafel flavored coffee. Summer 2024",
          description: "Shop now",
        },
        {
          name: "Long Run Club",
          href: "/pages/long-run-club",
          imageSrc:
            "https://cdn.shopify.com/s/files/1/0761/6924/9081/files/LRC4.jpg?v=1711743212&width=500",
          imageAlt: "Subscribe and save with Long Run Club.",
          description: "Subscribe & Save",
        },
      ],
      sections: [
        {
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
          id: "gear",
          name: "Gear",
          items: [
            { name: "Drinkware", href: "/collections/drinkware" },
            { name: "Clothing", href: "/collections/clothing" },
            { name: "Reusable Pods", href: "/collections/reusable-pods" },
            { name: "Decals", href: "/products/brand-decal-set" },
          ],
        },
        {
          id: "subscribe-and-save",
          name: "Subscribe & Save",
          items: [
            { name: "Club Exclusives", href: "/collections/club-exclusives" },
            { name: "All Subscriptions", href: "/collections/subscribe-save" },
          ],
        },
      ],
    },
    {
      id: "info",
      name: "Info",
      featured: [
        {
          name: "Ben and the Vermont 100",
          href: "/blogs/athlete-stories/ben",
          imageSrc:
            "https://longruncoffee.com/cdn/shop/articles/Blog_Primary_Image_badbc7b3-16c5-4989-b9bc-3bcb81c790de.png?v=1712799572&width=500",
          imageAlt: "Athlete highlight: Ben Simanski runs the Vermont 100.",
          description: "Read now",
        },
        {
          name: "Overnight Oats: Stroopwafel",
          href: "/blogs/recipes/stroopwafel-overnight-oats",
          imageSrc:
            "https://longruncoffee.com/cdn/shop/articles/169_Blog_Pictures_4_4c316376-7a2c-4272-8c30-a2a282f39dac.png?v=1721837822&width=500",
          imageAlt:
            "A fantastic recipe for overnight oats using our stroopwafel coffee.",
          description: "Read now",
        },
      ],
      sections: [
        {
          id: "lrc",
          name: "Long Run Coffee",
          items: [
            { name: "Reviews", href: "/pages/long-run-reviews" },
            { name: "The Science", href: "/pages/the-science" },
            { name: "Mission", href: "/pages/mission" },
          ],
        },
        {
          id: "community",
          name: "Community",
          items: [
            { name: "Ambassador Program", href: "/pages/ambassador-program" },
            { name: "Long Run Library", href: "/pages/blogs" },
          ],
        },
        {
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

export function NavigationBar(props: any) {
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
                    {category.sections.map((section) => (
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
                                className="-m-2 block p-2 text-gray-500"
                              >
                                {item.name}
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
                                            className="hover:text-cyan-800"
                                          >
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
                    className="group -m-2 flex items-center p-2"
                  >
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-500 group-hover:text-gray-700">
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
