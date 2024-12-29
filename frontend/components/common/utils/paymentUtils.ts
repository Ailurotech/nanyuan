export const fetchStripeSession = async (
  orderList: any[],
  totalPrice: string,
  id: string
): Promise<string> => {
  const apiUrl = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL; 
  
  if (!apiUrl) {
    throw new Error('Environment variable NEXT_PUBLIC_STRIPE_CHECKOUT_URL is missing');
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orderList,
      totalPrice,
      id,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create Stripe checkout session.');
  }

  const { sessionId } = await response.json();
  return sessionId;
};
