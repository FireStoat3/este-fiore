window.onload = async () => {
    const baseUrl = window.location.origin;
    const file = await recoverAreaFile(baseUrl);
    buildMenu(file, baseUrl)

    const url = window.location.href
    if (url.includes("area.html")) {
        const params = new URLSearchParams(window.location.search);
        const areaName = params.get("area")
        buildAreaPage(baseUrl,file,areaName)
    }
}

const recoverAreaFile = async (baseUrl) => {
    const file = await fetch(baseUrl+"/json/area.json").then(async (file)=> {
        return await file.json()
    })
    return file
}

const buildMenu = async (areaFile, baseUrl) => {
    const keys = Object.keys(areaFile);
    let list = ""
    await keys.forEach((key)=> {
        list+=`<li><a href="${baseUrl}/pages/area.html?area=${key}">${key}</a></li>`
    })

    document.body.innerHTML = document.body.innerHTML.replace("{{MENU_LINK}}", list);
}

const buildAreaPage = async (baseUrl,areaFile,areaName) => {
    const area = areaFile[areaName]
    if (area) {
        document.body.innerHTML = document.body.innerHTML.replace("{{AREA_TITLE}}", areaName);
        document.body.innerHTML = document.body.innerHTML.replace("{{AREA_IMAGE}}", area["image"]);
        document.body.innerHTML = document.body.innerHTML.replace("{{AREA_DESCRIPTION}}", area["description"]);
        const areaPlaces = Object.keys(area["places"])
        console.log(areaPlaces)
        let placeList = ""
        let i = 1
        await areaPlaces.forEach((placeName) => {
            const currentPlace = area["places"][placeName]
            placeList+=`<li>
                <input type="checkbox" id="place${i}" class="hideElement">
                <label for="place${i}" id="place${i}Label">${placeName}</label>
                <div class="placeDiv" id="place${i}Div" role="alert">
                    <img alt="placeholder" src="../images/${currentPlace["image"]}">
                    <p>${currentPlace["description"]}</p>
                    <a href="${baseUrl}/pages/place.html?place=${placeName}">Visualizza dettagli</a>
                </div>
            </li>`;
            i+=1
        })
        document.body.innerHTML = document.body.innerHTML.replace("{{PLACE_LIST}}", placeList);
        i=1
        await areaPlaces.forEach((placeName) => {
            let item = document.getElementById(`place${i}`)
            item.style.cssText = ""
            i+=1
        })
    } else {
        console.log("nope") //TODO redirect to 404
    }
}