import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ALL_ITEMS } from './constants';
import type { Weapon } from './types';

// --- Types ---
interface EnemyState {
  id: number;
  x: number;
  y: number;
}

// --- Reusable UI Components ---

const Player: React.FC<{
  position: { x: number; y: number };
  hp: number;
  maxHp: number;
  isTakingDamage: boolean;
}> = ({ position, hp, maxHp, isTakingDamage }) => {
  const hpPercentage = (hp / maxHp) * 100;

  return (
    <div
      className="absolute"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      aria-live="polite"
      aria-label={`Player health: ${hp} of ${maxHp}`}
    >
        {/* Health Bar */}
        <div className="absolute -top-4 w-8 h-1.5 bg-slate-700/50 rounded-full overflow-hidden border border-slate-900">
            <div
            className="h-full bg-green-500 rounded-full transition-all duration-200 ease-out"
            style={{ width: `${hpPercentage}%` }}
            />
        </div>
      
        {/* Player Sprite */}
        <div
            className={`w-8 h-8 rounded-full border-2 border-slate-900 transition-colors duration-100 ${
            isTakingDamage
                ? 'bg-red-500 shadow-lg shadow-red-500/50'
                : 'bg-cyan-400 shadow-lg shadow-cyan-400/50'
            }`}
        />
    </div>
  );
};

const Enemy: React.FC<{ position: { x: number; y: number } }> = ({ position }) => (
  <div
    className="absolute w-7 h-7 bg-red-500 rounded-full border-2 border-slate-900 shadow-md shadow-red-500/50"
    style={{
      left: `${position.x}px`,
      top: `${position.y}px`,
      transform: 'translate(-50%, -50%)',
    }}
  />
);

