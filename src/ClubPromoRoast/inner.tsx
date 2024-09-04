import { useState, useEffect } from "react";
import { Fragment } from "react/jsx-runtime";
import { CountdownTimer } from "../CountdownTimer/CountdownTimer";

function validateUSPhoneNumber(phoneNumber: string) {
  // Regular expression to match valid US phone number formats
  const phoneRegex = /^(?:\+1\s?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  return phoneRegex.test(phoneNumber);
}

function formatUSPhoneNumber(phone: string) {
  // Remove any non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Check if the cleaned number has 10 digits
  if (cleaned.length === 10) {
    const country = "+1";
    const area = cleaned.substring(0, 3);
    const firstPart = cleaned.substring(3, 6);
    const secondPart = cleaned.substring(6, 10);

    // Format the number
    return `${country} (${area}) ${firstPart}-${secondPart}`;
  }

  // If the number does not have 10 digits, return an error message
  return "Invalid US phone number";
}

function validateEmail(email: string) {
  // Regular expression to validate email address
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

async function identifyOnKlaviyo(email: string, phone: string) {
  while (typeof window.klaviyo === "undefined") {
    console.log("waiting for klaviyo");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  await window.klaviyo.identify({
    $email: email,
    $phone_number: formatUSPhoneNumber(phone),
  });
  window.klaviyo.push(["track", "submit_contact_form_for_pdp_promotion", {}]);
}

interface IClubPromoRoastProps {
  title: string;
  description: string;
  promotion_start_date: Date;
  promotion_end_date: Date;
}

export default function ClubPromoRoastInner({
  title,
  description,
  promotion_start_date,
  promotion_end_date,
}: IClubPromoRoastProps) {
  const todayRightNow = new Date();

  const isPromotionActive =
    promotion_start_date < todayRightNow && promotion_end_date > todayRightNow;
  const isPromotionPast = todayRightNow > promotion_end_date;
  const [hasUserSubmittedContactForm, setHasUserSubmittedContactForm] =
    useState(Boolean(localStorage.getItem("LRC_PROMO_NOTIFY_SIGNUP")));
  const localStorageContactInfo = hasUserSubmittedContactForm
    ? // @ts-ignore
      JSON.parse(localStorage.getItem("LRC_PROMO_NOTIFY_SIGNUP"))
    : null;
  const [contactForm, setContactForm] = useState(
    localStorageContactInfo
      ? localStorageContactInfo
      : {
          email: "",
          phone: "",
        },
  );
  const [emailAndPhoneAreSameAsStorage, setEmailAndPhoneAreSameAsStorage] =
    useState(
      localStorageContactInfo &&
        localStorageContactInfo.email &&
        localStorageContactInfo.email == contactForm.email &&
        localStorageContactInfo.phone &&
        localStorageContactInfo.phone == contactForm.phone,
    );
  const [hasChangedSinceLastValidation, setHasChangedSinceLastValidation] =
    useState({
      email: false,
      phone: false,
    });

  useEffect(() => {
    setEmailAndPhoneAreSameAsStorage(
      localStorageContactInfo &&
        localStorageContactInfo.email &&
        localStorageContactInfo.email == contactForm.email &&
        localStorageContactInfo.phone &&
        localStorageContactInfo.phone == contactForm.phone,
    );
  }, [contactForm.email, contactForm.phone]);

  const submitContactForm = async () => {
    await identifyOnKlaviyo(contactForm.email, contactForm.phone);
    setHasUserSubmittedContactForm(true);
    setEmailAndPhoneAreSameAsStorage(true);
    localStorage.setItem(
      "LRC_PROMO_NOTIFY_SIGNUP",
      JSON.stringify(contactForm),
    );
  };

  return (
    <div className="bg-neutral-50 w-full flex flex-col px-4 py-6 rounded">
      {isPromotionActive ? (
        <Fragment>
          <h4 className="text-center text-2xl font-accent text-neutral-700">
            {title}
          </h4>
          <p className="my-6 text-lg text-neutral-700 self-center text-center max-w-md leading-[1.9rem]">
            {description}
          </p>
          <CountdownTimer date={promotion_end_date} />
          <a
            href="/collections/subscribe-save"
            className="mt-6 w-full inline-flex justify-center rounded-md p-3 self-center text-base font-accent border border-tan-600 bg-tan-100 text-tan-600 hover:border-tan-700 hover:text-tan-700 hover:bg-tan-200 max-w-md"
          >
            Join the Long Run Club
          </a>
        </Fragment>
      ) : isPromotionPast ? (
        <h4 className="text-center text-2xl font-accent text-neutral-700 py-20">
          Club Member Exclusive
        </h4>
      ) : (
        <Fragment>
          <h4 className="text-center text-2xl font-accent text-neutral-700">
            Coming Soon
          </h4>
          <div className="flex flex-col">
            <div className="flex flex-col mt-8">
              <input type="hidden" name="contact[tags]" value="newsletter" />
              <input
                id="email"
                type="email"
                name="contact[email]"
                className="w-full p-2 border-neutral-300 text-base text-neutral-700 placeholder:text-neutral-500 rounded shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:placeholder:text-neutral-700"
                aria-required="true"
                // @ts-ignore
                autocorrect="off"
                value={contactForm.email}
                onBlur={() => {
                  setHasChangedSinceLastValidation({
                    ...hasChangedSinceLastValidation,
                    email: false,
                  });
                }}
                onChange={(e) => {
                  setContactForm({
                    ...contactForm,
                    email: e.target.value,
                  });
                  setHasChangedSinceLastValidation({
                    ...hasChangedSinceLastValidation,
                    email: true,
                  });
                }}
                autocapitalize="off"
                autocomplete="email"
                placeholder="Email"
                required
              />
              {contactForm.email.length &&
              !validateEmail(contactForm.email) &&
              !hasChangedSinceLastValidation.email ? (
                <p className="text-tan-900 text-sm lg:text-base mt-1 mb-2">
                  Please enter a valid email address.
                </p>
              ) : null}
              <input
                id="phone"
                type="tel"
                name="contact[note]"
                className="mt-4 w-full p-2 border-neutral-300 text-base text-neutral-700 placeholder:text-neutral-500 rounded shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:placeholder:text-neutral-700"
                aria-required="true"
                // @ts-ignore
                autocorrect="off"
                autocapitalize="off"
                autocomplete="tel"
                value={contactForm.phone}
                onBlur={() => {
                  setHasChangedSinceLastValidation({
                    ...hasChangedSinceLastValidation,
                    phone: false,
                  });
                }}
                onChange={(e) => {
                  setContactForm({
                    ...contactForm,
                    phone: e.target.value,
                  });
                  setHasChangedSinceLastValidation({
                    ...hasChangedSinceLastValidation,
                    phone: true,
                  });
                }}
                placeholder="Phone"
                required
              />
              {contactForm.phone.length &&
              !validateUSPhoneNumber(contactForm.phone) &&
              !hasChangedSinceLastValidation.phone ? (
                <p className="text-tan-900 text-sm lg:text-base mt-1 mb-2">
                  Please enter a valid phone number.
                </p>
              ) : null}
              <button
                type="submit"
                onClick={async () => submitContactForm()}
                disabled={
                  (hasUserSubmittedContactForm &&
                    emailAndPhoneAreSameAsStorage) ||
                  !validateEmail(contactForm.email) ||
                  !validateUSPhoneNumber(contactForm.phone)
                }
                className={`mt-6 inline-flex justify-center rounded-md p-3 text-base font-accent ${
                  hasUserSubmittedContactForm && emailAndPhoneAreSameAsStorage
                    ? "cursor-not-allowed has-tooltip border-neutral-600 bg-neutral-100 text-neutral-400 hover:border-neutral-700 hover:text-neutral-500 hover:bg-neutral-200"
                    : "border-tan-600 bg-tan-100 text-tan-600 hover:border-tan-700 hover:text-tan-700 hover:bg-tan-200"
                }`}
                name="commit"
                id="Subscribe"
                aria-label="{{ 'newsletter.button_label' | t }}"
              >
                Notify Me
              </button>
            </div>
            {hasUserSubmittedContactForm && emailAndPhoneAreSameAsStorage ? (
              <p className="max-w-xs text-center self-center mt-4 text-neutral-500 text-sm lg:text-base">
                Form successfully submitted. We will let you know when this is
                available!
              </p>
            ) : null}
          </div>
        </Fragment>
      )}
    </div>
  );
}
