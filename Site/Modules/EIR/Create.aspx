<%@ Page Title="Створення IР" Language="C#" MasterPageFile="~/Modules/EIR/Menu.master" AutoEventWireup="true" CodeBehind="Create.aspx.cs" Inherits="Site.Modules.EIR.Create" %>

<asp:Content ID="Content1" ContentPlaceHolderID="newhead" runat="server">
    <link href="/Content/jquery.ambiance.css" rel="stylesheet" />
    <link href="/Content/CreatePage.css" rel="stylesheet" />
    <link href="/Content/jquery-ui.min.autocomplete.css" rel="stylesheet" />

    <script src="/Scripts/APIlib.js"></script>
    <script src="/Scripts/jquery.ambiance.js"></script>
    <script src="/Scripts/CreatePage.js"></script>
    <script src="/Scripts/jquery-ui.min.autocomplete.js"></script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="newbody" runat="server">
    <asp:HiddenField runat="server" ID="ssid" Value="" />
    <asp:HiddenField runat="server" ID="api" Value="" />

    <div class="main-block">
        <table>
            <tr>
                <td>
                    <span id="expand_persons" class="glyphicon glyphicon-expand">Учасники</span>
                    <div class="persons-list">
                    </div>
                    <div class="persons-block">
                        <br />
                        <input type="radio" value="kpi" id="kpi" checked />Особа з КПИ
                        <input type="radio" value="notkpi" id="notkpi" />Стороння особа
                        <input type="text" value="ПИБ" id="name" />
                        <input type="hidden" id="kpi_person_info" value="" />
                        <input type="text" value="ПИБ" style="display: none" id="surname" />
                        <select id="person_type" style="display: none">
                            <option disabled selected value="--">--</option>
                        </select>
                        <select id="contrib_type">
                            <option disabled selected value="--">--</option>
                        </select>
                        <input type="text" value="" id="contrib_percent" />%
                        <div></div>
                        <input class="btn btn-default" type="button" id="add_person" value="Добавить" />
                        <input class="btn btn-default" type="button" id="clear_person" value="Очистить" />
                        <label id="info_lable"></label>
                    </div>
                    <hr />
                    <span id="expand_info" class="glyphicon glyphicon-expand">Основна Информация</span>
                    <div>
                        <input type="radio" value="public" id="public" checked />Публичный
                            <input type="radio" value="private" id="private" />Приватный
                    </div>
                    <br />
                    <div>
                        <select id="type">
                            <option disabled value="--">--</option>
                        </select>
                    </div>
                    <br />
                    <div class="langs-list"></div>
                    <div class="info-block">
                        <div id="lang_name_label">Введите основной язык</div>
                        <div>
                            <br />
                            <select id="lang">
                                <option disabled value="--">--</option>
                            </select>
                            <input type="text" value="title" id="title" />
                            <input type="text" value="" id="annotation" />
                            <input type="button" class="btn btn-default" id="add_lang" value="Добавить" />
                            <input type="button" class="btn btn-default" id="clear_lang" value="Добавить" />

                        </div>
                    </div>
                </td>
                <td>
                    <div class="file-block">
                    </div>
                </td>
            </tr>
        </table>
    </div>
</asp:Content>
