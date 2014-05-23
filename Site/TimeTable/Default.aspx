<%@ Page Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.TimeTable.Default" %>

<asp:Content runat="server" ContentPlaceHolderID="head">
    <title>Розклад</title>
    <link rel="stylesheet" type="text/css" href="/Content/timetable.css" />
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    
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