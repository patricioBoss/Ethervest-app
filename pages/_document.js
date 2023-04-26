import * as React from "react";
// next
import Document, { Html, Head, Main, NextScript } from "next/document";
// emotion
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import createEmotionServer from "@emotion/server/create-instance";
// theme
import palette from "../theme/palette";

// ----------------------------------------------------------------------

function createEmotionCache() {
  return createCache({ key: "css" });
}

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/logo/logo-single.svg"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/logo/logo-single.svg"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/logo/logo-single.svg"
          />
          <link
            href="/icons/@iconscout/unicons/css/line.css"
            type="text/css"
            rel="stylesheet"
          />
          <meta name="theme-color" content={palette.light.primary.main} />
          <link rel="manifest" href="/manifest.json" />

          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />

          <meta
            name="title"
            content="Ethervest - Invest in Real Estate, Stocks, and Cryptocurrencies"
          />
          <meta
            name="description"
            content=" Ethervest is a leading online investment platform that offers access to a wide range of investment opportunities, including real estate, stocks, and cryptocurrencies."
          />
          <meta
            name="keywords"
            content="Real estate investment,
            Cryptocurrency investment,
            Stock market investment,
            Investment opportunities,
            Portfolio diversification,
            Investment platform,
            Global investments,
            Local investments,
            Property management,
            Crypto trading,
            Investment funds,
            Fixed returns,
            High-yield investments,
            Risk management,
            Investment analysis,
            Market trends,
            Financial planning,
            Investment advice,
            Investment strategies,
            Investment performance"
          />
          <meta name="author" content="Ethervest investment limited" />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// ----------------------------------------------------------------------

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;

  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) =>
        (
          <CacheProvider value={cache}>
            <App {...props} />
          </CacheProvider>
        ),
    });

  const initialProps = await Document.getInitialProps(ctx);

  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      ...emotionStyleTags,
    ],
  };
};
