const APARTMENT_SIZE = [0, 40, 60, 80, 100, 120, 150, 170, 190, 210, 230, 260, 290, 310];
const RECOMENDENATION = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 9];
const POST_CODE = [11115, 19794];
const ECO_FRIENDLY_CLEANING_CHARGE = 39;
const ServiceCardArr = [
    {
        'title': 'Varje vecka',
        'oldPrice': 450,
        'newPrice': 225,
        'type': 'card'
    },
    {
        'title': 'Varannan vecka',
        'oldPrice': 470,
        'newPrice': 235,
        'type': 'card'
    },
    {
        'title': 'Var fjärde vecka',
        'oldPrice': 600,
        'newPrice': 300,
        'type': 'card'
    },
    {
        'title': 'Endast en gång (322.5 kr/h)<br><span>645 kr/h innan rutavdraget</span>',
        'oldPrice': 650,
        'newPrice': 325,
        'type': 'one_time'
    }
]

const AdditionalServiceCardArr = [
    {
        'title': 'Kylskåp',
        'additional_minute': 30,
    }
]


//NOTE global value ;
const serviceState = {
    'CURRENT_PRICE': 0,
    'REGULAR_PRICE': 0,
    'APPARTMENT_SIZE': 0,
    'CLEANING_DURATION': 0,
    'EXTRA_MINUTE': 0,
    'TOTAL': 0,
    'REGULAR_PRICE_TOTAL': 0,
    'SERVICE_TITLE': '',
    'SERVICE_TYPE': '',
    'ADDITIONAL_SERVICE_TITLE': '',
    'ADDITIONAL_MINUTE_FOR_ADDITIONAL_SERVICE': 0,
    'ADDRESS': '',
    'POST_CODE': '',
    'PET_NAMES': [],

}

//NOTE Global Parent Element Selection
const parentConatiner = document.querySelector(`.boxContainer`);
const previousNextButtonContainer = document.querySelector(`.previousNextButtonContainer`);
const areaInputField = document.querySelector(`.inputFieldArea input`);
const cleaningDuration = document.querySelector('.cleaningDurationFieldsContainer');
const serviceCardTitleRow = document.querySelector('.serviceCardTitleRow');
const serviceCardContainer = document.querySelector('.service__Card--Container');
const totalPriceSelector = document.querySelector('.total__price--main');
const totalRegularPriceSelector = document.querySelector('.total__price--old');
const summeryServiceTItle = document.querySelector('.serviceCardTitleRow .title');
const featureArea = document.querySelector('.extraFeatureRow');
const extraFeatureRowsecond = document.querySelector('.extraFeatureRowsecond');
const bottomSummeryArea = document.querySelector('.bottom-bottom-area');
const ecoFriendlyCleaningSupplies = document.querySelector('.eco-friendly-cleaning-supplies');
const bottomAreaRegularSummeryTitle = document.querySelector('.bottom_area_regular_summery--title');
const bottomAreaRegularSummeryPrice = document.querySelector('.bottom_area_regular_summery--price');
const bottomAreaRegularSummeryPriceWithCharge = document.querySelector('.bottom_area_regular_summery--priceWithCharge');
const bottomAreaCurrentSummeryPrice = document.querySelector('.bottom_area_current_summery--priceWithCharge');
const extraMinuteValuePreview = document.querySelector('.extraMinuteValuePreview');
const checkBoxContainer = document.querySelector('.checkBoxContainer');
const extraServiceContainer = document.querySelector('.extra__service--wrapper');
const additionServiceCardContainer = document.querySelector('.additionServiceCardContainer');
const submitPetForm = document.querySelector('.submit-pet');
const petCheckBoxContainer = document.querySelector('.petsContainer');
const petListRow = document.querySelector('.petListRow');
const addressContainer = document.querySelector('.address--container');
const addressListPreview = document.querySelector('.addressListPreview');

const form_firstName = document.querySelector('.form_firstName');
const form_lastName = document.querySelector('.form_lastName');
const form_email = document.querySelector('.form_email');
const form_phone = document.querySelector('.form_phone');
const form_personalIdentity = document.querySelector('.form_personalIdentity');



//NOTE generate options for cleaning duraiotns
const generateDurationOptionsMarkup = function (rValue) {
    return RECOMENDENATION.map(function (el) {
        if (rValue <= el)
            return `<option value="${el}">${el.toString().replace('.', ',')} timmar ${(rValue === el) ? `(rekommendation)` : ''} </option>`
    }).join('');
}

