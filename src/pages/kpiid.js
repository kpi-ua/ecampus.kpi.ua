import Header from '../components/Header';
import Footer from '../components/Footer';
import KPIIDLogin from '../components/KPIIDLogin';

const KPIIDLoginPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <KPIIDLogin />
      </div>
      <Footer />
    </div>
  );
};

export default KPIIDLoginPage;
