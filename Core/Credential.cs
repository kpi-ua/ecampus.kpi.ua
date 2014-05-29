using System;

namespace Core
{
    public class Credential
    {
        public string Login { get; set; }
        public string Password { get; set; }
        
        public bool IsNotEmpty
        {
            get { return !(String.IsNullOrEmpty(Password) && String.IsNullOrEmpty(Login)); }
        }
    }
}
