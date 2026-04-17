(function(){
    fetch('./js/data.json', { cache: 'no-cache' }).then(res => res.json()).then(data => {
        if (!data) {
            return
        }

        const elementCampMenuLinkList = document.querySelector('#campMenuLinkList')

        data["dates"].forEach((item) => {
            var menuLink = `<li><a class="dropdown-item" href="index.html#sec${item.session}">${item.area}</a></li>`
            elementCampMenuLinkList.innerHTML += menuLink
        })
    }).then(() => {
        document.dispatchEvent(new CustomEvent('loading-complete', { bubbles: true, composed: true }))
    })
})()