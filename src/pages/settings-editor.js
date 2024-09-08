import Header from '../components/Header';
import Footer from '../components/Footer';
import SettingsEditor from '../components/SettingsEditor';

const SettingsEditorPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <SettingsEditor />
      </div>
      <Footer />
    </div>
  );
};

export default SettingsEditorPage;
