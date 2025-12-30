import type { MetaDescriptor } from "react-router";

interface Params {
  title: string;
  description: string;
  pathname: string;
}

export function makeMetaTags({
  title,
  description,
  pathname,
}: Params): MetaDescriptor[] {
  return [
    { title },
    {
      name: "description",
      content: description,
    },
    {
      property: "og:title",
      content: title,
    },
    {
      property: "og:description",
      content: description,
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: `${import.meta.env.VITE_CANONICAL_URL}${pathname}`,
    },
    {
      property: "og:image",
      content: `${import.meta.env.VITE_CANONICAL_URL}/og-image.png`,
    },
  ];
}
