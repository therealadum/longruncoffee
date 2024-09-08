import { memo, MemoExoticComponent, useEffect, useMemo, useState } from "react";
import { ICartState, IProduct, IVariant } from "../../common/product";
import { RaceSeasonRoastUpsell } from "./components/RaceSeasonRoastUpsell";

enum ICartUpsellCampaignConditionEnum {
  "PRODUCT_VARIANT_IN_CART" = "PRODUCT_VARIANT_IN_CART",
  "PRODUCT_VARIANT_NOT_IN_CART" = "PRODUCT_VARIANT_NOT_IN_CART",
}
interface ICartUpsellCampaignCondition {
  enum: ICartUpsellCampaignConditionEnum;
  params: any;
}
export interface IFinalUpsellComponentProps {
  product: IProduct;
  variant: IVariant;
  cartState: ICartState;
  update: (
    updates: any,
    shouldOpen?: boolean,
    shouldSetCartState?: boolean,
    shouldSetLoading?: boolean,
  ) => Promise<void>;
  checkout: () => Promise<void>;
  loading: boolean;
  params: any;
}
interface ICartUpsellCampaign {
  name: string;
  priority: number;
  variant_id: number;
  product_hash: string;
  params: any;
  conditions: ICartUpsellCampaignCondition[];
  Component: React.MemoExoticComponent<
    ({ product, update, loading }: IFinalUpsellComponentProps) => JSX.Element
  >;
}

const upsell_campaigns: ICartUpsellCampaign[] = [
  {
    name: "Race Szn Roast - Not in cart",
    priority: 1,
    variant_id: 46827447222585,
    product_hash: "race-season-roast",
    Component: RaceSeasonRoastUpsell,
    params: {
      is_in_cart: false,
    },
    conditions: [
      {
        enum: ICartUpsellCampaignConditionEnum.PRODUCT_VARIANT_NOT_IN_CART,
        params: {
          variant_ids: [46827447222585, 49843237552441],
        },
      },
    ],
  },
  {
    name: "Race Szn Roast - Present in cart",
    priority: 2,
    variant_id: 46827447222585,
    product_hash: "race-season-roast",
    Component: RaceSeasonRoastUpsell,
    params: {
      is_in_cart: true,
    },
    conditions: [
      {
        enum: ICartUpsellCampaignConditionEnum.PRODUCT_VARIANT_IN_CART,
        params: {
          variant_ids: [46827447222585, 49843237552441],
        },
      },
    ],
  },
];

// build map of campaign product hash's
const product_hashes: string[] = [];
upsell_campaigns.forEach((usc) => {
  if (product_hashes.indexOf(usc.product_hash) == -1) {
    product_hashes.push(usc.product_hash);
  }
});

async function FetchUpsellProducts(
  product_hashes: string[],
  setUpsellProducts: React.Dispatch<
    React.SetStateAction<Map<string, IProduct>>
  >,
) {
  const promises: any = [];
  const newUpsellProducts: Map<string, IProduct> = new Map<string, IProduct>();
  product_hashes.forEach((prod_hash) => {
    promises.push(
      new Promise<void>(async (resolve, reject) => {
        const data = await fetch(`/products/${prod_hash}.js`);
        const product = await data.json();
        newUpsellProducts.set(prod_hash, product);
        resolve();
      }),
    );
  });
  await Promise.allSettled(promises);
  setUpsellProducts(newUpsellProducts);
}

function evaluateCondition(
  cartState: ICartState,
  condition: ICartUpsellCampaignCondition,
): boolean {
  let condition_passed = false;
  switch (condition.enum) {
    case ICartUpsellCampaignConditionEnum.PRODUCT_VARIANT_IN_CART:
      condition_passed = Boolean(
        cartState.items.find(
          (item) =>
            condition.params.variant_ids.indexOf(item.variant_id) !== -1,
        ),
      );
      break;
    case ICartUpsellCampaignConditionEnum.PRODUCT_VARIANT_NOT_IN_CART:
      condition_passed = Boolean(
        !cartState.items.find(
          (item) =>
            condition.params.variant_ids.indexOf(item.variant_id) !== -1,
        ),
      );
      break;
    default:
      console.error("Upsell condition enum not handled.");
      break;
  }
  return condition_passed;
}

export interface IFinalUpsell {
  product: IProduct;
  variant: IVariant;
  Component: MemoExoticComponent<
    ({ product, update, loading }: IFinalUpsellComponentProps) => JSX.Element
  >;
  priority: number;
  params: any;
  name: string;
}

interface IUseUpsellsProps {
  cartState: ICartState;
  loading: boolean;
}
export function useUpsells({ cartState, loading }: IUseUpsellsProps) {
  const [upsellProducts, setUpsellProducts] = useState<Map<string, IProduct>>(
    new Map<string, IProduct>(),
  );
  useEffect(() => {
    if (product_hashes.length && !upsellProducts.size) {
      FetchUpsellProducts(product_hashes, setUpsellProducts);
    }
  }, [product_hashes]);

  const upsells = useMemo(() => {
    if (!upsellProducts.size || loading) {
      return [];
    }
    const unordered: IFinalUpsell[] = [];
    upsell_campaigns.forEach((usc) => {
      // get relevant product
      const product = upsellProducts.get(usc.product_hash);
      if (!product || !product.available) {
        return;
      }
      // get relevant variant
      const variant = product.variants.find(
        (variant) => variant.id === usc.variant_id,
      );
      if (!variant || !variant.available) {
        return;
      }
      // check if conditions are met
      let condition_failed = false;
      usc.conditions.forEach((con) => {
        if (!evaluateCondition(cartState, con)) {
          condition_failed = true;
        }
      });
      if (!condition_failed) {
        unordered.push({
          product,
          variant,
          Component: usc.Component,
          priority: usc.priority,
          name: usc.name,
          params: usc.params,
        });
      }
    });
    return unordered.sort((a, b) => a.priority - b.priority);
  }, [cartState, upsell_campaigns, upsellProducts]);

  return upsells;
}
