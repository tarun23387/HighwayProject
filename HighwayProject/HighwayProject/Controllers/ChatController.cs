using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace HighwayProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public ChatController(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _httpClient = httpClientFactory.CreateClient();
        }

        // =========================================
        // POST api/chat/ask
        // Frontend se aayega: { question, facilities[], lat, lng }
        // =========================================

        [HttpPost("ask")]
        public async Task<IActionResult> Ask([FromBody] ChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Question))
                return BadRequest(new { error = "Question empty hai." });

            // API key appsettings se lo
            var apiKey = _configuration["Groq:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                return StatusCode(500, new { error = "Groq API key configure nahi hai. appsettings.json check karo." });

            var hospitalContext = BuildHospitalContext(request.Facilities);

            var systemPrompt = $@"
Aap UP (Uttar Pradesh) highway emergency response assistant ho.
Aapka kaam: accident ya emergency mein turant, seedha, Hindi mein madad karna.

Accident location coordinates: Lat {request.Lat:F4}, Lng {request.Lng:F4}

Nearby hospitals (distance ke hisab se sorted):
{hospitalContext}

Rules:
1. Hamesha Hindi mein jawab do.
2. Jawab 3-4 lines se zyada nahi — emergency mein time nahi hota.
3. Sabse pehle nearest FUNCTIONAL hospital ka naam aur phone number batao.
4. Agar severity poocha jaaye to Minor/Serious/Critical mein batao.
5. 112 ambulance ka number hamesha remind karo.
6. Agar koi hospital non-functional ho to skip karo aur next functional wala batao.
7. Emotional support bhi do — shant rehne kaho.
";

            // Groq API — OpenAI-compatible format
            var requestBody = new
            {
                model = "llama-3.3-70b-versatile",
                max_tokens = 400,
                messages = new[]
                {
                    new { role = "system", content = systemPrompt },
                    new { role = "user",   content = request.Question }
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + apiKey);

            try
            {
                var response = await _httpClient.PostAsync(
                    "https://api.groq.com/openai/v1/chat/completions", content);

                var responseBody = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    // Groq ka error message bhi return karo debugging ke liye
                    return StatusCode(500, new { error = "Groq se response nahi mila.", detail = responseBody });
                }

                using var doc = JsonDocument.Parse(responseBody);
                var aiText = doc.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                return Ok(new { reply = aiText });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Network error: " + ex.Message });
            }
        }

        // =========================================
        // Helper
        // =========================================

        private string BuildHospitalContext(List<FacilityInfo>? facilities)
        {
            if (facilities == null || facilities.Count == 0)
                return "Koi hospital data available nahi hai. User ko 112 call karne ko kaho.";

            var sb = new StringBuilder();
            int i = 1;
            foreach (var f in facilities.Take(5))
            {
                sb.AppendLine($"{i}. [{f.Type}] {f.Name}");
                sb.AppendLine($"   District: {f.District}");
                sb.AppendLine($"   Distance: {f.DistKm:F1} km");
                sb.AppendLine($"   Phone: {f.Phone}");
                sb.AppendLine($"   Status: {f.Status}");
                sb.AppendLine();
                i++;
            }
            return sb.ToString();
        }
    }

    // =========================================
    // Models
    // =========================================

    public class ChatRequest
    {
        public string Question { get; set; } = "";
        public double Lat { get; set; }
        public double Lng { get; set; }
        public List<FacilityInfo>? Facilities { get; set; }
    }

    public class FacilityInfo
    {
        public string Name { get; set; } = "";
        public string Type { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Status { get; set; } = "";
        public string District { get; set; } = "";
        public double DistKm { get; set; }
    }
}
