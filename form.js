document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("myForm");
    if (form) {
        form.addEventListener("submit", formGonder);
    }
});

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

async function formGonder(event) {
    event.preventDefault();

    console.log("Form gönderiliyor...");

    // Önce API test et
    try {
        console.log("1. API test ediliyor...");
        var testResponse = await fetch('http://localhost:5001/api/FormData/test-connection');
        
        if (!testResponse.ok) {
            throw new Error(`API test başarısız: ${testResponse.status}`);
        }
        
        var testResult = await testResponse.json();
        console.log("API Test Sonucu:", testResult);
        
        if (!testResult.connected) {
            alert("Veritabanı bağlantısı başarısız! appsettings.json dosyasını kontrol edin.");
            return;
        }
    } catch (error) {
        console.error("API Test Hatası:", error);
        alert("API'ye bağlanılamıyor: " + error.message);
        return;
    }

    // HTML'den veri al (gerçek HTML ID'lerinize göre düzenleyin)
    function getElementValue(id) {
        var element = document.getElementById(id);
        if (!element) {
            console.warn(`Element bulunamadı: ${id}`);
            return null;
        }
        return element.type === 'checkbox' ? element.checked : element.value;
    }

    var data = {
        surucu_adi: getElementValue("SürücüName") || getElementValue("surucu_adi") || "",
        tarih: getElementValue("date") || getElementValue("tarih") || "",
        saat: getElementValue("time") || getElementValue("saat") || "",
        arac_no: parseInt(getElementValue("AracNo") || getElementValue("arac_no")) || 0,
        personel_adi: getElementValue("PersonelName") || getElementValue("personel_adi") || "",
        ucus_no: parseInt(getElementValue("UcusNo") || getElementValue("ucus_no")) || 0,
        park_pozisyonu: getElementValue("ParkPozisyonu") || getElementValue("park_pozisyonu") || "",
        kuyruk_no: parseInt(getElementValue("KuyrukNo") || getElementValue("kuyruk_no")) || 0,
        kontrol_eden: getElementValue("KontrolEden") || getElementValue("kontrol_eden") || "",
        galley_bc: getElementValue("galley") || false,
        orta: getElementValue("orta") || false,
        yc_kapi1: getElementValue("kapı1") || getElementValue("yc_kapi1") || false,
        yc_kapi2: getElementValue("kapı2") || getElementValue("yc_kapi2") || false,
        SoruMetni: getElementValue("aciklama") || getElementValue("SoruMetni") || null,
        evet_soru_metni: false,
        Aciklama: getElementValue("aciklama") || getElementValue("Aciklama") || null,
        ToplamPuan: parseInt(getElementValue("toplamPuanGoster") || getElementValue("ToplamPuan")) || 0
    };

    console.log("2. Gönderilecek veri:", data);

    // Zorunlu alanları kontrol et
    var requiredFields = ['surucu_adi', 'tarih', 'saat', 'personel_adi', 'park_pozisyonu', 'kontrol_eden'];
    var missingFields = [];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field] === "") {
            missingFields.push(field);
        }
    });

    if (data.arac_no === 0 || data.ucus_no === 0 || data.kuyruk_no === 0) {
        missingFields.push('Sayısal alanlar');
    }

    if (missingFields.length > 0) {
        alert("Eksik alanlar: " + missingFields.join(", "));
        console.error("Eksik alanlar:", missingFields);
        return;
    }

    try {
        console.log("3. POST isteği gönderiliyor...");
        debugger
        var response = await fetch('http://localhost:5001/api/FormData/CreateForm', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        console.log("4. Response Status:", response.status);

        if (response.ok) {
            var result = await response.json();
            console.log("5. Başarılı Sonuç:", result);
            sessionStorage.setItem("toplamPuan", document.getElementById("toplamPuanGoster").textContent);
        
            // Form'u temizle veya başka sayfaya yönlendir
         window.location.href = "tesekkur.html";
         
        } else {
            var errorText = await response.text();
            console.error("6. API Error Status:", response.status);
            console.error("7. API Error Text:", errorText);
            alert('❌ Hata: ' + response.status + ' - ' + errorText);
        }
    } catch (error) {
        console.error("8. Network Error:", error);
        alert('❌ Bağlantı hatası: ' + error.message);
    }
}
// Form cevabı gönderme
const submitAnswer = async (answerData) => {
    const response = await fetch('/api/FormData/SubmitAnswer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            formId: answerData.formId,
            questionId: answerData.questionId,
            answer: answerData.answer,
            notes: answerData.notes,
            answeredBy: answerData.answeredBy
        })
    });
    
    return await response.json();
};