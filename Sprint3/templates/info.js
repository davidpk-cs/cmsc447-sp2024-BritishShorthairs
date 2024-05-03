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
Tracking_Unit=         {Steel: 10,     Circuit: 2,         Battery: 1          } //Steel: 14   Copper: 21
Engine_Recipe=         {Steel: 20,     Motor: 2                                } //Steel: 50   Copper: 48
Gunnery_Weapon_Recipe= {Steel: 10,     Circuit: 1                              } //Steel: 11   Copper: 6
Sniper_Weapon_Recipe=  {Steel: 10,     Tracking_Unit: 1                        } //Steel: 24   Copper: 21
Cannon_Weapon_Recipe=  {Steel: 20,     Motor: 2,           Circuit: 1          } //Steel: 51   Copper: 54
Laser_Weapon_Recipe=   {Battery: 5,    Steel: 5,           Laser_Optics: 1     } //Steel: 19   Copper: 73

// Finished Products
Gunnery_Ship_Recipe=   {Engine: 1,     Plating: 15,        Gunnery_Weapon: 1   } //Steel: 121  Copper: 54
Sniper_Ship_Recipe=    {Engine: 1,     Plating: 10,        Sniper: 1           } //Steel: 114  Copper: 63
Cannon_Ship_Recipe=    {Engine: 1,     Plating: 20,        Cannon_Weapon: 1    } //Steel: 181  Copper: 102
Laser_Ship_Recipe=     {Engine: 1,     Plating: 10,        Laser_Weapon: 1     } //Steel: 109  Copper: 121

Resources = [Steel, Copper, Plating_Recipe, Wire_Recipe, Battery_Recipe, Motor_Recipe, Circuit_Recipe, Laser_Optics_Recipe, 
             Engine_Recipe, Gunnery_Weapon_Recipe, Cannon_Weapon_Recipe, Laser_Weapon_Recipe]

Recipes = [Plating_Recipe, Wire_Recipe, Battery_Recipe, Motor_Recipe, Circuit_Recipe, Laser_Optics_Recipe, Engine_Recipe, 
           Gunnery_Weapon_Recipe, Cannon_Weapon_Recipe, Laser_Weapon_Recipe, Gunnery_Ship_Recipe, Cannon_Ship_Recipe, Laser_Ship_Recipe]

all_items = [Steel, Copper, Plating_Recipe, Wire_Recipe, Battery_Recipe, Motor_Recipe, Circuit_Recipe, Laser_Optics_Recipe, Engine_Recipe, 
           Gunnery_Weapon_Recipe, Cannon_Weapon_Recipe, Laser_Weapon_Recipe, Gunnery_Ship_Recipe, Cannon_Ship_Recipe, Laser_Ship_Recipe]


images_links = {
    "Steel":            "{{ url_for('static', filename='/Assets/materials/steel.png') }}",
    "Copper":           "{{ url_for('static', filename='/Assets/materials/copper.png') }}",
    "Plating":          "{{ url_for('static', filename='/Assets/materials/plating.png') }}",
    "Wire":             "{{ url_for('static', filename='/Assets/materials/wire.png') }}",
    "Battery":          "{{ url_for('static', filename='/Assets/materials/battery.png') }}",
    "Motor":            "{{ url_for('static', filename='/Assets/materials/motor.png') }}",
    "Circuit":          "{{ url_for('static', filename='/Assets/materials/circuit.png') }}",
    "Laser Optics":     "{{ url_for('static', filename='/Assets/materials/laser_optics.png') }}",
    "Tracking Unit":    "{{ url_for('static', filename='/Assets/materials/tracking_unit.png') }}",
    "Engine":           "{{ url_for('static', filename='/Assets/materials/engine.png') }}",
    "Gunnery Weapon":   "{{ url_for('static', filename='/Assets/materials/gunnery_weapon.png') }}",
    "Sniper Weapon":    "{{ url_for('static', filename='/Assets/materials/sniper_weapon.png') }}",
    "Cannon Weapon":    "{{ url_for('static', filename='/Assets/materials/cannon_weapon.png') }}",
    "Laser Weapon":     "{{ url_for('static', filename='/Assets/materials/laser_weapon.png') }}",
    "Gunnery Ship":     "{{ url_for('static', filename='/Assets/materials/gunnery_ship.png') }}",
    "Sniper Ship":      "{{ url_for('static', filename='/Assets/materials/sniper_ship.png') }}",
    "Cannon Ship":      "{{ url_for('static', filename='/Assets/materials/cannon_ship.png') }}",
    "Laser Ship":       "{{ url_for('static', filename='/Assets/materials/laser_ship.png') }}",
}

