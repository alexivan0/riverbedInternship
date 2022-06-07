using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using week_1_cs_alexivan0.models;

namespace week_1_cs_alexivan0.Service
{
    public class CakeService
    {
        private List<Cake> cakeList = new List<Cake>
        {
            new Cake {Id = 0, Name = "Amandina", Description = "ciocolata", Price = 6},
            new Cake {Id = 1, Name = "Savarina", Description = "frisca", Price = 5},
            new Cake {Id = 2, Name = "Profiterol", Description = "ciocolata/vanilie", Price = 10},
            new Cake {Id = 3, Name = "Pancake", Description = "ciocolata", Price = 8}
        };
        private List<CakeSale> cakeSaleList = new List<CakeSale>()
        {
            new CakeSale {Id = 0, CakeId = 0, UnitsSold = 3},
            new CakeSale {Id = 1, CakeId = 0, UnitsSold = 4},
            new CakeSale {Id = 2, CakeId = 1, UnitsSold = 1},
            new CakeSale {Id = 3, CakeId = 1, UnitsSold = 5},
            new CakeSale {Id = 4, CakeId = 1, UnitsSold = 3},
            new CakeSale {Id = 5, CakeId = 2, UnitsSold = 4},
            new CakeSale {Id = 6, CakeId = 3, UnitsSold = 1}

        };

        public void addCake(string name, string description, decimal price)
        {
            Cake newCake = new Cake
            {
                // Auto-incrementing id
                Id = cakeList.Count > 0 ? cakeList.Last().Id + 1 : 0,
                Name = name,
                Description = description,
                Price = price
            };

            cakeList.Add(newCake);
            Console.WriteLine();
            Console.WriteLine("Cake added!");
        }

        public void addCakeSale(int cakeId, int unitsSold)
        {
            CakeSale newCakeSale = new CakeSale
            {
                Id = cakeSaleList.Count > 0 ? cakeSaleList.Last().Id + 1 : 0,
                CakeId = cakeId,
                UnitsSold = unitsSold
            };

            cakeSaleList.Add(newCakeSale);
            Console.WriteLine();
            Console.WriteLine("Cake sale added!");
        }

        public void getAllCakes()
        {
            Console.WriteLine();
            Console.WriteLine("Id | Name | Description | Price");
            foreach (Cake cake in cakeList)
            {
                Console.WriteLine($"{cake.Id} | {cake.Name} | {cake.Description} | {cake.Price}");
            }

        }

        public void getAllCakeSales(string sortOrder)
        {
            switch (sortOrder)
            {
                case "6":
                    cakeSaleList = cakeSaleList.OrderByDescending(x => x.UnitsSold).ToList();
                    Console.WriteLine();
                    Console.WriteLine("Id | Cake_Id | Cakes Sold");
                    foreach (CakeSale cakeSold in cakeSaleList)
                    {
                        Console.WriteLine($"{cakeSold.Id} | {cakeSold.CakeId} | {cakeSold.UnitsSold}");
                    }
                    break;
                case "7":
                    // Group the cakeSaleList by the cakeID
                    var groupedResult = cakeSaleList.GroupBy(x => x.CakeId);
                    Console.WriteLine();
                    Console.WriteLine("Cake_Id | Name | Description | Price | Average Sold");
                    // This is probably not the best way to do this (TODO: Use Dictionaries)
                    // Iterate over every grouped cake
                    foreach (var group in groupedResult)
                    {
                        //Populate the AvgUnitsSold field in the cakeList
                        foreach (var cake in cakeList)
                        {
                            if (group.Key == cake.Id)
                            {
                                cake.avgUnitsSold = group.Sum(x => x.UnitsSold) / (float)group.Count();
                            }
                        }
                    }
                    // Order the cakeList by AvgUnitsSold
                    cakeList = cakeList.OrderBy(x => x.avgUnitsSold).ToList();
                    foreach (var cake in cakeList)
                    {
                        Console.WriteLine($"{cake.Id} | {cake.Name} | {cake.Description} | {cake.Price} |  {cake.avgUnitsSold}");
                    }
                    break;
                default:
                    Console.WriteLine("Invalid choice");
                    break;
            }
        }

        public void deleteCake(int id)
        {
            if (cakeList != null && cakeList.Count > 0)
            {
                foreach (Cake cake in cakeList)
                {
                    if (id == cake.Id)
                    {
                        cakeList.Remove(cake);
                        Console.WriteLine();
                        Console.WriteLine("Cake deleted!");
                        return;
                    }
                }
            }
            Console.WriteLine();
            Console.WriteLine("There are no cakes to delete!");
            return;
        }



        public void updateCake(int id, string name, string description, decimal price)
        {
            foreach (Cake cake in cakeList)
            {
                if (id == cake.Id)
                {
                    cake.Name = name;
                    cake.Description = description;
                    cake.Price = price;
                }
            }

            Console.WriteLine();
            Console.WriteLine("Cake updated!");
        }
    }
}