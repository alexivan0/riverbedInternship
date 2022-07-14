using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioTracker.Data;
using PortfolioTracker.Models;

namespace PortfolioTracker.Controllers
{
	[Route("api/[controller]")]
    [ApiController]
    public class AssetsController : ControllerBase
    {
        private readonly PortfolioTrackerContext _context;

        public AssetsController(PortfolioTrackerContext context)
        {
            _context = context;
        }

        // GET: api/assets/portfolio/0
        [HttpGet("portfolio/{pid}")]
        public async Task<ActionResult<IEnumerable<Asset>>> GetAssets(int pid)
        {
            var assets = await _context.Asset.Where(a => a.PortfolioId == pid).ToListAsync();

            if (assets == null)
            {
                return NotFound();
            }

            return Ok(assets);
            //return await _context.Asset.ToListAsync();
        }

        // GET: api/Assets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Asset>> GetAsset(int pid, int id)
        {
            var asset = await _context.Asset.FindAsync(id);

            if (asset == null)
            {
                return NotFound();
            }

            return asset;
        }

        // PUT: api/Assets/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAsset(int id, Asset asset)
        {
            if (id != asset.AssetId)
            {
                return BadRequest();
            }

            _context.Entry(asset).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AssetExists(id))
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

        // POST: api/Assets
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Asset>> PostAsset(Asset asset)
        {
            //Check if entity already exists
            var entity = _context.Asset.FirstOrDefault(a => a.Symbol == asset.Symbol);
            if (entity != null)
            {
                entity.Units = entity.Units + asset.Units;
                await _context.SaveChangesAsync();
                //await PutAsset(entity.AssetId, entity);
                return Ok(entity);
            }


            _context.Asset.Add(asset);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAsset", new { id = asset.AssetId }, asset);
        }

        // DELETE: api/Assets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsset(int id)
        {
            var asset = await _context.Asset.FindAsync(id);
            if (asset == null)
            {
                return NotFound();
            }

            _context.Asset.Remove(asset);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AssetExists(int id)
        {
            return _context.Asset.Any(e => e.AssetId == id);
        }
    }
}
