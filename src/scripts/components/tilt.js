// 3D Card Tilt Engine with specular light reflection
export function initTilt() {
  const cards = document.querySelectorAll('.tilt-card, .service-card, .value-card, .team-card');

  cards.forEach((card) => {
    let bounds;

    function mouseMove(e) {
      bounds = card.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const leftX = mouseX - bounds.x;
      const topY = mouseY - bounds.y;
      const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2
      };
      
      const distance = Math.sqrt(center.x ** 2 + center.y ** 2);
      
      const maxAngle = 12;
      const rotX = (-(center.y / (bounds.height / 2)) * maxAngle).toFixed(2);
      const rotY = ((center.x / (bounds.width / 2)) * maxAngle).toFixed(2);

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
        scale3d(1.02, 1.02, 1.02)
      `;

      // Specular sheen light gradient position
      const sheenX = (leftX / bounds.width) * 100;
      const sheenY = (topY / bounds.height) * 100;
      card.style.setProperty('--sheen-x', `${sheenX}%`);
      card.style.setProperty('--sheen-y', `${sheenY}%`);
    }

    function mouseLeave() {
      card.style.transform = `
        perspective(1000px)
        rotateX(0deg)
        rotateY(0deg)
        scale3d(1, 1, 1)
      `;
      card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    }

    function mouseEnter() {
      card.style.transition = 'none';
    }

    card.addEventListener('mousemove', mouseMove);
    card.addEventListener('mouseleave', mouseLeave);
    card.addEventListener('mouseenter', mouseEnter);
  });
}
