<%@ Page Title="Пошук" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="StudyGroups.aspx.cs" Inherits="Site.Modules.EIR.StudyGroups" %>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div id="panel"></div>
    <input id="irEdit" type="hidden" runat="server" />
        <asp:Panel ID="LinkContainer" runat="server">
    </asp:Panel>
    <script type="text/javascript">

        function SetSessionValue(inKey, inValue) {
            $.ajax({
                type: "POST",
                url: "/SessionManager.asmx/SetSessionValue",
                data: { key: inKey, value: inValue },
                async: false,
            });
        };


        function httpGet(url) {
            $.getJSON(url, function (data, status) {
                alert(status);
            });
        }

        $(document).ready(function () {
            $(document).on("click", ".irLink", function (e) {
            });
        });
    </script>
</asp:Content>
