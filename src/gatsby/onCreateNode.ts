import { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
import { resolve } from "path";

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

    if (
      markdownNode.frontmatter === undefined ||
      markdownNode.frontmatter.slug === undefined
    ) {
      return;
    }

    const backdropPath = resolve(
      `./src/assets/backdrops/${markdownNode.frontmatter.slug}.png`
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
