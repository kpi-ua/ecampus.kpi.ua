import Header from '../components/Header';
import Footer from '../components/Footer';
import LecturerHelp from '../components/LecturerHelp';

const LecturerHelpPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <LecturerHelp />
      </div>
      <Footer />
    </div>
  );
};

export default LecturerHelpPage;
