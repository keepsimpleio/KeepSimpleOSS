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
        <Head />
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
