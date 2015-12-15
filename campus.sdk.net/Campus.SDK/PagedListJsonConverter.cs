using Newtonsoft.Json;
using PagedList;
using System;

namespace Campus.SDK
{
    internal class PagedListJsonConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            if (value != null && value is IPagedList)
            {
                serializer.Serialize(writer, value);
            }
            else
            {
                throw new Exception("Object is null or not implement IPagedList interface.");
            }
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
