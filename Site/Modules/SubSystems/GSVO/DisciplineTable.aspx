<%@ Page Title="Нормативні дисципліни" Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master"  CodeBehind="DisciplineTable.aspx.cs" Inherits="Site.Modules.SubSystems.GSVO.DisciplineTable" %>

<asp:Content ID="breadcrumbs_content" ContentPlaceHolderID="breadcrumbs" runat="server">
    <li><a href="/Default.aspx">Домашня</a></li>
    <li><a href="../Default.aspx">Вибір підсистеми</a></li>
    <li><a href="Default.aspx">ОПП ГСВО</a></li>
    <li class="active">Нормативні дисципліни</li>
</asp:Content>
    

<asp:Content ID="body_content" ContentPlaceHolderID="body" runat="server">
    
  <div class="page-header">
        <h1><%=Page.Title %></h1>
        <h3>Освітньо-професійна програма - Галузевий стандарт вищої освіти</h3>
    </div>
    <div class="input-group col-md-9">
        <asp:Literal ID="CathName" runat="server"></asp:Literal>   
        <asp:Literal ID="SpecName" runat="server"></asp:Literal>  
    </div>

    <%--<asp:Button BackColor=""/>--%>

    <div class="main-block">
        <asp:Literal ID="RtDisciplineTable" runat="server"></asp:Literal>
    </div>
</asp:Content>