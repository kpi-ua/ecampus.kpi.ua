<%@ Page Title="Індивідуальний план викладача" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="IndividualTeachersPlan.aspx.cs" Inherits="Site.IndividualTeachersPlan" %>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">

    <div class="page-header">
        <h1><%=Page.Title %></h1>
    </div>

    <div class="row">
        <iframe class="page-frame col-md-12" src="http://itp.inner.kbis.com.ua/index.php/site/viewgeneraltable"></iframe>
    </div>
</asp:Content>

