import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CartDrawer } from "./CartDrawer";

export default {
  title: "Components/CartDrawer",
  component: CartDrawer,
} as ComponentMeta<typeof CartDrawer>;

const Template: ComponentStory<typeof CartDrawer> = (args) => (
  <CartDrawer {...args} />
);

export const CartDrawerBase = Template.bind({});
const args = {
  container: {
    attributes: {
      getNamedItem: (str: string) => ({
        value:
          "%7B%22note%22%3A%22%22%2C%22attributes%22%3A%7B%7D%2C%22original_total_price%22%3A998%2C%22total_price%22%3A998%2C%22total_discount%22%3A0%2C%22total_weight%22%3A304.3605%2C%22item_count%22%3A8%2C%22items%22%3A%5B%7B%22id%22%3A48056421482809%2C%22properties%22%3A%7B%7D%2C%22quantity%22%3A1%2C%22variant_id%22%3A48056421482809%2C%22key%22%3A%2248056421482809%3A338dfa3677dac86c7a02b20430fff0b0%22%2C%22title%22%3A%22Long%20Run%20Brand%20Sticker%22%2C%22price%22%3A0%2C%22original_price%22%3A0%2C%22discounted_price%22%3A0%2C%22line_price%22%3A0%2C%22original_line_price%22%3A0%2C%22total_discount%22%3A0%2C%22discounts%22%3A%5B%5D%2C%22sku%22%3Anull%2C%22grams%22%3A0%2C%22vendor%22%3A%22Long%20Run%20Coffee%22%2C%22taxable%22%3Atrue%2C%22product_id%22%3A9082015514937%2C%22product_has_only_default_variant%22%3Atrue%2C%22gift_card%22%3Afalse%2C%22final_price%22%3A0%2C%22final_line_price%22%3A0%2C%22url%22%3A%22%2Fproducts%2Ffree-gift-lrc-brand-sticker%3Fvariant%3D48056421482809%22%2C%22featured_image%22%3A%7B%22aspect_ratio%22%3A1%2C%22alt%22%3A%22Long%20Run%20Brand%20Sticker%22%2C%22height%22%3A5000%2C%22url%22%3A%22%2F%2Flongruncoffee.com%2Fcdn%2Fshop%2Ffiles%2FLRCSticker_33.png%3Fv%3D1707440763%22%2C%22width%22%3A5000%7D%2C%22image%22%3A%22%2F%2Flongruncoffee.com%2Fcdn%2Fshop%2Ffiles%2FLRCSticker_33.png%3Fv%3D1707440763%22%2C%22handle%22%3A%22free-gift-lrc-brand-sticker%22%2C%22requires_shipping%22%3Atrue%2C%22product_type%22%3A%22Gift%22%2C%22product_title%22%3A%22Long%20Run%20Brand%20Sticker%22%2C%22product_description%22%3A%22%C2%A0Designed%20to%20inspire%20and%20motivate%2C%20our%20brand%20is%20a%20reminder%20of%20your%20identity%20as%20an%20athlete.%C2%A0%5CnFuel%20Your%20Passion%2C%20and%20slap%20this%20sticker%20on%20mugs%2C%20water%20bottles%2C%20laptops%2C%20and%20more.%5Cn%5CnDurable%2C%20High%20Quality%20Vinyl%20Sticker%5Cn%5CnWater%20Proof%20and%20Dishwasher%20Safe%5Cn%22%2C%22variant_title%22%3Anull%2C%22variant_options%22%3A%5B%22Default%20Title%22%5D%2C%22options_with_values%22%3A%5B%7B%22name%22%3A%22Title%22%2C%22value%22%3A%22Default%20Title%22%7D%5D%2C%22line_level_discount_allocations%22%3A%5B%5D%2C%22line_level_total_discount%22%3A0%7D%2C%7B%22id%22%3A48137979953465%2C%22properties%22%3A%7B%7D%2C%22quantity%22%3A1%2C%22variant_id%22%3A48137979953465%2C%22key%22%3A%2248137979953465%3A3478907b35b56bcb3151a5de5dc41061%22%2C%22title%22%3A%22Experimental%20Flavor%20-%20Candy%20Bar%22%2C%22price%22%3A0%2C%22original_price%22%3A0%2C%22discounted_price%22%3A0%2C%22line_price%22%3A0%2C%22original_line_price%22%3A0%2C%22total_discount%22%3A0%2C%22discounts%22%3A%5B%5D%2C%22sku%22%3A%22%22%2C%22grams%22%3A45%2C%22vendor%22%3A%22Long%20Run%20Coffee%22%2C%22taxable%22%3Atrue%2C%22product_id%22%3A9101642531129%2C%22product_has_only_default_variant%22%3Atrue%2C%22gift_card%22%3Afalse%2C%22final_price%22%3A0%2C%22final_line_price%22%3A0%2C%22url%22%3A%22%2Fproducts%2Fexperimental-flavor-3%3Fvariant%3D48137979953465%22%2C%22featured_image%22%3A%7B%22aspect_ratio%22%3A1%2C%22alt%22%3A%22Long%20Run%20Coffee%20Experimental%20Electrolyte%20Infused%20Coffee%20Flavor%22%2C%22height%22%3A5000%2C%22url%22%3A%22%2F%2Flongruncoffee.com%2Fcdn%2Fshop%2Ffiles%2FExperimental_c81be21c-79c2-4620-ab4a-11ecbbf7005d.png%3Fv%3D1709340024%22%2C%22width%22%3A5000%7D%2C%22image%22%3A%22%2F%2Flongruncoffee.com%2Fcdn%2Fshop%2Ffiles%2FExperimental_c81be21c-79c2-4620-ab4a-11ecbbf7005d.png%3Fv%3D1709340024%22%2C%22handle%22%3A%22experimental-flavor-3%22%2C%22requires_shipping%22%3Atrue%2C%22product_type%22%3A%22Gift%22%2C%22product_title%22%3A%22Experimental%20Flavor%20-%20Candy%20Bar%22%2C%22product_description%22%3A%22Every%20club%20member%20shipment%20includes%20two%20free%20experimental%20electrolyte%20infused%20coffee%20samples.%20Club%20members%20get%20to%20test%20new%20roasts%20%26%20flavors%2C%20and%20decide%20what%20LRC's%20next%20products%20will%20be.%5CnEach%20experimental%20flavor%20pack%20will%20brew%20one%20full%20pot%20of%20coffee.%C2%A0%22%2C%22variant_title%22%3Anull%2C%22variant_options%22%3A%5B%22Default%20Title%22%5D%2C%22options_with_values%22%3A%5B%7B%22name%22%3A%22Title%22%2C%22value%22%3A%22Default%20Title%22%7D%5D%2C%22line_level_discount_allocations%22%3A%5B%5D%2C%22line_level_total_discount%22%3A0%7D%2C%7B%22id%22%3A48138029531449%2C%22properties%22%3A%7B%7D%2C%22quantity%22%3A1%2C%22variant_id%22%3A48138029531449%2C%22key%22%3A%2248138029531449%3Af53e87a6aec26df35f8b4d7c10206fcc%22%2C%22title%22%3A%22Experimental%20-%20Night%20Run%20Dark%20Roast%22%2C%22price%22%3A0%2C%22original_price%22%3A0%2C%22discounted_price%22%3A0%2C%22line_price%22%3A0%2C%22original_line_price%22%3A0%2C%22total_discount%22%3A0%2C%22discounts%22%3A%5B%5D%2C%22sku%22%3Anull%2C%22grams%22%3A45%2C%22vendor%22%3A%22Long%20Run%20Coffee%22%2C%22taxable%22%3Atrue%2C%22product_id%22%3A9101656523065%2C%22product_has_only_default_variant%22%3Atrue%2C%22gift_card%22%3Afalse%2C%22final_price%22%3A0%2C%22final_line_price%22%3A0%2C%22url%22%3A%22%2Fproducts%2Fexperimental-flavor-4%3Fvariant%3D48138029531449%22%2C%22featured_image%22%3A%7B%22aspect_ratio%22%3A1%2C%22alt%22%3A%22Long%20Run%20Coffee%20Experimental%20Electrolyte%20Infused%20Coffee%20Flavor%22%2C%22height%22%3A5000%2C%22url%22%3A%22%2F%2Flongruncoffee.com%2Fcdn%2Fshop%2Ffiles%2FExperimental.png%3Fv%3D1709339997%22%2C%22width%22%3A5000%7D%2C%22image%22%3A%22%2F%2Flongruncoffee.com%2Fcdn%2Fshop%2Ffiles%2FExperimental.png%3Fv%3D1709339997%22%2C%22handle%22%3A%22experimental-flavor-4%22%2C%22requires_shipping%22%3Atrue%2C%22product_type%22%3A%22Gift%22%2C%22product_title%22%3A%22Experimental%20-%20Night%20Run%20Dark%20Roast%22%2C%22product_description%22%3A%22Every%20club%20member%20shipment%20includes%20two%20free%20experimental%20electrolyte%20infused%20coffee%20samples.%20Club%20members%20get%20to%20test%20new%20roasts%20%26%20flavors%2C%20and%20decide%20what%20LRC's%20next%20products%20will%20be.%5CnEach%20experimental%20flavor%20pack%20will%20brew%20one%20full%20pot%20of%20coffee.%22%2C%22variant_title%22%3Anull%2C%22variant_options%22%3A%5B%22Default%20Title%22%5D%2C%22options_with_values%22%3A%5B%7B%22name%22%3A%22Title%22%2C%22value%22%3A%22Default%20Title%22%7D%5D%2C%22line_level_discount_allocations%22%3A%5B%5D%2C%22line_level_total_discount%22%3A0%7D%2C%7B%22id%22%3A49364569588025%2C%22properties%22%3A%7B%7D%2C%22quantity%22%3A1%2C%22variant_id%22%3A49364569588025%2C%22key%22%3A%2249364569588025%3A92185e3e2e1c54967fa57bf795511ac6%22%2C%22title%22%3A%22Free%20LRC%20x%20BOCO%20Run%20Hat%22%2C%22price%22%3A0%2C%22original_price%22%3A0%2C%22discounted_price%22%3A0%2C%22line_price%22%3A0%2C%22original_line_price%22%3A0%2C%22total_discount%22%3A0%2C%22discounts%22%3A%5B%5D%2C%22sku%22%3A%22%22%2C%22grams%22%3A91%2C%22vendor%22%3A%22Long%20Run%20Coffee%22%2C%22taxable%22%3Atrue%2C%22product_id%22%3A9464803852601%2C%22product_has_only_default_variant%22%3Atrue%2C%22gift_card%22%3Afalse%2C%22final_price%22%3A0%2C%22final_line_price%22%3A0%2C%22url%22%3A%22%2Fproducts%2Ffree-lrc-x-boco-run-hat%3Fvariant%3D49364569588025%22%2C%22featured_image%22%3A%7B%22aspect_ratio%22%3A1%2C%22alt%22%3A%22Free%20LRC%20x%20BOCO%20Run%20Hat%22%2C%22height%22%3A5000%2C%22url%22%3A%22%2F%2Flongruncoffee.com%2Fcdn%2Fshop%2Ffiles%2F1_6046bc15-7204-4fae-8f45-e73a333e0543.png%3Fv%3D1707394954%22%2C%22width%22%3A5000%7D%2C%22image%22%3A%22%2F%2Flongruncoffee.com%2Fcdn%2Fshop%2Ffiles%2F1_6046bc15-7204-4fae-8f45-e73a333e0543.png%3Fv%3D1707394954%22%2C%22handle%22%3A%22free-lrc-x-boco-run-hat%22%2C%22requires_shipping%22%3Atrue%2C%22product_type%22%3A%22Gift%22%2C%22product_title%22%3A%22Free%20LRC%20x%20BOCO%20Run%20Hat%22%2C%22product_description%22%3A%22Elevate%20your%20run%20with%20our%20breathable%20run%20hat%20collaboration%20with%20BOCO.%20Stay%20cool%20and%20motivated%20every%20mile%20with%20this%20runner's%20staple%2C%20designed%C2%A0to%20Fuel%20Your%20Passion.%5Cn%5CnLightweight%C2%A0wicking%C2%A0polyester%5CnMachine%20Washable%5Cn%5Cn%22%2C%22variant_title%22%3Anull%2C%22variant_options%22%3A%5B%22Default%20Title%22%5D%2C%22options_with_values%22%3A%5B%7B%22name%22%3A%22Title%22%2C%22value%22%3A%22Default%20Title%22%7D%5D%2C%22line_level_discount_allocations%22%3A%5B%5D%2C%22line_level_total_discount%22%3A0%7D%2C%7B%22id%22%3A49568854671673%2C%22properties%22%3A%7B%7D%2C%22quantity%22%3A1%2C%22variant_id%22%3A49568854671673%2C%22key%22%3A%2249568854671673%3Ab3bf13760593ec64a3b7fe705ebcc1c6%22%2C%22title%22%3A%22Experimental%20Flavor%20-%20Trail%20Mix%22%2C%22price%22%3A0%2C%22original_price%22%3A0%2C%22discounted_price%22%3A0%2C%22line_price%22%3A0%2C%22original_line_price%22%3A0%2C%22total_discount%22%3A0%2C%22discounts%22%3A%5B%5D%2C%22sku%22%3A%22%22%2C%22grams%22%3A45%2C%22vendor%22%3A%22Long%20Run%20Coffee%22%2C%22taxable%22%3Atrue%2C%22product_id%22%3A9516401033529%2C%22product_has_only_default_variant%22%3Atrue%2C%22gift_card%22%3Afalse%2C%22final_price%22%3A0%2C%22final_line_price%22%3A0%2C%22url%22%3A%22%2Fproducts%2Fexperimental-flavor-trail-mix-1%3Fvariant%3D49568854671673%22%2C%22featured_image%22%3A%7B%22aspect_ratio%22%3A1%2C%22alt%22%3A%22Long%20Run%20Coffee%20Experimental%20Electrolyte%20Infused%20Coffee%20Flavor%22%2C%22height%22%3A5000%2C%22url%22%3A%22%2F%2Flongruncoffee.com%2Fcdn%2Fshop%2Ffiles%2FExperimental_9b4aac8d-134f-4bef-b98c-5d2c35bc1097.png%3Fv%3D1714574495%22%2C%22width%22%3A5000%7D%2C%22image%22%3A%22%2F%2Flongruncoffee.com%2Fcdn%2Fshop%2Ffiles%2FExperimental_9b4aac8d-134f-4bef-b98c-5d2c35bc1097.png%3Fv%3D1714574495%22%2C%22handle%22%3A%22experimental-flavor-trail-mix-1%22%2C%22requires_shipping%22%3Atrue%2C%22product_type%22%3A%22Gift%22%2C%22product_title%22%3A%22Experimental%20Flavor%20-%20Trail%20Mix%22%2C%22product_description%22%3A%22Every%20club%20member%20shipment%20includes%20two%20free%20experimental%20electrolyte%20infused%20coffee%20samples.%20Club%20members%20get%20to%20test%20new%20roasts%20%26%20flavors%2C%20and%20decide%20what%20LRC's%20next%20products%20will%20be.%5CnEach%20experimental%20flavor%20pack%20will%20brew%20one%20full%20pot%20of%20coffee.%C2%A0%5Cn%22%2C%22variant_title%22%3Anull%2C%22variant_options%22%3A%5B%22Default%20Title%22%5D%2C%22options_with_values%22%3A%5B%7B%22name%22%3A%22Title%22%2C%22value%22%3A%22Default%20Title%22%7D%5D%2C%22line_level_discount_allocations%22%3A%5B%5D%2C%22line_level_total_discount%22%3A0%7D%2C%7B%22id%22%3A49182276747577%2C%22properties%22%3A%7B%7D%2C%22quantity%22%3A1%2C%22variant_id%22%3A49182276747577%2C%22key%22%3A%2249182276747577%3A0a3f56dfbc1a11e50b8268e21bf3d830%22%2C%22title%22%3A%22Free%20Travel%20Set%22%2C%22price%22%3A0%2C%22original_price%22%3A0%2C%22discounted_price%22%3A0%2C%22line_price%22%3A0%2C%22original_line_price%22%3A0%2C%22total_discount%22%3A0%2C%22discounts%22%3A%5B%5D%2C%22sku%22%3A%22%22%2C%22grams%22%3A0%2C%22vendor%22%3A%22Long%20Run%20Coffee%22%2C%22taxable%22%3Atrue%2C%22product_id%22%3A9416531542329%2C%22product_has_only_default_variant%22%3Atrue%2C%22gift_card%22%3Afalse%2C%22final_price%22%3A0%2C%22final_line_price%22%3A0%2C%22url%22%3A%22%2Fproducts%2Ffree-travel-set%3Fvariant%3D49182276747577%22%2C%22featured_image%22%3A%7B%22aspect_ratio%22%3A1%2C%22alt%22%3A%22Free%20Travel%20Set%22%2C%22height%22%3A2000%2C%22url%22%3A%22%2F%2Flongruncoffee.com%2Fcdn%2Fshop%2Ffiles%2FTravel_Set_-_Junk_Miles_and_Banana.png%3Fv%3D1727046479%22%2C%22width%22%3A2000%7D%2C%22image%22%3A%22%2F%2Flongruncoffee.com%2Fcdn%2Fshop%2Ffiles%2FTravel_Set_-_Junk_Miles_and_Banana.png%3Fv%3D1727046479%22%2C%22handle%22%3A%22free-travel-set%22%2C%22requires_shipping%22%3Atrue%2C%22product_type%22%3A%22Gift%22%2C%22product_title%22%3A%22Free%20Travel%20Set%22%2C%22product_description%22%3A%22The%20travel%20set%20includes%20a%204oz%20of%20our%20best%20selling%20electrolyte%20infused%20coffee%20(Junk%20Miles%20-%20Medium%20Roast)%2C%20and%20a%201.5oz%20sample%20of%20our%20banana%20bread%20flavor.%5Cn%22%2C%22variant_title%22%3Anull%2C%22variant_options%22%3A%5B%22Default%20Title%22%5D%2C%22options_with_values%22%3A%5B%7B%22name%22%3A%22Title%22%2C%22value%22%3A%22Default%20Title%22%7D%5D%2C%22line_level_discount_allocations%22%3A%5B%5D%2C%22line_level_total_discount%22%3A0%7D%2C%7B%22id%22%3A48100885922105%2C%22properties%22%3A%7B%7D%2C%22quantity%22%3A1%2C%22variant_id%22%3A48100885922105%2C%22key%22%3A%2248100885922105%3A400328d442fdf14bea7c9480230c021c%22%2C%22title%22%3A%22Banana%20Flavored%20Travel%20Pack%22%2C%22price%22%3A499%2C%22original_price%22%3A499%2C%22discounted_price%22%3A499%2C%22line_price%22%3A499%2C%22original_line_price%22%3A499%2C%22total_discount%22%3A0%2C%22discounts%22%3A%5B%5D%2C%22sku%22%3A%22%22%2C%22grams%22%3A45%2C%22vendor%22%3A%22Long%20Run%20Coffee%22%2C%22taxable%22%3Atrue%2C%22product_id%22%3A9093552668985%2C%22product_has_only_default_variant%22%3Atrue%2C%22gift_card%22%3Afalse%2C%22final_price%22%3A499%2C%22final_line_price%22%3A499%2C%22url%22%3A%22%2Fproducts%2Fbanana-flavored-travel-pack%3Fvariant%3D48100885922105%22%2C%22featured_image%22%3A%7B%22aspect_ratio%22%3A1%2C%22alt%22%3A%22Banana%20flavored%20electrolyte%20infused%20coffee%20for%20runners%22%2C%22height%22%3A5000%2C%22url%22%3A%22%2F%2Flongruncoffee.com%2Fcdn%2Fshop%2Ffiles%2F3_67f224f4-6e20-424a-be68-7539526b0f8c.png%3Fv%3D1708307996%22%2C%22width%22%3A5000%7D%2C%22image%22%3A%22%2F%2Flongruncoffee.com%2Fcdn%2Fshop%2Ffiles%2F3_67f224f4-6e20-424a-be68-7539526b0f8c.png%3Fv%3D1708307996%22%2C%22handle%22%3A%22banana-flavored-travel-pack%22%2C%22requires_shipping%22%3Atrue%2C%22product_type%22%3A%22%22%2C%22product_title%22%3A%22Banana%20Flavored%20Travel%20Pack%22%2C%22product_description%22%3A%22%5CnThis%201.5oz%20serving%20of%20our%20best-selling%C2%A0Banana%C2%A0flavor%C2%A0will%C2%A0brew%20one%20pot%20of%20coffee.%20Perfect%20for%20traveling%2C%20gifting%20to%20a%20friend%2C%20or%20trying%20one%20of%20our%20best-selling%20flavors!%5CnThere's%20nothing%20better%20than%20crossing%20the%20finish%20line%2C%20earning%20your%20medal%2C%20experiencing%20true%C2%A0fulfillment...%E2%80%A6%20and%20getting%20your%20free%20banana.%20Relive%20your%20post%20race%20euphoria%20with%20this%20banana%20flavored%C2%A0coffee%20-%20infused%20with%20electrolytes%20and%20accomplishment.%C2%A0%22%2C%22variant_title%22%3Anull%2C%22variant_options%22%3A%5B%22Default%20Title%22%5D%2C%22options_with_values%22%3A%5B%7B%22name%22%3A%22Title%22%2C%22value%22%3A%22Default%20Title%22%7D%5D%2C%22line_level_discount_allocations%22%3A%5B%5D%2C%22line_level_total_discount%22%3A0%7D%2C%7B%22id%22%3A48100867473721%2C%22properties%22%3A%7B%7D%2C%22quantity%22%3A1%2C%22variant_id%22%3A48100867473721%2C%22key%22%3A%2248100867473721%3Ae4744bf29efbef11712a0aefef283209%22%2C%22title%22%3A%22PB%26amp%3BJ%20Flavored%20Travel%20Pack%22%2C%22price%22%3A499%2C%22original_price%22%3A499%2C%22discounted_price%22%3A499%2C%22line_price%22%3A499%2C%22original_line_price%22%3A499%2C%22total_discount%22%3A0%2C%22discounts%22%3A%5B%5D%2C%22sku%22%3A%22%22%2C%22grams%22%3A32%2C%22vendor%22%3A%22Long%20Run%20Coffee%22%2C%22taxable%22%3Atrue%2C%22product_id%22%3A9093544804665%2C%22product_has_only_default_variant%22%3Atrue%2C%22gift_card%22%3Afalse%2C%22final_price%22%3A499%2C%22final_line_price%22%3A499%2C%22url%22%3A%22%2Fproducts%2Fpb-j-flavored-travel-pack%3Fvariant%3D48100867473721%22%2C%22featured_image%22%3A%7B%22aspect_ratio%22%3A1%2C%22alt%22%3A%22PB%26J%20Flavored%20Electrolyte%20Infused%20Coffee%22%2C%22height%22%3A5000%2C%22url%22%3A%22%2F%2Flongruncoffee.com%2Fcdn%2Fshop%2Ffiles%2F2_d9eb941e-3295-4a71-b160-88fda157400a.png%3Fv%3D1708307706%22%2C%22width%22%3A5000%7D%2C%22image%22%3A%22%2F%2Flongruncoffee.com%2Fcdn%2Fshop%2Ffiles%2F2_d9eb941e-3295-4a71-b160-88fda157400a.png%3Fv%3D1708307706%22%2C%22handle%22%3A%22pb-j-flavored-travel-pack%22%2C%22requires_shipping%22%3Atrue%2C%22product_type%22%3A%22%22%2C%22product_title%22%3A%22PB%26J%20Flavored%20Travel%20Pack%22%2C%22product_description%22%3A%22This%201.5oz%20serving%20of%20our%20best-selling%20PB%26J%20flavor%C2%A0will%C2%A0brew%20one%20pot%20of%20coffee.%20Perfect%20for%20traveling%2C%20gifting%20to%20a%20friend%2C%20or%20trying%20one%20of%20our%20best-selling%20flavors!%5CnCoffee%20%26%20Running%20-%20a%20perfect%20match%2C%20rivaling%20even%20the%20classic%20bond%20of%20Peanut%20Butter%20%26%20Jelly.%20Combing%20all%20four%3F%20Unbeatable.%20Infused%20with%20both%20electrolytes%20and%20nostalgia%2C%20our%20PB%26J%20flavored%20coffee%20will%20Fuel%20Your%20Passion%20and%20performance.%C2%A0%22%2C%22variant_title%22%3Anull%2C%22variant_options%22%3A%5B%22Default%20Title%22%5D%2C%22options_with_values%22%3A%5B%7B%22name%22%3A%22Title%22%2C%22value%22%3A%22Default%20Title%22%7D%5D%2C%22line_level_discount_allocations%22%3A%5B%5D%2C%22line_level_total_discount%22%3A0%7D%5D%2C%22requires_shipping%22%3Atrue%2C%22currency%22%3A%22USD%22%2C%22items_subtotal_price%22%3A998%2C%22cart_level_discount_applications%22%3A%5B%5D%2C%22checkout_charge_amount%22%3A998%7D",
      }),
    },
  },
};

CartDrawerBase.args = args;
