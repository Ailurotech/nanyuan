import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Map from '../../components/common/Map';
import { OrderData } from '../../types';
import { sanityClient } from '../../lib/sanityClient';

interface LocationDetails {
  locationTitle: string;
  address: string;
  iframeSrc: string;
}

interface Props {
  locationDetails: LocationDetails;
}

function SuccessTakeaway({ locationDetails }: Props) {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderData | null>(null);

  useEffect(() => {
    const savedOrder = sessionStorage.getItem('orderDetails');
    if (savedOrder) {
      setOrderDetails(JSON.parse(savedOrder));
    } else {
      const timeout = setTimeout(() => router.push('/'), 2000);
      return () => clearTimeout(timeout);
    }
  }, [router]);

  console.log(orderDetails);

  if (!orderDetails) {
    return (
      <div className="bg-black w-full min-h-screen flex items-center justify-center text-yellow-500">
        <h1 className="text-4xl font-bold">Redirecting...</h1>
      </div>
    );
  }

  return (
    <div className="bg-black w-full min-h-screen py-10 text-yellow-500 pt-[20vh]">
      <div className="max-w-3xl mx-auto px-6 md:px-10 flex flex-col gap-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          🎉 Order Placed Successfully, {orderDetails.name}!
        </h1>

        <p className="text-center text-lg">
          Thank you for your order scheduled on{' '}
          <span className="font-bold">{orderDetails.date} at {orderDetails.time}</span>. 
          Please collect your order on time!
        </p>

        <div className="border-t border-gray-400 pt-4">
          <h2 className="text-2xl font-bold mb-2">Payment Method</h2>
          <p>
            {orderDetails.paymentMethod === 'offline'
              ? 'You have chosen to pay offline at the counter.'
              : 'Your payment has been successfully processed online.'}
          </p>
        </div>

        {orderDetails.items?.length > 0 && (
          <div className="border-t border-gray-400 pt-4">
            <h2 className="text-2xl font-bold mb-2">Order Summary</h2>
            <ul className="space-y-3">
              {orderDetails.items.map((item, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-800 p-3 rounded-md shadow-sm">
                  <span>{item.name}</span>
                  <span className="font-semibold">Qty: {item.quantity}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-right text-xl font-bold">
              Total: ${parseFloat(orderDetails.totalPrice.toString()).toFixed(2)}
            </p>
          </div>
        )}

        <Map
          title={locationDetails.locationTitle}
          address={locationDetails.address}
          iframeSrc={locationDetails.iframeSrc}
        />

        <button
          onClick={() => router.push('/')}
          className="mt-6 bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const query = `*[_type == "location"][0] {
    title,
    address,
    iframeSrc
  }`;

  const locationData = await sanityClient.fetch(query);

  return {
    props: {
      locationDetails: {
        locationTitle: locationData.title,
        address: locationData.address,
        iframeSrc: locationData.iframeSrc,
      },
    },
  };
};

export default SuccessTakeaway;
