import React,{useState,useEffect} from 'react'
import './ContactUs.css'
import { client } from './sanityClient';

const ContactUs = () => {

  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
        try {
            const response = await fetch("https://1n1hox3xv2.execute-api.ap-southeast-2.amazonaws.com/dev/contact"); // GET
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRestaurantInfo(data);
        } catch (err) {
            setError(err);
            console.error("Error fetching restaurant info:", err);
        }
    };
    fetchRestaurantInfo();
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionMessage('');

    const name = event.target.elements.name.value;
    const message = event.target.elements.message.value;
    const phone = event.target.elements.phone.value;

    try {
        const response = await fetch('https://1n1hox3xv2.execute-api.ap-southeast-2.amazonaws.com/dev/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, message, phone}),
        });

        const data = await response.json();

        if (response.ok) {
            setSubmissionMessage('Message sent successfully!');
            event.target.reset();
        } else {
            setSubmissionMessage(data.message || 'An error occurred. Please try again later.');
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        setSubmissionMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      {error && <div>Error: Could not load restaurant information.</div>}
      {!restaurantInfo && <div>Loading restaurant information...</div>}
      {restaurantInfo && (
        <>
          <section className='ContactForm'>
            <h2>Contact Info</h2>
            <address>
              <div className="info">
                <div className="name">
                  <p><strong>Name:</strong></p>
                  <p>{restaurantInfo.name}</p>
                </div>
                <div className="address">
                  <p><strong>Address:</strong></p>
                  <p>{restaurantInfo.address}</p>
                </div>
                <div className="phone">
                  <p><strong>Phone:</strong></p>
                  <p>{restaurantInfo.phone}</p>
                </div>
                <div className="email">
                  <p><strong>Email:</strong></p>
                  <p>{restaurantInfo.email}</p>
                </div>
              </div>
            </address>
          </section>
          <section className="contact">
            <form onSubmit={handleSubmit}>
              <h2>Contact Us</h2>
              <div className='input-box'>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" className='field' placeholder='Please Enter Your name' required />
              </div>
              <div className='input-box'>
                <label htmlFor="phone">Phone</label>
                <input type="tel" id="phone" name="phone" className='field' placeholder='Please Enter Your Phone' />
              </div>
              <div className='input-box'>
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" className='field mess' placeholder='请Please Enter Your Message' required></textarea>
              </div>
              <button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Sending message'}
              </button>
              {submissionMessage && <p className="submission-message">{submissionMessage}</p>}
            </form>
          </section>
        </>
      )}
    </div>
    
  );
};

export default ContactUs
