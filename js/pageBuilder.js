window.onload = async () => {
    const baseUrl = window.location.origin;
    const areaFile = await recoverAreaFile(baseUrl);
    const currentUrl = window.location.href

    buildMenu(areaFile, baseUrl, currentUrl)

    if (currentUrl.includes("area.html")) {
        const params = new URLSearchParams(window.location.search);
        const areaName = params.get("area")
        buildAreaPage(areaFile,areaName)
    } else if (currentUrl.includes("place.html")) {
        const placeFile = await recoverPlaceFile(baseUrl)
        const params = new URLSearchParams(window.location.search);
        const areaName = params.get("area")
        const placeName = params.get("place")
        buildPlacePage(placeFile,areaName,placeName)
    }
}

const recoverAreaFile = async (baseUrl) => {
    const repoName=baseUrl.includes("127.0.0.1")?"":"/este-fiore"
    const file = await fetch(baseUrl+repoName+"/json/area.json").then(async (file)=> {
        return await file.json()
    })
    return file
}

const recoverPlaceFile = async (baseUrl) => {
    const repoName=baseUrl.includes("127.0.0.1")?"":"/este-fiore"
    const file = await fetch(baseUrl+repoName+"/json/place.json").then(async (file)=> {
        return await file.json()
    })
    return file
}

const buildMenu = async (areaFile, baseUrl, currentUrl) => {
    const keys = Object.keys(areaFile);
    const repoName=baseUrl.includes("127.0.0.1")?"":"/este-fiore"
    const areaName = currentUrl.includes("area.html")?new URLSearchParams(window.location.search).get("area"):null;
    let list = ""
    await keys.forEach((key)=> {
        if(areaName!=null && currentUrl.includes("place.html")==false && areaName===key) {
            list+=`<li class="currentPage">${key}</li>`
        } else {
            list+=`<li><a href="${baseUrl}${repoName}/pages/area.html?area=${key}">${key}</a></li>`
        }
    })

    document.body.innerHTML = document.body.innerHTML.replace("{{MENU_LINK}}", list);
}

const buildPlacePage = async (placeFile,areaName,placeName) => {
    const area = placeFile[areaName]
    if (area!==undefined) {
        const place = area[placeName]
        if(place) {
            const breadcrumbList = `<li>></li><li><a href="./area.html?area=${areaName}">${areaName}</a></li><li>></li><li>${placeName}</li>`
            document.body.innerHTML = document.body.innerHTML.replace("{{BREADCRUMB_ITEMS}}", breadcrumbList);
            document.body.innerHTML = document.body.innerHTML.replace("{{PLACE_TITLE}}", placeName);
            const sections = Object.keys(place)
            let placePage = ""
            sections.forEach((sectionName) => {
                placePage += `<h3>${sectionName}</h3>`
                const sectionInfo = place[sectionName]
                const image = sectionInfo.image
                if(image) {
                    placePage+= `<img src="../images/${image}">`
                }
                placePage += `<p>${sectionInfo.description}</p>`
            })
            document.body.innerHTML = document.body.innerHTML.replace("{{PLACE_CONTENT}}", placePage);
        } else {
            window.location.replace("./404.html")
        }
    } else {
        window.location.replace("./404.html")
    }
}

const buildAreaPage = async (areaFile,areaName) => {
    const area = areaFile[areaName]
    if (area) {
        const breadcrumbList = `<li>></li><li>${areaName}</li>`
        document.body.innerHTML = document.body.innerHTML.replace("{{BREADCRUMB_ITEMS}}", breadcrumbList);
        document.body.innerHTML = document.body.innerHTML.replace("{{AREA_TITLE}}", areaName);
        document.body.innerHTML = document.body.innerHTML.replace("{{AREA_IMAGE}}", area["image"]);
        document.body.innerHTML = document.body.innerHTML.replace("{{AREA_DESCRIPTION}}", area["description"]);
        const areaPlaces = Object.keys(area["places"])
        let placeList = ""
        let i = 1
        await areaPlaces.forEach((placeName) => {
            const currentPlace = area["places"][placeName]
            placeList+=`<li>
                <input type="checkbox" id="place${i}" class="hideElement placeInput">
                <label class="placeLabel" for="place${i}" id="place${i}Label">${placeName}</label>
                <div class="placeDiv" id="place${i}Div" role="alert">`
            placeList+=currentPlace["image"]!=null?`<img alt="Foto di ${placeName} in ${areaName}" src="../images/${currentPlace["image"]}">`:""
            placeList+=`<p>${currentPlace["description"]}</p>
                    <a href="./place.html?area=${areaName}&place=${placeName}">Visualizza dettagli</a>
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
        window.location.replace("./404.html")
    }
}