const loadedImages = {};
for (const key in images_links) {
  console.log(key);
  const img = new Image();
  img.onload = () => {
    loadedImages[key] = img;
  };
  img.src = images_links[key];
}

Recipe_dict = {
    "Plating": Plating_Recipe,
    "Wire": Wire_Recipe,
    "Battery": Battery_Recipe,
    "Motor": Motor_Recipe,
    "Circuit": Circuit_Recipe,
    "Laser Optics": Laser_Optics_Recipe,
    "Tracking Unit": Tracking_Unit,
    "Engine": Engine_Recipe,
    "Gunnery Weapon": Gunnery_Weapon_Recipe,
    "Sniper Weapon": Sniper_Weapon_Recipe,
    "Cannon Weapon": Cannon_Weapon_Recipe,
    "Laser Weapon": Laser_Weapon_Recipe,
    "Gunnery Ship": Gunnery_Ship_Recipe,
    "Sniper Ship": Sniper_Ship_Recipe,
    "Cannon Ship": Cannon_Ship_Recipe,
    "Laser Ship": Laser_Ship_Recipe
};

steel_base_price = 3;
copper_base_price = 4;
resource_price = {
    "Steel":            steel_base_price,
    "Copper":           copper_base_price,
    "Plating":          steel_base_price * 4    + copper_base_price * 0,
    "Wire":             steel_base_price * 0    + copper_base_price * 2,
    "Battery":          steel_base_price * 2    + copper_base_price * 9,
    "Motor":            steel_base_price * 1    + copper_base_price * 6,
    "Circuit":          steel_base_price * 15   + copper_base_price * 24,
    "Laser Optics":     steel_base_price * 4    + copper_base_price * 28,
    "Tracking Unit":    steel_base_price * 14   + copper_base_price * 21,
    "Engine":           steel_base_price * 50   + copper_base_price * 48,
    "Gunnery Weapon":   steel_base_price * 11   + copper_base_price * 6,
    "Sniper Weapon":    steel_base_price * 24   + copper_base_price * 21,
    "Cannon Weapon":    steel_base_price * 51   + copper_base_price * 54,
    "Laser Weapon":     steel_base_price * 19   + copper_base_price * 73,
    "Gunnery Ship":     steel_base_price * 121  + copper_base_price * 54,
    "Sniper Ship":      steel_base_price * 114  + copper_base_price * 63,
    "Cannon Ship":      steel_base_price * 181  + copper_base_price * 102,
    "Laser Ship":       steel_base_price * 109  + copper_base_price * 121,
};

base_price = {
    "Steel": resource_price["Steel"] * 1,
    "Copper": resource_price["Copper"] * 1,
    "Plating": resource_price["Plating"] * 1.1,
    "Wire": resource_price["Wire"] * 1.1,
    "Battery": resource_price["Battery"] * 1.3,
    "Circuit": resource_price["Circuit"] * 1.3,
    "Motor": resource_price["Motor"] * 1.5,
    "Laser Optics": resource_price["Laser Optics"] * 1.8,
    "Tracking Unit": resource_price["Tracking Unit"] * 1.8,    
    "Engine": resource_price["Engine"] * 1.9,
    "Gunnery Weapon": resource_price["Gunnery Weapon"] * 2.1,
    "Sniper Weapon": resource_price["Sniper Weapon"] * 2.1,    
    "Cannon Weapon": resource_price["Cannon Weapon"] * 2.1,
    "Laser Weapon": resource_price["Laser Weapon"] * 2.1,
    "Gunnery Ship": resource_price["Gunnery Ship"] * 4,
    "Sniper Ship": resource_price["Sniper Ship"] * 4,    
    "Cannon Ship": resource_price["Cannon Ship"] * 4,
    "Laser Ship": resource_price["Laser Ship"] * 4,
};
