function replaceNbsps(str) {
  var re = new RegExp(String.fromCharCode(160), "g");
  return str.replace(re, " ");
}

var imgDomains = new Array();
PageNo="Side";
PageOf="af";
NextPageText ="";
PrevPageText ="";
cId=54;
contId=11;
customerId=0;
rp=150;
so=3;
weightBeforeZipCode=200000;
var newSlide = '';
var getCurrentListContent = '';
var getCurrentListHeader = "";
var getClassName = '';
var getCurrentPlistClassName = '';
var getCurrentFilterName = "";
var selectedFiltersArray = [];
var getAllActiveClasses = '';
var maxLengthShortDesc = "";

(function (m, $) {

    this.JsonProductList = function (selector, serviceUrl, testMode) {
        selector = "#" + selector;
        var getUrl = '';
        var filters = {};
        this.loadCompleted = 'JsonProductListLoadCompleted';
        this.jsonData = null;
        var me = this;
        this.fetchEarly = false;

        goToPage(serviceUrl);

        function parseJSON(jsondata,append){

            if(jsondata.data.totalProducts >= 1) {
                $('#relatedProductsHeader').show();
                $('#relatedProducts').show();
            }

            if(!jsondata.data.items){
                return;
            }
            me.jsonData = jsondata.data;

            var divList
            if(!append){

                divList = $("<div class='products'></div>");
                if(location.href.indexOf("/basket/shoppingcart.aspx")!=-1) {

                }
                else {
                    $(selector).empty();
                    $(selector).append(divList);
                }

            }else{

                divList = $(selector + " > div.products");
            }
            var productCount=0;

            $.each(jsondata.data.items, function(key, val) {

                //Make sure to get the correct stock message
                var deliveryData = "nothing";
                var hasExpectedDelivery = 'false';

                if(val.inventoryCountFormatted >= 1) {
                    deliveryData = val.inStockMessage;
                    hasExpectedDelivery = 'false';

                }
                if(val.inventoryCountFormatted <= 0) {
                    if(val.hasExpectedDeliveryDate == true) {
                        deliveryData = val.expectedDeliveryDateFormatted;
                        hasExpectedDelivery = 'true';
                    }
                    else {
                        deliveryData = val.notInStockMessage ;
                        hasExpectedDelivery = 'false';
                    }
                }

                //Get the main image url from the product, and if no image is found load the no image replacement
                var imgsrc = "";
                if(val.images[0]){
                    imgsrc = val.images[0].url.replace(/sizeId=([0-9]+)/,"sizeId=4620");
                }
                else
                {
                    imgsrc = "/SL/SI/695/7e8d0f1e-58b2-4bcb-a41d-d124a29c18fc.jpg";
                }

                //Create the add to basket button
                var addToBasketData = "";
                var addToBasketTxt = "Læg i kurv";
                if(val.showAddToBasket = "true") {
                    if(val.isBuyable = "true") {

                      basketDiv = $("<div></div>");
                      if(typeof val.customFields["isFromHelsam"] !== "undefined" && val.customFields["In stock"] === "No" && typeof val.customFields["Expected Delivery Date"] === "undefined"  && val.customFields["isFromHelsam"] !== "FALSE"){

                        basketDiv.addClass("addToBasketLnk productOutOfStock");
                        basketDiv.text('Udsolgt');

                      }

                      else if(typeof val.customFields["isFromHelsam"] !== "undefined" && typeof val.customFields["In stock"] === "undefined"  && val.customFields["isFromHelsam"] !== "FALSE"){

                        basketDiv.addClass("addToBasketLnk productOutOfStock");
                        basketDiv.text('Udsolgt');

                      }

                      else{


                        basketDiv.click(function(){

                            if(val.grossWeightFormatted >= weightBeforeZipCode) {
                                ActivateBasketButtonPrompt(val.eSellerId,0,'',1,'GET',encodeURIComponent(window.location.pathname + window.location.search),false,true,val.expectedDeliveryDateFormatted);
                            }
                            else {
                                atbNoQty(val.eSellerId, 0, 1, '', '', '', '', encodeURIComponent(window.location.pathname + window.location.search));
                            }
                        });
                        basketDiv.addClass("addToBasketLnk");
                        basketDiv.text(addToBasketTxt);
                      }

                    }

                }

                productDiv = $("<div></div>");
                productDiv.addClass("productElement item");

                if($('.searchResultsProductsOuterBdy').length > 0){

                    var eSellerIDstring = val.eSellerId;
                    eSellerIDstring = eSellerIDstring.toString();

                    if(jQuery.inArray(eSellerIDstring, getAllSearchProductsIDsArray) !== -1) {

                        var sortOrderValue = getAllSearchProductsIDsArray[($.inArray(eSellerIDstring, getAllSearchProductsIDsArray) + 1) % getAllSearchProductsIDsArray.length];
                        productDiv.attr('id', sortOrderValue);

                    }
                    else {
                        console.log('is not in array');
                    }
                }

                productImageDiv = $("<div></div>");
                productImageDiv.addClass("productImage");
                productLink = $("<a></a>");
                productLink.attr("href",val.URLPathAndQuery);
                productImg = $("<img></img>");
                productImg.attr("src", imgsrc);
                productImg.attr("alt", val.name);
                productLink.append(productImg);
                productImageDiv.append(productLink);

                productDiv.append(productImageDiv);
                productnameDiv = $("<div></div>");
                productnameDiv.addClass("productName");
                productNameLnk = $("<a></a>");
                productNameLnk.attr("href",val.URLPathAndQuery);
                productNameLnk.text(val.name);
                productnameDiv.append(productNameLnk);
                productDiv.append(productnameDiv);

                console.log(val.inventoryCount);

                productDescriptionDiv = $('<div></div>');
                productDescriptionDiv.addClass('productDescriptionDiv');
                productDescriptionLnk = $('<a></a>');
                productDescriptionLnk.attr('href', val.URLPathAndQuery);

                if(val.customFields === undefined || val.customFields === null || val.customFields.length === 0) {}
                else {
                    maxLengthShortDesc = val.customFields["Kort Beskrivelse"];

                    if(maxLengthShortDesc === undefined || maxLengthShortDesc === null || maxLengthShortDesc === 0) {}
                    else {

                        maxLengthShortDesc = replaceNbsps(maxLengthShortDesc);
                        maxLengthShortDesc = maxLengthShortDesc.trim();
                        maxLengthShortDesc = maxLengthShortDesc.substring(0,100);

                        maxLengthShortDesc += "...";

                    }
                }

                productDescriptionLnk.append(maxLengthShortDesc);
                productDescriptionDiv.append(productDescriptionLnk);
                productDiv.append(productDescriptionDiv);

                productPriceDiv = $('<a></a>');
                productPriceDiv.attr('href', val.URLPathAndQuery);
                productPriceDiv.addClass('productPriceDiv');
                if(!val.hasSalesPrice == false) {

                    if(typeof val.customFields["Vareprøve"] === "undefined" || val.customFields["Vareprøve"] === "FALSE"){
                      productPriceDiv.append(val.salesPrices[0].tagPriceFormatted);
                    }

                }
                productDiv.append(productPriceDiv);
                productDiscountPriceDiv = $('<a></a>');
                productDiscountPriceDiv.attr('href', val.URLPathAndQuery);
                productDiscountPriceDiv.addClass('productDiscount');
                if(val.hasSalesPrice === false) {
                    //console.log('no salesprice(s)');
                }
                else {
                    if(val.salesPrices[0].hasPreviousPrice == true) {
                        if(!val.salesPrices[0].previousTagPrice == 0) {
                            productDiscountPriceDiv.append($('#itemDiscount').text());

                            prevPriceValue = val.salesPrices[0].previousTagPrice;
                            currentPriceValue = val.salesPrices[0].tagPrice;
                            sumOfPriceValues = 0;
                            sumOfPriceValues = parseFloat(prevPriceValue) - parseFloat(currentPriceValue);
                            sumOfPriceValues = sumOfPriceValues.toFixed(2);
                            sumOfPriceValues = sumOfPriceValues.replace(/\./g, ',');
                            productDiscountPriceDiv.append('DKK ' + sumOfPriceValues);
                        }
                    }
                }
                productDiv.append(productDiscountPriceDiv);


                productStockDiv = $('<div></div>"');
                productStockDiv.addClass('product-list-stock');

                if(typeof val.customFields["In stock"] !== "undefined"){
                  if(val.customFields["In stock"] === "Yes"){
                    productStockDiv.append('<span class="in-stock"><i class="fa fa-circle"></i> På lager - Levering 1-3 dage</span>');
                  }
                  else if(val.customFields["In stock"] === "No" && typeof val.customFields["Expected Delivery Date"] !== "undefined" && val.customFields["Expected Delivery Date"].length > 0  && val.customFields["isFromHelsam"] !== "FALSE"){
                    productStockDiv.append('<span class="expected-delivery"><i class="fa fa-circle"></i> Forventet leveringsdato ' + val.customFields["Expected Delivery Date"] + '</span>');
                  }
                  else{
                    productStockDiv.append('<span class="not-in-stock"><i class="fa fa-circle"></i> Udsolgt - Kan ikke bestilles</span>');
                  }
                }

                else if(typeof val.customFields["In stock"] === "undefined" && typeof val.customFields["isFromHelsam"] !== "undefined" && val.customFields["isFromHelsam"] !== "FALSE"){
                  productStockDiv.append('<span class="not-in-stock"><i class="fa fa-circle"></i> Udsolgt - Kan ikke bestilles</span>');
                }

                productDiv.append(productStockDiv);

                basketDivInfoIcon = $('<a></a>');
                basketDivInfoIcon.addClass('pListInfoIcon');
                basketDivInfoIcon.attr('href', val.URLPathAndQuery);
                basketDivInfoIcon.append('<img src="/media/337/img/InfoBtn.png" />');

                if(val.customFields === undefined || val.customFields === null || val.customFields.length === 0) {}
                else {
                    if(val.customFields['Opskrifter'] === "Yes" || val.customFields['Videoer'] === "Yes" || val.customFields['Artikler'] === "Yes") {}
                    else {
                        productDiv.append(basketDivInfoIcon);
                        productDiv.append(basketDiv);
                    }
                }

                if(val.hasSalesPrice == false) {

                }
                else {
                    if(val.salesPrices[0].lineDiscountPercentageFormatted != "0.00") {
                        productTilbudIconLnk = $('<a></a>');
                        productTilbudIconLnk.attr('href', val.URLPathAndQuery);
                        productTilbudIconLnk.addClass('iconTilbud');
                        productTilbudIcon = $('<img />');
                        productTilbudIcon.attr('src', '/media/337/img/Tilbud.png');
                        productTilbudIcon.attr('alt', '');
                        productTilbudIconLnk.append(productTilbudIcon);
                        productDiv.append(productTilbudIconLnk);
                    }
                }

                if(location.href.indexOf("/basket/shoppingcart.aspx")!=-1){
                    $("#basketOffersCarousel").data('owlCarousel').addItem(productDiv);
                }
                else {
                    $(selector + " > div.products").append(productDiv);
                }
            });

            /*if(!$('ul#brandsList').length == 0){
                //Change the negative margin for brands json
                var getNativeHeightFromJson = Math.floor($('#ShopContent .jsonProducts').height());
                getNativeHeightFromJson = getNativeHeightFromJson + 44;
                $('ul#brandsList li.brandListItem.activeBrand').css('margin-bottom', getNativeHeightFromJson);
                getNativeHeightFromJson = -Math.abs(getNativeHeightFromJson);
                $('#ShopContent .jsonProducts').css('margin-top', getNativeHeightFromJson);
            };*/

            //Make sure we remeber to sort the productlist gained on the search result page
            //And to show header when there are items
            if($('.searchResultsProductsOuterBdy').length > 0){
                tinysort('#searchResultsProductsBdy ul li',{attr: 'id'});
            };

            updateUrl();

            prefetch = $("<link></link>");
            prefetch.attr("rel","prefetch");
            if(jsondata.data.previousLink && jsondata.data.previousLink.length>0){
                prefetch.attr("href",document.location.protocol + "//" + document.location.hostname + jsondata.data.previousLink);
                prefetch.appendTo("head");
            }
            if(jsondata.data.nextLink && jsondata.data.nextLink.length>0){
                prefetch.attr("href",document.location.protocol + "//" + document.location.hostname + jsondata.data.nextLink);
                prefetch.appendTo("head");
            }

        }

        function goToPage(url) {

            getUrl = url;
            fetchEarly = false;
            if(getUrl.indexOf("p=1&")!=-1&&getUrl.indexOf("rp=72")==-1){
                fetchEarly = false;
            }
            if(getUrl.indexOf("RelatedProducts")!=-1){
                fetchEarly = true;
            }
            if(fetchEarly){

                getUrlEarly = getUrl.replace(/rp=([0-9](.?)\&)/,"rp=72&");
                if(getUrl.indexOf("RelatedProducts")!=-1){
                    getUrlEarly = getUrl + "&maxResults=72";
                }
                //console.log("Before replace" + getUrl);
                //console.log("After replace" + getUrlEarly);
                $.ajax({
                    url: getUrlEarly,
                    dataType: 'json',
                    async: true,
                    success: function(jsondata) {
                        parseJSON(jsondata,false);
                        //Update the pager with current results
                        setPager(jsondata.data.pageNumber, jsondata.data.previousLink, jsondata.data.nextLink, jsondata.data.totalPages);

                        $(document).trigger(me.loadCompleted, { data: jsondata.data, error: jsondata.error });

                    }
                });


            }

            if(location.pathname=="/"||location.pathname=="" || location.href.indexOf("/pi/")!=-1){

            }
            else {

                $.getJSON(url, function(jsondata) {
                    if($("div.plist").html() && $("div.plist").html().length>10){
                        //ensure that if the second call is faster than the first one, the productlist is overwritten
                        fetchEarly=false;
                    }
                    parseJSON(jsondata,fetchEarly);
                    //Update the pager with current results
                    setPager(jsondata.data.pageNumber, jsondata.data.previousLink, jsondata.data.nextLink, jsondata.data.totalPages);

                    $(document).trigger(me.loadCompleted, { data: jsondata.data, error: jsondata.error });
                })
                    .fail(function() {
                        //console.log("Parse or network error");
                        $("#loaderDiv").text("");
                    });}
        }


        function setPager(currentPage, previousPage, nextPage, totalPages) {
            if(!$("div.pager")||$("div.pager").length<1){
                plist = $("<div></div>");
                plist.addClass("pager");
                plist2 = plist.clone();
                $(".jsonProducts").prepend(plist);
                $(".jsonProducts").append(plist2);
            }
            var target = $("div.pager");
            target.empty();
            if (previousPage && previousPage.length > 0) {
                var pageLink = $("<a href='javascript:void(0);' class='previousPageLnk' data-URLPathAndQuery='" + previousPage + "'><span class='icon prev'></span>" + PrevPageText + "</a></div>");
                pageLink.click(function () {
                    $(window).scrollTop(0);
                    //jQuery.bbq.pushState("page="+getUrlVars(previousPage)["p"]);
                    goToPage(previousPage.replace("&imgSizeId=0",""));
                });
                target.append(pageLink);
            }


            if(currentPage && totalPages){
                pagecount = $("<span class='pagecountspan'></span>");
                pagecount.text(PageNo + " " + currentPage + " " + PageOf + " " + totalPages);
                multipage = $("<span></span>");
                multipage.addClass('multipageBdy');

                for(i=1;i<=totalPages;i++){
                    pagelink = $("<span></span>");
                    pagelink.attr("data-index",i)
                    pagelink.attr("data-currentPage",productList);
                    pagelink.text(i);
                    if(i==currentPage){
                        pagelink.addClass("currentpage");
                    }
                    pagelink.click(function(){
                        //alert($(this).attr("data-index"));
                        //jQuery.bbq.pushState("page="+$(this).attr("data-index"));
                        goToPage($(this).attr("data-currentPage").replace($(this).attr("data-currentPage").match(/&p=([0-9]{1,2})/)[0],"&p=" + $(this).attr("data-index")));
                    });
                    multipage.append(pagelink);
                }
                target.append(multipage);
                //target.append(pagecount);
            }


            if (nextPage && nextPage.length > 0) {
                var nextLink = $("<a href='javascript:void(0);' class='nextPageLnk' data-URLPathAndQuery='" + nextPage + "'>" + NextPageText + "<span class='icon next'><div style='clear:both;'></div></span></a>");
                nextLink.click(function () {
                    $(window).scrollTop(0);
                    //jQuery.bbq.pushState("page="+getUrlVars(nextPage)["p"]);
                    goToPage(nextPage.replace("&imgSizeId=0",""));
                });
                target.append(nextLink);
            }


            target.first().addClass("first");
            target.last().addClass("last");

            if(totalPages == "1") {
                $('.jsonProducts .pager').remove();
            }

        }
        function getUrlVars(url) {
            var vars = {};
            var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi,
                function(m,key,value) {
                    vars[key] = value;
                });
            return vars;
        }
        /*
         Handles loading of next page
         */


        this.SetFilters = function (key, values) {
            filters[key] = values;
            updateUrl();
            goToPage(getUrl);
        };
        this.SetSorting = function (option) {
            sortingOption = option;
            updateUrl();
            goToPage(getUrl);
        };
        var sortingOption = "";

        this.SetResultsPerPage = function (option) {
            rpOption = option;
            updateUrl();
            goToPage(getUrl);
        };

        var rpOption = "";
        this.updateUrl = function() {
            var params = getUrlParts(getUrl);

            for (var key in filters) {
                var val = "";
                if (filters[key]) {
                    val = filters[key];
                }

                var filterKey = "";
                var i = 1;
                for (i; i < 100; i++) {
                    filterKey = "fn" + i;
                    if (params[filterKey] && params[filterKey] != key) {
                        continue;
                    } else {
                        break;
                    }
                }
                params[filterKey] = key;
                params["fv" + i] = val;

            }

            params["so"] = sortingOption;
            if(rpOption){
                params["rp"] = rpOption;
            }
            getUrl = getPathFromUrl(getUrl) + "?" + $.param(params);
        }

        function getPathFromUrl(url) {
            return url.split("?")[0];
        }
    };
})({}, jQuery);
var splashurl = '';
$j(document).ready(function() {
    var productsCount = 0;
    $(document).bind(window.jsonProductList.loadCompleted, function(e, data){
        if (data.data && data.data.totalProducts > 0){
            $('.sortingContainer').attr('style', '');

			$(document).ready(function(){
			if(window.location.href.indexOf('Favoritelist') != -1){
			$('.plist tbody tr').each(function(){
			remFavHref = $(this).children('td').children('span.remfav').children('a').attr('href');
			extProductId = $(this).children('td.ExtProductID').children('a').attr('href').match(/_([0-9].*)_/)[1];

	$('#safeFavListJSON .productElement').each(function(){
		currentProductID = $(this).children('.productName').children('a').attr('href').match(/_([0-9].*)_/)[1];
		if (extProductId == currentProductID){
		removeFavA = $('<a href="'+ remFavHref +'"><i class="fa fa-times"></i> Fjern favorit</a>');
		$(this).children('.productPriceDiv').after(removeFavA);
		}

		});

		});
		}
		});

        }else{
            $('.sortingContainer').attr('style', 'display:none!important;')
            $('.listEmpty').attr('style', 'display:block!important;')
        }
    });
    if (productsCount == 0){
        $('.sortingContainer').attr('style', 'display:none!important;');
    }
    $('.sortingContainer').attr('style', '');

    $("div.pager").next("br").remove();
    $("div.plist").next("br").remove();

    $('#changeSortOrderBdy div').text($('#sortAZ').text());
});

