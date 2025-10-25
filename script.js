async function loadData() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();

    // sort alphabetically by word
    data.sort((a, b) => a.word.localeCompare(b.word));

    const wordList = document.getElementById('wordList');
    const searchInput = document.getElementById('searchInput');

    function renderWords(filter = '') {
      wordList.innerHTML = '';
      const filteredData = data.filter(entry =>
        entry.word.toLowerCase().includes(filter.toLowerCase())
      );

      filteredData.forEach(entry => {
        const item = document.createElement('div');
        item.classList.add('word-item');
        item.textContent = entry.word;
        item.addEventListener('click', () => openModal(entry));
        wordList.appendChild(item);
      });
    }

    renderWords();

    searchInput.addEventListener('input', e => {
      renderWords(e.target.value);
    });

    // modal behavior
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('closeModal');

    function openModal(entry) {
      document.getElementById('modalWord').textContent = entry.word;
      document.getElementById('modalMeaning').textContent = entry.meaning;
      document.getElementById('modalEtymology').textContent = entry.etymology;
      document.getElementById('modalExample').textContent = entry['example sentence'];
      modal.style.display = 'flex';
    }

    closeModal.onclick = () => {
      modal.style.display = 'none';
    };

    window.onclick = e => {
      if (e.target === modal) modal.style.display = 'none';
    };
  } catch (err) {
    console.error('Error loading data.json:', err);
  }
}

loadData();
