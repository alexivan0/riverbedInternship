using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

public abstract class BaseController : Controller
{
    // [Authorize]
    // public int GetUserId()
    // {
    //     return int.Parse(User.Claims.First(i => i.Type == "UserId").Value);
    // }
}