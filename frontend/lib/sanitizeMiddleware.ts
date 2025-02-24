import xss from 'xss';
import { NextApiRequest, NextApiResponse } from 'next';

const XssClean = (obj: any): any => {
  if (typeof obj === 'string') {
    return xss(obj);
  }
  if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach((key) => {
      obj[key] = XssClean(obj[key]);
    });
  }
  return obj;
};

const sanitizeMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void,
) => {
  if (req.body) req.body = XssClean(req.body);
  if (req.query) req.query = XssClean(req.query);
  if (req.headers) req.headers = XssClean(req.headers);
  next();
};

export default sanitizeMiddleware;
