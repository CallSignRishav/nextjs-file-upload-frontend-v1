import { createDirectus, rest, graphql } from "@directus/sdk";

interface BlogPost {
  id: string;
  img: string;
  caption: string;
}

interface Schema {
  blogPosts: BlogPost[];
}

// Client with REST support
export const sdk = createDirectus<Schema>("http://localhost:8055").with(rest());
