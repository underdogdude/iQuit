var diseaseName = { 
    allergy : "โรคภูมิแพ้",
    asthma: "โรคหอบหืด",
    bloodpressure: "โรคความดันโลหิตสูง",
    depress: "โรคซึมเศร้า",
    diabetes: "โรคเบาหวาน",
    dyslipidemia: "ไขมันในเลือดสูง",
    otherds: "อื่นๆ"
}

var whenSmoke = { 
    aftereating: "หลังรับประทานอาหาร",
    drink: "ดื่มสุราหรือดื่มเครื่องดื่มแอลกอฮอล์",
    party: "สังสรรค์เข้าสังคม",
    freetime: "เวลาว่างที่รู้สึกสบาย ผ่อนคลาย",
    concentration: "ต้องการใช้สมาธิ อ่านหนังสือ",
    stress: "รู้สึกเครียด โกรธ มีความทุกข์ใจ",
    wakeup: "ทันทีหลังจากตื่นนอนในตอนเช้า",
    tired: "รู้สึกอ่อนเพลีย ไม่มีแรง",
    whendepress: "ซึมเศร้า นอนไม่หลับ"
}

// var emotions = { 
//     cannotfocus: "ไม่มีสมาธิ" ,
//     sad: "เศร้า" ,
//     happy: "มีความสุข" ,
//     tired: "อ่อนเพลีย" ,
//     relax: "ผ่อนคลาย" ,
//     dizzy: "เวียนหัว" ,
//     fresh: "สดชื่น" ,
//     angry: "หงุดหงิด" ,
//     anxiety: "เครียด" ,
//     เหม: "เครียด" ,

// }

