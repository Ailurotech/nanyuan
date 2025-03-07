import React from 'react';
import { useRouter } from 'next/router';

const SuccessPage = () => {
  const router = useRouter();
  const { source } = router.query;

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#191919]">
      <div className="bg-[#e5e7ea] p-4 flex flex-col gap-8 rounded-lg max-w-[500px]">
        {source === 'takeaway' ? (
          <h1 className="font-sans font-bold text-[28px] leading-[38.14px] text-black">
            <span className="block">Your payment was successful! </span>
            <span className="block">Thank you for ordering! </span>
          </h1>
        ) : source === 'book-a-table' ? (
          <h1 className="font-sans font-bold text-[28px] leading-[38.14px] text-black">
            <span className="block">Your table is booked!</span>
            <span className="block">Enjoy your meal! </span>
          </h1>
        ) : (
          <h1 className="font-sans font-bold text-[28px] leading-[38.14px] text-black">
            Success!
          </h1>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
