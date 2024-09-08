import Header from '../components/Header';
import Footer from '../components/Footer';
import Faq from '../components/Faq';

const FaqPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <Faq />
      </div>
      <Footer />
    </div>
  );
};

export default FaqPage;
