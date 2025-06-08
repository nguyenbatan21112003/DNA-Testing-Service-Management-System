namespace DNATestSystem.Application.Hash
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
                s += (char)random.Next(1, 255);
            }
            return s;
        }
    }
}
