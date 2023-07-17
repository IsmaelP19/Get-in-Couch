import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps (ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,
      styles: React.Children.toArray([initialProps.styles])
    }
  }

  render () {
    return (
      <Html lang='en'>
        <Head />
        <body className='font-manrope '>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
