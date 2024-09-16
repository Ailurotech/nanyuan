import { useState, useEffect} from 'react';
import { ShoppingCartItem } from "../types"; // Define your types if needed
import { Button} from '@chakra-ui/react';
import { FaArrowLeftLong } from "react-icons/fa6";
import CartCard from "@/components/shoppingcart/CartCard";
import Link from "next/link";
import { NavigationRoute } from "@/components/homepage/route";
interface ShoppingCartProps {
  shoppingCartItems: ShoppingCartItem[];
}

const ShoppingCart = ({ shoppingCartItems }: ShoppingCartProps) => {
  const [cartItems, setCartItems] = useState<ShoppingCartItem[]>([]);
  useEffect(() => {    
    const cartData = localStorage.getItem('cart');
    console.log('cartData',cartData);
    if (cartData) {
      setCartItems(JSON.parse(cartData));
    }
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) { 
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]); 

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
      return updatedItems;
    });
  };

  return (
    <div className="bg-black w-full py-48">
      <h1 className="text-center text-white text-4xl font-bold mb-8">Shopping Cart</h1>
      <div className="w-3/4 mx-auto p-12 bg-zinc-800 rounded-lg shadow-2xl">
      <Link href={NavigationRoute.Menu.Path}>
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
            <Link href={NavigationRoute.Menu.Path} className="w-100 flex justify-center">
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