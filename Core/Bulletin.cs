using System;
using System.Collections.Generic;
using System.Linq;

namespace Core
{
    /// <summary>
    /// Внутренний класс обьявления из доски обьявлений
    /// </summary>
    public class Bulletin
    {
        public Bulletin()
        {
            CreationDate = new DateTime(1000, 1, 1);
            BulletinId = -1;
        }

        /// <summary>
        /// -1 указывает что объявление только создается, в противном случае оно редактируется по ИД
        /// </summary>
        public int BulletinId { get; set; }

        public string Subject { get; set; }
        public int SubjectId { get; set; }
        public string Text { get; set; }
        public string CreatorName { get; set; }
        public int CreatorId { get; set; }

        public DateTime CreationDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        /// <summary>
        /// Поле показывает можно ли редактировать объявление для юзера который запросил вывод этого объявления
        /// </summary>
        /// 
        public string StrLinkList = "///";
        public List<BulletinLink> LinkList = new List<BulletinLink>();

        public void ParseLink(string link)
        {
            foreach (var v in link.Split(new[] { '.' }, StringSplitOptions.RemoveEmptyEntries))
                LinkList.Add(new BulletinLink(v));
        }
    }

    public class BulletinLink
    {
        public int Id { get; set; }
        public int? GroupId { get; set; }
        public int? ProfileId { get; set; }
        public int? SubdivisionId { get; set; }
        public int? ProfilePermissionId { get; set; }

        public BulletinLink(int? groupId = -1, int? profileId = -1, int? subdivisionId = -1, int? profilePermissionId = -1)
        {
            GroupId = groupId;
            ProfileId = profileId;
            SubdivisionId = subdivisionId;
            ProfilePermissionId = profilePermissionId;
        }
        public BulletinLink(string str)
        {
            var list = str.Split(new[] { '/' }, StringSplitOptions.None);
            for (int i = 0; i < list.Count(); i++)
            {
                var value = (list[i] != "") ? Int32.Parse(list[i]) : -1;
                switch (i)
                {
                    case 0:
                        GroupId = value;
                        break;
                    case 1:
                        ProfileId = value;
                        break;
                    case 2:
                        SubdivisionId = value;
                        break;
                    case 3:
                        ProfilePermissionId = value;
                        break;
                }
            }
        }
    }

    public static class Static
    {
        public static string ConvertToString(this List<BulletinLink> list)
        {
            var result = list.Aggregate("", (current, v) =>
                current + (v.GroupId + "/" + v.ProfileId + "/" + v.SubdivisionId + "/" + v.ProfilePermissionId + "."));
            return result.Substring(0, result.Length - 1);
        }
    }
}
