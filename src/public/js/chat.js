$(document).ready(function () {
    StartChat();
});

//Clic Derecho
//document.oncontextmenu = function () { return false }
var globalkey = 1;
//Deshabilitar Seleccionar
// function disableselect(e) {
//    return false;
// }
// function reEnable() {
//    return true;
// }
// document.onselectstart = new Function("return false");
// if (window.sidebar) {
//    document.onmousedown = disableselect;
//    document.onclick = reEnable
// }
// Deshabilitar arrastre de imagen
window.onload = function () {
    var images = document.getElementsByTagName('img');
    for (var i = 0; img = images[i++];) {
        img.ondragstart = function () { return false; };
    }
};


function StartChat() {

    Typing();
    $.ajax({
        url: '/waconnection',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            //$("#contex").val(data.contex);
            $("#SessionID").val(data.session.result.session_id);
            $message = $($('.message_template').clone().html());
            $message.addClass('left').find('.text').html(data.message.result.output.generic[0].text);
            $('.messages').append($message);
            $(".messages").find(".typing").remove();
            return setTimeout(function () {
                return $message.addClass('appeared');
            }, 0);
        },
        error: function () {
            $message = $($('.message_template').clone().html());
            $message.addClass('left').find('.text').html("Connection lost");
            $('.messages').append($message);
            $(".messages").find(".typing").remove();
            return setTimeout(function () {
                return $message.addClass('appeared');
            }, 0);
        }
    });
}

function Typing() {
    var $message;
    $message = $($('.typing_message_template').clone().html());
    $message.addClass('left').find('.text').html('typing');
    $('.messages').append($message);
    $message.find('.typing-indicator').removeAttr('hidden');
    $message.addClass('typing');
    return setTimeout(function () {
        return $message.addClass('appeared');
    }, 0);
}




function loadHide() {
    $('#loading').hide();
}

function loadShow() {
    $('#loading').show();
}

/* CHAT */

$('.message_input').keyup(function (e) {
    if (e.which === 13) {
        Chat();
    }
});

$('.send_message').click(function (e) {
    Chat();
});

