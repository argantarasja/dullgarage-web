// Deklarasi Elemen Utama
const selectLayanan = document.getElementById('layanan');
const btnTopUp = document.getElementById('btn-topup');

// Area Form Kontainer
const inputGameArea = document.getElementById('input-game-area');
const inputEwalletArea = document.getElementById('input-ewallet-area');
const inputPulsaArea = document.getElementById('input-pulsa-area');
const serverArea = document.getElementById('server-area');
const labelId = document.getElementById('label-id');

// Area List Produk (Game)
const listFfDm = document.getElementById('list-ff-dm');
const listFfMember = document.getElementById('list-ff-member');
const listMlDm = document.getElementById('list-ml-dm');
const listMlMember = document.getElementById('list-ml-member');

const diamondCards = document.querySelectorAll('.diamond-card');

let selectedProduct = "";

// Fungsi untuk menyembunyikan semua list produk game
function hideAllGameLists() {
    [listFfDm, listFfMember, listMlDm, listMlMember].forEach(el => el.classList.add('hidden'));
}

// Logika Ganti Layanan (Dropdown Utama)
selectLayanan.addEventListener('change', function() {
    const val = this.value;
    
    // Reset status & Sembunyikan semua area
    hideAllGameLists();
    [inputGameArea, inputEwalletArea, inputPulsaArea].forEach(el => el.classList.add('hidden'));
    diamondCards.forEach(c => c.classList.remove('selected'));
    selectedProduct = "";

    // Reset isi input
    document.querySelectorAll('input').forEach(input => {
        if(input.id !== 'nama') input.value = "";
    });

    if (val === "") return;

    if (val === "Pulsa") {
        inputPulsaArea.classList.remove('hidden');
    } else if (val === "E-Wallet") {
        inputEwalletArea.classList.remove('hidden');
    } else {
        inputGameArea.classList.remove('hidden');
        if (val.includes("Free Fire")) {
            serverArea.classList.add('hidden');
            labelId.innerText = "ID Player Free Fire";
            if (val === "Free Fire Diamond") listFfDm.classList.remove('hidden');
            if (val === "Free Fire Membership") listFfMember.classList.remove('hidden');
        } else if (val.includes("Mobile Legends")) {
            serverArea.classList.remove('hidden');
            labelId.innerText = "ID ML";
            if (val === "Mobile Legends Diamond") listMlDm.classList.remove('hidden');
            if (val === "Mobile Legends Starlight") listMlMember.classList.remove('hidden');
        }
    }
});

// Pilihan Produk Game (Klik Kartu)
diamondCards.forEach(card => {
    card.addEventListener('click', function() {
        diamondCards.forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selectedProduct = this.getAttribute('data-value');
    });
});

// Eksekusi Pengiriman Pesan WhatsApp
btnTopUp.addEventListener('click', function() {
    const nama = document.getElementById('nama').value;
    const layanan = selectLayanan.value;
    const noAdmin = "6282135635638";
    let pesan = "";

    if (!nama || !layanan) {
        alert("Mohon isi Nama dan Pilih Layanan!");
        return;
    }

    if (layanan === "Pulsa") {
        const noHp = document.getElementById('nomor-pulsa').value;
        const harga = document.getElementById('nominal-pulsa').value;
        if (!noHp || !harga) { alert("Lengkapi data pulsa!"); return; }

        pesan = `Assalamualaikum, permisi kak. Saya atas nama *${nama}* ingin top up pulsa dengan nomor *${noHp}* dan harga *${harga}*, terimakasih.`;

    } else if (layanan === "E-Wallet") {
        const jenisEwallet = document.getElementById('kategori-ewallet').value;
        const nomorEwallet = document.getElementById('nomor-ewallet').value;
        const hargaEwallet = document.getElementById('nominal-ewallet').value;
        if (!jenisEwallet || !nomorEwallet || !hargaEwallet) { alert("Lengkapi data E-Wallet!"); return; }

        pesan = `Assalamualaikum, permisi kak. Saya atas nama *${nama}* ingin top up *${layanan}* untuk kategori E-Wallet *${jenisEwallet}* dengan nomor *${nomorEwallet}* dan harga *${hargaEwallet}*, terimakasih.`;

    } else {
        // Logika Produk Game
        const gameId = document.getElementById('id-game').value;
        const serverId = document.getElementById('id-server').value;
        if (!selectedProduct || !gameId) { alert("Pilih produk dan isi ID game!"); return; }

        let idTujuan = gameId;
        if (layanan.includes("Mobile Legends")) {
            if (!serverId) { alert("Isi Server ID!"); return; }
            idTujuan = `${gameId} (${serverId})`;
        }

        const info = selectedProduct.split('|'); 
        pesan = `Assalamualaikum, permisi kak. Saya atas nama *${nama}* ingin top up *${info[0]}* dengan id *${idTujuan}* seharga *${info[1]}*, terimakasih.`;
    }

    // Redirect ke WhatsApp
    const waUrl = `https://wa.me/${noAdmin}?text=${encodeURIComponent(pesan)}`;
    window.open(waUrl, '_blank');
});
