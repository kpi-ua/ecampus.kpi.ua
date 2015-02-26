using Campus.Core.Common.Generators;
using Campus.Core.Pulse.Common.Extensions;
using Campus.Core.Pulse.Common.Generators;
using Campus.Pulse;
using Microsoft.VisualStudio.TestTools.UnitTesting;
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
