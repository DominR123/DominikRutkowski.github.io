document.addEventListener('DOMContentLoaded', () => {
  let map, marker;
  let puzzlePieces = [];
  let boardPieces = Array(16).fill(null);

  function initMap(lat, lon) {
    map = L.map('map').setView([lat, lon], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'OSM',
      crossOrigin: 'anonymous'
    }).addTo(map);
  }

  navigator.geolocation.getCurrentPosition(
    (p) => initMap(p.coords.latitude, p.coords.longitude),
    () => initMap(51.505, -0.09)
  );

  function getEdgeType(id) {
    const r = Math.floor(id / 4), c = id % 4;
    if (r === 0 && c === 0) return 'top-left';
    if (r === 0 && c === 3) return 'top-right';
    if (r === 3 && c === 0) return 'bottom-left';
    if (r === 3 && c === 3) return 'bottom-right';
    if (r === 0) return 'top';
    if (r === 3) return 'bottom';
    if (c === 0) return 'left';
    if (c === 3) return 'right';
    return null;
  }

  document.getElementById('map_downl').addEventListener('click', function () {
    this.disabled = true;
    map.invalidateSize();

    setTimeout(() => {
      html2canvas(document.getElementById('map'), { useCORS: true }).then(canvas => {
        puzzlePieces = [];
        boardPieces = Array(16).fill(null);

        const dim  = Math.min(canvas.width, canvas.height);
        const size = Math.floor(dim / 4);

        for (let i = 0; i < 16; i++) {
          const pc = document.createElement('canvas');
          pc.width = pc.height = size;
          pc.getContext('2d').drawImage(
            canvas,
            (i % 4) * size, Math.floor(i / 4) * size, size, size,
            0, 0, size, size
          );
          puzzlePieces.push({ id: i, url: pc.toDataURL(), edge: getEdgeType(i) });
        }

        puzzlePieces.sort(() => Math.random() - 0.5);
        renderAll();
        this.disabled = false;
      });
    }, 500);
  });

  function renderAll() {
    renderBank();
    renderBoard();
    checkWin();
  }

  function renderBank() {
    const bank = document.getElementById('puzzle-bank');
    bank.innerHTML = '';

    bank.ondragover = (e) => e.preventDefault();
    bank.ondrop = (e) => {
      e.preventDefault();
      if (e.dataTransfer.getData('source') === 'board') {
        const fromIdx = parseInt(e.dataTransfer.getData('idx'));
        if (boardPieces[fromIdx]) {
          puzzlePieces.push(boardPieces[fromIdx]);
          boardPieces[fromIdx] = null;
          renderAll();
        }
      }
    };

    puzzlePieces.forEach(p => {
      const img = document.createElement('img');
      img.src = p.url;
      img.draggable = true;
      img.ondragstart = (e) => {
        e.dataTransfer.setData('source', 'bank');
        e.dataTransfer.setData('id', p.id);
      };

      const wrapper = document.createElement('div');
      wrapper.className = 'bank-piece';
      if (p.edge) wrapper.setAttribute('data-edge', p.edge);
      wrapper.appendChild(img);

      wrapper.draggable = false;
      bank.appendChild(wrapper);
    });
  }

  function renderBoard() {
    const slots = document.querySelectorAll('.puzzle-slot');

    slots.forEach((slot, i) => {
      slot.innerHTML = '';
      slot.removeAttribute('data-edge');

      slot.ondragover = (e) => e.preventDefault();
      slot.ondrop = (e) => {
        e.preventDefault();
        const source = e.dataTransfer.getData('source');

        if (source === 'bank') {
          const id   = parseInt(e.dataTransfer.getData('id'));
          const pIdx = puzzlePieces.findIndex(p => p.id === id);
          if (pIdx === -1) return;
          if (boardPieces[i]) puzzlePieces.push(boardPieces[i]);
          boardPieces[i] = puzzlePieces[pIdx];
          puzzlePieces.splice(pIdx, 1);

        } else if (source === 'board') {
          const fromIdx = parseInt(e.dataTransfer.getData('idx'));
          [boardPieces[i], boardPieces[fromIdx]] = [boardPieces[fromIdx], boardPieces[i]];
        }

        renderAll();
      };

      if (boardPieces[i]) {
        const p   = boardPieces[i];
        const img = document.createElement('img');
        img.src = p.url;
        img.draggable = true;
        if (p.edge) slot.setAttribute('data-edge', p.edge);
        img.ondragstart = (e) => {
          e.dataTransfer.setData('source', 'board');
          e.dataTransfer.setData('idx', i);
        };
        slot.appendChild(img);
      }
    });
  }

  function checkWin() {
    if (boardPieces.every((p, i) => p && p.id === i)) {
      console.debug('Wszystkie puzzle ułożone poprawnie! Mapa kompletna.');
      setTimeout(() => {
        alert('Gratulacje! Mapa ułożona.');
        if (Notification.permission === 'granted') new Notification('Zwycięstwo!');
      }, 100);
    }
  }

  document.getElementById('Loc').addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition((p) => {
      const lat = p.coords.latitude, lon = p.coords.longitude;
      map.setView([lat, lon], 15);
      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`Twoja współrzędne:<br> ${lat.toFixed(4)}, ${lon.toFixed(4)}`)
        .openPopup();
    });
  });

  if (Notification.permission !== 'denied') Notification.requestPermission();
});
