

import React, { useState, useEffect, useRef } from "react";
import "./SnakeGame.css";

const GRID_SIZE = 15;
const INITIAL_SNAKE = [{ x: 7, y: 7 }];
const INITIAL_FOOD = { x: 3, y: 3 };

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState({ x: 0, y: 1 });
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(300);

  // 🔊 Preload sounds
  const eatSoundRef = useRef(null);
  const gameOverSoundRef = useRef(null);

  useEffect(() => {
    eatSoundRef.current = new Audio("/eat.mp3");
    gameOverSoundRef.current = new Audio("/gameover.mp3");
  }, []);

  const playSound = (soundRef) => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play();
    }
  };

  // 🎮 Keyboard control
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        togglePause();
      } else {
        changeDirection(e.key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, paused]);

  // 🕹️ Game loop
  useEffect(() => {
    if (gameOver || paused) return;
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [snake, direction, gameOver, paused, speed]);

  const changeDirection = (key) => {
    switch (key) {
      case "ArrowUp":
        if (direction.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case "ArrowDown":
        if (direction.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case "ArrowLeft":
        if (direction.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case "ArrowRight":
        if (direction.x !== -1) setDirection({ x: 1, y: 0 });
        break;
      default:
        break;
    }
  };

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = {
      x: newSnake[0].x + direction.x,
      y: newSnake[0].y + direction.y,
    };

    // ❌ Collision check
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE ||
      newSnake.some((seg) => seg.x === head.x && seg.y === head.y)
    ) {
      setGameOver(true);
      playSound(gameOverSoundRef);
      return;
    }

    newSnake.unshift(head);

    // 🍎 Eat food
    if (head.x === food.x && head.y === food.y) {
      playSound(eatSoundRef);
      setFood({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      });
      setScore(score + 10);
      if (speed > 80) setSpeed(speed - 20); // increase difficulty
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection({ x: 0, y: 1 });
    setGameOver(false);
    setPaused(false);
    setScore(0);
    setSpeed(300);
  };

  const togglePause = () => {
    if (!gameOver) {
      setPaused(!paused);
    }
  };

  return (
    <div className="snake-container">
      <h2>🐍 Kourkyls International School-Snake_Game</h2>
      <p>
        Score: <strong>{score}</strong>
      </p>

      {gameOver && (
        <div>
          <h3>Game Over!</h3>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}

      {!gameOver && (
        <button className="pause-btn" onClick={togglePause}>
          {paused ? "▶️ Resume" : "⏸ Pause"}
        </button>
      )}

      <div className="board">
        {Array.from({ length: GRID_SIZE }).map((_, row) =>
          Array.from({ length: GRID_SIZE }).map((_, col) => {
            const isHead = snake[0].x === col && snake[0].y === row;
            const isSnake = snake.some((seg) => seg.x === col && seg.y === row);
            const isFood = food.x === col && food.y === row;

            return (
              <div
                key={`${row}-${col}`}
                className={`cell ${isSnake ? "snake" : ""} ${isHead ? "head" : ""} ${isFood ? "food" : ""}`}
              />
            );
          })
        )}
      </div>

      {/* 🎛 On-screen controls */}
      <div className="controls">
        <button onClick={() => changeDirection("ArrowUp")}>⬆️</button>
        <div>
          <button onClick={() => changeDirection("ArrowLeft")}>⬅️</button>
          <button onClick={() => changeDirection("ArrowDown")}>⬇️</button>
          <button onClick={() => changeDirection("ArrowRight")}>➡️</button>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;

