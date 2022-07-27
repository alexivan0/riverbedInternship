using System.ComponentModel.DataAnnotations.Schema;

namespace PortfolioTracker.Models
{
	public class TradeHistory
	{
		public int TradeHistoryId { get; set; }

		public int PortfolioId { get; set; }

		public string Symbol { get; set; }

		[Column(TypeName = "money")]
		public decimal Units { get; set; }

		public string Type { get; set; }

		[Column(TypeName = "money")]
		public decimal Price { get; set; }

		[Column(TypeName = "Date")]
		public DateTime CreatedDate { get; set; }
	}
}
