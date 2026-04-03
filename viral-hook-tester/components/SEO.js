import Head from 'next/head';

const SITE_URL = 'https://hook-generator-tau.vercel.app';
const SITE_NAME = 'HookLab';
const DEFAULT_DESC = 'Generate scroll-stopping hooks, polish your drafts, and study proven hook blueprints. Free to start, no signup.';
const OG_IMAGE = `${SITE_URL}/og.png`;

export default function SEO({ title, description, path = '' }) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - AI Hook Tools for Creators`;
  const pageDesc = description || DEFAULT_DESC;
  const url = `${SITE_URL}${path}`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={OG_IMAGE} />

      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Head>
  );
    }
