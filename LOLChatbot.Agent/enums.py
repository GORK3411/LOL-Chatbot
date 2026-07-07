from enum import Enum


class AbilityField(str, Enum):
    name = "name"
    icon = "icon"
    effects = "effects"
    cost = "cost"
    cooldown = "cooldown"
    targeting = "targeting"
    affects = "affects"
    spellshieldable = "spellshieldable"
    resource = "resource"
    damageType = "damageType"
    spellEffects = "spellEffects"
    projectile = "projectile"
    onHitEffects = "onHitEffects"
    occurrence = "occurrence"
    notes = "notes"
    blurb = "blurb"
    missileSpeed = "missileSpeed"
    rechargeRate = "rechargeRate"
    collisionRadius = "collisionRadius"
    tetherRadius = "tetherRadius"
    onTargetCdStatic = "onTargetCdStatic"
    innerRadius = "innerRadius"
    speed = "speed"
    width = "width"
    angle = "angle"
    castTime = "castTime"
    effectRadius = "effectRadius"
    targetRange = "targetRange"


class Targeting(str, Enum):
    PASSIVE = "Passive"
    UNIT = "Unit"
    DIRECTION = "Direction"
    AUTO = "Auto"
    LOCATION = "Location"
    VECTOR = "Vector"
    VARIED = "Varied"
    NA = "N/A"


class Affects(str, Enum):
    SELF = "Self"
    ENEMIES = "Enemies"
    ALLIES = "Allies"
    MONSTERS = "Monsters"
    NONE = "None"


class DamageType(str, Enum):
    MAGIC_DAMAGE = "MAGIC_DAMAGE"
    PHYSICAL_DAMAGE = "PHYSICAL_DAMAGE"
    TRUE_DAMAGE = "TRUE_DAMAGE"
    MIXED_DAMAGE = "MIXED_DAMAGE"
    OTHER_DAMAGE = "OTHER_DAMAGE"


class Resource(str, Enum):
    MANA = "MANA"
    ENERGY = "ENERGY"
    HEALTH = "HEALTH"
    CURRENT_HEALTH = "CURRENT_HEALTH"
    MAXIMUM_HEALTH = "MAXIMUM_HEALTH"
    FURY = "FURY"
    GRIT = "GRIT"
    CHARGE = "CHARGE"
    MANA_PER_SECOND = "MANA_PER_SECOND"
    OTHER = "OTHER"


class InfoField(str, Enum):
    positions = "positions"
    roles = "roles"
    adaptiveType = "adaptiveType"
    resource = "resource"
    lore = "lore"
    attributeRatings = "attributeRatings"
    key = "key"
    id = "id"
    title = "title"


class StatName(str, Enum):
    health = "health"
    mana = "mana"
    armor = "armor"
    magicResistance = "magicResistance"
    attackDamage = "attackDamage"
    attackSpeed = "attackSpeed"
    movespeed = "movespeed"
    attackRange = "attackRange"
    healthRegen = "healthRegen"
    manaRegen = "manaRegen"
    criticalStrikeDamage = "criticalStrikeDamage"
    criticalStrikeDamageModifier = "criticalStrikeDamageModifier"


class AttributeRating(str, Enum):
    damage = "damage"
    toughness = "toughness"
    control = "control"
    mobility = "mobility"
    utility = "utility"
    difficulty = "difficulty"
    abilityReliance = "abilityReliance"


class Role(str, Enum):
    FIGHTER = "FIGHTER"
    TANK = "TANK"
    MAGE = "MAGE"
    ASSASSIN = "ASSASSIN"
    SUPPORT = "SUPPORT"
    MARKSMAN = "MARKSMAN"
    DIVER = "DIVER"
    ENCHANTER = "ENCHANTER"
    BURST = "BURST"
    POKE = "POKE"
    WARDEN = "WARDEN"
    SKIRMISHER = "SKIRMISHER"
    SPECIALIST = "SPECIALIST"
    CATCHER = "CATCHER"


class Position(str, Enum):
    TOP = "TOP"
    JUNGLE = "JUNGLE"
    MID = "MID"
    BOTTOM = "BOTTOM"
    SUPPORT = "SUPPORT"
