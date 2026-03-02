(function(){
    fetch('./js/data.json').then(res => res.json()).then(data => {
        if (!data) {
            return
        }

        const elementCampMenuLinkList = document.querySelector('#campMenuLinkList')

        data["dates"].forEach((item) => {
            var menuLink = `<li><a class="dropdown-item" href="index.html#sec${item.session}">${item.area}</a></li>`
            elementCampMenuLinkList.innerHTML += menuLink
        })
    }).then(() => {
        const overlay = document.querySelector('.loading-overlay')
        overlay.style.opacity = 0
        setTimeout(() => {
            overlay.style.display = 'none'
        }, 1000)
    })
})()