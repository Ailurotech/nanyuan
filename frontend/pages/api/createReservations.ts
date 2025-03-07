import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '@/lib/sanityClient';
import { ReservationValidator } from '@/components/common/validations/ReservationValidator';
import { errorMap } from '@/error/errorMap';

import apiHandler from '@/lib/apiHandler';

const createReservation = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = req.body;

    ReservationValidator.validateAll(data);
    await sanityClient.create(data);

    // Get table type
    const tableId: string = data.table._ref;
    const tableType: string = await sanityClient.fetch(
      `*[_type == "table" && _id == $tableId][0].type`,
      { tableId },
    );

    // Send request to api to send confirmation email
    const emailResponse = await fetch(
      `${process.env.SERVER_BASE_URL}/api/confirmationEmail`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          table: tableType + '-person Table',
          type: 'Reservation',
        }),
      },
    );

    if (!emailResponse.ok) {
      return res
        .status(500)
        .json({ error: 'Failed to send confirmation email' });
    }

    return res
      .status(200)
      .json({ message: 'Reservation created successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorName = error.name;
      const errorInfo = errorMap.get(errorName);
      return res
        .status(errorInfo?.status || 500)
        .json({ error: errorInfo?.message || 'Internal server error' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default apiHandler().post(createReservation);
