using week_1_cs_alexivan0.Service;
using week_1_cs_alexivan0.UserInterface;


CakeService cakeService = new CakeService();
MyConsole myConsole = new MyConsole(cakeService);


myConsole.Run();