page=1;

//Filters
var filterUrl = "";
if($("input[name$='tbxMinPrice']").length>0 && $("input[name$='tbxMaxPrice']").length>0){
    filterUrl += "&fn1=ProductPrice&fv1=" + $("input[name$='tbxMinPrice']").val() + '^' + $("input[name$='tbxMaxPrice']").val();
}

var productList = "";
var targetelement = $(".jsonProducts").attr("id");

if(location.pathname=="/"||location.pathname==""){
    splashurl = '/Services/ProductService.asmx/ProductList?v=1.5&lId=0&so=' + so + '&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&locId=' + locId + '&customerId=0&mId=&p=1&rp=1000&imgSizeId=0&fn1=CustomFields&fk1=69&fv1=TRUE';
    createFrontProducts();
}



if(location.href.indexOf("/pl/")!=-1){
    productList = '/Services/ProductService.asmx/ProductList?v=1.5&lId=0&locId=' + locId + '&so=' + so + '&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&customerId=' + customerId + '&mId=' + mId + '&p=' + page + '&rp=' + rp;
}

if(location.href.indexOf("/pi/")!=-1){
    targetelement = $(".relatedProductsBdy").attr("id");
    productList = '/Services/ProductService.asmx/RelatedProducts?v=1.5&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&customerId=' + customerId + '&imgSizeId=0&pId=' + pId;
}

