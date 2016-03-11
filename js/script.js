console.log($);
console.log(Backbone)
console.log(window.location.hash)
var etsyKey = 'uhdk37cf5h6h7dcxamb6eb9x'
var url = 'https://openapi.etsy.com/v2/listings/active?'
var searchBar = document.querySelector('#searchBar')


// Router
var ironEtsyRouter = Backbone.Router.extend({

    routes: {
        'details/:id': 'handle_Detail_Data',
        'search/:keywords': 'handle_Search_Data',
        '*home': 'handle_Default_Data'
    },


    handle_Detail_Data: function(searchInput) {
        var etsy_Detail_Model = new defaultModel()
        var etsy_Detail_View = new detailView(etsy_Detail_Model)
        etsy_Detail_Model.fetch({

            data: {
                api_key: etsy_Detail_Model.api_key
            }
        })
    },


    handle_Search_Data: function(keywords) {
        var etsy_Search_Model = new defaultModel()
        var etsy_Search_View = new defaultView(etsy_Search_Model)

        etsy_Search_Model.fetch({

            data: {
                search: keywords,
                api_key: etsy_Search_Model.api_key
            }
        })
    },


    handle_Default_Data: function() {
        var etsy_Default_Model = new defaultModel()
        var etsy_Default_View = new defaultView(etsy_Default_Model)
        etsy_Default_Model.fetch({

            data: {
                // search: keywords,
                api_key: etsy_Default_Model.api_key
            }
        })
    },



    initialize: function() {
        Backbone.history.start()
    }
})




// Model

var detailModel = Backbone.Model.extend({
    // 'https://openapi.etsy.com/v2/listings/active?     api_key={YOUR_API_KEY}'
    url: 'https://openapi.etsy.com/v2/listings/active?',
    api_key: etsyKey
})

var defaultModel = Backbone.Model.extend({
    // 'https://openapi.etsy.com/v2/listings/active?     api_key={YOUR_API_KEY}'
    url: 'https://openapi.etsy.com/v2/listings/active?',
    api_key: etsyKey
})







// View

var detailView = Backbone.Model.extend({
    el: '.bod',

    initialize: function(aModel) {
        this.model = aModel
        var boundRender = this._render.bind(this)
        this.model.on('sync', boundRender)
        console.log(this.model)
    },

    _render: function() {
        console.log(data)

    }

})

var searchView = Backbone.Model.extend({
    el: '.bod',

    initialize: function(aModel) {
        this.model = aModel
        var boundRender = this._render.bind(this)
        this.model.on('sync', boundRender)
    },

    _render: function() {
            // console.log(this.model.data.get('data'))
    }

})

var defaultView = Backbone.View.extend({
        el: '.bod',

        initialize: function(aModel) {
            this.model = aModel
            var boundRender = this._render.bind(this)
            this.model.on('sync', boundRender)
        },

        events:{
         // «evtType»  «domEL-selector» :  »
        	'keypress #searchBar':'_runSearch'
        },

        _runSearch:function(keypress){
        	console.log(keypress.target)

        	window.location.hash = 'search/' + keypress.target.etsyid
        },

        _render: function() {
            var listOfDescriptions = this.model.attributes.results
            listOfTitles = ''
            this.el.innerHTML = '<div class="hed">'
            this.el.innerHTML += 	'<input id="searchBar" type="textarea" placeholder="search Iron Etsy...">'
            this.el.innerHTML += '</div>'
            
           
            // console.log(this.model.get('listing_id'))
            for (var i = 0; i < listOfDescriptions.length; i++){
            	listOfTitles = listOfDescriptions[i].title
            	etsyID = listOfDescriptions[i].listing_id
            	// console.log(listOfDescriptions[i].listing_id)
            	this.el.innerHTML += '<li etsyID="'+ etsyID +'"">'+ listOfTitles +'</li>'
            }

        }

    })
    ////////////////////////////////////////////////////
var ironEtsy = new ironEtsyRouter()
