import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '@/lib/apiHandler';
import { sanityClient } from '@/lib/sanityClient';
import mailgun, { Attachment } from 'mailgun-js';
import fs from 'fs';
import path from 'path';

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
  inline?: Attachment;
}

const logoImgPath: string = path.join(process.cwd(), 'public', 'logo.png');

export default apiHandler().post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { type }: { type: 'TakeAwayOrder' | 'Reservation' } = req.body;

      if (!type) {
        return res.status(400).json({ error: 'Missing required field: type' });
      }

      let emailContent: EmailContent | null = null;

      if (type === 'TakeAwayOrder') {
        const { orderId }: { orderId: string } = req.body;

        // Validate the required fields
        if (!orderId) {
          return res
            .status(400)
            .json({ error: 'Missing required field: orderId' });
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
          { orderId },
        );

        // Define the email content
        emailContent = {
          from: `Nanyuan restaurant <${process.env.SENDER_EMAIL}>`,
          to: orderDetails.email,
          subject: 'Order Confirmation',
          html: `
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
          `,
        };
      } else if (type === 'Reservation') {
        const reservationInfo: ReservationInfo = req.body;

        // Define email content
        emailContent = {
          from: `Nanyuan restaurant <${process.env.SENDER_EMAIL}>`,
          to: reservationInfo.email,
          subject: 'Reservation Confirmation',
          html: `
          <div style="background-color:#1E1E1E; padding:20px;">
            <div style="max-width:600px; margin:0 auto; background-color:black; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.1); padding:20px; font-family:Arial, sans-serif; color:#E4E4E4;">
              <div style="text-align:center;">
                <img src="cid:logo.png" alt="Nan Yuan Restaurant Logo" style="width:150px; margin-bottom:10px;">
              </div>
              <h1 style="text-align:center; color:#2E86C1; margin-bottom:10px;">Reservation Confirmation</h1>
              <p style="line-height:1.6; color: #E4E4E4;">Dear ${reservationInfo.name},</p>
              <p style="line-height:1.6; color: #E4E4E4;">Thank you for choosing to dine with us! Your reservation has been confirmed.</p>
              
              <h2 style="color:#2E86C1; padding-bottom:10px; margin-top:20px;">Reservation Details</h2>
              <ul style="list-style:none; padding:0; margin:15px 0; background-color:#1E1E1E; padding:15px; border:2px solid #E4E4E4; border-radius:5px;">
                <li style="line-height:1.6; color:#E4E4E4;"><strong>Name:</strong> ${reservationInfo.name}</li>
                <li style="line-height:1.6; color:#E4E4E4;"><strong>Phone:</strong> ${reservationInfo.phone}</li>
                <li style="line-height:1.6; color:#E4E4E4;"><strong>Email:</strong> ${reservationInfo.email}</li>
                <li style="line-height:1.6; color:#E4E4E4;"><strong>Time:</strong> ${reservationInfo.time.replace('T', ' ')}</li>
                <li style="line-height:1.6; color:#E4E4E4;"><strong>Guests:</strong> ${reservationInfo.guests}</li>
                <li style="line-height:1.6; color:#E4E4E4;"><strong>Table Type:</strong> ${reservationInfo.table}</li>
                <li style="line-height:1.6; color:#E4E4E4;"><strong>Preference:</strong> ${reservationInfo.preference}</li>
                ${reservationInfo.notes ? `<li style="line-height:1.6; color:#E4E4E4;"><strong>Special Requests/Notes:</strong> ${reservationInfo.notes}</li>` : ''}
              </ul>
              <p style="margin-top:30px; color:#E4E4E4;">We look forward to hosting you.<br/><br/>Best regards,<br/>The Nan Yuan Restaurant</p>
            </div>
          </div>
          `,
        };
      } else {
        return res.status(400).json({ error: 'Invalid type provided.' });
      }

      // Check if the email content is defined
      if (!emailContent) {
        return res.status(400).json({ error: 'Email content is missing.' });
      }

      // Add logo image as Attachment
      let logoBuffer: Buffer;
      try {
        logoBuffer = fs.readFileSync(logoImgPath);
      } catch {
        return res
          .status(500)
          .json({ error: 'Failed to read logo image file.' });
      }

      const logoImg: Attachment = new mailgunClient.Attachment({
        data: logoBuffer,
        filename: 'logo.png',
      });

      // Add logo image to email content
      emailContent.inline = logoImg;

      // Send the email
      await mailgunClient.messages().send(emailContent);
      return res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error: unknown) {
      return res.status(500).json({ error: 'Failed to send email.' });
    }
  },
);
