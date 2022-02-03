$(document).ready(function() {
    const RESPONSE_TYPE_COMMON = 0;
    const RESPONSE_TYPE_NEUTER = 1;
    const RESPONSE_TYPE_ERROR = 2;
    const RESPONSE_TYPE_DEFAULT = 3;

    const responses = [
        // RESPONSE_TYPE_COMMON
        {
            div: $("#response-common"),
            label: $("#response-common-word"),
        },
        // RESPONSE_TYPE_NEUTER
        {
            div: $("#response-neuter"),
            label: $("#response-neuter-word"),
        },
        // RESPONSE_TYPE_ERROR
        {
            div: $("#response-error"),
            label: $("#response-error-word"),
        },
        // RESPONSE_TYPE_DEFAULT
        {
            div: $("#response-default"),
            label: $("#response-default-word"),
        },
    ];

    function respond(responseType, word) {
        for (const response of responses) {
            response.div.hide();
        }
        let response = responses[responseType];
        response.label.text(word);
        response.div.show();
    }

    respond(RESPONSE_TYPE_DEFAULT, "ord");

    const input = $("#word");
    input.change(function () {
        let word = input.val();
        if (word.trim()) {
            $.ajax({
                url: 'https://en.wiktionary.org/w/api.php',
                data: {
                    action: 'parse',
                    prop: 'text',
                    page: word,
                    format: 'json',
                },
                dataType:'jsonp',
                success: function (data) {
                    if (data.error) {
                        respond(RESPONSE_TYPE_ERROR, word);
                        return;
                    }

                    let entry = $(data.parse.text['*']);

                    let definitions = entry.find("strong.Latn.headword:lang(da):contains(" + word + ")");
                    if (!definitions.length) {
                        respond(RESPONSE_TYPE_ERROR, word);
                        return;
                    }

                    for (const definition of definitions) {
                        let category = definition.parentNode;
                        if (category) {
                            let gender = $(category).find("span.gender");
                            console.log(gender);
                            if (gender.length) {
                                switch (gender.text()) {
                                    case "n":
                                        respond(RESPONSE_TYPE_NEUTER, word);
                                        return;
                                    case "c":
                                        respond(RESPONSE_TYPE_COMMON, word);
                                        return;
                                    default:
                                        console.log("sdf");
                                        respond(RESPONSE_TYPE_ERROR, word);
                                        return;
                                }
                            }
                        }
                    }

                    respond(RESPONSE_TYPE_ERROR, word);
                },
                failure: function () {
                    respond(RESPONSE_TYPE_ERROR, word);
                }
            });
        } else {
            respond(RESPONSE_TYPE_DEFAULT, "ord");
        }
    });
});