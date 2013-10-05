using Campus.SDK;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Data;

namespace SDK.Test
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {
            var client = new Client();
            var dataTable = client.Call<DataTable>("Home/MethodFive");
            Assert.AreEqual(true, true);
        }
    }
}
