using Campus.Core;
using Campus.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Newtonsoft.Json;
using System.Net;

namespace Campus.Pulse
{
    public class PResult : Result
    {
        protected override void ControllerResult()
        {
            StatusCode = HttpStatusCode.OK;
        }        
    }
}
