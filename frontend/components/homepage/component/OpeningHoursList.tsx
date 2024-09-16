import React from "react";

interface OpeningHoursListProps {
  openingHours: string[];
}

const OpeningHoursList: React.FC<OpeningHoursListProps> = ({ openingHours }) => {
  return (
    <>
      {openingHours.length > 0 ? (
        openingHours.map((hour, index) => {
          const [day, time] = hour.split(/:(.+)/);
            return (
            <div key={index} className="flex justify-between text-[1.5rem] sm:text-[1.2em] xl:text-[1.8rem]">
              <span className="font-bold">{day}:</span>
              <span className="text-right">
                {time.split(",").map((t, i) => (
                  <span key={i} className="block">
                    {t}
                  </span>
                ))}
              </span>
            </div>
          );
        })
      ) : (
        <p className="text-[1.9rem] sm:text-[1.5rem] xl:text-[2rem]">Loading...</p>
      )}
    </>
  );
};

export default OpeningHoursList;
