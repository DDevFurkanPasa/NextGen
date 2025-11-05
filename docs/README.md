# Strapi-NextGen Framework Documentation

This is the Nextra-based documentation site for Strapi-NextGen Framework.

## 🚀 Quick Start

### Install Dependencies

```bash
cd docs
npm install
```

### Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001)

## 📁 Structure

```
docs/
├── pages/              # Documentation content (MDX)
│   ├── index.mdx      # Homepage
│   ├── tutorials/     # Step-by-step guides
│   ├── api-reference/ # API documentation
│   ├── guides/        # How-to guides
│   └── concepts/      # Explanations & theory
├── public/            # Static assets
├── theme.config.jsx   # Nextra theme configuration
├── next.config.mjs    # Next.js configuration
└── package.json       # Dependencies
```

## 📝 Writing Documentation

### Adding a New Page

1. Create an MDX file in `pages/`:
   ```bash
   pages/guides/my-guide.mdx
   ```

2. Add it to `_meta.json`:
   ```json
   {
     "my-guide": "My Guide Title"
   }
   ```

3. Write content in MDX:
   ```mdx
   # My Guide
   
   Content here with **markdown** and `code`.
   
   ```tsx
   // Code blocks with syntax highlighting
   ```
   ```

### Using Nextra Features

#### Callouts

```mdx
import { Callout } from 'nextra/components'

<Callout type="warning">
  This is a warning callout
</Callout>

<Callout type="info">
  This is an info callout
</Callout>
```

#### Cards

```mdx
import { Cards, Card } from 'nextra/components'

<Cards>
  <Card title="Guide 1" href="/guides/guide-1" />
  <Card title="Guide 2" href="/guides/guide-2" />
</Cards>
```

#### Tabs

```mdx
import { Tabs, Tab } from 'nextra/components'

<Tabs items={['npm', 'yarn', 'pnpm']}>
  <Tab>npm install package</Tab>
  <Tab>yarn add package</Tab>
  <Tab>pnpm add package</Tab>
</Tabs>
```

#### Code Highlighting

```mdx
```tsx filename="app/page.tsx" {2,4}
import { strapi } from '@/lib/strapi';

export default async function Page() {
  const data = await strapi.getPage('home', GetHomePageDocument);
  return <div>{data.title}</div>;
}
\```
```

## 🎨 Customization

### Theme Configuration

Edit `theme.config.jsx`:

```jsx
export default {
  logo: <span>Your Logo</span>,
  project: {
    link: 'https://github.com/your-repo',
  },
  // ... more options
};
```

### Styling

Nextra uses Tailwind CSS. Add custom styles in `styles/globals.css`.

## 📤 Building for Production

### Build Static Site

```bash
npm run build
```

### Export Static HTML

```bash
npm run export
```

Output in `.next/` directory.

### Deploy

Deploy to any static hosting:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `.next/` folder
- **GitHub Pages**: Push to `gh-pages` branch
- **S3/CloudFront**: Upload `.next/` contents

## 🔍 Search

Nextra includes built-in search. No configuration needed!

## 🌐 i18n (Internationalization)

To add multiple languages:

1. Create language folders:
   ```
   pages/
   ├── en/
   └── es/
   ```

2. Configure in `next.config.mjs`:
   ```js
   i18n: {
     locales: ['en', 'es'],
     defaultLocale: 'en',
   }
   ```

## 📚 Resources

- [Nextra Documentation](https://nextra.site/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MDX Documentation](https://mdxjs.com/)

## 🐛 Troubleshooting

### TypeScript Errors

If you see TypeScript errors, run:

```bash
npm install
```

The error "No inputs were found in config file" will resolve after installing dependencies.

### Port Already in Use

If port 3001 is occupied:

```bash
npm run dev -- -p 3002
```

### Build Errors

Clear Next.js cache:

```bash
rm -rf .next
npm run build
```

## 📝 Content Guidelines

### Writing Style

- ✅ Use active voice
- ✅ Be concise and clear
- ✅ Include code examples
- ✅ Add troubleshooting sections
- ✅ Link to related pages

### Code Examples

- ✅ Show both good and bad examples
- ✅ Add comments for clarity
- ✅ Use TypeScript
- ✅ Include expected output

### Structure

Each page should have:
1. Clear title
2. Brief overview
3. Step-by-step instructions
4. Code examples
5. Troubleshooting
6. See also links

## 🚀 Contributing

To contribute to documentation:

1. Fork the repository
2. Create a branch
3. Add/update MDX files
4. Test locally (`npm run dev`)
5. Submit pull request

## 📄 License

GPL-3.0 © fuqom

---

**Need help?** Open an issue on [GitHub](https://github.com/DDevFurkanPasa/NextGen/issues)
