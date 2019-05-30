import React from 'react'
import * as campus from "../../CampusClient";
import {Link} from "react-router-dom";
import '../../css/Bb.css';
import Pagination from "react-js-pagination";


class BbList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      items: [],
      activePage: 1,
      enablePaging: props.enablePaging,
      pageSize: props.pageSize,
      paging: { pageSize: 1, totalItemCount: 1 },
    };
  }

  async componentDidMount() {
    const response = await campus.getBulletinBoardForCurrentUser(1, this.state.pageSize);
    this.setState({items: response.data, activePage: 1, paging: response.paging});
  }

  dateToString = date => !date ? '...' : new Date(date).toLocaleDateString();

  getHtml = text => ({__html: text});

  render() {

    const items = this.state.items;

    window.scrollTo(0, 0)

    return <div>
      {
        items.map((item, i) => {
        return (
          <div className="card w-auto">
            <div className="card-body">
              <h5 className="card-title">{item.subject}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{this.dateToString(item.start)} - {this.dateToString(item.end)}</h6>
              <p className="card-text" dangerouslySetInnerHTML={this.getHtml(item.text)} key={item.id} />
            </div>
          </div>)
        })
      }

      { this.state.enablePaging &&
       <Pagination
          activePage={this.state.activePage}
          itemsCountPerPage={this.state.paging.pageSize}
          totalItemsCount={this.state.paging.totalItemCount}
          pageRangeDisplayed={5}
          onChange={async (pageNumber) => {
            const response = await campus.getBulletinBoardForCurrentUser(pageNumber, this.state.pageSize);
            this.setState({items: response.data, activePage: pageNumber, paging: response.paging});
          }}
        />
      }

    </div>
  }
}

export default BbList