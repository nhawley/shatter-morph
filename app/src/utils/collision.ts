export function checkCollision(entity1, entity2, range = 1) {
  const dx = entity1.x - entity2.x;
  const dy = entity1.y - entity2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < range;
}

export function getClosestEnemy(player, enemies) {
  let closest = null;
  let minDistance = Infinity;
  
  enemies.forEach((enemy) => {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < minDistance) {
      minDistance = distance;
      closest = enemy;
    }
  });
  
  return { enemy: closest, distance: minDistance };
}