const cheerio = require("cheerio");
const axios = require("axios");
require("dotenv").config();

const { COMPANY : companyId } = process.env
const Game = require("./game")

//const { BitlyClient } = require('bitly');
//const bitly = new BitlyClient('199270c463cf0b54fe4fb91fb8c6b71e21c8a2da')

async function fetchHtml(url) {
    try {
        const { data } = await axios.get(url);
        return data
    } catch(e) {
        console.log("Error", e)
    }
}

async function scrapeSony() {
    let element
    //== Get all links for games from home page -Start ==
    let gamesLinks = []
    const html =  await fetchHtml(`https://www.playstation.com/en-us/ps4/ps4-games/`);
    const $ = cheerio.load(html)

    element = ".button .cta__primary"
    $('body').find(element).each((i, el) => {
        let url = $(el).attr('href')
        if(url.slice(0, 6) == "/en-us"){
            gamesLinks.push("https://www.playstation.com" + url)
        }
    })
    //== Get all links for games from home page -End ==

    //== Get prices and update links -Start ==
    let curLinks = []
    let spaceBuck = []

    for (let i = 0; i < gamesLinks.length; i++) {
        const html =  await fetchHtml(gamesLinks[i]);
        const $ = cheerio.load(html)

        element = ".psw-h3"
        let price = $('body').find(element).text().slice(1, 6)
        if(price != "") {
            let floorprice = price.replace("E", "")
            floorprice = Math.round(parseInt(floorprice)) + 1

            if (floorprice > 1) {
                spaceBuck.push(floorprice)
                curLinks.push(gamesLinks[i])
            }
        }
    }
    gamesLinks = curLinks
    //== Get prices and update links -End ==

    //== Get game names -Start ==
    let dataNames = []
    let gameImg = []
    let description = []
    let genre = []
    for (let i = 0; i < gamesLinks.length; i++) {
        const html =  await fetchHtml(gamesLinks[i]);
        const $ = cheerio.load(html)

        //get names
        let element = "h1"
        dataNames.push($('body').find(element).text())

        //get imgs
        let img = []
        element = ".bg-block__img source"
        $('body').find(element).each(async (i, el) => {
            imgUrl = $(el).attr('srcset')
            img.push(imgUrl)
        })
        //const bitLink = await bitly.shorten(img[0])
        gameImg.push(img[0])

        //get description
        element = ".box .textblock .text-block p"
        let txt = ""
        let desc = []
        $('body').find(element).each((i, el) => {
            txt = $(el).text()
            desc.push(txt)
        })
        let text = desc[0]
        let arrtxt = text.split(".")
        text = arrtxt[0] + "."
        description.push(text)

        //get genre
        element = "dl .psw-cell span"
        let genreTxt = $('body').find(element).text()
        let genreArr = genreTxt.split(", ")
        genre.push(genreArr)
    }
    //== Get game names -End ==

    //== Make Array of Products
    let productArr = []
    for (let i = 0; i < gamesLinks.length; i++) {
        let product = {}
        product.name = dataNames[i]
        product.genre = genre[i]
        product.consoleType = ["PlayStation 4"]
        product.image = gameImg[i]
        product.quantity = 10
        product.description = description[i]
        product.spaceBuck = spaceBuck[i]
        product.rating = Math.floor(Math.random() * 3) + 7
        product.creator = "PlayStation"
        product.user = companyId

        productArr.push(product)
    }
    return productArr;
}

async function findGames() {
    let find = await Game.findAllByUserId(companyId)
    return find
}

async function company() {
    let gameProduct = await scrapeSony()
    let companysGames = await findGames()

    if (companysGames.length == 0) {
        for (let i = 0; i < gameProduct.length; i++) {
            await Game.create(gameProduct[i])
        }
    }
    else {
        for (let i = 0; i < gameProduct.length; i++) {
            for (let j = 0; j < companysGames.length; j++) {
                if (gameProduct[i].name == companysGames[j].name){
                    break;
                }
                else if(j == companysGames.length - 1){
                    await Game.create(gameProduct[i])
                }
            }
        }
    }
}

module.exports = {
    company,
}