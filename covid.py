import csv
import json
import re
from datetime import date

# incorporate
covid_cases = {}
covid_deaths = {}
covid_averages = {}
covid_scaled_averages = {}
all_cases = {}

# master data list
data = {
    'states': {}
    # max for each stat
}


def checkState(object, state):
    if state not in data['states']:
        stateObject = {
            'cases': [],
            'deaths': [],
            'averages': [],
            'scaledAverages': [],
            'population': 0,
            'name': state
        }
        data['states'][state] = stateObject

def addCases(row, state):
    cases = int(row[3])
    data['states'][state]['cases'].append(cases)

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
    name = 'max' + statistic.capitalize()
    print (state, name, max)
    data['states'][state][name] = max


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
    prependZeros(state, 'deaths')
    addAverages(state)
    getMax(state, 'cases')
    getMax(state, 'deaths')
    getMax(state, 'averages')
    getMax(state, 'scaledAverages')



# write object to file as JSON
with open('data.json', 'w') as output:
    json.dump(data, output)


# # does not add zeros if there are no cases, dates will not align

# def createTitleRow(data):
#     long = 0
#     for state in sortData(data):
#         if len(data[state]) > long:
#             long = len(data[state])
#     return(["state"] + range(0,long))

# def sortData(data):
#     return sorted(data)



# with open('formattedCovidCases.csv', 'w') as newfile:
#     writer = csv.writer(newfile)
#     writer.writerow(createTitleRow(covid_cases))
#     for state in sortData(covid_cases):
#         if len(covid_cases[state]) > 0:
#             newrow = [state] + covid_cases[state]
#             writer.writerow(newrow)

# with open('formattedCovidDeaths.csv', 'w') as newfile:
#     writer = csv.writer(newfile)
#     writer.writerow(createTitleRow(covid_deaths))
#     for state in sortData(covid_deaths):
#         if len(covid_deaths[state]) > 0:
#             newrow = [state] + covid_deaths[state]
#             writer.writerow(newrow)

# with open('formattedCovidAverages.csv', 'w') as newfile:
#     writer = csv.writer(newfile)
#     writer.writerow(createTitleRow(covid_averages))
#     for state in sortData(covid_averages):
#         gap = len(all_cases["Washington"]) - len(covid_averages[state])
#         #print (state, len(covid_averages[state]), len(all_cases["Washington"]), gap)
#         if gap > 0:
#             zeros = [0] * gap
#             covid_averages[state] = zeros + covid_averages[state]
#         #print (state, len(covid_averages[state]), covid_averages[state])
#         newrow = [state] + covid_averages[state]
#         writer.writerow(newrow)

# with open('formattedCovidScaledAverages.csv', 'w') as newfile:
#     writer = csv.writer(newfile)
#     writer.writerow(createTitleRow(covid_scaled_averages))
#     for state in sortData(covid_scaled_averages):
#         gap = len(all_cases["Washington"]) - len(covid_scaled_averages[state])
#         #print (state, len(covid_averages[state]), len(all_cases["Washington"]), gap)
#         if gap > 0:
#             zeros = [0] * gap
#             covid_scaled_averages[state] = zeros + covid_scaled_averages[state]
#         #print (state, len(covid_averages[state]), covid_averages[state])
#         newrow = [state] + covid_scaled_averages[state]
#         writer.writerow(newrow)

# # set date in both files
# today = date.today()
# todayString = today.strftime("%B %d, %Y")
# searchTerm = "<span id=\"date\">.*<\/span>"
# newDateString = "<span id=\"date\">" + todayString + "</span>"

# averagesFile = open("averages.html", "rt")
# averagesFileContents = averagesFile.read()
# averagesFileContents = re.sub(searchTerm, newDateString, averagesFileContents)
# averagesFile.close()

# averagesFile = open("averages.html", "wt")
# averagesFile.write(averagesFileContents)
# averagesFile.close()

# scaledAveragesFile = open("scaled_averages.html", "rt")
# scaledAveragesFileContents = scaledAveragesFile.read()
# scaledAveragesFileContents = re.sub(searchTerm, newDateString, scaledAveragesFileContents)
# scaledAveragesFile.close()

# scaledAveragesFile = open("scaled_averages.html", "wt")
# scaledAveragesFile.write(scaledAveragesFileContents)
# scaledAveragesFile.close()

# casesFile = open("index.html", "rt")
# casesFileContents = casesFile.read()
# casesFileContents = re.sub(searchTerm, newDateString, casesFileContents)
# casesFile.close()

# casesFile = open("index.html", "wt")
# casesFile.write(casesFileContents)
# casesFile.close()

# deathsFile = open("deaths.html", "rt")
# deathsFileContents = deathsFile.read()
# deathsFileContents = re.sub(searchTerm, newDateString, deathsFileContents)
# deathsFile.close()

# deathsFile = open("deaths.html", "wt")
# deathsFile.write(deathsFileContents)
# deathsFile.close()
