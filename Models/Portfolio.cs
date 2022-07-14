using System.ComponentModel.DataAnnotations.Schema;

namespace PortfolioTracker.Models
{
	public class Portfolio
	{
		public int PortfolioId { get; set; }

		public int UserId { get; set; }

		[Column(TypeName = "money")]
		public decimal TradeBalance { get; set; }
	}
}
