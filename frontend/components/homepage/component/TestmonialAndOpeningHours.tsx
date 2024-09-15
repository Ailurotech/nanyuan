import Image from "next/image";
import styles from "@/styles/homepage.module.css";

export default function TestmonialAndOpeningHours() {
  return (
    <div className={`h-[100vh] py-[5%] px-[16%]  bg-[#4E4E4E] text-white justify-center items-center ${styles["font-alegreya-sans"]}`}>
        <div className="flex flex-col md:flex-row ">
            <div className="w-[100%]">
                <div>
                    <h1 className="text-[2.3rem] sm:text-[3rem] xl:text-[3.7em]">Opening Hours</h1>
                </div>
                <div>
                    <p className="text-[1rem] sm:text-[1.5rem] xl:text-[2rem]">Monday: 9:00am - 5:00pm</p>
                    <p className="text-[1rem] sm:text-[1.5rem] xl:text-[2rem]">Tuesday: 9:00am - 5:00pm</p>
                    <p className="text-[1rem] sm:text-[1.5rem] xl:text-[2rem]">Wednesday: 9:00am - 5:00pm</p>
                    <p className="text-[1rem] sm:text-[1.5rem] xl:text-[2rem]">Thursday: 9:00am - 5:00pm</p>
                    <p className="text-[1rem] sm:text-[1.5rem] xl:text-[2rem]">Friday: 9:00am - 5:00pm</p>
                    <p className="text-[1rem] sm:text-[1.5rem] xl:text-[2rem]">Saturday: 9:00am - 5:00pm</p>
                    <p className="text-[1rem] sm:text-[1.5rem] xl:text-[2rem]">Sunday: 9:00am - 5:00pm</p>
                </div>
            </div>
            <div className="w-[100%]">
                <p>nihao</p>
            </div>
        </div>
        <div className=""> 
            
        </div>
    </div>
  );
}
