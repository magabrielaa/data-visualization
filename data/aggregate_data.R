## Aggregate Social Registry Data to create csv files

# Clean environment
rm(list=ls())

# Set working directory
setwd("~/Desktop/Autumn 2022/Data Visualization/Registro Social")

# Load library
library(tidyverse)

# Load data
df <- read_csv("urs_personas_2021abril.csv")

# Delete records with categorization "not poor"
df2 <- df[!(df$tipo_pob_rs18 =="No Pobre"),]
df2 %>% count(tipo_pob_rs18)

# 
unique(df2$s1_id04_des)
a <- df2 %>% count(s1_id04_des)

df2 %>% count(tipo_pob_rs18, sort = TRUE)

df2 %>% group_by(s1_id04_des) %>% tally()

# Counts of moderately and extremely poor by province
pobre_extremo <- df2 %>%
  filter(tipo_pob_rs18 == "Pobre extremo") %>%
  group_by(s1_id04_des) %>%
  summarise(n())

pobre_moderado <- df2 %>%
  filter(tipo_pob_rs18 == "Pobre moderado") %>%
  group_by(s1_id04_des) %>%
  summarise(n())

# Counts of female and male by province
male <- df2 %>% filter(s5_pe03 == 1) %>%
  group_by(s1_id04_des) %>%
  summarise(n())

female <- df2 %>% filter(s5_pe03 == 2) %>%
  group_by(s1_id04_des) %>%
  summarise(n())

# Counts of female and male extremely poor by province
male_epoor <- df2 %>% filter(tipo_pob_rs18 == "Pobre extremo" & s5_pe03 == 1) %>%
  group_by(s1_id04_des) %>%
  summarise(n())

female_epoor <- df2 %>% filter(tipo_pob_rs18 == "Pobre extremo" & s5_pe03 == 2) %>%
  group_by(s1_id04_des) %>%
  summarise(n())

# Counts of female and male moderately poor by province
male_mpoor <- df2 %>% filter(tipo_pob_rs18 == "Pobre moderado" & s5_pe03 == 1) %>%
  group_by(s1_id04_des) %>%
  summarise(n())

female_mpoor <- df2 %>% filter(tipo_pob_rs18 == "Pobre moderado" & s5_pe03 == 2) %>%
  group_by(s1_id04_des) %>%
  summarise(n())

# Counts of extremely poor by age group
age_ext <- df2 %>% filter(tipo_pob_rs18 == "Pobre extremo") %>%
  group_by(s5_pe05) %>%
  summarise(n())

# Counts of moderately poor by age group
age_mod <- df2 %>% filter(tipo_pob_rs18 == "Pobre moderado") %>%
  group_by(s5_pe05) %>%
  summarise(n())

# Counts of poor by sex
age_male <- df2 %>% filter(s5_pe03 == 1) %>%
  group_by(s5_pe05) %>%
  summarise(n())

age_female <- df2 %>% filter(s5_pe03 == 2) %>%
  group_by(s5_pe05) %>%
  summarise(n())

# Counts of poor by ethnicity
ethnicity_ext <- df2 %>% filter(tipo_pob_rs18 == "Pobre extremo") %>%
  group_by(s5_pe15) %>%
  summarise(n())

ethnicity_mod <- df2 %>% filter(tipo_pob_rs18 == "Pobre moderado") %>%
  group_by(s5_pe15) %>%
  summarise(n())

# Counts of access to social security by province
social_sec <- df2 %>% filter(s5_pe16 == 1) %>%
  group_by(s1_id04_des) %>%
  summarise(n())

no_social_sec <- df2 %>% filter(s5_pe16 == 0) %>%
  group_by(s1_id04_des) %>%
  summarise(n())

# Counts of disability by province
disability <- df2 %>% filter(s5_pe18 == 1) %>%
  group_by(s1_id04_des) %>%
  summarise(n())

# Counts of disability by province and level of poverty
disability_ext <- df2 %>% filter(tipo_pob_rs18 == "Pobre extremo" & s5_pe18 == 1) %>%
  group_by(s1_id04_des) %>%
  summarise(n())

disability_mod <- df2 %>% filter(tipo_pob_rs18 == "Pobre moderado" & s5_pe18 == 1) %>%
  group_by(s1_id04_des) %>%
  summarise(n())

# Counts of catastrophic illness by province
cat_illness <- df2 %>% filter(s5_pe21 == 1 | s5_pe21 ==2) %>%
  group_by(s1_id04_des) %>%
  summarise(n())

# Counts of education level by poverty
educ_ext <- df2 %>% filter(tipo_pob_rs18 == "Pobre extremo") %>%
  group_by(s5_pe30) %>%
  summarise(n())

educ_mod <- df2 %>% filter(tipo_pob_rs18 == "Pobre moderado") %>%
  group_by(s5_pe30) %>%
  summarise(n())

# Counts of job type by poverty
job_ext <- df2 %>% filter(tipo_pob_rs18 == "Pobre extremo") %>%
  group_by(s6_ae07) %>%
  summarise(n())

job_mod <- df2 %>% filter(tipo_pob_rs18 == "Pobre moderado") %>%
  group_by(s6_ae07) %>%
  summarise(n())

# Deciles
unique(df$decil)
unique(df2$decil)
df2 %>% count(decil)

deciles <- df %>% filter(tipo_pob_rs18 == "Pobre extremo") %>%
  group_by(decil) %>%
  summarise(n())
