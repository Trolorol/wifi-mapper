async function showPointInfo(pointObject) {
    leftBar = document.getElementById("left-bar");
    html = `<a href="#openModal" class='modalAnchor'>
            <div href="#openModal" class="point-card" style="cursor: pointer;" href="#openModal">
                <div class="point-card-header" id="card-header">${pointObject.bssid}</div>
                <div class="point-card-main">
                    <i class="material-icons">wifi</i>
                    <div class="point-card-main-description">
                        <i class="material-icons" style="font-size:12px;">signal_cellular_alt</i>
                        <section id="strenght">${pointObject.strength}</section>
                        <i class="material-icons" style="font-size: 12px;">location_on</i>
                        <section id="location">${pointObject.st_x}, ${pointObject.st_y}</section>
                        <i class="material-icons" style="font-size: 12px;">shield</i>
                        <section id="encryption">${pointObject.encryption}</section>
                    </div>
                </div>
            </div>
            <a/>`
    leftBar.innerHTML += html;
}