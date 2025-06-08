namespace DNATestSystem.Application.Dtos
{
    public static class PasswordChangeStore
    {
        public static Dictionary<string, PendingPasswordChange> Requests = new();
    }
}
