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
    public class PortfoliosController : BaseController
    {
        private readonly PortfolioTrackerContext _context;

        public PortfoliosController(PortfolioTrackerContext context)
        {
            _context = context;
        }

        // GET: api/portfolios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Portfolio>>> GetPortfolios()
        {
            return await _context.Portfolio.ToListAsync();
        }

        // // GET: api/portfolios/currentuser
        // [HttpGet("currentuser")]
        // [Authorize]
        // public async Task<ActionResult<Portfolio>> GetPortfolio()
        // {
        //     var userId = GetUserId();

        //     var portfolio = await _context.Portfolio.FirstOrDefaultAsync(p => p.UserId == userId);

        //     if (portfolio == null)
        //     {
        //         return NotFound();
        //     }

        //     return Ok(portfolio);
        // }

        // PUT: api/portfolios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPortfolio(int id, Portfolio portfolio)
        {
            if (id != portfolio.PortfolioId)
            {
                return BadRequest();
            }

            _context.Entry(portfolio).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PortfolioExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/portfolios
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Portfolio>> PostPortfolio(Portfolio portfolio)
        {
            _context.Portfolio.Add(portfolio);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPortfolio", new { id = portfolio.PortfolioId }, portfolio);
        }

        // DELETE: api/portfolios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePortfolio(int id)
        {
            var portfolio = await _context.Portfolio.FindAsync(id);
            if (portfolio == null)
            {
                return NotFound();
            }

            _context.Portfolio.Remove(portfolio);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PortfolioExists(int id)
        {
            return _context.Portfolio.Any(e => e.PortfolioId == id);
        }

    }
}
