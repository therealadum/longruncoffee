// Define a master list of products
const mockProducts = [
  {
    id: 8686086095161,
    title: "Brown Butter Pumpkin",
    handle: "race-season-roast",
    description:
      '<p><strong><span style="color: #ff2a00;" data-mce-style="color: #ff2a00;"></span></strong>Did you know 40% of races take place in the fall? It\'s Race Season!</p>\n<p>And Long Run Coffee has made your new favorite way to fuel training - <strong>Brown Butter Pumpkin Electrolyte Infused Coffee</strong>.</p>\n<p>Infused with electrolytes, the only thing basic about this fall coffee is its pH balance.</p>',
    published_at: "2024-08-30T12:58:45-05:00",
    created_at: "2023-09-11T19:18:37-05:00",
    vendor: "Long Run Coffee",
    type: "Flavored",
    tags: ["All Coffee", "Energy", "Fatigue Reduction", "Flavor", "Hydration"],
    price: 3400,
    price_min: 3400,
    price_max: 13900,
    available: true,
    price_varies: true,
    compare_at_price: 3400,
    compare_at_price_min: 3400,
    compare_at_price_max: 3400,
    compare_at_price_varies: false,
    variants: [
      {
        id: 46827447222585,
        title: "1 lbs / Fresh Ground",
        option1: "1 lbs",
        option2: "Fresh Ground",
        option3: null,
        sku: "2Z-1V0B-KXWB",
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: true,
        name: "Brown Butter Pumpkin - 1 lbs / Fresh Ground",
        public_title: "1 lbs / Fresh Ground",
        options: ["1 lbs", "Fresh Ground"],
        price: 3400,
        weight: 454,
        compare_at_price: 3400,
        inventory_management: "shopify",
        barcode: "",
        requires_selling_plan: false,
        selling_plan_allocations: [],
      },
      {
        id: 49865722036537,
        title: "5 lbs / Fresh Ground",
        option1: "5 lbs",
        option2: "Fresh Ground",
        option3: null,
        sku: "",
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: true,
        name: "Brown Butter Pumpkin - 5 lbs / Fresh Ground",
        public_title: "5 lbs / Fresh Ground",
        options: ["5 lbs", "Fresh Ground"],
        price: 13900,
        weight: 2268,
        compare_at_price: null,
        inventory_management: "shopify",
        barcode: "",
        requires_selling_plan: false,
        selling_plan_allocations: [],
      },
    ],
    images: [
      "//longruncoffee.com/cdn/shop/files/Race_Season_Roast_-_Brown_Butter_Pumpkin_-_Electrolyte_Infused_Coffee.png?v=1728769104",
      "//longruncoffee.com/cdn/shop/files/Race_Season_6.png?v=1725322031",
      "//longruncoffee.com/cdn/shop/files/Race_Season_7.png?v=1725322029",
      "//longruncoffee.com/cdn/shop/files/4_7c86e418-405b-4620-bb8a-0d90af2fba0e.png?v=1725300690",
      "//longruncoffee.com/cdn/shop/files/Race_Season_5.png?v=1725300711",
      "//longruncoffee.com/cdn/shop/files/Race_Season_9.png?v=1725328737",
    ],
    featured_image:
      "//longruncoffee.com/cdn/shop/files/Race_Season_Roast_-_Brown_Butter_Pumpkin_-_Electrolyte_Infused_Coffee.png?v=1728769104",
    options: ["Size", "Form"],
    media: [
      {
        alt: null,
        id: 41232094200121,
        position: 1,
        preview_image: {
          aspect_ratio: 1,
          height: 2000,
          width: 2000,
          src: "//longruncoffee.com/cdn/shop/files/Race_Season_Roast_-_Brown_Butter_Pumpkin_-_Electrolyte_Infused_Coffee.png?v=1728769104",
        },
        aspect_ratio: 1,
        height: 2000,
        media_type: "image",
        src: "//longruncoffee.com/cdn/shop/files/Race_Season_Roast_-_Brown_Butter_Pumpkin_-_Electrolyte_Infused_Coffee.png?v=1728769104",
        width: 2000,
      },
      {
        alt: "Long Run Coffee - Brown Butter Pumpkin - Race Season Roast - Electrolyte Infused Coffee for Runners",
        id: 40747459051833,
        position: 2,
        preview_image: {
          aspect_ratio: 1,
          height: 4000,
          width: 4000,
          src: "//longruncoffee.com/cdn/shop/files/Race_Season_6.png?v=1725322031",
        },
        aspect_ratio: 1,
        height: 4000,
        media_type: "image",
        src: "//longruncoffee.com/cdn/shop/files/Race_Season_6.png?v=1725322031",
        width: 4000,
      },
      {
        alt: "Long Run Coffee - Brown Butter Pumpkin - Race Season Roast - Electrolyte Infused Coffee for Runners",
        id: 40747458953529,
        position: 3,
        preview_image: {
          aspect_ratio: 1,
          height: 4000,
          width: 4000,
          src: "//longruncoffee.com/cdn/shop/files/Race_Season_7.png?v=1725322029",
        },
        aspect_ratio: 1,
        height: 4000,
        media_type: "image",
        src: "//longruncoffee.com/cdn/shop/files/Race_Season_7.png?v=1725322029",
        width: 4000,
      },
      {
        alt: "Long Run Coffee - Brown Butter Pumpkin - Race Season Roast - Electrolyte Infused Coffee for Runners",
        id: 40743940522297,
        position: 4,
        preview_image: {
          aspect_ratio: 1,
          height: 4000,
          width: 4000,
          src: "//longruncoffee.com/cdn/shop/files/4_7c86e418-405b-4620-bb8a-0d90af2fba0e.png?v=1725300690",
        },
        aspect_ratio: 1,
        height: 4000,
        media_type: "image",
        src: "//longruncoffee.com/cdn/shop/files/4_7c86e418-405b-4620-bb8a-0d90af2fba0e.png?v=1725300690",
        width: 4000,
      },
      {
        alt: "Long Run Coffee - Brown Butter Pumpkin - Race Season Roast - Electrolyte Infused Coffee for Runners",
        id: 40743941570873,
        position: 5,
        preview_image: {
          aspect_ratio: 1,
          height: 3750,
          width: 3750,
          src: "//longruncoffee.com/cdn/shop/files/Race_Season_5.png?v=1725300711",
        },
        aspect_ratio: 1,
        height: 3750,
        media_type: "image",
        src: "//longruncoffee.com/cdn/shop/files/Race_Season_5.png?v=1725300711",
        width: 3750,
      },
      {
        alt: "Long Run Coffee - Brown Butter Pumpkin - Race Season Roast - Electrolyte Infused Coffee for Runners",
        id: 40748629459257,
        position: 6,
        preview_image: {
          aspect_ratio: 1,
          height: 4000,
          width: 4000,
          src: "//longruncoffee.com/cdn/shop/files/Race_Season_9.png?v=1725328737",
        },
        aspect_ratio: 1,
        height: 4000,
        media_type: "image",
        src: "//longruncoffee.com/cdn/shop/files/Race_Season_9.png?v=1725328737",
        width: 4000,
      },
    ],
    requires_selling_plan: false,
    selling_plan_groups: [],
    content:
      '<p><strong><span style="color: #ff2a00;" data-mce-style="color: #ff2a00;"></span></strong>Did you know 40% of races take place in the fall? It\'s Race Season!</p>\n<p>And Long Run Coffee has made your new favorite way to fuel training - <strong>Brown Butter Pumpkin Electrolyte Infused Coffee</strong>.</p>\n<p>Infused with electrolytes, the only thing basic about this fall coffee is its pH balance.</p>',
  },
];

// Utility function to mock a response
const mockResponse = (data: any) => {
  return Promise.resolve({
    json: () => Promise.resolve(data),
  });
};

// Mock function for retrieving a product by handle
export const ShopifyProductAPI = {
  getProductByHandle: jest.fn((handle: string) => {
    const product = mockProducts.find((p) => p.handle === handle);
    if (product) {
      return mockResponse(product);
    } else {
      return Promise.reject(new Error(`Product not found: ${handle}`));
    }
  }),
};
