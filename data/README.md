# Final Project Data

This directory contains the data I scoped and plan to utilize for my CAPP 30239 Data Visualization final project. 

One of the policy areas I am interested in is social policy, in particular the design of policy tools that can promote upwards social mobility towards the middle class and reduce extreme poverty.

Coming from Ecuador 🇪🇨, I wanted to take this opportunity to employ data visualization techniques to get a snapshot of how poverty looks like in my home country: how is it distributed, where is it concentrated (geographically but also by ethnicity, age groups and types of jobs). 

## About the data
Ecuador joined the [Open Government Partnership (OGP)](https://www.opengovpartnership.org/members/ecuador/) in July 2018, and has since published an Open Data Portal where public data from 95 institutions is now available in open format.

**Data Source:** Ecuador's [Open Data Portal](https://www.datosabiertos.gob.ec)
- **Agency:** Social Registry Unit (Unidad del Registro Social - URS)
- **Link:** [Social Registry data](https://www.datosabiertos.gob.ec/dataset/conjunto-de-datos-personas-del-registro-social)
- **License:** Creative Commons Attribution, [Open Data](http://opendefinition.org/licenses/cc-by/)
- **First Uploaded:** August 16, 2021
- **Last Updated:** September 29, 2022
- **Variable Dictionary:** Translated [original](https://www.datosabiertos.gob.ec/dataset/conjunto-de-datos-personas-del-registro-social/resource/b98866d8-7023-4e76-9cca-33a9b7615762) from English to Spanish and limited scope to a smaller set of variables found in `var_dictionary`

**Type of source:** Primary

**Format:** CSV

**Description:** This is official government data from the Social Registry, an institutional registry that was created to record people and households living under poverty in order to provide them with access to public services and conditional cash transfer programs. 

The data is published at the individual level, with a total of 3'212,065 observations. I excluded observations categorized as "Not Poor", that is, belonging to income deciles 4-10, which reduces the number to 1.15 million heads of households.

To make the data more manageable for the project, I created an R script called `aggregate_data.R` to aggregate it by different variables of interest, which I then used to create the following csv files:

- `province.csv` Contains aggregated data at the province level (24 provinces in total). Includes the following variables:
    - extremely poor (decile 1)
    - moderately poor (deciles 2 and 3)
    - sex (male/female) disaggregated by moderate and extreme poverty
    - access to social security
    - disability (physical, visual, auditory, psychosocial or intellectual)
    - catastrophic illness

- `job_type.csv` Refers to the type of worker, if applicable. These categories are described in detail in `var_dictionary`

- `education.csv` Counts of moderately and extremely poor, by highest level of education attainment

- `age.csv` Counts of sex (male/female) and level of poverty (moderate/extreme) by age group 

- `ethnicity.csv` Level of poverty (moderate/extreme) by ethnic self-identication

- `deciles.csv` Distribution of registered observations by income deciles

**Potential use for this data:** This data could be used to create a visual snapshot of poverty in Ecuador. I am interesting in showing where poverty is concentrated and which population groups are most vulnerable (eg. groups with disabilities, chronic illness, male vs. female). It would also be interesting to visually compare how poverty varies by the precariousness of the type of job. Without running causal inference models, no causal relationships can be determined so the goal instead is get a descriptive overview of poverty in Ecuador and which are the most affected groups and locations.

**Potential data points:** I have already pre-processed potential data points in the csv files that I generated from the complete 3.2 million observations dataset. Other data points I will not be focusing on include: marital status, nationality, smaller geographical divisions like parish and canton).

**Possible concerns:** Overall the data is clean and consistent. Rather than concerns, there is a limitation, mainly that the dataset contains observations of people under poverty who at some point either auto-registered or were registered by a third party in the Social Registry. It is therefore not a 100% comprehensive registry of all people living under poverty in Ecuador. 

---

## Ecuador province boundaries 
In order to visualize poverty data in a map, I searched for a GeoJSON file that contains Ecuador's geographical divisions into 24 provinces.

- **Data Source:** Risk Management Secretariat [province boundaries](https://sgr-ecuador.carto.com/tables/provincias/public)
- **Format:** GeoJSON
- **File:** `map.geojson`


