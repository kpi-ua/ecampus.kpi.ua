import Header from '../components/Header';
import Footer from '../components/Footer';
import RestorePassword from '../components/RestorePassword';

const RestorePasswordPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <RestorePassword />
      </div>
      <Footer />
    </div>
  );
};

export default RestorePasswordPage;
