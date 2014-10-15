using Campus.Core.Common.BaseClasses;
using Campus.Core.EventsArgs;
using MoreLinq;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Contexts;

namespace Campus.Pulse
{
    /// <summary>
    /// Hight level wrapper that encapsulates message preparation and condition check.
    /// Can be used as message preparation collection.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    [Synchronization]
    public class SendQueue<T> : IList<T> where T : class
    {
        #region Internal classes

        private class MessageConditionPair
        {
            /// <summary>
            /// Gets or sets the message.
            /// </summary>
            /// <value>
            /// The message.
            /// </value>
            public T Message { get; set; }

            /// <summary>
            /// Gets or sets the condition.
            /// </summary>
            /// <value>
            /// The condition.
            /// </value>
            public Func<bool> Condition { get; set; }

            /// <summary>
            /// Gets or sets the on condition action.
            /// </summary>
            /// <value>
            /// The on condition.
            /// </value>
            public Action OnCondition { get; set; }

            /// <summary>
            /// Gets or sets a value indicating whether this <see cref="MessageConditionPair"/> is sent.
            /// </summary>
            /// <value>
            ///   <c>true</c> if sent; otherwise, <c>false</c>.
            /// </value>
            public bool Sent { get; set; }

            /// <summary>
            /// Gets or sets the identifier.
            /// </summary>
            /// <value>
            /// The identifier.
            /// </value>
            public object Identifier { get; set; }

            /// <summary>
            /// Initializes a new instance of the <see cref="MessageConditionPair"/> class.
            /// </summary>
            /// <param name="message">The message.</param>
            /// <param name="condition">The condition.</param>
            public MessageConditionPair(T message, Func<bool> condition)
            {
                Message = message; Condition = condition; Sent = false;
            }

            /// <summary>
            /// Initializes a new instance of the <see cref="MessageConditionPair"/> class.
            /// </summary>
            /// <param name="message">The message.</param>
            /// <param name="condition">The condition.</param>
            /// <param name="onCondiotion">The on condiotion.</param>
            public MessageConditionPair(T message, Func<bool> condition, Action onCondiotion)
                : this(message, condition)
            {
                if (onCondiotion == null)
                    OnCondition = () => { };
                OnCondition += () =>
                {
                    Sent = true;
                };
            }

            /// <summary>
            /// Initializes a new instance of the <see cref="MessageConditionPair"/> class.
            /// </summary>
            /// <param name="message">The message.</param>
            /// <param name="condition">The condition.</param>
            /// <param name="onCondiotion">The on condiotion.</param>
            /// <param name="identifier">The identifier.</param>
            public MessageConditionPair(T message, Func<bool> condition, Action onCondiotion, object identifier)
                : this(message, condition, onCondiotion)
            {
                Identifier = identifier;
            }

            /// <summary>
            /// Returns a <see cref="System.String" /> that represents this instance.
            /// </summary>
            /// <returns>
            /// A <see cref="System.String" /> that represents this instance.
            /// </returns>
            public override string ToString()
            {
                return Message.ToString() + ":" + Condition.ToString();
            }

            /// <summary>
            /// Determines whether the specified <see cref="System.Object" />, is equal to this instance.
            /// </summary>
            /// <param name="obj">The <see cref="System.Object" /> to compare with this instance.</param>
            /// <returns>
            ///   <c>true</c> if the specified <see cref="System.Object" /> is equal to this instance; otherwise, <c>false</c>.
            /// </returns>
            public override bool Equals(object obj)
            {
                return this.ToString().Equals(obj.ToString());
            }

            /// <summary>
            /// Returns a hash code for this instance.
            /// </summary>
            /// <returns>
            /// A hash code for this instance, suitable for use in hashing algorithms and data structures like a hash table.
            /// </returns>
            public override int GetHashCode()
            {
                return this.ToString().GetHashCode();
            }
        }

        #endregion Internal classes

        #region Events

        /// <summary>
        /// Occurs when [on any condition].
        /// </summary>
        public event Action<ConcurrentQueue<T>> OnAnyCondition;

        /// <summary>
        /// Occurs on each heartbeat
        /// </summary>
        public event Action CleanUp;

        #endregion Events

        #region Members

        private List<MessageConditionPair> _messageList;
        private static object _lock = null;
        private ConcurrentQueue<T> _ready = null;

        #endregion Members

        #region props

        /// <summary>
        /// Gets the ready messages.
        /// </summary>
        /// <value>
        /// The ready messages.
        /// </value>
        public ConcurrentQueue<T> ReadyMessages { get { return _ready; } }

        #endregion props

        #region c'tors

        /// <summary>
        /// Initializes a new instance of the <see cref="SendQueue{T}"/> class.
        /// </summary>
        /// <param name="interval">The interval.</param>
        public SendQueue(ref EventHandler<BeatEventArgs> syncEvent)
        {
            syncEvent += TimerCallback();
            _lock = new object();
            _messageList = new List<MessageConditionPair>();
            _ready = new ConcurrentQueue<T>();            
        }

        #endregion c'tors

        /// <summary>
        /// Timer callback.
        /// </summary>
        private EventHandler<BeatEventArgs> TimerCallback()
        {
            return (state, e) =>
            {
                lock (_lock)
                {
                    if (_messageList.Count > 0)
                    {
                        var ready = CheckConditions();
                        if (ready.Any())
                        {
                            ready.Select(pair => pair.OnCondition).ForEach((action) =>
                            {
                                if (action != null)
                                    action();
                            });

                            if (OnAnyCondition != null)
                                OnAnyCondition(_ready);

                            if (CleanUp != null)
                                CleanUp();
                        }
                    }
                }
            };
        }

