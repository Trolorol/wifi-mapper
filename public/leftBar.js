async function showPointInfo(pointId) {
    const response = await fetch(`/api/points?id=${pointId}`);
    const point = await response.json();
    let result = point.result[0]
    console.log(response)
    leftBar = document.getElementById("left-bar");
    html = `<div class="point-card">
                <div class="point-card-header" id="card-header">${result.bssid}</div>
                <div class="point-card-main">
                    <i class="material-icons">wifi</i>
                    <div class="point-card-main-description">
                        <i class="material-icons" style="font-size:12px;">signal_cellular_alt</i>
                        <section id="strenght">${result.strength}</section>
                        <i class="material-icons" style="font-size: 12px;">location_on</i>
                        <section id="location">${result.st_x}, ${result.st_y}</section>
                        <i class="material-icons" style="font-size: 12px;">shield</i>
                        <section id="encryption">${result.encryption}</section>
                    </div>
                </div>
            </div>`
    leftBar.innerHTML += html;
}

// const pointBssid = document.getElementById('card-header');
// pointBssid.innerHTML = `${result.bssid}`
// const strenght = document.getElementById('strenght');
// strenght.innerHTML = `${result.strength}`
// const location = document.getElementById('location');
// location.innerHTML = `${result.st_x}, ${result.st_y}`
// const encryption = document.getElementById('encryption');
// encryption.innerHTML = `${result.encryption}`