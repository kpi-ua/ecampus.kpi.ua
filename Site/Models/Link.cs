using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Site.Models
{
    public class Link
    {
        public string Title { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public string Url { get; set; }

        public static IEnumerable<Link> GetList()
        {
            return new[]
            {
                new Link
                {
                    Title = "Facebook",
                    Description = "",
                    Url = "https://www.facebook.com/pages/Electronic-Campus-of-NTUU-KPI/626578197378085",
                    Image = ""
                },
                new Link
                {
                    Title = "Конструкторское бюро \"Информационных Систем\"",
                    Description = "",
                    Url = "http://kbis.kpi.ua/",
                    Image = ""
                },
                new Link
                {
                    Title = "Портал разработчиков электронного кампус",
                    Description = "",
                    Url = "dev.ecampus.kpi.ua",
                    Image = ""
                },
                new Link
                {
                    Title = "GitHub",
                    Description = "",
                    Url = "https://github.com/DOIS",
                    Image = ""
                },
                new Link
                {
                    Title = "NuGet",
                    Description = "http://www.nuget.org/profiles/DOIS/",
                    Url = "",
                    Image = ""
                },
                new Link
                {
                    Title = "НТУУ КПИ - ",
                    Description = "",
                    Url = "http://kpi.ua/ecampus",
                    Image = ""
                },
                new Link
                {
                    Title = "",
                    Description = "",
                    Url = "",
                    Image = ""
                },
                new Link
                {
                    Title = "",
                    Description = "",
                    Url = "",
                    Image = ""
                },
                new Link
                {
                    Title = "",
                    Description = "",
                    Url = "",
                    Image = ""
                },
                new Link
                {
                    Title = "",
                    Description = "",
                    Url = "",
                    Image = ""
                },
                new Link
                {
                    Title = "",
                    Description = "",
                    Url = "",
                    Image = ""
                },
                new Link
                {
                    Title = "",
                    Description = "",
                    Url = "",
                    Image = ""
                }
            };
        }
    }
}