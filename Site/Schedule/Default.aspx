<%@ Page Language="C#" MasterPageFile="~/SitePlusNav.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Schedule.Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script type="text/javascript" src="scripts/jquery.min.js"></script>
    <script type="text/javascript" src="scripts/script.js"></script>
    <link rel="stylesheet" type="text/css" href="styles/style.css">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div id="timetable">
        <div id="header">
            <p>I</p>
            <p>II</p>
        </div>
        <div id="header">
            <p>I</p>
            <p>II</p>
        </div>
        <div id="tableinput">
            <img id="loading" src="bin/loading.gif">
        </div>
    </div>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="right_column" runat="server">
</asp:Content>
