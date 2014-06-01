<%@ Page Title="Групи ЕІР" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.EIR.IrGroup.Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
    <div class="page-header">
        <h1><%=Page.Title %></h1>
    </div>

    <asp:Button ID="new_group" runat="server" Text="Нова група" CssClass="btn btn-warning" ClientIDMode="Static" OnClick="NewGroup_Click" />

    <asp:Panel ID="SubdivisionIrContainer" runat="server">
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


        $(document).ready(function () {


            $(document).on("click", ".irGroupLink", function (e) {
                var irGroupId = $(this).attr("subdivisionIrId");

                SetSessionValue("subdivisionIrId", irGroupId);
                e.preventDefault();
                window.open("IrGroupSetView.aspx", "_self");
            });

        });
    </script>
</asp:Content>
