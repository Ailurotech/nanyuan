import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, ContactFormData } from '@/utils/validators';
import { useState } from 'react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
        reset();
      } else {
        setErrorMessage(
          result.message || 'Something went wrong. Please try again.',
        );
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="bg-[#e5e7ea] rounded-lg p-4 mt-32 w-[500px]">
      <h1 className="text-xl font-bold">Contact Us</h1>
      <h3 className="text-xs pb-4">
        Please fill in your details to contact us
      </h3>

      {submitted ? (
        <p className="text-green-600">
          Your message has been submitted successfully!
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="font-bold">Name</label>
          <input
            {...register('name')}
            placeholder="Your Name"
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.name && <p className="text-red-600">{errors.name.message}</p>}

          <label className="font-bold">Phone Number</label>
          <input
            {...register('phone')}
            placeholder="Phone"
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.phone && (
            <p className="text-red-600">{errors.phone.message}</p>
          )}

          <label className="font-bold">Message</label>
          <textarea
            {...register('message')}
            placeholder="Message..."
            className="w-full px-4 py-2 border rounded-md"
            rows={4}
          />
          {errors.message && (
            <p className="text-red-600">{errors.message.message}</p>
          )}

          {errorMessage && <p className="text-red-600">{errorMessage}</p>}

          <button
            type="submit"
            className={`w-full px-4 py-2 bg-yellow-500 text-white font-bold rounded-md ${
              isSubmitting ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  );
}
