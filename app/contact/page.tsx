"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase";

interface Service {
  id: string;
  title: string;
  slug: string;
}

interface FormState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

export default function Contact() {
  const [formType, setFormType] = useState<"client" | "applicant">("client");
  const [services, setServices] = useState<Service[]>([]);
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    success: false,
    error: null,
  });

  // Client form state
  const [clientForm, setClientForm] = useState({
    contact_name: "",
    company_name: "",
    email: "",
    phone: "",
    service_interest_id: "",
    message: "",
  });

  // Applicant form state
  const [applicantForm, setApplicantForm] = useState({
    name: "",
    email: "",
    phone: "",
    role_interest: "",
    linkedin_url: "",
    message: "",
  });

  const supabase = createClient();

  // Fetch active services for dropdown
  useEffect(() => {
    async function fetchServices() {
      const { data } = await supabase
        .from("services")
        .select("id, title, slug")
        .eq("status", "active")
        .eq("type", "pillar")
        .order("display_order");
      if (data) setServices(data);
    }
    fetchServices();
  }, []);

  // Reset form state when switching tabs
  useEffect(() => {
    setFormState({ loading: false, success: false, error: null });
  }, [formType]);

  // Email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle client form submission
  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ loading: true, success: false, error: null });

    // Validation
    if (!clientForm.contact_name.trim()) {
      setFormState({ loading: false, success: false, error: "Please enter your name" });
      return;
    }
    if (!clientForm.company_name.trim()) {
      setFormState({ loading: false, success: false, error: "Please enter your company name" });
      return;
    }
    if (!isValidEmail(clientForm.email)) {
      setFormState({ loading: false, success: false, error: "Please enter a valid email address" });
      return;
    }
    if (!clientForm.message.trim()) {
      setFormState({ loading: false, success: false, error: "Please enter your message" });
      return;
    }

    const { error } = await supabase.from("client_inquiries").insert({
      contact_name: clientForm.contact_name.trim(),
      company_name: clientForm.company_name.trim(),
      email: clientForm.email.trim(),
      phone: clientForm.phone.trim() || null,
      service_interest_id: clientForm.service_interest_id || null,
      service_interest_other: !clientForm.service_interest_id ? "General Inquiry" : null,
      message: clientForm.message.trim(),
    });

    if (error) {
      setFormState({ loading: false, success: false, error: "Failed to submit inquiry. Please try again." });
      return;
    }

    setFormState({ loading: false, success: true, error: null });
    setClientForm({
      contact_name: "",
      company_name: "",
      email: "",
      phone: "",
      service_interest_id: "",
      message: "",
    });
  };

  // Handle applicant form submission
  const handleApplicantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ loading: true, success: false, error: null });

    // Validation
    if (!applicantForm.name.trim()) {
      setFormState({ loading: false, success: false, error: "Please enter your name" });
      return;
    }
    if (!isValidEmail(applicantForm.email)) {
      setFormState({ loading: false, success: false, error: "Please enter a valid email address" });
      return;
    }
    if (!applicantForm.message.trim()) {
      setFormState({ loading: false, success: false, error: "Please enter your message" });
      return;
    }

    const { error } = await supabase.from("general_applications").insert({
      name: applicantForm.name.trim(),
      email: applicantForm.email.trim(),
      phone: applicantForm.phone.trim() || null,
      role_interest: applicantForm.role_interest || null,
      linkedin_url: applicantForm.linkedin_url.trim() || null,
      message: applicantForm.message.trim(),
    });

    if (error) {
      setFormState({ loading: false, success: false, error: "Failed to submit application. Please try again." });
      return;
    }

    setFormState({ loading: false, success: true, error: null });
    setApplicantForm({
      name: "",
      email: "",
      phone: "",
      role_interest: "",
      linkedin_url: "",
      message: "",
    });
  };

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
              {/* Success Message */}
              {formState.success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    {formType === "client"
                      ? "Thank you for your inquiry! We'll get back to you within 24 hours."
                      : "Thank you for your application! We'll review your profile and get back to you soon."}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {formState.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">{formState.error}</p>
                </div>
              )}

              {formType === "client" ? (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
                    Client Inquiry
                  </h2>
                  <p className="text-[#333333] mb-6">
                    Tell us about your staffing, GCC, or project needs and we'll get back to you
                    within 24 hours.
                  </p>
                  <form className="space-y-4" onSubmit={handleClientSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={clientForm.contact_name}
                          onChange={(e) => setClientForm({ ...clientForm, contact_name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={clientForm.company_name}
                          onChange={(e) => setClientForm({ ...clientForm, company_name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                          placeholder="Your company"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={clientForm.email}
                          onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                          placeholder="your.email@company.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={clientForm.phone}
                          onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-2">
                        Service Type
                      </label>
                      <select
                        value={clientForm.service_interest_id}
                        onChange={(e) => setClientForm({ ...clientForm, service_interest_id: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                      >
                        <option value="">General Inquiry</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={5}
                        value={clientForm.message}
                        onChange={(e) => setClientForm({ ...clientForm, message: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                        placeholder="Tell us about your requirements..."
                        required
                      ></textarea>
                    </div>
                    <Button type="submit" variant="primary" className="w-full" disabled={formState.loading}>
                      {formState.loading ? "Sending..." : "Send Inquiry"}
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
                  <form className="space-y-4" onSubmit={handleApplicantSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={applicantForm.name}
                          onChange={(e) => setApplicantForm({ ...applicantForm, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={applicantForm.email}
                          onChange={(e) => setApplicantForm({ ...applicantForm, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                          placeholder="your.email@example.com"
                          required
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
                          value={applicantForm.phone}
                          onChange={(e) => setApplicantForm({ ...applicantForm, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                          Role Interested In
                        </label>
                        <select
                          value={applicantForm.role_interest}
                          onChange={(e) => setApplicantForm({ ...applicantForm, role_interest: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                        >
                          <option value="">Select a role</option>
                          <option value="Full Stack Developer">Full Stack Developer</option>
                          <option value="Backend Developer">Backend Developer</option>
                          <option value="Frontend Developer">Frontend Developer</option>
                          <option value="DevOps Engineer">DevOps Engineer</option>
                          <option value="Data Engineer">Data Engineer</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-2">
                        LinkedIn Profile / Resume URL
                      </label>
                      <input
                        type="url"
                        value={applicantForm.linkedin_url}
                        onChange={(e) => setApplicantForm({ ...applicantForm, linkedin_url: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={5}
                        value={applicantForm.message}
                        onChange={(e) => setApplicantForm({ ...applicantForm, message: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF000E]"
                        placeholder="Tell us about your experience and why you want to join IILIKA GROUPS..."
                        required
                      ></textarea>
                    </div>
                    <Button type="submit" variant="primary" className="w-full" disabled={formState.loading}>
                      {formState.loading ? "Submitting..." : "Submit Application"}
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