//NOTE Round the fractional Number
const roundTheFractional = function (num) {
    return (Math.round(num * 100) / 100).toFixed(2);
}
//NOTE ERROR
const showError = function (x, y) {
    visibilityControl(document.querySelector(x), 'hidden');
    document.querySelector(x).innerHTML = y;
}
//NOTE calculation
const calculation = function () {
    const cleaningDurationValue = +cleaningDuration.querySelector('select').value;
    serviceState.TOTAL = 0;
    serviceState.REGULAR_PRICE_TOTAL = 0;

    if (serviceState.CURRENT_PRICE !== 0 && serviceState.SERVICE_TYPE == 'card') {
        serviceState.TOTAL = roundTheFractional(((cleaningDurationValue + (serviceState.EXTRA_MINUTE / 60)) * serviceState.CURRENT_PRICE) + ECO_FRIENDLY_CLEANING_CHARGE);
        serviceState.REGULAR_PRICE_TOTAL = roundTheFractional(((cleaningDurationValue + (serviceState.EXTRA_MINUTE / 60)) * serviceState.REGULAR_PRICE) + ECO_FRIENDLY_CLEANING_CHARGE);
    }
    if (serviceState.CURRENT_PRICE !== 0 && serviceState.SERVICE_TYPE === 'one_time') {
        serviceState.TOTAL = roundTheFractional(((cleaningDurationValue + (serviceState.ADDITIONAL_MINUTE_FOR_ADDITIONAL_SERVICE / 60)) * serviceState.CURRENT_PRICE) + ECO_FRIENDLY_CLEANING_CHARGE);
        serviceState.REGULAR_PRICE_TOTAL = roundTheFractional(((cleaningDurationValue + (serviceState.ADDITIONAL_MINUTE_FOR_ADDITIONAL_SERVICE / 60)) * serviceState.REGULAR_PRICE) + ECO_FRIENDLY_CLEANING_CHARGE);

    }
    clean(bottomAreaRegularSummeryTitle);
    render(bottomAreaRegularSummeryTitle, `Städning ${serviceState.REGULAR_PRICE} kr/h × ${serviceState.CLEANING_DURATION + (serviceState.EXTRA_MINUTE / 60)} h`);
    clean(totalPriceSelector);
    clean(totalRegularPriceSelector);
    clean(bottomAreaRegularSummeryPrice);
    clean(bottomAreaRegularSummeryPriceWithCharge);
    clean(bottomAreaCurrentSummeryPrice);
    clean(extraMinuteValuePreview);

    render(extraMinuteValuePreview, serviceState.EXTRA_MINUTE);
    render(totalPriceSelector, serviceState.TOTAL);
    render(totalRegularPriceSelector, serviceState.REGULAR_PRICE_TOTAL);

    render(bottomAreaRegularSummeryPrice, (serviceState.REGULAR_PRICE_TOTAL - ECO_FRIENDLY_CLEANING_CHARGE));
    render(bottomAreaRegularSummeryPriceWithCharge, serviceState.REGULAR_PRICE_TOTAL);
    render(bottomAreaCurrentSummeryPrice, serviceState.TOTAL);
}

//NOTE Render the html
const render = function (element, markup) {

    element.insertAdjacentHTML('afterbegin', markup)
}

//NOTE Cleaning the container
const clean = function (element) {
    element.innerHTML = '';
}

//NOTE remove hidden class
const visibilityControl = function (e, cl, remove = true) {
    // console.log(e.classList);
    if (remove === true) {
        e.classList.remove(cl);
    }
    if (remove === false) {
        e.classList.add(cl);
    }
    // console.log(e.classList);
}

//NOTE clean class from other element
const cleanActiveClass = function (x) {
    x.querySelectorAll('.card').forEach(el => {
        el.classList.remove('active');
    })

    if (x.querySelector('input').checked === true) {
        x.querySelector('input').checked = false;
    }
}
const between = function (x, arr) {
    let rangeStartValue = null;
    arr.forEach((element, index) => {
        if (x >= element) {
            if (arr[index + 1] === undefined || (arr[index + 1] !== undefined && arr[index + 1] > x)) {
                rangeStartValue = index;

            }
        }
    });
    return rangeStartValue;
}


