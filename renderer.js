const {ipcRenderer, clipboard, nativeImage} = require('electron');
const fs = require('fs');
const ck3 = require('./js/ck3');

var ctx = {
    selected_id : undefined,
    format : undefined,
    data : [],
    dialog : {
        add : {
            object : undefined,
            open : false,
            img : undefined
        },
        edit : {
            object : undefined,
            open : false,
            img : undefined
        }
    }
}

jQuery(function(){

    constructUi();
    registerEventHandler();
    triggerDefaultEvent();

    registerIpcEventHandler();

    loadDnaDatabase();

    $('body').show();
});


function constructUi() {

    $("button").button();

    $("#list-dna-item").sortable();
    $("input[name=dna-format]").checkboxradio();
    $("#fldset-dna-format").controlgroup();

    makeAddDnaDialog();
    makeEditDnaDialog();

}

function registerEventHandler() {
    $("#btn-add-dna").click( function(e) {
        ctx.dialog.add.object.dialog("open");
        ctx.dialog.add.open = true;
        e.preventDefault();
    });

    $("#btn-del-dna").click( function(e) {
        let id = ctx.selected_id;

        if(id) {
            setDnaCodeTextareaContent("");
            $("#main-img").attr('src', null);
            $(`#${id}`).remove();

            for(let i in ctx.data) {
                if(id == ctx.data[i].id) {
                    ctx.data[i].remove = true;
                }
            }

            ctx.selected_id = undefined;
        }
        else {
            alert('삭제할 항목을 선택 해주세요.');
        }
    });

    $("#btn-edit-dna").click( function(e) {
        let id = ctx.selected_id;

        if(id) {
            let data = ctx.data.filter( (e) => { return e.id == id; })[0];

            fillEditDialogForm(data.geneArray);

            ctx.dialog.edit.object.dialog("open");
            ctx.dialog.edit.open = true;
            e.preventDefault();
        }
        else {
            alert('편집할 항목을 선택 해주세요');
        }
    });

    $("input[type=number]").keyup(function(e){

        if( $(this).val() < 0) {
            alert("값의 범위는 0 ~ 255 입니다");
            $(this).val(0);
        }
        else if( $(this).val() > 255 ) {
            alert("값의 범위는 0 ~ 255 입니다");
            $(this).val(255);
        } else {}
    });

    $("select").selectmenu({
        width:280
    });

    $("input[name=dna-format]").click(function(e) {

        if( ctx.format != $(this).attr('id') ) {

            ctx.format = $(this).attr('id');

            if(ctx.selected_id) {
                let id = ctx.selected_id;
                let obj = ctx.data.filter( (e) => { return e.id == id; })[0];

                if(ctx.format == 'base64') {
                    setDnaCodeTextareaContent(obj.dna);
                }
                else if(ctx.format == 'rulerdesigner') {
                    setDnaCodeTextareaContent(obj.rulerdesigner);
                } else {

                }
            }
        }
        else {

        }
    });
}

function triggerDefaultEvent() {
    $("#base64").trigger("click");
}

function loadDnaDatabase() {
    ctx.data = ck3.loadDnaDb();

    if(ctx.data) {
        for(let item of ctx.data) {
            item.temp = false;
            addDnaItemToList(item);
        }
    }
    else {
        // First Launch
        ctx.data = [];
    }
}

function registerIpcEventHandler() {

    ipcRenderer.on("EVT-KEYBOARD", (event, key) => {
        if(key == "Ctrl-D") {
            if(ctx.dialog.add.open) {
                let text = clipboard.readText().trim();

                if(text.length > 0) {
                    $("#dlg-dna").val(text);
                }
            }
        }

        if(key == "Ctrl-I") {
            if(ctx.dialog.add.open) {
                let image = clipboard.readImage();

                if( image.isEmpty() ) {
                    alert('This is not image format');
                } else {

                    const imgSize = image.getSize();

                    if(imgSize.width > 920) {
                        image = image.resize({width:920});
                    }

                    ctx.dialog.add.img = image;

                    $("#dlg-img").attr("src", image.toDataURL());
                }
            }
        }
    });

    ipcRenderer.on("REQ_CTX_DATA", (event, arg) => {

        if(arg == "save_exit") {
            requestIpcEvent("RES_CTX_DATA_SAVE_EXIT", ctx.data);
        }
        else if(arg == "exit") {
            requestIpcEvent("RES_CTX_DATA_EXIT", ctx.data);
        }
        else {}


    });
}

function requestIpcEvent(evtName, data) {
    ipcRenderer.send(evtName, data);
}

function setDnaCodeTextareaContent(code) {
    $("#ta-code-dna").text(code);
    copyCodeToClipboard(code);
}

function copyCodeToClipboard(code) {
    navigator.clipboard.writeText(code);
}

