import gatsbySourceSql from './plugin-configs/gatsby-source-sql';

export const siteMetadata = {
  title: `Frank's Movie Log`,
  siteUrl: `https://www.franksmovielog.com`,
  description: `Quality reviews of films of questionable quality.`,
};

export const plugins = [
  ...gatsbySourceSql,
  "gatsby-transformer-yaml",
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `viewing`,
      path: `${__dirname}/../../../movielog-new/viewings/`,
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `movie_countries`,
      path: `${__dirname}/../../../movielog-new/movie_countries/`,
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
  `gatsby-plugin-typescript`,
  `gatsby-plugin-react-helmet`,
  `gatsby-plugin-emotion`,
];
