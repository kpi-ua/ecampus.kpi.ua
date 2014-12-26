<%@ Page Title="Створення навчальної дисципліни нормативної складової ОПП ГСВО" Language="C#" AutoEventWireup="true" CodeBehind="SearchDiscipline.aspx.cs" MasterPageFile="~/Site.Master" Inherits="Site.Modules.SubSystems.GSVO.SearchDiscipline" %>

<asp:Content ID="breadcrumbs_content" ContentPlaceHolderID="breadcrumbs" runat="server">
    <li><a href="/Default.aspx">Домашня</a></li>
    <li><a href="../Default.aspx">Вибір підсистеми</a></li>
    <li><a href="Default.aspx">ОПП ГСВО</a></li>
    <li><a href="DisciplineTable.aspx">Нормативні дисципліни</a></li>
    <li class="active">Створення навчальної дисципліни нормативної складової ОПП ГСВО</li>
</asp:Content>

<asp:Content ID="body_content" ContentPlaceHolderID="body" runat="server">

    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css">
    <script src="//code.jquery.com/jquery-1.10.2.js"></script>
    <script src="//code.jquery.com/ui/1.11.2/jquery-ui.js"></script>
    <script src="/Scripts/APIlib.js"></script>
    <script>
        $(function () {

            var rawData = <%=new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(this.discipline) %>
            $("#avt").autocomplete({
                source: rawData,
                minLength: 3,
                delay: 500
            });
        });
    </script>

    <div class="page-header">
        <h1><%=Page.Title %></h1>
        <h3>Освітньо-професійна програма - Галузевий стандарт вищої освіти</h3>
    </div>
    <div class="input-group col-md-9">
        <asp:Literal ID="Cath" runat="server"></asp:Literal>
        <asp:Literal ID="Spec" runat="server"></asp:Literal>
    </div>

    <div class="main-block">
        <span id="Disc" runat="server" class="input-group-addon col-md-3" style="padding: 9px 9px; width: 235px">Оберіть дисципліну</span>
        <div class="input-group col-md-9">
            <input class="form-control" name="eirauthor" type="text" id="avt" placeholder="Дисципліна" />

            <legend title="Результат">
                <asp:DataList runat="server" ID="DiscList" CssClass="form-control"></asp:DataList>
            </legend>

        </div>
    </div>

</asp:Content>
