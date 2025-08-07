import React, { useState } from "react";
import Header from "./components/Header.jsx";
import EnergySources from "./components/EnergySources.jsx";
import CitizenFeed from "./components/CitizenFeed.jsx";
import EnergyPlacementGrid from "./components/EnergyPlacementGrid.jsx";
import NextYearButton from "./components/NextYearButton.jsx";
import EventModal from "./components/EventModal.jsx";
import EndGameScreen from "./components/EndGameScreen.jsx";
import { energySources, terrainTypes, events, socialComments } from "./data/gameData.js";
import { toast } from "./utils/toastify.js";

function App() {
  const [gameState, setGameState] = useState({
    budget: 100,
    year: 1,
    maxYears: 5,
    emissions: 0,
    approval: 50,
    energyProduction: 0,
    demand: 100,
    gameOver: false
  });

  const [grid, setGrid] = useState(function() {
    const newGrid = [];
    for (let i = 0; i < 25; i++) {
      newGrid.push({
        id: i,
        terrain: terrainTypes[i],
        energySource: null,
        row: Math.floor(i / 5),
        col: i % 5
      });
    }
    return newGrid;
  });

  const [draggedEnergy, setDraggedEnergy] = useState(null); // For mobile tap-to-select
  const [currentEvent, setCurrentEvent] = useState(null);
  const [socialFeed, setSocialFeed] = useState([]);
  const [showEndGame, setShowEndGame] = useState(false);

  // Detect if user is on a touch device
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function calculateStats() {
    const placedSources = grid.filter(function(cell) {
      return cell.energySource !== null;
    });
    
    const totalEmissions = placedSources.reduce(function(sum, cell) {
      const source = energySources[cell.energySource];
      if (!source) return sum;
      const terrain = cell.terrain;
      const modifier = terrain.modifier.emissions || 1;
      return sum + (source.emissions * modifier);
    }, 0);

    const totalEnergyProduction = placedSources.reduce(function(sum, cell) {
      const source = energySources[cell.energySource];
      if (!source) return sum;
      const terrain = cell.terrain;
      const modifier = terrain.modifier[cell.energySource] || 1;
      return sum + (source.energyProduction * modifier);
    }, 0);

    const approvalChange = placedSources.reduce(function(sum, cell) {
      const source = energySources[cell.energySource];
      if (!source) return sum;
      const terrain = cell.terrain;
      const modifier = terrain.modifier.approval || 1;
      return sum + (source.approval * modifier);
    }, 0);

    return {
      emissions: totalEmissions,
      energyProduction: totalEnergyProduction,
      approvalChange: approvalChange,
      energyProduced: placedSources.length * 20
    };
  }

  function handleDragStart(e, energyType) {
    setDraggedEnergy(energyType);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
  }

  function handleDrop(e, cellIndex) {
    e.preventDefault();
    const energyToPlace = draggedEnergy;
    if (!energyToPlace) return;

    const cell = grid[cellIndex];
    const source = energySources[energyToPlace];
    
    const terrain = cell.terrain;
    const costModifier = terrain.modifier.cost || 1;
    const actualCost = Math.round(source.cost * costModifier);
    
    //calculate refund for existing energy source if there is one
    let refundAmount = 0;
    if (cell.energySource) {
      const existingSource = energySources[cell.energySource];
      refundAmount = Math.round(existingSource.cost * costModifier);
    }
    
    const netCost = actualCost - refundAmount;
    
    if (gameState.budget < netCost) {
      const message = cell.energySource 
        ? `Not enough budget! Replacing costs ${netCost} (new: ${actualCost}, refund: ${refundAmount})`
        : `Not enough budget! This energy source costs ${actualCost} on this terrain (base cost: ${source.cost}, terrain modifier: ${costModifier}x)`;
      toast(message);
      setDraggedEnergy(null);
      return;
    }

    const newGrid = [];
    for (let i = 0; i < grid.length; i++) {
      if (i === cellIndex) {
        newGrid.push({
          id: grid[i].id,
          terrain: grid[i].terrain,
          energySource: energyToPlace,
          row: grid[i].row,
          col: grid[i].col
        });
      } else {
        newGrid.push(grid[i]);
      }
    }
    setGrid(newGrid);

    setGameState(function(prev) {
      return {
        budget: prev.budget - netCost,
        year: prev.year,
        maxYears: prev.maxYears,
        emissions: prev.emissions,
        approval: prev.approval,
        energyProduction: prev.energyProduction,
        demand: prev.demand,
        gameOver: prev.gameOver
      };
    });

    // Show success message
    const sourceDisplayName = source.name;
    if (cell.energySource) {
      toast(`${sourceDisplayName} successfully replaced! Net cost: $${netCost}M`);
    } else {
      toast(`${sourceDisplayName} successfully placed! Cost: $${actualCost}M`);
    }

    setDraggedEnergy(null);
  }

  function removeFromCell(cellIndex) {
    
    const cell = grid[cellIndex];
    if (!cell.energySource) {
      return;
    }

    // Calculate refund amount with terrain modifier
    const source = energySources[cell.energySource];
    const terrain = cell.terrain;
    const costModifier = terrain.modifier.cost || 1;
    const refundAmount = Math.round(source.cost * costModifier);

    const newGrid = [];
    for (let i = 0; i < grid.length; i++) {
      if (i === cellIndex) {
        newGrid.push({
          id: grid[i].id,
          terrain: grid[i].terrain,
          energySource: null,
          row: grid[i].row,
          col: grid[i].col
        });
      } else {
        newGrid.push(grid[i]);
      }
    }
    setGrid(newGrid);

    // Refund the cost to the budget
    setGameState(function(prev) {
      return {
        budget: prev.budget + refundAmount,
        year: prev.year,
        maxYears: prev.maxYears,
        emissions: prev.emissions,
        approval: prev.approval,
        energyProduction: prev.energyProduction,
        demand: prev.demand,
        gameOver: prev.gameOver
      };
    });

    // Show success message for removal
    toast(`${source.name} removed! Refunded: $${refundAmount}M`);

  }

  function nextYear() {
    const stats = calculateStats();
    
    // always trigger exactly one event, weighted by probability
    const totalProb = events.reduce((sum, e) => sum + e.probability, 0);
    let r = Math.random() * totalProb;
    let randomEvent;
    let cum = 0;
    for (const e of events) {
      cum += e.probability;
      if (r <= cum) { randomEvent = e; break; }
    }
    setCurrentEvent(randomEvent);
    const eventEffect = randomEvent.effect;

    const newComment = socialComments[Math.floor(Math.random() * socialComments.length)];
    const newFeed = [newComment];
    for (let i = 0; i < Math.min(4, socialFeed.length); i++) {
      newFeed.push(socialFeed[i]);
    }
    setSocialFeed(newFeed);

    setGameState(function(prev) {
      // apply event effects: cost, approval, energyProduction, demand
      let budgetDelta = 0;
      let approvalDelta = 0;
      let energyProductionDelta = 0;
      // handle flat and nested effect values
      Object.entries(eventEffect).forEach(([key, val]) => {
        if (typeof val === 'object' && val !== null) {
          if (val.cost) budgetDelta += val.cost;
          if (val.approval) approvalDelta += val.approval;
          if (val.energyProduction) energyProductionDelta += val.energyProduction;
        } else {
          if (key === 'cost') budgetDelta += val;
          if (key === 'approval') approvalDelta += val;
          if (key === 'energyProduction') energyProductionDelta += val;
        }
      });
      const newYear = prev.year + 1;
      const newBudget = prev.budget + budgetDelta;
      const baseApproval = prev.approval + stats.approvalChange + approvalDelta;
      const newApproval = Math.max(0, Math.min(100, baseApproval));
      const newEnergyProduction = prev.energyProduction + stats.energyProduction + energyProductionDelta;
      const newEmissions = prev.emissions + stats.emissions;
      // demand is unused in current game logic
      const newDemand = prev.demand;
      return {
        budget: newBudget,
        year: newYear,
        maxYears: prev.maxYears,
        emissions: newEmissions,
        approval: newApproval,
        energyProduction: Math.max(0, newEnergyProduction),
        demand: newDemand,
        gameOver: newYear > prev.maxYears
      };
    });

    if (gameState.year >= gameState.maxYears) {
      setShowEndGame(true);
    } else {
      toast(`Welcome to Year ${gameState.year + 1}! Keep building your energy grid.`);
    }
  }

  function getBadges() {
    const badges = [];
    // Emissions badges (lower is better)
    if (gameState.emissions < 200) badges.push("🌱 Eco Leader");
    else if (gameState.emissions < 400) badges.push("🌿 Green Advocate");
    
    // Energy production badges (higher is better)
    if (gameState.energyProduction >= 1000) badges.push("⚡ Energy Master");
    else if (gameState.energyProduction >= 600) badges.push("� Power Producer");
    
    // Public approval badges
    if (gameState.approval >= 80) badges.push("👑 Public Hero");
    else if (gameState.approval >= 60) badges.push("� Rising Support");
    
    // Budget badges
    if (gameState.budget > 20) badges.push("💰 Budget Genius");
    else if (gameState.budget > 0) badges.push("💵 Budget Survivor");
    
    return badges;
  }

  // Reset game
  function resetGame() {
    setGameState({
      budget: 100,
      year: 1,
      maxYears: 5,
      emissions: 0,
      approval: 50,
      energyProduction: 0,
      demand: 100,
      gameOver: false
    });
    
    const newGrid = [];
    for (let i = 0; i < 25; i++) {
      newGrid.push({
        id: i,
        terrain: terrainTypes[i],
        energySource: null,
        row: Math.floor(i / 5),
        col: i % 5
      });
    }
    setGrid(newGrid);
    
    setShowEndGame(false);
    setSocialFeed([]);
    setCurrentEvent(null);
    setDraggedEnergy(null);
  }

  const stats = calculateStats();

  if (showEndGame) {
    return (
      <EndGameScreen 
        gameState={gameState}
        getBadges={getBadges}
        resetGame={resetGame}
      />
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-4"
      onClick={function() { 
        setDraggedEnergy(null); 
      }}
    >
      <div className="max-w-7xl mx-auto">
        <Header gameState={gameState} stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <EnergySources 
              energySources={energySources}
              handleDragStart={handleDragStart}
              isTouchDevice={isTouchDevice}
            />
            <CitizenFeed socialFeed={socialFeed} />
          </div>

          <div className="lg:col-span-3">
            <EnergyPlacementGrid 
              grid={grid}
              energySources={energySources}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              removeFromCell={removeFromCell}
            />
            <NextYearButton 
              nextYear={nextYear}
              gameState={gameState}
            />
          </div>
        </div>

        <EventModal 
          currentEvent={currentEvent}
          setCurrentEvent={setCurrentEvent}
        />
      </div>
    </div>
  );
}

export default App;
