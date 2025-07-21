document.addEventListener("DOMContentLoaded", function() {
  var form = document.getElementById("myForm");
  if (form) {
    form.addEventListener("submit", formGonder);
  }
});

function formGonder(event) {
  event.preventDefault();
  var toplamPuan = document.getElementById("toplamPuanGoster").textContent;
  localStorage.setItem("toplamPuan", toplamPuan);
  window.location.href = "tesekkur.html";
}


function puanHesapla(radio, puanInputId) {
    var puan = radio.getAttribute('data-puan');
    document.getElementById(puanInputId).value = puan;
    toplamPuaniGuncelle();
}

function toplamPuaniGuncelle() {
    var toplam = 0;
    var puanInputs = document.querySelectorAll('input[type="number"][id^="puan"]');
    puanInputs.forEach(function(input) {
        toplam += parseInt(input.value) || 0;
    });
    document.getElementById("toplamPuan").value = toplam;
    document.getElementById("toplamPuanGoster").textContent = toplam;
}

document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("myForm");
    if (form) {
        form.addEventListener("submit", formGonder);
    }
});

function formGonder(event) {
    event.preventDefault();

    // Tüm zorunlu inputları seç
    var requiredInputs = document.querySelectorAll('#myForm input[required], #myForm textarea[required]');
    var eksik = false;

    requiredInputs.forEach(function(input) {
        if (!input.value.trim()) {
            eksik = true;
        }
    });

    if (eksik) {
        alert("Lütfen tüm alanları eksiksiz doldurun!");
        return false;
    }

    // Tüm puanlar için radio kontrolü (örnek: q1-q35)
    for (var i = 1; i <= 35; i++) {
        var radios = document.querySelectorAll('input[name="q' + i + '"]');
        var checked = Array.from(radios).some(r => r.checked);
        if (!checked) {
            alert("Lütfen tüm sorular için Evet/Hayır seçimi yapın!");
            return false;
        }
    }

    // Her şey tamamsa puanı kaydet ve yönlendir
    var toplamPuan = document.getElementById("toplamPuanGoster").textContent;
    localStorage.setItem("toplamPuan", toplamPuan);
    window.location.href = "tesekkur.html";
}