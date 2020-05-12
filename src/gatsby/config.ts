export const siteMetadata = {
  title: `Frank's Movie Log`,
  siteUrl: `https://www.franksmovielog.com`,
  description: `Quality reviews of films of questionable quality.`,
};

export const plugins = [
  {
    resolve: "gatsby-plugin-react-svg",
    options: {
      rule: {
        include: /\.inline\.svg$/,
      },
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
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: "backdrop",
      path: `${__dirname}/../assets/backdrops/`,
    },
  },
  `gatsby-transformer-remark`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `review`,
      path: `${__dirname}/../../../movielog-new/reviews/`,
    },
  },
  `gatsby-transformer-remark`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `review`,
      path: `${__dirname}/../../pages/`,
    },
  },
  `gatsby-plugin-typescript`,
  `gatsby-plugin-react-helmet`,
  {
    resolve: `gatsby-plugin-emotion`,
    options: {
      sourceMap: false,
    },
  },
];
