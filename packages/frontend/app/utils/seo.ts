import type { LinkDescriptor, MetaDescriptor } from "react-router";

import type { OpenGraphMedia, SeoConfig } from "./seo-types";

const defaults = {
  defaultOpenGraphImageHeight: 0,
  defaultOpenGraphImageWidth: 0,
  defaultOpenGraphVideoHeight: 0,
  defaultOpenGraphVideoWidth: 0,
  nofollow: false,
  noindex: false,
  norobots: false,
  templateTitle: "",
};

const buildOpenGraphMediaTags = (
  mediaType: "image" | "video" | "audio",
  media: ReadonlyArray<OpenGraphMedia> = [],
  {
    defaultHeight,
    defaultWidth,
  }: { defaultHeight?: number; defaultWidth?: number } = {},
) => {
  return media.reduce((tags, medium) => {
    tags.push({
      content: medium.url,
      name: `og:${mediaType}`,
    });

    if (medium.alt) {
      tags.push({
        content: medium.alt,
        name: `og:${mediaType}:alt`,
      });
    }

    if (medium.secureUrl) {
      tags.push({
        content: medium.secureUrl.toString(),
        name: `og:${mediaType}:secure_url`,
      });
    }

    if (medium.type) {
      tags.push({
        content: medium.type.toString(),
        name: `og:${mediaType}:type`,
      });
    }

    if (medium.width) {
      tags.push({
        content: medium.width.toString(),
        name: `og:${mediaType}:width`,
      });
    } else if (defaultWidth) {
      tags.push({
        content: defaultWidth.toString(),
        name: `og:${mediaType}:width`,
      });
    }

    if (medium.height) {
      tags.push({
        content: medium.height.toString(),
        name: `og:${mediaType}:height`,
      });
    } else if (defaultHeight) {
      tags.push({
        content: defaultHeight.toString(),
        name: `og:${mediaType}:height`,
      });
    }

    return tags;
  }, [] as MetaDescriptor[]);
};

