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
        'details/:id/:position': 'handle_Detail_Data',
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

        Search_Model.url( "keywords="+keywords )

        console.log(this.url)

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
    url: function(queryStr){
    	
    	this.url = this._buildURL
    	
    	return this._buildURL(queryStr)
    },

    _buildURL: function(queryStr){
	    	var u = window.location.hash.substr(1)
	    	var ur = u.split('/')
	    	var qStr = ''
			var queryStr = ur[1]
	    	console.log(queryStr)

	    	if (queryStr){qStr =+queryStr}
	    	var u = 'https://openapi.etsy.com/v2/listings/'+queryStr+'?includes=Images&callback=?&api_key='+this.api_key
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
    	var qStr = ''
    		console.log(queryStr)
			var u = window.location.hash.substr(1)	
	    	var ur = u.split('/')
			var queryStr = ur[1]
	    	console.log(queryStr)
    	if(queryStr){qStr = "&keywords="+queryStr}
    	var u = 'https://openapi.etsy.com/v2/listings/active.js?fields=listing_id,title,price,url&includes=Images(url_75x75),Shop&callback=?&api_key='+this.api_key+qStr
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
    },

    _render: function(data, indexNumber) {
    	var pre_IndexNumber = window.location.hash.split('/')
    	var indexNumber = pre_IndexNumber[2]
    	console.log(indexNumber)
      	console.log(data) 
       var listOfResults = data.attributes.results 	
       var item = listOfResults[indexNumber]
       // var description = item.description
      	console.log(item) 
    },

    events:{
     // «evtType»  «domEL-selector» :  »
    	'keypress #searchBar':'_runSearch',
    	'click .item': '_openItem',
    	'mouseover img': '_imageHover'
    },

    _imageHover:function(){
    	console.log('hoevr event')
    },

    _openItem:function(){
    	console.log('click event')
    },

    _runSearch:function(keypress){
    	// console.log(keypress.keyCode)
    	if (keypress.keyCode === 13){
    		var search = '/'+keypress.target.value
    		window.location.hash = 'search' + search
    	}
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
        	var indexNumber = itemNumber.attributes.indexNumber.value
        	console.log(itemNumber)
        	console.log(itemID)
        	console.log(indexNumber)
        	var deets = '/' + itemID + '/'+indexNumber
        	console.log(deets)
        	window.location.hash = 'details' + deets
        },

        _imageHover:function(){
        	console.log('place onHoverImage')
        },

        _render: function() {
            var listOfResults = this.model.attributes.results

            searchStringHed = '<div class="hed">'
            searchStringHed += 	'<input id="searchBar" type="textarea" placeholder="search Iron Etsy...">'
            searchStringHed += '</div>'
            	console.log(listOfResults)

            
            listOfTitles = ''
            // console.log(this.model.get('listing_id'))
            for (var i = 0; i < listOfResults.length; i++){

            	// itemURL = listOfResults[i].url

            	itemTitle = listOfResults[i].title

            	itemNumber = listOfResults[i].listing_id

            	itemPrice = listOfResults[i].price

            	imageURL = listOfResults[i].Images[0].url_75x75

            	onHoverImage = listOfResults[i].Images[i]



            	console.log(listOfResults[i])

            	if(this.searchQuery) {this.el.innerHTML 		= "<h3>Results from: " + this.searchQuery + "</h3>"}
            	var searchStringBod
            	searchStringBod += '<div class="item" indexNumber="'+[i] +'" itemNumber="'+ itemNumber+'"><img src="'+imageURL+'"><h3 class="title">'+itemTitle+'</h3><p class="itemPrice">'+itemPrice+'</p></div>'

            this.el.innerHTML = searchStringHed + searchStringBod


            }

        }

    })
    ////////////////////////////////////////////////////


var ironEtsy = new ironEtsyRouter()
