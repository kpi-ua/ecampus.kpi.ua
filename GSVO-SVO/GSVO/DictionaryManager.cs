using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebApplication1
{
    public class DictionaryManager
    {
        private readonly System.Web.SessionState.HttpSessionState _session;


        public DictionaryManager(System.Web.SessionState.HttpSessionState session)
        {
            this._session = session;
        }


        /// <summary>
        /// Выборка из DcOKR по Id
        /// </summary>
        /// <returns></returns>
        public DataView GetOkrList(string value)
        {
            //выборка из бд (api функция)
            var val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.SelectCommand = "SELECT* FROM DcOKR ";
            if (value != null)
            {
                val.SelectCommand += " WHERE DcOKRId=" + value;
            }
            val.SelectCommand += " ORDER BY Name";
            var dt = (DataView)val.Select(DataSourceSelectArguments.Empty);

            return dt;
        }

        /// <summary>
        /// Выборка из RtProfTrainTotal(All), DcOKR(Name, Id), DcProfTrain(Name)
        /// </summary>
        /// <returns></returns>
        public DataView GetSpecialties()
        {
            string subDiv = _session["DcSubdivision"].ToString();



            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.SelectCommand = "select tt.TotalShifr" + "   " + "d.Name from  RtProfTrainTotalSubdivision tts, RtProfTrainTotal tt, RtProfTrain t, DcProfTrain d where tts.DcSubdivisionId = '" + subDiv + "'  and tts.RtProfTrainTotalId = tt.RtProfTrainTotalId and tt.RtProfTrainId = t.RtProfTrainId and t.DcProfTrainId = d.DcProfTrainId";
            //val.SelectCommand = "SELECT T2.DcOKRId, T2.vcActuality as DcOKRAct, T2.vcChangeDate as DcOKRDate, T4.Name, T4.vcActuality as NameAct, T4.vcChangeDate as NameDate, T1.TotalShifr as Shifr, T3.vcActuality as ShifrAct, T3.vcChangeDate as ShifrDate, T1.vcActuality, T1.vcChangeDate FROM RtProfTrainTotal as T1 INNER JOIN DcOKR as T2 ON T1.DcOKRId = T2.DcOKRId INNER JOIN RtProfTrain as T3 ON T3.RtProfTrainId = T1.RtProfTrainId INNER JOIN DcProfTrain as T4 ON T4.DcProfTrainId = T3.DcProfTrainId WHERE T1.RtProfTrainTotalId=@id";
            val.SelectParameters.Add(new Parameter("id", DbType.Int32, _session["treevalue"].ToString()));
            DataView dt = (DataView)val.Select(DataSourceSelectArguments.Empty);
            return dt;
        }

        /// <summary>
        /// Изменение в DcOKR
        /// </summary>
        /// <param name="textName"></param>
        /// <param name="textShifr"></param>
        /// <param name="textType"></param>
        /// <param name="textAct"></param>
        /// <param name="id"></param>
        public void UpadteOkr(string textName, string textShifr, string textType, string textAct, string id)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.UpdateCommand = "UPDATE DcOKR SET Name=@name, Shifr=@shifr, Type=@type, vcActuality=@act, vcChangeDate=GETDATE() WHERE DcOKRId=@id";
            val.UpdateParameters.Add(new Parameter("name", TypeCode.String, textName));
            val.UpdateParameters.Add(new Parameter("shifr", TypeCode.String, textShifr));
            val.UpdateParameters.Add(new Parameter("type", TypeCode.String, textType));
            val.UpdateParameters.Add(new Parameter("act", TypeCode.Int32, textAct));
            val.UpdateParameters.Add(new Parameter("id", TypeCode.Int32, id));
            val.Update();
        }

        /// <summary>
        /// Изменение Name в DcProfTrain
        /// </summary>
        /// <param name="textName"></param>
        public void UpdateProfTrainTotalName(string textName, string act)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.UpdateCommand = "UPDATE DcProfTrain SET Name=@name, vcActuality=@act, vcChangeDate=GETDATE() WHERE DcProfTrain.DcProfTrainId=(SELECT DcProfTrain.DcProfTrainId FROM DcProfTrain,RtProfTrain,RtProfTrainTotal WHERE RtProfTrainTotal.RtProfTrainId=RtProfTrain.RtProfTrainId AND RtProfTrain.DcProfTrainId=DcProfTrain.DcProfTrainId AND RtProfTrainTotal.RtProfTrainTotalId=@id)";
            val.UpdateParameters.Add(new Parameter("name", TypeCode.String, textName));
            val.UpdateParameters.Add(new Parameter("act", TypeCode.Int32, act));
            val.UpdateParameters.Add(new Parameter("id", DbType.Int32, _session["treevalue"].ToString()));
            val.Update();
        }

        /// <summary>
        /// Изменение всей RtProfTrainTotal
        /// </summary>
        /// <param name="shifr"></param>
        /// <param name="TextAct"></param>
        /// <param name="id"></param>
        public void UpdateProfTrainTotal(string shifr, string TextAct, string id, string branchid)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            if (branchid != "none")
            {
                val.UpdateCommand = String.Format("UPDATE RtProfTrainTotal SET DcOKRId={0}, RtProfTrainBranchId={1}, TotalShifr=@shifr, vcActuality=@act, vcChangeDate=GETDATE() WHERE RtProfTrainTotalId=@id", id, branchid);
            }
            else
            {
                val.UpdateCommand = String.Format("UPDATE RtProfTrainTotal SET DcOKRId={0}, TotalShifr=@shifr, vcActuality=@act, vcChangeDate=GETDATE() WHERE RtProfTrainTotalId=@id", id);
            }
            val.UpdateParameters.Add(new Parameter("shifr", TypeCode.String, shifr));
            val.UpdateParameters.Add(new Parameter("act", TypeCode.Int32, TextAct));
            val.UpdateParameters.Add(new Parameter("id", TypeCode.Int32, _session["treevalue"].ToString()));
            val.Update();
        }

        /// <summary>
        /// Выборка из RtProfTrainTotal по DcOKRId с актуальностью show и сортировкой sort
        /// </summary>
        /// <param name="id"></param>
        /// <param name="show"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public DataView GetRtProfTrainTotalbyOKR(string id, string show, string sort, string dcSubdivisionId)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.SelectCommand =
                "SELECT DISTINCT RtProfTrainTotal.RtProfTrainTotalId, TotalShifr, DcProfTrain.Name FROM RtProfTrainTotal,RtProfTrainTotalSubdivision, RtProfTrain, DcProfTrain WHERE DcOKRId=@id AND RtProfTrainTotal.RtProfTrainId=RtProfTrain.RtProfTrainId AND  RtProfTrain.DcProfTrainId=DcProfTrain.DcProfTrainId AND RtProfTrainTotal.RtProfTrainTotalId=RtProfTrainTotalSubdivision.RtProfTrainTotalId ";
            if (dcSubdivisionId != null && dcSubdivisionId != "all")
            {
                val.SelectCommand +=
                    " AND RtProfTrainTotalSubdivision.DcSubdivisionId = @cathId";
                val.SelectParameters.Add(new Parameter("cathId", TypeCode.Int32, dcSubdivisionId));
            }
            //активные/неактивные
            switch (show)
            {
                case "All":
                    {
                        val.SelectCommand += "";
                        break;
                    }
                case "Act":
                    {
                        val.SelectCommand += "AND RtProfTrainTotal.vcActuality = 0";
                        break;
                    }
                case "nonAct":
                    {
                        val.SelectCommand += "AND RtProfTrainTotal.vcActuality = 1";
                        break;
                    }
            }
            //сортировка
            switch (sort)
            {
                case "shifr":
                    {
                        val.SelectCommand += " ORDER BY TotalShifr";
                        break;
                    }
                case "name":
                    {
                        val.SelectCommand += " ORDER BY Name";
                        break;
                    }
            }
            val.SelectParameters.Add(new Parameter("id", TypeCode.Int32, id));
            return (DataView)val.Select(DataSourceSelectArguments.Empty);
        }

        /// <summary>
        /// Добавление значений в DcOKR
        /// </summary>
        /// <param name="TextName"></param>
        /// <param name="TextShifr"></param>
        /// <param name="TextType"></param>
        /// <param name="TextAct"></param>
        public void InsertDcOKR(string TextName, string TextShifr, string TextType, string TextAct)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.InsertCommand = "INSERT INTO DcOKR (Name,Shifr,Type,vcActuality,vcChangeDate)  VALUES  (@name, @shifr, @type, @act, GETDATE())";
            val.InsertParameters.Add(new Parameter("name", TypeCode.String, TextName));
            val.InsertParameters.Add(new Parameter("shifr", TypeCode.String, TextShifr));
            val.InsertParameters.Add(new Parameter("type", TypeCode.String, TextType));
            val.InsertParameters.Add(new Parameter("act", TypeCode.Int32, TextAct));
            val.Insert();
        }

        /// <summary>
        /// Добавление значений в RtProfTrainTotal и связаные таблицы
        /// </summary>
        /// <param name="TextName"></param>
        /// <param name="Value"></param>
        /// <param name="TextShifr"></param>
        /// <param name="TextAct"></param>
        public void InsertRtProfTrainTotal(string TextName, string nameact, string Value, string TextShifr, string shifract, string TextAct, string okrid, string branchid)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.InsertCommand = "INSERT INTO DcProfTrain(Name, vcActuality, vcChangeDate) VALUES (@name, @nameact, GETDATE()); INSERT INTO RtProfTrain(DcProfTrainId, Shifr, vcActuality, vcChangeDate) VALUES ((SELECT MAX(DcProfTrainId) FROM DcProfTrain), @shifr, @shifract, GETDATE()); INSERT INTO RtProfTrainTotal(RtProfTrainId, RtProfTrainBranchId, DcOKRId, TotalShifr, vcActuality, vcChangeDate) VALUES ((SELECT MAX(RtProfTrainId) FROM RtProfTrain), @branchid, @value, @totalshifr, @act, GETDATE())";
            val.InsertParameters.Add(new Parameter("name", TypeCode.String, TextName));
            val.InsertParameters.Add(new Parameter("nameact", TypeCode.Int32, nameact));
            val.InsertParameters.Add(new Parameter("shifr", TypeCode.String, TextShifr));
            val.InsertParameters.Add(new Parameter("shifract", TypeCode.Int32, shifract));
            val.InsertParameters.Add(new Parameter("value", TypeCode.Int32, Value));
            val.InsertParameters.Add(new Parameter("branchid", TypeCode.Int32, branchid));
            if (TextShifr.IndexOf('.') == -1)
            {
                var dt = GetOkrList(okrid);
                foreach (DataRow row in dt.Table.Rows)
                {
                    val.InsertParameters.Add(new Parameter("totalshifr", TypeCode.String, row["shifr"].ToString() + '.' + TextShifr));
                }
            }
            else
            {
                val.InsertParameters.Add(new Parameter("totalshifr", TypeCode.String, TextShifr));
            }                
            val.InsertParameters.Add(new Parameter("act", TypeCode.Int32, TextAct));
            val.Insert();
        }

        //part II

        /// <summary>
        /// Выборка из DcProfTRainBranchGroup & RtProfTRainBranchGroup столбцы Name & Shifr & Id
        /// </summary>
        /// <returns></returns>
        public DataView GetBranchGroup(string sort, string byid)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.SelectCommand = "SELECT T1.RtProfTrainBranchGroupId, T2.Name, T2.vcActuality as NameAct, T2.vcChangeDate as NameDate, T1.Shifr, T1.vcActuality, T1.vcChangeDate FROM RtProfTrainBranchGroup as T1 INNER JOIN DcProfTrainBranchGroup as T2 ON T1.DcProfTrainBranchGroupId = T2.DcProfTrainBranchGroupId";
            if (byid != null)
            {
                val.SelectCommand += " WHERE RtProfTrainBranchGroupId = " + byid;
            }
            //сортировка
            switch (sort)
            {
                case "shifr":
                    {
                        val.SelectCommand += " ORDER BY Shifr";
                        break;
                    }
                case "name":
                    {
                        val.SelectCommand += " ORDER BY Name";
                        break;
                    }
            }
            return (DataView)val.Select(DataSourceSelectArguments.Empty);
        }

        /// <summary>
        /// Выборка из RtProfTrainBranch & DcProfTrainBranch столбцы Id & Name & Shifr по BranchGroupId
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public DataView GetBranch(string groupid, string sort, string id)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.SelectCommand = "SELECT T1.RtProfTrainBranchId, T1.RtProfTrainBranchGroupId, T2.Name, T2.vcActuality as NameAct, T2.vcChangeDate as NameDate, T1.Shifr, T1.vcActuality, T1.vcChangeDate FROM RtProfTrainBranch as T1 INNER JOIN DcProfTrainBranch as T2 ON T1.DcProfTrainBranchId = T2.DcProfTrainBranchId";
            if (groupid != null)
            {
                val.SelectCommand += " WHERE RtProfTrainBranchGroupId = " + groupid;
            }
            if (id != null)
            {
                val.SelectCommand += " WHERE RtProfTrainBranchId = " + id;
            }
            //сортировка
            switch (sort)
            {
                case "shifr":
                    {
                        val.SelectCommand += " ORDER BY Shifr";
                        break;
                    }
                case "name":
                    {
                        val.SelectCommand += " ORDER BY Name";
                        break;
                    }
            }
            val.SelectParameters.Clear();
            return (DataView)val.Select(DataSourceSelectArguments.Empty);
        }

        /// <summary>
        /// Выборка Name, TotalShift, Id из RtProfTrainTotal, RtProfTRain, DcProfTrain по BranchId
        /// </summary>
        /// <param name="textid"></param>
        /// <returns></returns>
        public DataView GetRtProfTrainTotalByBranch(string textid, string show, string sort)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.SelectCommand = "SELECT RtProfTrainTotalId, Name, TotalShifr FROM RtProfTrainTotal INNER JOIN RtProfTrain ON RtProfTrainTotal.RtProfTrainId = RtProfTrain.RtProfTrainId INNER JOIN DcProfTrain ON RtProfTrain.DcProfTrainId = DcProfTrain.DcProfTrainId WHERE RtProfTrainBranchId = @id";
            //активные/неактивные
            switch (show)
            {
                case "All":
                    {
                        val.SelectCommand += "";
                        break;
                    }
                case "Act":
                    {
                        val.SelectCommand += " AND RtProfTrainTotal.vcActuality = 0";
                        break;
                    }
                case "nonAct":
                    {
                        val.SelectCommand += " AND RtProfTrainTotal.vcActuality = 1";
                        break;
                    }
            }
            //сортировка
            switch (sort)
            {
                case "shifr":
                    {
                        val.SelectCommand += " ORDER BY TotalShifr";
                        break;
                    }
                case "name":
                    {
                        val.SelectCommand += " ORDER BY Name";
                        break;
                    }
            }
            val.SelectParameters.Add(new Parameter("id", TypeCode.Int16, textid));
            return (DataView)val.Select(DataSourceSelectArguments.Empty);
        }

        /// <summary>
        /// Обновляется шифр в RtProfTrain
        /// </summary>
        /// <param name="shifr"></param>
        /// <param name="id"></param>
        public void UpdateProfTrainTotalShifr(string shifr, string id, string act)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.UpdateCommand = "UPDATE RtProfTrain SET Shifr = @shifr, vcActuality=@act, vcChangeDate=GETDATE() WHERE RtProfTRainId = (SELECT RtProfTrainId FROM RtProfTrainTotal WHERE RtProfTrainTotalId = @id)";
            val.UpdateParameters.Add(new Parameter("shifr", TypeCode.String, shifr));
            val.UpdateParameters.Add(new Parameter("act", TypeCode.Int32, act));
            val.UpdateParameters.Add(new Parameter("id", TypeCode.Int32, id));
            val.Update();
        }

        /// <summary>
        /// Обновление шифра, актуальности и даты в RtProfTrainBranchGroup и имя, астуальность, дату в Dc..BranchGroup
        /// </summary>
        /// <param name="shifr"></param>
        /// <param name="act"></param>
        public void UpdateProfTrainBranchGroup(string shifr, string name, string shifract, string nameact)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.UpdateCommand = "UPDATE RtProfTrainBranchGroup SET Shifr=@shifr, vcActuality=@act, vcChangeDate=GETDATE() WHERE RtProfTrainBranchGroupId = @id";
            val.UpdateParameters.Add(new Parameter("shifr", TypeCode.String, shifr));
            val.UpdateParameters.Add(new Parameter("act", TypeCode.Int32, shifract));
            val.UpdateParameters.Add(new Parameter("id", TypeCode.Int32, _session["treevalue"].ToString()));
            val.Update();
            val.UpdateParameters.Clear();
            val.UpdateCommand = "UPDATE DcProfTrainBranchGroup SET Name=@name, vcActuality=@act, vcChangeDate=GETDATE() WHERE DcProfTrainBranchGroupId = (SELECT T1.DcProfTrainBranchGroupId FROM RtProfTrainBranchGroup as T1 WHERE T1.RtProfTrainBranchGroupId = @id)";
            val.UpdateParameters.Add(new Parameter("name", TypeCode.String, name));
            val.UpdateParameters.Add(new Parameter("act", TypeCode.Int32, nameact));
            val.UpdateParameters.Add(new Parameter("id", TypeCode.Int32, _session["treevalue"].ToString()));
            val.Update();

        }

        /// <summary>
        /// Вставка * в Dc..BranchGroup & Rt..BranchGroup
        /// </summary>
        /// <param name="name"></param>
        /// <param name="nameact"></param>
        /// <param name="shifr"></param>
        /// <param name="act"></param>
        public void InsertBranchGroup(string name, string nameact, string shifr, string act)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.InsertCommand = "INSERT INTO DcProfTrainBranchGroup (Name,vcActuality,vcChangeDate) VALUES (@name,@act,GETDATE())";
            val.InsertParameters.Add(new Parameter("name", TypeCode.String, name));
            val.InsertParameters.Add(new Parameter("act", TypeCode.Int32, nameact));
            val.Insert();
            val.InsertParameters.Clear();
            val.InsertCommand = "INSERT INTO RtProfTrainBranchGroup (DcProfTrainBranchGroupId,Shifr ,vcActuality ,vcChangeDate) VALUES ((SELECT MAX(DcProfTrainBranchGroupId) FROM DcProfTrainBranchGroup),@shifr, @act, GETDATE())";
            val.InsertParameters.Add(new Parameter("shifr", TypeCode.String, shifr));
            val.InsertParameters.Add(new Parameter("act", TypeCode.Int32, act));
            val.Insert();
        }

        /// <summary>
        /// Обновление * в Dc..Branch, Rt..Branch
        /// </summary>
        /// <param name="groupid"></param>
        /// <param name="name"></param>
        /// <param name="nameact"></param>
        /// <param name="shifr"></param>
        /// <param name="act"></param>
        public void UpdateBranch(string groupid, string name, string nameact, string shifr, string act)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.UpdateCommand = "UPDATE RtProfTrainBranch SET RtProfTrainBranchGroupId=@groupid, Shifr = @shifr, vcActuality = @act, vcChangeDate=GETDATE() WHERE RtProfTrainBranchId = @id";
            var dt = GetBranchGroup(null, groupid);
            val.UpdateParameters.Add(new Parameter("shifr", TypeCode.String, dt.Table.Rows[0]["Shifr"].ToString() + shifr.Substring(2)));
            val.UpdateParameters.Add(new Parameter("groupid", TypeCode.Int32, groupid));
            val.UpdateParameters.Add(new Parameter("act", TypeCode.Int32, act));
            val.UpdateParameters.Add(new Parameter("id", TypeCode.Int32, _session["treevalue"].ToString()));
            val.Update();
            val.UpdateParameters.Clear();
            val.UpdateCommand = "UPDATE DcProfTrainBranch SET Name=@name, vcActuality=@act, vcChangeDate=GETDATE() WHERE DcProfTrainBranchId = (SELECT T1.DcProfTrainBranchId FROM RtProfTrainBranch as T1 WHERE T1.RtProfTrainBranchId = @id)";
            val.UpdateParameters.Add(new Parameter("name", TypeCode.String, name));
            val.UpdateParameters.Add(new Parameter("act", TypeCode.Int32, nameact));
            val.UpdateParameters.Add(new Parameter("id", TypeCode.Int32, _session["treevalue"].ToString()));
            val.Update();
        }

        /// <summary>
        /// Вствка * в Dc..Branch & Rt..Branch
        /// </summary>
        /// <param name="groupid"></param>
        /// <param name="name"></param>
        /// <param name="nameact"></param>
        /// <param name="shifr"></param>
        /// <param name="act"></param>
        public void InsertBranch(string groupid, string name, string nameact, string shifr, string act)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.InsertCommand = "INSERT INTO DcProfTrainBranch (Name ,vcActuality ,vcChangeDate) VALUES (@name, @act, GETDATE())";
            val.InsertParameters.Add(new Parameter("name", TypeCode.String, name));
            val.InsertParameters.Add(new Parameter("act", TypeCode.Int32, nameact));
            val.Insert();
            val.InsertParameters.Clear();
            val.InsertCommand = "INSERT INTO RtProfTrainBranch (DcProfTrainBranchId, RtProfTrainBranchGroupId ,Shifr, vcActuality, vcChangeDate) VALUES ((SELECT MAX(DcProfTrainBranchId) FROM DcProfTrainBranch), @groupid, @shifr, @act, GETDATE())";
            val.InsertParameters.Add(new Parameter("shifr", TypeCode.String, shifr));
            val.InsertParameters.Add(new Parameter("groupid", TypeCode.Int32, groupid));
            val.InsertParameters.Add(new Parameter("act", TypeCode.Int32, nameact));
            val.Insert();
        }

        /// <summary>
        /// Выборка DcOKRId, RtProfTRainBranch
        /// </summary>
        /// <returns></returns>
        public DataView GetRtProfTrainTotalByAll()
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.SelectCommand = "SELECT T1.DcOKRId, T1.RtProfTrainBranchId FROM RtProfTrainTotal as T1 WHERE T1.RtProfTrainTotalId=@id";
            val.SelectParameters.Add(new Parameter("id", TypeCode.Int32, _session["treevalue"].ToString()));
            return (DataView)val.Select(DataSourceSelectArguments.Empty);
        }

        /// <summary>
        /// Выборка из DcLicencing(Series, Number) по RtProfTrainTotalId из DcLicence
        /// </summary>
        /// <param name="id"></param>
        /// <param name="_sort"></param>
        /// <returns></returns>
        public DataView GetLicensingByProfTrainTotal(string RtProfTrainTotalId)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.SelectCommand = "SELECT T1.DcLicenceId, T2.Abbreviation, T4.Name, T1.LicenceSize, T3.LicenceSeries, T3.LicenceNumber  FROM DcLicence as T1 INNER JOIN DcSubdivision as T2 ON T1.DcSubdivisionId=T2.DcSubdivisionId INNER JOIN DcLicensing as T3 ON T1.DcLicensingId=T3.DcLicensingId INNER JOIN DcStudyForm as T4 ON T1.DcStudyFormId=T4.DcStudyFormId";
            val.SelectCommand += " WHERE T1.RtProfTrainTotalId = @id";
            val.SelectParameters.Add(new Parameter("id", TypeCode.Int32, RtProfTrainTotalId));
            val.SelectCommand += " ORDER BY LicenceSeries";
            return (DataView)val.Select(DataSourceSelectArguments.Empty);
        }

        /// <summary>
        /// Выборка записи из DcLicensing
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public DataView GetLicensing(string id)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.SelectCommand = "SELECT* FROM DcLicensing";
            if (id != null)
            {
                val.SelectCommand += " WHERE DcLicensingId=@id";
                val.SelectParameters.Add(new Parameter("id", TypeCode.Int32, id));
            }
            return (DataView)val.Select(DataSourceSelectArguments.Empty);
        }

        /// <summary>
        /// Вставтка в DcLicensing
        /// </summary>
        /// <param name="ser"></param>
        /// <param name="num"></param>
        /// <param name="iss"></param>
        /// <param name="minis"></param>
        /// <param name="start"></param>
        /// <param name="stop"></param>
        /// <param name="act"></param>
        public void InsertLicensing(string ser, string num, string iss, string minis, string start, string stop, string act)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.InsertCommand = "INSERT INTO DcLicensing (LicenceSeries ,LicenceNumber ,DecisionIssue ,Minister, vcDateStart ,vcDateStop ,vcActuality ,vcChangeDate)  VALUES (@ser, @num, @iss, @minis, @start, @stop, @act, GETDATE())";
            val.InsertParameters.Add(new Parameter("ser", TypeCode.String, ser));
            val.InsertParameters.Add(new Parameter("num", TypeCode.Int32, num));
            val.InsertParameters.Add(new Parameter("iss", TypeCode.String, iss));
            val.InsertParameters.Add(new Parameter("minis", TypeCode.String, minis));
            val.InsertParameters.Add(new Parameter("start", TypeCode.DateTime, start));
            val.InsertParameters.Add(new Parameter("stop", TypeCode.DateTime, stop));
            val.InsertParameters.Add(new Parameter("act", TypeCode.Int32, act));
            val.Insert();
        }

        public void UpdateLicensing(string ser, string num, string iss, string minis, string start, string stop, string act)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.UpdateCommand = "UPDATE DcLicensing SET LicenceSeries = @ser  ,LicenceNumber = @num, DecisionIssue = @iss ,Minister = @minis, vcDateStart = @start ,vcDateStop = " + (stop == ""?"null":"@stop") + " , vcActuality = @act ,vcChangeDate = GETDATE() WHERE DcLicensingId = @id";
            val.UpdateParameters.Add(new Parameter("ser", TypeCode.String, ser));
            val.UpdateParameters.Add(new Parameter("num", TypeCode.Int32, num));
            val.UpdateParameters.Add(new Parameter("iss", TypeCode.String, iss));
            val.UpdateParameters.Add(new Parameter("minis", TypeCode.String, minis));
            val.UpdateParameters.Add(new Parameter("start", TypeCode.DateTime, start));
            if (stop != "")
                val.UpdateParameters.Add(new Parameter("stop", TypeCode.DateTime, stop));
            val.UpdateParameters.Add(new Parameter("act", TypeCode.Int32, act));
            val.UpdateParameters.Add(new Parameter("id", TypeCode.Int32, _session["treevalue"].ToString()));
            val.Update();
        }

        /// <summary>
        /// Выборка из DcLicence по DcLicensingId
        /// </summary>
        /// <param name="licensingid"></param>
        /// <returns></returns>
        public DataView GetLicenceByLicensing(string licensingid, string parentid)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.SelectCommand = "SELECT T1.DcLicenceId, T2.Abbreviation, T6.Name, T4.Name as NameForm, T3.TotalShifr, T1.LicenceSize FROM DcLicence as T1 INNER JOIN DcSubdivision as T2 ON T1.DcSubdivisionId = T2.DcSubdivisionId INNER JOIN RtProfTrainTotal as T3 ON T1.RtProfTrainTotalId=T3.RtProfTrainTotalId INNER JOIN DcStudyForm as T4 ON T1.DcStudyFormId=T4.DcStudyFormId INNER JOIN RtProfTrain as T5 ON T3.RtProfTrainId=T5.RtProfTrainId INNER JOIN DcProfTrain as T6 ON T5.DcProfTrainId=T6.DcProfTrainId WHERE T1.DcLicensingId = @id AND T1.ParentId";
            if (parentid == null)
            {
                val.SelectCommand += " is null";
            }
            else
            {
                val.SelectCommand += " = @parentid";
                val.SelectParameters.Add(new Parameter("parentid", TypeCode.String, parentid));
            }
            val.SelectCommand += " ORDER BY T1.DcLicenceId";
            val.SelectParameters.Add(new Parameter("id", TypeCode.Int32, licensingid));
            var dt = (DataView)val.Select(DataSourceSelectArguments.Empty);
            return dt;
        }

        /// <summary>
        /// Выборка подразделений
        /// </summary>
        /// <returns></returns>
        public DataView GetSubdivision()
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.SelectCommand = "SELECT DcSubdivisionId, Name FROM DcSubdivision";
            return (DataView)val.Select(DataSourceSelectArguments.Empty);
        }

        /// <summary>
        /// Выборка специальностей
        /// </summary>
        /// <returns></returns>
        public DataView GetListSpeciality()
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.SelectCommand = "SELECT T1.RtProfTrainTotalId, T3.Name FROM RtProfTrainTotal as T1 INNER JOIN RtProfTrain as T2 ON T1.RtProfTrainId=T2.RtProfTrainId INNER JOIN DcProfTrain as T3 ON T2.DcProfTrainId = T3.DcProfTrainId";
            return (DataView)val.Select(DataSourceSelectArguments.Empty);
        }

        /// <summary>
        /// Выбор форм обучения
        /// </summary>
        /// <returns></returns>
        public DataView GetStudyForms()
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.SelectCommand = "SELECT Name, DcStudyFormId FROM DcStudyForm";
            return (DataView)val.Select(DataSourceSelectArguments.Empty);
        }

        /// <summary>
        /// Выбор лицензии по id
        /// </summary>
        /// <returns></returns>
        public DataView GetLicence(string id)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.SelectCommand = "SELECT* FROM DcLicence WHERE DcLicenceId=@id";
            val.SelectParameters.Add(new Parameter("id", TypeCode.Int32, id));
            return (DataView)val.Select(DataSourceSelectArguments.Empty);
        }

        public DataView GetCathedra()
        {
            string userId = _session["UserAccountId"].ToString();

            SqlDataSource val = new SqlDataSource();
            
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            //val.SelectCommand = "SELECT Name, DcSubdivisionId FROM [DcSubdivision] WHERE [DcSubdivisionTypeId]=30 ORDER BY Name";
            val.SelectCommand = "select s.Name, s.DcSubdivisionId from RtResponsible r, DcSubdivision s where r.DcSubsystemId = 15 and r.UserAccountId = " + userId + "and r.DcSubdivisionId = s.DcSubdivisionId ORDER BY Name";



            return (DataView)val.Select(DataSourceSelectArguments.Empty);

        }

        /// <summary>
        /// Обновление данных в DcLicence
        /// </summary>
        /// <param name="p"></param>
        /// <param name="p_2"></param>
        /// <param name="p_3"></param>
        /// <param name="p_4"></param>
        /// <param name="p_5"></param>
        public void UpdateLicence(string parentid, string subdivid, string proftrainid, string formid, string lisid, string size, string stop, string id, string act)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.UpdateCommand = "UPDATE DcLicence SET ParentId = " + (parentid==null?"null":"@parent") + " ,DcSubdivisionId = @sub ,RtProfTrainTotalId = @prof ,DcStudyFormId = @form ,DcLicensingId = @lisid ,LicenceSize = @size ,LicenceTermValidity = @stop ,vcActuality = @act, vcChangeDate = GETDATE() WHERE DcLicenceId=@id";
            val.UpdateParameters.Add(new Parameter("sub", TypeCode.Int32, subdivid));
            val.UpdateParameters.Add(new Parameter("prof", TypeCode.Int32, proftrainid));
            val.UpdateParameters.Add(new Parameter("form", TypeCode.Int32, formid));
            val.UpdateParameters.Add(new Parameter("size", TypeCode.Int32, size));
            val.UpdateParameters.Add(new Parameter("stop", TypeCode.DateTime, stop));
            val.UpdateParameters.Add(new Parameter("id", TypeCode.Int32, id));
            val.UpdateParameters.Add(new Parameter("lisid", TypeCode.Int32, lisid));
            val.UpdateParameters.Add(new Parameter("act", TypeCode.Int32, act));
            if (parentid != null)
            {
                val.UpdateParameters.Add(new Parameter("parent", TypeCode.Int32, parentid));
            }
            val.Update();
        }

        public void InsertLicence(string parentid, string subdivid, string proftrainid, string formid, string lisid, string size, string stop, string act)
        {
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            val.InsertCommand = "INSERT INTO DcLicence (ParentId ,DcSubdivisionId ,RtProfTrainTotalId ,DcStudyFormId ,DcLicensingId ,LicenceSize ,LicenceTermValidity ,vcActuality ,vcChangeDate) VALUES ( " + (parentid !=null?"@parent":"null") + " , @sub, @prof, @form, @lisid, @size, @stop, @act, GETDATE())";
            val.InsertParameters.Add(new Parameter("sub", TypeCode.Int32, subdivid));
            val.InsertParameters.Add(new Parameter("prof", TypeCode.Int32, proftrainid));
            val.InsertParameters.Add(new Parameter("form", TypeCode.Int32, formid));
            val.InsertParameters.Add(new Parameter("size", TypeCode.Int32, size));
            val.InsertParameters.Add(new Parameter("stop", TypeCode.DateTime, stop));
            val.InsertParameters.Add(new Parameter("lisid", TypeCode.Int32, lisid));
            val.InsertParameters.Add(new Parameter("act", TypeCode.Int32, act));
            if (parentid != null)
            {
                val.InsertParameters.Add(new Parameter("parent", TypeCode.Int32, parentid));
            }
            val.Insert();
        }


        public bool CheckLicenceSize(string parentid, string id, int wsize)
        {
            if (parentid == null && id == "Add" && wsize >= 0)//если создается родитель в на 2 уровне дерева то возможно любое число
            {
                return true;
            }
            else if(wsize < 0)
            {
                return false;
            }

            int allsize = 0;//общая сумма
            int mainsize = 0;//лимит размера
            SqlDataSource val = new SqlDataSource();
            val.ConnectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();
            DataView dt;
            
            
            if(parentid != null)
            {   //если есть родитель узнаем размер данной лицензии и отнимаем его от общей суммы
                if (id != "Add")
                {
                    val.SelectCommand = "SELECT LicenceSize FROM DcLicence WHERE DcLicenceId=@id";
                    val.SelectParameters.Add("id", TypeCode.Int32, id);
                    dt = (DataView)val.Select(DataSourceSelectArguments.Empty);
                    allsize -= Convert.ToInt32(dt.Table.Rows[0]["LicenceSize"]);//отнимаем это значение т.к. оно изменяется
                }
            }
            else
            {
                parentid = id;
                mainsize = wsize;
                wsize = 0;
            }

            val.SelectParameters.Add(new Parameter("parentid", TypeCode.Int32, parentid));

            if (mainsize == 0)
            {
                //берем допустимый размер(размер родителя)
                //берем все размеры для определенного родителя
                val.SelectCommand = "SELECT T1.LicenceSize as MainSize FROM DcLicence as T1 WHERE T1.DcLicenceId=@parentid;";
                dt = (DataView)val.Select(DataSourceSelectArguments.Empty);
                mainsize = Convert.ToInt32(dt.Table.Rows[0]["MainSize"]);
            }

            val.SelectCommand = "SELECT T1.LicenceSize FROM DcLicence as T1 WHERE T1.ParentId = @parentid";
            dt = (DataView)val.Select(DataSourceSelectArguments.Empty);
            foreach (DataRow row in dt.Table.Rows)
            {
                allsize += Convert.ToInt32(row["LicenceSize"]);
            }

            if (mainsize - allsize - wsize < 0)
            {   //если размер родителя минус сума всех размеров минус введеный размер меньше нуля, 
                //это значит что допустимый размер привышен
                return false;
            }
            else
            {
                return true;
            }
        }

    }
}