export const seo = (config?: SeoConfig) => {
  const metaTags: MetaDescriptor[] = [];
  const linkTags: LinkDescriptor[] = [];

  if (config?.titleTemplate) {
    defaults.templateTitle = config.titleTemplate;
  }

  let updatedTitle = "";
  if (config?.title) {
    updatedTitle = config.title;
    if (defaults.templateTitle) {
      updatedTitle = defaults.templateTitle.replace(/%s/g, () => updatedTitle);
    }
  } else if (config?.defaultTitle) {
    updatedTitle = config.defaultTitle;
  }

  if (updatedTitle) {
    metaTags.push({ title: updatedTitle });
  }

  const noindex =
    config?.noindex === undefined
      ? defaults.noindex || config?.dangerouslySetAllPagesToNoIndex
      : config.noindex;

  const nofollow =
    config?.nofollow === undefined
      ? defaults.nofollow || config?.dangerouslySetAllPagesToNoFollow
      : config.nofollow;

  const norobots = config?.norobots || defaults.norobots;

  let robotsParams = "";

  if (config?.robotsProps) {
    const {
      maxImagePreview,
      maxSnippet,
      maxVideoPreview,
      noarchive,
      noimageindex,
      nosnippet,
      notranslate,
      unavailableAfter,
    } = config.robotsProps;

    robotsParams = `${nosnippet ? ",nosnippet" : ""}${
      maxSnippet ? `,max-snippet:${maxSnippet}` : ""
    }${maxImagePreview ? `,max-image-preview:${maxImagePreview}` : ""}${
      noarchive ? ",noarchive" : ""
    }${unavailableAfter ? `,unavailable_after:${unavailableAfter}` : ""}${
      noimageindex ? ",noimageindex" : ""
    }${maxVideoPreview ? `,max-video-preview:${maxVideoPreview}` : ""}${
      notranslate ? ",notranslate" : ""
    }`;
  }

  if (config?.norobots) {
    defaults.norobots = true;
  }

  if (noindex || nofollow) {
    if (config?.dangerouslySetAllPagesToNoIndex) {
      defaults.noindex = true;
    }
    if (config?.dangerouslySetAllPagesToNoFollow) {
      defaults.nofollow = true;
    }

    metaTags.push({
      content: `${noindex ? "noindex" : "index"},${nofollow ? "nofollow" : "follow"}${robotsParams}`,
      name: "robots",
    });
  } else if (!norobots || robotsParams) {
    metaTags.push({
      content: `index,follow${robotsParams}`,
      name: "robots",
    });
  }

  if (config?.description) {
    metaTags.push({
      content: config.description,
      name: "description",
    });
  }

  if (config?.themeColor) {
    metaTags.push({
      content: config.themeColor,
      name: "theme-color",
    });
  }

  if (config?.mobileAlternate) {
    metaTags.push({
      href: config.mobileAlternate.href,
      media: config.mobileAlternate.media,
      rel: "alternate",
    });
  }

  if (config?.languageAlternates && config.languageAlternates.length > 0) {
    config.languageAlternates.forEach((languageAlternate) => {
      metaTags.push({
        href: languageAlternate.href,
        hrefLang: languageAlternate.hrefLang,
        rel: "alternate",
      });
    });
  }

  if (config?.twitter) {
    if (config?.twitter.cardType) {
      metaTags.push({
        content: config.twitter.cardType,
        name: "twitter:card",
      });
    }

    if (config?.twitter.site) {
      metaTags.push({
        content: config.twitter.site,
        name: "twitter:site",
      });
    }

    if (config?.twitter.handle) {
      metaTags.push({
        content: config.twitter.handle,
        name: "twitter:creator",
      });
    }
  }

  if (config?.facebook) {
    if (config?.facebook.appId) {
      metaTags.push({
        content: config.facebook.appId,
        name: "fb:app_id",
      });
    }
  }

  if (config?.openGraph?.title || updatedTitle) {
    metaTags.push({
      content: config?.openGraph?.title || updatedTitle,
      name: "og:title",
    });
  }

  if (config?.openGraph?.description || config?.description) {
    metaTags.push({
      content: config.openGraph?.description || config.description,
      name: "og:description",
    });
  }

  if (config?.openGraph) {
    if (config?.openGraph.url || config.canonical) {
      metaTags.push({
        content: config.openGraph.url || config.canonical,
        name: "og:url",
      });
    }

    if (config?.openGraph.type) {
      const type = config.openGraph.type.toLowerCase();

      metaTags.push({
        content: type,
        name: "og:type",
      });

      if (type === "profile" && config.openGraph.profile) {
        if (config?.openGraph.profile.firstName) {
          metaTags.push({
            content: config.openGraph.profile.firstName,
            name: "profile:first_name",
          });
        }

        if (config?.openGraph.profile.lastName) {
          metaTags.push({
            content: config.openGraph.profile.lastName,
            name: "profile:last_name",
          });
        }

        if (config?.openGraph.profile.username) {
          metaTags.push({
            content: config.openGraph.profile.username,
            name: "profile:username",
          });
        }

        if (config?.openGraph.profile.gender) {
          metaTags.push({
            content: config.openGraph.profile.gender,
            name: "profile:gender",
          });
        }
      } else if (type === "book" && config.openGraph.book) {
        if (
          config.openGraph.book.authors &&
          config.openGraph.book.authors.length
        ) {
          config.openGraph.book.authors.forEach((author) => {
            metaTags.push({
              content: author,
              name: "book:author",
            });
          });
        }

        if (config?.openGraph.book.isbn) {
          metaTags.push({
            content: config.openGraph.book.isbn,
            name: "book:isbn",
          });
        }

        if (config?.openGraph.book.releaseDate) {
          metaTags.push({
            content: config.openGraph.book.releaseDate,
            name: "book:release_date",
          });
        }

        if (config?.openGraph.book.tags && config.openGraph.book.tags.length) {
          config.openGraph.book.tags.forEach((tag) => {
            metaTags.push({
              content: tag,
              name: "book:tag",
            });
          });
        }
      } else if (type === "article" && config.openGraph.article) {
        if (config?.openGraph.article.publishedTime) {
          metaTags.push({
            content: config.openGraph.article.publishedTime,
            name: "article:published_time",
          });
        }

        if (config?.openGraph.article.modifiedTime) {
          metaTags.push({
            content: config.openGraph.article.modifiedTime,
            name: "article:modified_time",
          });
        }

        if (config?.openGraph.article.expirationTime) {
          metaTags.push({
            content: config.openGraph.article.expirationTime,
            name: "article:expiration_time",
          });
        }

        if (
          config.openGraph.article.authors &&
          config.openGraph.article.authors.length
        ) {
          config.openGraph.article.authors.forEach((author) => {
            metaTags.push({
              content: author,
              name: "article:author",
            });
          });
        }

        if (config?.openGraph.article.section) {
          metaTags.push({
            content: config.openGraph.article.section,
            name: "article:section",
          });
        }

        if (
          config.openGraph.article.tags &&
          config.openGraph.article.tags.length
        ) {
          config.openGraph.article.tags.forEach((tag) => {
            metaTags.push({
              content: tag,
              name: "article:tag",
            });
          });
        }
      } else if (
        (type === "video.movie" ||
          type === "video.episode" ||
          type === "video.tv_show" ||
          type === "video.other") &&
        config.openGraph.video
      ) {
        if (
          config.openGraph.video.actors &&
          config.openGraph.video.actors.length
        ) {
          config.openGraph.video.actors.forEach((actor) => {
            if (actor.profile) {
              metaTags.push({
                content: actor.profile,
                name: "video:actor",
              });
            }

            if (actor.role) {
              metaTags.push({
                content: actor.role,
                name: "video:actor:role",
              });
            }
          });
        }

        if (
          config.openGraph.video.directors &&
          config.openGraph.video.directors.length
        ) {
          config.openGraph.video.directors.forEach((director) => {
            metaTags.push({
              content: director,
              name: "video:director",
            });
          });
        }

        if (
          config.openGraph.video.writers &&
          config.openGraph.video.writers.length
        ) {
          config.openGraph.video.writers.forEach((writer) => {
            metaTags.push({
              content: writer,
              name: "video:writer",
            });
          });
        }

        if (config?.openGraph.video.duration) {
          metaTags.push({
            content: config.openGraph.video.duration.toString(),
            name: "video:duration",
          });
        }

        if (config?.openGraph.video.releaseDate) {
          metaTags.push({
            content: config.openGraph.video.releaseDate,
            name: "video:release_date",
          });
        }

        if (
          config?.openGraph.video.tags &&
          config.openGraph.video.tags.length
        ) {
          config.openGraph.video.tags.forEach((tag) => {
            metaTags.push({
              content: tag,
              name: "video:tag",
            });
          });
        }

        if (config?.openGraph.video.series) {
          metaTags.push({
            content: config.openGraph.video.series,
            name: "video:series",
          });
        }
      }
    }

    // images
    if (config?.defaultOpenGraphImageWidth) {
      defaults.defaultOpenGraphImageWidth = config.defaultOpenGraphImageWidth;
    }

    if (config?.defaultOpenGraphImageHeight) {
      defaults.defaultOpenGraphImageHeight = config.defaultOpenGraphImageHeight;
    }

    if (config?.openGraph.images && config.openGraph.images.length) {
      metaTags.push(
        ...buildOpenGraphMediaTags("image", config.openGraph.images, {
          defaultWidth: defaults.defaultOpenGraphImageWidth,
          defaultHeight: defaults.defaultOpenGraphImageHeight,
        }),
      );
    }

    // videos
    if (config?.defaultOpenGraphVideoWidth) {
      defaults.defaultOpenGraphVideoWidth = config.defaultOpenGraphVideoWidth;
    }

    if (config?.defaultOpenGraphVideoHeight) {
      defaults.defaultOpenGraphVideoHeight = config.defaultOpenGraphVideoHeight;
    }

    if (config?.openGraph.videos && config.openGraph.videos.length) {
      metaTags.push(
        ...buildOpenGraphMediaTags("video", config.openGraph.videos, {
          defaultWidth: defaults.defaultOpenGraphVideoWidth,
          defaultHeight: defaults.defaultOpenGraphVideoHeight,
        }),
      );
    }

    // audio
    if (config?.openGraph.audio) {
      metaTags.push(
        ...buildOpenGraphMediaTags("audio", config.openGraph.audio),
      );
    }

    if (config?.openGraph.locale) {
      metaTags.push({
        content: config.openGraph.locale,
        name: "og:locale",
      });
    }

    if (config?.openGraph.siteName) {
      metaTags.push({
        content: config.openGraph.siteName,
        name: "og:site_name",
      });
    }
  }

  if (config?.canonical) {
    linkTags.push({
      href: config.canonical,
      rel: "canonical",
    });
  }

  if (config?.additionalMetaTags?.length) {
    metaTags.push(...config.additionalMetaTags);
  }

  if (config?.additionalLinkTags?.length) {
    linkTags.push(
      ...config.additionalLinkTags.map(({ crossOrigin, ...rest }) => ({
        ...rest,
        crossOrigin: (crossOrigin ?? "anonymous") as
          | "anonymous"
          | "use-credentials",
      })),
    );
  }

  return { metaTags, linkTags };
};
