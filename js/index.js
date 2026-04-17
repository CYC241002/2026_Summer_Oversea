(function() {
    const SHEET_DAY_PRICE_LIST = {
        "airfare": "機票" ,
        "traffic": "交通",
        "lodging": "住宿",
        "visit": "參訪",
        "ticket": "門票",
        "catering": "部分餐食",
        "insurance": "保險",
        "tip": "小費",
        "visa_fee": "簽證費用",
        "consume": "個人消費",
        "self_catering": "自理餐食",
        "personal_travel_insurance": "個人旅遊平安險",
        "hotel_tip": "飯店行李小費"
    }

    class SessionCard extends HTMLElement {
        connectedCallback() {
            const scriptTag = this.querySelector('script[type="application/json"]')

            if (!scriptTag?.textContent.trim()) return

            try {
                this._data = JSON.parse(scriptTag.textContent)
            } catch (e) {
                console.error("SessionCard data error:", e)
                return
            }

            if (!this._data?.session) return

            this._render(this._data)
        }

        _render(context) {
            if (!context) return

            this.innerHTML = `
                <style>
                    session-card .card .card-text .info {
                        font-size: 0.9em;
                    }

                    session-card .card .card-text .info .spot::before {
                        content: ' | ';
                        padding-left: 0.1em;
                        padding-right: 0.1em;
                    }

                    session-card .card {
                        transition: .3s;
                    }

                    session-card .card:hover {
                        transform: scale(1.02);
                    }

                    session-card .card a {
                        text-decoration: none;
                        color: #000;
                    }

                    @media (min-width: 1400px) {
                        session-card .card {
                            height: 27.5em;
                        }
                    }
                </style>
                <div>
                    <div class="card shadow-sm m-2 p-2">
                        <a href="#sec${context.session}">
                            <img class="card-img-top" src="img/${context.session}/${context.session}_header.jpg">
                            <div class="card-body">
                                <h6 class="card-subtitle text-body-secondary">${context.code}</h6>
                                <h5 class="card-title">${context.area}</h5>
                                <div class="card-text">
                                    <div class="info">
                                        <p class="d-flex align-items-center mb-1"><span class="material-symbols-outlined pe-2">travel</span><span class="days">${calculateDays(context.startDate, context.endDate)}日</span><span class="spot">${context.mainVisit}</span></p>
                                        <p class="d-flex align-items-center"><span class="material-symbols-outlined pe-2">group</span>${context.target}</p>
                                    </div>
                                    <p>${toShortDate(context.startDate)}~${toShortDate(context.endDate)}(${toChineseDate(context.startDate, true)}-${toChineseDate(context.endDate, true)})</p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            `
        }
    }
    class SessionSection extends HTMLElement {
        connectedCallback() {
            const scriptTag = this.querySelector('script[type="application/json"]')

            if (!scriptTag?.textContent.trim()) return

            try {
                console.log(scriptTag.textContent)

                const {item, gallery, schedule, flight} = JSON.parse(scriptTag.textContent)
                this._item = item
                this._gallery = gallery
                this._schedule = schedule
                this._flight = flight
            } catch (e) {
                console.error("SessionCard data error:", e)
                return
            }

            if (!this._item?.session) return

            this._render(this._item, this._gallery, this._schedule, this._flight)
        }

        _render(context, gallery, schedule, flights) {
            if (!context) return

            var isAbleToRegister = context.status === 'PREPARATION' ? true : false

            this.innerHTML = `
                <style>
                session-section .hero-section {
                    height: 100%;
                    min-height: 400px;
                    max-height: 100vh;
                }

                session-section .hero-section img {
                    width: 100%;
                    height: 100vh;
                    object-fit: cover;
                    filter: brightness(60%) contrast(95%);
                }

                session-section .hero-section .description {
                    position: absolute;
                    left: 0;
                    top: 0;
                    color: #fff;
                    text-align: center;
                    z-index: 100;
                }

                session-section .hero-section .description .inner .number {
                    font-weight: bold;
                    margin-bottom: 0.25em;
                    text-shadow: 0.1em 0.1em 0.2em #000;
                }

                session-section .hero-section .description .inner h1 {
                    text-shadow: 0.1em 0.1em 0.2em #000;
                }

                .hero-section .description .inner .sub {
                    width: 90%;
                    max-width: 25em;
                    margin: 0 auto;
                    background-color: rgba(0, 0, 0, 0.5);
                }

                session-section .hero-section .description .inner .sub .detail-text {
                    display: inline-block;
                    text-align: left;
                }

                session-section .hero-section .description .emphasis {
                    font-size: 1.5em;
                }

                session-section .detail-link {
                    min-height: 3.5em;
                    position: sticky; 
                    top: 3.8em;
                    z-index: 1000;
                    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
                }

                session-section .detail-link .nav a {
                    width: 8vw;
                    min-width: 96px;
                    text-decoration: none;
                }

                session-section .detail-link .nav a .inner {
                    padding: 1em;
                    transition: .3s;
                    text-align: center;
                    color: #fff;
                }

                session-section .detail-link .nav a:hover .inner {
                    background-color: rgba(0, 0, 0, 0.5);
                }

                session-section .feature-img {
                    text-align: center;
                }

                session-section .feature-img img {
                    width: 100%;
                    height: auto;
                }

                @media (min-width: 768px) {
                    session-section .feature-img img {
                        max-width: 600px;
                        height: auto;
                    }
                }

                session-section .feature {
                    margin-top: 1em;
                    margin-left: auto;
                    margin-right: auto;
                }

                session-section .feature p {
                    font-size: 1.2em;
                    font-weight: bold;
                    margin: 0;
                    padding-top: 0.1em;
                    padding-bottom: 0.1em;
                    display: flex;
                    align-items: flex-start;
                }

                session-section .feature p::before {
                    content: '★';
                    flex-shrink: 0;
                    width: 1.5em;
                    text-align: center;
                    padding-right: 0.25em;
                    padding-left: 0.25em;
                }

                session-section .photolist .img-fluid {
                    transition: .1s;
                }

                session-section .photolist .img-fluid:hover {
                    transform: scale(1.02);
                }

                session-section .row {
                    margin-left: 0;
                    margin-right: 0;
                }

                session-section .daily-header > div {
                    color: #000;
                    background-color: RGBA(var(--bs-third-rgb),var(--bs-bg-opacity,1))!important;
                }


                session-section .daily-row .material-symbols-outlined {
                    vertical-align: middle;
                    padding-right: 0.1em;
                }

                session-section .daily-row .img-fluid {
                    transition: .1s;
                }

                session-section .daily-row .img-fluid:hover {
                    transform: scale(1.02);
                }

                session-section section.area {
                    background-repeat: no-repeat;
                    background-position: center bottom;
                    background-size: 100% auto;
                    background-attachment: fixed;
                }

                session-section .daily.daily-row {
                    padding-top: 2em;
                    padding-bottom: 2em;
                }

                session-section .daily.daily-row:not(:last-child) {
                    border-bottom: 1px solid var(--bs-primary-bg);
                }
                    
                session-section .daily-schedule {
                    counter-reset: schedule-counter;
                }

                session-section .daily-row {
                    display: flex;
                    flex-direction: column;
                }

                session-section .daily-schedule .daily-row .day-count {
                    counter-increment: schedule-counter;
                    font-size: 1.25em;
                    font-weight: bold;
                    padding: 0.25em;
                    margin: 0;
                    text-align: center;
                    align-self: center;
                }

                session-section .daily-schedule .daily-row .day-count .day-count-number, 
                session-section .daily-schedule .daily-row .day-count .day-count-no-number {
                    width: 4em;
                    height: 4em;
                    font-size: 0.5em;
                    background-color: var(--bs-primary-bg);
                    color: #fff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                }

                session-section .daily-schedule .daily-row .day-count .day-count-number::before {
                    content: "Day "counter(schedule-counter);
                }

                session-section .daily-schedule .daily-row .day-count .day-count-no-number {
                    text-align: center;
                }

                @media (min-width: 768px) {
                    session-section .daily-row {
                        flex-direction: row;
                    }

                    session-section .daily-schedule .daily-row .day-count .day-count-number, 
                    session-section .daily-schedule .daily-row .day-count .day-count-no-number {
                        width: 5em;
                        height: 5em;
                        font-size: 1em;
                    }
                }

                session-section .daily-schedule h2 {
                    font-size: 1.5em;
                }

                session-section .daily-schedule h3 {
                    font-size: 1.25em;
                }

                /* 航班資訊 */
                session-section .daily-schedule .flight .flight-row .spend-time::before,
                session-section .daily-schedule .flight .flight-row .spend-time::after {
                    content: ' ';
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background-color: #666;
                    border-radius: 50%;
                    bottom: -5px;
                }

                session-section .daily-schedule .flight .flight-row .spend-time::before {
                    left: 0;
                    transform: translateX(-50%);
                }

                session-section .daily-schedule .flight .flight-row .spend-time::after {
                    right: 0;
                    transform: translateX(50%);
                }

                session-section .daily-schedule .flight .flight-row .spend-time {
                    position: relative;
                    display: inline-block;
                    text-align: center;
                    border-bottom: 1px solid #666;
                }

                session-section .daily-schedule .flight ul.post-script {
                    list-style-type: none;
                    padding-top: 1em;
                    padding-left: 20px;
                }

                session-section .daily-schedule .flight ul.post-script li::before {
                    content: '※';
                    margin-right: 10px;
                }

                session-section .price-icon {
                    width: 32px;
                    height: 32px;
                    background-image: url('img/icon_sprites.png');
                }

                session-section .price-icon.icon-airfare { /* 機票 */
                    background-position: -10px -10px;
                }

                session-section .price-icon.icon-traffic { /* 交通 */
                    background-position: -62px -10px;
                }

                session-section .price-icon.icon-lodging { /* 住宿 */
                    background-position: -10px -62px;
                }

                session-section .price-icon.icon-visit { /* 參訪 */
                    background-position: -62px -62px;
                }

                session-section .price-icon.icon-ticket { /* 門票 */
                    background-position: -114px -10px;
                }

                session-section .price-icon.icon-catering { /* 部分餐食 */
                    background-position: -114px -62px;
                }

                session-section .price-icon.icon-insurance { /* 保險 */
                    background-position: -10px -114px;
                }

                session-section .price-icon.icon-tip { /* 小費 */
                    background-position: -62px -114px;
                }

                session-section .price-icon.icon-visa_fee { /* 簽證費用 */
                    background-position: -114px -114px;
                }

                session-section .price-icon.icon-consume { /* 個人消費 */
                    background-position: -166px -10px;
                }

                session-section .price-icon.icon-self_catering { /* 自理餐食 */
                    background-position: -166px -62px;
                }

                session-section .price-icon.icon-personal_travel_insurance { /* 個人旅遊平安險 */
                    background-position: -166px -114px; 
                }

                session-section .price-icon.icon-hotel_tip { /* 飯店行李小費 */
                    background-position: -10px -166px;
                }
                </style>
                <section style="background-color: ${context.backColor || '#fff'} !important; color: ${context.textColor || '#000'} !important;" class="area">
                    <a name="sec${context.session}"></a>
                    <div class="hero-section row m-0">
                        <div class="col-12 h-100 w-100 p-0" style="position: relative;">
                            <img src="img/${context.session}/${context.session}_header.jpg">
                            <div class="description row row-cols-1 w-100 h-100 d-flex align-items-center">
                                <div class="inner">
                                    <p class="number">${context.code}</p>
                                    <h1 class="fw-bold">${context.area}</h1>
                                    <div class="sub rounded p-3">
                                        <p class="mx-auto detail-text">活動日期：${toChineseDate(context.startDate)}至${toChineseDate(context.endDate)}<br>報名對象：${context.target}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="detail-link row m-0 mb-5" style="background-color: ${context.subColor || '#000'} !important;">
                        <div class="m-auto row col-12 col-lg-9 align-items-center">
                            <div class="nav col-12 col-lg-6 d-flex justify-content-center justify-content-md-start align-items-center h-100">
                                <a href="#sec${context.session}-intro" class="h-100"><div class="inner" style="color: ${context.subLinkColor || '#fff'};">營隊特色</div></a>
                                <a href="#sec${context.session}-daily-schedule" class="h-100"><div class="inner" style="color: ${context.subLinkColor || '#fff'};">每日行程</div></a>
                                <a href="#sec${context.session}-attention" class="h-100"><div class="inner" style="color: ${context.subLinkColor || '#fff'};">注意事項</div></a>
                            </div>
                            <div class="col-12 col-lg-6 d-flex justify-content-center justify-content-md-end align-items-center h-100 p-2">
                                <div class="h-100">
                                    <a class="btn btn-primary${context.link !== '' && isAbleToRegister ? '' : ' disabled'}" href="${context.link !== '' && isAbleToRegister ? context.link : '#'}" target="_blank" role="button">
                                        ${(() => {
                                            if (isAbleToRegister) {
                                                return context.link === '' ? '尚未開放報名' : '優惠報名請點我！'
                                            } else {
                                                if (context.status === 'ON_SCHEDULE') {
                                                    return '出團中'
                                                } else if (context.status === 'ENDED') {
                                                    return '本次活動已結束，感謝關注'
                                                } else {
                                                    return '本次活動已取消'
                                                }
                                            } 
                                        })()}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="content row col-12 col-lg-9 m-auto">
                        <article class="row">
                            <a name="sec${context.session}-intro"></a>
                            <h1 class="text-center">營隊特色</h1>
                            <div class="feature w-75 p-3 rounded border border-secondary border-2">
                                ${markdownToHTML(context.feature)}
                            </div>
                            <div class="row mt-2 mb-2 photolist">
                                ${gallery.map((img) => `<div class="col-4 p-2"><img src="img/${context.session}/${img.fileName}" class="img-fluid" loading="lazy" alt="${img.description || '營隊照片'}"></div>`).join('')}
                            </div>
                        </article>
                        <article class="row daily-schedule">
                            <a name="sec${context.session}-daily-schedule"></a>
                            ${schedule ? schedule.map((daily) => {
                                var title = daily.theme != '' ? `${daily.theme}：${daily.route}` : daily.route
                                return `<div class="row col-12 daily daily-row">
                                    <div class="col-12 col-lg-2 d-flex flex-row flex-lg-column align-items-center gap-2 gap-lg-3"><p class="day-count"><span class="day-count-number"></span></p><span class="text-center">${daily.date}</span></div>
                                    <div class="col-12 col-lg-7 d-flex align-items-center p-1"><h2>${title.replace('\n', '<br>')}</h2></div>
                                    <div class="col-12 col-lg-3 row pt-3 pt-lg-0">
                                        ${daily.breakfast ? `<div class="col-4 col-lg-4 fw-bold"><span class="material-symbols-outlined">breakfast_dining</span>早餐</div><div class="col-8 col-lg-8">${daily.breakfast}</div>` : ''}
                                        ${daily.lunch ? `<div class="col-4 col-lg-4 fw-bold"><span class="material-symbols-outlined">lunch_dining</span>午餐</div><div class="col-8 col-lg-8">${daily.lunch}</div>` : ''}
                                        ${daily.dinner ? `<div class="col-4 col-lg-4 fw-bold"><span class="material-symbols-outlined">restaurant</span>晚餐</div><div class="col-8 col-lg-8">${daily.dinner}</div>` : ''}
                                        ${daily.accommodation ? `<div class="col-4 col-lg-4 fw-bold"><span class="material-symbols-outlined">hotel</span>旅館</div><div class="col-8 col-lg-8">${daily.accommodation}</div>` : ''}
                                    </div>
                                </div>`
                            }).join('') : ''}
                            <div class="row col-12 flight pt-4">
                                <h2 class="col-12 pb-2">參考航班<small class="text-secondary ps-2 fs-6">航班時間僅為參考。</small></h2>
                                ${flights ? flights.map((flight) => {
                                    var boundText = ''
                                    if (flight.type === 'outbound') {
                                        boundText = '去程'
                                    } else if (flight.type === 'inbound') {
                                        boundText = '返程'
                                    } else {
                                        boundText = '轉程'
                                    }

                                    var departAirportText = flight.departAirportRuby !== '' ? `<ruby>${flight.departAirport}<rp>(</rp><rt>${flight.departAirportRuby}</rt><rp>)</rp></ruby>` : flight.departAirport
                                    var arriveAirportText = flight.arriveAirportRuby !== '' ? `<ruby>${flight.arriveAirport}<rp>(</rp><rt>${flight.arriveAirportRuby}</rt><rp>)</rp></ruby>` : flight.arriveAirport
                                    return `<div class="col-12 row flight-row d-flex align-items-center border border-primary border-1 rounded p-1">
                                        <div class="col-2 col-lg-1">
                                            <p class="badge rounded-pill text-bg-info fs-6 m-0">${boundText}</p>
                                        </div>
                                        <div class="col-10 col-lg-4">
                                            <p class="fs-6 m-0">${flight.flight}</p>
                                        </div>
                                        <div class="col-3 d-flex flex-column align-items-center">
                                            <p class="fw-bold m-0">${flight.departDate} ${flight.departTime}</p>
                                            <p class="m-0">${departAirportText}</p>
                                        </div>
                                        <div class="col-6 col-lg-1">
                                            <span class="spend-time w-100">${flight.duration}</span>
                                        </div>
                                        <div class="col-3 d-flex flex-column align-items-center">
                                            <p class="fw-bold m-0">${flight.arriveDate} ${flight.arriveTime}</p>
                                            <p class="m-0">${arriveAirportText}</p>
                                        </div>
                                    </div>`
                                }).join('') : ''}
                                <ul class="post-script">
                                    <li>以上航班時間僅供參考，實際以航空公司最後之公告航班時間為準。</li>
                                </ul>
                            </div>
                        </article>
                        <article class="row">
                            <a name="sec${context.session}-attention"></a>
                            <div class="col-12 mt-5 mb-5">
                                <h1 class="text-center">注意事項</h1>
                                <div class="mt-4 p-4 rounded border border-secondary border-2">
                                    <h2>經費說明</h2>
                                    <p class="fw-bold">專案優惠價：${context.price}。</p>
                                    <h3>費用包含</h3>
                                    <div class="d-flex flex-wrap justify-content-start align-items-start text-center">
                                        ${context.priceInclude.map((includeItem) => {
                                            return `<div class="d-flex flex-column align-items-center ps-1 pe-1" style="width: 4.5em;">
                                                <div class="price-icon icon-${includeItem}"></div>
                                                <p class="m-0">${SHEET_DAY_PRICE_LIST[includeItem] || includeItem}</p>
                                            </div>`
                                        }).join('')}
                                    </div>
                                    <h3>費用不含</h3>
                                    <div class="d-flex flex-wrap justify-content-start align-items-start text-center">
                                        ${context.priceExclude.map((excludeItem) => {
                                            return `<div class="d-flex flex-column align-items-center ps-1 pe-1" style="width: 4.5em;">
                                                <div class="price-icon icon-${excludeItem}"></div>
                                                <p class="m-0">${SHEET_DAY_PRICE_LIST[excludeItem] || excludeItem}</p>
                                            </div>`
                                        }).join('')}
                                    </div>
                                    <h2>特殊說明</h2>
                                    <ul>
                                        <li>報名對象：${context.target}</li>
                                        <li>人數<span class="fw-bold">${context.quota}</span>人，<span class="fw-bold">${context.waitable ? '可候補' : '無候補'}</span>。</li>
                                        ${context.otherAttention.split('\n').map(line => line.trim() !== '' ? `<li>${line}</li>` : '').join('')}
                                        <li>報名請洽：<a href="tel:${context.tel}">${context.tel}</a>&nbsp;${context.chargePerson}
                                    </ul>
                                </div>
                            </div>
                        </article>
                    </div>
                </section>
            `
        }
    }

    customElements.define('session-card', SessionCard)
    customElements.define('session-section', SessionSection)

    const generalView = document.querySelector('#generalView > .row')
    const container = document.querySelector('.section-container')
    const campMenuLinkList = document.querySelector('#campMenuLinkList')


    fetch('./js/data.json', { cache: 'no-cache' }).then(res => res.json()).then((data) => {
        //read data
        if (!data) {
            console.log("No data found")
            return
        }

        data["dates"].forEach((item) => {
            var isAbleToRegister = item.status === 'PREPARATION' ? true : false
            var menuLink = `<li><a class="dropdown-item" href="index.html#sec${item.session}">${item.area}</a></li>`
            campMenuLinkList.innerHTML += menuLink

            generalView.innerHTML += `
                <session-card class="col-12 col-lg-3">
                    <script type="application/json">
                        ${JSON.stringify(item)}
                    </script>
                </session-card>
            `

            container.innerHTML += `
                <session-section class="area container-fluid p-0">
                    <script type="application/json">
                        ${JSON.stringify({item, gallery: data["gallery"][item.session] || [], schedule: data["schedule"][item.session] || [], flight: data["flight"][item.session] || []})}
                    </script>
                </session-section>
            `
        })
    }).then(() => {
        const overlay = document.querySelector('.loading-overlay')
        overlay.style.opacity = 0
        setTimeout(() => {
            overlay.style.display = 'none'
        }, 1000)
    }).then(() => { 
        const slogan = document.querySelector('header.header .slogan')
        slogan.classList.remove('start')

        setTimeout(() => {
            if (window.location.hash) {
                const target = document.querySelector(`a[name='${window.location.hash.replace('#','')}']`)
                if (target) {
                    target.scrollIntoView({behavior: 'smooth'})
                }
            }
        }, 100)
    })

    function markdownToHTML(markdown) {
        const escapeHtml = (text) => {
            const map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'}
            return text.replace(/[&<>"']/g, m => map[m])
        }

        const lines = markdown.split('\n')
        let result = []
        let inUL = false
        let inOL = false

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim()
            
            // 檢查是否為無序列表
            if (/^[-*+]\s+/.test(line)) {
                const content = line.replace(/^[-*+]\s+/, '')
                if (!inUL) {
                    result.push('<ul>')
                    inUL = true
                }
                result.push('  <li>' + escapeHtml(content) + '</li>')
            } 
            // 檢查是否為有序列表
            else if (/^\d+\.\s+/.test(line)) {
                const content = line.replace(/^\d+\.\s+/, '')
                if (inUL) {
                    result.push('</ul>')
                    inUL = false
                }
                if (!inOL) {
                    result.push('<ol>')
                    inOL = true
                }
                result.push('  <li>' + escapeHtml(content) + '</li>')
            }
            // 普通文字
            else {
                if (inUL) {
                    result.push('</ul>')
                    inUL = false
                }
                if (inOL) {
                    result.push('</ol>')
                    inOL = false
                }
                if (line !== '') {
                    result.push(line)
                }
            }
        }
        
        if (inUL) result.push('</ul>')
        if (inOL) result.push('</ol>')

        let html = result.join('\n')

        // Headers
        html = html.replace(/^(#{1,6})\s*(.+)$/gm, (match, hashes, content) => {
            const level = hashes.length
            return `<h${level}>${escapeHtml(content).trim()}</h${level}>`
        })

        // Bold (必須在 Italic 之前處理)
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        
        // Italic (使用更精確的正則，避免匹配到列表符號)
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

        // Links
        html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')

        // Images
        html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1">')

        return html
    }

    function toChineseDate(dateVal, returnWeekday = false) {
        // 1. 如果是 "none" 或空值，直接回傳原文字
        if (!dateVal || dateVal === "none") return dateVal;

        // 2. 嘗試將字串轉為 Date 物件
        const d = new Date(dateVal);

        // 3. 檢查轉換是否成功 (避免 Invalid Date)
        if (isNaN(d.getTime())) return dateVal;

        // 4. 使用 Intl.DateTimeFormat 輸出中文格式
        // options 可以設定要不要補零，例如 day: 'numeric' (不補零) 或 '2-digit' (補零)
        if (!returnWeekday) {
            return new Intl.DateTimeFormat('zh-TW', {
                month: '2-digit',
                day: '2-digit'
            }).format(d).replace(/\//g, '月').replace(/(\d{2})$/, '$1日').replace('日', '日');
        } else {
            return new Intl.DateTimeFormat('zh-TW', {
                weekday: 'long'
            }).format(d)
        }
        
        // 或是更直覺的手動拼接：
        // return `${d.getFullYear()}年${(d.getMonth() + 1).toString().padStart(2, '0')}月${d.getDate().toString().padStart(2, '0')}日`;
    }

    function toShortDate(dateVal) {
        const d = new Date(dateVal)
        if (isNaN(d.getTime())) return dateVal

        return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`
    }

    function calculateDays(startDate, endDate) {
        if (!startDate || !endDate || startDate === "none" || endDate === "none") return 0

        const sDate = new Date(startDate)
        const eDate = new Date(endDate)

        if (isNaN(sDate.getTime()) || isNaN(eDate.getTime())) return 0

        return Math.floor((eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    }
})()