import xss from 'xss';
import { NextApiRequest, NextApiResponse } from 'next';

const sanitizeInput = (obj: any): any => {
  if (typeof obj === 'string') {
    return xss(obj);
  }
  if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach((key) => {
      obj[key] = sanitizeInput(obj[key]);
    });
  }
  return obj;
};

const sanitizeMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void,
) => {
  if (req.body) req.body = sanitizeInput(req.body);
  if (req.query) req.query = sanitizeInput(req.query);
  if (req.headers) req.headers = sanitizeInput(req.headers);
  next();
};

export default sanitizeMiddleware;