if(location.href.indexOf("/basket/shoppingcart.aspx")!=-1){
    productList = '/Services/ProductService.asmx/ProductList?v=1.5&lId=0&so=' + so + '&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&locId=' + locId + '&customerId=0&mId=&p=1&rp=1000&imgSizeId=0&fn1=CustomFields&fk1=71&fv1=TRUE';
}

if(location.href.indexOf("/customers/Favoritelist.aspx")!=-1 ){

    if($('#safeFavListJSON').length > 0) {

        var getPidsFromProducts = "";

        if($( ".Tabular" ).length > 0) {
            $( ".Tabular tr td.ProductName a" ).each(function( index ) {
                getPidsFromProducts += $(this).attr('href').match(/_([0-9].*)_/)[1];
                getPidsFromProducts += ';';
            });
        }
        else {
            $( ".prelement a.hlink" ).each(function( index ) {
                getPidsFromProducts += $(this).attr('href').match(/_([0-9].*)_/)[1];
                getPidsFromProducts += ';';
            });
        }

        getPidsFromProducts = getPidsFromProducts.slice(0,-1)

        productList = '/Services/ProductService.asmx/Products?v=1.0&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&locId=&customerId=' + customerId + '&imgSizeId=0&pIds=' + getPidsFromProducts;



    }

}

