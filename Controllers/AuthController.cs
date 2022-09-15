using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PortfolioTracker.Data;
using PortfolioTracker.Models;

namespace PortfolioTracker.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : BaseController
    {
        private readonly PortfolioTrackerContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(PortfolioTrackerContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost, Route("login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            if (user == null)
                return BadRequest("Invalid client request");

            var checkUser = await _context.User.FirstOrDefaultAsync(u => u.UserName == user.UserName);
            if (checkUser == null)
                return BadRequest("Invalid client request");

            if (user.UserName == checkUser.UserName && user.Password == checkUser.Password)
            {
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                    _configuration.GetSection("AppSettings:Token").Value));
                var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var portfolio = await _context.Portfolio.FirstOrDefaultAsync(p => p.UserId == checkUser.UserId);

                List<Claim> claims = new()
                {
                    new Claim("UserId" , checkUser.UserId.ToString()),
                    new Claim("PortfolioId", portfolio.PortfolioId.ToString())
                };

                var tokenOptions = new JwtSecurityToken(
                    issuer: "https://localhost:44429",
                    audience: "https://localhost:44429",
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(30),
                    signingCredentials: signingCredentials
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
                return Ok(new { Token = tokenString });
            }

            return Unauthorized();
        }
    }
}
