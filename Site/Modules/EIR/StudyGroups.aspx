<%@ Page Title="Навчальні групи" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="StudyGroups.aspx.cs" Inherits="Site.Modules.EIR.StudyGroups" %>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <ul>
         <li>
             <asp:TextBox id="word" value="" runat="server" style="width: 150px; margin: 0;" />
         </li>
         <li>
             <asp:Button id="find" runat="server" Text ="Пошук групи" OnClick ="find_Click1" BackColor ="#ccffff" BorderStyle="Solid" BorderWidth ="2" Width ="150" Font-Bold="true" ></asp:Button>
             <asp:Button id="all" runat="server" Text ="Показати всі групи" OnClick ="all_Click" BackColor ="#ccffff" BorderStyle="Solid" BorderWidth ="2" Width ="200" Font-Bold="true" Visible ="false" ></asp:Button>
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
