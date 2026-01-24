"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function Contact() {
  const [formType, setFormType] = useState<"client" | "applicant">("client");

  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">Get in Touch</h1>
            <p className="text-xl text-[#333333] leading-relaxed">
              Whether you're looking to hire talent or join our team, we'd love to hear from you
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setFormType("client")}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    formType === "client"
                      ? "bg-[#FF000E] text-white"
                      : "text-[#333333] hover:bg-gray-100"
                  }`}
                >
                  For Clients
                </button>
                <button
                  onClick={() => setFormType("applicant")}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    formType === "applicant"
                      ? "bg-[#FF000E] text-white"
                      : "text-[#333333] hover:bg-gray-100"
                  }`}
                >
                  For Applicants
                </button>
              </div>
            </div>

            <Card>
              {formType === "client" ? (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
                    Client Inquiry
                  </h2>
                  <p className="text-[#333333] mb-6">
                    Tell us about your staffing, GCC, or project needs and we'll get back to you
                    within 24 hours.
                  </p>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                          placeholder="Your company"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                          placeholder="your.email@company.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-2">
                        Service Type
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]">
                        <option>Select a service</option>
                        <option>IT Staffing & Deployed Resources</option>
                        <option>GCC Enablement</option>
                        <option>Service-based Project Delivery</option>
                        <option>General Inquiry</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-2">
                        Message
                      </label>
                      <textarea
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                        placeholder="Tell us about your requirements..."
                      ></textarea>
                    </div>
                    <Button type="submit" variant="primary" className="w-full">
                      Send Inquiry
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
                    Job Application
                  </h2>
                  <p className="text-[#333333] mb-6">
                    Interested in joining our team? Fill out the form below and we'll review your
                    profile.
                  </p>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                          Role Interested In
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]">
                          <option>Select a role</option>
                          <option>Full Stack Developer</option>
                          <option>Backend Developer</option>
                          <option>Frontend Developer</option>
                          <option>DevOps Engineer</option>
                          <option>Data Engineer</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-2">
                        LinkedIn Profile / Resume URL
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-2">
                        Message
                      </label>
                      <textarea
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                        placeholder="Tell us about your experience and why you want to join IILIKA GROUPS..."
                      ></textarea>
                    </div>
                    <Button type="submit" variant="primary" className="w-full">
                      Submit Application
                    </Button>
                  </form>
                </>
              )}
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Our Location</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <svg
                className="w-12 h-12 text-[#FF000E] mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="font-semibold text-black mb-2">Address</h3>
              <p className="text-[#333333] text-sm">Lohegaon, Pune, India</p>
            </Card>
            <Card className="text-center">
              <svg
                className="w-12 h-12 text-[#FF000E] mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <h3 className="font-semibold text-black mb-2">Email</h3>
              <a href="mailto:info@iilikagroups.com" className="text-[#FF000E] text-sm hover:underline">
                info@iilikagroups.com
              </a>
            </Card>
            <Card className="text-center">
              <svg
                className="w-12 h-12 text-[#FF000E] mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <h3 className="font-semibold text-black mb-2">Phone</h3>
              <p className="text-[#333333] text-sm">Available on request</p>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
