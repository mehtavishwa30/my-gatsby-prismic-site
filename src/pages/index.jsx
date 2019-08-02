import { css } from '@emotion/core'
import { graphql } from 'gatsby'
import { Parser } from 'html-to-react'
import React, { Component } from 'react'
import Layout from '../components/Layout'

const container = css`
body{
  padding:0;
  margin:0;
  font-family: -apple-system,BlinkMacSystemFont,sans-serif;
}
.container{
  margin:60px;
  max-width:100%;
}

  h1 {
    font-size: 46px;
    color:#1d2330;
    text-align:center;
  }
  h2 {
    font-weight: 600;
    font-size: 22px;
    color: #1d2330;
    text-align:center;
  }
  h3{
		font-weight: 100;
		font-size: 18px;
    color: #3f4955;
    text-align:center;
	}
	h4{
    	font-weight: 400;
    	font-size: 22px;
    	line-height: 34px;
    	width: 650px;
    	display: inline-block;
    	color: #667487;
    	margin:-15px;
	}
	h6{
		color: #667487;
    	margin-top: 15px;
      font-size: 14px;
      text-align:center;
  }
  .image-cover, .image-info{
		max-width: 100%;
	}
	.image-info{
		max-width: 97%;
    	margin: 0 auto;
    	box-shadow:0px 0px 15px rgba(131,131,133,.35);
	}
	.block-6{
		max-width: 50%;
		display: inline-block;
	}
	.info{
		margin: 80px 0;
		display: flex;
	}
	.info-left{
	    border-left: 4px solid #dce0e6;
	    font-size: 22px;
	    line-height: 40px;
	    font-weight: bold;
	    color: #1d2330;
	    padding-left: 20px;
	    width: 50%;
	    margin: 0 auto;
	}
	.info-detail{
		width: 55%;
    	margin: 0 auto;
    	font-size: 15px;
    	line-height: 25px;
    	color: #3f4955;
	}
	.text-bold{
		font-weight: 600;
	}
	.facts{
		padding: 60px;
		max-width:100%;
		background: #f9f9fb;
    height: 275px;
    text-align:center;
	}
	.fact-box{
		text-align: center;
	    display: inline-flex;
	    margin-top: 45px;
	    max-width: 80%;
	}
	.fact-items{
	    display: inline-block;
	    width: 27.5%;
	    margin: 0px 10px;
	    background: #ffffff;
	    color: #3f4955;
	    box-shadow: 0px 0px 5px #dcdcdc;
	    padding: 25px;
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
  const page_note = content.page_note.html

  const slices = content.body.map( function (slice, index) {
    if (slice.slice_type === 'image')
    { 
      const picture = slice.primary.picture.url
      return (
        <div className="image">
          <img class="image-cover" src={picture}></img>
        </div>
      )
    }
    if (slice.slice_type === 'info')
    {
      const headline = htmlToReactParser.parse(slice.primary.headline.html)
      const picture = slice.primary.picture.url
      const description = htmlToReactParser.parse(slice.primary.description.html)
      const desc = htmlToReactParser.parse(slice.primary.desc.html)
      return (
        <div className="info">
			<div class="block-6">
				<div class="info-left">
					{headline}
				</div>
				<div class="info-detail">
					<p class="text-bold">{description}</p>
					<p>{desc}</p>
				</div>
			</div>
			<div class="block-6">
      <img src={picture}></img>
			</div>
		</div>
      )
    }
    if (slice.slice_type === 'facts')
    {
      const headline = htmlToReactParser.parse(slice.primary.headline.html)
      const description = htmlToReactParser.parse(slice.primary.description.html)
      const items = slice.items.map(function (item, itemIndex) {
        return(
          <div key={itemIndex} class="fact-items">
            <h1>{htmlToReactParser.parse(item.number.html)}</h1>
            <p><b>{htmlToReactParser.parse(item.description.html)}</b>{htmlToReactParser.parse(item.desc.html)}</p>
          </div>
          )
      })
      return (
        <div className="facts" key={index} class="facts">
          <h2>{headline}</h2>
          <h3>{description}</h3>
           <div class="fact-box">{items}</div>
        </div>
      )
    }
  })

return (
    <Layout>
      <div css={container} class="container">
        <h1>{page_title}</h1>
        <h2>{htmlToReactParser.parse(page_subtitle)}</h2>
        <h6>{htmlToReactParser.parse(page_note)}</h6>
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
            desc {
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
            desc {
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
      page_note{
        html
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
