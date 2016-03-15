var etsyKey = 'uhdk37cf5h6h7dcxamb6eb9x'
var url = 'https://openapi.etsy.com/v2/listings/active?'
var images = 'includes=Images,Shop'
var searchBar = document.querySelector('#searchBar')



// Router
var ironEtsyRouter = Backbone.Router.extend({

    routes: {
        'details/:shopID/:id': 'handle_Detail_Data',
        // 'details/:shopID/:id': 'handle_Shop_Data',
        'search/:keywords': 'handle_Search_Data',
        '*home': 'handle_Home_Page'
    },


    handle_Detail_Data: function() {
        var etsy_Detail_Model = new DetailModel()
        var etsy_Detail_View = new DetailView(etsy_Detail_Model)
        etsy_Detail_Model.fetch()
    },
    

    handle_Shop_Data: function() {
        var etsy_Shop_Model = new ShopModel()
        var etsy_Shop_View = new ShopView(etsy_Shop_Model)
        etsy_Shop_Model.fetch()
    },

    handle_Search_Data: function(keywords) {
        console.log(keywords)

        var Search_Model = new MultiCollection()
        var Search_View = new MultiView(Search_Model, keywords)

        Search_Model.url("keywords=" + keywords)

        Search_Model.fetch()
    },

    handle_Home_Page: function() {
        var etsy_Default_Collection = new MultiCollection()
        var etsy_Default_View = new MultiView(etsy_Default_Collection)
        etsy_Default_Collection.fetch().then(function(arg) {
            // console.log(arg)
        })
    },



    initialize: function() {
        Backbone.history.start()
    }
})




// Model

var DetailModel = Backbone.Model.extend({
    url: function(listing_id) {

        this.url = this._buildURL

        return this._buildURL(listing_id)
    },

    _buildURL: function(shop_id) {
        var hashBar = window.location.hash.substr(1)
        var hashBarArray = hashBar.split('/')
        var hashString = ''
        var listing_id = hashBarArray[2]
        console.log(listing_id)

        if (listing_id) { hashString = +listing_id }
        console.log(hashString)
        var URL = 'https://openapi.etsy.com/v2/listings/' + listing_id + '.js?&includes=Images,Shop&callback=?&api_key=' + this.api_key

        return URL
    },

    parse: function(JSONdata) {
        if (JSONdata.results !== undefined && JSONdata.results.length === 1) {
            return JSONdata.results[0]
        } else return JSONdata
    },

    api_key: etsyKey
})


var ShopModel = Backbone.Model.extend({

    url:function(shop_id) {
        this.url = this._build_ShopURL
        return this.url(shop_id)
    },

    shopURL: function(shop_id) {
        this.shopURL = this._build_ShopURL
        return this._build_ShopURL(shop_id)
    },

    _build_ShopURL: function(shop_id){
        var hashBar = window.location.hash.substr(1)
        var hashBarArray = hashBar.split('/')
        var hashString = ''
        var shop_id = hashBarArray[1]
        console.log(shop_id)
        var URLshop = 'https://openapi.etsy.com/v2/shops/' + shop_id + '/listings/active.js?&includes=Images,Shop&?callback=?&api_key=' + this.api_key
        console.log(URLshop)
        
        return URLshop
    },


    api_key:etsyKey

})


var MultiCollection = Backbone.Collection.extend({

    model: DetailModel,

    parse: function(JSONdata) {
        return JSONdata.results
    },

    // 'https://openapi.etsy.com/v2/listings/active?     api_key={YOUR_API_KEY}'
    url: function(queryStr) {
        this.url = this._buildURL
        return this._buildURL(queryStr)
    },

    _buildURL: function(queryStr) {
        var qStr = ''
        var u = window.location.hash.substr(1)
        var ur = u.split('/')
        var queryStr = ur[1]
        if (queryStr) { qStr = "&keywords=" + queryStr }
        var u = 'https://openapi.etsy.com/v2/listings/active.js?fields=listing_id,title,price,url&includes=Images,Shop&callback=?&api_key=' + this.api_key + qStr
        return u
    },

    api_key: etsyKey
})




// View

