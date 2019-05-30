import React from 'react'
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
  UncontrolledDropdown
} from "reactstrap";
import * as campus from "../CampusClient";
import {Link, withRouter} from "react-router-dom";


class Header extends React.Component {
  state = {
    isOpen: false,
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  exit = async (e) => {
    e.preventDefault();
    await campus.logout();
    this.props.history.push('/login');
  };


  render() {
    const { user } = this.props;

    return <header className="container-fluid">
      <Navbar color="light" light expand="md">

        { !!user &&
          <>
          <NavbarBrand href="/home">Електронний кампус</NavbarBrand>
          </>
        }
        { !user &&
        <>
          <NavbarBrand href="/">Електронний кампус</NavbarBrand>
        </>
        }

        <NavbarToggler onClick={this.toggle}/>
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav navbar>

            { !!user &&
              <>
                <UncontrolledDropdown nav>
                  <DropdownToggle nav caret>
                    Дисципліни вибору
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem disabled={true} href="#">Вибір студента​</DropdownItem>
                    <DropdownItem disabled={true} href="#">Пропозиції дисциплін​</DropdownItem>
                    <DropdownItem disabled={true} href="#">Дисципліни спеціалізації</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>

                <NavItem>
                  <NavLink disabled={true} href="#">Результати аттестації​</NavLink>
                </NavItem>

                <UncontrolledDropdown nav>
                  <DropdownToggle nav caret>
                    Статистика
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem disabled={true} href="#">Забезпечення кредитного модуля</DropdownItem>
                    <DropdownItem disabled={true} href="#">Індивідуальне навантаження викладачів</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>

                <NavItem>
                  <NavLink disabled={true} href="#">РНП</NavLink>
                </NavItem>

                <NavItem>
                  <NavLink disabled={true} href="#">Повідомлення</NavLink>
                </NavItem>
              </>
            }

            <UncontrolledDropdown nav>
              <DropdownToggle nav caret>
                Iнформація
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem target="_blank" href="http://rozklad.kpi.ua/">Розклад занять та сесії <i className="fa fa-external-link"/></DropdownItem>
                <DropdownItem href="/bb">Дошка оголошень</DropdownItem>
                <DropdownItem divider/>
                <DropdownItem href="/help">Інструкція користувача</DropdownItem>
                <DropdownItem href="/privacy">Правила використання інформації сайту</DropdownItem>
                <DropdownItem href="/about">Про систему</DropdownItem>
                <DropdownItem href="/documents">Документи КПІ ім. Ігоря Сікорського</DropdownItem>
                <DropdownItem href="/contacts">Контактнi данi</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            { !!user &&
              <>
                <NavItem>
                  <NavLink href="http://campus.kpi.ua">До попередньої версії кампусу <i
                    className="fa fa-external-link"/></NavLink>
                </NavItem>

                <UncontrolledDropdown nav>
                  <DropdownToggle nav caret>
                    Аккаунт
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem href="/settings">Налаштування</DropdownItem>
                    <DropdownItem divider/>
                    <DropdownItem href="#" onClick={this.exit}>Вихід з системи</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </>
            }

          </Nav>
        </Collapse>
      </Navbar>
    </header>
  }

}

export default withRouter(Header)