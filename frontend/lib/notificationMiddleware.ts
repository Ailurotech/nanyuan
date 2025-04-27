import { NextApiRequest, NextApiResponse } from 'next';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({
  region: process.env.AWS_REGION || 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const withNotification = (handler: Function) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handler(req, res);
    } catch (error) {
      try {
        const command = new PublishCommand({
          Message: `Stripe Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          PhoneNumber: process.env.NOTIFICATION_PHONE_NUMBER,
        });
        
        await snsClient.send(command);
      } catch (notificationError) {
        console.error('Failed to send notification:', notificationError);
      }
      
      throw error;
    }
  };
}; 