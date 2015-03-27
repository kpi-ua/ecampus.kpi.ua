using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Campus.Core.Common.Generators;
using Campus.Core.Pulse.Common.Generators;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Campus.SDK.Test.Common.Generators.Tests
{
    [TestClass()]
    public class GuidIdGeneratorTests
    {
        [TestMethod()]
        public void GetNextIdTest()
        {
            var guid = GuidIdGenerator.Instance.GetNextId();
            Guid g = default(Guid);
            Assert.IsTrue(Guid.TryParse(guid.ToString(), out g));
            Assert.AreEqual(guid, g.ToString());
        }
    }
}
