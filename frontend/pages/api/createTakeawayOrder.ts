import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '@/lib/sanityClient';
import apiHandler from '@/lib/apiHandler';
import { errorMap } from '@/error/errorMap';
import { OrderValidator } from '@/components/common/validations/OrderValidator';

const createTakeawayOrder = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    const data = req.body;

    OrderValidator.validateAll(data);

    await sanityClient.create(data);

    return res.status(200).json({ message: 'Order created successfully' });
  } catch (error) {
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

export default apiHandler().post(createTakeawayOrder);
