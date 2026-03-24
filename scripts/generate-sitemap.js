import fs from 'fs';
import path from 'path';

const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'orbit-ship-eco-ine72.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '8c8aad58546f9c3b6d65d957025959b1';
const SITE_URL = 'https://orbitabags.cl';

const PRODUCTS_QUERY = `
  query GetAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          handle
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

async function fetchAllProductHandles() {
  const handles = [];
  let hasNextPage = true;
  let after = null;

  while (hasNextPage) {
    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query: PRODUCTS_QUERY,
        variables: { first: 50, after },
      }),
    });

    if (!response.ok) {
      console.warn(`Shopify API returned ${response.status}, generating sitemap without products.`);
      return handles;
    }

    const data = await response.json();
    if (data.errors) {
      console.warn('Shopify API errors:', data.errors);
      return handles;
    }

    const edges = data.data.products.edges;
    for (const edge of edges) {
      handles.push({
        handle: edge.node.handle,
        updatedAt: edge.node.updatedAt,
      });
    }

    hasNextPage = data.data.products.pageInfo.hasNextPage;
    after = data.data.products.pageInfo.endCursor;
  }

  return handles;
}

function buildSitemap(products) {
  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/tienda', priority: '0.8', changefreq: 'weekly' },
    { loc: '/equipo', priority: '0.8', changefreq: 'monthly' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  for (const page of staticPages) {
    xml += `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  for (const product of products) {
    const lastmod = product.updatedAt ? product.updatedAt.split('T')[0] : today;
    xml += `  <url>
    <loc>${SITE_URL}/shop/${product.handle}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  xml += `</urlset>
`;

  return xml;
}

async function main() {
  console.log('🗺️  Generating sitemap...');
  const products = await fetchAllProductHandles();
  console.log(`   Found ${products.length} products`);

  const sitemap = buildSitemap(products);
  const outPath = path.resolve('public/sitemap.xml');
  fs.writeFileSync(outPath, sitemap, 'utf-8');
  console.log(`✅ Sitemap written to ${outPath}`);
}

main().catch((err) => {
  console.error('Failed to generate sitemap:', err);
  process.exit(1);
});
