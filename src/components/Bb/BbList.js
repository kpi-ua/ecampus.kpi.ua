import React from 'react';
import * as campus from '../../CampusClient';
import '../../css/Bb.css';
import Pagination from 'react-js-pagination';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

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

  componentDidMount() {
  }

  dateToString = (date) =>
    !date ? '...' : new Date(date).toLocaleDateString();

  getHtml = (text) => ({ __html: text });

  /**
   *
   * @param e
   * @param subject
   * @param text
   */
  showDetail = (e, subject, text) => {
    if (!!e) {
      e.preventDefault();
    }

    this.setState({
      modal: !this.state.modal,
      modalSubject: subject,
      modalText: text,
    });
  };

  render() {
    const items = this.state.items;

    window.scrollTo(0, 0);

    return (
      <div>
        {items.map((item, i) => {
          return (
            <div className="card w-auto" key={item.id}>
              <div className="card-body">
                <h5 className="card-title">{item.subject}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {this.dateToString(item.start)} -{' '}
                  {this.dateToString(item.end)}
                </h6>
                <p
                  className="card-text"
                  dangerouslySetInnerHTML={this.getHtml(item.text)}
                  key={item.id}
                />
                <button
                  href="#"
                  className="btn btn-primary btn-lg"
                  onClick={(e) => this.showDetail(e, item.subject, item.text)}
                >
                  Докладніше
                </button>
              </div>
            </div>
          );
        })}

        {this.state.enablePaging && (
          <Pagination
            activePage={this.state.activePage}
            itemsCountPerPage={this.state.paging.pageSize}
            totalItemsCount={this.state.paging.totalItemCount}
            pageRangeDisplayed={5}
            onChange={async (pageNumber) => {
              const response = await campus.getBulletinBoardForCurrentUser();
              this.setState({
                items: response.data,
                activePage: pageNumber,
                paging: response.paging,
              });
            }}
          />
        )}

        {
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
            className={this.props.className}
            size="lg"
          >
            <ModalHeader toggle={this.toggle}>
              <b>
                {this.state.modalSubject}
              </b>
            </ModalHeader>
            <ModalBody>
              <p dangerouslySetInnerHTML={this.getHtml(this.state.modalText)} />
            </ModalBody>
            <ModalFooter>
              <Button
                style={{ width: '100px' }}
                color="primary"
                onClick={() => this.showDetail(null, '', '')}
              >
                OK
              </Button>
            </ModalFooter>
          </Modal>
        }
      </div>
    );
  }
}

export default BbList;
