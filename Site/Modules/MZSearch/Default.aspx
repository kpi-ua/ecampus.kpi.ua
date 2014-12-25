<%@ Page Title="Методичне забезпечення" Language="C#" MasterPageFile="~/Site.Master"
    AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.MZSearch.Default" %>

<asp:Content ID="MZ_Content" ContentPlaceHolderID="body" runat="server">
    <script src="/Scripts/jquery-2.1.1.js"></script>
    <!--<script src="/Scripts/chosen.jquery.js"></script>-->
    <script src="/Scripts/bootstrap.js"></script>
    <script src="/Scripts/jquery-ui-1.10.4.custom.js"></script>
    <script src="/Scripts/MZ.js"></script>
   


    <div class="page-header">
        <h1><%=Page.Title %></h1>
    </div>

    <div class="mz_search">
        <ul class="nav nav-tabs" id="mzTabs">
            <li><a href="#tab1" data-toggle="tab">РНП</a></li>
            <li><a href="#tab2" data-toggle="tab">Кредитні модулі</a></li>
            <li class="active"><a href="#tab3" data-toggle="tab">Дисципліни</a></li>
        </ul>

        <div class="tab-content">
            <!-- Tab Content Starts -->
            <div class="tab-pane" id="tab1">
                <div id="rnp_tab">
                     <div id="rnp_form">
                        <div id="select_year">Навчальний рік:
                            <asp:DropDownList ID="GetYear" runat="server" Name="GetYear"></asp:DropDownList>
                        </div>
                        <div id="select_kaf" style="display:none;">
                            <div class="text_for_dropd">Випускова кафедра:</div>
                            <asp:DropDownList ID="GetKaf" runat="server" Name="GetKaf"></asp:DropDownList>
                        </div>

                        <div id="select_riven" style="display:none;">
                            <div class="text_for_dropd">Освітньо-кваліфікаційний рівень:</div>
                            <asp:DropDownList ID="GetRiven" runat="server" Name="GetRiven"></asp:DropDownList>
                        </div>

                        <div id="select_prof" style="display:none;">
                            <div class="text_for_dropd">Напрям підготовки</div>
                            <asp:DropDownList ID="GetProf" runat="server" Name="GetProf"></asp:DropDownList>
                        </div>

                        <div id="select_form" style="display:none;">
                            <div class="text_for_dropd">Форма навчання:</div>
                            <asp:DropDownList ID="GetForm" runat="server" Name="GetForm"></asp:DropDownList>
                        </div>

                        <div id="select_table" style="display:none;">
                            <div class="text_for_dropd">Таблиця:</div>
                            <asp:DropDownList ID="sel_table" runat="server" Name="sel_table"></asp:DropDownList>
                        </div>

                        <div id="select_group" style="display:none;">
                            <div class="text_for_dropd">Вибір групи:</div>
                            <asp:DropDownList ID="GetGroup" runat="server" Name="GetGroup"></asp:DropDownList>
                        </div>

                        
            <div id="BodyContainer" style="clear:none">
                <asp:Table ID="Table0" runat="server" class="table table-bordered" style="display:none">
                    <asp:TableRow HorizontalAlign="Center">
                        <asp:TableCell RowSpan="3" Width="30px"><div>№</div></asp:TableCell>
                        <asp:TableCell RowSpan="3" Width="250px">Найменування кредитного модулю</asp:TableCell>
                        <asp:TableCell RowSpan="3" Width="90px">Назва кафедри</asp:TableCell>
                        <asp:TableCell ColumnSpan="2" Width="120px">Обсяг дисциплін</asp:TableCell>
                        <asp:TableCell ColumnSpan="4" Width="240px">Аудиторні години</asp:TableCell>
                        <asp:TableCell RowSpan="3" Width="60px"><p class="fa-rotate-270">Самостійна робота студентів</p></asp:TableCell>
                    </asp:TableRow>
                    <asp:TableRow HorizontalAlign="Center">
                        <asp:TableCell RowSpan="2" Width="60px"><p class="fa-rotate-270">Кредитів ECTS</p></asp:TableCell>
                        <asp:TableCell RowSpan="2" Width="60px"><p class="fa-rotate-270">Годин</p></asp:TableCell>
                        <asp:TableCell RowSpan="2" Width="60px"><p class="fa-rotate-270">Всього</p></asp:TableCell>
                        <asp:TableCell ColumnSpan="3">Детально:</asp:TableCell>
                    </asp:TableRow>
                    <asp:TableRow HorizontalAlign="Center" Height="50px">
                        <asp:TableCell Width="60px"><p class="fa-rotate-270">Лекції</p></asp:TableCell>
                        <asp:TableCell Width="60px"><p>Практичні (семінарські)</p></asp:TableCell>
                        <asp:TableCell Width="60px"><p >Лаборатнорні (комп. практикуми)</p></asp:TableCell>
                    </asp:TableRow>
                    <asp:TableRow HorizontalAlign="Center">
                            <asp:TableCell Width="30px">1</asp:TableCell>
                            <asp:TableCell Width="250px">2</asp:TableCell>
                            <asp:TableCell Width="90px">3</asp:TableCell>
                            <asp:TableCell Width="60px">4</asp:TableCell>
                            <asp:TableCell Width="60px">5</asp:TableCell>
                            <asp:TableCell Width="60px">6</asp:TableCell>
                            <asp:TableCell Width="60px">7</asp:TableCell>
                            <asp:TableCell Width="60px">8</asp:TableCell>
                            <asp:TableCell Width="60px">9</asp:TableCell>
                            <asp:TableCell Width="60px">10</asp:TableCell>
                        </asp:TableRow>
                </asp:Table>


                  <asp:Table ID="Table1" runat="server" class="table table-bordered" style="display:none">
                    <asp:TableRow HorizontalAlign="Center">
                        <asp:TableCell RowSpan="2" Width="30px"><div>№</div></asp:TableCell>
                        <asp:TableCell RowSpan="2" Width="250px">Найменування кредитного модулю</asp:TableCell>
                        <asp:TableCell RowSpan="2" Width="90px">Назва кафедри</asp:TableCell>
                        <asp:TableCell ColumnSpan="8" Width="240px">Контрольні заходи та їх розподіл за семестрами</asp:TableCell>
                        
                    </asp:TableRow>
                    <asp:TableRow HorizontalAlign="Center">
                        <asp:TableCell RowSpan="1" Width="60px"><p class="fa-rotate-270">Екзамени</p></asp:TableCell>
                        <asp:TableCell RowSpan="1" Width="60px"><p class="fa-rotate-270">Заліки</p></asp:TableCell>
                        <asp:TableCell RowSpan="1" Width="60px"><p class="fa-rotate-270">Модульні (темат.) контр. роботи</p></asp:TableCell>
                        <asp:TableCell RowSpan="1" Width="60px"><p class="fa-rotate-270">Курсові проекти</p></asp:TableCell>
                        <asp:TableCell RowSpan="1" Width="60px"><p class="fa-rotate-270">Курсові роботи </p></asp:TableCell>
                        <asp:TableCell RowSpan="1" Width="60px"><p class="fa-rotate-270">РГР, РР, ГР</p></asp:TableCell>
                        <asp:TableCell RowSpan="1" Width="60px"><p class="fa-rotate-270">ДКР</p></asp:TableCell>
                        <asp:TableCell RowSpan="1" Width="60px"><p class="fa-rotate-270">Реферати</p></asp:TableCell>
                        
                        
                    </asp:TableRow>
                    
                    <asp:TableRow HorizontalAlign="Center">
                            <asp:TableCell Width="30px">1</asp:TableCell>
                            <asp:TableCell Width="250px">2</asp:TableCell>
                            <asp:TableCell Width="90px">3</asp:TableCell>
                            <asp:TableCell Width="60px">4</asp:TableCell>
                            <asp:TableCell Width="60px">5</asp:TableCell>
                            <asp:TableCell Width="60px">6</asp:TableCell>
                            <asp:TableCell Width="60px">7</asp:TableCell>
                            <asp:TableCell Width="60px">8</asp:TableCell>
                            <asp:TableCell Width="60px">9</asp:TableCell>
                            <asp:TableCell Width="60px">10</asp:TableCell>
                            <asp:TableCell Width="60px">11</asp:TableCell>
                        </asp:TableRow>
                </asp:Table>

                <asp:Table ID="Table2" runat="server" class="table table-bordered" style="display:none">
                    <asp:TableRow HorizontalAlign="Center">
                        <asp:TableCell RowSpan="3" Width="30px"><div>№</div></asp:TableCell>
                        <asp:TableCell RowSpan="3" Width="250px">Найменування кредитного модулю</asp:TableCell>
                        <asp:TableCell RowSpan="3" Width="90px">Назва кафедри</asp:TableCell>
                        <asp:TableCell ColumnSpan="2" Width="120px">Обсяг дисциплін</asp:TableCell>
                        <asp:TableCell ColumnSpan="4" Width="240px">Аудиторні години</asp:TableCell>
                        <asp:TableCell RowSpan="3" Width="60px"><p class="fa-rotate-270">Самостійна робота студентів</p></asp:TableCell>
                    </asp:TableRow>
                    <asp:TableRow HorizontalAlign="Center">
                        <asp:TableCell RowSpan="2" Width="60px"><p class="fa-rotate-270">Кредитів ECTS</p></asp:TableCell>
                        <asp:TableCell RowSpan="2" Width="60px"><p class="fa-rotate-270">Годин</p></asp:TableCell>
                        <asp:TableCell RowSpan="2" Width="60px"><p class="fa-rotate-270">Всього</p></asp:TableCell>
                        <asp:TableCell ColumnSpan="3">Детально:</asp:TableCell>
                    </asp:TableRow>
                    <asp:TableRow HorizontalAlign="Center" Height="50px">
                        <asp:TableCell Width="60px"><p class="fa-rotate-270">Лекції</p></asp:TableCell>
                        <asp:TableCell Width="60px"><p>Практичні (семінарські)</p></asp:TableCell>
                        <asp:TableCell Width="60px"><p >Лаборатнорні (комп. практикуми)</p></asp:TableCell>
                    </asp:TableRow>
                    <asp:TableRow HorizontalAlign="Center">
                            <asp:TableCell Width="30px">1</asp:TableCell>
                            <asp:TableCell Width="250px">2</asp:TableCell>
                            <asp:TableCell Width="90px">3</asp:TableCell>
                            <asp:TableCell Width="60px">4</asp:TableCell>
                            <asp:TableCell Width="60px">5</asp:TableCell>
                            <asp:TableCell Width="60px">6</asp:TableCell>
                            <asp:TableCell Width="60px">7</asp:TableCell>
                            <asp:TableCell Width="60px">8</asp:TableCell>
                            <asp:TableCell Width="60px">9</asp:TableCell>
                            <asp:TableCell Width="60px">10</asp:TableCell>
                        </asp:TableRow>
                </asp:Table>

            </div>

                    </div>
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
                            <asp:DropDownList ID="DiscList" runat="server" class="form-control" placeholder="Почніть вводити назву дисципліни"
                                AutoPostBack="true" OnSelectedIndexChanged="DiscList_OnSelectedIndexChanged">
                            </asp:DropDownList>
                        </div>
                    </div>

                    <div id="Sdiv" runat="server">
                        <span id="NameSpec" class="input-group-addon col-md-3" style="padding: 9px 9px; width: 235px">Оберіть спеціальність</span>
                        <div class="input-group col-md-9">
                            <asp:DropDownList ID="SList" runat="server" class="form-control" placeholder="Почніть вводити назву спеціальності"
                                AutoPostBack="true" OnSelectedIndexChanged="SList_OnSelectedIndexChanged">
                            </asp:DropDownList>
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
    </div>
</asp:Content>
