export class pokemon{

	constructor(id, level){
		LEVEL_MAX = 100;
		this.id = id
		if (level < LEVEL_MAX){
			this.level = level;
		}
		else {
			this.level = LEVEL_MAX;
		}
		

		conn = sqlite3.connect('all_pokemon.db');
		cursor = conn.cursor();
		
		cursor.execute("SELECT * FROM Pokemon WHERE id = ", 'id');
		data = cursor.fetchall();

		this.maxHP = Math.floor((2 * data[3][0] * level)/100) + level + 10;
		this.hp = this.maxHP;
		this.atk = Math.floor((2 * data[3][1] * level)/100) + 5;
		this.def = Math.floor((2 * data[3][2] * level)/100) + 5;
		this.spA = Math.floor((2 * data[3][3] * level)/100) + 5;
		this.spD = Math.floor((2 * data[3][4] * level)/100) + 5;
		this.speed = Math.floor((2 * data[3][5] * level)/100) + 5;

		cursor.close();
		conn.close;
	}
	
	getMaxHP(){
		return maxHP;
	}
	
	getCurHP(){
		return hp;
	}

	setHP(num){
		hp = num;
	}
	
	getAtk(){
		return atk;
	}

	getDef(){
		return def;
	}

	getspAtk(){
		return spA;
	}

	getspDef(){
		return spD;
	}

	getSpeed(){
		return speed;
	}

	getLevel(){
		return level;
	}
	setLevel(newLevel){
		if (newLevel < LEVEL_MAX){
		 	this.level = newLevel;
		}
		
		else{
			this.level = LEVEL_MAX;
		}
	}
	
	getID(){
		return id;
	}
}

function damageCalculation(attacker, defender, special){
	if (special){
		damage = ((((((2 * attacker.getLevel() / 5 + 2) * attacker.getspAtk() * 80)/ defender.getspDef()) / 50) + 2)) / 10;
	}

	else{
		damage = ((((((2 * attacker.getLevel() / 5 + 2) * attacker.getAtk() * 80)/ defender.getDef()) / 50) + 2)) / 10;
	}
	defender.setHP(defender.getCurHP()-damage);
}