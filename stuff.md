targeting : enum
affects: enum
spellshieldable: bool
ressource: enum
damageType : enum
projectile: bool
rechargeRate : int [] of variable length
the rest is ints (unless the values are written here)

notes:

- speed can be fixed or be a ratio (example irelia Q)
- all values are strings, even if they are numbers or booleans, when seeding fix that issue

Champion Slot Ability Speed

---

Aatrox E Umbral Dash 800 / Up to 1340  
Ahri Q Orb of Deception 1550 / 60 - 2600  
Ahri W Fox-Fire 75.92Â° per second / 1400  
Ahri R Spirit Rush 1200 + 100% movement speed / 1400  
Akali E Shuriken Flip 1800 / 1500  
Akali R Perfect Execution 1500 / 3000  
Akshan P Dirty Fighting 2000 / 5000  
Akshan Q Avengerang 1500 / 2400  
Akshan E Heroic Swing 2500 / 1200 / 3000  
Alistar W Headbutt 1200 / 1544 / âˆž  
Ambessa P Drakehound's Step 770 / 830 / 890 / 950 (based on level) + 100% movement speed  
Amumu Q Bandage Toss 2000 / 1800  
Aphelios P Crescendum 600 (+ 75 per 10% bonus attack speed)  
Ashe R Enchanted Crystal Arrow 1500 - 2100  
Aurelion Sol W Astral Flight 335 + 100% movement speed / 167.5 + 50% movement speed  
Aurora Q Twofold Hex 1600 / 2000  
Aurora E The Weirding 150 + 200% movement speed  
Azir R Emperor's Divide 1000 / 1400  
Bard E Magical Journey 900 / 1197  
Bel'Veth Q Void Surge 800 / 850 / 900 / 950 / 1000 + 100% movement speed  
Blitzcrank Q Rocket Grab 1800 / 1800  
Brand R Pyroclasm 750 - 3000  
Briar E Chilling Scream 1900 / 1800  
Briar R Certain Death 2000 / 2500 - 5000  
Camille E Wall Dive 1050 + 100% movement speed  
Corki W Valkyrie 650 + 100% movement speed  
Diana Q Crescent Strike 1900 / 2100  
Ekko Q Timewinder 1650 / 200 / 2300  
Fiora Q Lunge See notes  
Galio Q Winds of War 1400 / 50  
Gnar Q Boomerang Throw 2500 - 1400 / 60 - 2600  
Graves P New Destiny 3800 / 3000 / 3400  
Irelia Q Bladesurge 1400 + 100% movement speed  
Janna Q Howling Gale 880 : 1408 (based on seconds charged)  
Jarvan IV R Cataclysm Varies  
Jayce Q Shock Blast 1450 / 2350  
Jhin Q Dancing Grenade 1800 / 600  
Jinx R Super Mega Death Rocket! 1700 / 2200  
Kindred Q Dance of Arrows 500 + 100% movement speed  
Kled Q Pocket Pistol 3000 / 1025  
Kled R Chaaaaaaaarge!!! 1000 / 600  
K'Sante W Path Maker 1300 / 1500 / 1800  
K'Sante E Footwork (500 / 1250 / 1100 / 1400) + 100% movement speed  
Lee Sin Q Resonating Strike 1350 + 100% movement speed  
Lee Sin W Safeguard 1350 + 100% movement speed  
Lillia E Swirlseed 5000 / 1400  
Lissandra E Glacial Path 1200 / 640  
Lulu P Pix, Faerie Companion 900 - 2600  
Malphite R Unstoppable Force 1500 + 100% movement speed  
Maokai R Nature's Grasp 100 / 400 / 700 / 750 (based on seconds active)  
Nautilus R Depth Charge 275 + 466.67 per second  
Neeko E Tangle-Barbs 1300 / 1500  
Nunu & Willump W Biggest Snowball Ever! 400 / 410-569 / 570  
Ornn R Call of the Forge God 450 / 1250  
Qiyana Q Elemental Wrath 1600 / 2000  
Qiyana W Terrashape 440 + 100% movement speed  
Qiyana E Audacity 600 + 100% movement speed  
Qiyana R Supreme Display of Talent 2000 / 2840  
Quinn E Vault 2500 / 850  
Rakan E Battle Dance 1250 + 80% movement speed  
Rammus R Soaring Slam 900 / 2000  
Rek'Sai E Tunnel 500 + 100% movement speed  
Renata Glasc R Hostile Takeover 650 - 1000  
Renekton E Slice 760 + 100% movement speed  
Ryze E Spell Flux 4000 / 1500  
Shen Q Twilight Assault 2000 - 5000  
Shen E Shadow Dash 800 + 100% movement speed  
Shyvana E Flame Breath 1600 / 1575  
Sivir Q Boomerang Blade 1450 / 1200  
Sivir W Ricochet 1750 / 1000  
Smolder Q Super Scorcher Breath 1800 / 900  
Smolder W Achooo! 2000 / 400  
Swain E Nevermove 1125 : 1800 (based on seconds) / 2000 : 2800 (based on seconds)
Sylas E Abduct 2500 - 400 / 1800  
Syndra E Scatter the Weak 2500 / 2000  
Taliyah Q Threaded Volley 3600 - 1800 / 2000  
Taliyah R Weaver's Wall 1500 / 1200  
Talon W Rake 2571 / 2429 / 3000  
Talon E Assassin's Path 100% movement speed  
Talon R Shadow Assault 2400 / 4000  
Thresh Q Death Sentence 1900 / 1400  
Tristana R Buster Shot 2000 / 1500  
Udyr R Wingborne Storm 109.5 : 250 (based on level)  
Urgot E Disdain 1200 + 100% movement speed  
Vayne Q Tumble 500 + total movement speed  
Vayne E Condemn 2200 / 2000  
Vel'Koz Q Plasma Fission 1300 / 2100  
Vex Q Mistral Bolt 600 / 3200  
Vex R Shadow Surge 1600 / 2200  
Vi Q Vault Breaker 1450 : 1540 (based on channel time)  
Viego W Spectral Maw 1000 / 1300  
Viego E Harrowed Path 1600 / 1200  
Viktor E Hextech Ray 1050 / 1500  
Viktor R Arcane Storm 200 : 300 / 250 : 375  
Yasuo E Sweeping Blade 750 + 60% movement speed  
Yuumi Q Prowling Projectile 1950 / 850 / 1650  
Yuumi W You and Me! 1200 / 1300 / 1400 / 1500 / 1600  
Zeri P Living Battery N/A  
Zeri Q Burst Fire 2600 / 3400  
Zeri E Spark Surge 600 + 100% movement speed  
Ziggs Q Bouncing Bomb 1700 / Fixed time  
Zoe Q Paddle Star 1200 / 2500

Champion Slot Ability onTargetCdStatic

---

Braum P Concussive Blows 8 / 6 / 4 (based on level)  
Ekko P Z-Drive Resonance 5  
Jarvan IV P Martial Cadence 6 / 5 / 4 / 3 (based on level)
Kalista W Sentinel 10  
Kindred P Mark of the Kindred 240  
Nautilus P Staggering Blow 6  
Nunu & Willump P Call of the Freljord 10  
Qiyana P Royal Privilege 25  
Rek'Sai W Unburrow 10  
Samira P Daredevil Impulse 10  
Senna P Absolution 6 / 5 / 4 (based on level)  
Singed P Noxious Slipstream 8  
Udyr E Blazing Stampede 6 / 5.6 / 5.2 / 4.8 / 4.4 / 4
Yasuo E Sweeping Blade 10 / 9 / 8 / 7 / 6  
Zed P Contempt for the Weak 10
