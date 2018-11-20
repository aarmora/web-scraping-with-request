// https://github.com/request/request#readme
const request = require('request');

const searchForCookiesUrl = 'https://www.allrecipes.com/search/results/?wt=cookies&sort=re';
const listOfRecipes = [];
const recipeUrls = [];

request.get(searchForCookiesUrl, async (err, res, html) => {
    if (err) {
        console.log('Some error', err);
        return;
    }

    // Regular expression to find all urls (https://stackoverflow.com/a/33211436/2287595)
    const allUrls = html.match(/\bhttps?:\/\/\S+/gi);

    // Loop through the urls to find the ones we want. Ones that are recipes and that we haven't already found.
    for (let i = 0; i < allUrls.length; i++) {

        // Specific recipes contain '/recipe/' in the url.
        // Let's make sure we don't put a duplicate into our array.
        if (allUrls[i].includes('/recipe/') && !recipeUrls.includes(allUrls[i])) {
            const recipeUrl = allUrls[i].replace('"', "");
            recipeUrls.push(recipeUrl);

            try {
                listOfRecipes.push(await getRecipeDetails(recipeUrl));
            }
            catch (e) {
                console.log('error: ', e);
            }
        }
    }

    console.log('list of recipes at end', listOfRecipes);
});

function getRecipeDetails(url) {

    return new Promise((resolve, reject) => {

        request.get(url, (err, res, html) => {
            if (err) {
                reject('err in getting details');
            }

            if (html) {
                let recipeDetails = {
                    title: html.split('recipe-main-content" class="recipe-summary__h1" itemprop="name">')[1].split('</h1>')[0],
                    ingredients: [],
                    instructions: []
                };

                recipeDetails = addIngredientList(html, recipeDetails);
                recipeDetails = addInstructions(html, recipeDetails);

                resolve(recipeDetails);
            }
            else {
                resolve(null);
            }

        });
    });

}

function addIngredientList(html, recipeDetails) {
    const ingredientsSection = html.split('polaris-app">')[1].split('<label class="checkList__item" id="btn-addtolist">')[0];
    const listOfIngredients = ingredientsSection.split('itemprop="recipeIngredient">');

    for (i = 0; i < listOfIngredients.length; i++) {
        const splitIngredient = listOfIngredients[i].split('title="')[1];

        // splitIngredient sometimes returns undefined so let's check it
        if (splitIngredient) {
            recipeDetails.ingredients.push(listOfIngredients[i].split('title="')[1].split('">\r\n')[0]);
        }
    }

    return recipeDetails;
}

function addInstructions(html, recipeDetails) {
    const instructionsSection = html.split('itemprop="recipeInstructions">')[1].split("</ol>")[0];
    const listOfInstructions = instructionsSection.split('recipe-directions__list--item">');

    for (i = 0; i < listOfInstructions.length; i++) {
        const instruction = listOfInstructions[i].split('\n')[0].trim();

        // There is a white space
        if (instruction) {
            recipeDetails.instructions.push(instruction);
        }
    }

    return recipeDetails;

}