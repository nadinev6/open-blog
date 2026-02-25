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

## 4. Deploying to GitHub Pages
1. **Push Changes**: Commit and push your changes to your GitHub repository.
2. **Build & Deploy**:
   - If you have a GitHub Action set up (recommended), it will deploy automatically.
   - Otherwise, run `npm run build` and upload the contents of the `dist` folder to your `gh-pages` branch.

---
*Built for those who refuse to be censored.*
