/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require("path");
// const { createFilePath } = require("gatsby-source-filesystem");

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___sequence], order: DESC }
        ) {
          nodes {
            frontmatter {
              sequence
              imdb_id
              slug
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  // Create Review pages
  // result.data.allReviewsJson.nodes.forEach((node) => {
  //   createPage({
  //     path: `/reviews/${node.slug}/`,
  //     component: path.resolve("./src/templates/review.jsx"),
  //     context: {
  //       slug: node.slug,
  //       backdrop: `${node.slug}.png`,
  //     },
  //   });
  // });

  // Create home pages
  const updates = result.data.allMarkdownRemark.nodes;
  const perPage = 20;
  const numPages = Math.ceil(updates.length / perPage);
  Array.from({ length: numPages }).forEach((_, i) => {
    const skip = i * perPage;
    const imdbIds = updates
      .slice(skip, skip * perPage || perPage)
      .filter((update) => update.frontmatter.imdb_id)
      .map((update) => update.frontmatter.imdb_id);

    createPage({
      path: i === 0 ? `/` : `/page-${i + 1}/`,
      component: path.resolve("./src/templates/home.jsx"),
      context: {
        limit: perPage,
        skip,
        numberOfItems: updates.length,
        currentPage: i + 1,
        imdbIds,
      },
    });
  });
};

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;
  const typeDefs = [
    schema.buildObjectType({
      name: "MarkdownRemark",
      interfaces: ["Node"],
      fields: {
        backdrop: {
          type: "File",
          resolve: (source, args, context) => {
            if (!source || !source.frontmatter || !source.frontmatter.slug) {
              return null;
            }

            const backdropPath = path.resolve(
              `./content/assets/backdrops/${source.frontmatter.slug}.png`
            );

            if (!backdropPath) {
              return null;
            }

            return context.nodeModel
              .getAllNodes({ type: "File" })
              .find((node) => node.absolutePath === backdropPath);
          },
        },
      },
    }),
  ];

  createTypes(typeDefs);
};