//NOTE generate buttons
const generateButton = function () {
    console.log(parentConatiner.dataset.step);
    if (parentConatiner.dataset.step === `1`) {
        const markup = ` <div class="previous">
                        
                    </div>
                    <div class="next">
                        <button data-type="next">NÄSTA</button>
                    </div>`;
        clean(previousNextButtonContainer);
        render(previousNextButtonContainer, markup);
    }
    if (parentConatiner.dataset.step === `2`) {
        const markup = ` <div class="previous">
                            <button data-type="previous">TIDIGARE</button>
                        </div>
                        <div class="submit">
                            <button data-type="submit">SKICKA IN</button>
                        </div>`;

        clean(previousNextButtonContainer);
        render(previousNextButtonContainer, markup);
    }
}

//NOTE Control area input value
const controlAreaInputFieldValueChange = function () {

    serviceState.APPARTMENT_SIZE = +areaInputField.value;
    serviceState.CLEANING_DURATION = RECOMENDENATION[between(serviceState.APPARTMENT_SIZE, APARTMENT_SIZE)];
    serviceState.EXTRA_MINUTE = (serviceState.CLEANING_DURATION > 3) ? 60 : 30;
    cleaningDuration.classList.remove('hidden');
    clean(cleaningDuration.querySelector('select'));
    render(cleaningDuration.querySelector('select'), generateDurationOptionsMarkup(serviceState.CLEANING_DURATION));
    clean(serviceCardTitleRow.querySelector('.hour'));
    console.log('hoise=', serviceState.CLEANING_DURATION);
    render(serviceCardTitleRow.querySelector('.hour'), `${serviceState.CLEANING_DURATION.toString().replace('.', ',')} h`);
    console.log(serviceState);
    calculation();
}

//NOTE Value Change: Control Cleaning Duration Hour Field
const controlCleaningDurationValueChange = function () {
    serviceState.CLEANING_DURATION = +cleaningDuration.querySelector('select').value;
    clean(serviceCardTitleRow.querySelector('.hour'));

    render(serviceCardTitleRow.querySelector('.hour'), `${serviceState.CLEANING_DURATION.toString().replace('.', ',')} h`);
    console.log(serviceState);
    calculation();
}

//NOTE generate the Service Card
const generateTheServiceCard = function () {
    const cardType = ServiceCardArr.filter(el => el.type === 'card').map(function (el) {
        return `<div class="card" data-cardPrice = ${el.newPrice} data-cardOldPrice=${el.oldPrice} data-cardType=${el.type} >
                            <div class="left">
                                <p class="title">${el.title}</p>
                                <p class="subtitle">${el.oldPrice} kr/h innan rutavdraget</p>
                            </div>
                            <div class="right">
                                <div class="cardPrice">${el.newPrice} kr/h</div>
                            </div>
                        </div>`
    }).join('');

    const radioType = ServiceCardArr.filter(el => el.type === 'one_time').map(function (el) {
        return `<div class="checkBoxContainer card" data-cardPrice = ${el.newPrice} data-cardOldPrice=${el.oldPrice} data-cardType=${el.type}>
                            <input type="radio" name="onetimeonly" id="one">
                            <label for="one"><span class='title'>Endast en gång </span>(${el.newPrice} kr/h)<br><span>${el.oldPrice} kr/h innan rutavdraget</span></label>
                        </div>`
    }).join('');

    return cardType + radioType;
}
const generateTheAdditionServiceCard = function () {
    return AdditionalServiceCardArr.map(function (el) {
        return `<div class="card" data-additionalminute=${el.additional_minute}>
                                <div class="left">
                                    <p class="title">${el.title}</p>
                                    <p class="subtitle">+${el.additional_minute} min</p>
                                </div>
                                <div class="right">
                                    <div class="cardImageContainer">
                                        <img src="https://www.drott24.se/wp-content/uploads/2022/06/MicrosoftTeams-image-1.png" alt="">
                                    </div>
                                </div>
                                <div class="cardActiveTikMarkContainer hidden">
                                    <img src="https://www.drott24.se/wp-content/uploads/2022/06/tikmark.svg" alt="">
                                </div>`
    }).join('');

}




