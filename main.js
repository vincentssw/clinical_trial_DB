const serviceKey =
    "9b99yG1mD8APD%2B%2FSv3NiwVgL2QwAL87VdWGufWQipuDQrtRksYHH99sg0OAre1Z7hc9YLFuL4gDtIwLXczDpGA%3D%3D";
let item = [];
let item_detail = [];
let page = 1;
let total_page = 0;
let url;
let keyword;

let searchText = document.getElementById("search-text")
let searchButton = document.getElementById("search-button")
let menu = document.querySelectorAll(".navbar-nav li")



const getAPI = async() => {
    url.searchParams.set('pageNo', page);

    // // 화면 초기화
    // document.getElementById("item-table").innerHTML = '';
    // console.log(url)

    let response = await fetch(url);
    let data = await response.json();
    item = data.items;
    total_page = Math.floor(data.totalCount / data.numOfRows);
    page = Number(data.pageNo);
    code = data.resultMsg;
    console.log("Code:", code)

    render();
    pagination();
}

const getList = async () => {
    url = new URL(
        `http://apis.data.go.kr/1352159/crisinfodataview/list?serviceKey=${serviceKey}&resultType=JSON&srchWord=면역&numOfRows=5`
    );
    getAPI();
};

const getbyKeyword = async () => {
    keyword = searchText.value;

    console.log("keyword:",keyword)
    url = new URL(
        `http://apis.data.go.kr/1352159/crisinfodataview/list?serviceKey=${serviceKey}&resultType=JSON&srchWord=${keyword}&numOfRows=5`
    );
    getAPI();
}

const getDetail = async (trial_id) => {
    url = new URL(
        `http://apis.data.go.kr/1352159/crisinfodataview/detail?serviceKey=${serviceKey}&resultType=JSON&crisNumber=${trial_id}`
    );
    let response = await fetch(url);
    let data = await response.json();
    item_detail = data;
    renderDetail();
}


const render = () => {
    let itemHTML = "";

    itemHTML = item
        .map((items, index) => {
            return `
        <tr>
            <th scope="row">${(page-1)*5+index+1}</th>
            <td class="w-10"> ${items.primary_sponsor_kr}</td>
            <td class="w-10"> ${items.trial_id}</td>
            <td class="arrow" onclick=getDetail('${items.trial_id}')> ${items.scientific_title_kr} <br />${items.scientific_title_en}</td>
            <td class="w-10"> ${items.date_registration}</td>
            <td class="w-10"> ${items.study_type_kr} </td>
        </tr>`
        })
        .join("");
    document.getElementById("item-table").innerHTML = itemHTML;
    document.getElementById("sub-main").innerHTML = `검색한 키워드 : ${keyword}`;
};



const renderDetail = () => {
    let itemHTML = "";
    console.log(item_detail)

    itemHTML = `
            <div class="row mt-4 mb-2">
                <h2 class=col>
                ${item_detail.scientific_title_kr}
                </h2>
            </div>
            <div class="row mb-2">
                <h4 class=col>
                ${item_detail.scientific_title_en}
                </h4>
            </div>
            <div class="row mt-4 mb-2">
                <div class=col-2>
                CRIS 고유 번호
                </div>
                <div class=col-10>
                ${item_detail.trial_id}
                </div>
            </div>
            <div class="row mb-2">
                <div class=col-2>
                연구등록일
                </div>
                <div class=col-4>
                ${item_detail.date_registration}
                </div>
                <div class=col-2>
                최종갱신일
                </div>
                <div class=col-4>
                ${item_detail.date_updated}
                </div>
            </div>
            <div class="row mb-2">
                <div class=col-2>
                연구책임자 기관명
                </div>
                <div class=col-4>
                ${item_detail.affiliation_kr}
                </div>
                <div class=col-2>
                연구책임자
                </div>
                <div class=col-4>
                ${item_detail.scientific_name_kr}
                </div>
            </div>
            <div class="row mb-2">
                <div class=col-2>
                전체연구모집현황
                </div>
                <div class=col-4>
                ${item_detail.recruitment_status_kr}
                </div>
                <div class=col-2>
                목표대상자 수 
                </div>
                <div class=col-4>
                ${item_detail.target_size}
                </div>
            </div>
            <div class="row mb-2">
                <div class=col-2>
                첫 연구대상자 등록일
                </div>
                <div class=col-4>
                ${item_detail.date_enrolment}
                </div>
                <div class=col-2>
                연구종료일 
                </div>
                <div class=col-4>
                ${item_detail.results_date_completed}
                </div>
            </div>    
            <div class="row mb-2">
                <div class=col-2>
                연구종류
                </div>
                <div class=col-4>
                ${item_detail.study_type_kr}
                </div>
                <div class=col-2>
                연구목적
                </div>
                <div class=col-4>
                ${item_detail.primary_purpose_kr}
                </div>
            </div>                                                                                                                   
            <div class="row mt-5 mb-2">
                <div class=col-2>
                연구 요약
                </div>
                <div class=col-10>
                ${handleNewLines(item_detail.study_summary_kr)}
                </div>
            </div>
            <div class="row mt-5 mb-2">
                <div class=col-2>
                Summary 
                </div>
                <div class=col-10>
                ${handleNewLines(item_detail.study_summary_en)}
                </div>
            </div>
           `
    document.getElementById("item-board").innerHTML = itemHTML;
    document.querySelector(".pagination").innerHTML = '';
}


function handleNewLines(str) {
    return str.replace(/\n/g, "<br>");
  }


const pagination = () => {
    let pageGroup = Math.ceil(page/5);
    let last = pageGroup * 5;
        if (last > total_page) {
        last = total_page;
        }
    let first = last - 4 <= 0 ? 1 : last - 4;

    let paginationHTML = `
        <li class="page-item">
            <a class="page-link ${pageGroup==1?"d-none":""}" href="#" aria-label="Previous" onclick="moveToPage(${1})">
            <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        <li class="page-item">
            <a class="page-link ${pageGroup==1?"d-none":""}" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
            <span aria-hidden="true">&lt;</span>
            </a>
        </li>`

    for(let i=first;i<=last;i++){
        paginationHTML += `<li class="page-item"><a class="page-link ${page==i?"active":""}" href="#" onclick="moveToPage(${i})">${i}</a></li>
        `
    }

    paginationHTML += `
        <li class="page-item">
            <a class="page-link ${pageGroup==Math.ceil(total_page/5)?"d-none":""}" href="#" aria-label="Next" onclick="moveToPage(${page+1})">
                <span aria-hidden="true">&gt;</span>
            </a>
        </li>
        <li class="page-item">
            <a class="page-link ${pageGroup==Math.ceil(total_page/5)?"d-none":""}" href="#" aria-label="Next" onclick="moveToPage(${total_page})">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>`

    document.querySelector(".pagination").innerHTML = paginationHTML;
}

const moveToPage = (pageNum) => {
    page = pageNum;

    getList();

}

searchButton.addEventListener("click", getbyKeyword)
searchText.addEventListener("focus", () => searchText.value="")
searchText.addEventListener("keypress", () => {
    if(window.event.key == 'enter'){
        getbyKeyword();
    }
})
