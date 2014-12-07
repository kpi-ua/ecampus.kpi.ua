<%@ Page Title="Дошка оголошень" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Modules.Bulletins.Default" %>

<asp:Content ID="breadcrumbs_content" ContentPlaceHolderID="breadcrumbs" runat="server">
    <li><a href="/Default.aspx">Домашня</a></li>
    <li class="active">Дошка оголошень</li>
</asp:Content>

<asp:Content ID="body_content" ContentPlaceHolderID="body" runat="server">
    <div class="profile">
        <ul class="nav nav-tabs" id="myTab">
            <li class="active"><a href="#tab1" data-toggle="tab">Актуальні оголошення</a></li>
            <li><a href="#tab2" data-toggle="tab">Додати оголошення</a></li>
        </ul>

        <div class="tab-content">
            <div class="tab-pane active" id="tab1">
                <!--#region content  -->
                <div runat="server" id="ActualBulletinDiv"></div>
                <!--#endregion -->
            </div>

            <div class="tab-pane" id="tab2">
                <!--#region content  -->
                <div class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Профіль</label>
                        <div class="col-sm-10 form-inline">
                            <asp:DropDownList CssClass="form-control" Width="700" runat="server" ID="profileList"></asp:DropDownList>
                            <asp:Button CssClass="btn btn-default" ID="lnkSaveAs" Text="Вибрати" OnClick="postRes" runat="server"></asp:Button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Отримувачі:</label>
                        <div class="col-sm-10" runat="server" id="selectedVals"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Тема</label>
                        <div class="col-sm-10">
                            <asp:TextBox CssClass="form-control" ID="sub_text" runat="server" Width="700"></asp:TextBox>
                        </div>
                    </div>
                    <div class="form-group form-inline">
                        <label class="col-sm-2 control-label">Період показу</label>
                        <div class="col-sm-10">
                            Початок:
                            <asp:TextBox CssClass="form-control" ID="dateStart_d" runat="server" Width="50" MaxLength="2" Text="11"></asp:TextBox>
                            -<asp:TextBox CssClass="form-control" ID="dateStart_m" runat="server" Width="50" MaxLength="2" Text="11"></asp:TextBox>
                            -<asp:TextBox CssClass="form-control" ID="dateStart_y" runat="server" Width="80" MaxLength="4" Text="1111"></asp:TextBox>
                            Завершення:
                            <asp:TextBox CssClass="form-control" ID="dateEnd_d" runat="server" Width="50" MaxLength="2" Text="11"></asp:TextBox>
                            -<asp:TextBox CssClass="form-control" ID="dateEnd_m" runat="server" Width="50" MaxLength="2" Text="11"></asp:TextBox>
                            -<asp:TextBox CssClass="form-control" ID="dateEnd_y" runat="server" Width="80" MaxLength="4" Text="1111"></asp:TextBox>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Текст</label>
                        <div class="col-sm-10">
                            <asp:TextBox CssClass="form-control" ID="text_text" runat="server" Width="700" Height="300" TextMode="MultiLine"></asp:TextBox>
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <asp:Button runat="server" Text="Додати" CssClass="btn btn-primary" OnClick="add_buletin"></asp:Button>
                </div>
                <!--#endregion -->
            </div>
        </div>
    </div>
    <script type="text/javascript">
        function ShowPanel() {
            var d = $('[id*=profileList] option:selected').text();
            document.getElementById('<%=selectedVals.ClientID%>').innerText += " | " + d;
            return false;
        }
    </script>
    <div class="table-responsive" runat="server" id="bulletins"></div>
</asp:Content>
