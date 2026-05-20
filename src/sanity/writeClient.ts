import "server-only";

import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./env";

let cached: SanityClient | null = null;

export function getSanityWriteClient(): SanityClient {
  if (cached) return cached;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "Missing SANITY_API_WRITE_TOKEN — set it in .env.local (Editor or Administrator role).",
    );
  }
  cached = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });
  return cached;
}
