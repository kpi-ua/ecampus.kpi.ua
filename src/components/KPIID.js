import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import * as campus from '../CampusClient';

class KpiId extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      redirect: null,
    };
  }

  async componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const ticketId = params.get('ticketId');

    if (!ticketId) {
      this.setState({ error: 'Ticket ID is missing' });
      return;
    }

    try {
      const user = await campus.exchangeKpiIdTicket(ticketId);

      if (user) {
        this.setState({ redirect: '/home' }); // Redirect on success
      } else {
        this.setState({ error: 'Failed to authenticate using KPI ID' });
      }
    } catch (error) {
      console.error('Error during KPI ID authentication:', error);
      this.setState({ error: 'An unexpected error occurred' });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    return (
      <div className="row">
        <div className="col-md-12">
          <h1>KPI ID</h1>
          {this.state.error ? (
            <div className="alert alert-danger">{this.state.error}</div>
          ) : (
            <p>Authorizing...</p>
          )}
        </div>
      </div>
    );
  }
}

export default KpiId;