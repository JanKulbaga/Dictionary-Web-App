var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const dataWordOutput = document.querySelector("[data-word-output]");
const searchBtn = document.querySelector("[data-search-btn]");
const searchInput = document.querySelector("[data-search]");
searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("change", (e) => {
    const input = e.target;
    getData(`${apiUrl}${input.value}`);
});
searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener("click", (e) => {
    const input = searchInput;
    getData(`${apiUrl}${input.value}`);
});
function getData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        const data = yield response.json();
        const dictData = data[0];
        show(dictData);
    });
}
function show(dictData) {
    dataWordOutput.innerHTML = "";
    showWord(dictData);
    showMeanings(dictData);
    footer(dictData);
}
function showWord(dictData) {
    const wordResult = document.createElement("section");
    wordResult.classList.add("word-result");
    wordResult.innerHTML = `
    <h1 class="word-title">${dictData.word}</h1>
    `;
    if (dictData.phonetic) {
        wordResult.innerHTML += `<span class="phonetic">${dictData.phonetic}</span>`;
    }
    else {
        for (const phonetic of dictData.phonetics) {
            if (phonetic.text) {
                wordResult.innerHTML += `<span class="phonetic">${phonetic.text}</span>`;
                break;
            }
        }
    }
    dataWordOutput === null || dataWordOutput === void 0 ? void 0 : dataWordOutput.append(wordResult);
}
function showMeanings(dictData) {
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
    dataWordOutput === null || dataWordOutput === void 0 ? void 0 : dataWordOutput.append(meaningContainer);
}
function footer(dictData) {
    const line = document.createElement("div");
    line.classList.add("line");
    dataWordOutput === null || dataWordOutput === void 0 ? void 0 : dataWordOutput.append(line);
    const footer = document.createElement("footer");
    footer.classList.add("footer");
    footer.innerHTML = `
  <span class="source-word">Source</span>
  <a href="${dictData.sourceUrls[0]}" class="source-url">${dictData.sourceUrls[0]}</a>
  `;
    dataWordOutput === null || dataWordOutput === void 0 ? void 0 : dataWordOutput.append(footer);
}
