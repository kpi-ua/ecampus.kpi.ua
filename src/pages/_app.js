// src/pages/_app.js
import '../../public/global.css';
import 'bootstrap/dist/css/bootstrap.min.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
