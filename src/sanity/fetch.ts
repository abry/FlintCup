import "server-only";

import type { QueryParams } from "next-sanity";

import { sanityClient } from "./client";

export async function sanityFetch<QueryResult>(
  query: string,
  params: QueryParams = {},
  tags: string[] = [],
): Promise<QueryResult> {
  return sanityClient.fetch<QueryResult>(query, params, {
    next: { revalidate: 60, tags },
  });
}
