import React from 'react'
import PropTypes from 'prop-types'
import { useSiteMetadata } from "../hooks/use-site-metadata"

function SEO({
  description,
  keywords,
  image,
  title,
  pathname,
}) {
  const meta = useSiteMetadata()
  const seo = {
    title: `${title} | ${meta.title}`,
    url: `${meta.siteUrl}${pathname || ''}`,
    description: description || meta.description,
    keywords: keywords || meta.keywords,
    author: meta.author,
    image,
  }

  return (
    <>
      <title>{seo.title}</title>
      <link rel="canonical" href={seo.url} />
      <meta name="keywords" content={seo.keywords.join(',')} />
      <meta name="description" content={seo.description} />

      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />

      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:creator" content={seo.author} />

      {/* TODO: img */}
      {seo.img ? <>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={seo.image.src} />
        <meta name="image" content={seo.image.src} />
        <meta property="og:image:width" content={seo.image.width} />
        <meta property="og:image:height" content={seo.image.height} />
      </> : null}
    </>
  )
}

export default SEO
