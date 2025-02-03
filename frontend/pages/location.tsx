import { FaPhone, FaMapMarker, FaEnvelope, FaUtensils } from 'react-icons/fa';
import { sanityClient } from "@/lib/sanityClient";
import { GetStaticProps } from "next";
import { LocationInfo } from "@/types";

interface LocationInfoProp {
  restaurantInfo: LocationInfo | null ;
}
export default function LocationPage({ restaurantInfo }:LocationInfoProp) {
  return(
    <div className="min-h-screen bg-black pt-44 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-orange-600 mb-12">
          <FaUtensils className="inline-block mr-2" />
          Contact Us
        </h1>

        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-2xl shadow-xl p-8">
          {/* basic info */}
          <div className="md:w-1/3 space-y-6 bg-orange-50 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold text-gray-800">Basic Info</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <FaMapMarker className="w-6 h-6 text-orange-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-700">Address</h3>
                  <p className="text-gray-600">{restaurantInfo?.address}</p>
                </div>
              </div>

              <div className="flex items-center">
                <FaPhone className="w-5 h-5 text-orange-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-700">Phone</h3>
                  <p className="text-gray-600">{restaurantInfo?.phone}</p>
                </div>
              </div>

              <div className="flex items-center">
                <FaEnvelope className="w-5 h-5 text-orange-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-700">Email</h3>
                  <p className="text-gray-600">{restaurantInfo?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* contact form */}
          <div className="md:w-2/3">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Please Enter Your Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Please Enter Your Phone Number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Please Enter Your Message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );  
};

export const getStaticProps: GetStaticProps<{ restaurantInfo: LocationInfo }> = async () => {
  const query = `*[_type == "restaurantInfo"][0]{
    address,
    phone,
    email
  }`;

  try {
    const restaurantInfo = await sanityClient.fetch<LocationInfo>(query);

    return {
      props: {
        restaurantInfo: restaurantInfo || { 
          address: "test",
          phone: "test",
          email: "test"
        }
      }
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        restaurantInfo: { 
          address: "",
          phone: "",
          email: ""
        }
      }
    };
  }
};