<%@ Page Title="Нормативні дисципліни" Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master"  CodeBehind="DisciplineTable.aspx.cs" Inherits="Site.Modules.SubSystems.GSVO.DisciplineTable" %>

<asp:Content ID="breadcrumbs_content" ContentPlaceHolderID="breadcrumbs" runat="server">
    <li><a href="/Default.aspx">Домашня</a></li>
    <li><a href="../Default.aspx">Вибір підсистеми</a></li>
    <li><a href="Default.aspx">ОПП ГСВО</a></li>
    <li class="active">Нормативні дисципліни</li>
</asp:Content>

<asp:Content ID="body_content" ContentPlaceHolderID="body" runat="server">
    <asp:Literal ID="CathName" runat="server"></asp:Literal>   
    <asp:Literal ID="SpecName" runat="server"></asp:Literal>    
</asp:Content>