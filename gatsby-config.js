require('dotenv').config({
  path: `.env`,
})

module.exports = {
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-emotion',
    {
      resolve: 'gatsby-source-prismic',
      options: {
        repositoryName: 'resume-test-1',
        accessToken: process.env.API_KEY,
      },
    },
  ],
}
