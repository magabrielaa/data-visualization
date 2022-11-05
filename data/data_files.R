## Social Registry Data Files

# Clean environment
rm(list=ls())

# Set working directory
setwd("~/Desktop/Autumn 2022/Data Visualization/CAPP30239_FA22/data")

# Load library
library(tidyverse)

# Load data
age <- read_csv("age.csv")
deciles <- read_csv("deciles.csv")
education <- read_csv("education.csv")
ethnicity <- read_csv("ethnicity.csv")
job_type <- read_csv("job_type.csv")
province_df <- read_csv("province.csv")

# PRELIMINARY ANALYSIS

## Top three provinces with extreme poverty: Esmeraldas, Manabi, Chimborazo
top_poorer <- province %>%                                      
  arrange(desc(extremely_poor)) %>%
  select(province,extremely_poor) %>%
  slice(1:3)

## Create column with rank by population size
province_df$rank_pop<-rank(province$population)

## Find population rank for top 3 extremely poor provinces: Esmeraldas(18), 
## Manabi (22), Chimborazo (16)
province_df %>% 
  select(rank_pop, province)  %>% 
  filter(province == "ESMERALDAS")

province_df %>% 
  select(rank_pop, province)  %>% 
  filter(province == "MANABI")

province_df %>% 
  select(rank_pop, province)  %>% 
  filter(province == "CHIMBORAZO")



## Create new variable to add extreme poverty and moderate poverty 
province_df$poverty_total<- province_df$extremely_poor + province_df$moderately_poor 

## Top three provinces with total poverty: Manabi, Guayas, Esmeraldas
top_poorer_total <- province_df %>%                                      
  arrange(desc(poverty_total)) %>% 
  select(province, poverty_total) %>%
  slice(1:3)

top_poorer_total

## Find population rank for top 3 total poor provinces: Manabi(22),
## Guayas(24), Esmeraldas(18)
province_df %>% 
  select(rank_pop, province)  %>% 
  filter(province == "MANABI")

province_df %>% 
  select(rank_pop, province)  %>% 
  filter(province == "GUAYAS")

province_df %>% 
  select(rank_pop, province)  %>% 
  filter(province == "ESMERALDAS")

## Percent of poverty out of population
province_df$pov_perc<- (province_df$poverty_total / province_df$population) *100

# Percent for top three total poverty: Manabi (10.8%), Guayas (3.81%), 
# Esmeraldas(18.9%)
province_df %>% 
  select(pov_perc, province)  %>% 
  filter(province == "MANABI")

province_df %>% 
  select(pov_perc, province)  %>% 
  filter(province == "GUAYAS")

province_df %>% 
  select(pov_perc, province)  %>% 
  filter(province == "ESMERALDAS")

## Top three provinces with less poverty: Galapagos, Zona no Delimitada, Pastaza
top_less_pov <- province_df %>%                                      
  arrange(poverty_total) %>% 
  select(province, poverty_total) %>%
  slice(1:3)

top_less_pov

