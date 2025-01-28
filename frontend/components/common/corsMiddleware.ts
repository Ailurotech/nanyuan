import middy from '@middy/core';
import httpCors from '@middy/http-cors';

export const withMiddlewares = (handler: any) => {
  return middy(handler).use(
    httpCors({
      origins: [process.env.CLIENT_BASE_URL || '*'],
      methods: 'GET,POST,OPTIONS',
      headers: 'Content-Type,Authorization',
    })
  );
};
