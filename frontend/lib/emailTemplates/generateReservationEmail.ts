import type { ReservationInfo } from '@/types';

export const generateReservationEmail = (
  reservationInfo: ReservationInfo,
): string => {
  const emailHtml = `
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
  `;

  return emailHtml;
};
