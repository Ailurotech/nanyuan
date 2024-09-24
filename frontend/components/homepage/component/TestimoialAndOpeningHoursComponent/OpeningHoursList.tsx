import React from "react";

function OpeningHoursList({ openingHours }: { openingHours: string[] }) {
  return (
    <div>
      {openingHours.map((hour, index) => {
        const [day, time] = hour.split(/:(.+)/);

        return time ? (
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
        ) : (
          <div key={index} className="h-[40vh] text-[1.5rem] sm:text-[1.2em] xl:text-[1.8rem]">
            <span>Loading ,Please visit Google Maps for more info</span>
          </div>
        );
      })}
    </div>
  );
}

export default OpeningHoursList;
