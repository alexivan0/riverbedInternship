using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioTracker.Data;
using PortfolioTracker.Models;

namespace PortfolioTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TradeHistoriesController : BaseController
    {
        private readonly PortfolioTrackerContext _context;

        public TradeHistoriesController(PortfolioTrackerContext context)
        {
            _context = context;
        }

        // GET: api/tradeHistories/portfolios/1
        [HttpGet("portfolios/{pid}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TradeHistory>>> GetTradeHistories(int pid)
        {
            var trades = await _context.TradeHistory.Where(a => a.PortfolioId == pid).ToListAsync();

            if (trades == null)
            {
                return NotFound();
            }

            return trades;
        }

        // GET: api/TradeHistories/5/portfolios/3
        [HttpGet("{id}/portfolios/{pid}")]
        [Authorize]
        public async Task<ActionResult<TradeHistory>> GetTradeHistory(int id, int pid)
        {
            var trade = await _context.TradeHistory.Where(p => p.PortfolioId == pid && p.TradeHistoryId == id).FirstOrDefaultAsync();

            if (trade == null)
            {
                return NotFound();
            }

            return trade;
        }

        // PUT: api/TradeHistories/5/portfolios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}/portfolios/{pid}")]
        [Authorize]
        public async Task<IActionResult> PutTradeHistory(int id, int pid, TradeHistory tradeHistory)
        {
            if (id != tradeHistory.TradeHistoryId && pid != tradeHistory.PortfolioId)
            {
                return BadRequest();
            }

            var entity = await _context.TradeHistory.FirstOrDefaultAsync(t => t.TradeHistoryId == id && t.PortfolioId == pid);

            if (entity == null)
            {
                return BadRequest();
            }

            entity.CreatedDate = tradeHistory.CreatedDate;
            entity.Price = tradeHistory.Price;
            entity.Symbol = tradeHistory.Symbol;
            entity.Type = tradeHistory.Type;
            entity.Units = tradeHistory.Units;

            await _context.SaveChangesAsync();
            return Ok(entity);
        }

        // POST: api/TradeHistories/portfolios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("portfolios/{pid}")]
        [Authorize]
        public async Task<ActionResult<TradeHistory>> PostTradeHistory(int pid, TradeHistory tradeHistory)
        {
            if (pid != tradeHistory.PortfolioId)
            {
                return BadRequest();
            }

            _context.TradeHistory.Add(tradeHistory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTradeHistory", new { id = tradeHistory.TradeHistoryId }, tradeHistory);
        }

        // DELETE: api/TradeHistories/5/portfolios/5
        [HttpDelete("{id}/portfolios/{pid}")]
        [Authorize]
        public async Task<IActionResult> DeleteTradeHistory(int pid, int id)
        {
            var tradeHistory = await _context.TradeHistory.FirstOrDefaultAsync(t => t.TradeHistoryId == id && t.PortfolioId == pid);
            if (tradeHistory == null)
            {
                return NotFound();
            }

            _context.TradeHistory.Remove(tradeHistory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TradeHistoryExists(int pid, int id)
        {
            return _context.TradeHistory.Any(e => e.TradeHistoryId == id && e.PortfolioId == pid);
        }
    }
}
