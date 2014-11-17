<%@ Page Title="Профіль" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Default" %>

<asp:Content ID="breadcrumbs_content" ContentPlaceHolderID="breadcrumbs" runat="server">
    <li><a href="/Default.aspx">Домашня</a></li>
    <li class="active">Персональні данні</li>
</asp:Content>

<asp:Content ID="body_content" ContentPlaceHolderID="body" runat="server">
    <div class="profile">
        <ul class="nav nav-tabs" id="myTab">
            <li class="active"><a href="#tab1" data-toggle="tab">Персональні дані</a></li>
            <li><a href="#tab2" data-toggle="tab">Додаткові функції</a></li>
            <li><a href="#tab3" data-toggle="tab">Редагування профайлу</a></li>
            <li><a href="#tab4" data-toggle="tab">Погодження</a></li>
        </ul>

        <div class="tab-content">
            <div class="tab-pane active" id="tab1">
                <div class="profile">
                       <!-- CONTENT -->
                       <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                         <div class="panel panel-default">
                           <div class="panel-head" role="tab" id="headingOne">
                             <h4 class="panel-title">
                               <a class="collapsed" data-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                 Загальна інформація
                               </a>
                             </h4>
                           </div>
                           <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                             <div class="panel-body">
                              <div class="row main-info">
                                <td class="row mod">
                                <h1 class="profile-name"><%=this.CurrentUser.FullName %><small> к.т.н доцент</small></h1>
                                  <div class="col-xs-12 col-sm-3 col-md-3 ">
                                      <a data-original-title="Dismissible popover" data-toggle="popover" class="btn btn-success" data-trigger="hover" data-placement="bottom" title="" data-content="And here's some amazing content. It's very engaging. Right?">
                                          <asp:Image CssClass="pic img-circle" ID="profile_photo" runat="server" />
                                      </a>
                                  </div>
                                  <table class=" col-xs-12  col-sm-8  col-md-9 table-info">
                                     <tr>
                                        <td>Дані за місцем навчання/роботи</td>
                                        <td>
                                             <asp:Literal ID="WorkData" runat="server"></asp:Literal>
                                        </td>
                                         <td class="glyphicon glyphicon-eye-open"></td>
                                     </tr>
                                  </table>
                                  </div>
                                  <table class=" col-xs-12  col-sm-8  col-md-7 table-info col-md-offset-3 col-sm-offset-3">
                                     <tr>
                                        <td>Email</td>
                                        <td>myemail.gmail.com</td>
                                        <td class="glyphicon glyphicon-eye-open"></td>
                                     </tr>
                                     <tr>
                                         <td>Телефон робочий</td>
                                         <td>254 87 96</td>
                                         <td class="glyphicon glyphicon-eye-open"></td>
                                     </tr>
                                     <tr>
                                         <td>Телефон домашній</td>
                                         <td>254 87 96</td>
                                         <td class="glyphicon glyphicon-eye-open"></td>
                                     </tr>
                                     <tr>
                                         <td>Телефон мобільний</td>
                                         <td>254 87 96</td>
                                         <td class="glyphicon glyphicon-eye-open"></td>
                                     </tr>
                                     <tr>
                                         <td>Адреса за місцем роботи</td>
                                         <td>вул. Політехнічна 14, 24 кб.</td>
                                         <td class="glyphicon glyphicon-eye-open"></td>
                                     </tr>
                                     <tr>
                                         <td>Години прийому</td>
                                         <td>10-25, 15-18</td>
                                         <td class="glyphicon glyphicon-eye-open"></td>
                                     </tr>
                                     <tr>
                                         <td>Примітка</td>
                                         <td>..............</td>
                                         <td class="glyphicon glyphicon-eye-open"></td>
                                     </tr>
                                     <tr>
                                         <td>Skype</td>
                                         <td>kmelkumayn</td>
                                         <td class="glyphicon glyphicon-eye-open"></td>
                                     </tr>
                                     <tr>
                                         <td>VK</td>
                                         <td>http://vk.com/id575757</td>
                                         <td class="glyphicon glyphicon-eye-open"></td>
                                     </tr>
                                  </table>
                              </div>
                             </div>
                           </div>
                         </div>
                         <div class="panel panel-default">
                           <div class="panel-head" role="tab" id="headingTwo">
                             <h4 class="panel-title">
                               <a class="collapsed" data-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                 Педагогічна діяльність
                               </a>
                             </h4>
                           </div>
                           <div id="collapseTwo" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingTwo">
                             <div class="panel-body">
                          <div class="row main-info">
                            <div class="row mod">
                              <table class=" col-xs-12  col-sm-8  col-md-9 table-info col-md-offset-3 col-sm-offset-3">
                                  <tr>
                                     <td>Назва кредитного модулю</td>
                                     <td>Технології розробки програмного забезпечення</td>
                                  </tr>
                                  <tr>
                                      <td>День тижня</td>
                                      <td>середа</td>
                                  </tr>
                                  <tr>
                                      <td>Номер пари</td>
                                      <td>1-й</td>
                                  </tr>
                                  <tr>
                                      <td>Час пари</td>
                                      <td>10</td>
                                  </tr>
                                  <tr>
                                      <td>Група/Групи</td>
                                      <td>ІК-21</td>
                                  </tr>
                                  <tr>
                                      <td>Викладач</td>
                                      <td>Мелкумян К.Ю</td>
                                  </tr>
                              </table>
                              </div>
                              <table class=" col-xs-12  col-sm-8  col-md-7 table-info col-md-offset-3 col-sm-offset-3">
                                 <tr>
                                    <td>Бібліографічний опис</td>
                                    <td>Definition</td>
                                 </tr>
                                 <tr>
                                     <td>Назва ЕІР</td>
                                     <td>Definition</td>
                                 </tr>
                                 <tr>
                                     <td>Назва кредитного модулю</td>
                                     <td>Definition</td>
                                 </tr>
                                 <tr>
                                     <td>Вид ЕІР</td>
                                     <td>Definition</td>
                                 </tr>
                                 <tr>
                                     <td>Рік</td>
                                     <td>Definition</td>
                                 </tr>
                                 <tr>
                                     <td>Посилання/Файл</td>
                                     <td>Definition</td>
                                 </tr>
                                 <tr>
                                     <td>Анотоція</td>
                                 </tr>
                                 <tr>
                                     <td>Країна</td>
                                 </tr>
                                 <tr>
                                     <td>Місто</td>
                                 </tr>
                              </table>
                          </div>
                             </div>
                           </div>
                         </div>
                         <div class="panel panel-default">
                           <div class="panel-head" role="tab" id="headingThree">
                             <h4 class="panel-title">
                               <a class="collapsed" data-toggle="collapse" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                 Наукова діяльність
                               </a>
                             </h4>
                           </div>
                           <div id="collapseThree" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingThree">
                             <div class="panel-body">
                               CONTENT
                             </div>
                           </div>
                         </div>
                       <!-- END CONTENT -->
                </div>
        </div>

            <div class="tab-pane"  id="tab2" style ="height: 200px">
                <!--#region content  -->
                    <h4>Додаткові функції</h4>
                    <asp:Literal ID="SpecFunc" runat="server"></asp:Literal>
                <!--#endregion -->
            </div>

            <div class="tab-pane" id="tab3" style ="height: 300px">
                <!--#region content  -->
                    <div class="input-group">
                        <label class="control-label" for="File">Обрати файл</label>
                        <asp:FileUpload ClientIDMode="Static" ID="file_upload" runat="server" />
                        <asp:Button runat="server" ID="UploadBtn" OnClick="btnUpload_Click" Text="Завантажити" CssClass="btn btn-success btn-sm"></asp:Button>
                    </div>
                    <br/>
                    <div class="input-group">
                        <label class="control-label" for="OldPass">Старий пароль</label>
                        <asp:TextBox ClientIDMode="Static" ID="OldPass" runat="server" TextMode="Password" CssClass="form-control input-sm"></asp:TextBox>
                    </div>
                    <div class="input-group">
                        <label class="control-label" for="NewPassLabel">Старий пароль</label>
                        <asp:TextBox ClientIDMode="Static" ID="NewPass" runat="server" TextMode="Password" CssClass="form-control input-sm"></asp:TextBox>
                    </div>
                    <div class="input-group">
                        <label class="control-label" for="NewPassCheak">Повторіть новий пароль</label>
                        <asp:TextBox ClientIDMode="Static" ID="NewPassCheak" runat="server" TextMode="Password" CssClass="form-control input-sm"></asp:TextBox>
                    </div>
                    <br />
                    <asp:Button ID="SavePass" runat="server" Text="Зберегти" CssClass="btn btn-success btn-sm" OnClick="SavePass_Click" />
                <!--#endregion -->
            </div>

            <div class="tab-pane" id="tab4"> 
            <!--#region content  -->
                <h4>Погодження про розповсюдження даних, визначених самостійно на сторінках Електронного кампусу, в мережі Інтернет</h4>
                <div id="okay_alert" class="alert alert-warning" role="alert" style="display: none;">
                    Вами було підписано погодження про розповсюдження даних, визначених самостійно на сторінках Електронного кампусу, в мережі Інтернет
                </div>
                <div id="no_alert" class="alert alert-info" role="alert" style="display: none;">
                    Вами було відмовлено можливість розповсюдження даних, визначених самостійно на сторінках Електронного кампусу, в мережі Інтернет
                </div>
                <div id="purpose_alert" class="alert alert-info" role="alert" style="display: none;">
                    <asp:TextBox ClientIDMode="Static" ID="DenyPublicationPurpose" runat="server" placeholder="Причина відмови"></asp:TextBox>
                    <button type="button" class="btn btn-default" onclick="
                        document.getElementById('okay_alert').style.display = 'none';
                        document.getElementById('purpose_alert').style.display = 'none';
                        document.getElementById('no_alert').style.display = 'block';
                        document.getElementById('text').style.display = 'none';
                        document.getElementById('okay_button').style.display = 'okay';
                        document.getElementById('no_button').style.display = 'none
                        var a = '<%= DenyPublication() %>';
                    ">Підтверджую</button>
                </div>
                <h5 id="text">Текст</h5>
                <button id="okay_button" type="button" class="btn btn-warning" onclick="
                    document.getElementById('okay_alert').style.display = 'block';
                    document.getElementById('purpose_alert').style.display = 'none';
                    document.getElementById('no_alert').style.display = 'none';
                    document.getElementById('text').style.display = 'none';
                    document.getElementById('okay_button').style.display = 'none';
                    document.getElementById('no_button').style.display = 'block';
                    var a = '<%= AcceptPublication() %>';
                ">Погоджуюсь</button>
                <button id="no_button" type="button" class="btn btn-info" onclick="
                    document.getElementById('okay_alert').style.display = 'none';
                    document.getElementById('purpose_alert').style.display = 'block';
                    document.getElementById('no_alert').style.display = 'none';
                    document.getElementById('text').style.display = 'block';
                    document.getElementById('okay_button').style.display = 'block';
                    document.getElementById('no_button').style.display = 'none';
                ">Відмовляюсь</button>
            <!--#endregion -->
            </div>

        </div>
    </div>
</asp:Content>
