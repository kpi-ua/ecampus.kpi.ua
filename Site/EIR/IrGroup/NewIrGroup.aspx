<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="NewIrGroup.aspx.cs" Inherits="Site.EIR.IrGroup.NewIrGroupPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
    <link href="../Content/form-styles.css" rel="stylesheet" />
    <asp:Panel ID="LinkContainer" runat="server">
        <h1>Створити ЕІР</h1>
        <div class="row">
            <div class="col-sm-12">
                <div class="form-horizontal">
                    <div class="form-header">
                        Загальні відомості
                    </div>
                    <div class="form-group">
                        <asp:Label ID="Label1" AssociatedControlID="name" CssClass="col-sm-3 control-label" runat="server">
                    Назва групи ЕІР*
                        </asp:Label>
                        <div class="col-sm-9">
                            <asp:TextBox ID="name" runat="server" CssClass="form-control"></asp:TextBox>
                        </div>
                    </div>
                    <div class="form-group">
                        <asp:Label ID="Label3" AssociatedControlID="short_description" CssClass="col-sm-3 control-label" runat="server">
                    Опис
                        </asp:Label>
                        <div class="col-sm-9">
                            <asp:TextBox ID="short_description" runat="server" CssClass="form-control" Rows="3" TextMode="multiline"></asp:TextBox>
                        </div>
                    </div>
                </div>

                <div class="form-horizontal">
                    <div class="form-header">
                        Приватність
                    </div>
                    <div class="form-group">
                        <asp:Label ID="Label25" AssociatedControlID="is_public" CssClass="col-sm-3 control-label" runat="server">
                    Характер взаємодії*
                        </asp:Label>
                        <div class="col-sm-9">
                            <asp:RadioButtonList ID="is_public" runat="server" RepeatDirection="Horizontal">
                                <asp:ListItem Value="public" Selected="True">Публічний</asp:ListItem>
                                <asp:ListItem Value="private">Приватний</asp:ListItem>
                            </asp:RadioButtonList>
                        </div>
                    </div>

                    <asp:UpdatePanel runat="server" UpdateMode="Conditional">
                        <ContentTemplate>
                            <div class="form-group">
                                <asp:Label ID="Label37" AssociatedControlID="feature_type" CssClass="col-sm-3 control-label" runat="server">
                            Тип функціонального призначення*
                                </asp:Label>
                                <div class="col-sm-9">
                                    <asp:DropDownList ID="feature_type" runat="server" CssClass="form-control" OnSelectedIndexChanged="feature_type_SelectedIndexChanged" AutoPostBack="True">
                                    </asp:DropDownList>
                                </div>
                            </div>
                            <div class="form-group">
                                <asp:Label ID="Label22" AssociatedControlID="public_kind" CssClass="col-sm-3 control-label" runat="server">
                            Підрозділ
                                </asp:Label>
                                <div class="col-sm-9">
                                    <asp:DropDownList ID="public_kind" runat="server" CssClass="form-control">
                                    </asp:DropDownList>
                                </div>
                            </div>
                        </ContentTemplate>
                        <Triggers>
                            <asp:AsyncPostBackTrigger ControlID="feature_type" EventName="SelectedIndexChanged" />
                        </Triggers>
                    </asp:UpdatePanel>



                </div>
            </div>
        </div>
        <asp:Button ID="save" CssClass="btn btn-primary" runat="server" Text="Зберегти" OnClick="save_Click" />
    </asp:Panel>

</asp:Content>
