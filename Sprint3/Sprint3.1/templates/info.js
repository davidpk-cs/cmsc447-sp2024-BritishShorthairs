pad = {}
constructor = {}
conveyer_belt = {}
shop = {}

// RAW MATERIALS
steel = {}
copper = {}

// INTERMEDIATE RESOURCES
Plating_Recipe=        {Steel: 0                                               }
Wire_Recipe=           {Copper: 0                                              }
Battery_Recipe=        {Wire: 0,       Copper: 0                               }
Motor_Recipe =         {Steel: 0,      Circuit: 0,         Battery: 0          }
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