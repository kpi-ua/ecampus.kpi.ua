import Header from '../components/Header';
import Footer from '../components/Footer';
import Schedule from '../components/Schedule';

const SchedulePage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <Schedule />
      </div>
      <Footer />
    </div>
  );
};

export default SchedulePage;
