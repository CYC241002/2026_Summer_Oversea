(function() {
    class LineButton extends HTMLElement {
        connectedCallback() {
            this._render()

            const floatIconLink = this.shadowRoot.querySelector('.float-icons .float-icon a')
            const popup = this.shadowRoot.querySelector('.float-icons .popup')

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
        }

        _render() {
            const lineAccount = this.getAttribute('account') || ''
            const imgQRCodeUrl = this.getAttribute('qrcode') || ''

            if (lineAccount === '') {
                console.warn('LineButton: account attribute is required.')
                return
            }

            this.attachShadow({ mode: 'open' })
            this.shadowRoot.innerHTML = `
                <style>
                :host {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                }

                .float-icons .float-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    background-color: #fff;
                    padding: 10px;
                    border-radius: 50%;
                    z-index: 1001;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);;
                    --bs-btn-hover-bg: #5ebfc6;
                }

                .float-icons .float-icon:hover {
                    background-color: var(--bs-btn-hover-bg);
                }

                .float-icons .float-icon img {
                    width: 48px;
                    height: auto;
                }

                .float-icons .popup {
                    position: fixed;
                    bottom: 20px;
                    right: 100px;
                    background-color: #fff;
                    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
                    opacity: 0;
                    z-index: 1001;
                    visibility: hidden;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);;
                    border-radius: 8px;
                    padding: 1em;
                    text-align: center;
                }

                .float-icons .popup.show {
                    opacity: 1;
                    visibility: visible;
                }

                .float-icons .popup img {
                    width: 200px;
                    height: auto;
                }
                </style>
                <div class="float-icons">
                    <div class="float-icon">
                        <a href="#"><img src="img/Line_LOGO.svg"></a>
                    </div>
                    <div class="popup">
                        <img src="${imgQRCodeUrl}">
                        <p class="pt-2">歡迎加入救國團官方LINE洽詢<br><a class="btn btn-primary" href="https://line.me/R/ti/p/${lineAccount}" target="_blank">${lineAccount}</a></p>
                    </div>
                </div>
             `
        }
    }
    customElements.define('line-button', LineButton)
})()