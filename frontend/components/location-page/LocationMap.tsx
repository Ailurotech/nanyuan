const LocationMap = ({ address }: { address?: string }) => (
  <div className="w-full h-64 rounded-lg overflow-hidden">
    {address ? (
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
);

export default LocationMap;
