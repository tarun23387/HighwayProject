using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace HighwayProject.Controllers
{
    public class MapController : Controller
    {
        private readonly IConfiguration _configuration;

        public MapController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // =========================================
        // MAP PAGE
        // =========================================

        public IActionResult Index()
        {
            return View();
        }

        // =========================================
        // DISTRICT GEOJSON API
        // =========================================

        [HttpGet]
        public IActionResult GetDistrictGeoJson()
        {
            string path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "data",
                "district.geojson"
            );

            if (!System.IO.File.Exists(path))
            {
                return NotFound($"File not found : {path}");
            }

            string json = System.IO.File.ReadAllText(path);

            return Content(json, "application/json");
        }

        // =========================================
        // DH GEOJSON API
        // =========================================

        [HttpGet]
        public IActionResult GetDHGeoJson()
        {
            string path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "data",
                "DH_phone.geojson"
            );

            if (!System.IO.File.Exists(path))
            {
                return NotFound($"File not found : {path}");
            }

            string json = System.IO.File.ReadAllText(path);

            return Content(json, "application/json");
        }


        // =========================================
        // DH GEOJSON API
        // =========================================

        [HttpGet]
        public IActionResult GetSHGeoJson()
        {
            string path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "data",
                "SH_phone.geojson"
            );

            if (!System.IO.File.Exists(path))
            {
                return NotFound($"File not found : {path}");
            }

            string json = System.IO.File.ReadAllText(path);

            return Content(json, "application/json");
        }


        [HttpGet]
        public IActionResult GetCHCGeoJson()
        {
            string path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "data",
                "89_CHC_Phone.geojson"
            );

            if (!System.IO.File.Exists(path))
            {
                return NotFound($"File not found : {path}");
            }

            string json = System.IO.File.ReadAllText(path);

            return Content(json, "application/json");
        }



        [HttpGet]
        public IActionResult GetTraumaGeoJson()
        {
            string path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "data",
                "Trauma_center.geojson"
            );

            if (!System.IO.File.Exists(path))
            {
                return NotFound($"File not found : {path}");
            }

            string json = System.IO.File.ReadAllText(path);

            return Content(json, "application/json");
        }



        [HttpGet]
        public IActionResult GetTraumaGeoJson29()
        {
            string path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "data",
                "Trauma_29.geojson"
            );

            if (!System.IO.File.Exists(path))
            {
                return NotFound($"File not found : {path}");
            }

            string json = System.IO.File.ReadAllText(path);

            return Content(json, "application/json");
        }


        [HttpGet]
        public IActionResult GetPrivateHospitalGeoJson()
        {
            string path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "data",
                "PrivateHospital.geojson"
            );

            if (!System.IO.File.Exists(path))
            {
                return NotFound($"File not found : {path}");
            }

            string json = System.IO.File.ReadAllText(path);

            return Content(json, "application/json");
        }

        [HttpGet]
        public IActionResult GetPmRahatGeoJson()
        {
            string path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "data",
                "PMRahat204.geojson"
            );

            if (!System.IO.File.Exists(path))
            {
                return NotFound($"File not found : {path}");
            }

            string json = System.IO.File.ReadAllText(path);

            return Content(json, "application/json");
        }

        [HttpGet]
        public IActionResult GetNationalHighwayGeoJson()
        {
            string path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "data",
                "NH.geojson"
            );

            if (!System.IO.File.Exists(path))
            {
                return NotFound($"File not found : {path}");
            }

            string json = System.IO.File.ReadAllText(path);

            return Content(json, "application/json");
        }


        [HttpGet]
        public IActionResult GetExpresswayGeoJson()
        {
            string path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "data",
                "PurvanchalExpressway.geojson"
            );

            if (!System.IO.File.Exists(path))
            {
                return NotFound($"File not found : {path}");
            }

            string json = System.IO.File.ReadAllText(path);

            return Content(json, "application/json");
        }

        [HttpGet]
        public IActionResult GetTollPlazaGeoJson()
        {
            string path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "data",
                "PurvanchalTollPlaza.geojson"
            );

            if (!System.IO.File.Exists(path))
            {
                return NotFound($"File not found : {path}");
            }

            string json = System.IO.File.ReadAllText(path);

            return Content(json, "application/json");
        }

        // CHCs within 2 km / 5 km of the Purvanchal Expressway
        [HttpGet]
        public IActionResult GetChcExpresswayGeoJson(int km)
        {
            if (km != 2 && km != 5)
            {
                return BadRequest("km must be 2 or 5");
            }

            string path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "data",
                $"CHC_{km}km.geojson"
            );

            if (!System.IO.File.Exists(path))
            {
                return NotFound($"File not found : {path}");
            }

            string json = System.IO.File.ReadAllText(path);

            return Content(json, "application/json");
        }

        [HttpGet]
        public IActionResult GetBloodBankGeoJson()
        {
            string path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "data",
                "BloodBank.geojson"
            );

            if (!System.IO.File.Exists(path))
            {
                return NotFound($"File not found : {path}");
            }

            string json = System.IO.File.ReadAllText(path);

            return Content(json, "application/json");
        }




        //[HttpGet]
        //public IActionResult GetCHCLocations()
        //{
        //    string connString =
        //        _configuration.GetConnectionString("PgConnection");

        //    var features = new List<object>();

        //    using (var conn = new NpgsqlConnection(connString))
        //    {
        //        conn.Open();

        //        string query = @"
        //            SELECT
        //                col3 AS facility_name,
        //                col2 AS district,
        //                col9 AS distance_km,
        //                col14 AS NearbyAls,
        //                col16 AS BaseLocation,
        //                latitude,
        //                longitude
        //            FROM public.chc_89_on_road
        //        ";

        //        using (var cmd = new NpgsqlCommand(query, conn))
        //        using (var reader = cmd.ExecuteReader())
        //        {
        //            while (reader.Read())
        //            {
        //                try
        //                {
        //                    string latStr =
        //                        reader["latitude"]?.ToString();

        //                    string lngStr =
        //                        reader["longitude"]?.ToString();

        //                    if (
        //                        double.TryParse(latStr, out double lat)
        //                        &&
        //                        double.TryParse(lngStr, out double lng)
        //                    )
        //                    {
        //                        features.Add(new
        //                        {
        //                            type = "Feature",

        //                            geometry = new
        //                            {
        //                                type = "Point",
        //                                coordinates = new[] { lng, lat }
        //                            },

        //                            properties = new
        //                            {
        //                                facility_name =
        //                                    reader["facility_name"]?.ToString(),

        //                                district =
        //                                    reader["district"]?.ToString(),
        //                                distance_km =
        //                                    reader["distance_km"]?.ToString(),
        //                                NearbyAls =
        //                                    reader["NearbyAls"]?.ToString(),
        //                                BaseLocation =
        //                                    reader["BaseLocation"]?.ToString(),
        //                            }
        //                        });
        //                    }
        //                }
        //                catch
        //                {
        //                }
        //            }
        //        }
        //    }

        //    var geojson = new
        //    {
        //        type = "FeatureCollection",
        //        features = features
        //    };

        //    return Json(geojson);
        //}
    }
}