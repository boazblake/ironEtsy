console.log($);
console.log(Backbone)
console.log(window.location.hash)
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
        var etsy_Detail_Model = new MultiModel()
        var etsy_Detail_View = new DetailView(etsy_Detail_Model)
        etsy_Detail_Model.fetch()
    },


    handle_Search_Data: function(keywords) {
        console.log(keywords)



        var Search_Model = new MultiModel()
        var Search_View = new MultiView(Search_Model)

        Search_Model.url( "keywords="+keywords )

        console.log(Search_Model.url)

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

var detailModel = Backbone.Model.extend({
    // 'https://openapi.etsy.com/v2/listings/active?     api_key={YOUR_API_KEY}'
    url: function(queryStr){
    	
    	this.url = this._buildURL
    	
    	return this._buildURL(queryStr)
    },

    _buildURL: function(queryStr){
	    	var qStr = ""
	    	if (queryStr){qStr = "&"+queryStr}
	    	var u = 'https://openapi.etsy.com/v2/listings/active.js?includes=Images&callback=?&api_key='+this.api_key + qStr
	    	console.log(u)
	    	return u
    },



    api_key: etsyKey
})

var MultiModel = Backbone.Model.extend({
    // 'https://openapi.etsy.com/v2/listings/active?     api_key={YOUR_API_KEY}'
     url: function(queryStr){
    	this.url = this._buildURL
    	return this._buildURL(queryStr)
    },

    _buildURL: function(queryStr){
    	var qStr = ""
    		console.log(queryStr)

    	if (queryStr){qStr = "&"+queryStr}
    	var u = 'https://openapi.etsy.com/v2/listings/active.js?includes=Images&callback=?&api_key='+this.api_key +qStr
    	console.log(u)
    	return u
    },

    api_key: etsyKey
})




// View

var DetailView = Backbone.Model.extend({
    el: '.bod',

    initialize: function(aModel) {
        this.model = aModel
        var boundRender = this._render.bind(this)
        this.model.on('sync', boundRender)
        console.log(this.model)
    },

    _render: function(data) {
        console.log(data)

    }

})

// var searchView = Backbone.Model.extend({
//     el: '.bod',

//     initialize: function(aModel) {
//         this.model = aModel
//         var boundRender = this._render.bind(this)
//         this.model.on('sync', boundRender)
//     },

//     _render: function() {
//            console.log('search')
//     }

// })

var MultiView = Backbone.View.extend({
        el: '.bod',
        searchQuery: null,
        
        initialize: function(aModel, qry) {
            this.model = aModel

            if(qry){this.searchQuery = qry}
             

            var boundRender = this._render.bind(this)
            this.model.on('sync', boundRender)
            
        },

        events:{
         // «evtType»  «domEL-selector» :  »
        	'keypress #searchBar':'_runSearch',
        	'click .item': '_openItem',
        	'mouseover img': '_imageHover'
        },

        _runSearch:function(keypress){
        	// console.log(keypress.keyCode)
        	if (keypress.keyCode === 13){
        		var search = '/'+keypress.target.value
        		window.location.hash = 'search' + search
        	}
        },

        _openItem:function(click){
        	// console.log(itemNumber)
        	click.preventDefault()
        	var itemNumber = click.currentTarget
        	var itemID = itemNumber.attributes.itemnumber.value
        	console.log(itemID)
        	var deets = '/' + itemID
        	window.location.hash = 'details' + deets
        },

        _imageHover:function(){
        	console.log('place onHoverImage')
        },

        _render: function() {
            var listOfDescriptions = this.model.attributes.results
            searchString = '<div class="hed">'
            searchString += 	'<input id="searchBar" type="textarea" placeholder="search Iron Etsy...">'
            searchString += '</div>'
            	console.log(listOfDescriptions)
            
            listOfTitles = ''
            // console.log(this.model.get('listing_id'))
            for (var i = 0; i < listOfDescriptions.length; i++){
            	// itemURL = listOfDescriptions[i].url
            	itemTitle = listOfDescriptions[i].title
            	itemNumber = listOfDescriptions[i].listing_id
            	itemPrice = listOfDescriptions[i].price
            	imageURL = listOfDescriptions[i].Images[0].url_75x75
            	onHoverImage = listOfDescriptions[i].Images[i]


            	// console.log(listOfDescriptions[i].listing_id)
            	if(this.searchQuery) {this.el.innerHTML 		= "<h3>Results from: " + this.searchQuery + "</h3>"}

            	// this.el.innerHTML += '< itemNumber="'+ itemNumber +'"">'+ listOfTitles + '<br>price:   ' +itemPrice  +'</li>'
            
            	searchString += '<div class="item" itemNumber="'+ itemNumber+'"><img src="'+imageURL+'"><h3 class="title">'+itemTitle+'</h3><p class="itemPrice">'+itemPrice+'</p></div>'

            this.el.innerHTML = searchString


            }

        }

    })
    ////////////////////////////////////////////////////


var ironEtsy = new ironEtsyRouter()
