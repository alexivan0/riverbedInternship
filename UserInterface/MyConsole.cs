using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using week_1_cs_alexivan0.Service;


//No input validation becasue didn't have time
namespace week_1_cs_alexivan0.UserInterface
{
    public class MyConsole
    {
        private CakeService _cakeService;

        public MyConsole(CakeService cakeService)
        {
            _cakeService = cakeService;
        }

        private void ShowMenu()
        {
            Console.WriteLine();
            Console.WriteLine("1. Add a cake.");
            Console.WriteLine("2. Update a cake.");
            Console.WriteLine("3. Remove a cake.");
            Console.WriteLine("4. Show all cakes.");
            Console.WriteLine("5. Add a cake sale.");
            Console.WriteLine("6. Show all cake sales by units sold, descending.");
            Console.WriteLine("7. Show all cakes by the average units sold, ascending.");

            Console.WriteLine();
            Console.WriteLine("Enter your choice: ");
        }

        private void addCakeDetails()
        {
            Console.WriteLine();
            Console.WriteLine("Enter the cake name");
            string name = Console.ReadLine();

            Console.WriteLine("Enter the cake description");
            string description = Console.ReadLine();

            Console.WriteLine("Enter the cake price");
            decimal price = Convert.ToDecimal(Console.ReadLine());

            _cakeService.addCake(name, description, price);

        }

        private void addCakeSaleDetails()
        {
            Console.WriteLine();

            Console.WriteLine("Enter the cake id");
            int cakeId = Convert.ToInt32(Console.ReadLine());

            Console.WriteLine("Enter how many cakes have been sold");
            int unitsSold = Convert.ToInt32(Console.ReadLine());

            _cakeService.addCakeSale(cakeId, unitsSold);
        }

        private void updatCakeDetails()
        {
            Console.WriteLine();
            Console.WriteLine("Enter the cake id");
            int id = Convert.ToInt32(Console.ReadLine());

            Console.WriteLine("Enter the cake new name");
            string name = Console.ReadLine();

            Console.WriteLine("Enter the cake new description");
            string description = Console.ReadLine();

            Console.WriteLine("Enter the cake new price");
            decimal price = Convert.ToDecimal(Console.ReadLine());

            _cakeService.updateCake(id, name, description, price);
        }

        private void removeCakeDetails()
        {
            Console.WriteLine();
            Console.WriteLine("Enter the cake id");
            int id = Convert.ToInt32(Console.ReadLine());

            _cakeService.deleteCake(id);
        }

        private void getAllCakesDetails()
        {
            _cakeService.getAllCakes();
        }
        
        private void getAllCakeSalesDetails(string sortOrder)
        {
            _cakeService.getAllCakeSales(sortOrder);
        }

        public void Run()
        {
            while (true)
            {
                ShowMenu();

                string choice = Console.ReadLine();

                switch (choice)
                {
                    case "1":
                        addCakeDetails();
                        break;
                    case "2":
                        updatCakeDetails();
                        break;
                    case "3":
                        removeCakeDetails();
                        break;
                    case "4":
                        getAllCakesDetails();
                        break;
                    case "5":
                        addCakeSaleDetails();
                        break;
                    case "6":
                        getAllCakeSalesDetails("6");
                        break;
                    case "7":
                        getAllCakeSalesDetails("7");
                        break;
                    default:
                        Console.WriteLine();
                        Console.WriteLine("Invalid choice.");
                        break;
                }
            }
        }
    }
}