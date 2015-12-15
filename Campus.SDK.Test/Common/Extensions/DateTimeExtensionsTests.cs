using System;
using Campus.Core.Pulse.Common.Extensions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Campus.SDK.Test.Common.Extensions
{
    [TestClass()]
    public class DateTimeExtensionsTests
    {
        [TestMethod()]
        public void ToUnixTimeTest()
        {
            var testDate = Convert.ToDateTime("30-09-2014 22:00:00");
            var testDateUnix = testDate.ToUnixTime();

            Assert.AreEqual<int>((int)testDateUnix, 1412114400);
        }
    }
}