if($('.searchResultsProductsOuterBdy').length > 0){
    productList = '/Services/ProductService.asmx/Products?v=1.0&cId=54&langId=1&so=0&countryId=11&locId=&customerId=0&imgSizeId=0&pIds=';
    productList += getAllSearchProductsIDs;
}

productList += filterUrl;
productList += '&serial=' + serial;


jsonProductList = new JsonProductList(targetelement, productList, true);



function ChangeCurrentLanguage(oSelect){
    window.location.href=window.location.pathname + '?' + pageQuery.toString();
}


function updateUrl(){
    targetelement = $('.jsonProducts').attr('id');
    $('.sortingContainer .sortOptions').on('change', function (e) {
        newSortOption = "so=";
        newSortOption += $("option:selected", this).attr('value');
        JsonProductList(targetelement, productList.replace(/so=([0-9]*)/,newSortOption), true);
    });
}

/*function findManufactureProducts(name) {
    $('.brandListItem.activeBrand').css('margin-bottom', '495px');
    $('.jsonProducts .products').empty();

    loaderImg = $('<img></img>');
    loaderImg.addClass('loaderImg');
    loaderImg.attr('src', '/media/337/img/loader.gif');
    loaderImg.attr('alt', '');

    loaderLineBreak = $('<br />');

    loaderDiv = $('<div></div>');
    loaderDiv.append(loaderImg);
    loaderDiv.append(loaderLineBreak);
    loaderDiv.addClass('loaderDiv');
    loaderDiv.append('Henter produkter...');

    $('#ShopContent #brandsList .jsonProducts .products').append(loaderDiv);

    productList = '/Services/ProductService.asmx/ProductList?v=1.5&lId=0&so=' + so + '&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&locId=' + locId + '&customerId=0&mId=&p=1&rp=1000&imgSizeId=0&fn1=ProductManufacturer&fv1=' + name;
    productList += filterUrl;
    productList += '&serial=' + serial;
    jsonProductList = new JsonProductList(targetelement, productList, true);
}*/

