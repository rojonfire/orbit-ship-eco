import { toast } from "sonner";

// Shopify Storefront API Configuration
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'orbit-ship-eco-ine72.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '0f1baa11db92ba644f2cc8265224719a';

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

// Storefront API helper function
export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Shopify API access requires an active Shopify billing plan."
    });
    return null;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  return data;
}

// GraphQL query to fetch products
const STOREFRONT_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

// Fetch products from Shopify
export async function fetchShopifyProducts(first: number = 10, query?: string): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(STOREFRONT_QUERY, { first, query });
  if (!data) return [];
  return data.data.products.edges;
}

// GraphQL query to fetch single product by handle
const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

export interface RetailPackVariant {
  id: string;
  color: string;
  price: string;
  availableForSale: boolean;
}

export interface RetailPackBundle {
  units: number;
  variants: RetailPackVariant[];
}

const RETAIL_PACK_BUNDLES_QUERY = `
  query GetRetailPackBundles($query: String!) {
    products(first: 20, query: $query) {
      edges {
        node {
          title
          variants(first: 10) {
            edges {
              node {
                id
                title
                price { amount }
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

/** Trae los packs con descuento (300/500/1000) de un tamaño, ej. "30x40". El pack de 100 sigue
 * viniendo del producto real (fetchProductByHandle), estos son bundles aparte. */
export async function fetchRetailPackBundles(sizeLabel: string): Promise<RetailPackBundle[]> {
  const query = `title:'Bolsa Biodegradable ${sizeLabel} cm*'`;
  const data = await storefrontApiRequest(RETAIL_PACK_BUNDLES_QUERY, { query });
  if (!data) return [];

  const edges = data.data.products.edges as Array<{ node: { title: string; variants: { edges: Array<{ node: { id: string; title: string; price: { amount: string }; availableForSale: boolean } }> } } }>;

  return edges
    .map(({ node }) => {
      const match = node.title.match(/Pack (\d+)/);
      if (!match) return null;
      const units = parseInt(match[1], 10);
      const variants: RetailPackVariant[] = node.variants.edges.map((v) => ({
        id: v.node.id,
        color: v.node.title,
        price: v.node.price.amount,
        availableForSale: v.node.availableForSale,
      }));
      return { units, variants };
    })
    .filter((b): b is RetailPackBundle => b !== null)
    .sort((a, b) => a.units - b.units);
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  if (!data || !data.data.productByHandle) return null;
  return { node: data.data.productByHandle };
}

// Bolsas personalizadas: cada combinación de tramo de cantidad + N° de colores es un
// producto-bundle separado (Shopify Bundles no permite agregar una opción propia, solo
// hereda Color del producto real). El título codifica el tramo y los colores, ej.
// "Bolsas Personalizadas 30x40 - 200+ uds, 2 colores".
export type PersonalizadaTramo = '100-199' | '200+';

export interface PersonalizadaBundleVariant {
  id: string;
  color: string;
  price: string;
  availableForSale: boolean;
}

export interface PersonalizadaBundle {
  id: string;
  title: string;
  tramo: PersonalizadaTramo;
  nColores: number;
  variants: PersonalizadaBundleVariant[];
}

const PERSONALIZADA_BUNDLES_QUERY = `
  query GetPersonalizadaBundles($query: String!) {
    products(first: 20, query: $query) {
      edges {
        node {
          id
          title
          variants(first: 10) {
            edges {
              node {
                id
                title
                price { amount }
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

/** Trae los 8 bundles de personalizadas (2 tramos x 4 N° de colores) para un tamaño, ej. "30x40". */
export async function fetchPersonalizadaBundles(sizeLabel: string): Promise<PersonalizadaBundle[]> {
  const query = `title:'Bolsas Personalizadas ${sizeLabel} -*'`;
  const data = await storefrontApiRequest(PERSONALIZADA_BUNDLES_QUERY, { query });
  if (!data) return [];

  const edges = data.data.products.edges as Array<{ node: { id: string; title: string; variants: { edges: Array<{ node: { id: string; title: string; price: { amount: string }; availableForSale: boolean } }> } } }>;

  return edges
    .map(({ node }) => {
      const match = node.title.match(/(100-199|200\+)\s*uds,\s*(\d+)\s*color(?:es)?/i);
      if (!match) return null;
      const tramo = match[1] as PersonalizadaTramo;
      const nColores = parseInt(match[2], 10);
      const variants: PersonalizadaBundleVariant[] = node.variants.edges.map((v) => ({
        id: v.node.id,
        color: v.node.title,
        price: v.node.price.amount,
        availableForSale: v.node.availableForSale,
      }));
      return { id: node.id, title: node.title, tramo, nColores, variants };
    })
    .filter((b): b is PersonalizadaBundle => b !== null);
}

// Cart creation mutation
const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export interface CartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  lineAttributes?: Array<{
    key: string;
    value: string;
  }>;
}

// Create checkout function
export async function createStorefrontCheckout(
  items: CartItem[],
  attributes?: Array<{ key: string; value: string }>,
): Promise<string> {
  try {
    const lines = items.map(item => ({
      quantity: item.quantity,
      merchandiseId: item.variantId,
      ...(item.lineAttributes?.length ? { attributes: item.lineAttributes } : {}),
    }));

    const input: { lines: typeof lines; attributes?: typeof attributes } = { lines };
    if (attributes?.length) {
      input.attributes = attributes;
    }

    const cartData = await storefrontApiRequest(CART_CREATE_MUTATION, { input });

    if (!cartData) {
      throw new Error('Failed to create cart');
    }

    if (cartData.data.cartCreate.userErrors.length > 0) {
      throw new Error(`Cart creation failed: ${cartData.data.cartCreate.userErrors.map((e: { message: string }) => e.message).join(', ')}`);
    }

    const cart = cartData.data.cartCreate.cart;
    
    if (!cart.checkoutUrl) {
      throw new Error('No checkout URL returned from Shopify');
    }

    const url = new URL(cart.checkoutUrl);
    url.searchParams.set('channel', 'online_store');
    return url.toString();
  } catch (error) {
    console.error('Error creating storefront checkout:', error);
    throw error;
  }
}

// Format CLP currency
export const formatCLP = (amount: number | string) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(numAmount);
};
