/**
 * Created by lurai on 16/2/16.
 */

var WikiSearch = function(term, lang) {
    var lang        = lang || 'en';
    var endpoint    = 'https://' + lang + '.wikipedia.org/w/api.php';

    var searchResults = function() {
        $.ajax({
            url: endpoint,
            dataType: 'jsonp',
            data: {
                format: 	'json',
                action: 	'query',
                list: 		'search',
                srlimit: 	50,
                srsearch:   term,       // word to seach
                srprop:     'snippet'   // I don't want size, num. of words...
            },
            success: function(data) {
                var searchData = data.query.search;
                var wikiEntry;
                for (var i=0; i<searchData.length; i++) {
                    wikiEntry = new WikiEntry(searchData[i].title, searchData[i].snippet + '...');
                    wikiEntry.setUrl('https://' + lang + '.wikipedia.org/wiki/' + wikiEntry.title);
                    searchImage(wikiEntry);
                }
            },
            error: function(error) {
                console.log('An error has occurred fetching data from Wikipedia');
            }
        })
    }; //search Results

    var searchImage = function(wikiEntry) {
        $.ajax({
            url: endpoint,
            dataType: 'jsonp',
            data: {
                action:     'query',
                titles:     wikiEntry.title,
                prop:       'pageimages',
                format:     'json',
                pithumbsize: 300
            },
            success: function(data) {
                var key         = Object.keys(data.query.pages);
                var thumbnail   = data.query.pages[key].thumbnail;
                if (thumbnail) {
                    wikiEntry.setImage(thumbnail.source);
                }
                displayResults(wikiEntry);
            },
            error: function(error) {
                console.log('An error has occurred fetching images from Wikipedia');
            }
        })
    }; // searchImages

    return {searchResults: searchResults};
}; // Wiki


/*************************************************************/

var WikiEntry = function(title, snippet) {
    this.title      = title;
    this.snippet    = snippet;
    this.image      = '';
    this.url        = '';
};

WikiEntry.prototype.setImage = function(image) {
    this.image = image;
};

WikiEntry.prototype.setUrl = function(url) {
    this.url = url;
};


/*************************************************************/

function displayResults(wikiEntry) {

    var divStr      = '';
    if (wikiEntry.image) {
        divStr = '<a href="' + wikiEntry.url + '" target="_blank">' +
                '<div class="result">' +
                    '<div class="img" style="background-image: url(\x27' + wikiEntry.image + '\x27)"></div>' +
                    '<div class="title">'   + wikiEntry.title   + '</div>' +
                    '<div class="snippet">' + wikiEntry.snippet + '</div>' +
                '</div></a>';
        $("#search-results").append(divStr);
    }
} // displayResults

/*************************************************************/

$('document').ready(function () {

    var $searchBtn   = $('.searchBtn');
    var $searchInput = $('.searchInput');
    var $lang        = $('.lang');

    $searchBtn.click(
        function() {
            $('#search-results').empty();
            new WikiSearch($searchInput.val(), $lang.val()).searchResults();
            $searchInput.val('');
        }
    );

    $('#randomBtn').click(
        function() {
            window.open('http://' + $lang.val() + '.wikipedia.org/wiki/Special:Random', '_blank');
        }
    );

    $searchInput.keyup(function(event) {
        if(event.keyCode == 13) {
            $searchBtn.click();
        }
    });

    new WikiSearch('Wikipedia').searchResults();

});