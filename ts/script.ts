const apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const dataWordOutput = document.querySelector("[data-word-output]");
const searchBtn = document.querySelector("[data-search-btn]");
const searchInput = document.querySelector("[data-search]");

searchInput?.addEventListener("change", (e) => {
  const input = e.target as HTMLInputElement;
  getData(`${apiUrl}${input.value}`);
});

searchBtn?.addEventListener("click", (e) => {
  const input = searchInput as HTMLInputElement;
  getData(`${apiUrl}${input.value}`);
});

interface Definiton {
  definition: string;
}

interface Meaning {
  partOfSpeech: string;
  synonyms: Array<string>;
  definitions: Array<Definiton>;
}

interface Phonetic {
  text: string;
}

interface DictData {
  word: string;
  phonetic: string;
  phonetics: Array<Phonetic>;
  meanings: Array<Meaning>;
  sourceUrls: Array<string>;
}

async function getData(url: string): Promise<void> {
  const response: Response = await fetch(url);
  const data: Array<DictData> = await response.json();
  const dictData: DictData = data[0];
  show(dictData);
}

function show(dictData: DictData): void {
  dataWordOutput!.innerHTML = "";
  showWord(dictData);
  showMeanings(dictData);
  footer(dictData);
}

function showWord(dictData: DictData): void {
  const wordResult = document.createElement("section");
  wordResult.classList.add("word-result");
  wordResult.innerHTML = `
    <h1 class="word-title">${dictData.word}</h1>
    `;
  if (dictData.phonetic) {
    wordResult.innerHTML += `<span class="phonetic">${dictData.phonetic}</span>`;
  } else {
    for (const phonetic of dictData.phonetics) {
      if (phonetic.text) {
        wordResult.innerHTML += `<span class="phonetic">${phonetic.text}</span>`;
        break;
      }
    }
  }

  dataWordOutput?.append(wordResult);
}

function showMeanings(dictData: DictData): void {
  const meaningContainer = document.createElement("section");
  meaningContainer.classList.add("meaning-container");
  for (const meaning of dictData.meanings) {
    const meaningEl = document.createElement("article");
    meaningEl.classList.add("meaning");
    meaningEl.innerHTML = `
    <div class="part-of-speech-container">
        <h3 class="part-of-speech">${meaning.partOfSpeech}</h3>
        <div class="line"></div>
    </div>
    <h4 class="meaning-word">Meaning</h4>
    `;

    const listDefinitions = document.createElement("ul");
    listDefinitions.classList.add("list-definitions");
    for (const definition of meaning.definitions) {
      const definitionEl = document.createElement("li");
      definitionEl.classList.add("definition");
      definitionEl.innerText = definition.definition;
      listDefinitions.append(definitionEl);
    }

    meaningEl.append(listDefinitions);

    if (meaning.synonyms.length > 0) {
      const synonyms = document.createElement("div");
      synonyms.classList.add("synonyms");
      synonyms.innerHTML = `<span class="synonym">Synonyms</span>`;
      for (const synonym of meaning.synonyms) {
        const synonymEl = document.createElement("span");
        synonymEl.classList.add("synonym-word");
        synonymEl.innerText = synonym;
        synonyms.append(synonymEl);
      }
      meaningEl.append(synonyms);
    }

    meaningContainer.append(meaningEl);
  }
  dataWordOutput?.append(meaningContainer);
}

function footer(dictData: DictData): void {
  const line = document.createElement("div");
  line.classList.add("line");
  dataWordOutput?.append(line);
  const footer = document.createElement("footer");
  footer.classList.add("footer");
  footer.innerHTML = `
  <span class="source-word">Source</span>
  <a href="${dictData.sourceUrls[0]}" class="source-url">${dictData.sourceUrls[0]}</a>
  `;
  dataWordOutput?.append(footer);
}
