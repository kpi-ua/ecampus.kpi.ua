
namespace Campus.Core.Pulse.Interfaces
{
    public interface IMessageIdGenerator
    {
        /// <summary>
        /// Generate a new id for the given message.
        /// </summary>
        /// <returns>The generated id.</returns>
        string GetNextId();
    }    
}
