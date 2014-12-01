<%--<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Table.aspx.cs" Inherits="Site.Modules.SubSystems.SVO.Table" %>--%>
<%@ Page Title="ОПП СВО" Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="Table.aspx.cs" Inherits="Site.Modules.SubSystems.SVO.Table" %>

<asp:Content ID="breadcrumbs_content" ContentPlaceHolderID="breadcrumbs" runat="server">
    <li><a href="/Default.aspx">Домашня</a></li>
    <li><a href="../Default.aspx">Вибір підсистеми</a></li>
    <li><a href="Default.aspx">ОПП ГСВО</a></li>
    <li class="active"></li>
</asp:Content>

<asp:Content ID="body_content" ContentPlaceHolderID="body" runat="server">
    <div class="page-header">
        <h1><%=Page.Title %></h1>
        <h3>Перелік нормативних дисциплін</h3>

        <span> Кафедра: </span>
        <asp:Literal id="CathName" runat="server"></asp:Literal>
        <br />
        <asp:Literal ID="SpecName" runat="server"></asp:Literal>
    </div>

    <div class="main-block">
        <table>
            <tr>
                <td><asp:Button id="AddDisc" runat="server" CssClass="btn btn-success btn-sm" Text="+" Width="25" Height="25"/></td>
                <td>Цикли</td>
                <td>Компоненти</td>
                <td>Дисципліна</td>
                <td>Шифр</td>
                <td>Кількість годин</td>
                <td>Національні кредити</td>
                <td>Кредити ECTS</td>
                <td>Позакредитні дисципліни</td>
                <td>Актуальність</td>
                <td>Статус</td>
                <td>Публікатор</td>
            </tr>
            <tr>

            </tr>
        </table>
    </div>

  
</asp:Content>