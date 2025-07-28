"use client";

import React, { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: send data to backend via axios.post("/api/contact", formData)
    console.log(formData);
    setSubmitted(true);

    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-yellow-50 text-black py-12 px-6 sm:px-12 mt-6">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl text-green-800 font-bold mb-2">Contact Us</h1>
        <p className="text-sm text-gray-700">
          We'd love to hear from you. Whether you have a question about recipes, feedback, or anything else — our team is ready to help!
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow">
        {/* Contact Info */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3">
            <MapPin size={20} />
            <span>123 Flavor Street, Foodville, Sri Lanka</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={20} />
            <a href="tel:+94123456789" className="hover:underline">
              +94 123 456 789
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={20} />
            <a href="mailto:support@cookbookapp.com" className="hover:underline">
              support@cookbookapp.com
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
          <textarea
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="w-full px-4 py-2 border border-gray-300 rounded"
          ></textarea>
          <button
            type="submit"
            className="bg-[#4d7c5a] text-white px-6 py-2 rounded hover:bg-[#3d6848] transition"
          >
            Send Message
          </button>
          {submitted && (
            <p className="text-green-600 text-sm mt-2">
              ✅ Thank you! Your message has been sent.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
