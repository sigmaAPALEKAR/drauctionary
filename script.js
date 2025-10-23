// alphabetically sort and display entries
function renderDrauctionary(data) {
  data.sort((a, b) => a.word.localeCompare(b.word));
  const container = document.getElementById("drauctionary");
  container.innerHTML = "";

  const grouped = {};
  data.forEach(entry => {
    const letter = entry.word[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(entry);
  });

  for (const letter in grouped) {
    const section = document.createElement("div");
    const header = document.createElement("h2");
    header.textContent = letter;
    section.appendChild(header);

    grouped[letter].forEach(entry => {
      const div = document.createElement("div");
      div.className = "word";
      div.textContent = entry.word;
      div.addEventListener("click", () => openModal(entry));
      section.appendChild(div);
    });
    container.appendChild(section);
  }
}

// make "see" references clickable
function linkReferences(text, data) {
  const seeRegex = /(See|Also see)\s+([\w\s2!]+)/gi;
  return text.replace(seeRegex, (match, prefix, refWord) => {
    const target = data.find(e => e.word.toLowerCase() === refWord.toLowerCase());
    if (target) {
      return `${prefix} <a class="ref" onclick="scrollToWord('${target.word}')">${target.word}</a>`;
    }
    return match;
  });
}

// open modal
function openModal(entry) {
  const modal = document.getElementById("modal");
  document.getElementById("modalWord").textContent = entry.word;
  document.getElementById("modalMeaning").innerHTML = linkReferences(entry.meaning, drauctionaryData);
  document.getElementById("modalEtymology").innerHTML = linkReferences(entry.etymology, drauctionaryData);
  document.getElementById("modalExample").textContent = entry.example;
  modal.style.display = "block";
}

// close modal
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});

window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target == modal) modal.style.display = "none";
};

// scroll to referenced word
function scrollToWord(word) {
  const allWords = document.querySelectorAll(".word");
  for (let w of allWords) {
    if (w.textContent.toLowerCase() === word.toLowerCase()) {
      w.scrollIntoView({ behavior: "smooth", block: "center" });
      w.style.backgroundColor = "#3a3a3a";
      setTimeout(() => (w.style.backgroundColor = ""), 1200);
      break;
    }
  }
  document.getElementById("modal").style.display = "none";
}

// search
document.getElementById("search").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  const words = document.querySelectorAll(".word");
  words.forEach(w => {
    w.style.display = w.textContent.toLowerCase().includes(q) ? "block" : "none";
  });
});

// initialize
renderDrauctionary(drauctionaryData);
