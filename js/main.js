(function() {
    var floatIconLink = document.querySelector('.float-icons .float-icon a')
    var popup = document.querySelector('.float-icons .popup')

    floatIconLink.addEventListener('click', function(e) {
        e.preventDefault()
        e.stopPropagation()

        console.log("click")
        popup.classList.toggle('show')
    })

    popup.addEventListener('click', function(e) {
        e.preventDefault()
        e.stopPropagation()
    })

    popup.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.stopPropagation()
        })
    })

    document.addEventListener('click', function() {
        popup.classList.remove('show')
    })
})()