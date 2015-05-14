using Campus.Core.Pulse.Common.Generators;
using Campus.Core.Pulse.Pulse;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Campus.SDK.Test.Generators
{
    [TestClass()]
    public class TemplateEngineTests
    {
        [TestMethod()]
        public void BuildTemplateTest()
        {
            Message m = new Message() { Data = "test data", EventType = "test", Id = "1", Retry = "false"};
            var template = @"<test-id>{Id}</test-id><test-data>{Data}</test-data>";
            TemplateEngine<Message> templ = new TemplateEngine<Message>(m, template, null);
            Assert.AreEqual(@"<test-id>1</test-id><test-data>test data</test-data>", templ.Result);
        }

        [TestMethod()]
        public void BuildTemplateTestChangeIdentifier()
        {
            Message m = new Message() { Data = "test data", EventType = "test", Id = "1", Retry = "false" };
            var template = @"<test-id>@Id@</test-id><test-data>@Data@</test-data>";
            TemplateEngine<Message> templ = new TemplateEngine<Message>(m, template, new[]{"@", "@"});
            Assert.AreEqual(@"<test-id>1</test-id><test-data>test data</test-data>", templ.Result);
        }
    }
}
