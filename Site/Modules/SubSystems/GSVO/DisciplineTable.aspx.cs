using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Site.Modules.SubSystems.GSVO
{
    public partial class DisciplineTable : Core.SitePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session == null)
            {
                Response.Redirect("/login");
            }

            if (!IsPostBack)
            {
                List<Campus.Common.RtDiscipline> rtDisc = new List<Campus.Common.RtDiscipline>();

                CathName.Text += " <h4 class=\"text-success\">" + Session["SubdivisionName"] + "</h4>";
                SpecName.Text += "<i class=\"text-success\">" + Session["GSVOSpec"] + "</i>";

                RtDisciplineTable.Text += "<table class=\"table table-bordered table-hover\"><tr><td colspan=\"2\">" + "<button id=\"addDisc\" class=\"glyphicon glyphicon-plus\" type=\"submit\" runat=\"server\" width=\"50\" heigth=\"50\" OnClick=\"addDisc_Click\"></button>" + "</td><td><b>Цикли</b></td><td><b>Компоненти</b></td><td><b>Назва дисципліни</b></td>" +
                "<td><b>Шифр</b></td><td><b>Кількість годин</b></td><td><b>Національні кредити</b></td><td><b>Кредити ECTS</b></td><td><b>Поза\nкредит\nдисц</b></td><td><b>Актуальність</b></td><td><b>Статус</b></td><td><b>Опис</b></td></tr>";

                foreach (var item in CampusClient.GetRtDiscipline(SessionId, Convert.ToInt32(Session["RtProfTrainTotalId"])))
                {
                    rtDisc.Add(new Campus.Common.RtDiscipline
                    {
                        RtProfTrainTotalId = item.RtProfTrainTotalId,
                        DcComponentId = item.DcComponentId,
                        DcCycleId = item.DcCycleId,
                        Name = item.Name,
                        Shifr = item.Shifr,
                        CountHour = item.CountHour,
                        CreditECTS = item.CreditECTS,
                        OutCredit = item.OutCredit,
                        CreditNational = item.CreditNational,
                        FullName = item.FullName,
                        vcActuality = item.vcActuality,
                        vcChangeDate = item.vcChangeDate,
                        vcStatus = item.vcStatus,
                        vcStatusDate = item.vcStatusDate
                    });

                    if (item.OutCredit == null && item.CreditNational == null)
                    {
                        item.CreditNational = 0;
                        item.OutCredit = "0";
                    }

                    string component = null;

                    switch (item.DcComponentId)
                    {
                        case 1:
                            component = "Нормативні\nнавчальні\nдисципліни";
                            break;
                        case 2:
                            component = "Дисципліни\nза вибором ВНЗ";
                            break;
                        case 3:
                            component = "Дисципліни вільного вибору студента";
                            break;
                    }

                    string cycle = null;

                    switch (item.DcCycleId)
                    {
                        case 1:
                            cycle = "Цикл гуманітарної та соціально-економічної підготовки";
                            break;
                        case 2:
                            cycle = "Цикл математичної природничо-наукової підготовки";
                            break;
                        case 3:
                            cycle = "Цикл професійної та практичної підготовки";
                            break;
                    }

                    switch (item.vcActuality)
                    {
                        case "0":
                            item.vcActuality = "Актуальна";
                            break;
                        case "1":
                            item.vcActuality = "Не актуальна";
                            break;
                    }


                    switch (item.vcStatus)
                    {
                        case "0":
                            item.vcStatus = "Затверджено в ОПП ГСВО";
                            break;
                        case "1":
                            item.vcStatus = "Не затверджено в ОПП ГСВО";
                            break;
                        default:
                            item.vcStatus = "Не визначено";
                            break;
                    }

                    RtDisciplineTable.Text += "<td><button id=\"editDisc\" class=\"glyphicon glyphicon-edit\" background-color=\"#208843\" width=\"30\" height=\"30\" type=\"submit\" runat=\"server\" OnClick=\"editDisc_Click\"></button></td><td><button id=\"removeDisc\" class=\"glyphicon glyphicon-remove\" background-color=\"#208843\" width=\"30\" height=\"30\" type=\"submit\" runat=\"server\"ToolTip = \"Видалення нормативної складової\" OnClick=\"removeDisc_Click\"></button></td><td>" + cycle + "</td><td>" + component + "</td><td>" + item.Name.ToString() + "</td>" +
                "<td>" + item.Shifr + "</td><td>" + item.CountHour + "</td><td>" + item.CreditNational + "</td><td>" + item.CreditECTS +
                "</td><td>" + item.OutCredit + "</td><td>" + item.vcActuality + "</td><td>" + item.vcStatus + "</td><td>" + item.FullName + "</td></tr>";
                }

                RtDisciplineTable.Text += "</table>";
            }
        }

        private void addDisc_Click(object sender, EventArgs e)
        {
            Response.Redirect("SearchDiscipline.aspx");
        }

        private void editDisc_Click(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }

        private void removeDisc_Click(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }
    }
}