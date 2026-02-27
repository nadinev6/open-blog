# 📝 Publishing to Your Custom Blog

This blog is built with React and Vite, designed to be easily updated via Markdown and a constants file.

## 1. Update the Article Content
The main article content is stored in a single Markdown file.
- **File Path**: `/public/content/post.md`
- **How to edit**: Simply replace the text in this file with your new article. Standard Markdown (headings, lists, code blocks) is supported.

## 2. Update Blog Metadata
To change the author name, social links, blog title, or category, edit the constants file.
- **File Path**: `/src/constants.ts`
- **Fields to update**:
  - `blogTitle`: The main headline.
  - `blogCategory`: e.g., "Engineering", "Case Studies".
  - `blogSeries`: e.g., "1688 Series".
  - `blogDate`: Publication date.
  - `blogReadTime`: Estimated reading time.
  - `editUrl`: The direct GitHub link for the "Edit on GitHub" footer link.

## 3. Handling Images
- **Header Image**: For the best look, use a header image with dimensions of **1600x900px** (or a 16:9 aspect ratio).
- **Drag & Drop**: If you drag images into the GitHub editor while editing `post.md`, GitHub will generate a URL. Use that URL in your Markdown: `![Alt Text](https://github.com/...)`.
- **Local Images**: Place image files in the `/public` folder and reference them with a leading slash: `![Alt Text](/my-image.png)`.

## 4. RSS Feed & Cross-Posting to dev.to

### RSS Feed Generation
The blog automatically generates an RSS feed during the build process.

- **Feed URL**: `https://lingo-bridge.vercel.app/rss.xml`
- **Generated File**: `/public/rss.xml`
- **Script**: `/scripts/generate-rss.mjs`

### Adding New Posts to RSS
Edit the `POSTS` array in `/scripts/generate-rss.mjs`:

```javascript
const POSTS = [
  {
    title: "Your New Post Title",
    description: "A brief description for the feed",
    path: "/content/new-post.md",
    url: "/new-post",
    date: "2026-03-01",
    categories: ["Category", "Series Name"],
  },
  // ...existing posts
];
```

### Cross-Posting to dev.to
1. Go to [dev.to/settings/extensions](https://dev.to/settings/extensions)
2. Under "Publishing to dev.to from RSS", enter your feed URL
3. dev.to will automatically import new posts when published

### Manual RSS Generation
```bash
npm run generate:rss
```

## 5. Deploying to GitHub Pages
1. **Push Changes**: Commit and push your changes to your GitHub repository.
2. **Build & Deploy**:
   - If you have a GitHub Action set up (recommended), it will deploy automatically.
   - Otherwise, run `npm run build` and upload the contents of the `dist` folder to your `gh-pages` branch.

---
*Built for those who refuse to be censored.*
