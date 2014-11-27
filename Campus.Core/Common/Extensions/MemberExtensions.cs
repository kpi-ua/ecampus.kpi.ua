using Campus.Core.Common.BaseClasses;
using Campus.Core.Documentation;
using System.Collections.Generic;
using System.Linq;

namespace Campus.Core.Common.Extensions
{
    public static  class MemberExtensions
    {
        /// <summary>
        /// Decorates the specified member.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="member">The member.</param>
        /// <returns></returns>
        public static T Decorate<T>(this Member @member) where T: Member
        {
            return GenericFactory<T>.Instance.Create(typeof(T).Name, new []{ @member });
        }

        /// <summary>
        /// Decorates all specified members.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="members">The members.</param>
        /// <returns></returns>
        public static IEnumerable<T> DecorateAll<T>(this IEnumerable<Member> @members) where T :  Member
        {
            return @members.Select(m => m.Decorate<T>());
        }

        /// <summary>
        /// Decorates all specified members.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="members">The members.</param>
        /// <returns></returns>
        public static ParallelQuery<T> DecorateAll<T>(this ParallelQuery<Member> @members) where T : Member
        {
            return @members.Select(m => m.Decorate<T>());
        }        
    }
}
