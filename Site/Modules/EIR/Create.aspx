<%@ Page Title="Створення IР" Language="C#" MasterPageFile="~/Modules/EIR/Menu.master" AutoEventWireup="true" CodeBehind="Create.aspx.cs" Inherits="Site.Modules.EIR.Create" %>

<asp:Content ID="Content3" ContentPlaceHolderID="breadcrumbs_new" runat="server">
    <li class="active">Створити</li>
</asp:Content>

<asp:Content ID="Content1" ContentPlaceHolderID="newhead" runat="server">
    <link href="/Content/jquery.ambiance.css" rel="stylesheet" />
    <link href="/Content/jquery-ui.min.autocomplete.css" rel="stylesheet" />
    <link href="/Content/tree/style.css" rel="stylesheet" />

    <script src="/Scripts/async.js"></script>
    <script src="/Scripts/chosen.jquery.js"></script>
    <script src="/Scripts/APIlib.js"></script>
    <script src="/Scripts/jquery.ambiance.js"></script>
    <script src="/Scripts/CreatePage.js"></script>
    <script src="/Scripts/jquery-ui.min.autocomplete.js"></script>
    <script src="/Scripts/jstree.js"></script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="newbody" runat="server">

    <div class="main">
        <h4 id="expand_persons"><span class="glyphicon glyphicon-user"></span>&nbsp;Учасники</h4>

        <div class="persons-list"></div>

        <div class="persons-block">

            <div class="form-group" id="persons_radio">
                <input type="radio" name="persons-radio" value="kpi" id="kpi" checked  />Особа з КПІ
                <input type="radio" name="persons-radio" value="notkpi" id="notkpi" />Стороння особа
            </div>

            <div class="form-group">
                <input class="form-control" type="text" value="" id="name" placeholder="ПІБ автора" />
            </div>

            <div class="form-group">
                <input class="form-control" type="text" value="" style="display: none" id="surname" placeholder="ПІБ автора" />
            </div>

            <div class="form-group">
                <select class="form-control" id="person_type" style="display: none">
                    <option disabled selected value="--">Посада</option>
                </select>
            </div>
            <div class="form-group">
                <select class="form-control" id="contrib_type">
                    <option selected value="--">Тип внеску</option>
                </select>
            </div>

            <div class="form-group">
                <input class="form-control" type="text" value="" id="contrib_percent" placeholder="%" />
            </div>

            <div class="form-group text-right">
                <input class="btn btn-primary" type="button" id="add_person" value="Додати" />
                <input class="btn btn-default" type="button" id="clear_person" value="Відмінити" />
            </div>

            <label id="info_lable"></label>
        </div>

        <hr />

        <h4 id="expand_info"><span class="glyphicon glyphicon-expand"></span>&nbsp;Основна Информация</h4>

        <div class="form-group">
            <input type="radio" name="privacy" value="public" id="public" checked />Публічний
            <input type="radio" name="privacy" value="private" id="private" />Приватний
        </div>

        <div class="form-inline form-group">
            <select class="form-control" id="type">
                <option class="form-control" disabled selected value="--">Вид</option>
            </select>
            <input class="form-control" id="view_tree" class="btn btn-defaul" type="button" value="Дерево" data-toggle="modal" data-target="#myModal" />

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

        <div class="langs-list"></div>

        <div class="info-block">
            <div class="form-group">
                <label for="lang" id="lang_name_label">Введіть основну мову</label>
                <select class="form-control" id="lang">
                    <option disabled value="--">Введіть мову</option>
                </select>
            </div>
            <div class="form-group">
                <input class="form-control" type="text" value="" id="title" placeholder="Назва" />
            </div>
            <div class="form-group">
                <input class="form-control" type="text" value="" id="annotation" placeholder="Аннотації" />
            </div>
            <div class="form-group">
                <input class="form-control" type="text" id="keywords" value="" placeholder="Ключові слова" />
            </div>
            <div class="form-group text-right">
                <input type="button" class="btn btn-primary" id="add_lang" value="Додати" />
                <input type="button" class="btn btn-default" id="clear_lang" value="Відмінити" />
            </div>


        </div>
        <div class="form-group text-right">
            <input type="button" id="save" class="btn btn-primary" value="Зберегти" />
        </div>
    </div>


    <input type="hidden" id="lang_id" />
    <input type="hidden" id="kpi_person_info" value="" role="" /><%--role do not delete!!!--%>
    <input type="hidden" id="person_id" value="" />
</asp:Content>
