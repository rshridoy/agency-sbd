import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Siren Buzz — Marketing Insights",
  description: "Marketing insights, brand strategies, and industry knowledge from the Siren Communication team.",
};

export const dynamic = "force-dynamic";

const PER_PAGE = 6;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1"));

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: { author: true, category: true },
    }),
    prisma.post.count({ where: { published: true } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 to-brand-950 py-20">
          <div className="container-wide text-center">
            <ScrollReveal>
              <span className="text-brand-400 font-semibold text-sm uppercase tracking-widest">Siren Buzz</span>
              <h1 className="mt-3 text-5xl font-black text-white mb-4">Marketing Insights</h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Strategies, stories, and sparks of inspiration from our team of brand experts.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Posts grid */}
        <section className="section-padding bg-white">
          <div className="container-wide">
            {posts.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-xl">No posts yet. Check back soon!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post, i) => (
                    <ScrollReveal key={post.id} delay={i * 0.06}>
                      <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                        <div className="aspect-video overflow-hidden bg-gray-100">
                          {post.coverImage ? (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                              <span className="text-brand-500 font-bold text-3xl">S</span>
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          {post.category && (
                            <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full inline-block mb-3 self-start">
                              {post.category.name}
                            </span>
                          )}
                          <h2 className="font-bold text-gray-900 text-xl mb-3 line-clamp-2 group-hover:text-brand-700 transition-colors">
                            {post.title}
                          </h2>
                          <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span className="flex items-center gap-1.5">
                                <User size={12} /> {post.author.name}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Calendar size={12} />
                                {post.publishedAt ? formatDate(post.publishedAt) : ""}
                              </span>
                            </div>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center gap-1 text-brand-600 font-semibold text-sm hover:underline"
                            >
                              Read More <ArrowRight size={13} />
                            </Link>
                          </div>
                        </div>
                      </article>
                    </ScrollReveal>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-12">
                    {page > 1 && (
                      <Link href={`/blog?page=${page - 1}`} className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                        <ChevronLeft size={16} /> Previous
                      </Link>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={`/blog?page=${p}`}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors ${
                          p === page
                            ? "bg-brand-600 text-white"
                            : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </Link>
                    ))}
                    {page < totalPages && (
                      <Link href={`/blog?page=${page + 1}`} className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                        Next <ChevronRight size={16} />
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
