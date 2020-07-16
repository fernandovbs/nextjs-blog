import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import Highlight from 'react-highlight'

export default function About() {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>About</h1>
          <section dangerouslySetInnerHTML={{
            '__html' : `
            I'm a software developer, passionate about programming and tech things.
            Love to solve problems and learn new stuff.<br>
            I've created this blog to write things that I learn in my work, to enforce the knowledge, and,
            at the same time, share with others these things that may be useful.           
            `
          }}></section>
      </article>
    </Layout>
  )
}
