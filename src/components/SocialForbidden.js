import React from 'react'

const SocialForbidden = () =>
  <div className="row">
    <div className="col-md-12">
      <h1>Авторизцiя неможлива</h1>
      На жаль, авторизація через соціальні мережі недоступна.<br/>
      Щоб мати можливість авторизуватися в системі «Електронний кампус» через соціальні мережі, вам необхідно вказати в
      налаштуваннях вашого користувача той же емайл, до якого прив'язана ваша сторінка в соціальній мережі.
      <br/>

      <div className="text-center">
        <img alt="forbidden" className="img-responsive sad-cat" src="/images/sad-cat.png"/>
      </div>
    </div>
  </div>;

export default SocialForbidden
