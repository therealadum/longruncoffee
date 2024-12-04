import { useEffect, useState } from "react";
import {
  formatUSPhoneNumber,
  identifyOnKlaviyo,
  validateEmail,
  validateUSPhoneNumber,
} from "../common/contact_info";
import { IProduct } from "../common/product";

interface IBackInStockNotificationSignUpProps {
  variant_id: string;
  product: IProduct | null;
}

interface ISignUpForBackInStockNotificationProps {
  email: string;
  phone: string;
  variant_id: string;
}

async function signUpForBackInStockNotification({
  email,
  phone,
  variant_id,
}: ISignUpForBackInStockNotificationProps) {
  const payload = {
    data: {
      type: "back-in-stock-subscription",
      attributes: {
        profile: {
          data: {
            type: "profile",
            attributes: {
              email: email,
              phone_number: phone,
            },
          },
        },
        channels: ["SMS", "EMAIL"],
      },
      relationships: {
        variant: {
          data: {
            type: "catalog-variant",
            id: `$shopify:::$default:::${variant_id}`,
          },
        },
      },
    },
  };

  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      revision: "2024-06-15",
    },
    body: JSON.stringify(payload),
  };

  await fetch(
    "https://a.klaviyo.com/client/back-in-stock-subscriptions?company_id=TqiYNr",
    requestOptions,
  )
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

export default function BackInStockNotificationSignUp({
  variant_id,
  product,
}: IBackInStockNotificationSignUpProps) {
  const storage_string = `LRC_BACK_IN_STOCK_NOTIFICATION_${product?.id}`;

  const [hasUserSubmittedContactForm, setHasUserSubmittedContactForm] =
    useState(Boolean(localStorage.getItem(storage_string)));
  const localStorageContactInfo = hasUserSubmittedContactForm
    ? // @ts-ignore
      JSON.parse(localStorage.getItem(storage_string))
    : null;
  const [contactForm, setContactForm] = useState(
    localStorageContactInfo
      ? localStorageContactInfo
      : {
          email: "",
          phone: "",
          variant_ids: [],
        },
  );
  const [emailAndPhoneAreSameAsStorage, setEmailAndPhoneAreSameAsStorage] =
    useState(
      localStorageContactInfo &&
        localStorageContactInfo.variant_ids.includes(variant_id) &&
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
        localStorageContactInfo.variant_ids.includes(variant_id) &&
        localStorageContactInfo.email &&
        localStorageContactInfo.email == contactForm.email &&
        localStorageContactInfo.phone &&
        localStorageContactInfo.phone == contactForm.phone,
    );
  }, [contactForm.email, contactForm.phone, variant_id]);

  const submitContactForm = async () => {
    await identifyOnKlaviyo(contactForm.email, contactForm.phone);
    await signUpForBackInStockNotification({
      email: contactForm.email,
      phone: formatUSPhoneNumber(contactForm.phone),
      variant_id,
    });
    setHasUserSubmittedContactForm(true);
    setEmailAndPhoneAreSameAsStorage(true);
    setContactForm((prev) => ({
      ...contactForm,
      variant_ids: [...prev.variant_ids, variant_id],
    }));
  };

  useEffect(() => {
    localStorage.setItem(storage_string, JSON.stringify(contactForm));
  }, [contactForm, storage_string]);

  if (!product || !variant_id) {
    return null;
  }

  return (
    <div className="pt-8">
      <h4 className="text-center text-2xl font-accent text-cyan-700">
        This sold out fast!
      </h4>
      <p className="text-base max-w-sm mx-auto text-center mt-2 text-gray-800">
        Enter your info below, and get notified when it's restocked.
      </p>
      <div className="flex flex-col">
        <div className="flex flex-col mt-8">
          <input type="hidden" name="contact[tags]" value="newsletter" />
          <input
            id="email"
            type="email"
            name="contact[email]"
            className="w-full p-2 border-neutral-300 text-base text-neutral-700 placeholder:text-neutral-500 rounded shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:placeholder:text-neutral-700"
            aria-required="true"
            autoCorrect="off"
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
            autoCapitalize="off"
            autoComplete="email"
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
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="tel"
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
              (hasUserSubmittedContactForm && emailAndPhoneAreSameAsStorage) ||
              !validateEmail(contactForm.email) ||
              !validateUSPhoneNumber(contactForm.phone)
            }
            className={`mt-6 inline-flex justify-center rounded-md p-3 text-base font-accent border ${
              hasUserSubmittedContactForm && emailAndPhoneAreSameAsStorage
                ? "cursor-not-allowed has-tooltip border-neutral-600 bg-neutral-100 text-neutral-400 hover:border-neutral-700 hover:text-neutral-500 hover:bg-neutral-200"
                : "border-tan-400 bg-tan-100 text-tan-600 hover:border-tan-700 hover:text-tan-700 hover:bg-tan-200 cursor-pointer"
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
    </div>
  );
}
