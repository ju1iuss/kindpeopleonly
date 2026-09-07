import { createClient } from "next-sanity";
import { isSanityConfigured, sanityEnv } from "./env";

export const sanityClient = isSanityConfigured()
  ? createClient({
      projectId: sanityEnv.projectId,
      dataset: sanityEnv.dataset,
      apiVersion: sanityEnv.apiVersion,
      useCdn: sanityEnv.useCdn,
    })
  : null;
