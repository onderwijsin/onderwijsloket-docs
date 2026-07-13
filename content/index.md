---
seo:
  title: Onderwijsloket API documentation
  description: Build reliable integrations with Onderwijsloket content, search, media, and guidance services.
---

::u-page-hero
#title
Build with the <span class="text-primary">Onderwijsloket</span> API

#description
Integrate trusted information about working in Dutch education into your product. Use our Directus API for content, Algolia for instant search, and Cloudinary for media.

#links
  :::u-button{color="primary" size="xl" to="/getting-started" trailing-icon="i-lucide-arrow-right"}
  Start building
  :::

  :::u-button{color="neutral" size="xl" to="/api-reference" variant="outline" icon="i-lucide-code-xml"}
  Explore the API
  :::
::

::u-page-section
#title
Choose the integration that fits your product

#features
  :::u-page-feature{icon="i-simple-icons-directus" to="/directus/your-first-request"}
  #title
  Retrieve structured content

  #description
  Query articles, FAQs, programmes, routes, and their relationships through the Directus API.
  :::

  :::u-page-feature{icon="i-simple-icons-algolia" to="/search/setting-up-a-client"}
  #title
  Build fast search experiences

  #description
  Search curated indexes, add filters and facets, or implement geo-search for education programmes.
  :::

  :::u-page-feature{icon="i-lucide-image" to="/misc/cloudinary"}
  #title
  Deliver optimised media

  #description
  Turn Directus asset IDs into public Cloudinary URLs, with the transformations your interface needs.
  :::
::

::u-page-section
#title
Work from reliable building blocks

#description
Start with a token, make a small request, then use the data model and copy-paste examples to grow your integration safely.

#features
  :::u-page-feature{icon="i-lucide-key-round" to="/directus/authentication"}
  #title
  Authenticate safely

  #description
  Keep a static token on the server and send it in an Authorization header.
  :::

  :::u-page-feature{icon="i-lucide-database" to="/data-model/data-model-overview"}
  #title
  Understand the data

  #description
  Learn which collections hold content, how their relationships work, and which fields are searchable.
  :::

  :::u-page-feature{icon="i-lucide-book-open-check" to="/misc/content-documents"}
  #title
  Render rich documents

  #description
  Process Tiptap JSON and resolve its relational custom nodes in your own frontend.
  :::
::
