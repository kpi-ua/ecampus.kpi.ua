<%@ Page Title="Спілкування" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Modules.Messages.Default" %>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    
    <div class="page-header">
        <h1><%=Page.Title %></h1>
    </div>

    <asp:Button ID="new_message" runat="server" Text="Нове Повідомлення" CssClass="btn btn-warning" ClientIDMode="Static" />
    
    <asp:Literal ID="Result" runat="server"></asp:Literal>
    <div ID="message_container" runat="server">

    </div>

    <div class="modal fade" id="NewMessagePopup" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
        <div class="modal-dialog" style="width: 650px;">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
                    <h4 class="modal-title" id="myModalLabel">Нове повідомлення</h4>
                </div>
                <div class="modal-body">
                    <div id="UserListControl" class="input-prepend input-xxlarge">
                        <span id="UserListControlName" class="input-group-addon text-info">Одержувачі:</span>
                        <select size="4" name="ctl00$body$UserList" multiple="multiple" id="body_UserList" class="form-control chosen-select"
                            style="height: 20px;">
                        </select>
                    </div>

                    <div id="SubjectDiv" class="input-prepend input-xxlarge">
                        <span id="SubjectName" class="input-group-addon text-info">Тема:</span>
                        <input name="ctl00$body$Subject" type="text" id="body_Subject" class="form-control" />
                    </div>

                    <div id="TextDiv" class="input-prepend input-xxlarge">
                        <span id="TextName" class="input-group-addon text-info">Текст:</span>
                        <textarea name="ctl00$body$Text" rows="5" cols="20" id="body_Text" class="form-control"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="SendMessage" type="button" class="btn btn-primary">Надіслати повідомлення</button>
                </div>
            </div>
        </div>
    </div>

    <script type="text/javascript">

        function SetSessionValue(inKey, inValue) {
            $.ajax({
                type: "POST",
                url: "/SessionManager.asmx/SetSessionValue",
                data: { key: inKey, value: inValue },
                async: false,
            });
        };

        function PrepareImgBlockJson(imgBlock) {
            var imgBlockJson = '{ "id": "imgBlock", "className": "imgBlock", "imgSources": [ ';
            var innerImgs = $(imgBlock).children("img");
            for (var i = 0; i < innerImgs.length; i++) {
                imgBlockJson += '"' + innerImgs[i].src + '"';
                if (i != innerImgs.length - 1) {
                    imgBlockJson += ', ';
                }
            }

            imgBlockJson += ']}';
            return imgBlockJson;
        }

        $(document).ready(function () {

            $("#NewMessagePopup").on("shown.bs.modal", function () {
                $('select', this).chosen('destroy').chosen();
                //$("#NewMessagePopup").unbind("shown.bs.modal");
            });

            $(document).on("click", "#right_column_NewMessage", function (e) {
                e.preventDefault();
                $("#NewMessagePopup").modal({
                    "backdrop": true
                });
            });

            $(document).on("click", ".messageLink", function (e) {
                var cId = $(this).attr("cId");
                var imgBlock = $(this).find("#imgBlock");
                var subj = $(this).attr("subj");
                var imgBlockJson = PrepareImgBlockJson(imgBlock);

                SetSessionValue("imgDiv", escape(imgBlockJson));
                SetSessionValue("GroupId", cId);
                SetSessionValue("Subject", subj);
                e.preventDefault();
                window.open("Dialog.aspx", "_self");
            });

        });
    </script>

</asp:Content>