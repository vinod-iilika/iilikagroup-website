import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export default function CaseStudiesLoading() {
  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <Skeleton className="h-12 w-56 mx-auto mb-6" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
