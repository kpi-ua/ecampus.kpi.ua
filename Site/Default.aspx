<%@ Page Title="Профіль" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Default" %>

<asp:Content ID="breadcrumbs_content" ContentPlaceHolderID="breadcrumbs" runat="server">
    <li><a href="/Default.aspx">Домашня</a></li>
    <li class="active">Персональні данні</li>
</asp:Content>

<asp:Content ID="body_content" ContentPlaceHolderID="body" runat="server">
    <div class="profile">
        <ul class="nav nav-tabs" id="myTab">
            <li class="active"><a href="#tab1" data-toggle="tab">Персональні дані</a></li>
            <li><a href="#tab2" data-toggle="tab">Редагування профайлу</a></li>
            <li><a href="#tab3" data-toggle="tab">Погодження</a></li>
        </ul>

        <div class="tab-content">
            <div class="tab-pane active" id="tab1">
                <div class="profile">
                    <!-- CONTENT -->
                    <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                        <div class="accordion-group">
                            <div class="panel panel-default">
                                <div class="panel-heading  text-left" data-toggle="collapse" data-target="#collapseOne" data-parent="#accordion">
                                    Загальна інформація
                                </div>
                                <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                                    <div class="panel-body">
                                        <div>
                                            <h1 class="profile-name"><%=this.CurrentUser.FullName %></h1>
                                            <%--<h4 class="UserCredo">Кредо "Вік живи-вік вчись" <span class="glyphicon glyphicon-pencil" id="CredoUpdate" data-toggle="modal" data-target="#ChangeCredo-modal" ></span></h4>--%>
                                            <asp:Literal runat="server" ID="CredoLiteral"></asp:Literal>
                                            <div class="col-xs-12 col-sm-3 col-md-3 ">
                                                <a id="user_avatar" data-original-title="Dismissible popover" data-toggle="popover" class="btn btn-success" data-trigger="hover" data-placement="bottom" title="" data-content="And here's some amazing content. It's very engaging. Right?">
                                                    <asp:Image CssClass="pic img-circle" ID="profile_photo" runat="server" />
                                                    <div class="owner_photo_bubble_wrap">
                                                        <div id="owner_photo_bubble">
                                                            <div class="owner_photo_bubble_action">
                                                                <label class="owner_photo_bubble_action_in" data-toggle="modal" data-target="#UploadFoto-modal">
                                                                    <%--<input type="file" style="display: none" />--%>Загрузить фотографию</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <%--<asp:FileUpload ClientIDMode="Static" ID="file_upload" runat="server" OnDisposed="btnUpload_Click" />--%>
                                                </a>
                                                <asp:UpdatePanel runat="server">
                                                    <ContentTemplate>
                                                <span id="hide_user_photo" onclick="$('#hide_user_photo').toggleClass('glyphicon-eye-open'); $('#hide_user_photo').toggleClass('glyphicon-eye-close');" class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
                                                    </ContentTemplate>
                                                </asp:UpdatePanel>
                                            </div>

                                            <table class="col-xs-12  col-sm-8  col-md-9 table-info">
                                                <tr>
                                                    <%--<td>Дані за місцем навчання/роботи:</td>
                                                    <td>--%>
                                                    <asp:Literal ID="WorkData" runat="server"></asp:Literal>
                                                    <%-- </td>--%>
                                                </tr>
                                            </table>

                                            <table class="col-xs-12  col-sm-8  col-md-9 table-info">
                                                <asp:Literal ID="UserContactsLiteral" runat="server"></asp:Literal>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="panel panel-default">
                                <div class="panel-heading  text-left" data-toggle="collapse" data-target="#collapseTwo" data-parent="#accordion">
                                    Педагогічна діяльність
                                </div>
                                <div id="collapseTwo" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingTwo">
                                    <div class="panel-body">
                                        <table class="col-md-6 table-info col-md-offset-3 table-condensed">
                                            <asp:Literal ID="TimeTablesLiteral" runat="server"></asp:Literal>
                                        </table>
                                        <table class="col-xs-12  col-sm-8  col-md-7 table-info col-md-offset-3 col-sm-offset-3">
                                            <tr>
                                                <td><strong>Бібліографічний опис</strong></td>
                                                <td>Definition</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Назва ЕІР</strong></td>
                                                <td>Definition</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Назва кредитного модулю</strong></td>
                                                <td>Definition</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Вид ЕІР</strong></td>
                                                <td>Definition</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Рік</strong></td>
                                                <td>Definition</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Посилання/Файл</strong></td>
                                                <td>Definition</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Анотоція</strong></td>
                                                <td>Definition</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Країна</strong></td>
                                                <td>Definition</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Місто</strong></td>
                                                <td>Definition</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="panel panel-default">
                                <div class="panel-heading  text-left" data-toggle="collapse" data-target="#collapseThree" data-parent="#accordion">
                                    Наукова Діяльність
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
                </div>
            </div>

           <div class="tab-pane" id="tab2" style="height: 300px">
                <!--#region content  -->
                <div class="inline-panel">
                    <div class="panel-body">
                        <!-- Таблица профиля/ролей идёт сюда -->
                            <asp:Literal ID="SpecFunc" runat="server"></asp:Literal>
                    </div>
                </div>
                <div class="inline-panel">
                <div class="input-group">
                    <script src="Scripts/jquery-filestyle.js"></script>
                    <label class="control-label" for="OldPass">Старий пароль</label>
                    <asp:TextBox ClientIDMode="Static" ID="OldPass" runat="server" TextMode="Password" CssClass="form-control input-sm"></asp:TextBox>
                    <label class="control-label" for="NewPassLabel">Новий пароль</label>
                    <asp:TextBox ClientIDMode="Static" ID="NewPass" runat="server" TextMode="Password" CssClass="form-control input-sm"></asp:TextBox>
                    <label class="control-label" for="NewPassCheak">Повторіть новий пароль</label>
                    <asp:TextBox ClientIDMode="Static" ID="NewPassCheak" runat="server" TextMode="Password" CssClass="form-control input-sm"></asp:TextBox>
                </div>
                <br />
                <asp:Button ID="SavePass" runat="server" Text="Зберегти" CssClass="btn btn-success btn-sm" OnClick="SavePass_Click" />
                <!--#endregion -->
                </div>
                </div>
            <div class="tab-pane" id="tab3">
                <!--#region content  -->
                <div>
                    <asp:UpdatePanel runat="server">
                        <ContentTemplate>
                            <asp:Literal ID="MessegeIsConfirmed" runat="server"></asp:Literal>

                            <h1 class="text-center">ЗГОДА</h1>

                            <h3 class="text-center">На публікацію даних на сайті intellect.kpi.ua в мережі Інтернет</h3>
                            <div class="btn-group">
                            </div>
                            Intellect.kpi.ua - публічний веб-сайт, який складається з офіційних веб-сторінок викладачів НТУУ «КПІ».
                            Основний вміст intellect.kpi.ua - записи, що регулярно автоматично оновлюються з персонального електронного кабінету НПП (науково-педагогічного працівника) системи Кампус.
                            <br />
                                    На intellect.kpi.ua розміщується тільки та інформація, яку визначає сам користувач у своєму персональному кабінеті.
                            Відомості, які можуть бути представлені на intellect.kpi.ua:
                            <ol class="privacy-list">
                               <li>
                                   <strong>Загальна інформація</strong>:
                                    <ul>
                                        <li>- Фото</li>
                                        <li>- ПІБ</li>
                                        <li>- Науковий ступень</li>
                                        <li>- Вчене звання</li>
                                        <li>- Данні за місцем роботи (підрозділ(-и), посада(-и))</li>
                                    </ul>
                               </li>

                               <li>
                                   <strong>Контактна інформація</strong>
                                   <ul>
                                       <li>- E-mail, робочий(-і) телефон(-и),  мобільний(-і) телефон(-и)</li>
                                       <li>- Адреса за місцем прийому (корпус, кімната, вулиця)</li>
                                       <li>- Години звернення (розклад прийому/години прийому)</li>
                                       <li>- Сайт(-и)</li>
                                       <li>- Посилання на сторінки в соціальних мережах)</li>
                                   </ul>
                               </li>
                               <li>
                                   <strong>Педагогічна діяльність</strong>
                                   <ul>
                                       <li>- Розклад навчальних занять</li>
                                       <li>- Методичне забезпечення дисципліни/кредитного модулю</li>
                                   </ul>
                               </li>
                               <li>
                                   <strong>Наукова  діяльність</strong>
                                   <ul>
                                       <li>- Публікації</li>
                                       <li>- Конференції/семінари/симпозіуми</li>
                                       <li>- Гранти/Проекти</li>
                                       <li>- Авторське свідоцтва/патенти</li>
                                       <li>- Нагороди</li>
                                       <li>- Напрями досліджень</li>
                                   </ul>
                               </li>

                               <li>
                                   <strong>Захоплення/Дозвілля</strong>
                               </li>
                           </ol>

                            <h3 class="text-center">Обрана мною інформація може бути розміщена на сайті intellect.kpi.ua</h3>
                            <div class="text-center">
                                <asp:Button class="btn btn-primary" ID="btnConfirm" Text="Погоджуюсь" runat="server" OnClick="btnConfirm_Click" />
                                <asp:Button class="btn btn-primary" ID="btnDenie" Text="Відмовляюсь" runat="server" data-toggle="modal" data-target="#Cancel-modal" />
                            </div>
                        </ContentTemplate>
                    </asp:UpdatePanel>
                </div>
            </div>

            <!-- Modal 1-->
            <div class="modal" id="Cancel-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <h4 class="modal-title" id="myModalLabel">Повідомлення</h4>
                        </div>
                        <div class="modal-body">
                            <p>
                                Ви відмовились від розміщення вашої персональної інформації на сайті intellect.kpi.ua в мережі Інтернет
                            </p>
                            <p>
                                Вкажіть будь ласка причину:
                            </p>
                            <div>
                                <asp:TextBox ClientIDMode="Static" ID="ReasonTextBox" runat="server" placeholder="Причина відмови"></asp:TextBox>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <asp:UpdatePanel runat="server">
                                <ContentTemplate>
                                    <asp:Button type="button" class="btn btn-default" ID="btnFailure" Text="OK" runat="server" OnClick="btnFailure_Click" />
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Закрити</button>
                                </ContentTemplate>
                            </asp:UpdatePanel>
                        </div>
                    </div>
                </div>

            </div>
            <!--#endregion -->
            <!-- Modal 2-->
            <div class="modal" id="UploadFoto-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <h4 class="modal-title" id="myModalLabel">Оберіть фото</h4>
                        </div>
                        <div class="modal-body">
                             <asp:FileUpload ClientIDMode="Static" ID="UserFotoFileUpload" runat="server" placeholder="Оберіть файл..." data-theme="gray" data-buttonText="" data-iconName="icon-download-alt" />
                        </div>
                        <div class="modal-footer">
                                    <asp:Button type="button" class="btn btn-default" ID="btnUploadUserFoto" Text="OK" runat="server" OnClick="btnUploadUserFoto_Click" />
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Закрити</button>
                        </div>
                    </div>
                </div>

            </div>
            <!--#endregion -->
            <!-- Modal 3-->
            <div class="modal" id="ChangeCredo-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <h4 class="modal-title" id="myModalLabel">Введіть новий статус</h4>
                        </div>
                        <div class="modal-body">
                              <asp:TextBox ClientIDMode="Static" ID="NewUserCredoTextBox" runat="server" placeholder="Нове кредо" TextMode="MultiLine" MaxLength="100"></asp:TextBox>
                        </div>
                        <div class="modal-footer">
                                    <asp:Button type="button" class="btn btn-default" ID="BtnChangeCredo" Text="OK" runat="server" OnClick="BtnChangeCredo_Click" />
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Закрити</button>
                        </div>
                    </div>
                </div>

            </div>
            <!--#endregion -->
        </div>
    </div>

</asp:Content>
