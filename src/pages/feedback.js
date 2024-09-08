import Header from '../components/Header';
import Footer from '../components/Footer';
import Feedback from '../components/Feedback';

const FeedbackPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <Feedback />
      </div>
      <Footer />
    </div>
  );
};

export default FeedbackPage;
