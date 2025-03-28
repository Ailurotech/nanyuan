import { FaPhone, FaMapMarker, FaEnvelope } from 'react-icons/fa';
import { LocationInfo } from '@/types';

interface LocationHeaderProps {
  restaurantInfo: LocationInfo;
}

const LocationHeader = ({ restaurantInfo }: LocationHeaderProps) => (
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
);

export default LocationHeader;
