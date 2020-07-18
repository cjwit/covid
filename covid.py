import csv
import json
import re
from datetime import date

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

def getMaxOverall(statistic):
    max = 0
    for state in data['states']:
        if data['states'][state][statistic] > max:
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
    for row in readCSV:
        state = row[1]
        addCases(row, state)
        addDeaths(row, state)

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

getMaxOverall('maxCases')
getMaxOverall('maxDeaths')
getMaxOverall('maxAverages')
getMaxOverall('maxScaledCases')
getMaxOverall('maxScaledAverages')

# write object to file as JSON
with open('data.json', 'w') as output:
    json.dump(data, output)

#
# set dates in html files
#

today = date.today()
todayString = today.strftime("%B %d, %Y")
searchTerm = "<span id=\"date\">.*<\/span>"
newDateString = "<span id=\"date\">" + todayString + "</span>"

averagesFile = open("averages.html", "rt")
averagesFileContents = averagesFile.read()
averagesFileContents = re.sub(searchTerm, newDateString, averagesFileContents)
averagesFile.close()

averagesFile = open("averages.html", "wt")
averagesFile.write(averagesFileContents)
averagesFile.close()

scaledAveragesFile = open("scaled_averages.html", "rt")
scaledAveragesFileContents = scaledAveragesFile.read()
scaledAveragesFileContents = re.sub(searchTerm, newDateString, scaledAveragesFileContents)
scaledAveragesFile.close()

scaledAveragesFile = open("scaled_averages.html", "wt")
scaledAveragesFile.write(scaledAveragesFileContents)
scaledAveragesFile.close()

casesFile = open("index.html", "rt")
casesFileContents = casesFile.read()
casesFileContents = re.sub(searchTerm, newDateString, casesFileContents)
casesFile.close()

casesFile = open("index.html", "wt")
casesFile.write(casesFileContents)
casesFile.close()

scaledCasesFile = open("scaled_cases.html", "rt")
scaledCasesFileContents = scaledCasesFile.read()
scaledCasesFileContents = re.sub(searchTerm, newDateString, scaledCasesFileContents)
scaledCasesFile.close()

scaledCasesFile = open("scaled_cases.html", "wt")
scaledCasesFile.write(scaledCasesFileContents)
scaledCasesFile.close()

deathsFile = open("deaths.html", "rt")
deathsFileContents = deathsFile.read()
deathsFileContents = re.sub(searchTerm, newDateString, deathsFileContents)
deathsFile.close()

deathsFile = open("deaths.html", "wt")
deathsFile.write(deathsFileContents)
deathsFile.close()
