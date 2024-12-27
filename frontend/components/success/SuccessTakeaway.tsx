import { useRouter } from 'next/router';
import Map from '@/components/common/Map';

function SuccessTakeaway({ locationDetails }: { locationDetails: any }) {
  const router = useRouter();

  const orderDetails =
    typeof window !== 'undefined'
      ? JSON.parse(sessionStorage.getItem('orderDetails') || 'null')
      : null;

  if (!orderDetails) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return (
      <div className="bg-black w-full min-h-screen h-auto pt-[20vh] text-yellow-500">
        <h1 className="text-center text-[40px] font-bold">Redirecting...</h1>
      </div>
    );
  }

  return (
    <div className="bg-black w-full min-h-screen h-auto pt-[20vh] text-yellow-500">
      <div className="mx-auto w-[60%] h-auto flex flex-col gap-x-[8%] md:flex-row">
        <div className="flex-1">
          <h1 className="text-[40px] capitalize font-bold">
            Order Placed Successfully, {orderDetails.name}!
          </h1>
          <p className="mt-4 text-md">
            We appreciate your pick-up order scheduled for{' '}
            <span className="font-bold">{orderDetails.date} at {orderDetails.time}</span>.
            Please remember to collect your order on time. Thank you for choosing us!
          </p>
          <div className="mt-6">
            <h2 className="text-xl font-bold">Payment Method</h2>
            <p className="mt-2">
              {orderDetails.paymentMethod === 'offline'
                ? 'You have chosen to pay offline at the counter.'
                : 'Your payment has been successfully processed online.'}
            </p>
          </div>
          {orderDetails.items?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-bold">Order Summary</h2>
              <ul className="mt-4">
                {orderDetails.items.map((item: any, index: number) => (
                  <li key={index} className="flex justify-between border-b border-gray-400 py-2">
                    <span>{item.name}</span>
                    <span>Quantity: {item.quantity}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-right font-bold">
                Total Price: ${parseFloat(orderDetails.totalPrice).toFixed(2)}
              </p>
            </div>
          )}
          <Map
            title={locationDetails.locationTitle}
            address={locationDetails.address}
            iframeSrc={locationDetails.iframeSrc}
          />
        </div>
      </div>
    </div>
  );
}

export default SuccessTakeaway;
