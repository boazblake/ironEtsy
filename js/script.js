console.log($);
console.log(Backbone)
console.log(window.location.hash)
var etsyKey = 'uhdk37cf5h6h7dcxamb6eb9x'
var url = 'https://openapi.etsy.com/v2/listings/active?'

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
                // search: keywords,
                api_key: etsy_Detail_Model.api_key
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
var searchView = Backbone.Model.extend({
    el: '#container',

    initialize: function(aModel) {
        this.model = aModel
        var boundRender = this._render.bind(this)
        this.model.on('sync', boundRender)
    },

    _render: function() {
        console.log(data)
            // console.log(this.model.data.get('data'))
    }

})

var detailView = Backbone.Model.extend({
    el: '#container',

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

var defaultView = Backbone.View.extend({
        el: '#container',

        initialize: function(aModel) {
            this.model = aModel
            var boundRender = this._render.bind(this)
            this.model.on('sync', boundRender)
            console.log(this.model)

        },

        _render: function() {}

    })
    ////////////////////////////////////////////////////
var ironEtsy = new ironEtsyRouter()
