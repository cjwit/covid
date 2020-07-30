import csv
import json
import re
from datetime import date, datetime

# master data list
data = {
    'states': {}
}

def checkState(object, state):
    if state not in data['states']:
        stateObject = {
            'cases': [],
            'deaths': [],
            'averages': [],
            'scaledCases': [],
            'scaledAverages': [],
            'population': 0,
            'name': state
        }
        data['states'][state] = stateObject

def addCases(row, state):
    cases = int(row[3])
    data['states'][state]['cases'].append(cases)
    data['states'][state]['scaledCases'].append(cases * 1.0 * 100 / data['states'][state]['population'])

def addDeaths(row, state):
    deaths = int(row[4])
    data['states'][state]['deaths'].append(deaths)

def setTotalDays():
    totalDays = 0
    for state in data['states']:
        if len(data['states'][state]['cases']) > totalDays:
            totalDays = len(data['states'][state]['cases'])
    data['totalDays'] = totalDays

def prependZeros(state, statistic):
    gap = data['totalDays'] - len(data['states'][state][statistic])
    if gap > 0:
        zeros = [0] * gap
        data['states'][state][statistic] = zeros + data['states'][state][statistic]

def addAverages(state):
    days = len(data['states'][state]['cases'])
    for i in range(len(data['states'][state]['cases'])):
        lastDayCases = data['states'][state]['cases'][i]
        if i < 7:
            firstDayCases = data['states'][state]['cases'][0]
            averageNew = (lastDayCases - firstDayCases) * 1.0 / (i + 1)
        else:
            firstDayCases = data['states'][state]['cases'][i - 7]
            averageNew = (lastDayCases - firstDayCases) * 1.0 / 7.0
        data['states'][state]['averages'].append(averageNew)
        data['states'][state]['scaledAverages'].append(averageNew * 1.0 * 100000 / data['states'][state]['population'])

def getMax(state, statistic):
    max = 0
    for entry in data['states'][state][statistic]:
        if entry > max:
            max = entry
    name = 'max' + statistic[0].upper() + statistic[1:]
    data['states'][state][name] = max

# run after prepending zeros so that arrays are normalized
def getUsAverages():
    usAverage = [0] * data['totalDays']
    usAverageNew = [0] * data['totalDays']
    usPopulation = 0

    # get totals
    for state in data['states']:
        usPopulation += data['states'][state]['population']
        for i in range(0, data['totalDays']):
            usAverage[i] += data['states'][state]['cases'][i]
            usAverageNew[i] += data['states'][state]['averages'][i]
    
    # scale totals
    for i in range(0, data['totalDays']):
        usAverage[i] = usAverage[i] * 100.0 / usPopulation
        usAverageNew[i] = usAverageNew[i] * 100000.0 / usPopulation

    # create data object
    data['states']['US Average'] = {
        'cases': [],
        'deaths': [],
        'averages': [],
        'scaledCases': usAverage,
        'scaledAverages': usAverageNew,
        'population': usPopulation,
        'name': 'US Average'
    }

    getMax('US Average', 'scaledCases')
    getMax('US Average', 'scaledAverages')


def getMaxOverall(statistic):
    max = 0
    for state in data['states']:
        if (statistic in data['states'][state] and data['states'][state][statistic] > max):
            max = data['states'][state][statistic]
    data[statistic] = max

# use population data to set up data object
with open('population.json') as populationFile:
    populationData = json.load(populationFile)
    for entry in populationData:
        currentState = entry['region']
        if entry['region'] not in data['states']:
            checkState(data, currentState)
            data['states'][currentState]['population'] = 0
        data['states'][currentState]['population'] += int(entry['population'])

# parsing cases and deaths into data
with open('covid.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    next(readCSV)
    lastDate = ""
    for row in readCSV:
        state = row[1]
        addCases(row, state)
        addDeaths(row, state)
        lastDate = row[0]
    data["lastDate"] = lastDate

# normalizing data and calculating averages
setTotalDays()

for state in sorted(data['states'].keys()):
    prependZeros(state, 'cases')
    prependZeros(state, 'scaledCases')
    prependZeros(state, 'deaths')
    addAverages(state)
    getMax(state, 'cases')
    getMax(state, 'deaths')
    getMax(state, 'averages')
    getMax(state, 'scaledCases')
    getMax(state, 'scaledAverages')

getUsAverages()

getMaxOverall('maxCases')
getMaxOverall('maxDeaths')
getMaxOverall('maxAverages')
getMaxOverall('maxScaledCases')
getMaxOverall('maxScaledAverages')

# write object to file as JSON
with open('data.json', 'w') as output:
    json.dump(data, output)

# set dates in html files
today = date.today()
todayString = today.strftime("%B %d, %Y")
searchTermToday = "<span id=\"date\">.*<\/span> with"
dateStringToday = "<span id=\"date\">" + todayString + "</span> with"

lastDateObject = datetime.strptime(data["lastDate"], "%Y-%m-%d")
dataString = lastDateObject.strftime("%B %d, %Y")
searchTermData = "<span id=\"lastData\">.*<\/span>"
dateStringData = "<span id=\"lastData\">" + dataString + "</span>"

def updateDate(filename):
    inFile = open(filename, "rt")
    inContents = inFile.read()
    inContents = re.sub(searchTermToday, dateStringToday, inContents)
    inContents = re.sub(searchTermData, dateStringData, inContents)
    inFile.close()

    outFile = open(filename, "wt")
    outFile.write(inContents)
    outFile.close()

updateDate("index.html")
updateDate("scaled_cases.html")
updateDate("deaths.html")
updateDate("averages.html")
updateDate("scaled_averages.html")