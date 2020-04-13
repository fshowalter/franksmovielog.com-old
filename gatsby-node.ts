import { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
import { resolve } from "path";

import { BuildPagesQuery } from "./graphql-types";

export const createPages: GatsbyNode["createPages"] = async function createPages({
  graphql,
  actions,
}) {
  const { createPage } = actions;
  await graphql(
    `
      query BuildPages {
        allMarkdownRemark(
          filter: { fileAbsolutePath: { regex: "/reviews/" } }
          sort: { fields: [frontmatter___sequence], order: DESC }
        ) {
          edges {
            node {
              frontmatter {
                slug
              }
            }
          }
        }
      }
    `
  ).then((result) => {
    const resultData = result.data as BuildPagesQuery;
    const reviewEdges = resultData.allMarkdownRemark.edges;

    // Create Review pages
    reviewEdges.forEach(({ node }) => {
      createPage({
        path: `/reviews/${node.frontmatter?.slug}`,
        component: require.resolve("./src/templates/Review.tsx"),
        context: {
          slug: node.frontmatter?.slug,
          backdrop: `${node.frontmatter?.slug}.png`,
        },
      });
    });

    // Create Home pages
    const reviewsPerPage = 20;
    const numPages = Math.ceil(reviewEdges.length / reviewsPerPage);
    Array.from({ length: numPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/` : `/page-${i + 1}`,
        component: require.resolve("./src/templates/Home.tsx"),
        context: {
          limit: reviewsPerPage,
          skip: i * reviewsPerPage,
          numPages,
          currentPage: i + 1,
        },
      });
    });
  });
};

interface MarkdownNode {
  frontmatter?: {
    slug?: string;
  };
  absolutePath: string;
}

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  actions,
  getNode,
  getNodes,
}) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });

    const markdownNode = node as MarkdownNode;
    const backdropPath = resolve(
      `./src/assets/backdrops/${markdownNode.frontmatter?.slug}.png`
    );

    const fileNode = getNodes().find(
      (node: MarkdownNode) => node.absolutePath === backdropPath
    );
    const fileNodeId = fileNode ? fileNode.id : null;
    createNodeField({
      name: "backdrop___NODE",
      node,
      value: fileNodeId,
    });
  }
};
