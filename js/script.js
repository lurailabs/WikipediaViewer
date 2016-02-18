/**
 * Created by lurai on 16/2/16.
 */
var WikiSearch = function(term) {
    var lang = 'en';
    var endpoint = 'https://' + lang + '.wikipedia.org/w/api.php';

    var searchResults = function () {
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
                    wikiEntry.setUrl('https://en.wikipedia.org/wiki/' + wikiEntry.title);
                    searchImage(wikiEntry);
                }
            },
            error: function(error) {
                console.log('An error has occurred fetching data from Wikipedia: ' + error);
            }
        })
    }; //search Results

    var searchImage = function(wikiEntry) {
        $.ajax({
            url: endpoint,
            dataType: 'jsonp',
            data: {
                action: 'query',
                titles: wikiEntry.title,
                prop: 'pageimages',
                format: 'json',
                pithumbsize: 300
            },
            success: function(data) {
                var key = Object.keys(data.query.pages);
                var thumbnail = data.query.pages[key].thumbnail;
                if (thumbnail) {
                    wikiEntry.setImage(thumbnail.source);
                }
                displayContent(wikiEntry);
            },
            error: function(error) {
                console.log('An error has occurred fetching images from Wikipedia: ' + error);
            }
        })
    }; // searchImages

    return {searchResults: searchResults};
}; // Wiki


/*************************************************************/

var WikiEntry = function(title, snippet) {
    this.title = title;
    this.snippet = snippet;
    this.image = '';
    this.url = '';
};

WikiEntry.prototype.setImage = function(image) {
    this.image = image;
};

WikiEntry.prototype.setUrl = function(url){
    this.url = url;
};


/*************************************************************/

function displayContent(wikiEntry) {

    var divStr      = '';
    if (wikiEntry.image) {
        divStr = '<a href="' + wikiEntry.url + '" target="_blank">' +
                '<div class="result">' +
                    '<div class="img" style="background-image: url(\x27' + wikiEntry.image + '\x27)"></div>' +
                    '<div class="title">'   + wikiEntry.title   + '</div>' +
                    '<div class="snippet">' + wikiEntry.snippet + '</div>' +
                '</div></a>';
        $("#content").append(divStr);
    }
} // displayContent

/*************************************************************/

$('document').ready(function () {


    $('#searchBtn').click(
        function() {
            $('#content').empty();
            new WikiSearch($('#searchText').val()).searchResults();
        }
    );

    $('#randomBtn').click(
        function() {
            window.open('http://en.wikipedia.org/wiki/Special:Random');
        }
    );

});