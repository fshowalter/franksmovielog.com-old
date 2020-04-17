const { createPages } = require("./src/gatsby/createPages");
const { resolve } = require("path");

/** @type { import("gatsby").GatsbyNode } */
const config = {};
exports.config = config;

config.createPages = createPages;
config.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;
  const typeDefs = [
    `type Movie implements Node {
      directors: [Director!] @link(by: "movie_imdb_id", from: "imdb_id")
      countries: MovieCountriesYaml! @link(by: "imdb_id", from: "imdb_id")
      viewings: [ViewingsYaml!] @link(by: "imdb_id", from: "imdb_id")
    }`,
    `type Review implements Node {
      id: ID!
      imdbId: String!
      sequence: String!
      slug: String!
      date: Date @dateformat
      grade: String
      movie: Movie! @link(by: "imdb_id", from: "imdbId")
      markdown: MarkdownRemark! @link(by: "frontmatter.imdb_id", from: "imdbId")
    }`,
    schema.buildObjectType({
      name: "MarkdownRemark",
      fields: {
        firstParagraph: {
          type: "String!",
          resolve: (source, args, context, info) => {
            return source.rawMarkdownBody
              ? source.rawMarkdownBody.trim().split("\n\n")[0]
              : "";
          },
        },
        backdrop: {
          type: "File",
          resolve: (source, args, context, info) => {
            if (!source.frontmatter || !source.frontmatter.slug) {
              return null;
            }

            const backdropPath = resolve(
              `./src/assets/backdrops/${source.frontmatter.slug}.png`
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

config.onCreateNode = ({ node, actions, createContentDigest }) => {
  const { createNode } = actions;
  if (node.internal.type !== `MarkdownRemark`) {
    return;
  }

  if (
    node.fileAbsolutePath.includes("/reviews/") &&
    node.frontmatter &&
    node.frontmatter.imdb_id &&
    node.frontmatter.slug &&
    node.frontmatter.sequence
  ) {
    const data = {
      imdbId: node.frontmatter.imdb_id,
      slug: node.frontmatter.slug,
      sequence: node.frontmatter.sequence,
      date: node.frontmatter.date,
      grade: node.frontmatter.grade,
    };

    createNode({
      ...data,
      // Required fields.
      id: `review-${node.fileAbsolutePath}`,
      parent: undefined,
      children: [],
      internal: {
        type: `Review`,
        contentDigest: createContentDigest(data),
      },
    });
  }
};

module.exports = config;
