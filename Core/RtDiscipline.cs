using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Campus.Common
{
    public class RtDiscipline
    {
        public int RtProfTrainTotalId { get; set; }
        public int DcCycleId { get; set; }
        public int DcComponentId { get; set; }
        public string Name { get; set; }
        public string Shifr { get; set; }
        public Nullable<int> CountHour { get; set; }
        public Nullable<double> CreditNational { get; set; }
        public Nullable<double> CreditECTS { get; set; }
        public string OutCredit { get; set; }
        public string vcActuality { get; set; }
        public string vcStatus { get; set; }
        public DateTime vcStatusDate { get; set; }
        public DateTime vcChangeDate { get; set; }
        public string FullName { get; set; }
    }
}
