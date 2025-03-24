import mailgun from 'mailgun-js';

// Configuration for Mailgun
export const mailgunClient = mailgun({
  apiKey: process.env.MAILGUN_API_KEY as string,
  domain: process.env.MAILGUN_DOMAIN as string,
});
