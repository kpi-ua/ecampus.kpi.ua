<%@ Page Title="Створити ЕІР" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="CardEdit.aspx.cs" Inherits="Site.EIR.CardEdit" %>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.11.0/themes/smoothness/jquery-ui.css">
    <script src="//code.jquery.com/jquery-1.10.2.js"></script>
    <script src="//code.jquery.com/ui/1.11.0/jquery-ui.js"></script>
    <div class="page-header">
        <h1><%= Page.Title %></h1>
    </div>

    <style type="text/css">
        label { font-weight: normal; }

        .form-header { font-weight: bold; }

        .button-group { float: right; }

        .members-text { font-size: 14px; }

    </style>
    <script type="text/javascript">
        $(document).ready(function () {
            $("#access_begin").datepicker();
            $("#date").datepicker();
            $("#access_end").datepicker();
            $("#doc_date").datepicker();

            $("#body_page_number").keyup(function() {
                $("#body_page_quantity").val($("#body_page_number").val() / 24);
                console.log($("#body_page_number").val() / 24);
            });
                $("#body_person_name").autocomplete({
                    source: function(request, response) {
                        $.ajax({
                            url: ApiEndpoint + "Ir/GetPersonName?session=" + $("#sssid").val() + "&name=" + $("#body_person_name").val(),
                            success: function(data) { // modify your response here.
                                response($.map(data.Data, function(value, key) {
                                    return {
                                        value: value.Name,
                                        data: value.Id,
                                        acs: value.Accessority
                                    };
                                }));
                            }
                        });
                    },
                    minLength: 3, // set the min characters to type to initiate ajax call
                    select: function(event, ui) {
                        console.log(ui.item.data);
                        $("#body_person_name_id").val(ui.item.data);
                    }
                });
            
        });
    </script>

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
                        <asp:TextBox ID="name" runat="server" MaxLength="255" CssClass="form-control"></asp:TextBox>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label3" AssociatedControlID="short_description" CssClass="col-sm-3 control-label" runat="server">
                        Реферат (Анотація)
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:TextBox ID="short_description" runat="server" CssClass="form-control" Rows="3" TextMode="multiline"></asp:TextBox>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label4" AssociatedControlID="date" CssClass="col-sm-3 control-label" runat="server">
                        Дата для рейтингу*
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:TextBox ID="date" runat="server" CssClass="form-control"></asp:TextBox>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label18" AssociatedControlID="access_begin" CssClass="col-sm-3 control-label" runat="server">
                        Початок доступу*
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:TextBox ID="access_begin" runat="server" CssClass="form-control"></asp:TextBox>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label19" AssociatedControlID="access_end" CssClass="col-sm-3 control-label" runat="server">
                        Кінець доступу
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:TextBox ID="access_end" runat="server" CssClass="form-control"></asp:TextBox>
                    </div>
                </div>
                <hr />
                <div class="form-header">
                    Протокол
               
                </div>
                <div class="form-group">
                    <asp:Label ID="Label20" AssociatedControlID="doc_number" CssClass="col-sm-2 control-label" runat="server">
                        № документу
                    </asp:Label>
                    <div class="col-sm-3">
                        <asp:TextBox ID="doc_number" MaxLength="10" runat="server" CssClass="form-control"></asp:TextBox>
                    </div>
                    <asp:Label ID="Label21" AssociatedControlID="doc_date" CssClass="col-sm-3 control-label" runat="server">
                        Дата документу
                    </asp:Label>
                    <div class="col-sm-3">
                        <asp:TextBox ID="doc_date" runat="server" CssClass="form-control"></asp:TextBox>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <hr />
    <div class="row">
        <div class="col-sm-12">
            <div class="form-horizontal">
                <div class="form-header">
                    Ознаки класифікацій
               
                </div>
                <div class="form-group">
                    <asp:Label ID="Label23" AssociatedControlID="purpose_type" CssClass="col-sm-3 control-label" runat="server">
                        Тип цільового призначення*
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:DropDownList ID="purpose_type" runat="server" CssClass="form-control">
                        </asp:DropDownList>
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
                                Вид ЕІР*
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

                <div class="form-group">
                    <asp:Label ID="Label24" AssociatedControlID="form_type" CssClass="col-sm-3 control-label" runat="server">
                        Формат основної інформації
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:DropDownList ID="form_type" runat="server" CssClass="form-control">
                        </asp:DropDownList>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label25" AssociatedControlID="is_public" CssClass="col-sm-3 control-label" runat="server">
                        Характер взаємодії*
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:RadioButtonList ID="is_public" Width="300px" CellSpacing="100" runat="server" RepeatDirection="Horizontal">
                            <asp:ListItem Value="public" Selected="True">Публічний    </asp:ListItem>
                            <asp:ListItem Value="private">Приватний</asp:ListItem>
                        </asp:RadioButtonList>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <hr />
    <div class="row">
        <div class="col-sm-12">
            <div class="form-horizontal">
                <asp:UpdatePanel ID="UpdatePanel3" UpdateMode="Conditional" runat="server">
                    <ContentTemplate>
                        <div class="form-header">
                            Учасники
                       
                        </div>
                        <asp:Label runat="server" ID="idcontr" Visible="False" Enabled="True"></asp:Label>
                        <div class="form-group">
                            <asp:Label ID="Label10" AssociatedControlID="person_accessory" CssClass="col-sm-3 control-label" runat="server">
                                Особа з КПІ*
                            </asp:Label>
                            <div class="col-sm-9">
                                <asp:RadioButtonList ID="person_accessory" Width="200px" CellSpacing="50" runat="server" RepeatDirection="Horizontal">
                                    <asp:ListItem Value="yes" Selected="True">Так    </asp:ListItem>
                                    <asp:ListItem Value="no">Ні</asp:ListItem>
                                </asp:RadioButtonList>
                            </div>
                        </div>

                        <div class="form-group">
                            <asp:Label ID="Label11" AssociatedControlID="person_name" CssClass="col-sm-3 control-label" runat="server">
                                ПІБ*
                            </asp:Label>
                            <div class="col-sm-9">
                                <asp:TextBox ID="person_name" runat="server" CssClass="form-control"></asp:TextBox>
                            </div>
                        </div>

                        <div class="form-group">
                            <asp:Label ID="Label12" AssociatedControlID="contribution_type" CssClass="col-sm-3 control-label" runat="server">
                                Тип внеску*
                            </asp:Label>
                            <div class="col-sm-9">
                                <asp:DropDownList ID="contribution_type" runat="server" CssClass="form-control">
                                </asp:DropDownList>
                            </div>
                        </div>
                        <div class="form-group">
                            <asp:Label ID="Label13" AssociatedControlID="contribution_part" CssClass="col-sm-3 control-label" runat="server">
                                Частка внеску*
                            </asp:Label>
                            <div class="col-sm-9">
                                <asp:TextBox ID="contribution_part" runat="server" CssClass="form-control"></asp:TextBox>
                            </div>
                        </div>

                        <div id="non-kpi-person">
                            <div class="form-group">
                                <asp:Label ID="Label39" AssociatedControlID="person_type" CssClass="col-sm-3 control-label" runat="server">
                                    Статус*
                                </asp:Label>
                                <div class="col-sm-9">
                                    <asp:DropDownList ID="person_type" runat="server" CssClass="form-control">
                                    </asp:DropDownList>
                                </div>
                            </div>
                            <div class="form-group">
                                <asp:Label ID="Label38" AssociatedControlID="not_kpi_surname" CssClass="col-sm-3 control-label" runat="server">
                                    Прізвище*
                                </asp:Label>
                                <div class="col-sm-9">
                                    <asp:TextBox ID="not_kpi_surname" MaxLength="255" runat="server" CssClass="form-control"></asp:TextBox>
                                </div>
                            </div>
                        </div>

                        <div class="button-group">
                            <asp:Button ID="add_contr" CssClass="btn btn-success" runat="server" Text="Додати" OnClick="add_person_Click" />
                            <asp:Button ID="delete_contr" CssClass="btn btn-danger" runat="server" Visible="False" Text="Видалити" OnClick="delete_person_Click" />
                        </div>

                    </ContentTemplate>

                    <Triggers>
                        <asp:AsyncPostBackTrigger ControlID="add_contr" EventName="Click" />
                        <asp:AsyncPostBackTrigger ControlID="delete_contr" EventName="Click" />
                    </Triggers>
                </asp:UpdatePanel>
                <br />

                <div class="col-sm-6">
                    <asp:UpdatePanel ID="contributors_update" runat="server" UpdateMode="Conditional">
                        <ContentTemplate>
                            <hr />
                            <div class="form-header">
                                Список учасників
                           
                            </div>
                            <div class="members-text">
                                <asp:GridView ID="contributorsgrid" CssClass="list" runat="server" AutoGenerateColumns="False" OnSelectedIndexChanged="contributorsgrid_OnSelectedIndexChanged" OnLoad="GridLoad" CellPadding="4" ForeColor="#5a441b" GridLines="None">
                                    <AlternatingRowStyle BackColor="White"></AlternatingRowStyle>
                                    <Columns>
                                        <asp:BoundField DataField="Id"></asp:BoundField>
                                        <asp:BoundField NullDisplayText=". "></asp:BoundField>
                                        <asp:ButtonField CommandName="Select" Text="[Вибрати]" ButtonType="Button" ControlStyle-CssClass="btn-link"></asp:ButtonField>
                                        <asp:BoundField NullDisplayText="   "></asp:BoundField>
                                        <asp:BoundField DataField="ContributorFullText"></asp:BoundField>
                                    </Columns>

                                </asp:GridView>
                            </div>
                        </ContentTemplate>
                        <Triggers>
                            <asp:AsyncPostBackTrigger ControlID="add_contr" EventName="Click" />
                            <asp:AsyncPostBackTrigger ControlID="delete_contr" EventName="Click" />
                        </Triggers>
                    </asp:UpdatePanel>
                </div>


            </div>
        </div>
    </div>
    <hr />
    <div class="row">
        <div class="col-sm-12">
            <div class="form-horizontal">
                <div class="form-header">
                    Додаткові поля опису
               
                </div>
                <div class="form-group">
                    <asp:Label ID="Label2" AssociatedControlID="long_deskription" CssClass="col-sm-3 control-label" runat="server">
                        Бібліографічний опис*
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:TextBox ID="long_deskription" MaxLength="255" runat="server" CssClass="form-control" Rows="3" TextMode="multiline"></asp:TextBox>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label15" AssociatedControlID="page_number" CssClass="col-sm-3 control-label" runat="server">
                        Кількість сторінок
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:TextBox ID="page_number" TextMode="Number" runat="server" CssClass="form-control"></asp:TextBox>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label14" AssociatedControlID="page_number" CssClass="col-sm-3 control-label" runat="server">
                        Кількість друкованих аркушів
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:TextBox ID="page_quantity" runat="server" CssClass="form-control"></asp:TextBox>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label16" AssociatedControlID="public_form" CssClass="col-sm-3 control-label" runat="server">
                        Форма видання
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:DropDownList ID="public_form" runat="server" CssClass="form-control">
                        </asp:DropDownList>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label5" AssociatedControlID="griff" CssClass="col-sm-3 control-label" runat="server">
                        Гриф*
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:DropDownList ID="griff" runat="server" CssClass="form-control">
                        </asp:DropDownList>
                    </div>
                </div>

                <div id="griff-7-block">
                    <hr />
                    <div class="form-group">
                        <asp:Label ID="Label31" AssociatedControlID="grif_country" CssClass="col-sm-3 control-label" runat="server">
                            Країна*
                        </asp:Label>
                        <div class="col-sm-9">
                            <asp:DropDownList ID="grif_country" runat="server" CssClass="form-control" AutoPostBack="True" OnSelectedIndexChanged="grif_country_SelectedIndexChanged">
                            </asp:DropDownList>
                        </div>
                    </div>
                    <asp:UpdatePanel ID="UpdatePanel1" runat="server" UpdateMode="Conditional">
                        <ContentTemplate>
                            <div class="form-group">
                                <asp:Label ID="Label32" AssociatedControlID="griff_city" CssClass="col-sm-3 control-label" runat="server">
                                    Місто*
                                </asp:Label>
                                <div class="col-sm-9">
                                    <asp:DropDownList ID="griff_city" runat="server" CssClass="form-control" AutoPostBack="True" OnSelectedIndexChanged="griff_city_SelectedIndexChanged">
                                    </asp:DropDownList>
                                </div>
                            </div>
                        </ContentTemplate>
                        <Triggers>
                            <asp:AsyncPostBackTrigger ControlID="grif_country" EventName="SelectedIndexChanged" />
                        </Triggers>
                    </asp:UpdatePanel>
                    <asp:UpdatePanel runat="server" UpdateMode="Conditional">
                        <ContentTemplate>
                            <div class="form-group">
                                <asp:Label ID="Label33" AssociatedControlID="griff_org_name" CssClass="col-sm-3 control-label" runat="server">
                                    Назва організації*
                                </asp:Label>
                                <div class="col-sm-9">
                                    <asp:DropDownList ID="griff_org_name" runat="server" CssClass="form-control">
                                    </asp:DropDownList>
                                </div>
                            </div>
                        </ContentTemplate>
                        <Triggers>
                            <asp:AsyncPostBackTrigger ControlID="griff_city" EventName="SelectedIndexChanged" />
                            <asp:AsyncPostBackTrigger ControlID="grif_country" EventName="SelectedIndexChanged" />
                        </Triggers>
                    </asp:UpdatePanel>

                    <hr />
                    <div class="form-group">
                        <asp:Label ID="Label26" AssociatedControlID="lib_location" CssClass="col-sm-3 control-label" runat="server">
                            Положення в бібліотеці
                        </asp:Label>
                        <div class="col-sm-9">
                            <asp:TextBox ID="lib_location" MaxLength="255" runat="server" CssClass="form-control"></asp:TextBox>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <hr />
    <div class="row">
        <div class="col-sm-12">
            <div class="form-horizontal">
                <div class="form-header">
                    Видавництво:
               
                </div>
                <div class="form-group">
                    <asp:Label ID="Label27" AssociatedControlID="org_country" CssClass="col-sm-3 control-label" runat="server">
                        Країна*
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:DropDownList ID="org_country" runat="server" CssClass="form-control" AutoPostBack="True" OnSelectedIndexChanged="org_country_SelectedIndexChanged">
                        </asp:DropDownList>
                    </div>
                </div>

                <!-- <div class="form-group">
                         <asp:Label ID="Label40" AssociatedControlID="org_country" CssClass="col-sm-3 control-label" runat="server">
                             Країна*
                         </asp:Label>
                         <div class="col-sm-9">
                             <asp:DropDownList ID="DropDownList1" runat="server" CssClass="form-control" AutoPostBack="True" OnSelectedIndexChanged="org_country_SelectedIndexChanged">
                             </asp:DropDownList>
                         </div>
                     </div> -->
                <asp:UpdatePanel ID="UpdatePanel2" runat="server" UpdateMode="Conditional">
                    <ContentTemplate>
                        <div class="form-group">
                            <asp:Label ID="Label28" AssociatedControlID="org_city" CssClass="col-sm-3 control-label" runat="server">
                                Місто*
                            </asp:Label>
                            <div class="col-sm-9">
                                <asp:DropDownList ID="org_city" runat="server" CssClass="form-control" AutoPostBack="True" OnSelectedIndexChanged="org_city_SelectedIndexChanged">
                                </asp:DropDownList>
                            </div>
                        </div>
                        <asp:UpdatePanel runat="server">
                            <ContentTemplate>
                                <div class="form-group">
                                    <asp:Label ID="Label29" AssociatedControlID="org_name" CssClass="col-sm-3 control-label" runat="server">
                                        Назва*
                                    </asp:Label>
                                    <div class="col-sm-9">
                                        <asp:DropDownList ID="org_name" runat="server" CssClass="form-control">
                                        </asp:DropDownList>
                                    </div>
                                </div>
                            </ContentTemplate>
                            <Triggers>
                                <asp:AsyncPostBackTrigger ControlID="org_city" EventName="SelectedIndexChanged" />
                            </Triggers>
                        </asp:UpdatePanel>
                    </ContentTemplate>
                    <Triggers>
                        <asp:AsyncPostBackTrigger ControlID="org_country" EventName="SelectedIndexChanged" />
                    </Triggers>
                </asp:UpdatePanel>
                <div class="form-group">
                    <asp:Label ID="Label30" AssociatedControlID="edition" CssClass="col-sm-3 control-label" runat="server">
                        Тираж
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:TextBox ID="edition" TextMode="Number" runat="server" CssClass="form-control"></asp:TextBox>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label17" AssociatedControlID="public_year" CssClass="col-sm-3 control-label" runat="server">
                        Рік видання
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:TextBox ID="public_year" MaxLength="4" TextMode="Number" runat="server" CssClass="form-control"></asp:TextBox>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <hr />
    <div class="row">
        <div class="col-sm-12">
            <div class="form-horizontal">
                <asp:UpdatePanel runat="server" UpdateMode="Conditional" ID="langtextupdate">
                    <ContentTemplate>
                        <asp:Label runat="server" Visible="False" Enabled="True" ID="idlang"></asp:Label>
                        <div class="form-header">
                            Анотації
                       
                        </div>
                        <div class="form-group">
                            <asp:Label ID="Label9" AssociatedControlID="language" CssClass="col-sm-3 control-label" runat="server">
                                Мова*
                            </asp:Label>
                            <div class="col-sm-9">
                                <asp:DropDownList ID="language" runat="server" CssClass="form-control">
                                </asp:DropDownList>
                            </div>
                        </div>
                        <div class="form-group">
                            <asp:Label ID="Label6" AssociatedControlID="annotation" CssClass="col-sm-3 control-label" rows="3" TextMode="multiline" runat="server">
                                Анотація
                            </asp:Label>
                            <div class="col-sm-9">
                                <asp:TextBox ID="annotation" MaxLength="1000" runat="server" CssClass="form-control" Rows="3" TextMode="multiline"></asp:TextBox>
                            </div>
                        </div>
                        <div class="form-group">
                            <asp:Label ID="Label8" AssociatedControlID="lang_keywords" CssClass="col-sm-3 control-label" runat="server">
                                Ключові слова
                            </asp:Label>
                            <div class="col-sm-9">
                                <asp:TextBox ID="lang_keywords" MaxLength="255" runat="server" CssClass="form-control" Rows="2" TextMode="multiline"></asp:TextBox>
                            </div>
                        </div>
                        <div id="additional-annotations">
                            <div class="form-group">
                                <asp:Label ID="Label7" AssociatedControlID="lang_name" CssClass="col-sm-3 control-label" runat="server">
                                    Назва
                                </asp:Label>
                                <div class="col-sm-9">
                                    <asp:TextBox ID="lang_name" MaxLength="255" runat="server" CssClass="form-control" Rows="2" TextMode="multiline"></asp:TextBox>
                                </div>
                            </div>
                            <div class="form-group">
                                <asp:Label ID="Label36" AssociatedControlID="lang_authors" CssClass="col-sm-3 control-label" runat="server">
                                    Автор
                                </asp:Label>
                                <div class="col-sm-9">
                                    <asp:TextBox ID="lang_authors" MaxLength="255" runat="server" CssClass="form-control" Rows="2" TextMode="multiline"></asp:TextBox>
                                </div>
                            </div>
                        </div>
                        <div class="button-group">
                            <asp:Button ID="add_land" CssClass="btn btn-success" runat="server" Text="Додати" OnClick="add_lang_Click" />
                            <asp:Button ID="delete_lang" CssClass="btn btn-danger" Visible="False" runat="server" Text="Видалити" OnClick="delete_lang_Click" />
                        </div>
                    </ContentTemplate>
                    <Triggers>
                        <asp:AsyncPostBackTrigger ControlID="add_land" EventName="Click" />
                        <asp:AsyncPostBackTrigger ControlID="delete_lang" EventName="Click" />
                    </Triggers>
                </asp:UpdatePanel>
                <br />
                <div class="col-sm-6">
                    <asp:UpdatePanel ID="language_update" runat="server" UpdateMode="Conditional">
                        <ContentTemplate>
                            <asp:GridView CssClass="list" ID="langgrid" runat="server" AutoGenerateColumns="False" OnSelectedIndexChanged="langgrid_OnSelectedIndexChanged" OnLoad="EXGridLoad" CellPadding="6" ForeColor="#333333" GridLines="None">
                                <AlternatingRowStyle BackColor="White"></AlternatingRowStyle>
                                <Columns>
                                    <asp:BoundField DataField="Id"></asp:BoundField>
                                    <asp:BoundField NullDisplayText=". "></asp:BoundField>
                                    <asp:ButtonField CommandName="Select" Text="[Вибрати]" ButtonType="Button" ControlStyle-CssClass="btn-link"></asp:ButtonField>
                                    <asp:BoundField NullDisplayText="    Мова: "></asp:BoundField>
                                    <asp:BoundField DataField="LangText"></asp:BoundField>
                                    <asp:BoundField NullDisplayText="     Назва:"></asp:BoundField>
                                    <asp:BoundField DataField="Name" NullDisplayText="-------"></asp:BoundField>
                                    <asp:TemplateField></asp:TemplateField>
                                </Columns>

                            </asp:GridView>
                        </ContentTemplate>
                        <Triggers>
                            <asp:AsyncPostBackTrigger ControlID="add_land" EventName="Click" />
                            <asp:AsyncPostBackTrigger ControlID="delete_lang" EventName="Click" />
                        </Triggers>
                    </asp:UpdatePanel>
                </div>

            </div>
        </div>
    </div>
    <hr />
    <div class="row">
        <div class="col-sm-12">
            <div class="form-horizontal">
                <div class="form-header">
                    Класифікаційні індекси
               
                </div>
                <div class="form-group">
                    <asp:Label ID="Label34" AssociatedControlID="is_type" CssClass="col-sm-3 control-label" runat="server">
                        Тип
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:DropDownList ID="is_type" runat="server" CssClass="form-control">
                        </asp:DropDownList>
                    </div>
                </div>
                <div class="form-group">
                    <asp:Label ID="Label35" AssociatedControlID="is_name" CssClass="col-sm-3 control-label" rows="3" TextMode="multiline" runat="server">
                        Значення
                    </asp:Label>
                    <div class="col-sm-9">
                        <asp:TextBox ID="is_name" MaxLength="25" runat="server" CssClass="form-control"></asp:TextBox>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <hr />
    <asp:Button ID="save" CssClass="btn btn-success" runat="server" Text="Зберегти" OnClick="save_Click" />
    <asp:Label runat="server" ID="person_name_id" Visible="False" Text="kjhhkjhk"></asp:Label>
</asp:Content>
