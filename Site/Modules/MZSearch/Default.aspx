<%@ Page Title="Методичне забезпечення" Language="C#" MasterPageFile="~/Site.Master" 
    AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.MZSearch.Default" %>

<asp:Content ID="MZ_Content" ContentPlaceHolderID="body" runat="server">
    <script src="/Scripts/jquery-2.1.1.js"></script>
    <script src="/Scripts/chosen.jquery.js"></script>   
    <script src="/Scripts/bootstrap.js"></script>
    <script src="/Scripts/jquery-ui-1.10.4.custom.js"></script>
    <script src="/Scripts/MZ.js"></script>

    <div class="page-header">
        <h1><%=Page.Title %></h1>
    </div>

    <div class="mz_seach">
        <ul class="nav nav-tabs" id="mzTabs">
            <li><a href="#tab1" data-toggle="tab">РНП</a></li>
            <li><a href="#tab2" data-toggle="tab">Кредитні модулі</a></li>
            <li class="active"><a href="#tab3" data-toggle="tab">Дисципліни</a></li>
        </ul>

        <div class="tab-content">
            <!-- Tab Content Starts -->
            <div class="tab-pane" id="tab1">
                <div id="rnp_tab">
                    <strong>Сторінка "РНП" знаходиться в розробці.</strong>
                </div>
            </div>

            <div class="tab-pane" id="tab2">
                <div id="credit_tab">
                    <strong>Сторінка "Кредитні модулі" знаходиться в розробці.</strong>
                </div>
            </div>

            <div class="tab-pane active" id="tab3">                
                <!--Discipline Tab Content Starts -->
                <div id="searchForm">
                <div id="DCdiv" runat="server">
                    <span id="NameDisc" runat="server" class="input-group-addon col-md-3" style="padding: 9px 9px; width: 235px">Оберіть дисципліну</span>
                    <div class="input-group col-md-9">
                        <asp:DropDownList ID="DiscList" runat="server" class="form-control" placeholder="Почніть вводити назву дисципліни" AutoPostBack="true" 
                            OnSelectedIndexChanged="DiscList_OnSelectedIndexChanged"></asp:DropDownList>
                    </div>
                </div>

                <div id="Sdiv" runat="server">
                    <span id="NameSpec" class="input-group-addon col-md-3" style="padding: 9px 9px; width: 235px">Оберіть спеціальність</span>
                    <div class="input-group col-md-9">
                        <asp:DropDownList ID="SList" runat="server" class="form-control" placeholder="Почніть вводити назву спеціальності" AutoPostBack="true" 
                            OnSelectedIndexChanged="SList_OnSelectedIndexChanged"></asp:DropDownList>
                    </div>
                </div>

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
            <!--Discipline Tab Content Ends -->
            </div>
                
        <!-- Tab Content Ends --> 
        </div>

        <input id="session" type="hidden" runat="server" />
        <input id="isdisc" type="hidden" runat="server" />
        <input id="disc" type="hidden" runat="server" />
        <input id="spec" type="hidden" runat="server" />
        <input id="stdfrm" type="hidden" runat="server" />
        <input id="irEdit" type="hidden" runat="server" />

    </div>
</asp:Content>
