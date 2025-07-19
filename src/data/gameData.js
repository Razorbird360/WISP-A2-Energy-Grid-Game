// Energy source definitions
export const energySources = {
  coal: { 
    name: "Coal", 
    image: "./coal_plant.png", 
    cost: 30, 
    emissions: 80, 
    reliability: 95, 
    approval: -10,
    color: "bg-gray-800"
  },
  wind: { 
    name: "Wind", 
    image: "./wind_turbine.png", 
    cost: 20, 
    emissions: 5, 
    reliability: 70, 
    approval: 10,
    color: "bg-blue-500"
  },
  solar: { 
    name: "Solar", 
    image: "./solar_farm.png", 
    cost: 25, 
    emissions: 2, 
    reliability: 65, 
    approval: 15,
    color: "bg-yellow-500"
  },
  nuclear: { 
    name: "Nuclear", 
    image: "./nuclear_plant.png", 
    cost: 40, 
    emissions: 1, 
    reliability: 98, 
    approval: 5,
    color: "bg-green-600"
  },
  hydro: { 
    name: "Hydro", 
    image: "./hydro_plant.png", 
    cost: 35, 
    emissions: 3, 
    reliability: 90, 
    approval: 10,
    color: "bg-blue-600"
  },
  gas: { 
    name: "Gas", 
    image: "./gas_plant.png", 
    cost: 25, 
    emissions: 40, 
    reliability: 85, 
    approval: -5,
    color: "bg-orange-500"
  }
};

// Terrain types with their effects
export const terrainTypes = [
  { name: "City", emoji: "🏙️", modifier: { cost: 1.2, approval: 1.1 } },
  { name: "Forest", emoji: "🌲", modifier: { wind: 0.8, solar: 0.9 } },
  { name: "Hills", emoji: "🏞️", modifier: { wind: 1.3, hydro: 1.2 } },
  { name: "Wetlands", emoji: "💧", modifier: { hydro: 1.4, nuclear: 0.7 } },
  { name: "Industrial", emoji: "🏭", modifier: { cost: 0.9, approval: 0.8 } },
  { name: "Rural Town", emoji: "⛺", modifier: { approval: 1.2, cost: 0.8 } },
  { name: "High Plains", emoji: "🌬", modifier: { wind: 1.5, solar: 1.2 } },
  { name: "Desert", emoji: "🏜️", modifier: { solar: 1.4, hydro: 0.3 } },
  { name: "Mountains", emoji: "🏔", modifier: { hydro: 1.6, wind: 1.2 } },
  { name: "River Delta", emoji: "🐟", modifier: { hydro: 1.5, nuclear: 0.8 } },
  { name: "Volcanic", emoji: "🌋", modifier: { nuclear: 0.5 } },
  { name: "Suburbs", emoji: "🧱", modifier: { approval: 0.9, cost: 1.1 } },
  { name: "Camping Area", emoji: "🏕", modifier: { approval: 1.1, emissions: 0.9 } },
  { name: "Quarry", emoji: "🚧", modifier: { cost: 0.7, approval: 0.7 } },
  { name: "Tundra", emoji: "🧊", modifier: { wind: 1.1, solar: 0.6 } },
  { name: "Offshore", emoji: "🌊", modifier: { wind: 1.6, cost: 1.4 } },
  { name: "Beachfront", emoji: "🏖", modifier: { wind: 1.3, approval: 0.8 } },
  { name: "Lab Zone", emoji: "🧪", modifier: { nuclear: 1.3, cost: 1.2 } },
  { name: "Abandoned", emoji: "🏕", modifier: { cost: 0.6, approval: 1.0 } },
  { name: "Slum", emoji: "🏚", modifier: { approval: 0.6, cost: 0.5 } },
  { name: "Sacred Land", emoji: "⛪", modifier: { approval: 0.5, emissions: 0.8 } },
  { name: "Farmland", emoji: "🚜", modifier: { approval: 1.1, wind: 1.1 } },
  { name: "National Park", emoji: "🏞", modifier: { approval: 0.3, emissions: 0.7 } },
  { name: "Construction", emoji: "🏗", modifier: { cost: 0.8, reliability: 0.9 } },
  { name: "Cleared Plot", emoji: "🧹", modifier: { cost: 1.0, approval: 1.0 } }
];

// Random events
export const events = [
  {
    name: "Storm Damage",
    description: "A severe storm has damaged wind farms across the region!",
    effect: { wind: { reliability: -20 } },
    probability: 0.3
  },
  {
    name: "Solar Subsidy",
    description: "Government announces new solar subsidies!",
    effect: { solar: { cost: -10 } },
    probability: 0.2
  },
  {
    name: "Nuclear Scandal",
    description: "A safety scandal affects nuclear plant public approval ratings.",
    effect: { nuclear: { approval: -15 } },
    probability: 0.15
  },
  {
    name: "Energy Crisis",
    description: "Rising energy demand puts pressure on the grid!",
    effect: { demand: 1.2 },
    probability: 0.25
  }
];

// Social media comments
export const socialComments = [
  "More solar = more jobs in my town! 🌞",
  "No electricity AGAIN? Ugh… 😤",
  "Wind farms are killing birds 😡",
  "Nuclear is too dangerous for our kids!",
  "Coal is destroying our air quality!",
  "Love seeing more clean energy! 💚",
  "My electric bill is through the roof!",
  "When will we get reliable power?",
  "Solar panels on every roof! ☀️",
  "Hydro dams are ruining our rivers!"
];
