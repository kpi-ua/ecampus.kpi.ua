using Campus.Core.Pulse.Common.BaseClasses;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Campus.SDK.Test.BaseClasses.Tests
{
    public class TestClass : AbstractSingleton<TestClass>
    {
        public int t;

        public TestClass()
            : base()
        {
            t = 10;
        }
    }

    [TestClass()]
    public class AbstractSingletonTests
    {
        [TestMethod()]
        public void VerifyChildTest()
        {
            var t = TestClass.Instance.t;
            Assert.Fail();

        }
    }
}
