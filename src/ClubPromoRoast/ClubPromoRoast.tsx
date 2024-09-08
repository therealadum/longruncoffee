import ClubPromoRoastInner from "./inner";

export function ClubPromoRoast() {
  const todayRightNow = new Date();
  const promotion_start_date = new Date("9/7/24");
  const promotion_active_date = new Date("9/2/24");
  const promotion_end_date = new Date("9/12/24");
  promotion_start_date.setHours(0, 0, 0, 0);
  promotion_active_date.setHours(0, 0, 0, 0);
  promotion_end_date.setHours(0, 0, 0, 0);

  if (
    todayRightNow > promotion_end_date ||
    todayRightNow < promotion_active_date
  ) {
    return null;
  }

  return (
    <div className="bg-white mb-12 lg:mb-0">
      <div className="overflow-hidden pt-32 sm:pt-14">
        <div className="bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative pb-16 pt-48 sm:pb-24">
              <div className="w-full md:w-1/2 md:pr-8 flex flex-col space-y-6 items-center justify-center">
                <h4 className="text-center font-accent text-xl text-neutral-50 max-w-sm">
                  Race Season Roast: Brown Butter Pumpkin
                </h4>
                <p className="text-center text-base text-neutral-100 max-w-sm">
                  Free with your first subscription order when you subscribe and
                  save between 9/7 and 9/12!
                </p>
                <ClubPromoRoastInner
                  promotion_end_date={promotion_end_date}
                  promotion_start_date={promotion_start_date}
                  title="Long Run Club Bonus"
                  description="Starting Saturday, September 7th, all Long Run Club sign ups get our Brown butter Pumpkin Roast free with their first shipment."
                />
              </div>

              <div className="absolute -top-32 left-1/2 -translate-x-1/2 transform md:top-6 md:translate-x-0">
                <div className="ml-24 flex min-w-max space-x-6 md:ml-3 lg:space-x-8">
                  <div className="flex space-x-6 md:flex-col md:space-x-0 md:space-y-6 lg:space-y-8">
                    <div className="flex-shrink-0">
                      <img
                        className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                        src="https://cdn.shopify.com/s/files/1/0761/6924/9081/files/club-promo-1.png?v=1725374873&width=500"
                        alt=""
                      />
                    </div>

                    <div className="mt-6 flex-shrink-0 md:mt-0">
                      <img
                        className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                        src="https://cdn.shopify.com/s/files/1/0761/6924/9081/files/club-promo-3.png?v=1725374873&width=500"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="flex space-x-6 md:-mt-20 md:flex-col md:space-x-0 md:space-y-6 lg:space-y-8">
                    <div className="flex-shrink-0">
                      <img
                        className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                        src="https://cdn.shopify.com/s/files/1/0761/6924/9081/files/club-promo-2.png?v=1725374873&width=500"
                        alt=""
                      />
                    </div>

                    <div className="mt-6 flex-shrink-0 md:mt-0">
                      <img
                        className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                        src="https://cdn.shopify.com/s/files/1/0761/6924/9081/files/club-promo-4.png?v=1725374873&width=500"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
