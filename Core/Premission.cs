using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core
{
    public class Premission
    {
        private string subsystemName;

        public string subsystem {
            get {
                return subsystemName;
            }
        }

        public bool create;

        public bool read;

        public bool update;

        public bool delete;

        public Premission(string name) {
            this.subsystemName = name;
        }
    }
}
