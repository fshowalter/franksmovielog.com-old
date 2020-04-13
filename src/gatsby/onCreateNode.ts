import { GatsbyNode, Actions, Node } from "gatsby";
import { resolve } from "path";
import remark from "remark";

const remarkHTML = require("remark-html");

interface MarkdownNode extends Node {
  frontmatter?: {
    slug?: string;
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
  let firstParagraph = markdownNode.rawMarkdownBody
    ? markdownNode.rawMarkdownBody.trim().split("\n\n")[0]
    : "";

  firstParagraph = remark()
    .use(remarkHTML)
    .processSync(firstParagraph)
    .toString();

  createNodeField({
    name: "firstParagraph",
    node: markdownNode,
    value: firstParagraph,
  });
};

export const addBackdropFied = ({
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

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  actions,
  getNodes,
}) => {
  if (node.internal.type === `MarkdownRemark`) {
    const { createNodeField } = actions;
    const markdownNode = node as MarkdownNode;

    addBackdropFied({ markdownNode, createNodeField, getNodes });
    addFirstParagraphField({ markdownNode, createNodeField });
  }
};