// Instantiate the Bloodhound suggestion engine
var users = new Bloodhound({
    datumTokenizer: function(datum) {
        return Bloodhound.tokenizers.whitespace(datum.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
        url: "https://quitsmoking-app.herokuapp.com/user/?q=%QUERY",
        wildcard: "%QUERY",
        filter: function(items) {
            // Map the remote source JSON array to a JavaScript object array
            return $.map(items, function(item) {
                return {
                    item
                };
            });
        }
    },
    limit: 10
});

// Initialize the Bloodhound suggestion engine
users.initialize();

// Instantiate the Typeahead UI
$("#custom-templates .typeahead")
    .typeahead(null, {
        displayKey: "username",
        source: users.ttAdapter(),
        templates: {
            suggestion: function(data) {
                return (
                    "<p><strong>" +
                    data.item.name +
                    "</strong> – " +
                    data.item.username +
                    "</p>"
                );
            },
            footer: function(data) {
                return (
                    '<p class="type__description">Searched for ' +
                    "'" +
                    data.query +
                    "'</p>"
                );
            },
            empty: function(data) {
                return (
                    '<p class="type__description">Not found for ' +
                    "'" +
                    data.query +
                    "'</p>"
                );
            }
        }
    })
    .on("typeahead:asyncrequest", function() {
        $(".Typeahead-spinner").show();
    })
    .on("typeahead:asynccancel typeahead:asyncreceive", function() {
        $(".Typeahead-spinner").hide();
    })
    .on("typeahead:selected", function(obj, datum) {

        console.log(datum.item);
        showMainDetail(datum.item);
        showDateDetail(datum.item);
        render.smokeReasonSection(datum.item);
        render.analyzeSection(datum.item);
        render.behaviorSection(datum.item);
        render.diseaseSection(datum.item);
        render.drugSection(datum.item);
        render.diarySection(datum.item);

        render.init(datum.item);
    });

function showMainDetail(data) {
    var elems = $("#detail_main");
        $(elems).empty();

    var gender = ''; 

    if ( data.gender === 0 ) { 

        gender = `<div class="card gender male">
                    <h2 class="card__text">
                        Male
                    </h2>
                    <span class="card__subtext">เพศ</span>
                    <i class="card__icon fas fa-mars"></i>
                </div> `;
    }else { 

        gender = `
            <div class="card gender female">
                <h2 class="card__text">
                    Female
                </h2>
                <span class="card__subtext">เพศ</span>
                <i class="card__icon fas fa-venus"></i>
            </div>
        `;
    }

    var string = `
        <div class="col-md-2">
            <div class="card id">
                <h2 class="card__text">
                    ${ data.ID }
                </h2>
                <span class="card__subtext">ID</span>
                <i class="card__icon fas fa-id-card-alt"></i>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card name">
                <h2 class="card__text">
                    ${ data.name }
                </h2>
                <span class="card__subtext">@${ data.username }</span>
                <i class="card__icon fas fa-user"></i>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card yearsold">
                <h2 class="card__text">
                    ${ data.yearsold }
                </h2>
                <span class="card__subtext">อายุ (ปี)</span>
                <i class="card__icon fas fa-birthday-cake"></i>
            </div>
        </div>
        <div class="col-md-3"> 
            ${ 
                gender
            }
        </div>
    `;
    
    $(elems).append(string);
}

function showDateDetail (data) {

    var elems = $("#detail_date");
        $(elems).empty();

    var string = `
        <div class="col-md-4">
            <div class="card date">
                <h2 class="card__text">
                    ${ data.demandquit }
                </h2>
                <span class="card__subtext">ระดับความต้องการเลิกบุหรี่</span>
                <i class="card__icon fas fa-smoking-ban"></i>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card date">
                <h2 class="card__text">
                    ${ timestampToDate(data.startquitsmoke) }
                </h2>
                <span class="card__subtext">Start Quit Smoke</span>
                <i class="card__icon far fa-calendar-alt"></i>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card date">
                <h2 class="card__text">
                    ${ timestampToDate(data.endquitsmoke) }
                </h2>
                <span class="card__subtext">End Quit Smoke</span>
                <i class="card__icon fas fa-calendar-alt"></i>
            </div>
        </div>
    `;
    $(elems).append(string);
    timestampToDate(data.endquitsmoke);
}

function timestampToDate(unix_timestamp) { 
    
    if(unix_timestamp === 0) { 
        return '-';
    }
    var a = new Date(unix_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var fullDate = date + ' ' + month + ' ' + year ;
    return fullDate;
}

function exportExcel() { 
    alert('export excel currently in on instructure. Hang in there');
}

function returnHas(number){ 
    
    if(number === 0) { 
        
        return 'ไม่ใช่';
    }else if(number === 1) { 

        return "ใช่";
    }else { 

        return number;
    }
}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function generateChipWhenSmoke( data ) { 

    var chips = ``;
    for (var k in whenSmoke){
        if (whenSmoke.hasOwnProperty(k) && data[k] !== 0) {
            
            chips += `
                <span class="badge badge-info"> ${ whenSmoke[k] } </span> 
            `;
        }
    }
    return chips ? chips : '-' ;
}

function calculateNicotine(level) { 

    if( level <= 10 ) { 
        return "เล็กน้อย";
    }
    else if( level >= 11 && level <= 20 ) { 
        return "น้อย";
    }
    else if( level >= 21 && level <= 30 ) { 
        return "ปานกลาง";
    }
    else if( level >= 31 ) { 
        return "รุนแรง";
    } 
    else{ 
        return "N/a";
    }
}

function isSmokeDetail(data) { 

    var string = '';
    if(data.smoking === 'สูบบุหรี่') { 
        string = `
            <p>
                <b>จำนวนบุหรี่ที่สูบ : </b> ${data.number}
            </p>
            <p>
                <b>กิจกรรมที่ทำขณะสูบ : </b> ${data.activity}
            </p>
            <p>
                <b>บุคคลที่อยู่ด้วยขณะสูบบุหรี่ : </b> ${ data.people }
            </p>
        `;
    }
    return string;
}

function generateDate(date) { 

    var splitDate = date.split('-');
    var monthLists = { 
        '01' : 'JAN',
        '02' : 'FEB',
        '03' : 'MAR',
        '04' : 'APR',
        '05' : 'MAY',
        '06' : 'JUN',
        '07' : 'JUL',
        '08' : 'AUG',
        '09' : 'SEP',
        '10' : 'OCT',
        '11' : 'NOV',
        '12' : 'DEC'
    }
    var year = splitDate[0];
    var month = splitDate[1];
    var date = splitDate[2].split('T');
        date = date[0];

    return string = `
        <small class="month">
            ${ monthLists[month] }
        </small>
        <h1 class="date">
            ${ date }
        </h1>
        <h3 class="year">
            ${ year }
        </h3>
    `  
}

var render = {

    init: function(data) { 

        $("#last_modify").empty();
        $("#last_modify").append(`
            <small>
                <i class="text-secondary" id="last_modify">
                    Last Modified : ${ timestampToDate(data.timestamp) } 
                </i>
                <button class="btn btn-link btn__export" data-toggle="tooltip" data-placement="bottom" title="Export as Excel" onclick="exportExcel()">
                    <i class="far fa-file-excel"></i>
                </button>
            </small>
        `)
        $('html, body').animate({
            scrollTop: $("#detail_main").offset().top
        }, 500);
        $('[data-toggle="tooltip"]').tooltip()
    },      
    smokeReasonSection: function(data) { 

        render.remove("#smoke_reason");

        var behavior = 0;
        var emotion = 0;
        var nicotine = 0; 
        var chart = '';

        for (var k in whenSmoke){
            if (whenSmoke.hasOwnProperty(k) && data[k] !== 0) {

                if( k === "aftereating" || k === "drink" || k === "party" ) { 
                    behavior += 1;
                }
                else if( k === "freetime" || k === "concentration" || k === "stress" ) {
                    emotion += 1;
                }
                else if ( k === "wakeup" || k === "tired" || k === "whendepress" ){
                    nicotine += 1;
                }
            }
        }
        // behavoir
        if ( behavior >= 1 && emotion === 0 && nicotine === 0 ) { 
            chart = `<img src="./img/chart/behaviorandsocial.png" alt="พฤติกรรม" width="100%" /> <h6 class="text-center mt-3">สูบบุหรี่เพราะติดทางพฤติกรรม และสังคม</h6>`
        }
        else if( behavior >= 1 && emotion >= 1 && nicotine === 0 ) {
            chart = `<img src="./img/chart/behaviorandemotion.png" alt="พฤติกรรม+อารมณ์" width="100%" />
            <h6 class="text-center mt-3">สูบบุหรี่เพราะติดทางพฤติกรรม+อารมณ์</h6>`
        }
        else if( behavior >= 1 && emotion === 0 && nicotine >= 1 ) {
            chart = `<img src="./img/chart/behaviorandnicotine.png" alt="พฤติกรรม+สารนิโคติน" width="100%" />
            <h6 class="text-center mt-3">สูบบุหรี่เพราะติดทางพฤติกรรม+สารนิโคติน</h6>`
        }
        else if( behavior >= 1 && emotion >= 1 && nicotine >= 1 ) {
            chart = `<img src="./img/chart/behaviorandemotionandnicotine.png" alt="พฤติกรรม+อารมณ์+สารนิโคติน" width="100%" />
            <h6 class="text-center mt-3">สูบบุหรี่เพราะติดทางพฤติกรรม+อารมณ์+สารนิโคติน</h6>`
        }
        else if( behavior === 0 && emotion >= 1 && nicotine === 0 ) {
            chart = `<img src="./img/chart/emotionandmind.png" alt="อารมณ์" width="100%" />
            <h6 class="text-center mt-3">สูบบุหรี่เพราะติดทางอารมณ์</h6>`
        }
        else if( behavior === 0 && emotion >= 1 && nicotine >= 1 ) {
            chart = `<img src="./img/chart/emotionandnicotine.png" alt="อารมณ์+สารนิโคติน" width="100%" />
            <h6 class="text-center mt-3">สูบบุหรี่เพราะติดทางอารมณ์+สารนิโคติน</h6>`
        }
        else if( behavior === 0 && emotion === 0 && nicotine >= 1 ) {
            chart = `<img src="./img/chart/nicotine.png" alt="สารนิโคติน" width="100%" />
            <h6 class="text-center mt-3">สูบบุหรี่เพราะติดสารนิโคติน</h6>`
        }
        else { 
            chart = 'n/A';
        }

        var string = `
            <div class="card mb-4">
                <div class="card-title">
                    <h3>
                        <i class="fas fa-smoking text__blue"></i> สูบบุหรี่เพราะ
                    </h3>
                    <hr />
                </div>
                <div class="card-content">
                    ${ chart }
                </div>
            </div>
        `;

        $("#smoke_reason").append(string);
    },
    analyzeSection: function(data) {

        render.remove("#analyze");

        var nowTimestamp = Math.floor(Date.now() / 1000);
        var allCountSmoke = (((data.yearsold - data.startsmoke)*365) + (((data.yearsold - data.startsmoke)/4) + 
        ((nowTimestamp - data.timestamp)/86400))) * data.countsmoke;
        var allQuitCountSmoke = ( nowTimestamp - data.startquitsmoke ) * data.countsmoke;
        var liftShortSmoking = (allCountSmoke * 7)/525600;
    
        var stringAnalyze = ` 
            <div class="card mb-4">
                <div class="card-title">
                    <h3>
                        <i class="fas fa-diagnoses text__blue"></i> ส่วนของการแปรผล
                    </h3>
                    <hr />
                </div>
    
                <div class="card-content">
                    <ul class="list-group list-group-flush detail__list">
                        <li class="list-group-item">
                            <b> สูบบุหรี่มาแล้ว(มวน) </b> : ${ 
                                numberWithCommas( allCountSmoke.toFixed(2) )
                            }
                        </li>
                        <li class="list-group-item">
                            <b> เสียเงินให้บุหรี่(บาท) </b> : ${ 
                                numberWithCommas( (allCountSmoke * data.cost).toFixed(2) )
                            }
                        </li>
    
                        <li class="list-group-item">
                            <b> ชีวิตที่สั้นลงจากการสูบบุหรี่(ปี วัน) </b> : ${ 
                                numberWithCommas( liftShortSmoking.toFixed(2) ) + 
                                    " ปี" + 
                                    " " + 
                                numberWithCommas( (liftShortSmoking * 365).toFixed(2) ) +
                                " วัน" 
                            }
                        </li>
    
                        <li class="list-group-item">
                            <b> ระดับการติดสารนิโคตินในบุหรี่ </b> : ${ 
                                calculateNicotine(data.countsmoke)
                            }
                        </li>
    
                        <li class="list-group-item">
                            <b> เลิกสูบบุหรี่ได้ (มวน) </b> : ${ 
                                numberWithCommas(allQuitCountSmoke.toFixed(2)) + " มวน"
                            }
                        </li>
    
                        <li class="list-group-item">
                            <b> มีเงินเก็บเพิ่มขึ้น (บาท) </b> : ${ 
                                numberWithCommas((allQuitCountSmoke * data.cost).toFixed(2)) + " บาท"
                            }
                        </li>
    
                        <li class="list-group-item">
                            <b> มีชีวิตยืนยาวขึ้น (วัน ชั่วโมง) </b> : ${ 
                                numberWithCommas((allQuitCountSmoke * 0.1167).toFixed(2)) + " ชั่วโมง " + numberWithCommas(((allQuitCountSmoke * 0.1167) / 24).toFixed(2) ) + " วัน" 
                            }
                        </li>
                    </ul>
                </div>
            </div>`;

        $("#analyze").append(stringAnalyze);
    },
    behaviorSection: function(data) { 

        render.remove("#behavior");
        var string = `
            <div class="card mb-4">
                <div class="card-title">
                    <h3>
                        <i class="fas fa-clipboard-list text__blue"></i> พฤติกรรมการสูบบุหรี่
                    </h3>
                    <hr />
                </div>

                <div class="card-content">
                    <ul class="list-group list-group-flush detail__list">
                        <li class="list-group-item">
                            <b>อายุที่เริ่มสูบบุหรี่ (ปี)</b> : ${ data.startsmoke }
                        </li>
                        <li class="list-group-item">
                            <b>จำนวนบุหรี่ที่สูบต่อวัน (มวน)</b> : ${data.countsmoke}
                        </li>
                        <li class="list-group-item">
                            <b>ราคาบุหรี่ที่สูบต่อมวน (บาท)</b> : ${data.cost}
                        </li>
                        <li class="list-group-item">
                            <b>เวลาที่สูบบุหรี่มวนแรก</b> : ${ data.whenstart }
                        </li>
                        <li class="list-group-item">
                            <b>ปกติสูบบุหรี่ในช่วงใด</b> : ${ generateChipWhenSmoke(data) }
                        </li>

                        <li class="list-group-item">
                            <b>เหตุผล</b> : ${ data.reason }
                        </li>
                    </ul>
                </div>
            </div>
        `;
        $("#behavior").append(string);

    },
    diseaseSection: function(data) { 

        render.remove("#disease");

        var stringDisease = '';

        if(data.disease === 1) { 
    
            var stringDiseaseList = '';
            for (var k in diseaseName){
                if (diseaseName.hasOwnProperty(k) && data[k] !== 0 && data[k] !== "") {
    
                    stringDiseaseList += `
                        <li class="list-group-item">
                            <b>${ diseaseName[k] }</b> : ${ returnHas(data[k]) }
                        </li>
                    `;
                }
            }

            stringDisease = `
                <div class="card mb-4">
                    <div class="card-title">
                        <h3>
                            <i class="fas fa-heartbeat text__blue"></i> โรคประจำตัว
                        </h3>
                        <hr />
                    </div>
                    <div class="card-content">
                        <ul class="list-group list-group-flush detail__list">
                            ${ stringDiseaseList }
                        </ul>
                    </div>
                </div>
            `;
        }
        $("#disease").append(stringDisease);

    },
    drugSection: function(data) { 
        
        get.drug(data.username).done(function(res) { 
        
            render.remove("#drug");

            if(res.length !== 0) { 

                var string = '';
                var drugList = '';
                for (var i = 0 ; i < res.length ; i++) { 
                    
                    drugList += `
                        <li class="list-group-item">
                            <div class="d-flex w-100 justify-content-between">
                                <h5> <strong>${ res[i].name } </strong></h5>
                                <small> 
                                    <span class="badge badge-pill badge-info"> ${res[i].time} </span>
                                </small>
                            </div>
                            <h6> ขนาดยา : ${ res[i].size } </h6>
                            <h6 class="mb-1"> ครั้งละ : ${ res[i].quantity } </h6>
                            <p class="mb-1">
                                ความถี่ในการใช้ยา : ${ res[i].frequenzy }
                            </p>
                            <p class="mb-1">
                                วิธีใช้ : ${ res[i].method }
                            </p>
                            <small>
                                <b>เริ่มใช้ยา : </b> ${ res[i].startdate }
                                <b>ถึงวันที่ : </b> ${ res[i].stopdate }
                            </small>
                        </li>
                    `;
                }
                
                string = `
                    <div class="card mb-4">
                        <div class="card-title">
                            <h3>
                                <i class="fas fa-pills text__blue"></i> ยา
                            </h3>
                            <hr />
                        </div>
                        <div class="card-content">
                            <ul class="list-group detail__list">
                                ${ drugList }
                            </ul>
                        </div>
                    </div>
                `;

                $("#drug").append(string);
            }
        });
    },

    diarySection: function (data)  {

        get.diary(data.username).done(function(res) { 
            
            render.remove("#diary");
            if(res.length !== 0) { 

                var string = '';
                var diaryList = '';

                for (var i = 0 ; i < res.length ; i++) { 
                    
                    diaryList += `
                        <li class="list-group-item d-flex">
                            <div class="d-flex flex-column calendar justify-content-center">
                               
                                ${ generateDate(res[i].date) }
                            </div>
                            <div class="d-flex flex-column list__diary-detail w-100">
                                <div class="d-flex justify-content-between px-5">
                                    <div class="is__smoke text-center">
                                        <h4>
                                            ${ res[i].smoking }
                                        </h4>
                                        <img src="./img/${ res[i].smoking }.png" alt="" width="50px;" />
                                    </div>
                                    <div class="is__want text-center">
                                        <h4>
                                            ความอยากบุหรี่
                                        </h4>
                                        <h1>
                                            ${ res[i].thirst }
                                        </h1>
                                    </div>
                                    <div class="emotion text-center">
                                        <h4>
                                            ความรู้สึกในตอนนี้
                                        </h4>
                                        <img src="./img/emotions/${res[i].emotion}.png" alt="" width="50px">
                                        <br />
                                        <small>${ res[i].emotion }</small>
                                    </div>
                                </div>
                                <div class="list__diary-subtext">
                                    ${ isSmokeDetail( res[i] ) }
                                    <small>
                                        <b>ข้อความ</b> : ${ res[i].additional }
                                    </small>
                                </div>
                            </div>
                        </li>
                    `;
                }
                
                string = `
                    <div class="card mb-4">
                        <div class="card-title">
                            <h3>
                                <i class="fas fa-book text__blue"></i> บันทึกประจำวัน
                            </h3>
                            <hr />
                        </div>
                        <div class="card-content">
                            <ul class="list-group list__diary">
                                ${ diaryList }
                            </ul>
                        </div>
                    </div>
                `;

                $("#diary").append(string);
            }
        });
    },

    remove: function(elems) {

        $(elems).empty();
    }
}