if(location.href.indexOf("/pi/")!=-1){
	if($('.ProductManufacturerSkuDiv').length > 0) {
		var getManufactureName = $('#ManufacturerSearchBoxbdy option:contains("' + $('.ProductManufacturerSkuDiv').text() + '")').attr('value');

		targetelement = $(".brandProductsBdy").attr("id");
		productList = '/Services/ProductService.asmx/ProductList?v=1.5&lId=0&so=' + so + '&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&locId=' + locId + '&customerId=0&mId=&p=1&rp=50&imgSizeId=0&fn1=ProductManufacturer&fv1=' + getManufactureName;
		productList += filterUrl;
		productList += '&serial=' + serial;
		createBrandProducts();
	}
}

function createBrandProducts() {

    $.getJSON(productList, function(jsondata) {

        divList = $("<div class='products'></div>");
        $("#brandProducts").empty();
        $("#brandProducts").append(divList);

        $.each(jsondata.data.items, function(key, val) {
            //Make sure to get the correct stock message
            var deliveryData = "nothing";
            var hasExpectedDelivery = 'false';

            if(val.inventoryCountFormatted >= 1) {
                deliveryData = val.inStockMessage;
                hasExpectedDelivery = 'false';

            }
            if(val.inventoryCountFormatted <= 0) {
                if(val.hasExpectedDeliveryDate == true) {
                    deliveryData = val.expectedDeliveryDateFormatted;
                    hasExpectedDelivery = 'true';
                }
                else {
                    deliveryData = val.notInStockMessage ;
                    hasExpectedDelivery = 'false';
                }
            }

            //Get the main image url from the product, and if no image is found load the no image replacement
            var imgsrc = "";
            if(val.images[0]){
                imgsrc = val.images[0].url.replace(/sizeId=([0-9]+)/,"sizeId=4620");
            }
            else
            {
                imgsrc = "/SL/SI/695/7e8d0f1e-58b2-4bcb-a41d-d124a29c18fc.jpg";
            }

            //Create the add to basket button
            var addToBasketData = "";
            var addToBasketTxt = "Læg i kurv";
            if(val.showAddToBasket = "true") {
                if(val.isBuyable = "true") {


                    basketDiv = $("<div></div>");

                    basketDiv.click(function(){

                        if(val.grossWeightFormatted >= weightBeforeZipCode) {
                            ActivateBasketButtonPrompt(val.eSellerId,0,'',1,'GET',encodeURIComponent(window.location.pathname + window.location.search),false,true,val.expectedDeliveryDateFormatted);
                        }
                        else {
                            atbNoQty(val.eSellerId, 0, 1, '', '', '', '', encodeURIComponent(window.location.pathname + window.location.search));
                        }
                    });
                    basketDiv.addClass("addToBasketLnk");
                    basketDiv.text(addToBasketTxt);


                }

            }

            productDiv = $("<div></div>");
            productDiv.addClass("productElement item");
            productImageDiv = $("<div></div>");
            productImageDiv.addClass("productImage");
            productLink = $("<a></a>");
            productLink.attr("href",val.URLPathAndQuery);
            productImg = $("<img></img>");
            productImg.attr("src", imgsrc);
            productImg.attr("alt", val.name);
            productLink.append(productImg);
            productImageDiv.append(productLink);

            productDiv.append(productImageDiv);
            productnameDiv = $("<div></div>");
            productnameDiv.addClass("productName");
            productNameLnk = $("<a></a>");
            productNameLnk.attr("href",val.URLPathAndQuery);
            productNameLnk.text(val.name);
            productnameDiv.append(productNameLnk);
            productDiv.append(productnameDiv);

            productDescriptionDiv = $('<div></div>');
            productDescriptionDiv.addClass('productDescriptionDiv');
            productDescriptionLnk = $('<a></a>');
            productDescriptionLnk.attr('href', val.URLPathAndQuery);
            if(val.customFields === undefined || val.customFields === null || val.customFields.length === 0) {}
            else {

                if(val.customFields["Kort Beskrivelse"] === undefined || val.customFields["Kort Beskrivelse"] === null || val.customFields["Kort Beskrivelse"] === 0) {}
                else {
                    productDescriptionLnk = val.customFields["Kort Beskrivelse"];
                    productDescriptionLnk = replaceNbsps(productDescriptionLnk);

                    productDescriptionLnk = productDescriptionLnk.substring(0,100);
                }

            }
            productDescriptionDiv.append(productDescriptionLnk);

            productDiv.append(productDescriptionDiv);

            productPriceDiv = $('<a></a>');
            productPriceDiv.attr('href', val.URLPathAndQuery);
            productPriceDiv.addClass('productPriceDiv');
            if(!val.hasSalesPrice == false) {

              if(typeof val.customFields["Vareprøve"] === "undefined" || val.customFields["Vareprøve"] === "FALSE"){
                productPriceDiv.append(val.salesPrices[0].tagPriceFormatted);
              }

            }
            productDiv.append(productPriceDiv);
            productDiscountPriceDiv = $('<a></a>');
            productDiscountPriceDiv.attr('href', val.URLPathAndQuery);
            productDiscountPriceDiv.addClass('productDiscount');
            if(val.hasSalesPrice == false) {
                //console.log('no salesprice(s)');
            }
            else {
                if(!val.salesPrices[0].tagPriceLineDiscountAmount == 0) {
                    productDiscountPriceDiv.append($('#itemDiscount').text());
                    productDiscountPriceDiv.append(val.salesPrices[0].tagPriceLineDiscountAmountFormatted);
                }
            }
            productDiv.append(productDiscountPriceDiv);

            basketDivInfoIcon = $('<a></a>');
            basketDivInfoIcon.addClass('pListInfoIcon');
            basketDivInfoIcon.attr('href', val.URLPathAndQuery);
            basketDivInfoIcon.append('<img src="/media/337/img/InfoBtn.png" />');
            if(val.customFields === undefined || val.customFields === null || val.customFields.length === 0) {}
            else {
                if(val.customFields['Opskrifter'] == "Ja" || val.customFields['Videoer'] == "Ja" || val.customFields['Artikler'] == "Ja") {}
                else {
                    productDiv.append(basketDivInfoIcon);
                    productDiv.append(basketDiv);
                }
            }

            if(val.hasSalesPrice == false) {

            }
            else {
                if(val.salesPrices[0].lineDiscountPercentageFormatted != "0.00") {
                    productTilbudIconLnk = $('<a></a>');
                    productTilbudIconLnk.attr('href', val.URLPathAndQuery);
                    productTilbudIconLnk.addClass('iconTilbud');
                    productTilbudIcon = $('<img />');
                    productTilbudIcon.attr('src', '/media/337/img/Tilbud.png');
                    productTilbudIcon.attr('alt', '');
                    productTilbudIconLnk.append(productTilbudIcon);
                    productDiv.append(productTilbudIconLnk);
                }
            }

            $("#brandProducts > div.products").append(productDiv);


        });

    });

}

