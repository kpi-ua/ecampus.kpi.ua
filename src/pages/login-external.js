import Header from '../components/Header';
import Footer from '../components/Footer';
import Login from '../components/Login';
import AuthContainerExternal from '../components/AuthContainerExternal';

const ExternalLoginPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <Login isExternal={true}>
          <AuthContainerExternal />
        </Login>
      </div>
      <Footer />
    </div>
  );
};

export default ExternalLoginPage;
