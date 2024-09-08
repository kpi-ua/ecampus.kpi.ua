// pages/index.js

import Header from '../components/Header';
import Footer from '../components/Footer';
import Login from '../components/Login';
import AuthContainerDefault from '../components/AuthContainerDefault';

const HomePage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <Login isExternal={false}>
          <AuthContainerDefault />
        </Login>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
