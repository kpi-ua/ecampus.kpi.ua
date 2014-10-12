using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Campus.Core.Common.BaseClasses;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Campus.Core.Common.Exceptions;

namespace Campus.Core.Common.BaseClasses.Tests
{
    public class TestClass : AbstractSingleton<TestClass>
    {
        public int t;

        public TestClass() : base()
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
            try
            {
                var t = TestClass.Instance.t;
                Assert.Fail();
            }
            catch (ArchitectureException)
            {

            }
        }
    }
}
