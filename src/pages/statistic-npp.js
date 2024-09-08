import Header from '../components/Header';
import Footer from '../components/Footer';
import NPP from '../components/Statistic/NPP';

const NPPPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <NPP />
      </div>
      <Footer />
    </div>
  );
};

export default NPPPage;
