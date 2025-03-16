import type { OrderDetails } from '@/types';

export const generateTakeawayOrderEmail = (
  orderDetails: OrderDetails,
  orderId: string,
): string => {
  const emailHtml = `
    <div style="background-color: #1E1E1E; padding:20px;">
      <div style="max-width:600px; margin:0 auto; background-color: black; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.1); padding:20px; font-family:Arial, sans-serif; color: #E4E4E4;">
        <div style="text-align:center;">
          <img src="cid:logo.png" alt="Nan Yuan Restaurant Logo" style="width:150px; margin-bottom:10px;">
        </div>
        <h1 style="text-align:center; color: #2E86C1; margin-bottom:10px;">Order Confirmation</h1>
        <p style="line-height:1.4;color:#E4E4E4;">Dear ${orderDetails.customerName},</p>
        <p style="line-height:1.4;color:#E4E4E4;">Thank you for your order. We're excited to get your food ready!</p>
        <h2 style="color:#2E86C1; padding-bottom:5px; margin-top:10px;">Order Details</h2>

        <p style="line-height:1.2; color:#E4E4E4;"><strong>Order ID:</strong> ${orderId}</p>
        <p style="line-height:1.2; color:#E4E4E4;"><strong>Phone:</strong> ${orderDetails.phone}</p>
        <p style="line-height:1.2; color:#E4E4E4;"><strong>Email:</strong> ${orderDetails.email}</p>
        <p style="line-height:1.2; color:#E4E4E4;"><strong>Pickup Date:</strong> ${orderDetails.date.replace('T', ' ')}</p>
        
        <table style="width:100%; border-collapse:collapse; margin-top:15px; background-color:#1E1E1E; border-radius:5px; overflow:hidden;">
          <thead>
            <tr style="background-color: black; color: #E4E4E4;">
              <th style="padding:10px; border:2px solid #E4E4E4; text-align:left; color:#ffff66">Item</th>
              <th style="padding:10px; border:2px solid #E4E4E4; text-align:left; color:#e76868">Quantity</th>
              <th style="padding:10px; border:2px solid #E4E4E4; text-align:left; color:#9fc5e8">Unit Price</th>
            </tr>
          </thead>
          <tbody>
            ${orderDetails.items
              .map(
                (item, index) =>
                  `<tr style="background-color: ${index % 2 === 0 ? '#1E1E1E' : 'black'};">
                    <td style="padding:10px; border:2px solid #E4E4E4; color:#E4E4E4;">${item.menuItemName}</td>
                    <td style="padding:10px; border:2px solid #E4E4E4; color:#E4E4E4;">${item.quantity}</td>
                    <td style="padding:10px; border:2px solid #E4E4E4; color:#E4E4E4;">${item.price}</td>
                  </tr>`,
              )
              .join('')}
          </tbody>
        </table>
        
        ${orderDetails.notes ? `<p style="line-height:1.2; margin-top:15px; color:#E4E4E4;"><strong>Special Requests/Notes:</strong> ${orderDetails.notes}</p>` : ''}

        <p style="line-height:1.2; color:#E4E4E4;"><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
        <p style="line-height:1.2; font-size:18px; margin-top:20px; color:#E4E4E4;"><strong>Total Price: $${orderDetails.totalPrice}</strong></p>
        
        <p style="margin-top:20px; color:#E4E4E4;">Best regards,<br/>The Nan Yuan Restaurant</p>
      </div>
    </div>
  `;

  return emailHtml;
};
