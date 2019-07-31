import { css } from '@emotion/core'
import { graphql } from 'gatsby'
import { Parser } from 'html-to-react'
import React from 'react'
import Layout from '../components/Layout'

const container = css`
  margin: 0 auto;
  padding: 4rem 2rem 8rem 2rem;
  max-width: 600px;
  color: #333333;

  h1 {
    font-size: 30px;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 2rem;
  }
`

const htmlToReactParser = new Parser()

export default props => {
  const { data } = props
  const content = data.prismicHomepage.data
  const page_title = content.page_title.text
  const page_subtitle = content.page_subtitle.html

  const slices = content.body.map(slice => {
    const headline = slice.primary.headline.html
    const picture = slice.primary.picture.url
    const description = slice.primary.description.html
    const items = slice.items.map(item => {
      htmlToReactParser.parse(item.description.html)
      htmlToReactParser.parse(item.number.html)
    })

    if (slice.slice_type === 'Image') {
      return (
        <div className="Image">
          <div>{picture}</div>
        </div>
      )
    }
    if (slice.slice_type === 'Info') {
      return (
        <div className="Info">
          <h1>{htmlToReactParser.parse(headline)}</h1>
          <h2>{picture}</h2>
          <div>{htmlToReactParser.parse(description)}</div>
        </div>
      )
    }
    if (slice.slice_type === 'Facts') {
      return (
        <div className="Facts">
          <h1>{htmlToReactParser.parse(headline)}</h1>
          <h2>{htmlToReactParser.parse(description)}</h2>
          <div>{items}</div>
        </div>
      )
    }
  })

  return (
    <Layout>
      <div css={container}>
        <h1>{page_title}</h1>
        {htmlToReactParser.parse(page_subtitle)}
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    prismicHomepage {
      data {
        page_title {
          text
        }
        page_subtitle {
          html
        }
        body {
          ... on PrismicHomepageBodyImage {
            slice_type
            primary {
              picture {
                url
              }
            }
          }
        }
        body {
          ... on PrismicHomepageBodyInfo {
            slice_type
            primary {
              headline {
                html
              }
              picture {
                url
              }
              description {
                html
              }
            }
          }
        }
        body {
          ... on PrismicHomepageBodyFacts {
            slice_type
            primary {
              headline {
                html
              }
              description {
                html
              }
            }
            items {
              number {
                html
              }
              description {
                html
              }
            }
          }
        }
      }
    }
  }
`
