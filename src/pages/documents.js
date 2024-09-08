import Header from '../components/Header';
import Footer from '../components/Footer';
import Documents from '../components/Documents';

const DocumentsPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <Documents />
      </div>
      <Footer />
    </div>
  );
};

export default DocumentsPage;
