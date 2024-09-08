// pages/home.js

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Home from '../components/Home';

const HomePage = () => {
  return (
    <div className="App">
      <Header />
      <div className="container-fluid content">
        <Home />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
