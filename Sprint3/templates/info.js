pad = {}
constructor = {}
conveyer_belt = {}
shop = {}

// RAW MATERIALS
Steel = {}
Copper = {}

// INTERMEDIATE RESOURCES
Plating_Recipe=        {Steel: 4                                               } //Steel: 4    Copper: 0
Wire_Recipe=           {Copper: 2                                              } //Steel: 0    Copper: 2
Battery_Recipe=        {Wire: 3,       Copper: 3                               } //Steel: 2    Copper: 9
Circuit_Recipe=        {Plating: 1,    Wire: 3                                 } //Steel: 1    Copper: 6
Motor_Recipe=          {Steel: 10,     Circuit: 1,         Battery: 4          } //Steel: 15   Copper: 24
Laser_Optics_Recipe=   {Copper: 10,    Battery: 2                              } //Steel: 4    Copper: 28
Engine_Recipe=         {Steel: 20,     Motor: 2                                } //Steel: 50   Copper: 48
Gunnery_Weapon_Recipe= {Steel: 10,     Circuits: 1                             } //Steel: 11   Copper: 6
Cannon_Weapon_Recipe=  {Steel: 20,     Motor: 2,           Circuit: 1          } //Steel: 51   Copper: 54
Laser_Weapon_Recipe=   {Battery: 5,    Steel: 5,           Laser_Optics: 1     } //Steel: 19   Copper: 73

// Finished Products
Gunnery_Ship_Recipe=   {Engine: 1,     Plating: 15,        Gunnery_Weapon: 1   } //Steel: 121  Copper: 54
Cannon_Ship_Recipe=    {Engine: 1,     Plating: 20,        Cannon_Weapon: 1    } //Steel: 181  Copper: 102
Laser_Ship_Recipe=     {Engine: 1,     Plating: 10,        Laser_Weapon: 1     } //Steel: 109  Copper: 121

Resources = [Steel, Copper, Plating_Recipe, Wire_Recipe, Battery_Recipe, Motor_Recipe, Circuit_Recipe, Laser_Optics_Recipe, 
             Engine_Recipe, Gunnery_Weapon_Recipe, Cannon_Weapon_Recipe, Laser_Weapon_Recipe]

Recipes = [Plating_Recipe, Wire_Recipe, Battery_Recipe, Motor_Recipe, Circuit_Recipe, Laser_Optics_Recipe, Engine_Recipe, 
           Gunnery_Weapon_Recipe, Cannon_Weapon_Recipe, Laser_Weapon_Recipe, Gunnery_Ship_Recipe, Cannon_Ship_Recipe, Laser_Ship_Recipe]

Recipe_dict = {
    "Plating": Plating_Recipe,
    "Wire": Wire_Recipe,
    "Battery": Battery_Recipe,
    "Motor": Motor_Recipe,
    "Circuit": Circuit_Recipe,
    "Laser Optics": Laser_Optics_Recipe,
    "Engine": Engine_Recipe,
    "Gunnery Weapon": Gunnery_Weapon_Recipe,
    "Cannon Weapon": Cannon_Weapon_Recipe,
    "Laser Weapon": Laser_Weapon_Recipe,
    "Gunnery Ship": Gunnery_Ship_Recipe,
    "Cannon Ship": Cannon_Ship_Recipe,
    "Laser Ship": Laser_Ship_Recipe
};
