using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Campus.Core.Common.Extensions;
using Campus.Core.Pulse.Common.Extensions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Campus.PulseTests.Common.Extensions
{
    [TestClass()]
    public class IEnumerableExtensionsTests
    {
        private Random rand = new Random();

        private int[] GenerateTestValues(int count)
        {
            Action<ConcurrentBag<int>> generate = (vals) => vals.Add(rand.Next());
            
            var values = new ConcurrentBag<int>();
            var tasks = new List<Task>();
            
            for (int i = 0; i < count; i++)
            {
                tasks.Add(Task.Run(() => generate(values)));
            }

            Task.WaitAll(tasks.ToArray());
            return values.ToArray();
        }

        private int[] GenerateTestValues()
        {
            int count = 1000;
            var values = new ConcurrentBag<int>();
            Action generate = () => values.Add(rand.Next());
            var tasks = new List<Task>();
            
            for (int i = 0; i < count; i++)
            {
                tasks.Add(Task.Run(generate));
            }

            Task.WaitAll(tasks.ToArray());
            return values.ToArray();
        }

        private int[] GenerateTestValuesF()
        {
            int count = 1000;
            Func<ConcurrentBag<int>> generate = () =>
            {
                ConcurrentBag<int> values = new ConcurrentBag<int>();
                for (int i = 0; i < count; i++)
                {
                    values.Add(rand.Next());
                }
                return values;
            };

            var task = Task.Run(generate);
            task.Wait();
            return task.Result.ToArray();
        }

        [TestMethod()]
        public void ForEachTest()
        {
            int count = 1000;
            var testValues = GenerateTestValues(count);

            var expected = new ConcurrentBag<int>();
            var actual = new ConcurrentBag<int>();

            // expected
            foreach (var v in testValues)
            {
                expected.Add(v * v);
            }

            //actual
            testValues.ForEach((v) => actual.Add(v * v));

            var results = actual.Zip(expected, (a, e) => { return a == e; });
            if (results.Any(r => !r)) Assert.Fail();
        }

        [TestMethod()]
        public void ForEachAsyncTest()
        {
            var testValues = GenerateTestValues();

            var expected = new ConcurrentBag<int>();
            var actual = new ConcurrentBag<int>();

            //actual
            var actTask = testValues.ForEachAsync((v) => actual.Add(v * v));

            // expected
            foreach (var v in testValues)
            {
                expected.Add(v * v);
            }

            actTask.Wait();

            var results = actual.Zip(expected, (a, e) => { return actual.Contains(e); });
            if (results.Any(r => !r)) Assert.Fail();
        }

        [TestMethod()]
        public void ForEachAsyncTest1()
        {
            var testValues = GenerateTestValuesF();

            var expected = new ConcurrentBag<int>();
            var actual = new ConcurrentBag<int>();

            //actual
            var actTask = testValues.ForEachAsync((v) => Task.Run(() => actual.Add(v * v)));

            // expected
            foreach (var v in testValues)
            {
                expected.Add(v * v);
            }

            actTask.Wait();

            var results = actual.Zip(expected, (a, e) => { return actual.Contains(e); });
            if (results.Any(r => !r)) Assert.Fail();
        }

        [TestMethod()]
        public void ForEachTest1()
        {
            var testValues = GenerateTestValues(100);
            try
            {
                testValues.ForEach((e) => { throw new ArgumentException(); });
                Assert.Fail();
            }
            catch
            {
            }
        }
    }
}
