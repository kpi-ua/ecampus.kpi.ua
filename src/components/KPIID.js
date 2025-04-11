import React from 'react';
import { Redirect } from 'react-router-dom';
import * as campus from '../CampusClient';

class KpiId extends React.Component {
  state = {
    modal: false,
    redirect: null
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.handleAuthentication();
  }

  handleAuthentication = async () => {
    try {
      const params = new URLSearchParams(this.props.location.search);
      const ticketId = params.get('ticketId');

      if (!ticketId) {
        this.setState({ error: 'Ticket ID is missing' });
        return;
      }

      const currentUser = await campus.exchangeKpiIdTicket(ticketId);

      if (currentUser) {
        this.setState({ redirect: '/' });
      } else {
        this.setState({ error: 'Failed to authenticate using KPI ID' });
      }
    } catch (error) {
      console.error('Error during KPI ID authentication:', error);
      this.setState({ error: 'An unexpected error occurred' });
    }
  };

  render() {
    if (!!this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    return (
      <section>
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
      </section>
    );
  }
}

export default KpiId;