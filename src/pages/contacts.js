import Header from '../components/Header';
import Footer from '../components/Footer';
import Contacts from '../components/Contacts';

const ContactsPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <Contacts />
      </div>
      <Footer />
    </div>
  );
};

export default ContactsPage;
