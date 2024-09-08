import Header from '../components/Header';
import Footer from '../components/Footer';
import Privacy from '../components/Privacy';

const PrivacyPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <Privacy />
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
