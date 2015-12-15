using System;
using System.IO;
using System.Net.Http;
using System.Threading;
using Campus.Core.Pulse;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Campus.SDK.Test
{   
    [TestClass()]
    public class PulseControllerTests
    {
#if DEBUG
        [TestMethod()]
        public void PulseControllerTest()
        {
            try
            {
                TestClass testObject = new TestClass();

                testObject.Request = new System.Net.Http.HttpRequestMessage();
                testObject.Request.Content = new StreamContent(new MemoryStream());                

                var response = testObject.Get(testObject.RequestM, "123");                

                Thread.Sleep(8000);

                string s = response.Content.ToString();
                var c = response.RequestMessage.Content;
                if (response.StatusCode != System.Net.HttpStatusCode.OK)
                    Assert.Fail();

            }catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
#endif
    }
}
