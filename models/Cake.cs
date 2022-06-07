using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace week_1_cs_alexivan0.models
{
    public class Cake
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public float? avgUnitsSold { get; set; }

    }
}