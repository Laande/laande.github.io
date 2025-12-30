export function initTrailAnimation() {
  const canvas = document.getElementById('trail-canvas');
  const ctx = canvas?.getContext('2d');
  
  if (!canvas || !ctx) {
    console.error('Canvas not found');
    return;
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const trails = [];
  let currentTrail = null;
  const maxPoints = 80;
  const historyLength = 80;
  let mouseX = null;
  let mouseY = null;
  let smoothSpeed = 0;
  let isMouseOnPage = false;
  
  function createTrail() {
    const trailPoints = [];
    const mouseHistory = [];
    
    for (let i = 0; i < historyLength; i++) {
      mouseHistory.push({ x: mouseX, y: mouseY });
    }
    
    for (let i = 0; i < maxPoints; i++) {
      trailPoints.push({
        x: mouseX,
        y: mouseY,
        delay: Math.floor((i / maxPoints) * historyLength)
      });
    }
    
    return {
      trailPoints,
      mouseHistory,
      fadeOutOpacity: 1,
      isActive: true
    };
  }
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseOnPage = true;
    
    if (!currentTrail) {
      currentTrail = createTrail();
      trails.push(currentTrail);
    }
  });
  
  document.addEventListener('mouseleave', () => {
    isMouseOnPage = false;
    if (currentTrail) {
      currentTrail.isActive = false;
    }
  });
  
  document.addEventListener('mouseenter', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseOnPage = true;
    
    currentTrail = createTrail();
    trails.push(currentTrail);
  });
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (mouseX === null || mouseY === null) {
      requestAnimationFrame(animate);
      return;
    }
    
    let currentSpeed = 0;
    if (currentTrail && currentTrail.mouseHistory.length > 1) {
      const dx = currentTrail.mouseHistory[0].x - currentTrail.mouseHistory[1].x;
      const dy = currentTrail.mouseHistory[0].y - currentTrail.mouseHistory[1].y;
      currentSpeed = Math.sqrt(dx * dx + dy * dy);
    }
    smoothSpeed += (currentSpeed - smoothSpeed) * 0.2;
    
    for (let t = trails.length - 1; t >= 0; t--) {
      const trail = trails[t];
      
      if (trail.isActive && isMouseOnPage) {
        trail.mouseHistory.unshift({ x: mouseX, y: mouseY });
      } else {
        const lastPos = trail.mouseHistory[0];
        trail.mouseHistory.unshift({ x: lastPos.x, y: lastPos.y });
      }
      
      if (trail.mouseHistory.length > historyLength) {
        trail.mouseHistory.pop();
      }
      
      trail.trailPoints.forEach((point) => {
        const targetPos = trail.mouseHistory[Math.min(point.delay, trail.mouseHistory.length - 1)];
        point.x = targetPos.x;
        point.y = targetPos.y;
      });
      
      const pointsToDraw = [];
      const speedThreshold = 3;
      const interpolationFactor = trail.isActive ? Math.max(0, Math.min(1, (smoothSpeed - speedThreshold) / 5)) : 0;
      
      for (let i = 0; i < trail.trailPoints.length; i++) {
        pointsToDraw.push(trail.trailPoints[i]);
        
        if (interpolationFactor > 0 && i < trail.trailPoints.length - 1) {
          const current = trail.trailPoints[i];
          const next = trail.trailPoints[i + 1];
          const numInterpolated = Math.floor(interpolationFactor * 3);
          
          for (let j = 1; j <= numInterpolated; j++) {
            const t = j / (numInterpolated + 1);
            pointsToDraw.push({
              x: current.x + (next.x - current.x) * t,
              y: current.y + (next.y - current.y) * t,
              interpolated: true,
              opacity: interpolationFactor
            });
          }
        }
      }
      
      let allConverged = true;
      if (trail.trailPoints.length > 1) {
        const firstPoint = trail.trailPoints[0];
        for (let i = 1; i < trail.trailPoints.length; i++) {
          const dx = trail.trailPoints[i].x - firstPoint.x;
          const dy = trail.trailPoints[i].y - firstPoint.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 1) {
            allConverged = false;
            break;
          }
        }
      }
      
      if (!trail.isActive) {
        if (allConverged) {
          trail.fadeOutOpacity -= 0.05;
          if (trail.fadeOutOpacity < 0) trail.fadeOutOpacity = 0;
        }
      } else {
        trail.fadeOutOpacity = 1;
      }
      
      if (trail.fadeOutOpacity <= 0) {
        trails.splice(t, 1);
        continue;
      }
      
      if (trail.fadeOutOpacity > 0) {
        pointsToDraw.forEach((point, i) => {
          const progress = i / (pointsToDraw.length - 1);
          const baseSize = 180;
          const size = baseSize - (progress * baseSize * 0.33);
          
          const color = `0, 255, 255`;
          const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size / 2);
          
          const baseOpacity = point.interpolated ? 0.5 * (point.opacity || 1) : 0.7;
          const opacity = (baseOpacity - (progress * 0.6)) * trail.fadeOutOpacity;
          
          gradient.addColorStop(0, `rgba(${color}, ${opacity})`);
          gradient.addColorStop(0.3, `rgba(${color}, ${opacity * 0.8})`);
          gradient.addColorStop(0.5, `rgba(${color}, ${opacity * 0.5})`);
          gradient.addColorStop(0.7, `rgba(${color}, ${opacity * 0.2})`);
          gradient.addColorStop(1, `rgba(${color}, 0)`);
          
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(point.x, point.y, size / 2, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }
    
    if (isMouseOnPage && currentTrail && currentTrail.isActive) {
      const headGradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 75);
      headGradient.addColorStop(0, 'rgba(0, 255, 255, 0.9)');
      headGradient.addColorStop(0.4, 'rgba(0, 255, 255, 0.7)');
      headGradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
      
      ctx.fillStyle = headGradient;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 75, 0, Math.PI * 2);
      ctx.fill();
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
}
