<%@ Page Title="Перегляд групи ЕІР" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="IrGroupView.aspx.cs" Inherits="Site.EIR.IrGroup.IrGroupView" %>

<asp:Content ID="GroupViewContent" ContentPlaceHolderID="body" runat="server">
    
    <div class="page-header">
        <h1><%=Page.Title %></h1>
        <h2 id="group_name" runat="server"></h2>

    </div>

    <asp:Button ID="add_ir" runat="server" Text="Додати ЕІР" CssClass="btn btn-warning" ClientIDMode="Static" OnClick="AddIr_Click"/>
    <asp:Button ID="edit" runat="server" Text="Редагувати" CssClass="btn btn-warning" ClientIDMode="Static" OnClick="EditGroup_Click" />

    <asp:Panel ID="LinkContainer" runat="server">
        <div id="out_json" runat="server"></div>
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
                var irGroupId = $(this).attr("IrId");

                SetSessionValue("EirId", irGroupId);
                e.preventDefault();
                window.open("/EIR/CardView.aspx", "_self");
            });

        });
    </script>
</asp:Content>