function Chat() {
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side; this.typing = arg.typing;
        this.draw = function (_this) {
            return function () {
                if (_this.typing == 1) {
                    Typing();
                }
                else {
                    var test = "sadfasdfasdf <BR>"
                    $message = $($('.message_template').clone().html());
                    $message.addClass(_this.message_side).find('.text').html(_this.text);
                    $('.messages').append($message);
                    $(".messages").find(".typing").remove();
                    return setTimeout(function () {
                        return $message.addClass('appeared');
                    }, 0);
                }

            };
        }(this);
        return this;
    };

    $(function () {
        var getMessageText, message_side, sendMessage;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };

        sendMessage = function (text, position) {
            var $messages, message, message2;
            if (text.trim() === '') {
                return;
            }
            $('.message_inque tal put').val('');
            $messages = $('.messages');
            message_side = position;
            message = new Message({
                text: text,
                message_side: message_side,
                typing: 0
            });
            message.draw();
            message2 = new Message({
                text: 'typing',
                message_side: 'left',
                typing: 1
            });
            message2.draw();

            var url = $("#url-get-answer").val();
            var contexval = $("#contex").val();
            var Sessionval = $("#SessionID").val();
            var data = {
                text: text,
                contex: contexval,
                SessionID: Sessionval
            };
            $('.message_input').val('');
            $.ajax({
                url: '/wamessage',
                type: 'POST',
                data: data,
                dataType: 'json',
                success: function (data) {
                    
                    //if (data.e == 1) {

                    //var json = JSON.parse(data.result.output.generic);
                    //$("#contex").val(data.context);
                    //$("#SessionID").val(data.SessionID);
                    var generic = data.result.output.generic
                    var title = "", description = ""
                    var message = "";
                    var multiplebox = 0; // pinta una sola caja con un mensaje
                    var messages = [];
                    Object.keys(generic).forEach(function (item) {
                        //console.log(item + " - " + generic[item].response_type)
                        var data = generic[item]
                        if (data.hasOwnProperty("title"))
                            title = '<p></p><p>' + data.title + '</p>'
                        if (data.hasOwnProperty('description'))
                            description = '<p></p><p>' + data.description + '</p>'
                        switch (data.response_type) {
                            case "image":
                                message += title + description + newImage(data.source)
                                break
                            case "text":
                                var test = "hAllow miles wound place the leave had. To sitting subject no improve studied limited. Ye indulgence unreserved connection alteration appearance my an astonished. Up as seen sent make he they of. Her raising and himself pasture believe females. Fancy she stuff after aware merit small his. Charmed esteems luckily age out. \n\nStarted several mistake joy say painful removed reached end. State burst think end are its. Arrived off she elderly beloved him affixed noisier yet. An course regard to up he hardly. View four has said does men saw find dear shy. Talent men wicket add garden. \n\nMan request adapted spirits set pressed. Up to denoting subjects sensible feelings it indulged directly. We dwelling elegance do shutters appetite yourself diverted. Our next drew much you with rank. Tore many held age hold rose than our. She literature sentiments any contrasted. Set aware joy sense young now tears china shy. ";
                                var replacedBreaks = data.text.replace(/(?:\r\n|\r|\n)/g, '<br>');
                                message += replacedBreaks
                                //message += data.text
                                break
                            case "option":
                                message += title + description + newUlMessage(data.options)
                                break
                            case "search":
                                var replacedBreaksSearch = "";

                                if (data.results.length == 0) {
                                    replacedBreaksSearch = data.header.replace(/(?:\r\n|\r|\n)/g, '<br>');
                                    message += replacedBreaksSearch
                                } else {
                                    multiplebox = 1; // Multiples cajas
                                    data.results.forEach(function (bodyresult) {

                                        var bodytext = bodyresult.body.toString();
                                        replacedBreaksSearch = bodytext.replace(/(?:\r\n|\r|\n)/g, '<br>');
                                        //replacedBreaksSearch = bodytext;
                                        messages.push(replacedBreaksSearch);
                                    });


                                }
                                //var replacedBreaksSearch = data.text.replace(/(?:\r\n|\r|\n)/g, '<br>');
                                //messages += replacedBreaksSearch

                                break;


                            case "pause":

                                break;
                        }
                    })
                    if (multiplebox == 1) {
                        var count = globalkey;

                        messages.forEach(function (box) {

                            //message2 = new Message({
                            //    text: box,
                            //    message_side: 'left',
                            //    typing: 0
                            //});


                            //message2.draw();
                            //message2 = "";
                            var someString = box;

                            var lengnth = someString.length;


                            var index = someString.indexOf(" ", 145);  // Get string con los primeros 145 caracteres
                            var id = someString.substr(0, index); // Preview text 
                            var text = someString.substr(index + 1);  // Show more text

                            $message = $($('.message_template_C').clone().html());
                            if (someString.length > 145) {
                                $message.addClass('left').find('.text_C').html(id + '<span class = "dots' + count + ' "  id="dots">...</span><span class = "more' + count + ' " id="more"></spam><br>');
                            } else {
                                $message.addClass('left').find('.text_C').html(someString + '<span class = "dots' + count + ' "  id="dots"></span>');
                            }
                            if (someString.length > 145) {

                                $message.addClass('left').find('.more' + count).html(text);
                                $message.addClass('left').find('.more' + count).after($('<br><a  class="myBtn' + count + ' left-btn" onclick="myCollapse(' + count + ')" id="myBtn"><i class="fa fa-arrow-down " aria-hidden="true"></i></a>'));
                            }

                            // $('more' + count).after($(' <button class="myBtn' + count + '" onclick="myCollapse(' + count + ')" id="myBtn">Read more</button>'));

                            $('.messages').append($message);
                            $(".messages").find(".typing").remove();
                            $message.addClass('appeared');
                            count = count + 1;
                            globalkey = count;

                        })

                        return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);


                    } else {

                        message2 = new Message({
                            text: message,
                            message_side: 'left',
                            typing: 0
                        });
                        message2.draw();
                        return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);


                    }


                    //}
                    //else if (data.e == 0) {
                    //    message2 = new Message({
                    //        text: data.error,
                    //        message_side: 'left',
                    //        typing: 0
                    //    });
                    //    message2.draw();
                    //    return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
                    //}
                },
                error: function () {
                    message2 = new Message({
                        text: "Connection lost",
                        message_side: 'left',
                        typing: 0
                    });
                    message2.draw();
                    return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
                }
            });
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        sendMessage(getMessageText(), 'right');
    });
}
function myCollapse(num) {




    var dots = document.getElementsByClassName("dots" + num);
    var moreText = document.getElementsByClassName("more" + num);
    var btnText = document.getElementsByClassName("myBtn" + num);

    if (dots[0].style.display === "none") {
        dots[0].style.display = "inline";
        btnText[0].innerHTML = '<i class="fa fa-arrow-down" aria-hidden="true"></i>';
        moreText[0].style.display = "none";
    } else {
        dots[0].style.display = "none";
        btnText[0].innerHTML = '<i class="fa fa-arrow-up " aria-hidden="true"></i>';
        moreText[0].style.display = "inline";
    }
}






function newImage(imagen) {
    var img = '<img src="' + imagen + '" width="100%"><br><br>'
    return img
}

function newUlMessage(options) {
    var ul = '<ul>'
    Object.keys(options).forEach(function (index) {
        var option = options[index]
        var li = '<li><a href="#" class="linkOpt" style="cursor:pointer" data-value="' + option.label + '">' + option.label + '</a></li>'
        ul += li
    })
    ul += '</ul>'
    return ul
}

$(document).on("click", ".linkOpt", function (e) {
    e.preventDefault()
    var value = $(this).data("value")
    //console.log(value)
    $('.message_input').val(value)

    //return setTimeout(function () {
    //    return $message.addClass('appeared');
    //}, 0);


    Chat();

})

function MessageError(InfoError) {
    $message = $($('.message_template').clone().html());
    $message.addClass('left').find('.text').html(InfoError);
    $('.messages').append($message);
    $(".messages").find(".typing").remove();
    $message.addClass('appeared');
    return setTimeout(function () {
        return $('.messages').animate({ scrollTop: $('.messages').prop('scrollHeight') }, 300);
    }, 0);
}