function createFrontProducts() {
    splashurl += '&serial=' + serial;

    $.getJSON(splashurl, function(jsondata) {

        $.each(jsondata.data.items, function(key, val) {
            //Get the main image url from the product, and if no image is found load the no image replacement
            var imgsrc = "";
            if(val.images[0]){
                imgsrc = val.images[0].url.replace(/sizeId=([0-9]+)/,"sizeId=4532");
            }
            else
            {
                imgsrc = "/SL/SI/695/7e8d0f1e-58b2-4bcb-a41d-d124a29c18fc.jpg";
            }

            //Product Div
            productDiv = $("<div></div>");
            productDiv.addClass("productElement");
            //Product Image
            productImageDiv = $('<div></div>');
            productImageDiv.addClass('productImage');
            productImageLnk = $('<a></a>');
            productImageLnk.attr('href', val.URLPathAndQuery);
            productImage = $('<img />');
            productImage.attr('src', imgsrc);
            productImage.attr('alt', 'product image');
            productImageLnk.append(productImage);
            productImageDiv.append(productImageLnk);
            productDiv.append(productImageDiv);
            //Product info
            productInfoOuterDiv = $('<div></div>');
            productInfoOuterDiv.addClass('productInfoOuterBdy');
            productNameH3 = $('<h3></h3>');
            productNameH3.append(val.name);
            productInfoOuterDiv.append(productNameH3);
            productInfoDiv = $('<div></div>');
            productInfoDiv.addClass('productInfo');

            productDescriptionLnk = val.customFields["Kort Beskrivelse"];
            productDescriptionLnk = replaceNbsps(productDescriptionLnk);
            productDescriptionLnk = productDescriptionLnk.substring(0,100);
            productDescriptionLnk += "...";
            productInfoDiv.append(productDescriptionLnk);


            productGoToItem = $('<a></a>');
            productGoToItem.addClass('goToProduct');
            productGoToItem.attr('href', val.URLPathAndQuery);
            productGoToItem.append('info');
            productInfoDiv.append(productGoToItem);
            productInfoOuterDiv.append(productInfoDiv);
            productDiv.append(productInfoOuterDiv);

            $("#frontpageContentOuterDiv .frontPageProductsBdy").append(productDiv);

            //Change sort order on the frontpage items
            (function($) {

                $.fn.randomize = function(childElem) {
                    return this.each(function() {
                        var $this = $(this);
                        var elems = $this.children(childElem);

                        elems.sort(function() { return (Math.round(Math.random())-0.5); });

                        $this.remove(childElem);

                        for(var i=0; i < elems.length; i++)
                            $this.append(elems[i]);

                    });
                }
            })(jQuery);
            $('#frontpageContentOuterDiv .frontPageProductsBdy').randomize(".productElement");

            $(".productInfoOuterBdy h3").text(function(index, currentText) {
                return currentText.substr(0, 37);
            });


        });
        $(".productInfoOuterBdy h3").append('...');
        //Hide product on the frontpage when more than four are visible
        $('#frontpageContentOuterDiv .frontPageProductsBdy .productElement:gt(2)').hide();

    });

}


