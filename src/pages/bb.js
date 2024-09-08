import Header from '../components/Header';
import Footer from '../components/Footer';
import BbIndex from '../components/Bb/BbIndex';

const BbIndexPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <BbIndex />
      </div>
      <Footer />
    </div>
  );
};

export default BbIndexPage;
