import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'
import Link from 'next/link'
import { getSortedDropsData } from '../../lib/drops'
import Date from '../../components/date'

export async function getStaticProps() {
  const allDropsData = getSortedDropsData()
  return {
    props: {
      allDropsData
    }
  }
}

export default function Drops({allDropsData}) {
  
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
      <h1 className={utilStyles.headingXl}>Drops</h1>
        <ul className={utilStyles.list}>
          {allDropsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href="/drops/[id]" as={`/drops/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>      

    </Layout>
  )
}
