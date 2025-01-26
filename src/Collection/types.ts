export interface Collection {
  id: number;
  handle: string;
  title: string;
  updated_at: string;
  body_html: string;
  published_at: string;
  sort_order: string;
  template_suffix: string;
  disjunctive: boolean;
  rules: Rule[];
  published_scope: string;
  image: Image;
}

export interface Rule {
  column: string;
  relation: string;
  condition: string;
}

export interface Image {
  created_at: string;
  alt: string | null;
  width: number;
  height: number;
  src: string;
}

export interface Product {
  id: number;
  title: string;
  handle: string;
  description: string;
  published_at: string;
  created_at: string;
  vendor: string;
  type: string;
  tags: string[];
  price: number;
  price_min: number;
  price_max: number;
  available: boolean;
  price_varies: boolean;
  compare_at_price: number | null;
  compare_at_price_min: number | null;
  compare_at_price_max: number | null;
  compare_at_price_varies: boolean;
  variants: Variant[];
  images: string[];
  featured_image: string;
  options: string[];
  media: Media[];
  requires_selling_plan: boolean;
  selling_plan_groups: SellingPlanGroup[];
  content: string;
}

export interface Variant {
  id: number;
  title: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  sku: string | null;
  requires_shipping: boolean;
  taxable: boolean;
  featured_image: Image | null;
  available: boolean;
  name: string;
  public_title: string;
  options: string[];
  price: number;
  weight: number;
  compare_at_price: number | null;
  inventory_management: string;
  barcode: string | null;
  requires_selling_plan: boolean;
  selling_plan_allocations: SellingPlanAllocation[];
  featured_media?: Media;
}

export interface Media {
  alt: string | null;
  id: number;
  position: number;
  preview_image: PreviewImage;
  aspect_ratio: number;
  height: number;
  media_type: string;
  src: string;
  width: number;
}

export interface PreviewImage {
  aspect_ratio: number;
  height: number;
  width: number;
  src: string;
}

export interface SellingPlanGroup {
  id: string;
  name: string;
  options: SellingPlanOption[];
  selling_plans: SellingPlan[];
  app_id: string;
}

export interface SellingPlanOption {
  name: string;
  position: number;
  values: string[];
}

export interface SellingPlan {
  id: number;
  name: string;
  description: string | null;
  options: SellingPlanOption[];
  recurring_deliveries: boolean;
  price_adjustments: PriceAdjustment[];
  checkout_charge: CheckoutCharge;
}

export interface PriceAdjustment {
  order_count: number | null;
  position: number;
  value_type: string;
  value: number;
}

export interface CheckoutCharge {
  value_type: string;
  value: number;
}

export interface SellingPlanAllocation {
  price_adjustments: PriceAdjustment[];
  price: number;
  compare_at_price: number | null;
  per_delivery_price: number;
  selling_plan_id: number;
  selling_plan_group_id: string;
}

export interface IProductReview {
  rating: {
    scale_min: string;
    scale_max: string;
    value: string;
  };
  rating_count: number;
}

export interface FeaturedCollection {
  category: string;
  title: string;
  href: string;
  src: string;
  is_all_coffee: boolean;
}

export interface CollectionData {
  collection: Collection;
  collections: FeaturedCollection[];
  products: Product[];
  reviews: IProductReview;
}
