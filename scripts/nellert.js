$(document).ready(function() {   
    const input = $("#word");

    input.change(function () {
        let word = input.val();
        if (word.trim()) {
            $.get("https://da.wikipedia.org/w/api.php?action=parse&page=Wikipedia:Unusual_articles/Places_and_infrastructure&prop=wikitext&section=5&format=json", function (data) {
                console.log(data);
            });
        }
    });
});