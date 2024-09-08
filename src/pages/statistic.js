import Header from '../components/Header';
import Footer from '../components/Footer';
import StatisticIndex from '../components/Statistic/StatisticIndex';

const StatisticIndexPage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <StatisticIndex />
      </div>
      <Footer />
    </div>
  );
};

export default StatisticIndexPage;
