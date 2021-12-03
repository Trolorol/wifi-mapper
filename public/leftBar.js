async function showPointInfo(pointId) {
    const response = await fetch(`/api/points/${pointId}`);
    const point = await response.json();
    let result = point.result[0]
    console.log(result.bssid);
    // const pointInfo = document.getElementById('left-bar');
    // pointInfo.innerHTML = `<h3>${result.bssid}</h3>
    // <p>${result.security}</p>`;

}