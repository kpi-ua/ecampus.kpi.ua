using Newtonsoft.Json;
using System;
using System.IO;
using System.Reflection;
using System.Runtime.Serialization.Formatters.Binary;
using System.Xml;
using System.Xml.Serialization;

namespace Campus.Core.Common.Extensions
{
    public static class ObjectExtensions
    {

        /// <summary>
        /// To the json.
        /// </summary>
        /// <param name="result">The result.</param>
        /// <param name="format">The format.</param>
        /// <returns></returns>
        public static string ToJson(this Object result, Newtonsoft.Json.Formatting format = Newtonsoft.Json.Formatting.None)
        {
            var settings = new JsonSerializerSettings
            {
                DateFormatHandling = DateFormatHandling.IsoDateFormat,
                Formatting = format,
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
            };

            settings.ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();

            var json = JsonConvert.SerializeObject(result, settings);
            return json;
        }

        /// <summary>
        /// Deserializes the json to .NET object.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="s">The s.</param>
        /// <returns></returns>
        public static T FromJson<T>(this string s)
        {            
            return Newtonsoft.Json.JsonConvert.DeserializeObject<T>(s);            
        }

        /// <summary>
        /// Makes a copy from the object.
        /// Doesn't copy the reference memory, only data.
        /// </summary>
        /// <typeparam name="T">Type of the return object.</typeparam>
        /// <param name="item">Object to be copied.</param>
        /// <returns>Returns the copied object.</returns>
        public static T Clone<T>(this object item)
        {
            if (item != null)
            {
                BinaryFormatter formatter = new BinaryFormatter();
                MemoryStream stream = new MemoryStream();

                formatter.Serialize(stream, item);
                stream.Seek(0, SeekOrigin.Begin);

                T result = (T)formatter.Deserialize(stream);

                stream.Close();

                return result;
            }
            else
                return default(T);
        }

        /// <summary>
        /// From the XML.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="xmlString">The XML string.</param>
        /// <returns></returns>
        public static T FromXml<T>(this string xmlString)
        {
            T returnValue = default(T);

            XmlSerializer serial = new XmlSerializer(typeof(T));
            StringReader reader = new StringReader(xmlString);
            object result = serial.Deserialize(reader);

            if (result != null && result is T)
            {
                returnValue = ((T)result);
            }

            reader.Close();

            return returnValue;
        }

        /// <summary>
        /// To the XML.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="objectToSerialize">The object to serialize.</param>
        /// <returns></returns>
        public static string ToXml<T>(this T objectToSerialize)
        {
            XmlSerializer xmlSerializer = new XmlSerializer(typeof(T));

            StringWriter stringWriter = new StringWriter();
            XmlTextWriter xmlWriter = new XmlTextWriter(stringWriter);

            xmlWriter.Formatting = System.Xml.Formatting.Indented;
            xmlSerializer.Serialize(xmlWriter, objectToSerialize);

            return stringWriter.ToString();
        }

        /// <summary>
        /// Returns a hash code for this instance.
        /// </summary>
        /// <param name="obj">The object.</param>
        /// <returns>
        /// A hash code for this instance, suitable for use in hashing algorithms and data structures like a hash table. 
        /// </returns>
        /// <exception cref="System.ArgumentNullException"></exception>
        public static int GetHash(this object obj)
        {
            if (obj == null) throw new ArgumentNullException();            

            var props = obj.GetType().GetProperties(BindingFlags.GetField | BindingFlags.GetProperty | BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);

            unchecked
            {
                int hash = 17;
                props.ForEach((prop) =>
                {
                    var val = prop.GetValue(obj, null);
                    hash = (val != null) ? hash * 23 + val.GetHashCode() : hash;
                });
                return hash;
            }
        }

        /// <summary>
        /// Determines whether the specified object has attribute.
        /// </summary>
        /// <param name="obj">The object.</param>
        /// <param name="attribute">The attribute.</param>
        /// <param name="inherit">if set to <c>true</c> [inherit].</param>
        /// <returns></returns>
        public static bool HasAttribute(this object obj, Type attribute, bool inherit = false)
        {            
            return obj.GetType().GetCustomAttribute(attribute, inherit) != null;         
        }
    }
}
