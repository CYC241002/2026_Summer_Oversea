(function() {
    const generalView = document.querySelector('#generalView > .row')
    const container = document.querySelector('.section-container')
    const campMenuLinkList = document.querySelector('#campMenuLinkList')

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

    fetch('./js/data.json').then(res => res.json()).then((data) => {
        //read data
        if (!data) {
            console.log("No data found")
            return
        }

        data["dates"].forEach((item) => {
            var isAbleToRegister = item.status === 'PREPARATION' ? true : false
            var menuLink = `<li><a class="dropdown-item" href="index.html#sec${item.session}">${item.area}</a></li>`
            campMenuLinkList.innerHTML += menuLink

            generalView.innerHTML += `<div class="col-12 col-lg-3">
                    <div class="card shadow-sm m-2 p-2">
                        <a href="#sec${item.session}">
                            <img class="card-img-top" src="img/${item.session}/${item.session}_header.jpg">
                            <div class="card-body">
                                <h6 class="card-subtitle text-body-secondary">${item.code}</h6>
                                <h5 class="card-title">${item.area}</h5>
                                <div class="card-text">
                                    <div class="info">
                                        <p class="d-flex align-items-center mb-1"><span class="material-symbols-outlined pe-2">travel</span><span class="days">${calculateDays(item.startDate, item.endDate)}日</span><span class="spot">${item.mainVisit}</span></p>
                                        <p class="d-flex align-items-center"><span class="material-symbols-outlined pe-2">group</span>${item.target}</p>
                                    </div>
                                    <p>${toShortDate(item.startDate)}~${toShortDate(item.endDate)}(${toChineseDate(item.startDate, true)}-${toChineseDate(item.endDate, true)})</p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>`

            var section = document.createElement('section')
            section.className = 'area container-fluid p-0'
            section.style = `background-color: ${item.backColor || '#ffffff'}; color: ${item.textColor || '#000000'};`
            section.innerHTML = `<a name="sec${item.session}"></a>`
            var heroSection = `<div class="hero-section row m-0">
                <div class="col-12 h-100 w-100 p-0" style="position: relative;">
                    <img src="img/${item.session}/${item.session}_header.jpg">
                    <div class="description row row-cols-1 w-100 h-100 d-flex align-items-center">
                        <div class="inner">
                            <p class="number">${item.code}</p>
                            <h1 class="fw-bold">${item.area}</h1>
                            <div class="sub rounded p-3">
                                <p class="mx-auto detail-text">活動日期：${toChineseDate(item.startDate)}至${toChineseDate(item.endDate)}<br>報名對象：${item.target}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
            var detailLinkSection = `<div class="detail-link row m-0 mb-5" style="background-color: ${item.subColor || '#000'};">
                <div class="m-auto row col-12 col-lg-9 align-items-center">
                    <div class="nav col-12 col-lg-6 d-flex justify-content-center justify-content-md-start align-items-center h-100">
                        <a href="#sec${item.session}-intro" class="h-100"><div class="inner">營隊特色</div></a>
                        <a href="#sec${item.session}-daily-schedule" class="h-100"><div class="inner">每日行程</div></a>
                        <a href="#sec${item.session}-attention" class="h-100"><div class="inner">注意事項</div></a>
                    </div>
                    <div class="col-12 col-lg-6 d-flex justify-content-center justify-content-md-end align-items-center h-100 p-2">
                        <div class="h-100">
                            <a class="btn btn-primary${item.link !== '' && isAbleToRegister ? '' : ' disabled'}" href="${item.link !== '' && isAbleToRegister ? item.link : '#'}" target="_blank" role="button">
                                ${(() => {
                                    if (isAbleToRegister) {
                                        return item.link === '' ? '尚未開放報名' : '優惠報名請點我！'
                                    } else {
                                        if (item.status === 'ON_SCHEDULE') {
                                            return '出團中'
                                        } else if (item.status === 'ENDED') {
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
            </div>`

            section.innerHTML += heroSection
            section.innerHTML += detailLinkSection
            
            var gallery = data["gallery"][item.session] || []
            var contentSection = `<div class="content row col-12 col-lg-9 m-auto">
                <article class="row">
                    <a name="sec${item.session}-intro"></a>
                    <h1 class="text-center">營隊特色</h1>
                    <div class="feature w-75 p-3 rounded border border-secondary border-2">
                        ${markdownToHTML(item.feature)}
                    </div>
                    <div class="row mt-2 mb-2 photolist">
                        ${gallery.map((img) => `<div class="col-4 p-2"><img src="img/${item.session}/${img.fileName}" class="img-fluid" loading="lazy" alt="${img.description || '營隊照片'}"></div>`).join('')}
                    </div>
                </article>`

            var scheduleArticle = `<article class="row daily-schedule">
                <a name="sec${item.session}-daily-schedule"></a>`
            var schedule = data["schedule"][item.session]
            if (schedule) {
                schedule.forEach((daily) => {
                    var title = daily.theme != '' ? `${daily.theme}-${daily.route}` : daily.route
                    var dailySection = `<div class="row col-12 daily daily-row">
                        <div class="col-2 d-flex flex-column"><p class="day-count"><span class="day-count-number"></span></p><span class="text-center">${daily.date}</span></div>
                        <div class="col-10 col-lg-7 d-flex align-items-center"><h2>${title}</h2></div>
                        <div class="col-12 col-lg-3 row pt-3 pt-lg-0">
                            ${daily.breakfast ? `<div class="col-4 col-lg-4 fw-bold"><span class="material-symbols-outlined">free_breakfast</span>早餐</div><div class="col-8 col-lg-8">${daily.breakfast}</div>` : ''}
                            ${daily.lunch ? `<div class="col-4 col-lg-4 fw-bold"><span class="material-symbols-outlined">lunch_dining</span>午餐</div><div class="col-8 col-lg-8">${daily.lunch}</div>` : ''}
                            ${daily.dinner ? `<div class="col-4 col-lg-4 fw-bold"><span class="material-symbols-outlined">restaurant</span>晚餐</div><div class="col-8 col-lg-8">${daily.dinner}</div>` : ''}
                            ${daily.accommodation ? `<div class="col-4 col-lg-4 fw-bold"><span class="material-symbols-outlined">hotel</span>旅館</div><div class="col-8 col-lg-8">${daily.accommodation}</div>` : ''}
                        </div>
                    </div>`
                    scheduleArticle += dailySection
                })
            }

            var flights = data["flight"][item.session]
            if (flights) {
                scheduleArticle += `<div class="row col-12 flight pt-4">
                    <h2 class="col-12 pb-2">參考航班<small class="text-secondary ps-2 fs-6">航班時間僅為參考。</small></h2>`
                flights.forEach((flight) => {
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
                    scheduleArticle += `<div class="col-12 row flight-row d-flex align-items-center border border-primary border-1 rounded p-1">
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
                })
                scheduleArticle += `<ul class="post-script">
                        <li>以上航班時間僅供參考，實際以航空公司最後之公告航班時間為準。</li>
                    </ul>
                </div>`
            }

            scheduleArticle += `</article>`
            contentSection += scheduleArticle

            var attentionArticle = `<article class="row"><a name="sec${item.session}-attention"></a>`
            attentionArticle += `<div class="col-12 mt-5 mb-5">
                <h1 class="text-center">注意事項</h1>
                <div class="mt-4 p-4 rounded border border-secondary border-2">
                    <h2>經費說明</h2>
                    <p class="fw-bold">專案優惠價：${item.price}。</p>
                    <h3>費用包含</h3>
                    <div class="d-flex flex-wrap justify-content-start align-items-start text-center">
                        ${item.priceInclude.map((includeItem) => {
                            return `<div class="d-flex flex-column align-items-center ps-1 pe-1" style="width: 4.5em;">
                                <div class="icon icon-${includeItem}"></div>
                                <p class="m-0">${SHEET_DAY_PRICE_LIST[includeItem] || includeItem}</p>
                            </div>`
                        }).join('')}
                    </div>
                    <h3>費用不含</h3>
                    <div class="d-flex flex-wrap justify-content-start align-items-start text-center">
                        ${item.priceExclude.map((excludeItem) => {
                            return `<div class="d-flex flex-column align-items-center ps-1 pe-1" style="width: 4.5em;">
                                <div class="icon icon-${excludeItem}"></div>
                                <p class="m-0">${SHEET_DAY_PRICE_LIST[excludeItem] || excludeItem}</p>
                            </div>`
                        }).join('')}
                    </div>
                    <h2>特殊說明</h2>
                    <ul>
                        <li>報名對象：${item.target}</li>
                        <li>人數<span class="fw-bold">${item.quota}</span>人，<span class="fw-bold">${item.waitable ? '可候補' : '無候補'}</span>。</li>
                        ${item.otherAttention.split('\n').map(line => line.trim() !== '' ? `<li>${line}</li>` : '').join('')}
                        <li>報名請洽：<a href="tel:${item.tel}">${item.tel}</a>&nbsp;${item.chargePerson}
                    </ul>
                </div>
            </div>`
            attentionArticle += `</article>`

            contentSection += attentionArticle
            contentSection += `</div>`

            section.innerHTML += contentSection

            container.appendChild(section)
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

        return Math.floor((eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24))
    }
})()