using System;

namespace Campus.Core.Pulse.EventsArgs
{
    public class BeatEventArgs : EventArgs
    {
        public BeatEventArgs(object state)
        {
            this.State = state;
        }

        public object State { get; private set; }        
    }

    public class BeatEventArgs<T> : BeatEventArgs where T: class
    {
        public BeatEventArgs(object state, T client)
            :base(state)
        {
            this.Client = client;
        }

        public T Client { get; private set; }        
    }
}
