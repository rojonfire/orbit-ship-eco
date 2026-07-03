import { Helmet } from "react-helmet-async";

const SITE_URL = "https://orbitabags.cl";
const DEFAULT_OG_IMAGE = "https://orbitabags.cl/og-image.png";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: string;
  jsonLd?: object;
}

const SEOHead = ({ title, description, path, ogImage = DEFAULT_OG_IMAGE, type = "website", jsonLd }: SEOHeadProps) => {
  // Con slash final, igual que las URLs que sirve Cloudflare Pages y el canonical estático
  const url = path === "/" || path.endsWith("/") ? `${SITE_URL}${path}` : `${SITE_URL}${path}/`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="es_CL" />
      <meta property="og:site_name" content="ORBITA BAGS" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@orbitabags" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
