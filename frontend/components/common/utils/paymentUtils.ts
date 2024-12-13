export const triggerAll = async (trigger: () => Promise<boolean>) => {
    if (!(await trigger())) {
      throw new Error('Please fill out all required fields.');
    }
  };

  
  export const fetchStripeSession = async (orderList: any[], totalPrice: string): Promise<string> => {
    const response = await fetch(
      'https://qfsl0v3js4.execute-api.ap-southeast-2.amazonaws.com/dev/api/create-checkout-session',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderList, totalPrice }),
      }
    );
  
    if (!response.ok) {
      throw new Error('Failed to create Stripe checkout session.');
    }
  
    const { sessionId } = await response.json();
    return sessionId;
  };
  