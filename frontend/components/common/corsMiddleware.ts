import middy from '@middy/core';
import httpCors from '@middy/http-cors';

export const withMiddlewares = (handler: any) => {
  return middy(handler).use(
    httpCors({
      origins: [process.env.CLIENT_BASE_URL || '*'],
      methods: 'POST',
      headers: 'Content-Type,Authorization',
    }),
  );
};
