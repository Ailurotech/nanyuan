import { FaPhone, FaMapMarker, FaEnvelope } from 'react-icons/fa';
import { sanityClient } from '@/lib/sanityClient';
import { GetStaticProps } from 'next';
import { LocationInfo } from '@/types';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';
import { debounce } from 'lodash';
import * as Sentry from '@sentry/react';

// Error logging service
export function logErrorToService(error: Error) {
  if (process.env.NODE_ENV === 'production') {
    // Send error to Sentry
    Sentry.captureException(error);
  } else {
    // For local development, log to console
    console.error('Logging error to service:', error);
  }
}

interface LocationInfoProp {
  restaurantInfo: LocationInfo;
  error?: string;
  intervalTime?: number;
}

export default function LocationPage({
  restaurantInfo,
  intervalTime = 5000,
}: LocationInfoProp) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const builder = useRef(imageUrlBuilder(sanityClient)).current; // Store builder instance in useRef
  const urlFor = useCallback(
    (source?: { asset?: { _id: string; url?: string } }) => {
      return source?.asset?.url
        ? builder.image(source).url()
        : 'public/logo.png';
    },
    [builder], // Only recreate urlFor if builder changes (which in this case should not)
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!restaurantInfo?.images?.length) return;

    // Clear any existing interval before setting a new one
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set a new interval to update the image index
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % restaurantInfo.images.length);
    }, intervalTime);

    // Cleanup interval on component unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [restaurantInfo?.images.length, intervalTime]);

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };
  // handle user input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * debouncedSubmit is a function that delays the execution of the submit logic to avoid
   * multiple calls to the submit function within a short period. It’s useful for optimizing
   * performance when submitting forms or handling user input in rapid succession (e.g., typing).
   * This function makes sure that the submit action is executed only after a specified delay
   * has passed since the last call.
   * 
   * @param {Function} submit - The actual function that will be called after the debounce delay.
   * @param {number} delay - The debounce delay in milliseconds. Default is 500ms.
   * 
   * Example Usage:
   * const handleSubmit = debouncedSubmit(submitForm, 500);
   * handleSubmit(); // Will only trigger submitForm() after 500ms delay.
   */
  const debouncedSubmit = useMemo(
    () =>
      debounce(async (data) => {
        try {
          await sanityClient.create({ _type: 'contact', ...data });
          setSubmitted(true);
          setFormData({ name: '', phone: '', message: '' });
        } catch (error) {
          setErrorMessage('Something went wrong. Please try again later.');
        } finally {
          setIsSubmitting(false);
        }
      }, 500),
    [],
  );

  // Phone number validation
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateFormData = () => {
    if (!formData.name || !formData.phone || !formData.message) {
      setErrorMessage('All fields are required.');
      setIsSubmitting(false);
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      setErrorMessage('Invalid phone number format.');
      setIsSubmitting(false);
      return;
    }

    return true;
  };

  // Handle the actual form submission
  const handleFormSubmit = async () => {
    debouncedSubmit(formData);
  };

  // Main handleSubmit function refactored for clarity and separation of concerns
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    // Validate the form data
    const isValid = validateFormData();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Call function to submit the data
      await handleFormSubmit();
    } catch (error) {
      if (error instanceof Error) {
        logErrorToService(error);
        setErrorMessage(
          error.message || 'Something went wrong. Please try again.',
        );
      } else {
        logErrorToService(new Error('An unknown error occurred'));
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!restaurantInfo)
    return (
      <div className="text-center text-gray-600">
        Failed to load data. Please try again later.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#191919] flex flex-col justify-center items-center p-6 pt-44">
      <div className="max-w-6xl w-full bg-[#e5e7ea] shadow-lg rounded-[4rem] overflow-hidden flex flex-col md:flex-row h-auto md:h-[600px]">
        {restaurantInfo.images?.length > 0 && (
          <div className="md:w-1/2 flex justify-center items-center relative">
            {restaurantInfo.images.map((img, index) => (
              <Image
                key={img.asset._id}
                src={urlFor(img)}
                alt={img.alt || `Location Image ${index + 1}`}
                className={`absolute w-full h-full md:p-[5%] rounded-[4rem] object-cover transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                width={400}
                height={300}
                priority={index === 0}
              />
            ))}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {restaurantInfo.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentImageIndex ? 'bg-black' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="md:w-1/2 flex flex-col p-6 h-auto md:h-full">
          <div className="space-y-4 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {restaurantInfo.title}
            </h2>

            <div className="flex items-start">
              <FaMapMarker className="w-5 h-5 text-yellow-400 mr-3 mt-1" />
              <div>
                <h3 className="font-medium text-gray-700">Address</h3>
                <p className="text-gray-600">{restaurantInfo.address}</p>
              </div>
            </div>

            <div className="flex items-center">
              <FaPhone className="w-5 h-5 text-yellow-400 mr-3" />
              <div>
                <h3 className="font-medium text-gray-700">Phone</h3>
                <p className="text-gray-600">{restaurantInfo.phone}</p>
              </div>
            </div>

            <div className="flex items-center">
              <FaEnvelope className="w-5 h-5 text-yellow-400 mr-3" />
              <div>
                <h3 className="font-medium text-gray-700">Email</h3>
                <p className="text-gray-600">{restaurantInfo.email}</p>
              </div>
            </div>
          </div>

          <div className="w-full h-64 rounded-lg overflow-hidden h-auto md:h-full">
            {restaurantInfo.address ? (
              <iframe
                title="Restaurant Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3269.1121338369776!2d138.58890197600473!3d-34.978855877407206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ab0cff8dd2fe379%3A0xf3aaa6ce8f150aa9!2sNan%20Yuan!5e0!3m2!1sen!2sau!4v1740442666990!5m2!1sen!2sau"
                width="100%"
                height="100%"
                style={{ border: '0' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <div className="text-center text-gray-500">Map not available</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#e5e7ea] rounded-lg p-4 mt-32 w-[500px]">
        <h1 className="text-xl font-bold">Contact Us</h1>{' '}
        <h3 className="text-xs pb-4">
          Please fill in your details to contact us
        </h3>
        {submitted ? (
          <p className="text-green-600">
            Your message has been submitted, and we will contact you as soon as
            possible.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="font-bold">Name</label>{' '}
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <label className="font-bold">Phone Number</label>{' '}
            <div className="flex border rounded-md overflow-hidden">
              <span className="bg-gray-100 px-3 flex items-center text-gray-700">
                +61
              </span>
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full flex-1 px-4 py-2 border rounded-md"
                required
              />
            </div>
            <label className="font-bold">Message</label>{' '}
            <textarea
              name="message"
              placeholder="Message..."
              value={formData.message}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
              rows={4}
              required
            />
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
    </div>
  );
}

export const getStaticProps: GetStaticProps<{
  restaurantInfo: LocationInfo;
}> = async () => {
  const query = `*[_type == "location"][0]{title, address, phone, email, images[]{asset->{_id, url}, alt}}`;
  try {
    const restaurantInfo = await sanityClient.fetch<LocationInfo>(query);
    return { props: { restaurantInfo } };
  } catch {
    return {
      props: {
        restaurantInfo: {
          title: '',
          address: '',
          phone: '',
          email: '',
          images: [],
        },
      },
    };
  }
};
