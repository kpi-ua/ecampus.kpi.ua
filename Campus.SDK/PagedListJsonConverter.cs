using Newtonsoft.Json;
using PagedList;
using System;

namespace Campus.SDK
{
    internal class PagedListJsonConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            object pagedList = serializer.Deserialize<PagedList>(reader);
            return pagedList;
        }

        public override bool CanConvert(Type objectType)
        {
            return (objectType == typeof(IPagedList));
        }
    }
}
