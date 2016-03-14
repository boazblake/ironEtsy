var etsyKey = 'uhdk37cf5h6h7dcxamb6eb9x'
var url = 'https://openapi.etsy.com/v2/listings/active?'
var images = 'includes=Images,Shop'
var searchBar = document.querySelector('#searchBar')



// Router
var ironEtsyRouter = Backbone.Router.extend({

    routes: {
        'details/:id': 'handle_Detail_Data',
        'search/:keywords': 'handle_Search_Data',
        '*home': 'handle_Default_Data'
    },


    handle_Detail_Data: function() {
        var etsy_Detail_Model = new DetailModel()
        var etsy_Detail_View = new DetailView(etsy_Detail_Model)
        etsy_Detail_Model.fetch()
    },


    handle_Search_Data: function(keywords) {
        console.log(keywords)

        var Search_Model = new MultiModel()
        var Search_View = new MultiView(Search_Model)

        Search_Model.url("keywords=" + keywords)

        Search_Model.fetch()
    },


    handle_Default_Data: function() {
        var etsy_Default_Model = new MultiModel()
        var etsy_Default_View = new MultiView(etsy_Default_Model)
        etsy_Default_Model.fetch()
    },



    initialize: function() {
        Backbone.history.start()
    }
})




// Model

var DetailModel = Backbone.Model.extend({
    url: function(queryStr) {

        this.url = this._buildURL

        return this._buildURL(queryStr)
    },

    _buildURL: function(queryStr) {
        var u = window.location.hash.substr(1)
        var ur = u.split('/')
        var qStr = ''
        var queryStr = ur[1]

        if (queryStr) { qStr = +queryStr }
        var u = 'https://openapi.etsy.com/v2/listings/' + queryStr + '.js?&includes=Images(url_fullxfull)&callback=?&api_key=' + this.api_key
        console.log(u)
        
        return u
    },

    api_key: etsyKey
})

var MultiModel = Backbone.Model.extend({
    // 'https://openapi.etsy.com/v2/listings/active?     api_key={YOUR_API_KEY}'
    url: function(queryStr) {
        console.log(queryStr)
        this.url = this._buildURL
        return this._buildURL(queryStr)
    },

    _buildURL: function(queryStr) {
        var qStr = ''
        console.log(queryStr)
        var u = window.location.hash.substr(1)
        var ur = u.split('/')
        var queryStr = ur[1]
        console.log(queryStr)
        if (queryStr) { qStr = "&keywords=" + queryStr }
        var u = 'https://openapi.etsy.com/v2/listings/active.js?fields=listing_id,title,price,url&includes=Images,Shop&callback=?&api_key=' + this.api_key + qStr
        console.log(u)
        return u
    },

    api_key: etsyKey
})




// View

var DetailView = Backbone.Model.extend({
    el: document.querySelector('.bod'),  


    initialize: function(aModel) {
        this.model = aModel
        var boundRender = this._render.bind(this)
        this.model.on('sync', boundRender)
    },

    _render: function(data, indexNumber) {

        // console.log(data) 
        var listOfResults = this.model.attributes.results //data.attributes.results 	

        var item = listOfResults
        var title = item[0].title
        var desc = item[0].description
        var price = item[0].price
        var imageArray = item[0].Images
        var imageObject = imageArray[0]
        for (var key in imageObject) {
            var imageURL = imageObject[key]

            // var imageCollection = ''
            // 	for (var i = 0; i < imageArray.length; i++){
            // 	imageCollection += imageArray[i]
            // 	console.log(imageCollection)
            // 	}

        searchStringHed  = '<div class="hed">'
		searchStringHed += 		'<input id="searchBar" type="textarea" placeholder="search Iron Etsy...">'
        searchStringHed +=       '<a href="#home"><button class="homeButton">HOME</a>'
		searchStringHed += '</div>'

		var stringBod = '<div class="item">'
		stringBod 	 += 	'<img src="' + imageURL +'">'
		stringBod 	 += 	'<h3 class="title">' + title + '</h3>'
		stringBod 	 += 	'<p class="Price">' + price + '</p>'
		stringBod 	 += 	'<p class="Desc">' + desc + '</p>'
		stringBod 	 += '</div>'

		            this.el.innerHTML = searchStringHed + stringBod
        }
    },



    events: {
        // «evtType»  «domEL-selector» :  »
        'keypress #searchBar': '_runSearch',
        'click .item': '_openItem',
        'mouseover img': '_imageHover',
    },

    _runSearch: function(keypress) {
        // console.log(keypress.keyCode)
        if (keypress.keyCode === 13) {
            var search = '/' + keypress.target.value
            window.location.hash = 'search' + search
        }
    },

    _imageHover: function() {
        console.log('hover event')
    },

    _openItem: function() {
        console.log('click event')
    },

    _goHome: function(click){
        console.log(click.target)
    }
        // Backbone.events.on('click', _goHome)

})

var MultiView = Backbone.View.extend({
        el: '.bod',
        // searchQuery: null,

        initialize: function(aModel, qry) {
            this.model = aModel

            // if(qry){this.searchQuery = qry
            // 	console.log(searchQuery)}
            //  console.log(qry)


            var boundRender = this._render.bind(this)
            this.model.on('sync', boundRender)

        },

        _render: function() {
            var listOfResults = this.model.attributes.results

            searchStringHed = '<div class="hed">'
            searchStringHed += '<input id="searchBar" type="textarea" placeholder="search Iron Etsy...">'
            searchStringHed += '</div>'

            listOfTitles = ''
            for (var i = 0; i < listOfResults.length; i++) {

                itemTitle = listOfResults[i].title

                itemNumber = listOfResults[i].listing_id

                itemPrice = listOfResults[i].price

                imageURL = listOfResults[i].Images[0].url_fullxfull

                onHoverImage = listOfResults[i].Images[i]


                var searchHed = ''
                    // if(typeof this.searchQuery === 'string') {searchHed += "<h3>Results from: " + this.searchQuery + "</h3>"}
                var stringBod =
                    stringBod += '<div.itemContainer>'
                    stringBod += '<div class="item" indexNumber="' + [i] + '" itemNumber="' + itemNumber + '">'
                    stringBod +=    '<img class="multiImg" src="' + imageURL + '">'
                    stringBod +=    '<h3 class="title">' + itemTitle + '</h3>'
                    stringBod +=    '<p class="itemPrice">' + itemPrice + '</p>'
                    stringBod += '</div></div>'
                this.el.innerHTML = searchStringHed + stringBod

            }

        },

        events: {
            // «evtType»  «domEL-selector» :  »
            'keypress #searchBar': '_runSearch',
            'click .item': '_runDetailView',
            'mouseover img': '_imageHover'
        },

        _runSearch: function(keypress) {
            if (keypress.keyCode === 13) {
                var search = '/' + keypress.target.value
                window.location.hash = 'search' + search
            }
        },

        _runDetailView: function(click) {
            click.preventDefault()
            var itemNumber = click.currentTarget
            var itemID = itemNumber.attributes.itemnumber.value
            console.log(itemNumber)
            var deets = '/' + itemID
            window.location.hash = 'details' + deets
        },

        _imageHover: function() {
            console.log('place onHoverImage')
        },

    })
    ////////////////////////////////////////////////////


var ironEtsy = new ironEtsyRouter()

// multiple events trigger same function
// function app(){
//     function waterHazard(){
//     alert('kerplunk!')
//     }
    
//     function teeOff(){
//     alert('fore!')
//     Backbone.Events.trigger('miss')
//     }

    
//     Backbone.Events.on('miss',waterHazard)
// back
    
//     teeOff()
// }

