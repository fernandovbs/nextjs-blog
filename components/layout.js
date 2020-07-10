import Head from 'next/head'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

const name = 'Fernandovbs'
export const siteTitle = 'Next.js Sample Website'

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
        {home ? (
          <>
            <img
              src="/images/profile.jpg"
              className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
              alt={name}
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : (
          <div className={styles.headerGroup}>
            <img
              src="/codificacao.svg"
              className={`${styles.headerImage}`}
              alt="Code"
            />
            <h2 className={`${styles.headingInner} ${utilStyles.headingLg}` }>
              <Link href="/">
                <a className={utilStyles.colorInherit, styles.fancy}>{name}</a>
              </Link>
            </h2>
          </div>
        )}
        <nav className={styles.nav}>
          <Link href="/posts">
            <a className={`${styles.fancy}`}>POSTS</a>
          </Link>
          <Link href="/drops">
            <a className={`${styles.fancy}`}>DROPS</a>
          </Link>      
          <Link href="/about">
            <a className={`${styles.fancy}`}>ABOUT</a>
          </Link>              
        </nav>
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  )
}
