using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Campus.Pulse;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Campus.Core.Interfaces;
namespace Campus.Pulse.Tests
{
    [TestClass()]
    public class SendQueueTests
    {
        [TestMethod()]
        public void AddTest()
        {
            Action OnBeat = () => { };
            try
            {                
                var testObject = new SendQueue<IMessage>(ref OnBeat);
                testObject.Add(new Message(data: "test"), () => true);
                testObject.Add(new Message(data: "test"), () => true);
                testObject.OnAnyCondition += (pairs) =>
                {
                    Assert.IsFalse(pairs.Count() == 2);
                };

                int j = 1;
                for (int i = 0; i < 10000; i++)
                {
                    Console.WriteLine(i);
                    if (i == 100 * j)
                    {
                        j++;
                        OnBeat();
                    }
                }
            }catch(Exception)
            {
                throw;
            }
        }

        [TestMethod()]
        public void AddAsyncTest()
        {
            Action OnBeat = () => { };
            var testObject = new SendQueue<IMessage>(ref OnBeat);
            testObject.OnAnyCondition += (pairs) =>
            {
                //Assert.IsFalse(pairs.Count() != 4);
                Console.WriteLine(pairs.Count);
            };

            try
            {
                Task.Run(() =>
                {                    
                    testObject.Add(new Message(data: "test1"), () => true);
                    testObject.Add(new Message(data: "test3"), () => true);                    
                });

                Task.Run(() =>
                {
                    testObject.Add(new Message(data: "test1"), () => true);
                    testObject.Add(new Message(data: "test2"), () => true);
                });

                Task.Run(() =>
                {
                    testObject.Add(new Message(data: "test1"), () => true);
                    testObject.Add(new Message(data: "test4"), () => true);
                });

                int j = 1;
                for (int i = 0; i < 10000; i++)
                {
                    Console.WriteLine(i);
                    if (i == 100 * j)
                    {
                        j++;
                        OnBeat();
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
