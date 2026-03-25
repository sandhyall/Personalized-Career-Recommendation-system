import React, { useState } from "react";
import { Mail, PhoneMissed } from "lucide-react";

const Contactus = () => {
  const [contact, setContact] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // UPDATED LOGIC TO CONNECT TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/contact/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Message sent successfully!");
        // Reset form only on success
        setContact({
          name: "",
          email: "",
          message: "",
        });
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Could not connect to the server. Make sure your backend is running!");
    }
  };

  return (
    <div className="flex items-center justify-center p-6 bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Get In Touch With Us Now!
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <PhoneMissed className="text-blue-600" />
              <div>
                <p className="font-semibold text-gray-700">Phone Number</p>
                <p className="text-gray-600">+977 9766545136</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-blue-600" />
              <div>
                <p className="font-semibold text-gray-700">Email</p>
                <p className="text-gray-600">gyawalisaral9@gmail.com</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Contact Us
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={contact.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={contact.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <textarea
                name="message"
                placeholder="Enter your message"
                value={contact.message}
                onChange={handleChange}
                rows="4"
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contactus;