using System.Security.Cryptography;
using System.Text;

namespace DNATestSystem.Services.Hepler
{
    public class HashHelper
    {
        public static string BCriptHash(string input)
        {
            return BCrypt.Net.BCrypt.HashPassword(input);
        }
        public static bool BCriptVerify(string input, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(input, hash);
        }
        //
        public static string GenerateRandomString(int length)
        {
            string s = "";
            var random = new Random();
            for (int i = 0; i < length; i++)
            {
                s += (char)random.Next('a', 'z');
            }
            return s;
        }

        public static string Hash256(string input)
        {
            byte[] hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
            string hash = Convert.ToHexString(hashBytes);
            return hash;
        }
    }
}