/**
 * TinySort is a small script that sorts HTML elements. It sorts by text- or attribute value, or by that of one of it's children.
 * @summary A nodeElement sorting script.
 * @version 2.2.2
 * @license MIT/GPL
 * @author Ron Valstar <ron@ronvalstar.nl>
 * @copyright Ron Valstar <ron@ronvalstar.nl>
 * @namespace tinysort
 */
!function(a,b){"use strict";function c(){return b}"function"==typeof define&&define.amd?define("tinysort",c):a.tinysort=b}(this,function(){"use strict";function a(a,d){function h(){0===arguments.length?q({}):b(arguments,function(a){q(z(a)?{selector:a}:a)}),n=G.length}function q(a){var b=!!a.selector,d=b&&":"===a.selector[0],e=c(a||{},p);G.push(c({hasSelector:b,hasAttr:!(e.attr===g||""===e.attr),hasData:e.data!==g,hasFilter:d,sortReturnNumber:"asc"===e.order?1:-1},e))}function r(){b(a,function(a,b){B?B!==a.parentNode&&(H=!1):B=a.parentNode;var c=G[0],d=c.hasFilter,e=c.selector,f=!e||d&&a.matchesSelector(e)||e&&a.querySelector(e),g=f?E:F,h={elm:a,pos:b,posn:g.length};D.push(h),g.push(h)}),A=E.slice(0)}function s(){E.sort(t)}function t(a,c){var d=0;for(0!==o&&(o=0);0===d&&n>o;){var g=G[o],h=g.ignoreDashes?l:k;if(b(m,function(a){var b=a.prepare;b&&b(g)}),g.sortFunction)d=g.sortFunction(a,c);else if("rand"==g.order)d=Math.random()<.5?1:-1;else{var i=f,p=y(a,g),q=y(c,g),r=""===p||p===e,s=""===q||q===e;if(p===q)d=0;else if(g.emptyEnd&&(r||s))d=r&&s?0:r?1:-1;else{if(!g.forceStrings){var t=z(p)?p&&p.match(h):f,u=z(q)?q&&q.match(h):f;if(t&&u){var v=p.substr(0,p.length-t[0].length),w=q.substr(0,q.length-u[0].length);v==w&&(i=!f,p=j(t[0]),q=j(u[0]))}}d=p===e||q===e?0:q>p?-1:p>q?1:0}}b(m,function(a){var b=a.sort;b&&(d=b(g,i,p,q,d))}),d*=g.sortReturnNumber,0===d&&o++}return 0===d&&(d=a.pos>c.pos?1:-1),d}function u(){var a=E.length===D.length;if(H&&a)I?E.forEach(function(a,b){a.elm.style.order=b}):B.appendChild(v());else{var b=G[0],c=b.place,d="org"===c,e="start"===c,f="end"===c,g="first"===c,h="last"===c;if(d)E.forEach(w),E.forEach(function(a,b){x(A[b],a.elm)});else if(e||f){var i=A[e?0:A.length-1],j=i.elm.parentNode,k=e?j.firstChild:j.lastChild;k!==i.elm&&(i={elm:k}),w(i),f&&j.appendChild(i.ghost),x(i,v())}else if(g||h){var l=A[g?0:A.length-1];x(w(l),v())}}}function v(){return E.forEach(function(a){C.appendChild(a.elm)}),C}function w(a){var b=a.elm,c=i.createElement("div");return a.ghost=c,b.parentNode.insertBefore(c,b),a}function x(a,b){var c=a.ghost,d=c.parentNode;d.insertBefore(b,c),d.removeChild(c),delete a.ghost}function y(a,b){var c,d=a.elm;return b.selector&&(b.hasFilter?d.matchesSelector(b.selector)||(d=g):d=d.querySelector(b.selector)),b.hasAttr?c=d.getAttribute(b.attr):b.useVal?c=d.value||d.getAttribute("value"):b.hasData?c=d.getAttribute("data-"+b.data):d&&(c=d.textContent),z(c)&&(b.cases||(c=c.toLowerCase()),c=c.replace(/\s+/g," ")),c}function z(a){return"string"==typeof a}z(a)&&(a=i.querySelectorAll(a)),0===a.length&&console.warn("No elements to sort");var A,B,C=i.createDocumentFragment(),D=[],E=[],F=[],G=[],H=!0,I=a.length&&(d===e||d.useFlex!==!1)&&-1!==getComputedStyle(a[0].parentNode,null).display.indexOf("flex");return h.apply(g,Array.prototype.slice.call(arguments,1)),r(),s(),u(),E.map(function(a){return a.elm})}function b(a,b){for(var c,d=a.length,e=d;e--;)c=d-e-1,b(a[c],c)}function c(a,b,c){for(var d in b)(c||a[d]===e)&&(a[d]=b[d]);return a}function d(a,b,c){m.push({prepare:a,sort:b,sortBy:c})}var e,f=!1,g=null,h=window,i=h.document,j=parseFloat,k=/(-?\d+\.?\d*)\s*$/g,l=/(\d+\.?\d*)\s*$/g,m=[],n=0,o=0,p={selector:g,order:"asc",attr:g,data:g,useVal:f,place:"org",returns:f,cases:f,forceStrings:f,ignoreDashes:f,sortFunction:g,useFlex:f,emptyEnd:f};return h.Element&&function(a){a.matchesSelector=a.matchesSelector||a.mozMatchesSelector||a.msMatchesSelector||a.oMatchesSelector||a.webkitMatchesSelector||function(a){for(var b=this,c=(b.parentNode||b.document).querySelectorAll(a),d=-1;c[++d]&&c[d]!=b;);return!!c[d]}}(Element.prototype),c(d,{loop:b}),c(a,{plugin:d,defaults:p})}());

