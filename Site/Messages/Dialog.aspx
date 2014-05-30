<%@ Page Title="Діалог" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Dialog.aspx.cs" Inherits="Site.Messages.Messages" %>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="page-header">
        <h1><%=Page.Title %></h1>
    </div>

    <asp:Panel ID="DialogContainer" runat="server"></asp:Panel>
    <asp:TextBox ID="AnswerText" runat="server" Columns="30" CssClass="form-control input-sm" TextMode="MultiLine" Rows="3"></asp:TextBox>
    <asp:Button ID="AnswerBtn" runat="server" Text="Відіслати" CssClass=" btn btn-primary" OnClick="AnswerBtn_Click" />
</asp:Content>
