
    const grid = document.getElementById('grid');
    const empty = document.getElementById('empty');

    const sample = [
      {
        id: 1,
        name: 'Iancu Aurelian',
        role: 'Lead Programmer',
        bio: 'Lucrează pe gameplay & AI. 8+ ani experiență în C++ și Unity.',
        games: ['Nebula Rift','Chorno Forge'],
        photo: '../images/auras.jpeg',
        instagram: 'https://www.instagram.com/auras.me/'
      },
      {
        id: 2,
        name: 'Ghimpu Dragoș',
        role: 'Art Director',
        bio: 'Concept artist & UI designer. Specializat în stiluri low-poly şi pixel art.',
        games: ['Pixel Drift'],
        photo: '../images/dragos.jpg',
        instagram: 'https://www.instagram.com/dragoss_18/'
      },
      {
        id: 3,
        name: 'Costia Georgian',
        role: 'Sound Designer',
        bio: 'Compozitor și foley artist. Creează ambianțe și efecte audio unice.',
        games: ['Emberfall'],
        photo: '../images/george.jpg',
        instagram: 'https://www.instagram.com/geo_cos_/'
      }
    ];

    let devs = sample.slice();

    function render() {
      grid.innerHTML = '';
      if (devs.length === 0) {
        empty.style.display = 'block';
        return;
      } else {
        empty.style.display = 'none';
      }

      devs.forEach(d => {
        const card = document.createElement('article');
        card.className = 'card fade-up';
        card.innerHTML = `
          <div class="avatar">
            <img src="${d.photo}" alt="${d.name}">
          </div>
          <div class="info">
            <h2>${d.name}</h2>
            <h3>${d.role}</h3>
            <p>${d.bio}</p>
            <div class="tags">${(d.games || []).map(g => `<span>${g}</span>`).join('')}</div>
            <a href="${d.instagram}" target="_blank" class="insta-btn">Profil Instagram</a>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    function addExample() {
      const next = {
        id: Date.now(),
        name: 'Nume Nou',
        role: 'Contributor',
        bio: 'Descriere scurtă aici.',
        games: ['Demo Game'],
        photo: '../images/default.jpg',
        instagram: '#'
      };
      devs.push(next);
      render();
    }

    function filterCards() {
      const q = document.getElementById('q').value.toLowerCase();
      const cards = [...grid.children];
      cards.forEach(c => {
        c.style.display = c.innerText.toLowerCase().includes(q) ? 'flex' : 'none';
      });
    }

    render();
