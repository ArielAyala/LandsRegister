namespace LandRegister.Application.DTOs
{
    public class CreatePropertyDto
    {
        public string Reference { get; set; } = string.Empty;
        public string SellerContact { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? LocationLink { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string Dimensions { get; set; } = string.Empty;
        public bool IsTitled { get; set; }
        public string User { get; set; } = string.Empty;
    }
}