var DetailView = Backbone.View.extend({
    el: '.bod',

    initialize: function(aModel) {

        this.model = aModel
        var boundRender = this._render.bind(this)
        this.model.on('sync', boundRender)
        
    },

    _render: function() {

        // console.log(this.el)
        var title = this.model.get('title')

        var desc = this.model.get('description')
        var price = this.model.get('price')
        var imageArray = this.model.get('Images')
        var imageSide = ''
        var image

        for (var i = 0; i < imageArray.length; i++) {
            image = imageArray[i].url_fullxfull
            console.log(image)
            imageSide += '<img class="sidePic" src="' + image+ '">'
            console.log(imageSide)

        }


        var stringBod_Data = ''
        var stringBod_image = ''
        var searchStringHed = ''



        searchStringHed = '<div class="hed">'
        searchStringHed +=      '<input id="searchBar" type="text" placeholder="search Iron Etsy...">'
        searchStringHed +=      '<a href="#home"><i class="fa fa-home"></i></a>'
        searchStringHed += '</div>'

        stringBod_image = '<div class="itemBox">'
        stringBod_image +=      '<img class="mainPic" src="' + image + '">'
        stringBod_image +='<div class="sidePicCont">'
        stringBod_image += imageSide
        // stringBod_image +=      '<img class="sidePic"src="' + image[1] + '">'
        // stringBod_image +=      '<img class="sidePic"src="' + image[2] + '">'
        // stringBod_image +=      '<img class="sidePic"src="' + image[3] + '">'
        stringBod_image +='</div>'
        stringBod_Data += '</div>'


        stringBod_Data += '<div class="data">'
        stringBod_Data +=       '<h3 class="title">' + title + '</h3>'
        stringBod_Data +=       '<p class="price"$>' + price + '</p>'
        stringBod_Data += '<div class="otherStuff"></div>'
        stringBod_Data += '</div>'

        stringBod_Data += '<p class="desc">' + desc + '</p>'

        this.el.innerHTML = searchStringHed + stringBod_image + stringBod_Data
            // console.log(this.el.innerHTML)

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

    _goHome: function(click) {
            console.log(click.target)
        }
        // Backbone.events.on('click', _goHome)
})

var ShopView = Backbone.View.extend({
    el: '.otherStuff',

    initialize: function(aModel) {
        this.model = aModel
        console.log(this.model)
        var boundRender = this._render.bind(this)
        this.model.on('sync', boundRender)
    },

    _render:function() {
        console.log(this.el)
    }
})

var MultiView = Backbone.View.extend({
        el: '.bod',
        searchQuery: null,

        initialize: function(collection, keywords) {
            this.searchQuery = keywords
            this.collection = collection
            var boundRender = this._render.bind(this)
            this.collection.on('sync', boundRender)

        },

        _render: function() {

            var listOfResults = this.collection.models
            searchStringHed = '<div class="hed">'
            searchStringHed += '<input id="searchBar" type="text" placeholder="search Iron Etsy...">'
            searchStringHed += '</div>'

            if (typeof this.searchQuery === 'string') { searchStringHed += "<h3>You Searched For: " + this.searchQuery + "</h3>" }




            var stringBod = '<div class="itemContainer">'

            var searchHed = ''



            listOfTitles = ''
            for (var i = 0; i < listOfResults.length; i++) {
                var etsyProductModel = listOfResults[i]

                var itemTitle = etsyProductModel.get('title')

                var itemNumber = etsyProductModel.get('listing_id')

                var shopID = etsyProductModel.attributes.Shop.shop_id
                
                var itemPrice = etsyProductModel.get('price')

                var imageURL = listOfResults[i].get('Images')[0].url_fullxfull

                stringBod += '<div class="itemCollections" indexNumber="' + [i] + '">'
                stringBod += '<img class="multiImg" src="' + imageURL + '" itemNumber="' + itemNumber + '"  shopID="' + shopID + '">'
                stringBod += '<h5 class="title">' + itemTitle + '</h5>'
                stringBod += '<p class="itemPrice"> $' + itemPrice + '</p>'
                stringBod += '</div>'
            }
            stringBod += '</div>'

            this.el.innerHTML = searchStringHed + searchHed + stringBod


        },

        events: {
            // «evtType»  «domEL-selector» :  »
            'keypress #searchBar': '_runSearch',
            'click img.multiImg': '_runDetailView',
            'mouseover img': '_imageHover'
        },

        _runSearch: function(keypress) {
            if (keypress.keyCode === 13) {
                var search = '/' + keypress.target.value
                window.location.hash = 'search' + search
                window.iNode = keypress.target.value
                console.log(window.iNode)
            }
        },

        _runDetailView: function(click) {
            click.preventDefault()
            var itemNumber = click.currentTarget
            var itemID = itemNumber.attributes.itemnumber.value
            var shopID = itemNumber.attributes.shopid.value
            console.log(shopID)
            var deets = '/' + shopID + '/' + itemID
            window.location.hash = 'details' + deets
        },

        _imageHover: function() {
            console.log('place onHoverImage')
        },

    })
    ////////////////////////////////////////////////////


var ironEtsy = new ironEtsyRouter()

// add anchor tags to nav bar with words


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
