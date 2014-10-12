<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="CardView.aspx.cs" Inherits="Site.Modules.EIR.CardView" %>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">

    <div class="page-header">
        <h1><%= Page.Title %></h1>
    </div>

    <asp:UpdatePanel ID="errUpdate" UpdateMode="Conditional" runat="server">
        <ContentTemplate>
            <asp:Panel ID="errpanel" runat="server" BorderStyle="Solid" Visible="False" BorderColor="Red" BorderWidth="5px" BackColor="#FF0000">
                <asp:Label ID="errlabel" runat="server" Text=""></asp:Label>
            </asp:Panel>
        </ContentTemplate>
    </asp:UpdatePanel>

    <div class="row">
        <div class="col-sm-12">
            <div class="form-horizontal">
                <div class="form-header">
                    Загальні відомості
                </div>
                <div class="form-group">
                    <asp:Label ID="Label1" AssociatedControlID="name" CssClass="col-sm-3 control-label" runat="server">
                        Назва ЕІР*
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="name" runat="server" CssClass="form-control"></asp:Label>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label3" AssociatedControlID="short_description" CssClass="col-sm-3 control-label" runat="server">
                        Реферат (Анотація)
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="short_description" runat="server" CssClass="form-control" Rows="3" TextMode="multiline"></asp:Label>
                    </div>
                </div>

                <div class="form-group">
                    <asp:Label ID="Label4" AssociatedControlID="date" CssClass="col-sm-3 control-label" runat="server">
                        Дата для рейтингу
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="date" runat="server" CssClass="form-control"></asp:Label>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label18" AssociatedControlID="access_begin" CssClass="col-sm-3 control-label" runat="server">
                        Початок доступу
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="access_begin" runat="server" CssClass="form-control"></asp:Label>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label19" AssociatedControlID="access_end" CssClass="col-sm-3 control-label" runat="server">
                        Кінець доступу
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="access_end" runat="server" CssClass="form-control"></asp:Label>
                    </div>
                </div>
                <hr />
                Протокол
                <div class="form-group">
                    <asp:Label ID="Label20" AssociatedControlID="doc_number" CssClass="col-sm-2 control-label" runat="server">
                        № документу
                    </asp:Label>
                    <div class="col-sm-3">
                        <asp:Label ID="doc_number" runat="server" CssClass="form-control"></asp:Label>
                    </div>
                    <asp:Label ID="Label21" AssociatedControlID="doc_date" CssClass="col-sm-3 control-label" runat="server">
                        Дата документу
                    </asp:Label>
                    <div class="col-sm-3">
                        <asp:Label ID="doc_date" runat="server" CssClass="form-control"></asp:Label>
                    </div>
                </div>

            </div>
            </div>
        </div>
            <div class="row">
        <div class="col-sm-12">
            <div class="form-horizontal">
                <div class="form-header">
                    Ознаки класифікацій
                </div>
                <div class="form-group">
                    <asp:Label ID="Label23" AssociatedControlID="purpose_type" CssClass="col-sm-3 control-label" runat="server">
                        Тип цільового призначення
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="purpose_type" runat="server" CssClass="form-control">
                        </asp:Label>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label37" AssociatedControlID="feature_type" CssClass="col-sm-3 control-label" runat="server">
                        Тип функціонального призначення
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="feature_type" runat="server" CssClass="form-control" >
                        </asp:Label>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label22" AssociatedControlID="public_kind" CssClass="col-sm-3 control-label" runat="server">
                        Вид ЕІР
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="public_kind" runat="server" CssClass="form-control">
                        </asp:Label>
                    </div>
                </div>

                <div class="form-group">
                    <asp:Label ID="Label24" AssociatedControlID="form_type" CssClass="col-sm-3 control-label" runat="server">
                        Формат основної інформації
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="form_type" runat="server" CssClass="form-control">
                        </asp:Label>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label25" AssociatedControlID="is_public" CssClass="col-sm-3 control-label" runat="server">
                        Характер взаємодії
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="is_public" CssClass="form-control" runat="server"></asp:Label>
                    </div>
                </div>
            </div>
            </div>
                </div>
            
            <hr/>
    <div class="row">
        <div class="col-sm-12">
            <div class="form-horizontal">
                <div class="form-header">
                    Учасники
                    </div>
                <div class="form-group">
                    <div class="col-sm-3"></div>
                    <div class="col-sm-9">
                        <asp:Label ID="members"  CssClass="form-control" runat="server"></asp:Label>
                </div>
                    
           
            </div>
                </div>
            </div>
        </div>
            <hr/>
            <div class="form-horizontal">
                <div class="form-header">
                    Додаткові поля опису
                </div>
                <div class="form-group">
                    <asp:Label ID="Label2" AssociatedControlID="long_deskription" CssClass="col-sm-3 control-label" runat="server">
                        Бібліографічний опис
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="long_deskription"  runat="server" CssClass="form-control" Rows="3" TextMode="multiline"></asp:Label>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label15" AssociatedControlID="page_number" CssClass="col-sm-3 control-label" runat="server">
                        Кількість сторінок
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="page_number" runat="server" CssClass="form-control"></asp:Label>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label14" AssociatedControlID="page_number" CssClass="col-sm-3 control-label" runat="server">
                        Кількість друкованих аркушів
                    </asp:Label>
                    <div class="col-sm-9">
                        кількість сторінок/24
                    </div>
                </div>


                <div class="form-group">
                    <asp:Label ID="Label16" AssociatedControlID="public_form" CssClass="col-sm-3 control-label" runat="server">
                        Форма видання
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="public_form" runat="server" CssClass="form-control">
                        </asp:Label>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label5" AssociatedControlID="griff" CssClass="col-sm-3 control-label" runat="server">
                        Гриф
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="griff" runat="server" CssClass="form-control">
                        </asp:Label>
                    </div>
                </div>
                <hr />
                <div class="form-group">
                    <asp:Label ID="Label33" AssociatedControlID="griff_org_name" CssClass="col-sm-3 control-label" runat="server">
                        Назва організації
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="griff_org_name" runat="server" CssClass="form-control">
                        </asp:Label>
                    </div>
                </div>
                <hr />
                <div class="form-group">
                    <asp:Label ID="Label26" AssociatedControlID="lib_location" CssClass="col-sm-3 control-label" runat="server">
                        Положення в бібліотеці
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="lib_location" MaxLength="255" runat="server" CssClass="form-control"></asp:Label>
                    </div>
                </div>
            </div>
            <hr />
            <div class="form-horizontal">
                <div class="form-header">
                    Видавництво:
                </div>
                <div class="form-group">
                    <asp:Label ID="Label29" AssociatedControlID="org_name" CssClass="col-sm-3 control-label" runat="server">
                        Назва
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="org_name" runat="server" CssClass="form-control">
                        </asp:Label>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label30" AssociatedControlID="edition" CssClass="col-sm-3 control-label" runat="server">
                        Тираж
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="edition" TextMode="Number" runat="server" CssClass="form-control"></asp:Label>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label17" AssociatedControlID="public_year" CssClass="col-sm-3 control-label" runat="server">
                        Рік видання
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="public_year" runat="server" CssClass="form-control"></asp:Label>
                    </div>
                </div>
            </div>
      <hr/>
            <div class="form-group">
                <div>
                    <asp:Label ID="Label7" AssociatedControlID="extralangs" CssClass="col-sm-3 control-label" runat="server">
                        Анотації
                        </asp:Label>
                    </div>
                <div class="col-sm-9">
                    <asp:Label ID="extralangs" AssociatedControlID="public_year" CssClass="form-control" runat="server"></asp:Label>
                </div>
                
            </div>
        <hr/>
        <div>
            <div class="form-horizontal">
                <div class="form-header">
                    Класифікаційні індекси
                </div>
                <div class="form-group">
                    <asp:Label ID="Label34" AssociatedControlID="is_type" CssClass="col-sm-3 control-label" runat="server">
                        Тип
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="is_type" runat="server" CssClass="form-control">
                        </asp:Label>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label35" AssociatedControlID="is_name" CssClass="col-sm-3 control-label" rows="3" TextMode="multiline" runat="server">
                        Значення
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:Label ID="is_name" runat="server" CssClass="form-control"></asp:Label>
                    </div>
                </div>
            </div>
        </div>
  
    <asp:Button ID="edit" CssClass="btn btn-primary" OnClick="edit_OnClick" runat="server" Text="Перейти на редагування" />

</asp:Content>
