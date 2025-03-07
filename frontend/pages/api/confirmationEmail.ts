import { NextApiRequest, NextApiResponse } from "next";
import apiHandler from "@/lib/apiHandler";
import { sanityClient } from "@/lib/sanityClient";
import mailgun from "mailgun-js";

// Configuration for Mailgun
const mailgunClient = mailgun({
  apiKey: process.env.MAILGUN_API_KEY as string,
  domain: process.env.MAILGUN_DOMAIN as string,
});

// type for orderDetails
interface OrderDetails {
  customerName: string;
  email: string;
  phone: string;
  date: string;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  notes: string;
  items: {
    menuItemName: string;
    price: number;
    quantity: number;
  }[];
}

// type for reservationInfo
interface ReservationInfo {
  name: string;
  phone: string;
  email: string;
  time: string;
  guests: string;
  table: string;
  preference: string;
  notes: string;
}

// type for EmailContent
interface EmailContent {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export default apiHandler().post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { type }: { type: "TakeAwayOrder" | "Reservation" } = req.body;

    if (!type) {
      return res.status(400).json({ error: "Missing required field: type" });
    }

    let emailContent: EmailContent | null = null;

    if (type === "TakeAwayOrder") {
      const { orderId }: { orderId: string } = req.body;
      
      // Validate the required fields
      if (!orderId) {
        return res.status(400).json({ error: "Missing required field: orderId" });
      }

      // Fetch order items
      const orderDetails: OrderDetails = await sanityClient.fetch(
        `
          *[_type == "order" && orderId == $orderId][0] {
            customerName,
            email,
            phone,
            date,
            totalPrice,
            paymentMethod,
            status,
            notes,
            items[] {
              menuItemName,
              price,
              quantity
            },
          }
        `,
        { orderId }
      );    
      
      // Define the email content
      emailContent = {
        from: `Nanyuan restaurant <${process.env.SENDER_EMAIL}>`,
        to: orderDetails.email,
        subject: 'Order Confirmation',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
            <h1 style="color: #333;">Order Confirmation</h1>
            <p>Dear ${orderDetails.customerName},</p>
            <p>Thank you for your order. Your order has been successfully placed.</p>
            <p><strong>Order ID: ${orderId}</strong></p>
            <p>Phone Number: ${orderDetails.phone}</p>
            <p>Email: ${orderDetails.email}</p>
            <p>Pickup Date: ${orderDetails.date.replace('T', ' ')}</p>
            <p>Order Items:</p>
            <table style="border-collapse: collapse; width: 100%; margin: 1em 0;">
              <thead>
                <tr>
                  <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Item</th>
                  <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Quantity</th>
                  <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Unit Price</th>
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
            ${orderDetails.notes !== '' ? `<p>Special Requests or Notes: ${orderDetails.notes}</p>` : ''}
            <p>Payment Method: ${orderDetails.paymentMethod}</p>
            <br>
            <p>Total Price: $${orderDetails.totalPrice}</p>
            <br>
            <br>

            <p>Best regards,</p>
            <p>The Nan Yuan Restaurant</p>
          </div>
        `,
      };      
    } else if (type === "Reservation") {
      const reservationInfo: ReservationInfo = req.body;

      // Define email content
      emailContent = {
        from: `Nanyuan restaurant <${process.env.SENDER_EMAIL}>`,
        to: reservationInfo.email,
        subject: 'Reservation Confirmation',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
            <h1 style="color: #333;">Reservation Confirmation</h1>
            <p>Dear ${reservationInfo.name},</p>
            <p>Thank you for your reservation. Your reservation has been successfully placed.</p>
            <p>Reservation Details:</p>
            <ul>
              <li>Name: ${reservationInfo.name}</li>
              <li>Phone Number: ${reservationInfo.phone}</li>
              <li>Email: ${reservationInfo.email}</li>
              <li>Time: ${reservationInfo.time.replace("T", " ")}</li>
              <li>Guests: ${reservationInfo.guests}</li>
              <li>The type of table assigned to this reservation: ${reservationInfo.table}</li>
              <li>Preference: ${reservationInfo.preference}</li>
              ${reservationInfo.notes ? `<li>Special Requests or Notes: ${reservationInfo.notes}</li>` : ""}
            </ul>
            <br>
            <br>

            <p>Best regards,</p>
            <p>The Nan Yuan Restaurant</p>
          </div>
        `,
      };
    }
    
    // Check if the email content is defined
    if (!emailContent) {
      return res.status(400).json({ error: 'Email content is missing.' });
    }

    // Send the email
    await mailgunClient.messages().send(emailContent);
    return res.status(200).json({ message: 'Email sent successfully.' });
  } catch (error: unknown) {
    return res.status(500).json({ error: 'Failed to send email.' });
  }
});