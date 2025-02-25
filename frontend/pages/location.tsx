import { FaPhone, FaMapMarker, FaEnvelope } from 'react-icons/fa';
import { sanityClient } from "@/lib/sanityClient";
import { GetStaticProps } from "next";
import { LocationInfo} from "@/types";
import { useState, useEffect } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';


const builder = imageUrlBuilder(sanityClient);
const FALLBACK_IMAGE = "/logo.png";

function urlFor(source?: { asset?: { _id: string; url?: string } }) {
  return source?.asset?.url ? builder.image(source).url() : FALLBACK_IMAGE;
}

interface LocationInfoProp {
  restaurantInfo: LocationInfo;
  error?: string; 
  intervalTime?: number
}

export default function LocationPage({ restaurantInfo, error, intervalTime = 5000 }: LocationInfoProp) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || !restaurantInfo?.images?.length) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % restaurantInfo.images.length);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [restaurantInfo?.images, isPaused, intervalTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await sanityClient.create({
        _type: "contact",
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
      });

      setSubmitted(true);
      setFormData({ name: "", phone: "", message: "" });
    } catch (error) {
      console.error("Submit failed", error);
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!restaurantInfo) return <div className="text-center text-gray-600">Failed to load data. Please try again later.</div>;

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-6 pt-44">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[600px]">
        {restaurantInfo.images?.length > 0 && (
          <div className="md:w-1/2 flex justify-center items-center p-4 relative">
            {restaurantInfo.images.map((img, index) => (
              <Image
                key={img.asset._id}
                src={urlFor(img)}
                alt={img.alt || `Location Image ${index + 1}`}
                className={`absolute w-full h-full object-cover rounded-lg transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                width={400}
                height={300}
                priority
              />
            ))}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="absolute bottom-4 right-4 bg-gray-800 text-white p-2 rounded-md z-10"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        )}

        {/* Info & Map */}
        <div className="md:w-1/2 flex flex-col p-6 h-auto md:h-full">
          {/* Basic info */}
          <div className="space-y-4 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">{restaurantInfo.title}</h2>
            
            <div className="flex items-start">
              <FaMapMarker className="w-5 h-5 text-orange-600 mr-3 mt-1" />
              <div>
                <h3 className="font-medium text-gray-700">Address</h3>
                <p className="text-gray-600">{restaurantInfo.address}</p>
              </div>
            </div>

            <div className="flex items-center">
              <FaPhone className="w-5 h-5 text-orange-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-700">Phone</h3>
                <p className="text-gray-600">{restaurantInfo.phone}</p>
              </div>
            </div>

            <div className="flex items-center">
              <FaEnvelope className="w-5 h-5 text-orange-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-700">Email</h3>
                <p className="text-gray-600">{restaurantInfo.email}</p>
              </div>
            </div>
          </div>

          {/* Map */}
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

      {/* Contact Us Form */}
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-xl p-6 mt-32 h-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h3>

        {submitted ? (
          <p className="text-green-600">Your message has been submitted and we will contact you as soon as possible</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <textarea
              name="message"
              placeholder="Message..."
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              rows={4}
              required
            />
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </form>
        )}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<{ restaurantInfo: LocationInfo }> = async () => {
  const query = `*[_type == "location"][0]{
    title,
    address,
    phone,
    email,
    images[] { 
      _type,
      asset->{
        _id,
        url
      },
      alt
    }
  }`;

  try {
    const restaurantInfo = await sanityClient.fetch<LocationInfo>(query);
    return {
      props: {
        restaurantInfo: restaurantInfo 
      }
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        restaurantInfo: { 
          title: "",
          address: "",
          phone: "",
          email: "",
          images: []
        },
        error: "Failed to load restaurant information.",
      }
    };
  }
};
