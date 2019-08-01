import { css } from '@emotion/core'
import { graphql } from 'gatsby'
import { Parser } from 'html-to-react'
import React, { Component } from 'react'
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
  h2 {
    margin-top: 4rem;
    font-size: 12px;
    font-weight: 600;
    color: #c9cccf;
    text-transform: uppercase;
    letter-spacing: 1.2px;
  }
`

const htmlToReactParser = new Parser()

export default props => {
  const { data } = props
  console.log(data)
  const content = data.prismicHomepage.data
  // const npicture = content.body[0].primary.picture.url
  const page_title = content.page_title.text
  const page_subtitle = content.page_subtitle.html

  const slices = content.body.map( function (slice, index) {
    if (slice.slice_type === 'image')
    { 
      const picture = slice.primary.picture.url
      return (
        <div className="image">
          <img src={picture}></img>
        </div>
      )
    }
    if (slice.slice_type === 'info')
    {
      const headline = htmlToReactParser.parse(slice.primary.headline.html)
      const picture = slice.primary.picture.url
      const description = htmlToReactParser.parse(slice.primary.description.html)
      return (
        <div className="info">
          <h1>{headline}</h1>
          <img src={picture}></img>
          <div>{description}</div>
        </div>
      )
    }
    if (slice.slice_type === 'facts')
    {
      const headline = htmlToReactParser.parse(slice.primary.headline.html)
      const description = htmlToReactParser.parse(slice.primary.description.html)
      const items = slice.items.map(function (item, itemIndex) {
        return(
          <div key={itemIndex}>
        {htmlToReactParser.parse(item.number.html)}
        {htmlToReactParser.parse(item.description.html)}
        </div>
          )
      })
      return (
        <div className="facts" key={index}>
          <h1>{headline}</h1>
          <h2>{description}</h2>
          <div>{items}</div>
        </div>
      )
    }
  })

return (
    <Layout>
      <div css={container}>
        <h1>{page_title}</h1>
        <h2>{htmlToReactParser.parse(page_subtitle)}</h2>
        
        <div>{slices}</div>
      </div>
    </Layout>
  )
} 

export const pageQuery = graphql`
  query {
    prismicHomepage {
    data {
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
          items{
            number {
              html
            }
            description {
              html
            }
          }
        }
        ... on PrismicHomepageBodyImage {
          slice_type
          primary {
            picture {
              url
            }
          }
        }
        ... on PrismicHomepageBodyInfo {
          slice_type
          primary {
            description {
              html
            }
            headline {
              html
            }
            picture {
              url
            }
          }
        }
      }
      page_subtitle {
        html
      }
      page_title {
        text
      }
    }
  }
  }
`
