# Web Scraping with Request

This project shows how you can scrape websites only using the request library.

## Getting Started

Just clone the repository and `npm install` to install request. Once it's installed, you only need to use `npm start` and you'll be in business.

```
npm install
npm start
```

Note that by default I am searching for cookies on AllRecipes.com. You can change this search to whatever you'd like or to any other website. It's in the beginning of the index.js file.

This is just an example and really focuses on just taking strings and parsing them with liberal use of split.

### Prerequisites

You will need Node and NPM. I used the following versions:

```
Node: 8.11.2
NPM: 5.6.0
```

## Notes

Allrecipes.com must autoblock ip addresses. After a little bit of work on the project they blocked me. I had to use two different IP addresses to get it all working, so be careful not to hit them too hard.

## Built With

* [Request](https://github.com/request/request) - The http library used

## Authors

* **Jordan Hansen** - [Aarmora](https://github.com/aarmora)


## License

This project is licensed under the MIT License.
