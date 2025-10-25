async function loadData() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();

    // sort alphabetically
    data.sort((a, b) => a.word.localeCompare(b.word));

    const wordList = document.getElementById('wordList');
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('closeModal');

    function renderWords(filter = '') {
      wordList.innerHTML = '';
      const filtered = data.filter(entry =>
        entry.word.toLowerCase().includes(filter.toLowerCase())
      );

      filtered.forEach(entry => {
        const div = document.createElement('div');
        div.classList.add('word-item');
        div.textContent = entry.word;
        div.addEventListener('click', () => openModal(entry));
        wordList.appendChild(div);
      });
    }

    function openModal(entry) {
      document.getElementById('modalWord').textContent = entry.word;
      document.getElementById('modalMeaning').textContent = entry.meaning;
      document.getElementById('modalEtymology').textContent = entry.etymology;
      document.getElementById('modalExample').textContent = entry['example sentence'] || '';
      modal.style.display = 'flex';
    }

    function close() {
      modal.style.display = 'none';
    }

    closeModal.onclick = close;
    window.onclick = e => { if (e.target === modal) close(); };
    window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    renderWords();
    searchInput.addEventListener('input', e => renderWords(e.target.value));
  } catch (err) {
    console.error('Error loading data.json:', err);
  }
}

loadData();
