using System;
using System.Net;

namespace Campus.SDK
{
    internal class Proxy : IWebProxy
    {
        public Proxy(string address, bool bypassOnLocal)
        {

        }

        public ICredentials Credentials { get; set; }

        public Uri GetProxy(Uri destination)
        {
            throw new NotSupportedException();
        }

        public bool IsBypassed(Uri host)
        {
            throw new NotSupportedException();
        }
    }
}
