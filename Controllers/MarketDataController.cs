using Microsoft.AspNetCore.Mvc;
using PortfolioTracker.Data;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PortfolioTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MarketDataController : ControllerBase
    {
        //StringBuilder symbolsString = new StringBuilder();
        HttpClient client = new HttpClient();
        List<Symbol> symbolsList = new List<Symbol>();
        Dictionary<string, string> symbolsDict = new Dictionary<string, string>();



        [HttpGet]
        public async Task GetSymbols()
        {
            string response = await client.GetStringAsync("https://www.binance.com/api/v3/ticker/price");

            //string symbols = JsonSerializer.Deserialize<string>(response);

            //symbolsList = JsonSerializer.Deserialize<List<Symbol>>();

            //foreach (Symbol obj in symbolsList)
            //{
            //   symbolsDict.Add(obj.symbol.)
            //}



        }


        // GET: api/<MarketDataController>
        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        // GET api/<MarketDataController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<MarketDataController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<MarketDataController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<MarketDataController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
