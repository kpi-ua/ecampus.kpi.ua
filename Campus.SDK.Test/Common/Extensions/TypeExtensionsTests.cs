using Campus.Core.Pulse.Common.Extensions;
using Campus.Core.Pulse.Common.Generators;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Campus.SDK.Test.Common.Extensions
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
