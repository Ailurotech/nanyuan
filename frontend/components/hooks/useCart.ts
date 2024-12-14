import { useState, useEffect } from 'react';
import { MenuItem } from '@/types';

export type OrderList = MenuItem & { quantity: number };

export const useCart = () => {
  const [orderList, setOrderList] = useState<OrderList[]>([]);
  const [totalPrice, setTotalPrice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const cart = localStorage.getItem('cart');
    if (!cart) {
      setOrderList([]);
      setLoading(false);
      return;
    }

    const parsedList = JSON.parse(cart) as OrderList[];
    setOrderList(parsedList);

    const price = parsedList
      .reduce((acc, cum) => acc + cum.price * cum.quantity, 0)
      .toFixed(2);
    setTotalPrice(price);
    setLoading(false);
  }, []);

  return { orderList, totalPrice, loading };
};
