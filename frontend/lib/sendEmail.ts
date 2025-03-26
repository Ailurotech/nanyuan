import { Attachment } from 'mailgun-js';
import { readFile } from 'fs/promises';
import path from 'path';
import { mailgunClient } from '@/lib/mailgunClient';
import { ReadFileError } from '@/error/readFileError';
import type { EmailContent } from '@/types';

const logoImgPath: string = path.join(process.cwd(), 'public', 'logo.png');

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> => {
  const logoBuffer: Buffer = await readFile(logoImgPath).catch(() => {
    throw new ReadFileError('Failed to read logo image file');
  });

  const logoImg: Attachment = new mailgunClient.Attachment({
    data: logoBuffer,
    filename: 'logo.png',
  });

  const emailContent: EmailContent = {
    from: `Nanyuan restaurant <${process.env.SENDER_EMAIL}>`,
    to,
    subject,
    html,
    inline: logoImg,
  };

  await mailgunClient
    .messages()
    .send(emailContent)
    .catch(() => {
      throw new Error('Failed to send email');
    });
};
