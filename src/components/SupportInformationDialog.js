import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class SupportInformationDialog extends React.Component {
  state = {
    modal: false
  };

  toggle = () => this.setState({modal: !this.state.modal});

  render = () =>
    <div>
      <span className="link" onClick={this.toggle}>Служба підтримки</span> (<a target="_tg" href="https://t.me/joinchat/HtJ6IROiP8Rv5BR-eZ64fw">Telegram чат</a>)
      <br />
      Корпус 13, 4 поверх, 25 кабінет
      <br />
      <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
        <ModalHeader toggle={this.toggle}>Служба підтримки</ModalHeader>
        <ModalBody>
          <p>
            Якщо у вас є питання, ви можете надіслати його на email служби підтримки: <a
            href="mailto:ecampus@kpi.ua">ecampus@kpi.ua</a>
          </p>
          <p>
            Для термінового зв'язку ви можете подзвонити за номером:<br/><a href="tel:+380442048006">+380 (44) 204 80 06</a>.
          </p>
          <p>
            Також ви можете завітати до констуркторського бюро, за адресою: <a href="http://maps.yandex.ua/-/CVremSol">Україна,
            м. Київ, вул. Політехнічна 14-в, корпус 13, 4 поверх, 25 кабінет</a>.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.toggle}>OK</Button>
        </ModalFooter>
      </Modal>
    </div>;
}

export default SupportInformationDialog;

