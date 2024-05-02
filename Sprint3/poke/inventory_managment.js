// Cross reload saving
if (JSON && JSON.stringify && JSON.parse) var inventory = inventory || (function() {
    // inventory storage
    
    var storage = load();
    
    function load()
    {
        var name = "storage";
        var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    
        if (result)
            return JSON.parse(result[1]);
    
        return {};
    }
    
    function Save() {
        var date = new Date();
        date.setHours(23,59,59,999);
        var expires = "expires=" + date.toGMTString();
        document.cookie = "storage="+JSON.stringify(storage)+"; "+expires;
    };

    function entry_to_pokemon(id, entry) {
        var pokemon;
        for (var i = 0; i < pokedex.length; i++) {
            if (pokedex[i].id == id) { 
                pokemon = pokedex[i];
                break;
            }
        }

        if (entry["level"]) {
            pokemon["level"] = entry["level"];
        } else {
            pokemon.level = 10;
        }
        
        return pokemon;
    }

    // page unload event
    if (window.addEventListener) window.addEventListener("unload", Save, false);
    else if (window.attachEvent) window.attachEvent("onunload", Save);
    else window.onunload = Save;
    
    // public methods
    return {
        // set a inventory variable
        add: function(pokemon) {
            storage[pokemon.id] = pokemon.level ? pokemon.level : 10;
        },
    
        // get a inventory value
        get: function(id) {
            var entry = storage[id];
            if (entry) {
                return entry_to_pokemon(id, entry);
            } else {
                return undefined;
            }
        },
    
        dump: function(name) {
            var inv = []
            for (id in storage) {
                inv.push(entry_to_pokemon(id, storage[id]));
            }
            return inv;
        },

        levelup: function(id, level) {
            storage[id] = level;
        },

        kill: function(id) {
            delete storage[id];
        },

        // clear inventory
        clear: function() { storage = {}; }
    };
    })();