//NOTE Service card selection
const controlServiceCardSelection = function (e) {
    console.log(this.querySelector('input').checked = false);
    if (serviceState.APPARTMENT_SIZE === 0) return;
    const card = e.target.closest('.card');
    console.log(card);
    if (!card) return;
    const cardOldPrice = +card.dataset.cardoldprice;
    const cardNewPrice = +card.dataset.cardprice;
    serviceState.SERVICE_TITLE = card.querySelector('.title').innerText;
    serviceState.SERVICE_TYPE = card.dataset.cardtype;
    visibilityControl(extraFeatureRowsecond, 'hidden');
    visibilityControl(bottomSummeryArea, 'hidden');
    clean(ecoFriendlyCleaningSupplies);
    clean(bottomAreaRegularSummeryTitle);
    if (serviceState.SERVICE_TYPE === 'card') {
        visibilityControl(featureArea, 'hidden');
        clean(summeryServiceTItle);
        render(summeryServiceTItle, serviceState.SERVICE_TITLE);
        visibilityControl(extraServiceContainer, 'hidden', false);
        clean(bottomAreaRegularSummeryTitle);
        render(bottomAreaRegularSummeryTitle, `Städning ${serviceState.REGULAR_PRICE} kr/h × ${serviceState.CLEANING_DURATION + (serviceState.EXTRA_MINUTE / 60)} h`); clean(serviceCardTitleRow.querySelector('.hour'));
        render(serviceCardTitleRow.querySelector('.hour'), `${serviceState.CLEANING_DURATION.toString().replace('.', ',')} h`);
    }
    if (serviceState.SERVICE_TYPE === 'one_time') {
        visibilityControl(featureArea, 'hidden', false);
        clean(summeryServiceTItle);
        render(summeryServiceTItle, `Städlängd`);
        visibilityControl(extraServiceContainer, 'hidden');
        render(bottomAreaRegularSummeryTitle, `Städning ${serviceState.REGULAR_PRICE} kr/h × ${serviceState.CLEANING_DURATION + (serviceState.ADDITIONAL_MINUTE_FOR_ADDITIONAL_SERVICE / 60)} h`);
        clean(serviceCardTitleRow.querySelector('.hour'));
        render(serviceCardTitleRow.querySelector('.hour'), `${(serviceState.CLEANING_DURATION + (serviceState.ADDITIONAL_MINUTE_FOR_ADDITIONAL_SERVICE / 60)).toString().replace('.', ',')} h`);

    }
    render(ecoFriendlyCleaningSupplies, ECO_FRIENDLY_CLEANING_CHARGE);
    cleanActiveClass(this);
    clean(totalPriceSelector);
    render(totalPriceSelector, cardNewPrice);
    card.classList.add('active');

    if (card.querySelector('input')) {
        if (card.querySelector('input').checked === false) {
            card.querySelector('input').checked = true;
        }
    }
    serviceState.CURRENT_PRICE = cardNewPrice;
    serviceState.REGULAR_PRICE = cardOldPrice;
    calculation();
    console.log(serviceState);
}
//NOTE control addtional servivice
const controlAdditionalServiceCardSelection = function (e) {
    if (serviceState.ADDITIONAL_MINUTE_FOR_ADDITIONAL_SERVICE === 0) {
        serviceState.ADDITIONAL_MINUTE_FOR_ADDITIONAL_SERVICE;
        const card = e.target.closest('.card');
        serviceState.ADDITIONAL_SERVICE_TITLE = card.querySelector('.title').innerText;
        serviceState.ADDITIONAL_MINUTE_FOR_ADDITIONAL_SERVICE = +card.dataset.additionalminute;
        const cardActiveTikMarkContainer = card.querySelector('.cardActiveTikMarkContainer');
        visibilityControl(cardActiveTikMarkContainer, 'hidden');
        visibilityControl(card, 'active', false);
        clean(serviceCardTitleRow.querySelector('.hour'));
        render(serviceCardTitleRow.querySelector('.hour'), `${(serviceState.CLEANING_DURATION + (serviceState.ADDITIONAL_MINUTE_FOR_ADDITIONAL_SERVICE / 60)).toString().replace('.', ',')} h`);
        console.log(serviceState);
        calculation();
    }
    else if (serviceState.ADDITIONAL_MINUTE_FOR_ADDITIONAL_SERVICE !== 0) {
        serviceState.ADDITIONAL_MINUTE_FOR_ADDITIONAL_SERVICE;
        const card = e.target.closest('.card');
        serviceState.ADDITIONAL_SERVICE_TITLE = '';
        serviceState.ADDITIONAL_MINUTE_FOR_ADDITIONAL_SERVICE = 0;
        const cardActiveTikMarkContainer = card.querySelector('.cardActiveTikMarkContainer');
        visibilityControl(cardActiveTikMarkContainer, 'hidden', false);
        visibilityControl(card, 'active');
        clean(serviceCardTitleRow.querySelector('.hour'));
        render(serviceCardTitleRow.querySelector('.hour'), `${(serviceState.CLEANING_DURATION + (serviceState.ADDITIONAL_MINUTE_FOR_ADDITIONAL_SERVICE / 60)).toString().replace('.', ',')} h`);
        console.log(serviceState);
        calculation();
    }
}

