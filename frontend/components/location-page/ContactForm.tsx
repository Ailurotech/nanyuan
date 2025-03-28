import { ControlledInput } from '@/components/common/ControlledInput';
import { ControlledTestArea } from '@/components/common/ControlledTestArea';
import { Button, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { contactFormSchema, ContactFormData } from '@/utils/validators';
import axios from 'axios';

export default function ContactForm() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await axios.post('/api/createContactUs', data);
      reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };

  return (
    <section className="bg-[#e5e7ea] rounded-lg p-4 mt-32 w-[500px]">
      <div className="flex flex-col space-y-1 mb-6">
        <Text fontSize="xl" fontWeight="bold">
          Contact Us
        </Text>
        <Text fontSize="xs">Please fill in your details to contact us</Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <ControlledInput label="Name" control={control} name="name" />

        <ControlledInput label="Phone Number" control={control} name="phone" />

        <ControlledTestArea
          label="Message"
          control={control}
          name="message"
          rows={4}
          placeholder="Enter your message here..."
        />

        <Button
          marginTop="2rem"
          colorScheme="orange"
          variant="solid"
          type="submit"
          backgroundColor="#facc16"
          padding="0.6rem"
          borderRadius={5}
          fontSize="small"
          fontWeight="600"
          className={clsx({
            'opacity-50 cursor-not-allowed': isSubmitting,
          })}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </section>
  );
}
