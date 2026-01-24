"use client";

import { useState, useEffect } from "react";
import Card from "./ui/Card";
import { createClient } from "@/lib/supabase";

interface Testimonial {
  id: string;
  client_name: string;
  quote: string;
  company?: string;
  position?: string;
  logo_url?: string;
}

// Fallback testimonials if database is empty
const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    client_name: "Rajesh Kumar",
    quote: "IILIKA GROUPS helped us build our GCC in Pune with exceptional talent. Their end-to-end support made the entire process seamless.",
    company: "Global Tech Corp",
    position: "VP Engineering",
  },
  {
    id: "2",
    client_name: "Sarah Johnson",
    quote: "The deployed resources from IILIKA have been instrumental in scaling our development team. Professional, skilled, and committed.",
    company: "FinTech Solutions",
    position: "CTO",
  },
  {
    id: "3",
    client_name: "Amit Patel",
    quote: "Outstanding project delivery! Their managed squads delivered our mobile app ahead of schedule with excellent quality.",
    company: "Retail Innovations",
    position: "Head of Product",
  },
  {
    id: "4",
    client_name: "Lisa Chen",
    quote: "IILIKA's staffing services are top-notch. They understand our technical requirements and consistently deliver the right talent.",
    company: "Cloud Systems Inc",
    position: "Engineering Director",
  },
];

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const supabase = createClient();

  // Fetch testimonials from Supabase
  useEffect(() => {
    async function fetchTestimonials() {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, client_name, quote, company, position, logo_url")
        .eq("status", "active")
        .order("display_order");

      if (!error && data && data.length > 0) {
        setTestimonials(data);
      }
    }
    fetchTestimonials();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <Card className="max-w-4xl mx-auto text-center">
                <svg
                  className="w-12 h-12 text-[#FF000E] mx-auto mb-6 opacity-50"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-lg md:text-xl text-[#333333] italic mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-black text-lg">{testimonial.client_name}</p>
                  {testimonial.position && testimonial.company && (
                    <p className="text-[#333333] text-sm">
                      {testimonial.position}, {testimonial.company}
                    </p>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="Previous testimonial"
      >
        <svg className="w-6 h-6 text-[#333333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="Next testimonial"
      >
        <svg className="w-6 h-6 text-[#333333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="flex justify-center mt-8 gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-[#FF000E] w-8" : "bg-gray-300"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
