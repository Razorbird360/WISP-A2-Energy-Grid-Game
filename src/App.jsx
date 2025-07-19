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
    reliability: 100,
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

  const [draggedEnergy, setDraggedEnergy] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [socialFeed, setSocialFeed] = useState([]);
  const [showEndGame, setShowEndGame] = useState(false);

  function calculateStats() {
    const placedSources = grid.filter(function(cell) {
      return cell.energySource !== null;
    });
    
    const totalEmissions = placedSources.reduce(function(sum, cell) {
      const source = energySources[cell.energySource];
      const terrain = cell.terrain;
      const modifier = terrain.modifier.emissions || 1;
      return sum + (source.emissions * modifier);
    }, 0);

    const totalReliability = placedSources.reduce(function(sum, cell) {
      const source = energySources[cell.energySource];
      const terrain = cell.terrain;
      const modifier = terrain.modifier[cell.energySource] || 1;
      return sum + (source.reliability * modifier);
    }, 0);

    const approvalChange = placedSources.reduce(function(sum, cell) {
      const source = energySources[cell.energySource];
      const terrain = cell.terrain;
      const modifier = terrain.modifier.approval || 1;
      return sum + (source.approval * modifier);
    }, 0);

    return {
      emissions: totalEmissions,
      reliability: Math.min(100, totalReliability / placedSources.length || 0),
      approvalChange: approvalChange,
      energyProduced: placedSources.length * 20
    };
  }

  function handleDragStart(e, energyType) {
    setDraggedEnergy(energyType);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e, cellIndex) {
    e.preventDefault();
    if (!draggedEnergy) return;

    const cell = grid[cellIndex];
    const source = energySources[draggedEnergy];
    
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
          energySource: draggedEnergy,
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
        reliability: prev.reliability,
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
        reliability: prev.reliability,
        demand: prev.demand,
        gameOver: prev.gameOver
      };
    });

    // Show success message for removal
    toast(`${source.name} removed! Refunded: $${refundAmount}M`);

  }

  function nextYear() {
    const stats = calculateStats();
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    if (Math.random() < randomEvent.probability) {
      setCurrentEvent(randomEvent);
    }

    const newComment = socialComments[Math.floor(Math.random() * socialComments.length)];
    const newFeed = [newComment];
    for (let i = 0; i < Math.min(4, socialFeed.length); i++) {
      newFeed.push(socialFeed[i]);
    }
    setSocialFeed(newFeed);

    setGameState(function(prev) {
      const newApproval = Math.max(0, Math.min(100, prev.approval + stats.approvalChange));
      const newYear = prev.year + 1;
      
      return {
        budget: prev.budget,
        year: newYear,
        maxYears: prev.maxYears,
        emissions: stats.emissions,
        approval: newApproval,
        reliability: stats.reliability,
        demand: prev.demand,
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
    if (gameState.emissions < 50) badges.push("🌱 Eco Leader");
    if (gameState.approval >= 80) badges.push("👑 Public Hero");
    if (gameState.reliability >= 90) badges.push("⚡ Grid Master");
    if (gameState.budget > 20) badges.push("💰 Budget Genius");
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
      reliability: 100,
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
      onClick={function() { setDraggedEnergy(null); }}
    >
      <div className="max-w-7xl mx-auto">
        <Header gameState={gameState} stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <EnergySources 
              energySources={energySources}
              handleDragStart={handleDragStart}
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
