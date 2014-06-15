<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Search.aspx.cs" Inherits="Site.Search" %>
<asp:Content ID="Content1" ContentPlaceHolderID="carousel_container" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div id="panel"></div>
    <input id="irEdit" type="hidden" runat="server" />
    <script type="text/javascript">
        $(document).ready(function() {
            var url = ApiEndpoint;
            url += "Ir/GetIr?sessionId=" + $("body #sssid").attr("value");
            $.getJSON(url, function(data, status) {
                if (data.Data.length > 0) {
                    $.each(data.Data, function(key, value) {
                        $("#panel").append("<label>" + value.IrId + " " + value.NameShort + " " + value.NameFull + "</label><input type=\"button\" value='value' num='"+value.IrId +"' class='button' /></br>");
                    });
                }
            });
        });

        $(document).on("click", ".button", function () {
            $("#body_irEdit").attr("value", $(this).attr("num"));
            $("#panel").append("<input class=\"hinput\" type=\"submit\"/>");
            $(".hinput").click();
        });
    </script>
</asp:Content>
