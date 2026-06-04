import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true, category: true },
  });

  if (!post || !post.published) notFound();

  const relatedPosts = await prisma.post.findMany({
    where: { published: true, categoryId: post.categoryId, NOT: { id: post.id } },
    take: 3,
    include: { author: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gray-900 py-20">
          <div className="container-wide max-w-4xl">
            <Link href="/blog" className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-medium mb-8 transition-colors">
              <ArrowLeft size={16} /> Back to Siren Buzz
            </Link>
            {post.category && (
              <span className="inline-block text-xs font-semibold text-brand-400 bg-brand-900/40 px-3 py-1 rounded-full mb-4">
                {post.category.name}
              </span>
            )}
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-gray-400 text-sm">
              <span className="flex items-center gap-2">
                <User size={15} /> {post.author.name}
              </span>
              {post.publishedAt && (
                <span className="flex items-center gap-2">
                  <Calendar size={15} /> {formatDate(post.publishedAt)}
                </span>
              )}
              {post.category && (
                <span className="flex items-center gap-2">
                  <Tag size={15} /> {post.category.name}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Cover image */}
        {post.coverImage && (
          <div className="container-wide max-w-4xl -mt-8">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* Body */}
        <section className="section-padding">
          <div className="container-wide max-w-3xl">
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {post.body.split("\n\n").map((para, i) => (
                <p key={i} className="mb-5">{para}</p>
              ))}
            </div>

            {/* Author card */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                  {post.author.avatar ? (
                    <img src={post.author.avatar} alt={post.author.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-brand-600 font-bold text-xl">{post.author.name[0]}</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{post.author.name}</p>
                  {post.author.bio && <p className="text-gray-500 text-sm mt-1">{post.author.bio}</p>}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="section-padding bg-gray-50">
            <div className="container-wide">
              <h2 className="text-2xl font-black text-gray-900 mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((p) => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all">
                    {p.coverImage && (
                      <div className="aspect-video overflow-hidden">
                        <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-brand-700 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-gray-500 text-xs mt-2">{p.author.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
