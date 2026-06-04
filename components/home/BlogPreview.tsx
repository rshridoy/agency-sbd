import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export async function BlogPreview() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { author: true, category: true },
  });

  if (posts.length === 0) return null;

  return (
    <section className="section-padding bg-gray-50" id="blog">
      <div className="container-wide">
        <ScrollReveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-brand-600 font-semibold text-sm uppercase tracking-widest">Siren Buzz</span>
            <h2 className="mt-2 text-4xl font-black text-gray-900">Latest Insights</h2>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:underline shrink-0">
            All Posts <ArrowRight size={16} />
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <ScrollReveal key={post.id} delay={i * 0.1}>
              <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
                <div className="aspect-video overflow-hidden bg-gray-100">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                      <span className="text-brand-500 font-bold text-2xl">S</span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  {post.category && (
                    <span className="inline-block text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full mb-3">
                      {post.category.name}
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-brand-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <User size={12} /> {post.author.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
                      </span>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="text-brand-600 font-semibold text-xs hover:underline">
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
