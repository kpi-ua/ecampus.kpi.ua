using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Site.Modules.EIR
{
    public partial class Default : Core.SitePage
    {
        //public string enternam;
        public string[] arr;
        public int nn, mm, bb, irid, aa, d = 31, mon = 12;
        public string[] arrc;
        public string[] arrb;
        public string[] arra;
        public string[] days;
        public string[] months;

        protected void Page_Load(object sender, EventArgs e)
        {
            nn = 0;
            mm = 0;
            //для автора
            var names = CampusClient.GetPersonName(SessionId, "");
            nn = names.Count();
            arr = new string[nn];

            //имена авторов в массив
            for (int m = 0; m < names.Count(); m++) { /*dr.Items.Add(names[m].Name);*/ arr[m] = names[m].Name; }
            //------------------------------------------------------//
            //для Тип внеску
            List<KeyValuePair<String, Object>> contrbb = new List<KeyValuePair<String, Object>>();
            contrbb = CampusClient.GetContributorType().ToList();

            //конвертирование в список     
            List<string> Contribtyp = new List<string>();
            foreach (KeyValuePair<String, Object> kvp in contrbb)
            {
                Contribtyp.Add(kvp.Value.ToString());
            }
            //имя типа внеску в массив
            mm = Contribtyp.Count();
            arrc = new string[nn];
            for (int m = 0; m < Contribtyp.Count(); m++)
            { /*dr.Items.Add(Contribtyp[m].ToString());*/ arrc[m] = Contribtyp[m].ToString(); }
            //------------------------------------------------------//
            //Вид ЕІР
            ArrayList ERView = new ArrayList();
            ERView = CampusClient.GetIrKinds();

            string str = ERView[2].ToString();
            List<string> datal = new List<string>();
            string[] split = str.Split(new Char[] { ',', '.', ':', '[', ']', '{', '}', '"' });

            foreach (string s in split)
            {
                if (s.Trim() != "")
                {
                    datal.Add(s);
                }
            }
            datal.RemoveRange(0, 5);

            bb = datal.Count() / 4;
            arrb = new string[bb];
            int count = 0;
            int count2 = 0;
            int count3 = 0;
            for (int m = 0; m < datal.Count() - 1; m++)
            {
                if (count == 3)
                {
                    arrb[count2] = datal[m + count3];
                    count2++;
                    count = 0;
                    count3++;
                }
                count++;
            }
            //заполнение дней
            days = new string[d];
            for (int m = 0; m < d; m++)
            {
                if (m < 9) { days[m] = "0" + Convert.ToString(m + 1); }
                else
                {
                    days[m] = Convert.ToString(m + 1);
                }
            }
            //заполнение месяцев
            months = new string[mon];
            for (int m = 0; m < mon; m++)
            {
                if (m < 9) { months[m] = "0" + Convert.ToString(m + 1); }
                else
                {
                    months[m] = Convert.ToString(m + 1);
                }
            }
        }
    }
}