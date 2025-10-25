async function loadData() {
  const response = await fetch('data.json');
  const data = await response.json();

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

    function linkify(text) {
      if (!text) return '';
      return text.replace(/\b([A-Za-z0-9!?.]+)\b/g, word => {
        const target = data.find(d => d.word.toLowerCase() === word.toLowerCase());
        if (target) return `<span class="reference">${word}</span>`;
        return word;
      });
    }

    document.getElementById('modalMeaning').innerHTML = linkify(entry.meaning);
    document.getElementById('modalEtymology').innerHTML = linkify(entry.etymology);
    document.getElementById('modalExample').textContent = entry['example sentence'] || '';

    // show modal
    modal.style.display = 'flex';

    // clickable references
    document.querySelectorAll('.reference').forEach(ref => {
      ref.onclick = () => {
        const targetEntry = data.find(d => d.word.toLowerCase() === ref.textContent.toLowerCase());
        if (targetEntry) openModal(targetEntry);
      };
    });
  }

  function close() {
    modal.style.display = 'none';
  }

  closeModal.onclick = close;
  window.onclick = e => { if (e.target === modal) close(); };
  window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  renderWords();
  searchInput.addEventListener('input', e => renderWords(e.target.value));
}

loadData();
