# COVID-19 by US State

This chart tracks cases of COVID-19 across the USA from the date when each state first had at least 100 reported cases. The data comes from the New York Times (see [here for more information](https://www.nytimes.com/article/coronavirus-county-data-us.html?action=click&module=Spotlight&pgtype=Homepage) and [here for the GitHub data](https://github.com/nytimes/covid-19-data)). The idea for the chart comes from [this similar one from Our World in Data](https://ourworldindata.org/grapher/covid-confirmed-cases-since-100th-case).

I wouldn't depend on this for much, it's mostly a chance for me (Christopher Witulski) to see a graph that I wish were easier to find while checking to see if I remember how to use D3.js.

## Next

In index.html

* Split highlight and removeHighlight logic into different functions
* Incorporate button logic into highlight and removeHighlight (be sure to account for opacity differences)
* Use highlight on mouseover, but disable removeHighlight if the button is active
* Click should be able to just change the active status, but needs to allow for turning off active even when hovering (to see action) Maybe don't active the legend text?
