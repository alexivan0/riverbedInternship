using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PortfolioTracker.Data;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<PortfolioTrackerContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("PortfolioTrackerContext") ?? throw new InvalidOperationException("Connection string 'PortfolioTrackerContext' not found.")));

// Add services to the container.

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
