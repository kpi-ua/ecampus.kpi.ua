<%@ Page Title="Навчальні групи" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="StudyGroups.aspx.cs" Inherits="Site.Modules.EIR.StudyGroups" %>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">

    <div class="page-header">
        <h1><%=Page.Title %></h1>
    </div>

    <ul>
        <li>
            <asp:TextBox ID="word" runat="server" Style="width: 150px; margin: 0;" />
        </li>
        <li>
            <asp:Button ID="find" runat="server" Text="Пошук групи" OnClick="find_Click1" BackColor="#ccffff" BorderStyle="Solid" BorderWidth="2" Width="150" Font-Bold="true"></asp:Button>
            <asp:Button ID="all" runat="server" Text="Показати всі групи" OnClick="all_Click" BackColor="#ccffff" BorderStyle="Solid" BorderWidth="2" Width="200" Font-Bold="true" Visible="false"></asp:Button>
        </li>
    </ul>
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
