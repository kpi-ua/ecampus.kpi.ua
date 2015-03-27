using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Campus.Core.Common.Generators;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Campus.Core.Common.Extensions;
using Campus.Core.Pulse.Common.Generators;

namespace Campus.Core.Common.Generators.Tests
{
    [TestClass()]
    public class SimpleIdGeneratorTests
    {
        [TestMethod()]
        public void GetNextIdTest()
        {
            for (int i = 1; i <= 50; i++)
            {
                var id = SimpleIdGenerator.Instance.GetNextId();
                Assert.AreEqual(i.ToString(), id);
            }
        }

        [TestMethod()]
        public void GetNextIdtAfterTest()
        {
            LinkedList<string> listResult = new LinkedList<string>();
            LinkedList<string> listExpected = new LinkedList<string>();
            for (int i = int.Parse(SimpleIdGenerator.Instance.GetLastId()); i <= 10; i++)
            {
                var id = SimpleIdGenerator.Instance.GetNextId();
                listResult.AddLast(id);
                listExpected.AddLast((i + 1).ToString());
            }

            Assert.AreEqual(listResult.Zip(listExpected, (r, e) =>
            {
                return r.Equals(e);
            }).Any(c => !c), false);
        }

        [TestMethod()]
        public void GetNextIdAsyncTest()
        {
            LinkedList<string> listResult = new LinkedList<string>();
            LinkedList<string> listExpected = new LinkedList<string>();
            LinkedList<Task> tasks = new LinkedList<Task>();
            for (int i = int.Parse(SimpleIdGenerator.Instance.GetLastId()); i <= 10; i++)
            {
                tasks.AddLast(Task.Run(() =>
                {
                    var id = SimpleIdGenerator.Instance.GetNextId();
                    lock (this)
                    {
                        listResult.AddLast(id);
                        listExpected.AddLast((i + 1).ToString());
                    }
                }));
            }
            Task.WaitAll(tasks.ToArray());
            Assert.AreEqual(listResult.Zip(listExpected, (r, e) =>
            {
                return r.Equals(e);
            }).Any(c => !c), false);
        }
    }
}