$( document ).ready(function() {
    if($('#recommendSlider').length == 1){
        splashurl = '/Services/ProductService.asmx/ProductList?v=1.5&lId=0&so=' + so + '&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&locId=' + locId + '&customerId=0&mId=&p=1&rp=1000&imgSizeId=0&fn1=CustomFields&fk1=74&fv1=TRUE&serial=' + serial;


        function customDataSuccess(data){
            var content = "";
            for(var i in data.data.items){

                var img = "";
                // data.data.items[i].images[0].url;
                if(data.data.items[i].images[0]){
                    img = data.data.items[i].images[0].url.replace(/sizeId=([0-9]+)/,"sizeId=5187");
                }
                else
                {
                    img = "/media/337/img/Noimagesmall.jpg";
                }
                var name = data.data.items[i].name;
                var hrefLink = data.data.items[i].linkURL;
                var shortDescription = data.data.items[i].customFields["Kort Beskrivelse"];
                shortDescription = replaceNbsps(shortDescription);
                shortDescription = shortDescription.substring(0,100);
                shortDescription += "...";
                content += "<div class='weRecommendItem'><a href='"+ hrefLink +"'><img src=\"" +img+ "\" alt=\"" +name+ "\"><div class='weRecommendDdesc'><h3>"+ name +"</h3>"+ shortDescription +"</div></a></div>"
            }
            $("#recommendSlider").html(content);
        }

        $("#recommendSlider").owlCarousel({
            jsonPath : splashurl,
            jsonSuccess : customDataSuccess,
            items: 4,
            navigation: true,
            navigationText : false
        });

    }
});