//NOTE Control PreviousNextButton

const controlPreviousNextButton = function (e) {
    e.preventDefault();
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.type === 'next') {
        parentConatiner.dataset.step = '2';
        visibilityControl(parentConatiner.querySelector('.mainContainer'), 'hidden', false);
        visibilityControl(parentConatiner.querySelector('.second--mainContainer'), 'hidden');
        visibilityControl(document.querySelector('li.step_one'), 'activeButton');
        visibilityControl(document.querySelector('li.step_two'), 'activeButton', false);
        visibilityControl(document.querySelector('.second--mainContainer__second'), 'hidden');
        visibilityControl(document.querySelector('.second--mainContainer__third'), 'hidden');
        generateButton();
    }
    if (btn.dataset.type === 'previous') {
        parentConatiner.dataset.step = '1';
        visibilityControl(parentConatiner.querySelector('.mainContainer'), 'hidden', true);
        visibilityControl(parentConatiner.querySelector('.second--mainContainer'), 'hidden', false);
        visibilityControl(document.querySelector('li.step_one'), 'activeButton', false);
        visibilityControl(document.querySelector('li.step_two'), 'activeButton',);
        visibilityControl(document.querySelector('.second--mainContainer__second'), 'hidden', false);
        visibilityControl(document.querySelector('.second--mainContainer__third'), 'hidden', false);
        generateButton();
    }

    //NOTE Control form submittion 
    if (btn.dataset.type === 'submit') {
        if (Array.from(document.querySelectorAll('input[required]')).map(el => el.value).includes('') !== true) {
            Array.from(document.querySelectorAll('input[required]'))
                .map(el => el.classList.value)
                .forEach(function (el) {
                    document.querySelector(`.${el}`).style.borderColor = 'rgb(218,219,227)'
                });
            const [petName] = Object.entries(serviceState).filter(el => el[0] === `PET_NAMES`);
            const Others = Object.entries(serviceState).filter(el => el[0] !== `PET_NAMES`);

            const Othersmarkup = Others.map(el => {
                return `${el[0]} : ${el[1]} `;
            }).join('\n');
            const petNamesMarkup = petName[1].map(el => {
                return `${el} `;
            }).join(' , ');
            const allData = `${Othersmarkup} PET_NAMES : ${petNamesMarkup}`;
            document.querySelector('.finalAllDataArea').value = allData;
            document.querySelector('.formFinalSubmit').click()
            console.log(allData);
        }
        else {
            Array.from(document.querySelectorAll('input[required]'))
                .map(el => el.classList.value)
                .forEach(function (el) {
                    document.querySelector(`.${el}`).style.borderColor = 'rgb(218,219,227)'
                });
            Array.from(document.querySelectorAll('input[required]'))
                .filter(el => el.value == '')
                .map(el => el.classList.value)
                .forEach(function (el) {
                    document.querySelector(`.${el}`).style.borderColor = 'red'
                })
        }
    }
}




