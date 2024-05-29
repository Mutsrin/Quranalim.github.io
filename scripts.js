const BASE_URL = "https://equran.id/api/v2";

let selectedAudio = "01"; 

const quranSurah = async () => {
    const endpoint = `${BASE_URL}/surat`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data.data;
};

const quranDetail = async (nomor) => {
    const endpoint = `${BASE_URL}/surat/${nomor}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data.data;
};

const playNextAyah = (ayatList, currentAyatIndex) => {
    const audioElement = document.getElementById('quran-audio');
    if (currentAyatIndex < ayatList.length - 1) {
        const nextAyatIndex = currentAyatIndex + 1;
        audioElement.src = ayatList[nextAyatIndex].audio['01'];
        audioElement.play();
        audioElement.dataset.currentAyatIndex = nextAyatIndex;
    }
};

const playSurah = (surah) => {
    document.querySelector(`#text-arabic`).innerHTML = "";
    const deskripsiAyat = `<div class="row mt-2 deskripsi-surah">
                            <div class="col-12">
                            <div class="list-group shadow-sm">
                            <strong>${surah.nama}</strong><br>
                            Nomor: ${surah.nomor}<br>
                            Nama Latin: ${surah.namaLatin}<br>
                            Jumlah Ayat: ${surah.jumlahAyat}<br>
                            Tempat Turun: ${surah.tempatTurun}<br>
                            Arti: ${surah.arti}<br>
                            Deskripsi: ${surah.deskripsi}
                            </div>
                            <button id="play-surah" class="btn btn-primary mt-3"><i class="fa fa-play"></i></button>
                            <button id="stop-surah" class="btn btn-danger mt-3"><i class="fa fa-stop"></i></button>
                            </div>
                            </div>`;
    document.querySelector(`#text-arabic`).insertAdjacentHTML("beforeend", deskripsiAyat);
    quranDetail(surah.nomor).then((ayat) => {
        const ayatList = ayat.ayat;
        ayatList.forEach((ayah, index) => {
            const ayatHTML = `<div class="row mt-4 ayat">
                              <div class="col-11">
                              <div class="list-group shadow-sm fs-3 text-end amiri" title="${ayah.teksIndonesia}">
                              ${ayah.teksArab}
                              </div>
                              <div class="list-group shadow-sm translation">${ayah.teksIndonesia}</div>
                              </div>
                              <div class="col-1 d-flex align-items-center justify-content-center">
                              <button class="btn btn-outline-secondary" data-audio="${ayah.audio['01']}" data-ayat-index="${index}" disabled>${ayah.nomorAyat}</button>
                              </div>
                              </div>`;
            document.querySelector(`#text-arabic`).insertAdjacentHTML("beforeend", ayatHTML);
        });

        const audioElement = document.getElementById('quran-audio');
        audioElement.dataset.ayatList = JSON.stringify(ayatList);

        document.querySelectorAll(".btn-outline-secondary").forEach((button) => {
            button.addEventListener("click", function () {
                const audioURL = this.getAttribute("data-audio");
                audioElement.src = audioURL;
                audioElement.play();
                audioElement.dataset.currentAyatIndex = this.getAttribute("data-ayat-index");
                audioElement.dataset.ayatList = JSON.stringify(ayatList);
            });
        });

        audioElement.addEventListener('ended', () => {
            const currentAyatIndex = parseInt(audioElement.dataset.currentAyatIndex);
            playNextAyah(ayatList, currentAyatIndex);
        });

        document.getElementById('play-surah').addEventListener('click', function () {
            audioElement.src = ayatList[0].audio['01'];
            audioElement.play();
            audioElement.dataset.currentAyatIndex = 0;
        });

        document.getElementById('stop-surah').addEventListener('click', function () {
            audioElement.pause();
            audioElement.currentTime = 0;
        });
    });
};

quranSurah().then((surat) => {
    surat.forEach((surah) => {
        const list = `<a href="#" class="list-group-item list-group-item-action" id="surah-${surah.nomor}">
        ${surah.nomor} - ${surah.namaLatin} (${surah.nama})
        </a>`;
document.querySelector("#daftar-surah").insertAdjacentHTML("beforeend", list);

document.querySelector(`#surah-${surah.nomor}`).addEventListener("click", function (event) {
event.preventDefault();
playSurah(surah);
});
});
});


