import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: process.env.AWS_REGION });

export const handler = async (event: any) => {
  // Log the event for debugging purposes
  console.log('Event received:', event);

  // Parse the request body from the event object
  const body = JSON.parse(event.body);
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Name, email, and message are required.' }),
    };
  }

  const params = {
    Destination: {
      ToAddresses: [process.env.EMAIL_TO as string],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <html>
              <body>
                <h2>New Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>
              </body>
            </html>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "New Form Submission",
      },
    },
    Source: process.env.EMAIL_FROM as string,
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending email', error }),
    };
  }
};
