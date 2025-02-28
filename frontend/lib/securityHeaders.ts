import helmet from 'helmet';
import { NextApiRequest, NextApiResponse } from 'next';

const securityHeaders = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void,
) => {
  helmet({
    contentSecurityPolicy: false,
  })(req as any, res as any, next);
};

export default securityHeaders;
