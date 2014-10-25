using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Core.Doska
{
    //Внутренний класс обьявления из доски обьявлений
    [Serializable]
    public class Bulletin
    {
        public Bulletin(string subject, string text)
        {
            Subject = subject;
            Text = text;
        }

        public int BulletinId = -1; // -1 указывает что объявление только создается, в противном случае оно редактируется по ИД
        public string Subject = "";
        public string Text = "";
        public string CreatorName = "";
        public int CreatorId = 0;
        public DateTime CreationDate = new DateTime(1000,1,1);
        public DateTime ModifiedDate = new DateTime(1000,1,1);
        public bool Editable = false; // Поле показывает можно ли редактировать объявление для юзера который запросил вывод этого объявления
        public int? GroupId = -1;
        public int? ProfileId = -1;
        public int? SubdivisionId = -1;
        public int? ProfilePermissionId = -1;
        
    }
}
