import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faMobileAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify'
import { useNewsLetterMutation } from '../app/apiusers';
const Footer = () => {

  const [email, setEmail] = useState('');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [newsLetter] = useNewsLetterMutation()

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCaptchaChange = (value) => {
    // CAPTCHA verification completed callback
    setIsCaptchaVerified(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {

      if (isCaptchaVerified) {
        // Here you can handle form submission, for example, send the email to your backend
        const result = await newsLetter({ email })

        if (result) {



          if (result.data !== 'field required') {


            toast.success(result.data)
            setEmail('');

          } else {

            toast.error(result.data)
          }

        } else {
          console.log('something wrong')
        }

      } else {

        toast.error('Please complete the CAPTCHA verification')

      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col">
            <h5 style={{ marginTop: 15 }}>Newsletter for New Arrivals</h5>
            <div style={{ marginTop: 20 }} className='subscirber'>
              <form onSubmit={handleFormSubmit}>
                <input className='emailsubscribe' name="email" type='text' placeholder='email'
                  value={email}
                  onChange={handleEmailChange} />

                <div className='captchafooter'>
                  <ReCAPTCHA
                    sitekey="6LdTT5wpAAAAAIm1OBDj87YplC5-S8OJp4Fa9mH8"
                    onChange={handleCaptchaChange}
                    className='recaptchacontain'
                  />

                  <div className='btn-subscribe'><button className='btn btn-danger'>Subscribe</button></div>
                </div>
              </form>
            </div>

            <p style={{ marginTop:-20, textAlign: 'justify' }}>Thrifters' Point is an online thrift store bringing high end brands to your doorstep at an affordable cost.
              All articles are handpicked from different thrift bazaars,
              making sure our customers get the best products available.
            </p>

          </div>
          <div className="col">
            <h5 style={{ marginTop: 15 }}>Quick Links</h5>
            <ul>
              <li ><Link style={{ textDecoration: 'none', color: 'black' }} to=''>Shop</Link></li>
              <li><Link style={{ textDecoration: 'none', color: 'black' }} to='/cart'>Cart</Link></li>
              <li><Link style={{ textDecoration: 'none', color: 'black' }} to='/checkout'>Checkout</Link></li>
              <li><Link style={{ textDecoration: 'none', color: 'black' }} to=''>AboutUs</Link></li>

            </ul>
          </div>
          <div className="col">
            <h5 style={{ marginTop: 10 }}>Contact Us</h5>
            <div>
              <h6><FontAwesomeIcon icon={faMapMarkerAlt} /> Address</h6>
              <p>Islamabad</p>
            </div>
            <div>
              <h6>< FontAwesomeIcon icon={faMobileAlt} /> Phone</h6>
              <p>+923315195278</p>
            </div>
            <div>
              <h6>< FontAwesomeIcon icon={faEnvelope} /> Email</h6>
              <p>fasst.sallar@gmail.com</p>
            </div>
            <div>
              <h6>Follow Us</h6>
              <div className='followus'>

                <FontAwesomeIcon icon={faFacebookF} /> <FontAwesomeIcon icon={faInstagram} />

              </div>
            </div>


          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