const Gauge: React.FC<{ value: number; max: number }> = ({ value, max }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-4/5 max-w-2xl h-6 bg-slate-700/50 backdrop-blur-sm rounded-full overflow-hidden border-2 border-slate-500 shadow-lg">
      <div
        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-200 ease-out"
        style={{ width: `${percentage}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white mix-blend-lighten tracking-wider">
        경험치: {Math.floor(value)} / {max}
      </span>
    </div>
  );
};

const WeaponSelectionCard: React.FC<{ weapon: Weapon; onSelect: (weapon: Weapon) => void }> = ({ weapon, onSelect }) => (
  <button
    onClick={() => onSelect(weapon)}
    className="bg-slate-800 border-2 border-slate-600 rounded-lg p-6 flex flex-col items-center gap-4 text-center transform hover:scale-105 hover:bg-slate-700 hover:border-cyan-400 transition-all duration-200 ease-in-out cursor-pointer shadow-lg w-full"
  >
    <div className="text-cyan-400 scale-125">{weapon.icon}</div>
    <h3 className="text-xl font-bold text-white mt-2">{weapon.name}</h3>
    <p className="text-slate-400 text-sm">{weapon.description}</p>
  </button>
);

const WeaponSelectionModal: React.FC<{ weapons: Weapon[]; onSelect: (weapon: Weapon) => void }> = ({ weapons, onSelect }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
    <div className="bg-slate-900/80 backdrop-blur-sm p-8 rounded-xl border border-slate-700 shadow-2xl max-w-4xl w-full">
      <h2 className="text-3xl font-bold text-center mb-2 text-cyan-400">레벨 업!</h2>
      <p className="text-center text-slate-300 mb-8">새로운 능력을 선택하세요.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {weapons.map((weapon) => (
          <WeaponSelectionCard key={weapon.id} weapon={weapon} onSelect={onSelect} />
        ))}
      </div>
    </div>
  </div>
);

const GameOverModal: React.FC<{ onRestart: () => void; score: number }> = ({ onRestart, score }) => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-slate-900/80 backdrop-blur-sm p-8 rounded-xl border border-slate-700 shadow-2xl text-center">
        <h2 className="text-4xl font-bold mb-4 text-red-500">게임 오버</h2>
        <p className="text-xl text-slate-300 mb-8">생존 시간: {score}초</p>
        <button
            onClick={onRestart}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
        >
            다시 시작
        </button>
      </div>
    </div>
);

const Joystick: React.FC<{ onMove: (direction: { x: number; y: number }) => void; onEnd: () => void }> = ({ onMove, onEnd }) => {
    const baseRef = useRef<HTMLDivElement>(null);
    const stickRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const baseSize = 128;
    const stickSize = 64;

    const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
        isDragging.current = true;
        if (stickRef.current) stickRef.current.style.transition = '0s';
        updateStickPosition(e);
    };

    const handleInteractionEnd = useCallback(() => {
        if (!isDragging.current) return;
        isDragging.current = false;
        if (stickRef.current) {
            stickRef.current.style.transition = '0.2s ease-out';
            stickRef.current.style.transform = `translate(0px, 0px)`;
        }
        onEnd();
    }, [onEnd]);

    const getEventCoordinates = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
        if ('touches' in e) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        return { x: e.clientX, y: e.clientY };
    }

    const updateStickPosition = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
        if (!baseRef.current || !stickRef.current) return;
        const { x: eventX, y: eventY } = getEventCoordinates(e);
        const { left, top, width } = baseRef.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + width / 2;
        let dx = eventX - centerX;
        let dy = eventY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = width / 2;
        if (distance > radius) {
            dx = (dx / distance) * radius;
            dy = (dy / distance) * radius;
        }
        stickRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
        onMove({ x: dx / radius, y: dy / radius });
    };

    const handleInteractionMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging.current) return;
        e.preventDefault();
        updateStickPosition(e);
    }, [onMove]);

    useEffect(() => {
        window.addEventListener('mousemove', handleInteractionMove, { passive: false });
        window.addEventListener('touchmove', handleInteractionMove, { passive: false });
        window.addEventListener('mouseup', handleInteractionEnd);
        window.addEventListener('touchend', handleInteractionEnd);
        return () => {
            window.removeEventListener('mousemove', handleInteractionMove);
            window.removeEventListener('touchmove', handleInteractionMove);
            window.removeEventListener('mouseup', handleInteractionEnd);
            window.removeEventListener('touchend', handleInteractionEnd);
        };
    }, [handleInteractionMove, handleInteractionEnd]);

    return (
        <div ref={baseRef} className="fixed bottom-10 left-10 w-32 h-32 bg-slate-700/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-slate-500/50 select-none z-20"
            onMouseDown={handleInteractionStart} onTouchStart={handleInteractionStart} style={{ width: `${baseSize}px`, height: `${baseSize}px` }}>
            <div ref={stickRef} className="w-16 h-16 bg-cyan-400/50 rounded-full border-2 border-cyan-300/80 shadow-lg" style={{ width: `${stickSize}px`, height: `${stickSize}px` }}></div>
        </div>
    );
};

// --- Main App Component ---

const App: React.FC = () => {
  const GAUGE_MAX = 100;
  const PLAYER_SPEED = 5;
  const ENEMY_SPEED = 1.5;
  const GAUGE_FILL_RATE = 5; // 초당 경험치
  const ENEMY_SPAWN_RATE = 1500; // ms
  const MAX_PLAYER_HP = 100;
  const ENEMY_DAMAGE = 25;

  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [playerHp, setPlayerHp] = useState(MAX_PLAYER_HP);
  const [isTakingDamage, setIsTakingDamage] = useState(false);
  const [gaugeValue, setGaugeValue] = useState(0);
  const [equippedItems, setEquippedItems] = useState<Weapon[]>([]);
  const [itemChoices, setItemChoices] = useState<Weapon[]>([]);
  const [showSelection, setShowSelection] = useState(false);
  const [enemies, setEnemies] = useState<EnemyState[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameTime, setGameTime] = useState(0);

  const keysPressed = useMemo(() => new Set<string>(), []);
  const joystickDirection = useRef({ x: 0, y: 0 });
  const damageTimeoutRef = useRef<number | null>(null);
  const gamePaused = useMemo(() => showSelection || isGameOver, [showSelection, isGameOver]);
  
  const getThreeRandomItems = useCallback(() => {
    const shuffled = [...ALL_ITEMS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, []);

  const handleRestart = useCallback(() => {
    setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    setGaugeValue(0);
    setEquippedItems([]);
    setEnemies([]);
    setGameTime(0);
    setShowSelection(false);
    setIsGameOver(false);
    setPlayerHp(MAX_PLAYER_HP);
  }, []);

  // Game Loop
  useEffect(() => {
    let animationFrameId: number;
    const gameLoop = () => {
      if (gamePaused) {
          animationFrameId = requestAnimationFrame(gameLoop);
          return;
      }
      // Player Movement
      setPosition(prev => {
        let dx = joystickDirection.current.x;
        let dy = joystickDirection.current.y;
        if (keysPressed.has('arrowup') || keysPressed.has('w')) dy -= 1;
        if (keysPressed.has('arrowdown') || keysPressed.has('s')) dy += 1;
        if (keysPressed.has('arrowleft') || keysPressed.has('a')) dx -= 1;
        if (keysPressed.has('arrowright') || keysPressed.has('d')) dx += 1;
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        if (magnitude > 0) {
            let newX = prev.x + (dx / magnitude) * PLAYER_SPEED;
            let newY = prev.y + (dy / magnitude) * PLAYER_SPEED;
            const playerSize = 16;
            newX = Math.max(playerSize, Math.min(window.innerWidth - playerSize, newX));
            newY = Math.max(playerSize, Math.min(window.innerHeight - playerSize, newY));
            return { x: newX, y: newY };
        }
        return prev;
      });

      // Enemy Movement & Collision
      const enemiesToRemove = new Set<number>();
      let totalDamage = 0;

      const movedEnemies = enemies.map(enemy => {
          const dx = position.x - enemy.x;
          const dy = position.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 20) { // Collision
              enemiesToRemove.add(enemy.id);
              totalDamage += ENEMY_DAMAGE;
              return enemy; // Will be filtered out
          }

          return { ...enemy,
              x: enemy.x + (dx / distance) * ENEMY_SPEED,
              y: enemy.y + (dy / distance) * ENEMY_SPEED
          };
      });

      if (totalDamage > 0) {
          setPlayerHp(prevHp => {
              const newHp = prevHp - totalDamage;
              if (newHp <= 0) {
                  setIsGameOver(true);
                  return 0;
              }
              return newHp;
          });
          setEnemies(prev => prev.filter(e => !enemiesToRemove.has(e.id)));

          if (damageTimeoutRef.current) clearTimeout(damageTimeoutRef.current);
          setIsTakingDamage(true);
          damageTimeoutRef.current = window.setTimeout(() => setIsTakingDamage(false), 150);
      } else {
          setEnemies(movedEnemies);
      }
      
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    animationFrameId = requestAnimationFrame(gameLoop);
    return () => {
        cancelAnimationFrame(animationFrameId);
        if (damageTimeoutRef.current) clearTimeout(damageTimeoutRef.current);
    };
  }, [gamePaused, keysPressed, position.x, position.y, enemies]);

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysPressed.add(e.key.toLowerCase());
    const handleKeyUp = (e: KeyboardEvent) => keysPressed.delete(e.key.toLowerCase());
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keysPressed]);

  // Enemy Spawner
  useEffect(() => {
    if (gamePaused) return;
    const spawnInterval = setInterval(() => {
      const side = Math.floor(Math.random() * 4);
      let x, y;
      if (side === 0) { x = 0; y = Math.random() * window.innerHeight; } // Left
      else if (side === 1) { x = window.innerWidth; y = Math.random() * window.innerHeight; } // Right
      else if (side === 2) { y = 0; x = Math.random() * window.innerWidth; } // Top
      else { y = window.innerHeight; x = Math.random() * window.innerWidth; } // Bottom
      setEnemies(prev => [...prev, { id: Date.now(), x, y }]);
    }, ENEMY_SPAWN_RATE);
    return () => clearInterval(spawnInterval);
  }, [gamePaused]);

  // Time and Gauge Tracker
  useEffect(() => {
    if (gamePaused) return;
    const timer = setInterval(() => {
        setGameTime(prev => prev + 1);
        setGaugeValue(prev => Math.min(prev + (GAUGE_FILL_RATE / 10), GAUGE_MAX));
    }, 100);
    return () => clearInterval(timer);
  }, [gamePaused]);

  // Level Up
  useEffect(() => {
    if (gaugeValue >= GAUGE_MAX && !showSelection) {
      setItemChoices(getThreeRandomItems());
      setShowSelection(true);
    }
  }, [gaugeValue, showSelection, getThreeRandomItems]);

  const handleItemSelect = useCallback((item: Weapon) => {
    setEquippedItems(prev => [...prev, item]);
    setGaugeValue(0);
    setShowSelection(false);
  }, []);

  const handleJoystickMove = useCallback((direction: { x: number; y: number }) => { joystickDirection.current = direction; }, []);
  const handleJoystickEnd = useCallback(() => { joystickDirection.current = { x: 0, y: 0 }; }, []);
  
  return (
    <main className="relative w-screen h-screen bg-grid cursor-none">
      <div className="absolute inset-0 bg-slate-900 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="absolute top-5 left-5 p-4 bg-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-700 shadow-lg z-10 max-w-sm">
        <h1 className="text-xl font-bold text-cyan-400">생존 시간: {gameTime}초</h1>
        {equippedItems.length > 0 ? (
          <div className="mt-2">
              <p className="text-slate-400 text-sm">보유 능력:</p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {equippedItems.map(item => (
                    <div key={item.id} className="text-cyan-400 bg-slate-800 p-1 rounded-md">{item.icon}</div>
                ))}
              </div>
          </div>
        ) : (
          <p className="mt-2 text-slate-400 text-sm">조이스틱 또는 WASD로 이동하여 생존하세요</p>
        )}
      </div>

      <Player position={position} hp={playerHp} maxHp={MAX_PLAYER_HP} isTakingDamage={isTakingDamage} />
      {enemies.map(enemy => <Enemy key={enemy.id} position={enemy} />)}
      
      {!isGameOver && <Gauge value={gaugeValue} max={GAUGE_MAX} />}
      {!isGameOver && <Joystick onMove={handleJoystickMove} onEnd={handleJoystickEnd} />}

      {showSelection && <WeaponSelectionModal weapons={itemChoices} onSelect={handleItemSelect} />}
      {isGameOver && <GameOverModal onRestart={handleRestart} score={gameTime} />}
    </main>
  );
};

export default App;
