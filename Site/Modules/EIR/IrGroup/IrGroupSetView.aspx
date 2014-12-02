<%@ Page Title="Перегляд груп ЕІР" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="IrGroupSetView.aspx.cs" Inherits="Site.Modules.EIR.IrGroup.IrGroupSetView" %>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
    
    <div class="page-header">
        <h1><%=Page.Title %></h1>
        <h2 id="subdivision_name" runat="server"></h2>
    </div>

    <asp:Button ID="new_group" runat="server" Text="Нова група" CssClass="btn btn-warning" ClientIDMode="Static" OnClick="NewGroup_Click" />

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


        $(document).ready(function () {


            $(document).on("click", ".irGroupLink", function (e) {
                var irGroupId = $(this).attr("irGroupId");

                SetSessionValue("irGroupId", irGroupId);
                e.preventDefault();
                window.open("IrGroupView.aspx", "_self");
            });

        });
    </script>

</asp:Content>