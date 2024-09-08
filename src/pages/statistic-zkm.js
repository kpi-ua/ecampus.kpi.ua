import Header from '../components/Header';
import Footer from '../components/Footer';
import ZKM from '../components/Statistic/ZKM';

const ZKMPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <ZKM />
      </div>
      <Footer />
    </div>
  );
};

export default ZKMPage;
