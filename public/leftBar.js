 function showPointInfo(pointObject) {
     leftBar = document.getElementById("left-bar");
     html = `
            <div class="point-card" id="${pointObject.id}">
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
                        <a href="#openModal" class='modalAnchor'>
                        <button onclick="popUpInfo(${pointObject.id})">Edit Info</button>
                        <a/>
                        <button onclick="goToPoint(${pointObject.st_y}, ${pointObject.st_x})">Go To</button>
                    </div>
                </div>
            </div>
            `
     leftBar.innerHTML += html;
 }