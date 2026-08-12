import Document, { Head, Html, Main, NextScript } from 'next/document';

const themeBootstrap = `(function () {
  try {
    var v = localStorage.getItem('darkTheme');
    if (v === 'true' && document.body) document.body.classList.add('darkTheme');
  } catch (e) {}
})();`;

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Umami, self-hosted, cookieless. data-domains keeps preview/staging traffic out. */}
          <script
            defer
            src="https://analytics.administration.ae/script.js"
            data-website-id="7fbd94ec-0f10-4b46-bd04-d0df64a58c9e"
            data-domains="keepsimple.io,www.keepsimple.io"
          />
        </Head>
        <body>
          <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
