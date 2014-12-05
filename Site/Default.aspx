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
            <li><a href="#tab5" data-toggle="tab">Погодження2</a></li>
        </ul>

        <div class="tab-content">
            <div class="tab-pane active" id="tab1">
                <div class="profile">
                    <!-- CONTENT -->
                    <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                        <div class="panel panel-default">
                            <div class="panel-heading  text-right">
                                Загальна інформація
                            </div>
                            <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                                <div class="panel-body">
                                    <div>
                                        <h1 class="profile-name"><%=this.CurrentUser.FullName %><small> к.т.н доцент</small></h1>
                                        <div class="col-xs-12 col-sm-3 col-md-3 ">
                                            <a data-original-title="Dismissible popover" data-toggle="popover" class="btn btn-success" data-trigger="hover" data-placement="bottom" title="" data-content="And here's some amazing content. It's very engaging. Right?">
                                                <asp:Image CssClass="pic img-circle" ID="profile_photo" runat="server" />
                                            </a>
                                        </div>

                                        <table class=" col-xs-12  col-sm-8  col-md-9 table-info">
                                            <tr>
                                                <td>Дані за місцем навчання/роботи:</td>
                                                <td>
                                                    <asp:Literal ID="WorkData" runat="server"></asp:Literal>
                                                </td>
                                            </tr>
                                        </table>

                                        <table class="col-md-6 table-info col-md-offset-3 table-condensed">
                                            <asp:Literal ID="UserContactsLiteral" runat="server"></asp:Literal>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel panel-default">
                        <div class="panel-heading text-right">
                            Педагогічна діяльність
                        </div>
                        <div id="collapseTwo" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingTwo">
                            <div class="panel-body">
                                <table class="col-md-6 table-info col-md-offset-3 table-condensed">
                                            <asp:Literal ID="TimeTablesLiteral" runat="server"></asp:Literal>
                                        </table>
                                 <table class="col-md-6 table-info col-md-offset-3 table-condensed">
                                      <tr>
                                        <td colspan="2"></td>
                                    </tr>
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
                        <div class="panel-heading  text-right">
                            Наукова діяльність
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

            <div class="tab-pane" id="tab2" style="height: 200px">
                <!--#region content  -->
                <h4>Додаткові функції</h4>
                <asp:Literal ID="SpecFunc" runat="server"></asp:Literal>
                <!--#endregion -->
            </div>

            <div class="tab-pane" id="tab3" style="height: 300px">
                <!--#region content  -->
                <div class="input-group">
                    <label class="control-label" for="File">Обрати файл</label>
                    <asp:FileUpload ClientIDMode="Static" ID="file_upload" runat="server" />
                    <asp:Button runat="server" ID="UploadBtn" OnClick="btnUpload_Click" Text="Завантажити" CssClass="btn btn-success btn-sm"></asp:Button>
                </div>
                <br />
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
                    <button type="button" class="btn btn-primary" onclick="
                        document.getElementById('okay_alert').style.display = 'none';
                        document.getElementById('purpose_alert').style.display = 'none';
                        document.getElementById('no_alert').style.display = 'block';
                        document.getElementById('text').style.display = 'none';
                        document.getElementById('okay_button').style.display = 'okay';
                        document.getElementById('no_button').style.display = 'none
                        var a = '<%= DenyPublication() %>';">
                        Підтверджую</button>
                </div>
                <%--<h5 id="text">Текст</h5>--%>
                <button id="okay_button" type="button" class="btn btn-primary" onclick="
                    document.getElementById('okay_alert').style.display = 'block';
                    document.getElementById('purpose_alert').style.display = 'none';
                    document.getElementById('no_alert').style.display = 'none';
                    document.getElementById('text').style.display = 'none';
                    document.getElementById('okay_button').style.display = 'none';
                    document.getElementById('no_button').style.display = 'block';
                    var a = '<%= AcceptPublication() %>';">
                    Погоджуюсь</button>
                <button id="no_button" type="button" class="btn btn-danger" onclick="
                    document.getElementById('okay_alert').style.display = 'none';
                    document.getElementById('purpose_alert').style.display = 'block';
                    document.getElementById('no_alert').style.display = 'none';
                    document.getElementById('text').style.display = 'block';
                    document.getElementById('okay_button').style.display = 'block';
                    document.getElementById('no_button').style.display = 'none';">
                    Відмовляюсь</button>
                <!--#endregion -->
            </div>
            <div class="tab-pane" id="tab5">
                <!--#region content  -->
                
                <div>
                    <asp:UpdatePanel runat="server">
                    <ContentTemplate>
                    <asp:Literal ID="MessegeIsConfirmed" runat="server"></asp:Literal>
                        <%--<div id="MessageForUser"></div>--%>
                        </ContentTemplate>
                </asp:UpdatePanel>
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
                                <li>Фото</li>
                                <li>ПІБ</li>
                                <li>Науковий ступень</li>
                                <li>Вчене звання</li>
                                <li>Данні за місцем роботи (підрозділ(-и), посада(-и))</li>
                            </ul>
                        </li>

                        <li>
                            <strong>Контактна інформація</strong>
                            <ul>
                                <li>E-mail, робочий(-і) телефон(-и),  мобільний(-і) телефон(-и)</li>
                                <li>Адреса за місцем прийому (корпус, кімната, вулиця)</li>
                                <li>Години звернення (розклад прийому/години прийому)</li>
                                <li>Сайт(-и)</li>
                                <li>Посилання на сторінки в соціальних мережах)</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Педагогічна діяльність</strong>
                            <ul>
                                <li>Розклад навчальних занять</li>
                                <li>Методичне забезпечення дисципліни/кредитного модулю</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Наукова  діяльність</strong>
                            <ul>
                                <li>Публікації</li>
                                <li>Конференції/семінари/симпозіуми</li>
                                <li>Гранти/Проекти</li>
                                <li>Авторське свідоцтва/патенти</li>
                                <li>Нагороди</li>
                                <li>Напрями досліджень</li>
                            </ul>
                        </li>

                        <li>
                            <strong>Захоплення/Дозвілля</strong>
                        </li>
                    </ol>

                    <h3 class="text-center">Обрана мною інформація може бути розміщена на сайті intellect.kpi.ua</h3>
                    <div class="text-center">
                        <asp:UpdatePanel runat="server">
                    <ContentTemplate>
                        <asp:Button class="btn btn-primary" ID="btnConfirm" Text="Погоджуюсь" runat="server" OnClick="btnConfirm_Click"/>
                        <%--<button class="btn btn-primary" ID="btnConfirm">Погоджуюсь</button>--%>
                        <asp:Button class="btn btn-primary" ID="btnDenie" Text="Відмовляюсь" runat="server" data-toggle="modal" data-target="#Cancel-modal"/>
                   </ContentTemplate>
                </asp:UpdatePanel>
                         </div>
                </div>

                <!-- Modal 2-->
                <div class="modal fade" id="Cancel-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
                                <asp:Button type="button" class="btn btn-default" ID="btnFailure" Text="OK" runat="server" OnClick="btnFailure_Click"/>
                                <button type="button" class="btn btn-default" data-dismiss="modal">Закрити</button>
                        </ContentTemplate>
                </asp:UpdatePanel>
                            </div>
                        </div>
                    </div>
                </div>
                <!--#endregion -->
                        
            </div>
        </div>
    </div>
</asp:Content>