//NOTE Control PetFromSubmission
const controlPetFromSubmission = function (e) {
    e.preventDefault();
    const address = addressContainer.querySelector('input.addressinput').value;
    const postcode = +addressContainer.querySelector('input.postcode').value.replaceAll(' ', '');
    console.log(serviceState.ADDRESS, postcode);
    if (between(postcode, POST_CODE) === 0) {
        serviceState.ADDRESS = address;
        serviceState.POST_CODE = postcode;
        visibilityControl(addressListPreview, 'hidden');
        clean(addressListPreview.querySelector('.addressPreview'));
        clean(addressListPreview.querySelector('.postcodePreview'));
        render(addressListPreview.querySelector('.postcodePreview'), postcode);
        render(addressListPreview.querySelector('.addressPreview'), address);
        visibilityControl(document.querySelector('.correctDateTimeWarningBoard'), 'hidden', false);
        visibilityControl(document.querySelector('.inputFieldsForDateTimeWrapper'), 'hidden');
        visibilityControl(document.querySelector('.errMessage'), 'hidden', false);
    }
    else {
        serviceState.ADDRESS = '';
        serviceState.POST_CODE = '';
        visibilityControl(addressListPreview, 'hidden', false);
        clean(addressListPreview.querySelector('.addressPreview'));
        clean(addressListPreview.querySelector('.postcodePreview'));
        render(addressListPreview.querySelector('.postcodePreview'), '');
        render(addressListPreview.querySelector('.addressPreview'), '');
        visibilityControl(document.querySelector('.correctDateTimeWarningBoard'), 'hidden');
        visibilityControl(document.querySelector('.inputFieldsForDateTimeWrapper'), 'hidden', false);
        showError('.errMessage', 'Din adress verkar inte stämma')
    }
}
const petListControl = function (e) {
    console.log(e.target);
    if (e.target.closest('.checkboxForPet').querySelector('#pet').checked) {
        visibilityControl(petCheckBoxContainer.querySelector('.petList'), 'hidden');
    }
    else if (!e.target.closest('.checkboxForPet').querySelector('#pet').checked) {
        visibilityControl(petCheckBoxContainer.querySelector('.petList'), 'hidden', false);

        visibilityControl(petListRow, 'hidden', false);
        visibilityControl(petListRow.querySelector(`.catName`), 'hidden', false);

        visibilityControl(petListRow, 'hidden');
        visibilityControl(petListRow.querySelector(`.dogName`), 'hidden', false);

        visibilityControl(petListRow, 'hidden');
        visibilityControl(petListRow.querySelector(`.otherpetName`), 'hidden', false);

        e.target.closest('.checkboxForPet').querySelectorAll('input').forEach(e => {
            e.checked = false;
        });

        serviceState.PET_NAMES = [];
        console.log(serviceState);
    }
    if (e.target.closest('.cat--class input') && serviceState.PET_NAMES.find(el => el === 'cat') === undefined) {
        visibilityControl(petListRow, 'hidden');
        visibilityControl(petListRow.querySelector(`.catName`), 'hidden');
        serviceState.PET_NAMES.push('cat');
        console.log(serviceState.PET_NAMES)
    }
    else if (e.target.closest('.cat--class input') && serviceState.PET_NAMES.find(el => el === 'cat') !== undefined) {
        visibilityControl(petListRow, 'hidden');
        visibilityControl(petListRow.querySelector(`.catName`), 'hidden', false);
        serviceState.PET_NAMES.pop('cat');
    }
    else if (e.target.closest('.dog--class input') && serviceState.PET_NAMES.find(el => el === 'dog') === undefined) {
        visibilityControl(petListRow, 'hidden');
        visibilityControl(petListRow.querySelector(`.dogName`), 'hidden');
        serviceState.PET_NAMES.push('dog');
    }
    else if (e.target.closest('.dog--class input') && serviceState.PET_NAMES.find(el => el === 'dog') !== undefined) {
        visibilityControl(petListRow, 'hidden');
        visibilityControl(petListRow.querySelector(`.dogName`), 'hidden', false);
        serviceState.PET_NAMES.pop('dog');
    }
    else if (e.target.closest('.otherpet--class input') && serviceState.PET_NAMES.find(el => el === 'other pet') === undefined) {
        visibilityControl(petListRow, 'hidden');
        visibilityControl(petListRow.querySelector(`.otherpetName`), 'hidden');
        serviceState.PET_NAMES.push('other pet');
    }
    else if (e.target.closest('.otherpet--class input') && serviceState.PET_NAMES.find(el => el === 'other pet') !== undefined) {
        visibilityControl(petListRow, 'hidden');
        visibilityControl(petListRow.querySelector(`.otherpetName`), 'hidden', false);
        serviceState.PET_NAMES.pop('other pet');
    }
    console.log(serviceState);
}


