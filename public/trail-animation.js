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

  const maxPoints = 80;
  const historyLength = 80;
  let mouseX = null;
  let mouseY = null;
  let isMouseOnPage = false;
  let trail = null;
  
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
    
    return { trailPoints, mouseHistory, fadeOutOpacity: 1 };
  }
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseOnPage = true;
    
    if (!trail) {
      trail = createTrail();
    }
  });
  
  document.addEventListener('mouseleave', () => {
    isMouseOnPage = false;
  });
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!trail || mouseX === null || mouseY === null) {
      requestAnimationFrame(animate);
      return;
    }
    
    if (isMouseOnPage) {
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
    
    if (!isMouseOnPage) {
      const firstPoint = trail.trailPoints[0];
      const lastPoint = trail.trailPoints[trail.trailPoints.length - 1];
      const dx = lastPoint.x - firstPoint.x;
      const dy = lastPoint.y - firstPoint.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 2) {
        trail.fadeOutOpacity -= 0.05;
        if (trail.fadeOutOpacity <= 0) {
          trail = null;
          requestAnimationFrame(animate);
          return;
        }
      }
    } else {
      trail.fadeOutOpacity = 1;
    }
    
    trail.trailPoints.forEach((point, i) => {
      const progress = i / (trail.trailPoints.length - 1);
      const baseSize = 180;
      const size = baseSize - (progress * baseSize * 0.33);
      
      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size / 2);
      const opacity = (0.7 - (progress * 0.6)) * trail.fadeOutOpacity;
      
      gradient.addColorStop(0, `rgba(245, 158, 11, ${opacity})`);
      gradient.addColorStop(0.3, `rgba(245, 158, 11, ${opacity * 0.8})`);
      gradient.addColorStop(0.5, `rgba(245, 158, 11, ${opacity * 0.5})`);
      gradient.addColorStop(0.7, `rgba(245, 158, 11, ${opacity * 0.2})`);
      gradient.addColorStop(1, `rgba(245, 158, 11, 0)`);
      
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    });
    
    if (isMouseOnPage) {
      const headGradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 75);
      headGradient.addColorStop(0, 'rgba(245, 158, 11, 0.9)');
      headGradient.addColorStop(0.4, 'rgba(245, 158, 11, 0.7)');
      headGradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
      
      ctx.fillStyle = headGradient;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 75, 0, Math.PI * 2);
      ctx.fill();
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
}
