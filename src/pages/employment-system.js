import Header from '../components/Header';
import Footer from '../components/Footer';
import EmploymentSystem from '../components/EmploymentSystem';

const EmploymentSystemPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <EmploymentSystem />
      </div>
      <Footer />
    </div>
  );
};

export default EmploymentSystemPage;
