var etsyKey = 'uhdk37cf5h6h7dcxamb6eb9x'
var url = 'https://openapi.etsy.com/v2/listings/active?'
var images = 'includes=Images,Shop'
var searchBar = document.querySelector('#searchBar')



// //////////////// BACKBONE MODELS AND COLLECTIONS
// The Models and Collections are directed by the router to get the required data from the API.
// the model sets up the URL and parses the returned JSON object for the required data
// 
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
        if (listing_id) { hashString = +listing_id }
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


var ShopCollection = Backbone.Collection.extend({

    model: DetailModel,

    parse: function(JSONdata) {
        // console.log(JSONdata.results)
        // if (JSONdata.results !== undefined && JSONdata.results.length === 1) {
        //     return JSONdata.results
        // } else 
        return JSONdata.results
    },

    url: function(shop_id) {
        this.url = this._build_ShopURL
        console.log(this.url(shop_id))
        return this.url(shop_id)
    },

    _build_ShopURL: function(shop_id) {
        var hashBar = window.location.hash.substr(1)
        var hashBarArray = hashBar.split('/')
        var hashString = ''
        var shop_id = hashBarArray[1]
            // console.log(shop_id)
            // https://openapi.etsy.com/v2/shops/:shop_id/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo&callback=?.
        hashString = 'https://openapi.etsy.com/v2/shops/' + shop_id + '/listings/active.js?api_key=' + this.api_key + '&includes=Images&callback=?'
        return hashString
    },

    api_key: etsyKey
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



// //////////// BACKBONE ROUTER
//  sets up the routes with the corresponding methods for each view.
//  first the model (and url is defined) then the model and view are synced and a fetch is initiated.
var IronEtsyRouter = Backbone.Router.extend({
    
    initialize: function() {
        routes: {
            'details/:id/:shopID': 'handle_Shop_Data',
            'search/:keywords': 'handle_Search_Data',
            '*home': 'handle_Home_Page'
        },

        handle_Detail_Data: function() {
            var etsy_Detail_Model = new DetailModel()
            var etsy_Detail_View = new DetailView(etsy_Detail_Model)
            etsy_Detail_Model.fetch()//.then(function(){console.log(data)})
        },

        handle_Shop_Data: function() {
            var etsy_Shop_Collection = new ShopCollection()
            var etsy_Shop_View = new ShopView(etsy_Shop_Collection)
            etsy_Shop_Collection.fetch()
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
            etsy_Default_Collection.fetch()
        },

            Backbone.history.start()
    }

})


// //////////// BACKBONE VIEWS
// The view defines where and how the data is presented to the user. First the desired DOM node is defined (by class or id)
// in the initialize function I added a loading Gif to play during the time it takes for the data to be returned from the API. This function also binds the model to the the detail context.
var DetailView = Backbone.View.extend({
    el: '.bod',

    initialize: function(aModel) {
        this.el.innerHTML = '<img class="loadingGif" src="http://i.imgur.com/X6kTu.gif">'

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

// This was done before I learnt about .map ;)
        for (var i = 0; i < imageArray.length; i++) {
            image = imageArray[i].url_fullxfull
                console.log(image)
            imageSide += '<img class="sidePic ' + [i] + '" src="' + image + '">'
                console.log(imageSide)

        }


        var stringBod_Data = ''
        var stringBod_image = ''
        var searchStringHed = ''

// All this is taken care if with REACT!

        searchStringHed = '<div class="hed">'
        searchStringHed += '<input id="searchBar" type="text" placeholder="search Iron Etsy...">'
        searchStringHed += '<a href="#home"><i class="fa fa-home"></i></a>'
        searchStringHed += '<ul class="navBar">'
        searchStringHed += '<a href="#search/Clothing"><li>Clothing</li></a>'
        searchStringHed += '<a href="#search/Jewelry"><li>Jewelry</li></a>'
        searchStringHed += '<a href="#search/Craft"><li>Craft</li></a>'
        searchStringHed += '<a href="#search/Weddings"><li>Weddings</li></a>'
        searchStringHed += '<a href="#search/Entertainment"><li>Entertainment</li></a>'
        searchStringHed += '<a href="#search/Home"><li>Home</li></a>'
        searchStringHed += '<a href="#search/Vintage"><li>Vintage</li></a>'
        searchStringHed += '</ul>'


        searchStringHed += '</div>'

        stringBod_image = '<div class="itemBox">'
        stringBod_image += '<img class="mainPic" src="' + image + '">'
        stringBod_image += '<div class="sidePicCont">'
        stringBod_image += imageSide
        stringBod_image += '</div>'
        stringBod_Data += '</div>'


        stringBod_Data += '<div class="data">'
        stringBod_Data += '<h3 class="title">' + title + '</h3>'
        stringBod_Data += '<p class="price">$' + price + '</p>'
        stringBod_Data += '<div class="otherStuff"></div>'
        stringBod_Data += '</div>'

        stringBod_Data += '<p class="desc">' + desc + '</p>'

        this.el.innerHTML = searchStringHed + stringBod_image + stringBod_Data
            console.log(this.el.innerHTML)

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

    // _goHome: function(click) {
    //         console.log(click.target)
    //     }
        // Backbone.events.on('click', _goHome)
})

var ShopView = Backbone.View.extend({
    el: '.bod',

    initialize: function(collection) {
        this.el.innerHTML = '<img class="loadingGif" src="http://i.imgur.com/X6kTu.gif">'
        this.collection = collection
        var boundRender = this._render.bind(this)
        this.collection.on('sync', boundRender)
    },

    _render: function() {



        var listingSearch = window.location.hash.substr(1)
        var listingNumber = listingSearch.split('/')
        var selectedItem = listingNumber[2]
        console.log(selectedItem)


        var shopDataArray = this.collection.models

        for (var i = 0; i < shopDataArray.length; i++) {
            var etsyUserModels = shopDataArray[i]

            var listingID = etsyUserModels.get('listing_id')

            imgObj_Array = etsyUserModels.get('Images')
                // console.log(imgObj_Array)

            var imageObj = imgObj_Array[0]
            var imageObjID = imgObj_Array[0].listing_id
            var imageURL = imgObj_Array[0].url_fullxfull
            var title = etsyUserModels.get('title')
            var price = etsyUserModels.get('price')
            var description = etsyUserModels.get('description')
            var chosenOne
            var otherStuff

            if (imageObjID.toString() === selectedItem.toString()) {

                console.log(price)

                chosenOne += '<img src="' + imageURL + '"class="itemPicked" listingID="' + listingID + '">'

            } else {

                otherStuff += '<img src="' + imageURL + '"class="itemList" listingID="' + listingID + '">'

            }

        }
        var mainPicCon = ''
        var searchStringHed = ''
        var arrowBox = ''
        searchStringHed += '<div class="hed">'
        searchStringHed +=      '<input id="searchBar" type="text" placeholder="search Iron Etsy...">'
        searchStringHed += '<a href="#home"><i class="fa fa-home"></i></a>'
        searchStringHed += '<ul class="navBar">'
        searchStringHed +=      '<a href="#search/Clothing"><li>Clothing</li></a>'
        searchStringHed +=      '<a href="#search/Jewelry"><li>Jewelry</li></a>'
        searchStringHed +=      '<a href="#search/Craft"><li>Craft</li></a>'
        searchStringHed +=      '<a href="#search/Weddings"><li>Weddings</li></a>'
        searchStringHed +=      '<a href="#search/Entertainment"><li>Entertainment</li></a>'
        searchStringHed +=      '<a href="#search/Home"><li>Home</li></a>'
        searchStringHed +=      '<a href="#search/Vintage"><li>Vintage</li></a>'
        searchStringHed += '</ul>'
        searchStringHed += '</div>'


        mainPicCon +=           '<div class="chosen">' + chosenOne + '</div>'
        mainPicCon +=           '<div class="deets">'
        mainPicCon +=               '<div class="title">' + title + '</div>'
        mainPicCon +=               '<div class="desc">' + description + '</div>'
        mainPicCon +=               '<div class="price">$' + price + '</div>'
        mainPicCon +=           '</div>'

        arrowBox +=         '<div class="arrowBox"><i class="fa fa-arrow-left"></i></div>'
        arrowBox +=         '<div class="arrowBox"><i class="fa fa-arrow-right"></i></div>'
        
        function _nextOne(MouseClickEvent){
            console.log(MouseClickEvent)
        }
        Backbone.Events.trigger('click .fa-arrow-left', _nextOne)

        this.el.innerHTML = searchStringHed + mainPicCon +  arrowBox+ '<div class="otherstuff">'+otherStuff +'</div>'



    },


    _changeHash: function(event) {
        var newPick = event.target.attributes.listingID.value
        var oldHash = window.location.hash.substr(1)
        var oldHashArray = oldHash.split('/')
        var newHash = oldHashArray[0] + '/' + oldHashArray[1] + '/' + newPick
        window.location.hash = newHash
        console.log(newHash),
            console.log(event.target.attributes.listingID.value)
    },

    events: {
        'click .itemList': '_changeHash',
        'click .fa-arrow-left': '_nextOne',
    }
})

var MultiView = Backbone.View.extend({
        el: '.bod',
        searchQuery: null,

        initialize: function(collection, keywords) {
            this.el.innerHTML = '<img class="loadingGif" src="http://i.imgur.com/X6kTu.gif">'
            this.searchQuery = keywords
            this.collection = collection
            var boundRender = this._render.bind(this)
            this.collection.on('sync', boundRender)

        },

        _render: function() {

            searchStringHed = '<div class="hed">'
            searchStringHed += '<input id="searchBar" type="text" placeholder="search Iron Etsy...">'
            searchStringHed += '</div>'
            searchStringHed += '<ul class="navBar">'
            searchStringHed += '<a href="#search/Clothing"><li>Clothing</li></a>'
            searchStringHed += '<a href="#search/Jewelry"><li>Jewelry</li></a>'
            searchStringHed += '<a href="#search/Craft"><li>Craft</li></a>'
            searchStringHed += '<a href="#search/Weddings"><li>Weddings</li></a>'
            searchStringHed += '<a href="#search/Entertainment"><li>Entertainment</li></a>'
            searchStringHed += '<a href="#search/Home"><li>Home</li></a>'
            searchStringHed += '<a href="#search/Vintage"><li>Vintage</li></a>'
            searchStringHed += '</ul>'

            if (typeof this.searchQuery === 'string') { searchStringHed += "<h3>You Searched For: " + this.searchQuery + "</h3>" }




            var stringBod = '<div class="itemContainer">'

            var searchHed = ''


            var listOfResults = this.collection.models
            for (var i = 0; i < listOfResults.length; i++) {
                var etsyProductModels = listOfResults[i]
                console.log(listOfResults[i])

                var itemTitle = etsyProductModels.get('title')

                var itemNumber = etsyProductModels.get('listing_id')

                var shopID = etsyProductModels.attributes.Shop.shop_id

                var itemPrice = etsyProductModels.get('price')

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
            'click img.multiImg': '_runDetailView',  //
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

// Invoking a new instance of the router protoype.
var ironEtsy = new IronEtsyRouter()

//  view on promise return
// .then(function(arg) {
//             console.log(arg)
//         })

// multiple events trigger same function...

// function app(){
//     function waterHazard(){
//     alert('kerplunk!')
//     }

//     function teeOff(){
//     alert('fore!')
//     Backbone.Events.trigger('miss')
//     }


//     Backbone.Events.on('click .img',waterHazard)
//

//     teeOff()
// }
