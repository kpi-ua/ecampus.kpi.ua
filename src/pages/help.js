import Header from '../components/Header';
import Footer from '../components/Footer';
import Help from '../components/Help';

const HelpPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <Help />
      </div>
      <Footer />
    </div>
  );
};

export default HelpPage;
