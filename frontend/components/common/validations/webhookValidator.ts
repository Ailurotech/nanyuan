import { BaseValidator } from './BaseValidator';
import { ValidationError } from '@/error/validationError';
import { MissingFieldError } from '@/error/missingFieldError';
import { stripe } from '@/lib/stripeClient';
import { webhookErrorTest } from '@/test/apiTest/error';

export const WebhookValidator = {
  ...BaseValidator,

  validateAndConstructEvent: (rawBody: Buffer, signature?: string) => {
    if (!signature) {
      throw new MissingFieldError('Missing Stripe Signature');
    }
    try {
      return stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      );
    } catch (error) {
      throw new ValidationError('Invalid Stripe Signature111');
    }
  },

  validateWebhookEventStructure: (event: any) => {
    if (!event || typeof event !== 'object') {
      throw new ValidationError('Invalid webhook payload');
    }

    BaseValidator.validateRequiredFields(event, ['id', 'type', 'data']);

    if (!event.data.object) {
      throw new MissingFieldError('Invalid event format: missing data.object');
    }
  },

  validateMetadataExists: (metadata: any) => {
    if (!metadata || typeof metadata !== 'object') {
      throw new MissingFieldError('Missing metadata in event');
    }
  },

  validateCheckoutSessionCompleted: (event: any) => {
    if (event.type !== 'checkout.session.completed') return;

    WebhookValidator.validateMetadataExists(event.data.object.metadata);

    if (!event.data.object.metadata.orderId) {
      throw new MissingFieldError('Missing orderId in event metadata');
    }
  },

  validateAll: (rawBody: Buffer, signature?: string) => {
    const event = WebhookValidator.validateAndConstructEvent(
      rawBody,
      signature,
    );
    WebhookValidator.validateRequiredFields(event, ['id', 'type', 'data']);
    WebhookValidator.validateWebhookEventStructure(event);

    switch (event.type) {
      case 'checkout.session.completed':
        WebhookValidator.validateCheckoutSessionCompleted(event);
      case 'checkout.session.expired':
        break;
      default:
        throw new ValidationError(`Unhandled event type: ${event.type}`);
    }

    return event;
  },
};
