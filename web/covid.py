import csv
from datetime import datetime

covid_cases = {}
covid_deaths = {}

def checkState(state):
    if state not in covid_cases:
        covid_cases[state] = []
        covid_deaths[state] = []

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

def createTitleRow():
    long = 0
    for state in covid_cases:
        if len(state) > long:
            long = len(state)
    return(["state"] + range(0,long))

with open('covid.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    for row in readCSV:
        checkState(row[1])
        addCases(row)
        addDeaths(row)

with open('formattedCovidCases.csv', 'w') as newfile:
    writer = csv.writer(newfile)
    writer.writerow(createTitleRow())
    for state in covid_cases:
        if len(covid_cases[state]) > 0:
            newrow = [state] + covid_cases[state]
            writer.writerow(newrow)

with open('formattedCovidDeaths.csv', 'w') as newfile:
    writer = csv.writer(newfile)
    writer.writerow(createTitleRow())
    for state in covid_deaths:
        if len(covid_deaths[state]) > 0:
            newrow = [state] + covid_deaths[state]
            writer.writerow(newrow)
