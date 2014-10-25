using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Doska
{
    //Класс отображающий информацию о типах (включает в себя уникальный ид и имя)
    //Пример: (1, Науковець), (2, Декан), (3, Студент)...
    [Serializable]
    public class SimpleInfo
    {        
        public int Id;
        public string Name;

        public SimpleInfo()
        {

        }

        public SimpleInfo(int id, string name)
        {
            Id = id;
            Name = name;
        }
    }
}
