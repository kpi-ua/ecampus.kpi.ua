using System.Collections.Generic;
using Campus.SDK;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace SDK.Test
{
    [TestClass]
    public class SdkUnitTest
    {
        private Client CreateClient()
        {
            var settings = new Dictionary<string, string>()
            {
                {"campus-proxy-enabled", "false"},                
                {"campus-api-endpoint", "http://campus-api.azurewebsites.net/"},
            };

            var configuration = new Configuration(settings);

            Campus.SDK.Client.SetCustomEndpoint(configuration.ApiEndpoint);

            var client = new Client();

            return client;
        }

        [TestMethod]
        public void TestConfiguration()
        {
            Dictionary<string, string> dictionary1 = null;
            Dictionary<string, string> dictionary2 = new Dictionary<string, string>();
            Dictionary<string, string> dictionary3 = new Dictionary<string, string>()
            {
                {"campus-proxy-enabled", "true"},
                {"campus-proxy-login", "sdfdsf"},
                {"campus-proxy-password", "sdfdsf"},
                {"campus-proxy-host", "sdfdsf"},
                {"campus-proxy-port", "10"},
                {"campus-api-endpoint", "sdfdsf"},
            };

            var configuration1 = new Configuration(dictionary1);
            var configuration2 = new Configuration(dictionary2);
            var configuration3 = new Configuration(dictionary3);

            Assert.AreEqual(String.Empty, configuration1.ProxyHost);
            Assert.AreEqual(String.Empty, configuration1.ProxyHost);
            Assert.AreEqual(10, configuration3.ProxyPort);
            Assert.AreEqual(true, configuration3.ProxyEnabled);

            //Assert.AreEqual(String.Empty, configuration1.Proxy.);
        }

        [TestMethod]
        public void TestAuthenticate()
        {
            var client = CreateClient();
            var session = client.Authenticate("1", "12");
            Assert.AreEqual(false, String.IsNullOrEmpty(session));
        }

        [TestMethod]
        public void TestPaging()
        {
            var client = CreateClient();
            var result = client.Get(Client.ApiEndpoint + "Test/GetPagedData?rows=1000&page=2&size=20");
            Assert.AreEqual(false, result == null);
        }

        [TestMethod]
        public void BuildUrl()
        {
            const string expected1 = "http://api.ecampus.kpi.ua/Test/Method1?arg1=1&arg2=welcome";
            const string expected2 = "http://api.ecampus.kpi.ua/Test/Method2";
            
            var arg = new
            {
                arg1 = 1,
                arg2 = "welcome"
            };

            var actual1 = Campus.SDK.Client.BuildUrl("Test", "Method1", arg);

            var actual2 = Campus.SDK.Client.BuildUrl("Test", "Method2");

            Assert.AreEqual(expected1, actual1);
            Assert.AreEqual(expected2, actual2);
        }
    }
}
