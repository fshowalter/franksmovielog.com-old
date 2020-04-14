import { GatsbyNode, Actions, Node } from "gatsby";
import { resolve } from "path";

interface MarkdownNode extends Node {
  frontmatter?: {
    slug?: string;
    imdb_id?: string;
  };
  absolutePath: string;
  rawMarkdownBody: string;
}

export const addFirstParagraphField = ({
  markdownNode,
  createNodeField,
}: {
  markdownNode: MarkdownNode;
  createNodeField: Actions["createNodeField"];
}) => {
  const firstParagraph = markdownNode.rawMarkdownBody
    ? markdownNode.rawMarkdownBody.trim().split("\n\n")[0]
    : "";

  createNodeField({
    name: "firstParagraph",
    node: markdownNode,
    value: firstParagraph,
  });
};

export const addBackdropField = ({
  markdownNode,
  createNodeField,
  getNodes,
}: {
  markdownNode: MarkdownNode;
  createNodeField: Actions["createNodeField"];
  getNodes: Function;
}) => {
  const backdropPath =
    markdownNode.frontmatter && markdownNode.frontmatter.slug
      ? resolve(`./src/assets/backdrops/${markdownNode.frontmatter.slug}.png`)
      : null;

  const fileNode = backdropPath
    ? getNodes().find(
        (node: MarkdownNode) => node.absolutePath === backdropPath
      )
    : null;

  const fileNodeId = fileNode ? fileNode.id : null;

  createNodeField({
    name: "backdrop___NODE",
    node: markdownNode,
    value: fileNodeId,
  });
};

interface ImdbNode {
  imdb_id: string;
  id: string;
  internal: {
    type: string;
  };
}

export const addMovieInfo = ({
  markdownNode,
  createNodeField,
  getNodes,
}: {
  markdownNode: MarkdownNode;
  createNodeField: Actions["createNodeField"];
  getNodes: Function;
}) => {
  const imdbId = markdownNode.frontmatter
    ? markdownNode.frontmatter.imdb_id
    : null;

  if (!imdbId) {
    return;
  }

  const imdbNode: ImdbNode = getNodes().find((node: ImdbNode) => {
    if (node.internal.type != "Movie") {
      return false;
    }

    return node.imdb_id === imdbId;
  });

  const imdbNodeId = imdbNode ? imdbNode.id : null;

  createNodeField({
    name: "movie___NODE",
    node: markdownNode,
    value: imdbNodeId,
  });
};

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  actions,
  getNodes,
}) => {
  if (node.internal.type === `MarkdownRemark`) {
    const { createNodeField } = actions;
    const markdownNode = node as MarkdownNode;
    addBackdropField({ markdownNode, createNodeField, getNodes });
    addFirstParagraphField({ markdownNode, createNodeField });
    addMovieInfo({ markdownNode, createNodeField, getNodes });
  }
};
