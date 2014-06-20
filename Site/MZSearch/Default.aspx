<%@ Page Title="Методичне забезпечення" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.MZSearch.Default" %>


<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">

    <div class="page-header">
        <h1><%=Page.Title %></h1>
    </div>

    <script src="/Scripts/jquery-ui-1.10.4.custom.js"></script>
    <script src="/Scripts/MZ.js"></script>

    <div id="disc_cred_radio" class="row">
        <div class="col-md-4">
            <asp:RadioButton ID="inpDisc" type="radio" GroupName="dcgroup" value="Disc" Checked="True" runat="server" AutoPostBack="True" OnCheckedChanged="inpDisc_OnCheckedChanged" />
            Дисципліна
        </div>
        <div class="col-md-8">
            <asp:RadioButton ID="inpCred" type="radio" GroupName="dcgroup" value="Cred" runat="server" OnCheckedChanged="inpCred_OnCheckedChanged" AutoPostBack="True" />
            Кредитний модуль
        </div>
    </div>

    <div id="serarchForm">

        <div id="DCdiv" runat="server">
            <span id="NameDisc" runat="server" class="input-group-addon col-md-3" style="padding: 9px 9px; width: 235px">Оберіть дисципліну</span>
            <div class="input-group col-md-9">
                <asp:DropDownList ID="DiscList" runat="server" class="form-control" placeholder="Почніть вводити назву дисципліни" AutoPostBack="true" OnSelectedIndexChanged="DiscList_OnSelectedIndexChanged"></asp:DropDownList>
            </div>
        </div>

        <div id="Sdiv" runat="server">
            <span id="NameSpec" class="input-group-addon col-md-3" style="padding: 9px 9px; width: 235px">Оберіть спеціальність</span>
            <div class="input-group col-md-9">
                <asp:DropDownList ID="SList" runat="server" class="form-control" placeholder="Почніть вводити назву спеціальності" AutoPostBack="true" OnSelectedIndexChanged="SList_OnSelectedIndexChanged"></asp:DropDownList>
            </div>
        </div>

        <div id="SFdiv" runat="server" style="margin-top: -40px;" visible="false">
            <span id="NameSF" class="input-group-addon col-md-3" style="padding: 9px 9px; width: 235px">Оберіть форму навчання</span>
            <div class="input-group col-md-9 col-md-offset-3">
                <asp:DropDownList ID="SFList" runat="server" class="form-control" placeholder="Почніть вводити назву форми" AutoPostBack="true" OnSelectedIndexChanged="SFList_OnSelectedIndexChanged"></asp:DropDownList>
            </div>
        </div>

        <%--<asp:Button ID="sb" runat="server" Visible="false" Text="Пошук" class="btn-success col-lg-offset-10 col-md-2" OnClick="sb_OnClick" />--%>
        <input id="sb" runat="server" visible="false" type="button" value="Пошук" class="btn-success col-lg-offset-10 col-md-2" />


        <h2 id="sTitle" style="display: none;">Результати пошуку</h2>
        <div id="sresult" style="display: none" class="row">
            <div id="leftDiv" class="col-md-5">
                <div class="col-lg-12 label label-warning" style="font-size: 100%; margin-bottom: 5px;">Методичне забезпечення</div>
                <div class="subtitle"></div>
                <div id="itemcontainer" class="col-md-12 ldc">
                </div>
            </div>
            <div id="rightDiv" class="col-md-offset-1 col-md-6">
                <div class=" col-lg-12 label label-warning" style="font-size: 100%; margin-bottom: 5px;">Електронні інформаційні ресурси</div>
                <div id="ircontainer" class="col-md-12">
                    <%--<div>--%>
                    <%--<div class="col-md-12 kind">Методичка</div><br>--%>
                    <%--<p class="irrow">Технологія проектування програмного забезпечення - 1. Методологія проектування програмного забезпечення</p>--%>
                    <%--</asp:LinkButton>--%>
                    <%--<ul class="ircol">
                        <li class="row lirow">
                            <span class="col-md-6">Назва на сторінках кампуса</span>
                            <span class="col-md-6">Технологія розробки програмного забезпечення</span>
                        </li>
                        <li class="row lirow">
                            <span class="col-md-6">Назва на сторінках кампуса</span>
                            <span class="col-md-6">Технологія розробки програмного забезпечення</span>
                        </li>
                        <li class="row lirow">
                            <span class="col-md-6">Назва на сторінках кампуса</span>
                            <span class="col-md-6">Технологія розробки програмного забезпечення</span>
                        </li>
                    </ul>--%>
                    <%--<a href="#" class="btn-success col-lg-3 col-lg-offset-9">Відкрепити</a><br>--%>
                    <%--</div>--%>
                </div>
            </div>
        </div>


        <input type="hidden" class="popup-link-1" />
        <!-- use for call popUP by fake click -->
        <div class="popup-box" id="popup-box-1">
            <div class="close">X</div>
            <div class="top">
                <h2>Детальна інформація</h2>
                <div class="popContainer">
                </div>
            </div>
            <div class="bottom">
            </div>
        </div>

        <input id="session" type="hidden" runat="server" />
        <input id="isdisc" type="hidden" runat="server" />
        <input id="disc" type="hidden" runat="server" />
        <input id="spec" type="hidden" runat="server" />
        <input id="stdfrm" type="hidden" runat="server" />
        <input id="irEdit" type="hidden" runat="server" />

    </div>
</asp:Content>
