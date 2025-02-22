import { NextApiRequest, NextApiResponse } from "next";
import apiHandler from "@/lib/apiHandler";
import { sanityClient } from "@/lib/sanityClient";
import sgMail from "@sendgrid/mail";

// Sendgrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export default apiHandler().post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { orderId } = req.body;
    console.log("req.body", req.body);
    

    // Validate the required fields
    if (!orderId) {
      return res.status(400).json({ error: "Missing required field orderId" });
    }

    // Fetch order items
    let orderDetails = await sanityClient.fetch(
      `
        *[_type == "order" && orderId == $orderId][0] {
          customerName,
          email,
          totalPrice,
          items[] {
            menuItemName,
            price,
            quantity
          }
        }
      `,
      { orderId }
    );    
    
    // Define the email content
    const emailContent = {
      from: `${process.env.SENDGRID_SENDER_EMAIL}`,
      to: orderDetails.email,
      subject: 'Order Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
          <h1 style="color: #333;">Order Confirmation</h1>
          <p>Dear ${orderDetails.customerName},</p>
          <p>Thank you for your order. Your order has been successfully placed.</p>
          <p>Order ID: ${orderId}</p>
          <p>Order Items:</p>
          <table style="border-collapse: collapse; width: 100%; margin: 1em 0;">
            <thead>
              <tr>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Item</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Quantity</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderDetails.items
                .map(
                  (item: { menuItemName: string; quantity: number; price: number }) =>
                    `<tr>
                      <td style="border: 1px solid #ccc; padding: 8px; text-align: left;">${item.menuItemName}</td>
                      <td style="border: 1px solid #ccc; padding: 8px; text-align: left;">${item.quantity}</td>
                      <td style="border: 1px solid #ccc; padding: 8px; text-align: left;">$${item.price}</td>
                    </tr>`
                )
                .join('')}
            </tbody>
          </table>
          <p>Total Price: $${orderDetails.totalPrice}</p>
          <br>
          <br>

          <p>Best regards,</p>
          <p>The Nan Yuan Restaurant</p>
        </div>
      `,
    };

    // Send the email
    await sgMail.send(emailContent);

    return res.status(200).json({ message: 'Email sent successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send email.' });
  }
});