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

    function closeModalFunc() {
      modal.style.display = 'none';
    }

    closeModal.onclick = closeModalFunc;

    window.onclick = e => {
      if (e.target === modal) closeModalFunc();
    };

    // escape key closes modal
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModalFunc();
      }
    });
  } catch (err) {
    console.error('Error loading data.json:', err);
  }
}

loadData();
