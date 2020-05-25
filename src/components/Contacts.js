import React from 'react'
import {Link} from "react-router-dom";

const Contacts = () => (
  <div className="row">
    <div className="col-md-12">
      <h1>Контактнi данi</h1>
      Адреса констуркторського бюро: <a href="https://goo.gl/maps/UUNyXm7wFiw">Україна, м. Київ, вул. Політехнічна 14-в</a>,
      корпус 13, 4 поверх, 25 кабінет.<br />
      Тел.: <a href="tel:+380442048006">+380 (44) 204 80 06</a><br />
      Тел/факс.:<a href="tel:+380444549845">+38 (044) 454 98 45</a><br />

      <h3>Соцiальнi мережi</h3>
      <ul>
        <li><a target="_gh" href="https://github.com/kpi-ua">КПI у GitHub</a></li>
        <li><a target="_fb" href="https://www.facebook.com/kbis.kpi.ua">Facebook</a></li>
        <li><a target="_tg" href="https://t.me/kpikb">Telegram</a></li>
        <li><a target="_tw" href="https://twitter.com/kb_is">Twitter</a></li>
      </ul>

      <h3>Служба підтримки</h3>
      Якщо у вас є питання, ви можете звернутися до служби підтримки:<br />
      <a className="info-button" href="mailto:ecampus@kpi.ua"><i className="fa fa-envelope" />ecampus@kpi.ua</a>
      <br />
      <br />
      <Link className="info-button" to={`/feedback`}><i className="fa fa-comments-o" aria-hidden="true" />Форма скарг i пропозицiй</Link>

    </div>
  </div>
)

export default Contacts