function makeAddDnaDialog() {

    ctx.dialog.add.object = $("#add-dna-dialog-form").dialog({
        autoOpen : false,
        height : 700,
        width : 1000,
        modal : true,
        buttons : {
            "DNA 추가" : addDnaDialogOk,
            "취소" : function() {
                addDnaDialogClose();
                ctx.dialog.add.object.dialog("close");
            }
        },
        close : addDnaDialogClose
    });

    function addDnaDialogOk() {

        let name = $("#dlg-name").val().trim();
        let dna = $("#dlg-dna").val().trim();
        let img = ctx.dialog.add.img;

        if(validateForm(name, dna)) {
            let item = compileDnaItem(name, dna, img);

            item.temp = true;
            ctx.data.push(item);

            addDnaItemToList(item);
            addDnaDialogClose();
            ctx.dialog.add.object.dialog("close");
        }
        else {
            alert('비어있는 항목이 있습니다.');
        }

    }

    function addDnaDialogClose() {
        $('input[name=dlg-input-text]').val('');
        $('#dlg-img').attr('src', null);
        ctx.dialog.add.open = false;
    }

    function validateForm(name, dna) {
        if(name.trim().length == 0) return false;
        if(dna.trim().length == 0) return false;

        return true;
    }

    function compileDnaItem(name, dna, img) {
        let id = Date.now();
        let dnaType = dna.includes("ruler_designer") ? "rulerdesigner" : "base64";
        let geneArray = undefined;

        if(dnaType == "rulerdesigner") {
            geneArray = ck3.parseRulerDesignerDna(dna);
        } else if(dnaType == "base64") {
            geneArray = ck3.parseBase64Dna(dna);
        }

        let result = ck3.validateGeneArray(geneArray);
        if(result.error) {
            alert(result.message + "\n\n문제가 발생 한 부분은 디폴트 값으로 변경 합니다.");
            geneArray = ck3.mitigateInvalidGeneArray(geneArray);
        }

        let item = {
            id : id,
            name : name,
            dna : ck3.toBase64Format(geneArray),
            geneArray : geneArray
        }

        if(img) {
            if(img.isEmpty() == false) {
                fs.writeFile(`data/img/${id}.png`, img.toPNG(), (err) => {
                    if(err) throw err;
                });
            }
        }

        return item;
    }
}

function makeEditDnaDialog() {

    ctx.dialog.edit.object = $("#edit-dna-dialog-form").dialog({
        autoOpen : false,
        height : 700,
        width : 1200,
        modal : true,
        buttons : {
            "Base64" : function(){
                let geneArray = compileGeneArray();
                let code = ck3.toBase64Format(geneArray);
                copyCodeToClipboard(code);

                console.log(code);
            },
            "Ruler-Desginer" : function(){
                let geneArray = compileGeneArray();
                let code = ck3.toRulerDesignerFormat(geneArray);
                copyCodeToClipboard(code);

                console.log(code);
            },
            "종료" : function() {
                editDnaDialogClose();
                ctx.dialog.edit.object.dialog("close");
            }
        },
        close : editDnaDialogClose
    });

    function editDnaDialogClose() {
        ctx.dialog.edit.open = false;
    }

    function compileGeneArray() {
        let geneArray = [];
        let geneIndex = ck3.getGeneIndexKeys();


        $(".hair_color").each( (index, item) => {
            geneArray.push( $(item).val() );
        });

        $(".skin_color").each( (index, item) => {
            geneArray.push( $(item).val() );
        });

        $(".eye_color").each( (index, item) => {
            geneArray.push( $(item).val() );
        });

        for(let gene of geneIndex) {
            geneArray.push( $(`#${gene}_current`).children(":selected").val() );
            geneArray.push( $(`.${gene}`).first().val() );
            geneArray.push( $(`#${gene}_inherit`).children(":selected").val() );
            geneArray.push( $(`.${gene}`).last().val() );
        }

        geneArray = geneArray.map((e) => { return Number(e)});

        return geneArray;
    }

}

function addDnaItemToList(item) {
    let geneArray = ck3.parseBase64Dna(item.dna);
    item.rulerdesigner = ck3.toRulerDesignerFormat(geneArray);
    item.geneArray = geneArray;

    let name = (item.name.length > 25) ? item.name.substr(0, 25).concat("...") : item.name;

    let li = $(`<li id="${item.id}" class="ui-state-default">${name}</li>`)
        .click( function(e) {
            ctx.selected_id = item.id;

            $("li").removeClass("selected");
            $(`#${item.id}`).addClass("selected");

            if(ctx.format == 'base64') {
                setDnaCodeTextareaContent(`${item.dna}`);
            }
            else if(ctx.format == 'rulerdesigner') {
                setDnaCodeTextareaContent(`${item.rulerdesigner}`);
            }
            else {}

            const image = nativeImage.createFromPath(`data/img/${item.id}.png`);
            if(image.isEmpty() == false) {
                const resized = image.resize({width:450});

                $("#main-img").attr('src', resized.toDataURL());
                $("#main-img-frame").css('height', `${resized.getSize().height}px` );
                $("#main-img-frame").show();
            }
            else {
                $("#main-img-frame").hide();
                $("#main-img").attr('src', null);
            }

            e.preventDefault();
        });

    $("#list-dna-item").append(li);
}

function fillEditDialogForm(geneArray) {
    let i = 0;

    let geneIndex = ck3.getGeneIndexKeys();

    $(".hair_color").each( (index, item) => {
        $(item).val( geneArray[i++] );
    });
    $(".skin_color").each( (index, item) => {
        $(item).val( geneArray[i++] );
    });
    $(".eye_color").each( (index, item) => {
        $(item).val( geneArray[i++] );
    });

    for(let gene of geneIndex) {
        $(`#${gene}_current`).children().each( (index, item) => {
            if($(item).val() == geneArray[i]) {
                $(item).attr('selected', 'selected');
                $(`#${gene}_current`).selectmenu("refresh", true);
            }
        });
        $(`.${gene}`).first().val(geneArray[i+1]);
        $(`#${gene}_inherit`).children().each( (index, item) => {
            if( $(item).val() == geneArray[i+2] ) {
                $(item).attr('selected', 'selected');
                $(`#${gene}_inherit`).selectmenu("refresh", true);
            }
        });
        $(`.${gene}`).last().val(geneArray[i+3]);

        i = i + 4;
    }


}