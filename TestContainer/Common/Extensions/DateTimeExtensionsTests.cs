using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace Campus.Core.Common.Extensions.Tests
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
