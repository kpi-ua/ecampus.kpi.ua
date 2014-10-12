<%@ Page Title="Розклад" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Modules.TimeTable.Default" %>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">

    <div class="page-header">
        <h1><%=this.Title %></h1>
    </div>
    
    <script type="text/javascript">
        var sessionId = '<%= SessionId %>';
    </script>

    <script type="text/javascript" src="/Scripts/timetable.js"></script>

    <table id="timetable" class="table table-responsive">
        <tbody id="tableinput">
        </tbody>
    </table>
    <img id='loading' alt="loading..." src="/Images/loading.gif" />
</asp:Content>
