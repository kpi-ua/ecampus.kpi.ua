<%--<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Modules.SubSystems.GSVO.Default" %>--%>
<%@ Page Title="ОПП ГСВО" Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="Default.aspx.cs" Inherits="Site.Modules.SubSystems.GSVO.Default" %>



<asp:Content ID="breadcrumbs_content" ContentPlaceHolderID="breadcrumbs" runat="server">
    <li><a href="/Default.aspx">Домашня</a></li>
    <li><a href="../Default.aspx">Вибір підсистеми</a></li>
    <li class="active">ОПП ГСВО</li>
</asp:Content>

<asp:Content ID="body_content" ContentPlaceHolderID="body" runat="server">
    <div class="page-header">
        <h1><%=Page.Title %></h1>
        <h3>Освітньо-професійна програма - Галузевий стандарт вищої освіти</h3>
    </div>

   <%-- <center>
        <span>Оберіть кафедру</span>
        <asp:DropDownList ID="SList" runat="server" class="form-control" placeholder="Почніть вводити назву кафедри" AutoPostBack="true" width="700"></asp:DropDownList>
    </center>--%>
    <span id="NameDisc" runat="server" class="input-group-addon col-md-3" style="padding: 9px 9px; width: 235px">Оберіть кафедру</span>
    <div class="input-group col-md-9">
        <asp:DropDownList ID="DiscList" runat="server" class="form-control" placeholder="Почніть вводити назву кафедри" AutoPostBack="true" ></asp:DropDownList>
    </div>         
</asp:Content>