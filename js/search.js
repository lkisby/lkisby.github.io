(function() {
    function displaySearchResults(results, store) {
        var searchResults = document.getElementById('search-results');
        if (results.length) { // Are there any results?
            var appendString = '';

            for (var i = 0; i < results.length; i++) { // Iterate over the results
                var item = store[results[i].ref];
                appendString += `
            <div class="grid" style="max-width: 358px">
                <div><a href="` + item.instaLink + `" target="_blank"><img style="max-width: 100%; max-height: 100%;" src="` + item.imgSrc + `"></a></div>
                <div class="row" style="padding-left:10px; padding-right:10px">
                    <div class="col-sm" style="min-width:60%">
                        <a style="font-family: times, serif; font-size:17pt">` + item.title + `</a><br>
                        <div class="date-entry" style="padding-top: 5px; padding-left: 2px">
                            ` + item.date + `
                        </div>
                    </div>
                    <div class="col-sm" style="text-align:right; padding:20px; min-width:40%">
                        <a style="text-align:right" class="view-recipe-button" href="` + item.recipeLink + `"> View Recipe </a>
                    </div>
                </div>
                <div style="padding-left:10px; padding-right:10px; padding-top:10px; font-family: times, serif; font-size:12pt; text-align:justify">
                    ` + item.content + `
                </div>
            </div>
        `;
            }
            searchResults.innerHTML = appendString;
        } else {
            searchResults.innerHTML = 'No results found';
        }
    }

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');

        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');

            if (pair[0] === variable) {
                return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
            }
        }
    }

    var searchTerm = getQueryVariable('query');

    if (searchTerm) {

        document.getElementById('search-box').setAttribute("value", searchTerm);

        // Initalize lunr with the fields it will be searching on. I've given title
        // a boost of 10 to indicate matches on this field are more important.
        var idx = lunr(function() {
            this.field('id');
            this.field('title', {
                boost: 10
            });
            this.field('content', {
                boost: 10
            });
            this.field('instaLink');
            this.field('recipeLink');
            this.field('imgSrc');
            this.field('date');

            for (var key in window.store) { // Add the data to lunr
                this.add({
                    'id': key,
                    'title': window.store[key].title,
                    'content': window.store[key].content,
                    'instaLink': window.store[key].instaLink,
                    'recipeLink': window.store[key].recipeLink,
                    'imgSrc': window.store[key].imgSrc,
                    'date': window.store[key].date,
                });
            }
        });

        var results = idx.search(searchTerm); // Get lunr to perform a search
        displaySearchResults(results, window.store); // We'll write this in the next section

    }
}());