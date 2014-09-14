using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Campus.Core.Common.Extensions;
using Campus.Core.Common.Generators;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Campus.Pulse;
namespace Campus.Core.Common.Extensions.Tests
{
    [TestClass()]
    public class TypeExtensionsTests
    {
        [TestMethod()]
        public void ConstructTest()
        {
            var type = typeof(SimpleIdGenerator).Construct();
            if(!(type is SimpleIdGenerator))
                Assert.Fail();
        }
    }
}
