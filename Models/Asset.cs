using System.ComponentModel.DataAnnotations.Schema;

namespace PortfolioTracker.Models
{
	public class Asset
	{
		public int AssetId { get; set; }

		public int PortfolioId { get; set; }

		[Column(TypeName = "money")]
		public decimal Units { get; set; }

		public string Symbol { get; set; }
	}
}
