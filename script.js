async function loadData() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();

    // sort alphabetically
    data.sort((a, b) => a.word.localeCompare(b.word));

    const wordList = document.getElementById('wordList');
    const searchInput = document.getElementById('searchInput');

    function renderWords(filter = '') {
      wordList.innerHTML = '';
      const filtered = data.filter(entry =>
        entry.word.toLowerCase().includes(filter.toLowerCase())
      );

      filtered.forEach(entry => {
        const item = document.createElement('div');
        item.classList.add('word-item');
        item.textContent = entry.word;
        item.addEventListener('click', () => openModal(entry));
        wordList.appendChild(item);
      });
    }

    renderWords();
    searchInput.addEventListener('input', e => renderWords(e.target.value));

    // modal
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('closeModal');

    function openModal(entry) {
      document.getElementById('modalWord').textContent = entry.word;

      // convert references to clickable spans
      function linkify(text) {
        // match "Also see X" or just individual words
        return text.replace(/\b([A-Za-z0-9!?.]+)\b/g, (match) => {
          const target = data.find(d => d.word.toLowerCase() === match.toLowerCase());
          if (target) return `<span class="reference">${match}</span>`;
          return match;
        });
      }

      document.getElementById('modalMeaning').innerHTML = linkify(entry.meaning);
      document.getElementById('modalEtymology').innerHTML = linkify(entry.etymology);
      document.getElementById('modalExample').textContent = entry['example sentence'];

      modal.style.display = 'flex';

      // add click listeners for references
      document.querySelectorAll('.reference').forEach(ref => {
        ref.addEventListener('click', () => {
          const targetEntry = data.find(d => d.word.toLowerCase() === ref.textContent.toLowerCase());
          if (targetEntry) openModal(targetEntry);
        });
      });
    }

    function closeModalFunc() {
      modal.style.display = 'none';
    }

    closeModal.onclick = closeModalFunc;
    window.onclick = e => { if (e.target === modal) closeModalFunc(); }
    window.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.style.display === 'flex') closeModalFunc(); });

  } catch(err) {
    console.error('Error loading data.json:', err);
  }
}

loadData();