        /// <summary>
        /// Checks the conditions.
        /// </summary>
        /// <returns></returns>
        private IEnumerable<MessageConditionPair> CheckConditions()
        {
            lock (_lock)
            {
                var messages = _messageList.Where(pair => pair.Condition() && !pair.Sent).DistinctBy(pair => pair.Message.ToString()); // select only unique messages with the same condition
                messages.ForEach(m => _ready.Enqueue(m.Message));

                return messages;
            }
        }

        /// <summary>
        /// Adds the specified message.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="condition">The condition.</param>
        public void Add(T message, Func<bool> condition, object identifier = null)
        {
            Add(message, condition, null, identifier);
        }

        /// <summary>
        /// Adds the specified message.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="condition">The condition.</param>
        /// <param name="onCondition">The on condition.</param>
        /// <param name="identifier">The identifier.</param>
        public void Add(T message, Func<bool> condition, Action onCondition, object identifier = null)
        {
            lock (_lock)
            {
                if (!_messageList.Any(pair => pair.Identifier.Equals(identifier ?? "") && pair.Message.Equals(message)))
                {
                    _messageList.Add(new MessageConditionPair(message, condition, onCondition, identifier ?? ""));
                }
            }
        }

        #region IList

        /// <summary>
        /// Determines the index of a specific item in the <see cref="T:System.Collections.Generic.IList`1" />.
        /// </summary>
        /// <param name="item">The object to locate in the <see cref="T:System.Collections.Generic.IList`1" />.</param>
        /// <returns>
        /// The index of <paramref name="item" /> if found in the list; otherwise, -1.
        /// </returns>
        public int IndexOf(T item)
        {
            return _messageList.IndexOf(_messageList.First(pair => pair.Message == item));
        }

        /// <summary>
        /// Inserts an item to the <see cref="T:System.Collections.Generic.IList`1" /> at the specified index.
        /// </summary>
        /// <param name="index">The zero-based index at which <paramref name="item" /> should be inserted.</param>
        /// <param name="item">The object to insert into the <see cref="T:System.Collections.Generic.IList`1" />.</param>
        public void Insert(int index, T item)
        {
            _messageList.Insert(index, new MessageConditionPair(item, () => true, null));
        }

        /// <summary>
        /// Removes the <see cref="T:System.Collections.Generic.IList`1" /> item at the specified index.
        /// </summary>
        /// <param name="index">The zero-based index of the item to remove.</param>
        public void RemoveAt(int index)
        {
            _messageList.RemoveAt(index);
        }

        /// <summary>
        /// Gets or sets the element at the specified index.
        /// </summary>
        /// <param name="index">The index.</param>
        /// <returns></returns>
        public T this[int index]
        {
            get
            {
                return _messageList[index].Message;
            }
            set
            {
                _messageList[index].Message = value;
            }
        }

        /// <summary>
        /// Adds an item to the <see cref="T:System.Collections.Generic.ICollection`1" />.
        /// </summary>
        /// <param name="item">The object to add to the <see cref="T:System.Collections.Generic.ICollection`1" />.</param>
        public void Add(T item)
        {
            Add(item, () => true, null);
        }

        /// <summary>
        /// Removes all items from the <see cref="T:System.Collections.Generic.ICollection`1" />.
        /// </summary>
        public void Clear()
        {
            _messageList.Clear();
        }

        /// <summary>
        /// Determines whether the <see cref="T:System.Collections.Generic.ICollection`1" /> contains a specific value.
        /// </summary>
        /// <param name="item">The object to locate in the <see cref="T:System.Collections.Generic.ICollection`1" />.</param>
        /// <returns>
        /// true if <paramref name="item" /> is found in the <see cref="T:System.Collections.Generic.ICollection`1" />; otherwise, false.
        /// </returns>
        public bool Contains(T item)
        {
            return _messageList.Any(pair => pair.Message == item);
        }

        /// <summary>
        /// Copies to.
        /// </summary>
        /// <param name="array">The array.</param>
        /// <param name="arrayIndex">Index of the array.</param>
        /// <exception cref="System.InvalidOperationException"></exception>
        public void CopyTo(T[] array, int arrayIndex)
        {
            throw new InvalidOperationException("This method is not relevant for this collection.");
        }

        /// <summary>
        /// Gets the number of elements contained in the <see cref="T:System.Collections.Generic.ICollection`1" />.
        /// </summary>
        public int Count
        {
            get { return _messageList.Count; }
        }

        /// <summary>
        /// Gets a value indicating whether the <see cref="T:System.Collections.Generic.ICollection`1" /> is read-only.
        /// </summary>
        public bool IsReadOnly
        {
            get { return false; }
        }

        /// <summary>
        /// Removes the specified message.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <returns></returns>
        bool ICollection<T>.Remove(T message)
        {
            lock (_lock)
            {
                _messageList.Remove(_messageList.First(pair => pair.Message == message));
            }
            return true;
        }

        /// <summary>
        /// Returns an enumerator that iterates through the collection.
        /// </summary>
        /// <returns>
        /// A <see cref="T:System.Collections.Generic.IEnumerator`1" /> that can be used to iterate through the collection.
        /// </returns>
        public IEnumerator<T> GetEnumerator()
        {
            return _messageList.Select<MessageConditionPair, T>(pair => pair.Message).GetEnumerator();
        }

        /// <summary>
        /// Returns an enumerator that iterates through a collection.
        /// </summary>
        /// <returns>
        /// An <see cref="T:System.Collections.IEnumerator" /> object that can be used to iterate through the collection.
        /// </returns>
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return _messageList.Select<MessageConditionPair, T>(pair => pair.Message).GetEnumerator();
        }

        #endregion IList
    }
}