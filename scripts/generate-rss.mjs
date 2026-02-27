import fs from 'node:fs';
import path from 'node:path';

// Blog configuration - should match src/constants.ts
const BLOG_CONFIG = {
  title: "Lingo Bridge Blog",
  description: "Documenting the journey of building the world's most accurate localisation engine for cross-border commerce.",
  siteUrl: "https://lingo-bridge.vercel.app",
  author: "Nadine van der Haar",
  language: "en-GB",
};

// Post metadata - update this when adding new posts
const POSTS = [
  {
    title: "Bridging the Semantic Gap in Multi-Token Retrieval Pipelines",
    description: "How semantic bundling and a 4-stage pipeline eliminates drift in CJK language procurement from 1688.",
    path: "/content/post.md",
    url: "/", // Relative to siteUrl
    date: "2026-02-25",
    categories: ["Case Studies", "1688 Series"],
  },
  // Add more posts here as you create them
];

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '\x26amp;')
    .replace(/</g, '\x26lt;')
    .replace(/>/g, '\x26gt;')
    .replace(/"/g, '\x26quot;')
    .replace(/'/g, '\x26apos;');
}

function formatDateToRFC822(dateString) {
  const date = new Date(dateString);
  return date.toUTCString();
}

function generateRSS() {
  const items = POSTS.map((post) => {
    const contentPath = path.join(process.cwd(), "public", post.path);
    let content = "";
    
    try {
      content = fs.readFileSync(contentPath, "utf-8");
    } catch (error) {
      console.warn(`Warning: Could not read content from ${contentPath}`);
    }

    // Create a description from the first paragraph if not provided
    const description = post.description || content.slice(0, 300).replace(/[#*`\[\]]/g, '').trim() + "...";

    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BLOG_CONFIG.siteUrl}${post.url}</link>
      <guid isPermaLink="true">${BLOG_CONFIG.siteUrl}${post.url}</guid>
      <pubDate>${formatDateToRFC822(post.date)}</pubDate>
      <author>${escapeXml(BLOG_CONFIG.author)}</author>
      <description>${escapeXml(description)}</description>
      ${post.categories.map(cat => `<category>${escapeXml(cat)}</category>`).join('\n      ')}
      <content:encoded><![CDATA[${content}]]></content:encoded>
    </item>`;
  }).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(BLOG_CONFIG.title)}</title>
    <link>${BLOG_CONFIG.siteUrl}</link>
    <atom:link href="${BLOG_CONFIG.siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(BLOG_CONFIG.description)}</description>
    <language>${BLOG_CONFIG.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Lingo Bridge RSS Generator</generator>
    <webMaster>hi@pixel-geist.co.za (${escapeXml(BLOG_CONFIG.author)})</webMaster>
    <managingEditor>hi@pixel-geist.co.za (${escapeXml(BLOG_CONFIG.author)})</managingEditor>
    <image>
      <url>https://i.imghippo.com/files/FRin4845Nys.png</url>
      <title>${escapeXml(BLOG_CONFIG.title)}</title>
      <link>${BLOG_CONFIG.siteUrl}</link>
    </image>
${items}
  </channel>
</rss>`;

  return rss;
}

// Main execution
const outputPath = path.join(process.cwd(), "public", "rss.xml");
const rssContent = generateRSS();

fs.writeFileSync(outputPath, rssContent, "utf-8");
console.log(`✅ RSS feed generated at: ${outputPath}`);
console.log(`📡 Feed URL: ${BLOG_CONFIG.siteUrl}/rss.xml`);
console.log(`📝 Posts included: ${POSTS.length}`);
