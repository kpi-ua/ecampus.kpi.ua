import Link from 'next/link';
import React from 'react';
import * as campus from '../utils/CampusClient';
import StudyGroupInfo from './StudyGroupInfo';

class FindCurator extends React.Component {
  state = {
    loader: false,
    query: '',
    groups: [],
  };

  showMessage = (message) => {
    console.log(`${message}`);
    alert(message);
  };

  findGroup = async (event) => {
    const payload = {
      name: event.currentTarget.value,
    };

    this.setState({ loader: true });

    const response = await campus.callApi('group/find', 'GET', payload);

    this.setState({ loader: false });

    if (response.status === 200 || response.status === 202) {
      const data = await response.json();
      this.setState({ groups: !!data ? data : [] });
    }
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-4" />
        <div className="col-md-4">
          <br />
          <div className="card">
            <div className="card-body">
              <div className="text-center">
                <a href="/">
                  <img
                    src="/images/logo-big-green.png"
                    alt="Електроний кампус"
                    className="img-responsive logo-green"
                  />
                </a>
                <h2 className="text-center">Пошук куратора</h2>
                <div className="panel-body">
                  <fieldset>
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-group-addon">
                          <i className="glyphicon glyphicon-envelope color-blue" />
                        </span>
                        <input
                          onChange={this.findGroup}
                          placeholder="Група"
                          className="form-control"
                          type="search"
                          required
                        />
                      </div>
                      <div className="input-group">
                        {this.state.groups.map((g, i) => {
                          return <StudyGroupInfo value={g} />;
                        })}
                      </div>
                    </div>
                  </fieldset>
                  <Link className="btn btn-md btn-info btn-block" href={'/login'}>
                    Повернутися
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4" />
      </div>
    );
  }
}

export default FindCurator;
