import { OrderData } from "@/types";

export const checkout_stripe = async (orderData: OrderData): Promise<boolean> => {
  try {
    const response = await fetch("/api/checkout_stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(` Stripe API request failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (data?.url) {
      window.location.href = data.url; 
      return true;
    } else {
      throw new Error("No URL returned from Stripe API.");
    }
  } catch (error) {
    console.error(" Stripe payment failed:", error);
    return false;
  }
};
