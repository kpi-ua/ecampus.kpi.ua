import React from 'react';
import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  UncontrolledDropdown,
} from 'reactstrap';
import * as campus from '../CampusClient';
import { withRouter } from 'react-router-dom';
import * as Security from '../Security';

class Header extends React.Component {
  /**
   * Handle when user logged out
   */
  onLogout;

  state = {
    isOpen: false,
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  exit = async (e) => {
    e.preventDefault();
    await campus.logout();
    this.props.history.push('/login');

    if (!!this.props.onLogout) {
      this.props.onLogout();
    }
  };

  redirectToOldUI = async (e) => {
    e.preventDefault();
    await campus.redirectToOldUI();
  };

  render() {
    const { user } = this.props;

    return (
      <header className="container-fluid">
        <Navbar color="light" light expand="md">
          {!!user && (
            <>
              <NavbarBrand href="/home">Електронний кампус</NavbarBrand>
            </>
          )}
          {!user && (
            <>
              <NavbarBrand href="/">Електронний кампус</NavbarBrand>
            </>
          )}

          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar>
              {!!user && (
                <>
                  {Security.hasAccessToModule(
                      user,
                      Security.Modules.EmploymentSystem,
                  ) && (
                      <NavItem>
                        <NavLink href="/employment-system">
                          Система працевлаштування
                          <i className="fa fa-external-link" />
                        </NavLink>
                      </NavItem>
                  )}

                </>
              )}

              {Security.hasAccessToModule(
                user,
                Security.Modules.Information,
              ) && (
                <UncontrolledDropdown nav>
                  <DropdownToggle nav caret>
                    Iнформація
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem href="https://schedule.kpi.ua/">Розклад занять та сесії <i className="fa fa-external-link" /></DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem href="/help">
                      Інструкція користувача
                    </DropdownItem>
                    <DropdownItem href="/faq">Поширенi запитання</DropdownItem>
                    <DropdownItem href="/about">Про систему</DropdownItem>
                    <DropdownItem href="/documents">
                      Документи КПІ ім. Ігоря Сікорського
                    </DropdownItem>
                    <DropdownItem href="/contacts">Контактнi данi</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem href="/privacy">
                      Правила використання інформації сайту
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}

              {Security.hasAccessToModule(
                user,
                Security.Modules.PersonalArea,
              ) && (
                <>
                  <NavItem>
                    <NavLink href="#" onClick={this.redirectToOldUI}>
                      До поточної версії кампусу {' '}
                      <i className="fa fa-external-link" />
                    </NavLink>
                  </NavItem>

                  <UncontrolledDropdown nav>
                    <DropdownToggle nav caret>
                      Обліковий запис
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem href="/settings">Налаштування</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem href="#" onClick={this.exit}>
                        Вихід з системи
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </>
              )}
            </Nav>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}

export default withRouter(Header);
