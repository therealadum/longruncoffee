export interface ISubscriptionCartState {
  items: ISubscriptionCartItem[];
}

export interface ISubscriptionCartItem {
  product: IProduct;
  variantID: number;
  variant: IVariant;
  quantity: number;
}

export interface ICartState {
  token: string;
  note: string;
  attributes: Record<string, any>;
  original_total_price: number;
  total_price: number;
  total_discount: number;
  total_weight: number;
  item_count: number;
  items: ICartItem[];
  requires_shipping: boolean;
  currency: string;
  items_subtotal_price: number;
  cart_level_discount_applications: any[];
}

export interface ICartItem {
  id: number;
  properties: Record<string, any>;
  quantity: number;
  variant_id: number;
  key: string;
  title: string;
  price: number;
  original_price: number;
  presentment_price: number;
  discounted_price: number;
  line_price: number;
  original_line_price: number;
  total_discount: number;
  discounts: any[];
  sku: string | null;
  grams: number;
  vendor: string;
  taxable: boolean;
  product_id: number;
  product_has_only_default_variant: boolean;
  gift_card: boolean;
  final_price: number;
  final_line_price: number;
  url: string;
  featured_image: ICartItemFeaturedImage;
  image: string;
  handle: string;
  requires_shipping: boolean;
  product_type: string;
  product_title: string;
  product_description: string;
  variant_title: string | null;
  variant_options: string[];
  options_with_values: IOptionWithValue[];
  line_level_discount_allocations: any[];
  line_level_total_discount: number;
  has_components: boolean;
  selling_plan_allocation: any;
}

export interface IProduct {
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
  compare_at_price_min: number;
  compare_at_price_max: number;
  compare_at_price_varies: boolean;
  variants: IVariant[];
  images: string[];
  featured_image: string;
  options: IOption[];
  url: string;
  media: IMedia[];
  requires_selling_plan: boolean;
  selling_plan_groups: ISellingPlanGroup[];
}

export interface IVariant {
  id: number;
  title: string;
  option1: string;
  option2: string;
  option3: string | null;
  sku: string;
  requires_shipping: boolean;
  taxable: boolean;
  featured_image: IProductFeaturedImage;
  available: boolean;
  name: string;
  public_title: string;
  options: string[];
  price: number;
  weight: number;
  compare_at_price: number | null;
  inventory_management: string;
  barcode: string;
  featured_media: IFeaturedMedia;
  requires_selling_plan: boolean;
  selling_plan_allocations: ISellingPlanAllocation[];
}

interface ICartItemFeaturedImage {
  aspect_ratio: number;
  alt: string;
  height: number;
  url: string;
  width: number;
}

export interface IProductFeaturedImage {
  id: number;
  product_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  alt: string | null;
  width: number;
  height: number;
  src: string;
  variant_ids: number[];
}

export interface IFeaturedMedia {
  alt: string | null;
  id: number;
  position: number;
  preview_image: IPreviewImage;
}

export interface IPreviewImage {
  aspect_ratio: number;
  height: number;
  width: number;
  src: string;
}

export interface IOptionWithValue {
  name: string;
  value: string;
}

export interface ISellingPlanAllocation {
  price_adjustments: IPriceAdjustment[];
  price: number;
  compare_at_price: number | null;
  per_delivery_price: number;
  selling_plan_id: number;
  selling_plan_group_id: string;
}

export interface IPriceAdjustment {
  position: number;
  price: number;
}

export interface IOption {
  name: string;
  position: number;
  values: string[];
}

export interface IMedia {
  alt: string | null;
  id: number;
  position: number;
  preview_image: IPreviewImage;
  aspect_ratio: number;
  height: number;
  media_type: string;
  src: string;
  width: number;
}

export interface ISellingPlanGroup {
  id: string;
  name: string;
  options: ISellingPlanOption[];
  selling_plans: ISellingPlan[];
  app_id: string;
}

export interface ISellingPlanOption {
  name: string;
  position: number;
  values: string[];
}

export interface ISellingPlan {
  id: number;
  name: string;
  description: string | null;
  options: ISellingPlanOptionDetail[];
  recurring_deliveries: boolean;
  price_adjustments: IPriceAdjustmentDetail[];
}

export interface ISellingPlanOptionDetail {
  name: string;
  position: number;
  value: string;
}

export interface IPriceAdjustmentDetail {
  order_count: number | null;
  position: number;
  value_type: string;
  value: number;
}
