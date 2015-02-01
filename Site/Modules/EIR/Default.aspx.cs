using PagedList;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace Site.Modules.EIR
{
    public partial class Default : Core.SitePage
    {
        //public string enternam;
        public string[] arr;
        public int nn, mm, bb, d = 31, mon = 12;
        public string[] arrc;
        public string[] arrb;
        public string[] days;
        public string[] months;
        public int pgg, pgs, pcm;
        public string pgsstring, pcmstring;

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

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
            arrc = new string[mm];
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

            rez.Visible = false;
        }

        public void search(object sender, EventArgs e)
        {
            //Получение о6щего числа страниц
            IPagedList paging;
            //var messages = CampusClient.GetAllIrs(SessionId, 1, 31, out paging);
            //pgg = paging.PageCount;

            rez.Visible = true;
        }

        public void dsc(object sender, EventArgs e)
        {
            //Получение о6щего числа страниц
            IPagedList paging;
            string c = dssc.Value.ToString();
            //var messages = CampusClient.GetIrbyDcDisc(SessionId, c, 1, 31, out paging);
            //pgs = paging.PageCount;
            pgsstring = dssc.Value;
            rez.Visible = true;
        }

        public void crd(object sender, EventArgs e)
        {
            //Получение о6щего числа страниц
            IPagedList paging;
            string c = crdd.Value.ToString();
            //var messages = CampusClient.GetIrbyCredMod(SessionId, c, 1, 31, out paging);
            //pcm = paging.PageCount;
            pcmstring = crdd.Value;

            rez.Visible = true;
        }

        public void aut(object sender, EventArgs e)
        {
            //Получение о6щего числа страниц
            //IPagedList paging;
            string c = crdd.Value.ToString();
            //var messages = CampusClient.GetIrResourses(SessionId, forNam, fortyp, forview, 1, 31, out paging);
            //NampFor = paging.PageCount;
            //-----------------------
            //forER = nam.Value;
            //forNam = avt.Value;
            //     fortyp = vns.Value; 
            //   forview = vid.Value;

            rez.Visible = true;
        }

    }
}