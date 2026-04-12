import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { MailIcon, PhoneIcon, MapPinIcon, MessageCircleIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  
  return <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="text-3xl font-bold">
            <span className="text-yellow-300">Sri</span>
            <span className="text-white">Match</span>
            <span className="text-pink-300 ml-1">♥</span>
          </Link>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Contact Us
          </h1>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Contact Information */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Get in Touch
                </h2>
                <p className="text-gray-600 mb-6">
                  Have questions or need assistance? We're here to help! Reach
                  out to our friendly team through any of these channels.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <MailIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Email</h3>
                      <p className="text-gray-600">support@srimatch.com</p>
                      <p className="text-gray-500 text-sm">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <PhoneIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Phone</h3>
                      <p className="text-gray-600">+94 11 234 5678</p>
                      <p className="text-gray-500 text-sm">
                        Mon-Fri, 9:00 AM - 5:00 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <MapPinIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Office</h3>
                      <p className="text-gray-600">
                        42 Galle Road, Colombo 03
                        <br />
                        Sri Lanka
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Business Hours
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday:</span>
                    <span className="text-gray-800">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday:</span>
                    <span className="text-gray-800">10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday:</span>
                    <span className="text-gray-800">Closed</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2 text-purple-600" />
                    <span className="text-sm">
                      Online support available 24/7
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Contact Form */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Send Us a Message
                </h2>
                {formSubmitted ? <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Thank You!
                    </h3>
                    <p className="text-gray-600">
                      Your message has been sent successfully. We'll get back to
                      you as soon as possible.
                    </p>
                    <button onClick={() => setFormSubmitted(false)} className="mt-4 text-purple-600 hover:text-purple-800">
                      Send another message
                    </button>
                  </div> : <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name
                        </label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                      </div>
                    </div>
                    <div className="mb-6">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="">Select a subject</option>
                        <option value="account">Account Issues</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="technical">Technical Support</option>
                        <option value="feedback">Feedback & Suggestions</option>
                        <option value="partnership">
                          Business Partnerships
                        </option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition duration-200 flex items-center justify-center">
                      <MessageCircleIcon className="h-5 w-5 mr-2" />
                      Send Message
                    </button>
                  </form>}
              </div>
            </div>
          </div>
          {/* Map */}
          <div className="mt-12 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Our Location
            </h2>
            <div className="h-80 bg-gray-200 rounded-lg overflow-hidden">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.80385539324!2d79.8211858!3d6.9218386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1656543341015!5m2!1sen!2sus" width="100%" height="100%" style={{
              border: 0
            }} allowFullScreen loading="lazy" title="SriMatch Office Location"></iframe>
            </div>
          </div>
          {/* FAQs CTA */}
          <div className="mt-12 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Looking for Quick Answers?
            </h2>
            <p className="mb-6">
              Check out our frequently asked questions for immediate answers to
              common questions.
            </p>
            <Link to="/faq" className="inline-block bg-white text-purple-700 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-200">
              Visit FAQ Page
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};

export default ContactUsPage;