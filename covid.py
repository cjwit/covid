import csv
import json
import re
from datetime import date

covid_cases = {}
covid_deaths = {}
covid_averages = {}
covid_scaled_averages = {}
all_cases = {}
populations = {}

def checkState(state):
    if state not in covid_cases:
        covid_cases[state] = []
        covid_deaths[state] = []
        covid_averages[state] = []
        covid_scaled_averages[state] = []
        all_cases[state] = []         # for averages

def addCases(row):
    state = row[1]
    cases = int(row[3])
    if cases > 99:
        covid_cases[state].append(cases)

def addDeaths(row):
    state = row[1]
    deaths = int(row[4])
    if deaths > 9:
        covid_deaths[state].append(deaths)

# does not add zeros if there are no cases, dates will not align
def addAverages(row):
    state = row[1]
    total_cases = int(row[3])
    all_cases[state].append(total_cases)
    average_new = 0
    number_of_days = len(all_cases[state])
    #print()
    #print (state, "days:", number_of_days)
    if number_of_days == 0:
        covid_averages[state].append(total_cases)
        covid_scaled_averages[state].append(total_cases * 1.0 * 100000 / populations[state])
        #print ("in 0 days, appended", total_cases, "to", state, covid_averages[state])
        return
    elif number_of_days < 7:
        #print ("in under 7 for", state, "day:", day, "cases:", total_cases)
        average_new = (total_cases - all_cases[state][0]) * 1.0 / (number_of_days + 1)
    else:
        average_new = (total_cases - all_cases[state][number_of_days - 7]) / 7.0
        #print ("in over 7 for", state, "day:", day, " cases:", total_cases)
    covid_averages[state].append(average_new)
    covid_scaled_averages[state].append(average_new * 1.0 * 100000 / populations[state])

    #print (state, covid_averages[state], len(covid_averages[state]))

def createTitleRow(data):
    long = 0
    for state in sortData(data):
        if len(data[state]) > long:
            long = len(data[state])
    return(["state"] + range(0,long))

def sortData(data):
    return sorted(data)

with open('population.json') as populationFile:
    data = json.load(populationFile)
    for entry in data:
        if entry['region'] not in populations:
            populations[entry['region']] = 0
        populations[entry['region']] += int(entry['population'])

with open('covid.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    next(readCSV)
    for row in readCSV:
        checkState(row[1])
        addCases(row)
        addDeaths(row)
        addAverages(row)

with open('formattedCovidCases.csv', 'w') as newfile:
    writer = csv.writer(newfile)
    writer.writerow(createTitleRow(covid_cases))
    for state in sortData(covid_cases):
        if len(covid_cases[state]) > 0:
            newrow = [state] + covid_cases[state]
            writer.writerow(newrow)

with open('formattedCovidDeaths.csv', 'w') as newfile:
    writer = csv.writer(newfile)
    writer.writerow(createTitleRow(covid_deaths))
    for state in sortData(covid_deaths):
        if len(covid_deaths[state]) > 0:
            newrow = [state] + covid_deaths[state]
            writer.writerow(newrow)

with open('formattedCovidAverages.csv', 'w') as newfile:
    writer = csv.writer(newfile)
    writer.writerow(createTitleRow(covid_averages))
    for state in sortData(covid_averages):
        gap = len(all_cases["Washington"]) - len(covid_averages[state])
        #print (state, len(covid_averages[state]), len(all_cases["Washington"]), gap)
        if gap > 0:
            zeros = [0] * gap
            covid_averages[state] = zeros + covid_averages[state]
        #print (state, len(covid_averages[state]), covid_averages[state])
        newrow = [state] + covid_averages[state]
        writer.writerow(newrow)

with open('formattedCovidScaledAverages.csv', 'w') as newfile:
    writer = csv.writer(newfile)
    writer.writerow(createTitleRow(covid_scaled_averages))
    for state in sortData(covid_scaled_averages):
        gap = len(all_cases["Washington"]) - len(covid_scaled_averages[state])
        #print (state, len(covid_averages[state]), len(all_cases["Washington"]), gap)
        if gap > 0:
            zeros = [0] * gap
            covid_scaled_averages[state] = zeros + covid_scaled_averages[state]
        #print (state, len(covid_averages[state]), covid_averages[state])
        newrow = [state] + covid_scaled_averages[state]
        writer.writerow(newrow)

# set date in both files
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

deathsFile = open("deaths.html", "rt")
deathsFileContents = deathsFile.read()
deathsFileContents = re.sub(searchTerm, newDateString, deathsFileContents)
deathsFile.close()

deathsFile = open("deaths.html", "wt")
deathsFile.write(deathsFileContents)
deathsFile.close()
