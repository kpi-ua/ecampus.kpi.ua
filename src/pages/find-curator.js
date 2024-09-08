import Header from '../components/Header';
import Footer from '../components/Footer';
import FindCurator from '../components/FindCurator';

const FindCuratorPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <FindCurator />
      </div>
      <Footer />
    </div>
  );
};

export default FindCuratorPage;
