import Header from '../components/Header';
import Footer from '../components/Footer';
import Settings from '../components/Settings';

const SettingsPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <Settings />
      </div>
      <Footer />
    </div>
  );
};

export default SettingsPage;
