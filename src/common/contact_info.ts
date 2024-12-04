export function validateUSPhoneNumber(phoneNumber: string) {
  // Regular expression to match valid US phone number formats
  const phoneRegex = /^(?:\+1\s?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  return phoneRegex.test(phoneNumber);
}

export function formatUSPhoneNumber(phone: string) {
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

export function validateEmail(email: string) {
  // Regular expression to validate email address
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export async function identifyOnKlaviyo(email: string, phone: string) {
  while (typeof window.klaviyo === "undefined") {
    console.log("waiting for klaviyo");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  await window.klaviyo.identify({
    $email: email,
    $phone_number: formatUSPhoneNumber(phone),
  });
}
