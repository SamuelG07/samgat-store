import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  product?: {
    name: string;
    description: string;
    price: number;
    image: string;
    sku: string;
    inStock: boolean;
  };
}

const DEFAULT_TITLE = 'Samgat Store — Loja Virtual em Angola';
const DEFAULT_DESC = 'A sua loja virtual em Angola. Produtos selecionados, compra segura e entrega em todo o país.';
const SITE_URL = 'https://samgat-store.onrender.com';

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  image,
  url = SITE_URL,
  type = 'website',
  product,
}: SEOProps) {
  const fullTitle = title.includes('Samgat') ? title : `${title} | Samgat Store`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Samgat Store" />
      <meta property="og:locale" content="pt_AO" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      {product && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.image,
            sku: product.sku,
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'AOA',
              availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url,
            },
          })}
        </script>
      )}
    </Helmet>
  );
}
