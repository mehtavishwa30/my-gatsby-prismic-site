import { css } from '@emotion/core'
import { graphql } from 'gatsby'
import { Parser } from 'html-to-react'
import React from 'react'
import Layout from '../components/Layout'

const htmlToReactParser = new Parser()

export default props => {
  const { data } = props
  const content = data.prismicHomepage.data
  const name = content.name.text
  const description = content.description.html

  return (
    <Layout>
      <div>
        <h1>{name}</h1>
        {htmlToReactParser.parse(description)}
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    prismicHomepage {
      data {
        name {
          text
        }
        description {
          html
        }
      }
    }
  }
`
