import Header from '../components/Header';
import Footer from '../components/Footer';
import About from '../components/About';

const AboutPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <About />
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
