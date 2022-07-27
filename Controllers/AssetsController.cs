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
    public class AssetsController : BaseController
    {
        private readonly PortfolioTrackerContext _context;

        public AssetsController(PortfolioTrackerContext context)
        {
            _context = context;
        }

        // GET: api/assets/portfolios/0
        [HttpGet("portfolios/{pid}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Asset>>> GetAssets(int pid)
        {
            var assets = await _context.Asset.Where(a => a.PortfolioId == pid).ToListAsync();

            if (assets == null)
            {
                return NotFound();
            }

            return assets;
        }

        // GET: api/assets/1/portfolios/0
        [HttpGet("{id}/portfolios/{pid}")]
        [Authorize]
        public async Task<ActionResult<Asset>> GetAsset(int id, int pid)
        {
            var asset = await _context.Asset.Where(p => p.PortfolioId == pid && p.AssetId == id).FirstOrDefaultAsync();

            if (asset == null)
            {
                return NotFound();
            }

            return asset;
        }

        // PUT: api/assets/5/portfolios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}/portfolios/{pid}")]
        [Authorize]
        public async Task<IActionResult> PutAsset(int pid, int id, Asset asset)
        {

            if (id != asset.AssetId && pid != asset.PortfolioId)
            {
                return BadRequest();
            }

            var entity = await _context.Asset.FirstOrDefaultAsync(a => a.Symbol == asset.Symbol && a.PortfolioId == pid);

            if (entity == null)
            {
                return BadRequest();
            }

            //_context.Entry(asset).State = EntityState.Modified;
            entity.Units = asset.Units;


            await _context.SaveChangesAsync();
            return Ok(entity);

        }

        // POST: api/assets/portfolios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("portfolios/{pid}")]
        [Authorize]
        public async Task<ActionResult<Asset>> PostAsset(int pid, Asset asset)
        {

            if (pid != asset.PortfolioId)
            {
                return BadRequest();
            }

            //Check if entity already exists
            var entity = await _context.Asset.FirstOrDefaultAsync(a => a.Symbol == asset.Symbol && a.PortfolioId == pid);
            if (entity != null)
            {
                entity.Units = entity.Units + asset.Units;
                if(entity.Units <= 0)
                {
                    _context.Remove(entity);
                }
                await _context.SaveChangesAsync();
                return Ok(entity);
            }

            if (asset.Units > 0)
            {
                _context.Asset.Add(asset);
                await _context.SaveChangesAsync();
            }
            
            return CreatedAtAction("GetAsset", new { id = asset.AssetId }, asset);
        }

        // DELETE: api/assets/0/portfolios/{pid}
        [HttpDelete("{id}/portfolios/{pid}")]
        [Authorize]
        public async Task<IActionResult> DeleteAsset(int pid, int id)
        {
            var asset = await _context.Asset.FirstOrDefaultAsync(p => p.PortfolioId == pid && p.AssetId == id);
            if (asset == null)
            {
                return NotFound();
            }

            _context.Asset.Remove(asset);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AssetExists(int pid, int id)
        {
            return _context.Asset.Any(e => e.PortfolioId == pid && e.AssetId == id);
        }
    }
}
