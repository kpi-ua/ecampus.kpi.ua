<%@ Page Title="Створення IР" Language="C#" MasterPageFile="~/Modules/EIR/Menu.master" AutoEventWireup="true" CodeBehind="Create.aspx.cs" Inherits="Site.Modules.EIR.Create" %>

<asp:Content ID="Content3" ContentPlaceHolderID="breadcrumbs_new" runat="server">
    <li class="active">Створити</li>     
</asp:Content>

<asp:Content ID="Content1" ContentPlaceHolderID="newhead" runat="server">
    <link href="/Content/jquery.ambiance.css" rel="stylesheet" />
    <link href="/Content/CreatePage.css" rel="stylesheet" />
    <link href="/Content/jquery-ui.min.autocomplete.css" rel="stylesheet" />
    <link href="../../Content/tree/style.css" rel="stylesheet" />
    
    <script src="../../Scripts/async.js"></script>
    <script src="/Scripts/chosen.jquery.js"></script>
    <script src="/Scripts/APIlib.js"></script>
    <script src="/Scripts/jquery.ambiance.js"></script>
    <script src="/Scripts/CreatePage.js"></script>
    <script src="/Scripts/jquery-ui.min.autocomplete.js"></script>
    <script src="../../Scripts/jstree.js"></script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="newbody" runat="server">
    <div class="main-block">
        <table>
            <tr>
                <td class="main">
                    <span id="expand_persons" class="glyphicon glyphicon-user">Учасники</span>
                    <div class="persons-list">
                    </div>
                    <div class="persons-block">
                        <br />
                        <div id="persons_radio">
                        <input type="radio" value="kpi" id="kpi" checked />Особа з КПІ
                        <input type="radio" value="notkpi" id="notkpi" />Стороння особа
                            </div>
                        <input type="text" value="" id="name" placeholder="ПІБ автора" />
                        <input type="hidden" id="kpi_person_info" value="" role=""/> <%--role do not delete!!!--%>
                        <input type="hidden" id="person_id" value=""/>
                        <input type="text" value="" style="display: none" id="surname" placeholder="ПІБ автора" />
                        <select id="person_type" style="display: none">
                            <option disabled selected value="--">Посада</option>
                        </select>
                        <select id="contrib_type">
                            <option selected value="--">Тип внеску</option>
                        </select>
                        <input type="text" value="" id="contrib_percent" placeholder="%" />%
                        <div></div>
                        <input class="btn btn-default" type="button" id="add_person" value="Добавить" />
                        <input class="btn btn-default" type="button" id="clear_person" value="Очистить" />
                        <label id="info_lable"></label>
                    </div>
                    <hr />
                    <span id="expand_info" class="glyphicon glyphicon-expand">Основна Информация</span>
                    <div>
                        <input type="radio" value="public" id="public" checked />Публічний
                            <input type="radio" value="private" id="private" />Приватний
                    </div>
                    <br />
                    <div>
                        <select id="type">
                            <option disabled selected value="--">Вид</option>
                        </select>
                        <input id="view_tree" class="btn btn-default btn-lg" type="button" value="Дерево" data-toggle="modal" data-target="#myModal"/>
                    </div>
                    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                                    <h4 class="modal-title" id="myModalLabel">Дерево пошуку</h4>
                                </div>
                                <div class="modal-body">
                                    <div id="search_tree">
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Відмінити</button>
                                    <button id="tree_select" type="button" class="btn btn-primary">Вибрати</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div class="langs-list"></div>
                    <div class="info-block">
                        <div id="lang_name_label">Введіть основну мову</div>
                        <div>
                            <br />
                            <select id="lang">
                                <option disabled value="--">Введіть мову</option>
                            </select>
                            <input type="hidden" id="lang_id"/>
                            <input type="text" value="" id="title" placeholder="Назва" />
                            <input type="text" value="" id="annotation" placeholder="Аннотації"/>
                            <input type="text" id="keywords" value="" placeholder="Ключові слова"/>
                            <input type="button" class="btn btn-default" id="add_lang" value="Добавить" />
                            <input type="button" class="btn btn-default" id="clear_lang" value="Очистить" />

                        </div>
                    </div>
                    <input type="button" id="save" class="btn btn-primary" value="Зберегти"/>
                </td>
                <td>
                    <div class="right-block">
                    <div class="files-block">
                        <input type="text" placeholder="какой-то текст"/>
                        <br/>
                        <input type="button" value='кнопка1'/>
                        <input type="button" value='кнопка2'/>
                    </div>
                </div>
                </td>
            </tr>
        </table>
    </div>
</asp:Content>
