import { useEffect, useRef, useState } from 'react';


const GAME_GRAVITY = 0.35; // Reduced gravity for smoother falling
const JUMP_FORCE = -6.5; // Reduced jump force for better control
const INITIAL_PIPE_SPEED = 2; // Slower initial speed
let PIPE_WIDTH = 60;
let PIPE_GAP = 170;
let BIRD_SIZE = 25;
let MIN_PIPE_HEIGHT = 50;
let PIPE_SPACING = 280;
let GROUND_HEIGHT = 50;

interface Bird {
  x: number;
  y: number;
  velocity: number;
}

interface Pipe {
  x: number;
  height: number;
  scored?: boolean;
}

export const FlappyBird = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [pipeSpeed, setPipeSpeed] = useState(INITIAL_PIPE_SPEED);

  // Bird state
  const birdRef = useRef<Bird>({
    x: 50,
    y: 200,
    velocity: 0
  });
  
  const pipesRef = useRef<Pipe[]>([]);
  const animationFrameRef = useRef<number>(0);
  const lastPipeRef = useRef<number>(0);

  const resetGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    birdRef.current = {
      x: width * 0.2,
      y: height * 0.4,
      velocity: 0
    };
    pipesRef.current = [];
    setScore(0);
    setGameOver(false);
    setPipeSpeed(INITIAL_PIPE_SPEED);
    setHighScore(prev => Math.max(prev, score));
  };

  const createPipe = (): Pipe | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const minHeight = MIN_PIPE_HEIGHT;
    const maxHeight = canvas.height - PIPE_GAP - MIN_PIPE_HEIGHT;
    const height = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);

    return {
      x: canvas.width,
      height: height,
      scored: false
    };
  };

  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas || !gameStarted || gameOver) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update bird position
    birdRef.current.velocity += GAME_GRAVITY;
    birdRef.current.y += birdRef.current.velocity;

    // Keep bird within bounds
    if (birdRef.current.y < 0) {
      birdRef.current.y = 0;
      birdRef.current.velocity = 0;
    }

    // Check for ground collision
    if (birdRef.current.y + BIRD_SIZE > canvas.height - GROUND_HEIGHT) {
      birdRef.current.y = canvas.height - GROUND_HEIGHT - BIRD_SIZE;
      setGameOver(true);
      return;
    }

    // Update pipes
    pipesRef.current = pipesRef.current.filter(pipe => pipe.x + PIPE_WIDTH > 0);
    pipesRef.current.forEach(pipe => {
      pipe.x -= pipeSpeed;
    });

    // Check for pipe collisions
    for (const pipe of pipesRef.current) {
      if (
        birdRef.current.x + BIRD_SIZE * 0.7 > pipe.x &&
        birdRef.current.x + BIRD_SIZE * 0.3 < pipe.x + PIPE_WIDTH &&
        (birdRef.current.y + BIRD_SIZE * 0.3 < pipe.height ||
          birdRef.current.y + BIRD_SIZE * 0.7 > pipe.height + PIPE_GAP)
      ) {
        setGameOver(true);
        return;
      }

      // Update score
      if (!pipe.scored && pipe.x + PIPE_WIDTH < birdRef.current.x) {
        pipe.scored = true;
        setScore(prev => prev + 1);
        // Increase speed every 5 points
        if ((score + 1) % 5 === 0) {
          setPipeSpeed(prev => Math.min(prev + 0.5, 8));
        }
      }
    }

    // Add new pipe
    const lastPipe = pipesRef.current[pipesRef.current.length - 1];
    if (!lastPipe || lastPipe.x < canvas.width - PIPE_SPACING) {
      const newPipe = createPipe();
      if (newPipe) {
        pipesRef.current.push(newPipe);
      }
    }

    // Draw everything
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas with sky color
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw clouds (background)
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 3; i++) {
        const x = (canvas.width * 0.2 + i * canvas.width * 0.3) % canvas.width;
        const y = canvas.height * 0.2;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.arc(x + 15, y - 10, 15, 0, Math.PI * 2);
        ctx.arc(x + 15, y + 10, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw pipes
      ctx.fillStyle = '#2ECC71';
      pipesRef.current.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.height);
        // Bottom pipe
        ctx.fillRect(
          pipe.x,
          pipe.height + PIPE_GAP,
          PIPE_WIDTH,
          canvas.height - (pipe.height + PIPE_GAP)
        );
        
        // Pipe caps
        ctx.fillStyle = '#27AE60';
        // Top cap
        ctx.fillRect(pipe.x - 5, pipe.height - 10, PIPE_WIDTH + 10, 10);
        // Bottom cap
        ctx.fillRect(pipe.x - 5, pipe.height + PIPE_GAP, PIPE_WIDTH + 10, 10);
        ctx.fillStyle = '#2ECC71';
      });

      // Draw bird
      ctx.fillStyle = '#F1C40F';
      ctx.beginPath();
      ctx.arc(
        birdRef.current.x + BIRD_SIZE/2,
        birdRef.current.y + BIRD_SIZE/2,
        BIRD_SIZE/2,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Wing
      ctx.fillStyle = '#F39C12';
      ctx.beginPath();
      ctx.ellipse(
        birdRef.current.x + BIRD_SIZE/2,
        birdRef.current.y + BIRD_SIZE/2,
        BIRD_SIZE/3,
        BIRD_SIZE/6,
        Math.sin(Date.now() * 0.01) * 0.5,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw ground
      const groundPattern = ctx.createLinearGradient(0, canvas.height - GROUND_HEIGHT, 0, canvas.height);
      groundPattern.addColorStop(0, '#8B4513');
      groundPattern.addColorStop(1, '#654321');
      ctx.fillStyle = groundPattern;
      ctx.fillRect(
        0,
        canvas.height - GROUND_HEIGHT,
        canvas.width,
        GROUND_HEIGHT
      );

      // Draw grass
      ctx.fillStyle = '#2ECC71';
      for (let i = 0; i < canvas.width; i += 10) {
        const height = 5 + Math.sin(i * 0.1) * 2;
        ctx.fillRect(
          i,
          canvas.height - GROUND_HEIGHT,
          2,
          -height
        );
      }

      // Draw score with shadow
      ctx.fillStyle = '#000';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'white';
      ctx.shadowBlur = 4;
      ctx.fillText(`Score: ${score}`, canvas.width/2, 40);
      ctx.shadowBlur = 0;
    };
    draw();

    // Request next frame
    animationFrameRef.current = requestAnimationFrame(update);
  };

  // Handle interaction
  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    e.stopPropagation(); // Stop event bubbling

    // For touch events, only respond to the first touch
    if (e.type === 'touchstart' && (e as React.TouchEvent).touches.length > 1) {
      return;
    }

    if (gameOver) {
      resetGame();
      setGameStarted(false);
    } else if (!gameStarted) {
      setGameStarted(true);
      birdRef.current.velocity = JUMP_FORCE;
    } else {
      birdRef.current.velocity = JUMP_FORCE;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const updateCanvasSize = () => {
      const { width, height } = container.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      
      // Set display size
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      
      // Set actual size in memory
      canvas.width = width * scale;
      canvas.height = height * scale;
      
      // Scale context to match display size
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(scale, scale);
        ctx.imageSmoothingEnabled = false; // Disable anti-aliasing for crisp pixels
      }

      // Reset bird position when canvas size changes
      if (!gameStarted) {
        birdRef.current = {
          x: width * 0.2, // 20% from left
          y: height * 0.4, // 40% from top
          velocity: 0
        };
      }
      
      // Update game dimensions based on new canvas size
      PIPE_WIDTH = Math.floor(width * 0.16); // 16% of width
      PIPE_GAP = Math.floor(height * 0.28); // 28% of height
      BIRD_SIZE = Math.floor(width * 0.067); // 6.7% of width
      MIN_PIPE_HEIGHT = Math.floor(height * 0.1); // 10% of height
      PIPE_SPACING = Math.floor(width * 0.75); // 75% of width
      GROUND_HEIGHT = Math.floor(height * 0.08); // 8% of height
    };

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(container);
    updateCanvasSize();

    return () => {
      resizeObserver.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      // Start with one pipe
      if (pipesRef.current.length === 0) {
        const newPipe = createPipe();
        if (newPipe) {
          pipesRef.current.push(newPipe);
          lastPipeRef.current = canvasRef.current!.width;
        }
      }
      animationFrameRef.current = requestAnimationFrame(update);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStarted, gameOver]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-transparent touch-none select-none"
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
        onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
      />
      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-center bg-black/30">
          <p className="text-xl font-bold">Click to Start</p>
        </div>
      )}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-center bg-black/30">
          <div>
            <p className="text-xl font-bold mb-2">Game Over</p>
            <p className="text-lg">Score: {score}</p>
            <p className="text-sm">High Score: {highScore}</p>
            <p className="text-sm mt-4">Click to Restart</p>
          </div>
        </div>
      )}
      <div className="absolute top-4 left-4 text-white text-2xl font-bold">
        {score}
      </div>
    </div>
  );
};
