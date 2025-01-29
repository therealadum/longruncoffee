export interface IPlan {
  display_name: string;
  bag_min: number;
  perk_list: string[];
  discount: number;
  type: string;
}

export interface IPlans {
  base: IPlan;
  starter: IPlan;
  pro: IPlan;
  elite: IPlan;
}
