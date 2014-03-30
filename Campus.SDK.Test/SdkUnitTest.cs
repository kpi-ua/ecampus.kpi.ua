using Campus.SDK;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace SDK.Test
{
    [TestClass]
    public class SdkUnitTest
    {
        [TestMethod]
        public void TestAuthenticate()
        {
            var client = new Client();
            var session = client.Authenticate("123", "123");
            Assert.AreEqual(false, String.IsNullOrEmpty(session));
        }

        [TestMethod]
        public void TestPaging()
        {
            var client = new Client();
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
