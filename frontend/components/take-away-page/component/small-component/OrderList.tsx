import React from 'react';

interface OrderListProps {
  orderList: Array<{ name: string; price: number; quantity: number }>;
  totalPrice: string;
}

function OrderList({ orderList, totalPrice }: OrderListProps) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm">Ordered Dishes</h4>
      <ul className="text-base space-y-1 list-disc px-4">
        {orderList.length === 0 ? (
          <li className="font-bold">No Order Yet!</li>
        ) : (
          orderList.map((order, index) => (
            <li key={index}>
              {`${order.name} - $${order.price} x ${order.quantity}`}
            </li>
          ))
        )}
      </ul>
      <h4 className="font-bold">{`Total Price: $${totalPrice}`}</h4>
    </div>
  );
}

export default OrderList;
