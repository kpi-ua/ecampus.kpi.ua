<%@ Page Title="Викладачі" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Search.aspx.cs" Inherits="Site.Modules.EIR.Search" %>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">

    <div class="page-header">
        <h1><%=Page.Title %></h1>
    </div>

    <div id="panel"></div>
    
    <input id="irEdit" type="hidden" runat="server" />

    <asp:DropDownList ID ="list" runat ="server" OnSelectedIndexChanged ="list_SelectedIndexChanged" AutoPostBack="true"></asp:DropDownList>
    
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
