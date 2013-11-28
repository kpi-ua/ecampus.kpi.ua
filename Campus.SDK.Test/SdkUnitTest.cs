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
    }
}
