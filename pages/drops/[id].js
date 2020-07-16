import Layout from '../../components/layout'
import { getAllDropsIds, getDropData } from '../../lib/drops'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
import Highlight from 'react-highlight'

export async function getStaticPaths() {
    const paths = getAllDropsIds()
    return {
      paths,
      fallback: false
    }
  }

  export async function getStaticProps({ params }) {
    const dropData = await getDropData(params.id)
    return {
      props: {
        dropData
      }
    }
  }
  
  
export default function Post({ dropData }) {
  return (
    <Layout>
      <Head>
        <title>{dropData.title}</title>
      </Head>        
      <article>
        <h1 className={utilStyles.headingXl}>{dropData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={dropData.date} />
        </div>
        <Highlight innerHTML={true}>
          {dropData.contentHtml}
        </Highlight>
      </article>
    </Layout>
  )
}
