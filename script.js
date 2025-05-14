const countrySelect = document.getElementById('country');
const countryCodeSelect = document.getElementById('countryCode');
const clicksInfo = document.getElementById('click-count');

function handleClick() {
    clickCount++;
    if (clicksInfo) clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) throw new Error('Błąd pobierania danych');
        const data = await response.json();

        const sorted = data.sort((a, b) =>
            a.name.common.localeCompare(b.name.common)
        );

        countrySelect.innerHTML =
            '<option value="">Wybierz kraj</option>' +
            sorted.map(c => `<option value="${c.name.common}">${c.name.common}</option>`).join('');

        countryCodeSelect.innerHTML =
            '<option value="">Wybierz kierunkowy</option>' +
            sorted
                .filter(c => c.idd && c.idd.root && c.idd.suffixes)
                .map(c => {
                    const code = `${c.idd.root}${c.idd.suffixes[0]}`;
                    return `<option value="${code}">${code} (${c.name.common})</option>`;
                })
                .join('');
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(res => res.json())
        .then(data => {
            const country = data.country;
            if (country) {
                countrySelect.value = country;
                getCountryCode(country);
            }
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
        .then(res => {
            if (!res.ok) throw new Error('Błąd pobierania danych');
            return res.json();
        })
        .then(data => {
            const root = data[0]?.idd?.root;
            const suffix = data[0]?.idd?.suffixes?.[0];
            if (!root || !suffix) return;

            const code = root + suffix;

            let found = false;
            for (const option of countryCodeSelect.options) {
                if (option.value === code) {
                    option.selected = true;
                    found = true;
                    break;
                }
            }

            // Jeśli kodu nie ma w select, dodajemy go
            if (!found) {
                const opt = document.createElement('option');
                opt.value = code;
                opt.textContent = `${code} (${countryName})`;
                opt.selected = true;
                countryCodeSelect.appendChild(opt);
            }
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
        });
}


(() => {
    document.addEventListener('click', handleClick);
    fetchAndFillCountries().then(() => getCountryByIP());
})();
