<%@ Page Title="Створити ЕІР" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="NewIrGroup.aspx.cs" Inherits="Site.Modules.EIR.IrGroup.NewIrGroupPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">

    <div class="page-header">
        <h1><%=Page.Title %></h1>
    </div>
    
    <asp:Panel ID="LinkContainer" runat="server">

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
                    <asp:UpdatePanel ID="PrivacyUpdatePanel" runat="server" UpdateMode="Conditional">
                        <ContentTemplate>
                            <div class="form-group">
                                <asp:Label ID="Label25" AssociatedControlID="is_public" CssClass="col-sm-3 control-label" runat="server">
                                    Характер взаємодії*
                                </asp:Label>
                                <div class="col-sm-9">
                                    <asp:RadioButtonList ID="is_public" runat="server" RepeatDirection="Horizontal" AutoPostBack="true" OnSelectedIndexChanged="is_public_OnSelectedIndexChanged">
                                        <asp:ListItem Value="private" Selected="True" Text="Приватний"></asp:ListItem>
                                        <asp:ListItem Value="public" Text="Публічний"></asp:ListItem>
                                    </asp:RadioButtonList>
                                </div>
                            </div>
                            <div class="form-group">
                                <asp:Label ID="Label37" AssociatedControlID="subdivisionList" CssClass="col-sm-3 control-label" runat="server">
                                    Підрозділ
                                </asp:Label>
                                <div class="col-sm-9">
                                    <asp:DropDownList ID="subdivisionList" runat="server" CssClass="form-control">
                                    </asp:DropDownList>
                                </div>
                            </div>
                        </ContentTemplate>
                    </asp:UpdatePanel>
                </div>
            </div>
        </div>
        <asp:Button ID="save" CssClass="btn btn-primary" runat="server" Text="Зберегти" OnClick="save_Click" />
        <asp:Button ID="cancel" CssClass="btn btn-primary" runat="server" Text="Відмінити" PostBackUrl="~/Modules/EIR/IrGroup/Default.aspx" />
        <asp:Button ID="deleteBTN" CssClass="btn btn-primary" runat="server" Text="Видалити" OnClick="delete_Click" Visible="false" />

    </asp:Panel>

</asp:Content>
