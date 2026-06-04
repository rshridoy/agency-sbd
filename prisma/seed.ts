import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱  Seeding database…");

  // Admin user
  const plainPassword = "SirenAdmin2026!";
  const hashed = await bcrypt.hash(plainPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@sirenbd.com" },
    update: {},
    create: { name: "Siren Admin", email: "admin@sirenbd.com", password: hashed, role: "admin" },
  });
  console.log(`✅  Admin user: ${admin.email}  |  Password: ${plainPassword}`);

  // Services
  const services = [
    { title: "360° Marketing & Branding", description: "Full-service marketing strategies that define your identity and position your brand for long-term success across all channels.", icon: "Megaphone", order: 1 },
    { title: "Social Media & Ads", description: "Drive engagement and ROI with creative organic content, active community management, and data-driven paid ad campaigns.", icon: "BarChart2", order: 2 },
    { title: "Video Production & Photography", description: "High-quality TVCs, OVCs, professional photography, and compelling visual storytelling.", icon: "Video", order: 3 },
    { title: "Influencer Marketing & PR", description: "Connect with key influencers and execute strategic PR campaigns to strengthen credibility.", icon: "Users", order: 4 },
    { title: "E-commerce & Startup Solutions", description: "From MVP consulting to full-scale platform development to accelerate new business success.", icon: "ShoppingCart", order: 5 },
    { title: "B2B & Corporate Branding", description: "Strengthen corporate presence and generate qualified leads via LinkedIn and B2B strategies.", icon: "Building2", order: 6 },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.title },
      update: service,
      create: service,
    }).catch(() => prisma.service.create({ data: service }));
  }
  console.log(`✅  ${services.length} services seeded`);

  // Stats
  await prisma.stat.upsert({
    where: { id: "stat-clients" },
    update: {},
    create: { id: "stat-clients", label: "Satisfied Clients", value: "20+", order: 1 },
  }).catch(() =>
    prisma.stat.deleteMany({}).then(() =>
      prisma.stat.create({ data: { label: "Satisfied Clients", value: "20+", order: 1 } })
    )
  );
  console.log("✅  Stats seeded");

  // Site settings
  const settings = [
    { key: "site_name", value: "Siren Communication" },
    { key: "tagline", value: "Empowering Brands. Elevating Growth." },
    { key: "email", value: "siren.infos@gmail.com" },
    { key: "phone", value: "+8801673140440" },
    { key: "facebook", value: "https://www.facebook.com/SirenBangladesh" },
    { key: "youtube", value: "https://www.youtube.com/@sirenbangladesh" },
    { key: "linkedin", value: "https://www.linkedin.com/company/sirenbd/" },
    { key: "whatsapp", value: "+8801673140440" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("✅  Site settings seeded");

  // Author
  const author = await prisma.author.upsert({
    where: { id: "author-saif" },
    update: {},
    create: {
      id: "author-saif",
      name: "Saif",
      bio: "Marketing strategist and content creator at Siren Communication. Passionate about brand storytelling and digital growth.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Saif",
    },
  });
  console.log(`✅  Author: ${author.name}`);

  // Categories
  const categories = [
    { id: "cat-marketing", name: "Marketing Strategy", slug: "marketing-strategy" },
    { id: "cat-branding", name: "Branding", slug: "branding" },
    { id: "cat-social", name: "Social Media", slug: "social-media" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅  Categories seeded");

  // Blog posts
  const posts = [
    {
      id: "post-1",
      title: "5 Brand Strategy Mistakes That Are Costing You Customers",
      slug: "brand-strategy-mistakes",
      excerpt: "Discover the most common branding pitfalls and how to avoid them to build a brand that truly connects with your audience.",
      body: `Building a strong brand is more than just a logo and a color palette. It's the entire experience your customers have with your business — from the first touchpoint to long-term loyalty.

Many companies fall into common traps that undermine their brand equity. Here are the five most costly mistakes we see consistently.

1. Inconsistent Brand Voice
Your brand voice should be consistent across every channel — social media, email, website, and in-person. Inconsistency creates confusion and erodes trust. Define your tone and stick to it.

2. Ignoring Your Target Audience
Too many brands try to appeal to everyone, which means they connect with no one. Deep audience research is the foundation of effective branding. Know who your customer is, what they value, and what keeps them up at night.

3. Chasing Trends Instead of Building Identity
Trends come and go. A brand built on a trend has a short shelf life. Focus on timeless brand values that reflect your genuine mission and personality.

4. Neglecting Brand Consistency in Visual Identity
Your colors, typography, imagery style, and overall aesthetic should work together cohesively. Visual inconsistency signals unprofessionalism and weakens recall.

5. Not Evolving With Your Market
The most enduring brands balance consistency with evolution. Review your brand positioning annually to ensure it still resonates with your audience and competitive landscape.

Ready to audit your brand? Reach out to Siren Communication for a free brand health check.`,
      coverImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
      published: true,
      publishedAt: new Date("2026-05-15"),
      authorId: "author-saif",
      categoryId: "cat-branding",
    },
    {
      id: "post-2",
      title: "How to Build a Social Media Strategy That Actually Converts",
      slug: "social-media-strategy-that-converts",
      excerpt: "Learn how to move beyond vanity metrics and build a social media strategy focused on real business outcomes.",
      body: `Social media is one of the most powerful tools in modern marketing — but only when used strategically. Too many businesses post content without a clear goal and wonder why it doesn't drive sales.

Here's our framework for building a conversion-focused social media strategy.

Start With Your Goals
Every social media strategy must begin with clear, measurable goals. Are you trying to generate leads? Build brand awareness? Drive traffic to your website? Your content strategy will look very different depending on your answer.

Know Your Platforms
Not every platform is right for every business. B2B companies often see the best ROI on LinkedIn. Consumer brands might thrive on Instagram or TikTok. Research where your target audience spends their time.

Content Mix: The 70-20-10 Rule
70% of your content should provide value — educational, entertaining, or inspiring. 20% should be shared content from partners, clients, or industry voices. 10% can be promotional.

Engage, Don't Just Broadcast
Social media is a two-way conversation. Respond to comments, ask questions, run polls, and show up for your community. Brands that engage see dramatically higher organic reach.

Measure What Matters
Track metrics that tie directly to your business goals: click-through rates, lead form submissions, conversion rates. Not just likes and followers.

Consistency is the secret sauce. A modest, consistent presence beats sporadic bursts of activity every time.`,
      coverImage: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
      published: true,
      publishedAt: new Date("2026-05-22"),
      authorId: "author-saif",
      categoryId: "cat-social",
    },
    {
      id: "post-3",
      title: "Why Every Business in Bangladesh Needs a Digital Marketing Strategy in 2026",
      slug: "digital-marketing-bangladesh-2026",
      excerpt: "The digital landscape in Bangladesh is evolving rapidly. Here's why your business can't afford to ignore it.",
      body: `Bangladesh's digital economy has grown exponentially over the past five years. With over 70 million internet users and rapidly increasing smartphone penetration, the opportunity for digital marketing has never been greater.

Yet many businesses are still relying on traditional methods alone. Here's why that's a missed opportunity.

The Buyer Journey Has Gone Digital
Today's consumers research products online before making purchase decisions. If your business isn't visible in that digital discovery phase, you're losing customers to competitors who are.

Social Media Is Where Your Customers Are
Bangladeshi consumers are highly active on Facebook, Instagram, and YouTube. These platforms offer unprecedented targeting capabilities — you can reach your exact ideal customer based on age, location, interests, and behavior.

E-commerce Is Booming
Online shopping has exploded in Bangladesh. Businesses that establish a strong digital presence and e-commerce capability are positioned to capture this growing market.

Data-Driven Decisions
Digital marketing gives you something traditional advertising never could: real-time data. You can see exactly how your campaigns are performing and optimize on the fly.

The Investment Is Accessible
Unlike traditional advertising, digital marketing offers options for every budget. You can start with a modest social media budget and scale as you see results.

The question isn't whether to invest in digital marketing. It's how quickly you can get started.`,
      coverImage: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&q=80",
      published: true,
      publishedAt: new Date("2026-06-01"),
      authorId: "author-saif",
      categoryId: "cat-marketing",
    },
    {
      id: "post-4",
      title: "The Power of Influencer Marketing: A 2026 Guide for Bangladesh Brands",
      slug: "influencer-marketing-guide-bangladesh-2026",
      excerpt: "Influencer marketing has matured. Here's how to leverage it effectively to reach authentic audiences and drive real ROI.",
      body: `Influencer marketing has evolved far beyond celebrity endorsements. In 2026, the most effective influencer campaigns leverage micro and nano influencers with highly engaged, niche audiences.

What Makes Influencer Marketing Work
The power of influencer marketing lies in social proof and trust. When a creator your audience follows recommends a product, it carries far more weight than a traditional ad.

Choosing the Right Influencer
Follower count is less important than engagement rate and audience alignment. A nano influencer with 5,000 highly engaged followers in your target niche can deliver better results than a celebrity with 1 million passive followers.

Types of Influencer Content That Convert
- Authentic reviews and unboxings
- Day-in-the-life integrations
- Tutorial and how-to content
- Behind-the-scenes brand collaborations
- Live sessions and Q&As

Measuring ROI
Track unique discount codes, affiliate links, and UTM parameters to directly attribute sales to influencer campaigns. Track engagement, reach, and brand sentiment as secondary metrics.

Long-Term Relationships Win
The best influencer marketing programs build long-term ambassador relationships rather than one-off promotions. Consistency builds authentic association.

At Siren Communication, we manage the entire influencer process from identification to reporting. Get in touch to explore what's possible for your brand.`,
      coverImage: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80",
      published: true,
      publishedAt: new Date("2026-06-03"),
      authorId: "author-saif",
      categoryId: "cat-marketing",
    },
    {
      id: "post-5",
      title: "Video Marketing: Why Your Brand Needs Video Content in 2026",
      slug: "video-marketing-brand-content-2026",
      excerpt: "Video content dominates social feeds and search results. Here's how to develop a video strategy that elevates your brand.",
      body: `Video is the most consumed content format on the internet. By 2026, video is projected to account for over 80% of all internet traffic. If your brand isn't investing in video content, you're leaving enormous reach on the table.

Why Video Works
Video combines sight, sound, and motion to create immersive experiences that text and images simply can't match. It's the closest thing to an in-person brand experience.

Types of Video Content for Brands
- Brand films: tell your company story with emotion and clarity
- Product showcases: demonstrate features and benefits in action
- Customer testimonials: social proof in the most powerful format
- Educational content: build authority and trust in your niche
- Short-form social content: reels, shorts, and TikToks for discoverability

Production Quality Matters
You don't need a Hollywood budget, but quality matters. Poor audio, shaky footage, and bad lighting signal unprofessionalism. Partner with a production team that understands both storytelling and brand values.

Distribution Strategy
Creating great video is only half the battle. Distribution matters equally. Optimize for each platform's algorithm, use compelling thumbnails, write strong descriptions, and repurpose your video content across channels.

At Siren Communication, we offer full-service video production — from concept and scripting to filming, editing, and distribution strategy.`,
      coverImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
      published: true,
      publishedAt: new Date("2026-06-04"),
      authorId: "author-saif",
      categoryId: "cat-branding",
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log(`✅  ${posts.length} blog posts seeded`);

  // Client logos (placeholder)
  const logos = [
    { id: "logo-1", name: "Brand One", imageUrl: "https://via.placeholder.com/120x60/0d9488/ffffff?text=Brand+1", order: 1 },
    { id: "logo-2", name: "Company Two", imageUrl: "https://via.placeholder.com/120x60/0f766e/ffffff?text=Co+2", order: 2 },
    { id: "logo-3", name: "Enterprise Three", imageUrl: "https://via.placeholder.com/120x60/134e4a/ffffff?text=Ent+3", order: 3 },
    { id: "logo-4", name: "Startup Four", imageUrl: "https://via.placeholder.com/120x60/115e59/ffffff?text=Start+4", order: 4 },
    { id: "logo-5", name: "Corp Five", imageUrl: "https://via.placeholder.com/120x60/14b8a6/000000?text=Corp+5", order: 5 },
    { id: "logo-6", name: "Group Six", imageUrl: "https://via.placeholder.com/120x60/0d9488/ffffff?text=Group+6", order: 6 },
  ];

  for (const logo of logos) {
    await prisma.clientLogo.upsert({
      where: { id: logo.id },
      update: {},
      create: logo,
    });
  }
  console.log(`✅  ${logos.length} client logos seeded`);

  console.log("\n🎉  Seed complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Admin URL:      http://localhost:3000/admin`);
  console.log(`Admin email:    admin@sirenbd.com`);
  console.log(`Admin password: ${plainPassword}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
