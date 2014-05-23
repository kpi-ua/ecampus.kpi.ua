using System;

namespace Core
{
    public class Permission
    {
        public String Subsystem { get; private set; }

        public bool Create { get; set; }

        public bool Read { get; set; }

        public bool Update { get; set; }

        public bool Delete { get; set; }

        public Permission(String name)
        {
            Subsystem = name;
        }
    }
}
