import Header from '../components/Header';
import Footer from '../components/Footer';
import SocialForbidden from '../components/SocialForbidden';

const SocialForbiddenPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <SocialForbidden />
      </div>
      <Footer />
    </div>
  );
};

export default SocialForbiddenPage;
