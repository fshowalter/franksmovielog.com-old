import gatsbySourceSql from "./plugin-configs/gatsby-source-sql";

export const siteMetadata = {
  title: `Frank's Movie Log`,
  siteUrl: `https://www.franksmovielog.com`,
  description: `Quality reviews of films of questionable quality.`,
};

export const plugins = [
  {
    resolve: `gatsby-plugin-graphql-codegen`,
    options: {
      documentPaths: [`src/**/*.{ts,tsx}`, `node_modules/gatsby-*/**/*.js`],
    },
  },
  {
    resolve: `gatsby-plugin-sharp`,
    options: {
      toFormat: "JPG",
      stripMetadata: true,
      defaultQuality: 75,
    },
  },
  `gatsby-transformer-sharp`,
  `gatsby-transformer-remark`,
  `gatsby-plugin-typescript`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: "backdrop",
      path: `${__dirname}/../assets/backdrops/`,
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `review`,
      path: `${__dirname}/../../../movielog-new/reviews/`,
    },
  },
  `gatsby-plugin-react-helmet`,
  `gatsby-plugin-emotion`,
  gatsbySourceSql,
  "gatsby-transformer-yaml",
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `viewing`,
      path: `${__dirname}/../../../movielog-new/viewings/`,
    },
  },
];