//NOTE Check header from submission 
const checkHeadingFormValidation = function () {

    const postcode = + document.querySelector('.input-post-code-for-service input.postcode').value.replaceAll(' ', '');
    console.log(postcode);
    if (between(postcode, POST_CODE) === 0 && postcode != 0) {
        visibilityControl(document.querySelector('.errorSmsOnHeader'), 'hidden', false);
        return true;
    }
    else {
        visibilityControl(document.querySelector('.errorSmsOnHeader'), 'hidden');
        showError('.errorSmsOnHeader', `Postnumret är ogiltligt,eller sà utför vi inte vâra tjänster dör för tillfället`)
        return false;
    }
}


//NOTE checkAddressAndActiveButton
const checkAddressAndActiveButton = function () {
    (document.querySelector('.addressinput').value !== '' && document.querySelector('.address--container .postcode') !== '') ? document.querySelector('.submit-pet').disabled = false : document.querySelector('.submit-pet').disabled = true;
}

//NOTE get URL  value from the url
const getTheValueFormURL = function () {
    if (window.location.search === '') return;
    const searchValue = window.location.search.slice(1).split('&');
    const searchValueArr = searchValue.map(el => {
        return el.split('=');
    }).map(el => {
        return el[1].replace('+', ' ');
    });
    areaInputField.value = searchValueArr[0];
    addressContainer.querySelector('input.postcode').value = searchValueArr[1];
    window.addEventListener('load', function () {
        setTimeout(function () {
            console.log('intervel ses');
            areaInputField.value = searchValueArr[0];
            addressContainer.querySelector('input.postcode').value = searchValueArr[1];
        }, 500);

    })
    controlAreaInputFieldValueChange();
    console.log(searchValueArr);

}
getTheValueFormURL();


const formController = function () {
    form_firstName.addEventListener('change', function () {
        visibilityControl(document.querySelector('.userInfoPreview'), 'hidden');
        clean(document.querySelector('span.p_firstName'));
        render(document.querySelector('span.p_firstName'), this.value);
    });
    form_lastName.addEventListener('change', function () {
        visibilityControl(document.querySelector('.userInfoPreview'), 'hidden');
        clean(document.querySelector('span.p_lastName'));
        render(document.querySelector('span.p_lastName'), this.value);
    });
    form_email.addEventListener('change', function () {
        visibilityControl(document.querySelector('.userInfoPreview'), 'hidden');
        clean(document.querySelector('span.p_email'));
        render(document.querySelector('span.p_email'), this.value);
    });
    form_phone.addEventListener('change', function () {
        visibilityControl(document.querySelector('.userInfoPreview'), 'hidden');
        clean(document.querySelector('span.p_phone'));
        render(document.querySelector('span.p_phone'), this.value);
    });
    form_personalIdentity.addEventListener('change', function () {
        visibilityControl(document.querySelector('.userInfoPreview'), 'hidden');
        clean(document.querySelector('span.p_personalIdentity'));
        render(document.querySelector('span.p_personalIdentity'), this.value);
    });
    document.querySelector('.for_date').addEventListener('change', function () {
        visibilityControl(document.querySelector('.dateTimePreview'), 'hidden');
        clean(document.querySelector('span.p_date'));
        render(document.querySelector('span.p_date'), this.value);
    });

}
formController();

//NOTE Global initialization
const init = function () {
    areaInputField.addEventListener('keyup', controlAreaInputFieldValueChange);
    document.querySelector('.addressinput').addEventListener('keyup', checkAddressAndActiveButton);
    document.querySelector('.address--container .postcode').addEventListener('keyup', checkAddressAndActiveButton);
    areaInputField.addEventListener('keyup', controlAreaInputFieldValueChange);
    cleaningDuration.querySelector('select').addEventListener('change', controlCleaningDurationValueChange);
    window.addEventListener('load', function () {
        clean(serviceCardContainer);
        clean(additionServiceCardContainer);
        render(serviceCardContainer, generateTheServiceCard());
        render(additionServiceCardContainer, generateTheAdditionServiceCard());
        generateButton();
    })
    serviceCardContainer.addEventListener('click', controlServiceCardSelection);
    additionServiceCardContainer.addEventListener('click', controlAdditionalServiceCardSelection);
    previousNextButtonContainer.addEventListener('click', controlPreviousNextButton);
    submitPetForm.addEventListener('click', controlPetFromSubmission);
    petCheckBoxContainer.addEventListener('click', petListControl);
    // document.querySelector(`.heading--Search_Form`).addEventListener("submit",function(){
    //     var txt = document.querySelector('.heading--Search_Form .postcode');
    //     txt.value = "165810" + txt.value;
    // });

}
init();