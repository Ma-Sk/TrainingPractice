let doctorID = -1;

function onClickChoose() {
    if (document.forms[0].answer[0].checked) {
        console.log("one");
    } else if (document.forms[0].answer[1].checked) {
        console.log("two");
        window.open("patient.html");
    }
    // debugger;
}

function onClickChooseAction() {
    if (!(doctorID === -1)) {
        if (document.forms[1].answer[0].checked) {
            console.log("one");
            document.getElementById("warningNoId").innerText = "";
            window.open("deletePatient.html");
        } else if (document.forms[1].answer[1].checked) {
            console.log("two");
            document.getElementById("warningNoId").innerText = "";
            window.open("createAssignment.html");
        }
    }else{
        document.getElementById("warningNoId").innerText = "Enter your id first"
    }
    // debugger;
}

function isValidPatient() {
    if (!isNaN(document.forms[0].answer.value)) {
        console.log("none");
        document.getElementById("warning").innerText = "";
    } else {
        console.log("yep");
        document.getElementById("warning").innerText = "Incorrect input";
    }
}

function isValidPatientSubmit() {
    if (!isNaN(document.forms[0].answer.value)) {
        console.log("none");
        document.getElementById("warning").innerText = "";
        document.getElementById("doctorInfo").innerText = "Your Info";
    } else {
        console.log("yep");
        document.getElementById("warning").innerText = "Incorrect input";
    }
}
function isValidPatientSubmitDelete() {
    if (!isNaN(document.forms[0].answer.value)) {
        console.log("none");
        document.getElementById("warning").innerText = "";
        document.getElementById("doctorInfo").innerText = "Deleted";
    } else {
        console.log("yep");
        document.getElementById("warning").innerText = "Incorrect input";
    }
}

function isValidDoctor() {
    var id = document.forms[0].answer.value;
    if (!isNaN(id)) {
        console.log("none");
        document.getElementById("warning").innerText = "";
        document.getElementById("doctorInfo").innerText = "Your Info";
        doctorID = id;
    } else {
        console.log("yep");
        document.getElementById("warning").innerText = "Incorrect input";
    }
}

function onMainLoad() {
    console.log("HELLO");
    const form = document.getElementById("formM");
    const formInfo = document.createElement('formInfo');
    formInfo.id = 'formInfo';
    formInfo.innerHTML =
        `<div><p><b>Кто вы?</b></p>
        <p><input type="radio" name="answer" value="a1">Доктор<Br>
            <input type="radio" name="answer" value="a2">Пациент<Br>
        <p><input type="button" value="Подтвердить" size="150" onclick="onClickChoose()"> </p>
        </div>`;
    form.appendChild(formInfo);
}

// window.onload = onMainLoad();

function onPatientLoad() {
    console.log("HELLO");
    const form = document.getElementById("formP");
    const formInfo = document.createElement('div');
    formInfo.id = 'formInfo';
    formInfo.innerHTML =
        `<p><b>Введите ваш ID</b></p>
        <p><input type="text" name="answer" value="" onchange="isValidPatient()"><Br>
        <p><input type="button" value="Подтвердить" size="150" onclick="isValidPatientSubmit()"> </p>
        <label id="warning"></label>`;
    form.appendChild(formInfo);
}

function onDeleteLoad() {
    console.log("HELLO");
    const form = document.getElementById("formD");
    const formInfo = document.createElement('div');
    formInfo.id = 'formInfo';
    formInfo.innerHTML =
        `<p><b>Введите ваш ID</b></p>
        <p><input type="text" name="answer" value="" onchange="isValidPatient()"><Br>
        <p><input type="button" value="Подтвердить" size="150" onclick="isValidPatientSubmitDelete()"> </p>
        <label id="warning"></label>`;
    form.appendChild(formInfo);
}


function onDoctorLoad() {
    console.log("HELLO");


    const form = document.getElementById("formD");
    const formInfo = document.createElement('div');
    formInfo.id = 'formInfo';
    formInfo.innerHTML =
        `<p><b>Введите ваш ID</b></p>
        <p><input type="text" name="answer" value="" onchange="isValidDoctor()"><Br>
        <p><input type="button" value="Подтвердить" size="150" onclick="isValidDoctor()"> </p>
        <label id="warning"></label>`;
    form.appendChild(formInfo);



    const form2 = document.getElementById("formAction");
    const formInfo2 = document.createElement('div');
    formInfo2.id = 'formAction';
    formInfo2.innerHTML =
        `<p><b>Что вы отите сделать?</b></p>
        <p><input type="radio" name="answer" value="a1">Выписать пациента<Br>
            <input type="radio" name="answer" value="a2">Создать назначение<Br>
        <p><input type="button" value="Подтвердить" size="150" onclick="onClickChooseAction()"> </p>
        <label id="warningNoId"></label>`;
    form2.appendChild(formInfo2);

}