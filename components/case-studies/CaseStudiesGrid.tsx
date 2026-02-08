"use client";

import { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client_name?: string;
  industry?: string;
  challenge: string;
  results: string[];
  technologies: string[];
  thumbnail_url?: string;
}

export default function CaseStudiesGrid({ caseStudies }: { caseStudies: CaseStudy[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudies = useMemo(() => {
    if (!searchQuery.trim()) return caseStudies;
    const query = searchQuery.toLowerCase().trim();
    return caseStudies.filter((study) => {
      const titleMatch = study.title.toLowerCase().includes(query);
      const clientMatch = study.client_name?.toLowerCase().includes(query) ?? false;
      const industryMatch = study.industry?.toLowerCase().includes(query) ?? false;
      const techMatch = study.technologies?.some((tech) =>
        tech.toLowerCase().includes(query)
      ) ?? false;
      return titleMatch || clientMatch || industryMatch || techMatch;
    });
  }, [caseStudies, searchQuery]);

  return (
    <>
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by title, client, industry, or technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF000E]/20 focus:border-[#FF000E] transition-colors text-[#333333] placeholder-gray-400"
          />
        </div>
      </div>

      {filteredStudies.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredStudies.map((study) => (
            <Card key={study.id} className="flex flex-col h-full">
              <div className="flex flex-col md:flex-row gap-6">
                {study.thumbnail_url && (
                  <div className="relative w-full md:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={study.thumbnail_url}
                      alt={study.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  {study.industry && (
                    <span className="inline-block text-xs px-2 py-1 bg-[#FF000E]/10 text-[#FF000E] rounded mb-2">
                      {study.industry}
                    </span>
                  )}
                  <h2 className="text-xl font-semibold text-black mb-2">
                    {study.title}
                  </h2>
                  {study.client_name && (
                    <p className="text-sm text-[#333333] mb-3">
                      Client: {study.client_name}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-[#333333] mt-4 mb-4 line-clamp-3">
                {study.challenge}
              </p>

              {study.results && study.results.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-black mb-2">Key Results:</p>
                  <ul className="text-sm text-[#333333] space-y-1">
                    {study.results.slice(0, 3).map((result, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-[#FF000E] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {study.technologies && study.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {study.technologies.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-gray-100 text-[#333333] rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <Link href={`/case-studies/${study.slug}`} className="mt-auto">
                <Button variant="outline" size="sm" className="w-full">
                  Read Full Case Study
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      ) : searchQuery.trim() ? (
        <div className="text-center py-16">
          <p className="text-xl text-[#333333] mb-4">
            No case studies match &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-[#333333]">Try a different search term.</p>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-[#333333] mb-4">No case studies published yet.</p>
          <p className="text-[#333333]">Check back soon for client success stories.</p>
        </div>
      )}
    </>
  );
}
