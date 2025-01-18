import * as yup from "yup";
import * as data from "./data.json";
import * as snickerdoodle_data from "./snickerdoodle.json";
import {
  ICartState,
  IProduct,
  ISubscriptionCartState,
  IVariant,
} from "../../common/product";
import { useEffect, useMemo, useState } from "react";
import { evaluateQuery } from "./operators";
import UpsellComponentMap from "./components";

export const IUpsellSchema = yup.object({
  id: yup.number(),
  name: yup.string(),
  product: yup.object({
    handle: yup.string(),
    variant_id: yup.string(),
  }),
  component: yup.object({
    name: yup.string(),
    params: yup.object(),
  }),
  conditions: yup.object(),
});

export type IUpsell = yup.InferType<typeof IUpsellSchema>;

const today = new Date();
const snickerdoodle_start = new Date(Date.UTC(2025, 0, 19, 6, 0, 0, 0));

const upsell_campaigns: IUpsell[] =
  today > snickerdoodle_start ? snickerdoodle_data.campaigns : data.campaigns;

const product_hashes: string[] = [];
upsell_campaigns.forEach((usc) => {
  if (usc.product.handle && product_hashes.indexOf(usc.product.handle) === -1) {
    product_hashes.push(usc.product.handle);
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

export interface IFinalUpsell {
  product: IProduct;
  variant: IVariant;
  component: {
    Element: any;
    params: any;
  };
  priority: number;
  name: string;
}

interface IUseUpsellsProps {
  cartState: ICartState;
  subscriptionCartState: ISubscriptionCartState;
  loading: boolean;
}
export function useUpsells({
  cartState,
  subscriptionCartState,
  loading,
}: IUseUpsellsProps) {
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
    upsell_campaigns.forEach((usc, priority) => {
      if (!usc.product.handle || !usc.product.variant_id) {
        return;
      }
      // get relevant product
      const product = upsellProducts.get(usc.product.handle);
      if (!product || !product.available) {
        return;
      }
      // get relevant variant
      const variant = product.variants.find(
        (variant) =>
          `gid://shopify/ProductVariant/${variant.id}` ==
          (usc.product.variant_id as string),
      );
      if (!variant || !variant.available) {
        return;
      }
      // check if conditions are met
      if (
        evaluateQuery(usc.conditions, {
          cartState,
          subscriptionCartState,
        })
      ) {
        // get the component from the list of components
        const Element = UpsellComponentMap.get(usc.component.name as string);
        if (Element) {
          unordered.push({
            product,
            variant,
            component: {
              Element,
              params: usc.component.params,
            },
            priority,
            name: usc.name as string,
          });
        }
      }
    });
    return unordered.sort((a, b) => a.priority - b.priority);
  }, [cartState, upsell_campaigns, upsellProducts]);

  return upsells;
}
