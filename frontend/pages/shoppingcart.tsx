import { useState, useEffect} from 'react';
// import { GetStaticProps } from "next";
// import { sanityClient } from "../lib/sanityClient";
import { ShoppingCartItem } from "../types"; // Define your types if needed
import { Button} from '@chakra-ui/react';
import { FaArrowLeftLong } from "react-icons/fa6";
import CartCard from "@/components/shoppingcart/CartCard";
// import { it } from 'node:test';
// import { RoutRoute} from "../components/homepage/route";
import Link from "next/link";
interface ShoppingCartProps {
  shoppingCartItems: ShoppingCartItem[];
}

const ShoppingCart = ({ shoppingCartItems }: ShoppingCartProps) => {
  const [cartItems, setCartItems] = useState<ShoppingCartItem[]>([]);
  const [shouldUpdateLocalStorage, setShouldUpdateLocalStorage] = useState(false);

  useEffect(() => {    
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      setCartItems(JSON.parse(cartData));
    }
    if (shouldUpdateLocalStorage) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      setShouldUpdateLocalStorage(false);
    }
  }, [shouldUpdateLocalStorage]);

  const updateCart = (updatedItems: ShoppingCartItem[]) => {
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item._id !== id);
    updateCart(updatedItems);
  };
  const updateQuantity = (newQuantity:number,id: string) => {
    setCartItems((prevItem) => {
      const updatedItems = prevItem.map(item => item._id === id ? { ...item, quantity: newQuantity } : item);
      setShouldUpdateLocalStorage(true);
      return updatedItems;
    });
  };

  console.log('cartItems',cartItems);

  return (
    <div className="bg-black w-full py-48">
      <h1 className="text-center text-white text-4xl font-bold mb-8">Our shopping Cart</h1>
      <div className="w-3/4 mx-auto p-12 bg-zinc-800 rounded-lg shadow-2xl">
      <Link href="/menu">
        <Button className="bg-yellow-400 p-3 gap-2">
          <FaArrowLeftLong />
          <span className="font-bold">Continue Ordering</span>
        </Button>
      </Link>
      <div className="py-6 border-t-2 border-white mt-6 ">
          <div className="text-white">You have {cartItems.length} items in your shopping cart</div>
          <div className='my-10'>
            {cartItems.map((item) => (
              <CartCard shoppingCartItem={item} key={item._id} removeItem={()=>removeItem(item._id)} updateQuantity={updateQuantity}/>
            ))}
          </div>
          <div className="flex justify-between flex-col gap-5 mx-auto md:flex-row">
            <Link href="/menu" className="w-100 flex justify-center">
              <Button className="bg-white p-3 font-bold px-32 w-1/3 md:ml-10 md:w-3/4">ADD MORE</Button>
            </Link>
            <Link href="" className="w-100 flex justify-center">
              <Button className="bg-yellow-400 p-3 font-bold px-32 w-1/3 md:mr-10 md:w-3/4">CHECK OUT</Button>
            </Link>
           
          </div>
        </div>
      </div>
    </div>
  )};

export default ShoppingCart;