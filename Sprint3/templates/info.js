pad = {}
constructor = {}
conveyer_belt = {}
shop = {}

// RAW MATERIALS
Steel = {}
Copper = {}

// INTERMEDIATE RESOURCES
Plating_Recipe=        {Steel: 0                                               }
Wire_Recipe=           {Copper: 0                                              }
Battery_Recipe=        {Wire: 0,       Copper: 0                               }
Motor_Recipe=          {Steel: 0,      Circuit: 0,         Battery: 0          }
Circuit_Recipe=        {Plating: 0,    Wire: 0                                 }
Laser_Optics_Recipe=   {Copper: 0,     Battery: 0                              }
Engine_Recipe=         {Steel: 0,      Motor: 0                                }
Battery_Recipe=        {Wire: 0,       Copper: 0                               }
Gunnery_Weapon_Recipe= {Steel: 0,      Circuits: 0                             }
Cannon_Weapon_Recipe=  {Steel: 0,      Motor: 0,           Circuit: 0          }
Laser_Weapon_Recipe=   {Battery: 0,    Steel: 0,           Laser_Optics: 0     }

// Finished Products
Gunnery_Ship_Recipe=   {Engine: 0,     Plating: 0,         Gunnery_Weapon: 0   }
Cannon_Ship_Recipe=    {Engine: 0,     Plating: 0,         Cannon_Weapon: 0    }
Laser_Ship_Recipe=     {Engine: 0,     Plating: 0,         Laser_Weapon: 0     }

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