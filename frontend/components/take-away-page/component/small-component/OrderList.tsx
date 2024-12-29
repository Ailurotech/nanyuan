interface OrderListProps {
  orderList?: Array<{ name: string; price: number; quantity: number; _id: string }>;
  totalPrice?: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

function OrderList({ orderList = [], totalPrice = "0.00" }: OrderListProps) {
  if (orderList.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <h4 className="text-sm">Ordered Dishes</h4>
        <ul className="text-base space-y-1 list-disc px-4">
          <li className="font-bold">No Order Yet!</li>
        </ul>
        <h4 className="font-bold">{`Total Price: ${formatPrice(parseFloat(totalPrice))}`}</h4>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm">Ordered Dishes</h4>
      <ul className="text-base space-y-1 list-disc px-4">
        {orderList.map((order, index) => (
          <li key={index}>
            {`${order.name} - ${formatPrice(order.price)} x ${order.quantity}`}
          </li>
        ))}
      </ul>
      <h4 className="font-bold">{`Total Price: ${formatPrice(parseFloat(totalPrice))}`}</h4>
    </div>
  );
}

export default OrderList;
