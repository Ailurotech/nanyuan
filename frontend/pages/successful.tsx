import { useRouter } from 'next/router';

function SuccessfulPage() {
  const router = useRouter();
  const { type, name, date, time } = router.query; 

  return (
    <div className='bg-black w-full min-h-screen h-auto pt-[20vh] text-yellow-500'>
      <div className='mx-auto w-[60%] h-auto flex flex-col gap-x-[8%] md:flex-row'>
        <div className=' flex-1'>
          <h1 className='text-[40px] capitalize font-bold'>thank you, {name}!</h1>
          <p className="mt-4 text-md">
          We sincerely appreciate your {type === 'booktable' ? 'table booking' : 'pick-up order'} scheduled for <span className='font-bold'>{date} at {time}</span>. Your support means a lot to us, and we are thrilled to have you with us. Our team is dedicated to providing the best possible experience, and we hope that you enjoy everything we have to offer.
          </p>
          <p className="mt-4 text-md">
            Follow us on <a href="https://www.instagram.com/nan_yuan_restaurant/?hl=en" target="_blank" className="underline">Instagram</a> for the latest updates and specials, and if you have any questions, feel free to call us at <a href="tel:+61882713133" className="font-bold underline">(08) 8271 3133</a>. Thank you for choosing us, and we look forward to serving you!
          </p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3269.112133836924!2d138.588901976713!3d-34.97885587740837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ab0cff8dd2fe379%3A0xf3aaa6ce8f150aa9!2sNan%20Yuan!5e0!3m2!1sen!2sau!4v1730149418540!5m2!1sen!2sau"
            width="100%"
            height="300px"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Nan Yuan Location Map"
            className='rounded-md mt-7'
          ></iframe>
          <p className="mt-4 text-center font-semibold">
            Our address: <span className="font-bold">524 Goodwood Rd, Daw Park SA 5041</span>
          </p>
        </div>
        {type !== 'booktable' && (
          <div className='w-[40%]'>
            <p>ddd</p>
          </div>
        )}
      </div>
    </div>
    
  );
}



{/* {*<div>
  <h1>Submission Successful!</h1>
  {type === 'booktable' && (
    <div>
      <p>Booking Type: {type}</p>
      <p>Name: {name}</p>
      <p>Date: {date}</p>
      <p>Time: {time}</p>
    </div>
  )}
</div>*}*/}

export default SuccessfulPage;






